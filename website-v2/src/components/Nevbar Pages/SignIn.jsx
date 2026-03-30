import { useState } from "react";
import { loginUser, googleSignIn } from "../../firebase";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import SEO from "../SEO";

const FIREBASE_ERROR_MAP = {
  "auth/user-not-found": "No account found with this email.",
  "auth/wrong-password": "Incorrect password. Please try again.",
  "auth/invalid-email": "Invalid email format.",
  "auth/too-many-requests": "Too many attempts. Please try again later.",
  "auth/invalid-credential": "Invalid credentials. Check email and password.",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SignIn = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (user) return <Navigate to="/my-account" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setError("Email and password are required.");
      return;
    }

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setError("Enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      await loginUser(trimmedEmail, password);
      navigate("/my-account");
    } catch (err) {
      setError(FIREBASE_ERROR_MAP[err.code] ?? "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    try {
      setLoading(true);
      await googleSignIn();
      navigate("/my-account");
    } catch {
      setError("Google login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <SEO title="Sign In - AiGENThix" description="Sign in to your AiGENThix account." noIndex />
      <h1 className="auth-title auth-fade-in">Account log in</h1>

      <p className="auth-subtitle auth-fade-in-delayed">
        Log in to your account to access your profile, history, and any private
        pages you've been granted access to.
      </p>

      <form onSubmit={handleSubmit} className="auth-form auth-fade-in-delayed-2">
        <button
          type="button"
          className="auth-btn-google"
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            width="20"
            height="20"
          />
          Login with Google
        </button>

        {error && <div className="auth-error">{error}</div>}

        <input
          type="email"
          placeholder="Email"
          className="auth-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="auth-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="auth-btn-primary" disabled={loading}>
          {loading ? "Logging in..." : "Log In"}
        </button>

        <Link to="/reset-password" className="auth-link mb-10">
          Reset password
        </Link>

        <p className="auth-link">
          Not a member?{" "}
          <Link to="/create-account" className="auth-link-accent">
            Create account.
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignIn;
