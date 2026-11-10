
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await API.post("/auth/login", {
        email,
        password
      });

      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");

    } catch (error) {
      setError(
        error.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <section className="login-intro">
        <div className="login-intro-top">
          <div className="login-logo">S</div>
          <span>STOCKFLOW</span>
        </div>

        <div className="login-intro-content">
          <span className="login-eyebrow">
            INVENTORY MANAGEMENT
          </span>

          <h1>
            Keep your
            <br />
            inventory
            <br />
            <span>in order.</span>
          </h1>

          <p>
            A simpler way to manage products, monitor stock
            levels and stay on top of your business inventory.
          </p>
        </div>

        <div className="login-intro-bottom">
          <span>INVENTORY. WITHOUT THE COMPLEXITY.</span>
          <span>STOCKFLOW © 2026</span>
        </div>
      </section>

      <section className="login-form-section">

        <div className="login-form-wrapper">

          <div className="login-mobile-brand">
            <div className="login-logo">S</div>
            <span>STOCKFLOW</span>
          </div>

          <div className="login-heading">
            <span className="login-eyebrow">
              ACCOUNT ACCESS
            </span>

            <h2>Welcome back</h2>

            <p>
              Enter your credentials to access your workspace.
            </p>
          </div>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>

            <div className="login-field">
              <label htmlFor="login-email">
                Email address
              </label>

              <input
                id="login-email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="login-field">
              <label htmlFor="login-password">
                Password
              </label>

              <input
                id="login-password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Sign in"}
            </button>

          </form>

          <div className="login-register">
            <span>New to StockFlow?</span>
            <Link to="/signup">Create an account</Link>
          </div>

          <div className="login-security-note">
            Your workspace is accessible only with your account credentials.
          </div>

        </div>

      </section>

    </div>
  );
};

export default Login;
