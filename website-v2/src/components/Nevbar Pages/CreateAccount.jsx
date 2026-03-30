import { useState } from "react";
import { registerUser, googleSignIn } from "../../firebase";
import { useNavigate, Link, Navigate } from "react-router-dom";
import SEO from "../SEO";
import { useAuth } from "../../context/AuthContext";

const FIREBASE_ERROR_MAP = {
  "auth/email-already-in-use": "This email is already registered. Please log in instead.",
  "auth/invalid-email": "The email address is invalid.",
  "auth/weak-password": "Password is too weak. Must be at least 6 characters.",
  "auth/network-request-failed": "Network error. Check your internet connection.",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CreateAccount = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (user) return <Navigate to="/my-account" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const trimmedEmail = email.trim();
    const trimmedFirst = firstName.trim();

    if (!trimmedFirst || !trimmedEmail || !password) {
      setError("First name, email and password are required.");
      return;
    }

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setError("Enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      const fullName = `${trimmedFirst} ${lastName.trim()}`.trim();
      await registerUser(trimmedEmail, password, fullName);
      navigate("/my-account");
    } catch (err) {
      setError(FIREBASE_ERROR_MAP[err.code] ?? "Account could not be created. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError("");
    try {
      setLoading(true);
      await googleSignIn();
      navigate("/my-account");
    } catch {
      setError("Google signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <SEO title="Create Account - AiGENThix" description="Create your AiGENThix account." noIndex />

      <h1 className="auth-title auth-fade-in">Create Account</h1>

      <p className="auth-subtitle auth-fade-in-delayed">
        By creating an account, you may receive newsletters or promotions.
      </p>

      <form onSubmit={handleSubmit} className="auth-form auth-fade-in-delayed-2">
        <button
          type="button"
          className="auth-btn-google"
          onClick={handleGoogleSignUp}
          disabled={loading}
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            width="20"
            height="20"
          />
          Create Account with Google
        </button>

        {error && <div className="auth-error">{error}</div>}

        <input
          type="text"
          placeholder="First name"
          className="auth-input"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Last name"
          className="auth-input"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

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
          minLength={6}
        />

        <button type="submit" className="auth-btn-mint" disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
        </button>

        <p className="auth-link">
          Already have an account?{" "}
          <Link to="/sign-in" className="auth-link-accent">
            Log in.
          </Link>
        </p>
      </form>
    </div>
  );
};

export default CreateAccount;
