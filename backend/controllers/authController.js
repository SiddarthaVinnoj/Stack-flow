import User from "../models/User.js";
import Organization from "../models/Organization.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export const signup = async (req, res) => {
  let organization;

  try {
    const {
      email,
      password,
      confirmPassword,
      organizationName
    } = req.body;

    if (!email || !password || !confirmPassword || !organizationName) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must contain at least 6 characters"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(normalizedEmail)) {
      return res.status(400).json({
        message: "Enter a valid email address"
      });
    }

    const existingUser = await User.findOne({
      email: normalizedEmail
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    organization = await Organization.create({
      name: organizationName.trim()
    });

    // Link user to the organization.
    const user = await User.create({
      email: normalizedEmail,
      password: hashedPassword,
      organizationId: organization._id
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        organizationId: user.organizationId,
        organizationName: organization.name
      }
    });

  } catch (error) {
    if (organization) {
      await Organization.findByIdAndDelete(organization._id);
    }

    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email already registered"
      });
    }

    return res.status(500).json({
      message: "Signup failed",
      error: error.message
    });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase()
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        organizationId: user.organizationId
      }
    });

  } catch (error) {
    return res.status(500).json({
      message: "Login failed",
      error: error.message
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const organization = await Organization.findById(
      req.user.organizationId
    );

    return res.status(200).json({
      user: {
        id: req.user._id,
        email: req.user.email
      },
      organization
    });

  } catch (error) {
    return res.status(500).json({
      message: "Unable to fetch user details"
    });
  }
};