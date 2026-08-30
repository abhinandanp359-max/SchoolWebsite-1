import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LogIn, CircleAlert, Eye, EyeOff } from "lucide-react";
import useAuth from "../../hooks/useAuth";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username, password);
      // Return to the page the admin originally requested (e.g. an enquiry
      // deep link from a notification email), otherwise the dashboard.
      navigate(location.state?.from?.pathname || "/admin", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ivory px-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-[url('/images/pattern/subtle-dots.png')] opacity-20 mix-blend-overlay"></div>
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary rounded-full blur-[100px] opacity-10"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-secondary rounded-full blur-[100px] opacity-20"></div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8 space-y-8 relative z-10">
        <div className="flex flex-col items-center gap-3">
          <img src="/images/branding/logo.webp" alt="School Logo" className="h-24 w-24 object-contain mb-2" />
          <h1 className="text-2xl font-bold text-primary font-heading uppercase tracking-wide">Admin Panel</h1>
          <p className="text-sm font-semibold text-secondary uppercase tracking-widest">Mount Carmel School</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            <CircleAlert size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-warm-gray mb-1.5">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition text-charcoal bg-gray-50"
              placeholder="Enter username"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-warm-gray mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition text-charcoal bg-gray-50"
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-warm-gray hover:text-primary transition-colors focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark disabled:bg-primary/60 text-white font-bold tracking-wide uppercase py-3.5 rounded-lg transition shadow-md cursor-pointer mt-4"
          >
            <LogIn size={18} />
            {loading ? "Signing in..." : "Secure Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
