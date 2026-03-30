import { useState } from "react";
import { resetPassword } from "../../firebase";
import { Link } from "react-router-dom";
import SEO from "../SEO";

const FIREBASE_ERROR_MAP = {
  "auth/user-not-found": "No account found with this email.",
  "auth/invalid-email": "Invalid email address.",
  "auth/too-many-requests": "Too many attempts. Please try again later.",
};

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("Please enter your email.");
      return;
    }

    try {
      setLoading(true);
      await resetPassword(trimmedEmail);
      setSuccess("Reset link sent! Check your email.");
    } catch (err) {
      setError(FIREBASE_ERROR_MAP[err.code] ?? "Could not send reset link. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <SEO title="Reset Password - AiGENThix" description="Reset your AiGENThix account password." noIndex />
      <h1 className="auth-title auth-fade-in">Reset password</h1>

      <p className="auth-subtitle auth-fade-in-delayed">
        Enter your email address, and we'll send you a password reset link.
      </p>

      <form onSubmit={handleSubmit} className="auth-form auth-fade-in-delayed-2">
        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        <input
          type="email"
          placeholder="Email address"
          className="auth-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit" className="auth-btn-mint" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <p className="auth-link">
          Don't need to reset your password?{" "}
          <Link to="/sign-in" className="auth-link-accent">
            Log in.
          </Link>
        </p>
      </form>
    </div>
  );
};

export default ResetPassword;
