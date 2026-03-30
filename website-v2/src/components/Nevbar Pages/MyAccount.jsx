import { Link } from "react-router-dom";
import SEO from "../SEO";
import { useAuth } from "../../context/AuthContext";

const MyAccount = () => {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg">
        Loading account...
      </div>
    );
  }

  const isPasswordUser = user?.providerData?.[0]?.providerId === "password";

  return (
    <>
      <SEO
        title="My Account"
        description="Manage your account settings and preferences at AiGENThix."
        noIndex
      />

      <div className="auth-container">
        <div className="w-full max-w-[600px] auth-fade-in-delayed">
          <h1 className="auth-title text-center">My Account</h1>

          <p className="auth-subtitle mx-auto">
            Manage your account settings and preferences
          </p>

          <div className="bg-white border border-gray-300 rounded-md p-8 shadow-sm">
            <div className="mb-8">
              <h3 className="text-lg font-bold text-[#1a1a1a] mb-2">
                Profile Information
              </h3>
              <p className="text-gray-500 mb-1">
                <strong>Name:</strong> {user?.displayName || "User"}
              </p>
              <p className="text-gray-500 mb-1">
                <strong>Email:</strong> {user?.email}
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-bold text-[#1a1a1a] mb-2">
                Account Settings
              </h3>

              {isPasswordUser && (
                <Link to="/reset-password">
                  <button className="auth-btn-primary mr-2 mb-2 text-sm px-5 py-2.5 rounded-md">
                    Change Password
                  </button>
                </Link>
              )}

              <button
                onClick={logout}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold text-sm px-5 py-2.5 rounded-md uppercase cursor-pointer mb-2 transition-colors"
              >
                Logout
              </button>
            </div>

            <div className="text-center pt-5 border-t border-gray-200">
              <Link
                to="/"
                className="text-[#2D4DE8] font-bold text-sm no-underline hover:underline"
              >
                &larr; Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyAccount;
