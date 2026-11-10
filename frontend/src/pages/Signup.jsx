
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    organizationName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await API.post(
        "/auth/signup",
        formData
      );

      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");

    } catch (error) {
      setError(
        error.response?.data?.message || "Signup failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">

      <section className="signup-intro">

        <div className="signup-intro-top">
          <div className="signup-logo">S</div>
          <span>STOCKFLOW</span>
        </div>

        <div className="signup-intro-content">

          <span className="signup-eyebrow">
            YOUR BUSINESS WORKSPACE
          </span>

          <h1>
            Start with
            <br />
            a clearer view
            <br />
            <span>of your stock.</span>
          </h1>

          <p>
            Bring your products and stock information
            together in one organized workspace.
          </p>

          <div className="signup-feature-list">
            <div className="signup-feature">
              <span className="signup-feature-number">01</span>
              <span>Organize your products</span>
            </div>

            <div className="signup-feature">
              <span className="signup-feature-number">02</span>
              <span>Track available stock</span>
            </div>

            <div className="signup-feature">
              <span className="signup-feature-number">03</span>
              <span>Identify low-stock items</span>
            </div>
          </div>

        </div>

        <div className="signup-intro-bottom">
          <span>INVENTORY. WITHOUT THE COMPLEXITY.</span>
          <span>STOCKFLOW © 2026</span>
        </div>

      </section>

      <section className="signup-form-section">

        <div className="signup-form-wrapper">

          <div className="signup-mobile-brand">
            <div className="signup-logo">S</div>
            <span>STOCKFLOW</span>
          </div>

          <div className="signup-heading">

            <span className="signup-eyebrow">
              GET STARTED
            </span>

            <h2>Create your workspace</h2>

            <p>
              Enter your details to set up your StockFlow account.
            </p>

          </div>

          {error && (
            <div className="signup-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup}>

            <div className="signup-field">
              <label htmlFor="organizationName">
                Organization name
              </label>

              <input
                id="organizationName"
                type="text"
                name="organizationName"
                placeholder="Enter your business name"
                value={formData.organizationName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="signup-field">
              <label htmlFor="signup-email">
                Email address
              </label>

              <input
                id="signup-email"
                type="email"
                name="email"
                placeholder="name@company.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="signup-field">
              <label htmlFor="signup-password">
                Password
              </label>

              <input
                id="signup-password"
                type="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                minLength={6}
                required
              />
              <small>Use at least 6 characters.</small>
            </div>

            <div className="signup-field">
              <label htmlFor="confirmPassword">
                Confirm password
              </label>

              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder="Enter your password again"
                value={formData.confirmPassword}
                onChange={handleChange}
                minLength={6}
                required
              />
            </div>

            <button
              type="submit"
              className="signup-submit"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create account"}
            </button>

          </form>

          <div className="signup-login">
            <span>Already have an account?</span>
            <Link to="/login">Sign in</Link>
          </div>

          <div className="signup-security-note">
            Your workspace will be created when you register.
          </div>

        </div>

      </section>

    </div>
  );
};

export default Signup;
