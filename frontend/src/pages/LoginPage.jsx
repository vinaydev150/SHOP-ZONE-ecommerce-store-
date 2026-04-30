import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../features/auth/authSlice';
import './AuthPage.css';

export default function LoginPage() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { loading, error, token } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ email: '', password: '' });

  // If already logged in, redirect home
  useEffect(() => {
    if (token) navigate('/');
  }, [token, navigate]);

  // Clear errors when component unmounts
  useEffect(() => {
    return () => dispatch(clearError());
  }, [dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(form));
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">

        <div className="auth-header">
          <h1 className="auth-logo">🛒 ShopZone</h1>
          <h2 className="auth-title">Sign In</h2>
        </div>

        {error && (
          <div className="alert alert-error">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          <p>New to ShopZone?{' '}
            <Link to="/register" className="auth-link">
              Create account
            </Link>
          </p>
        </div>

        {/* Quick test credentials */}
        <div className="test-credentials">
          <p className="test-title">Test Credentials</p>
          <p>Customer: john@gmail.com / john123</p>
          <p>Admin: admin@store.com / admin123</p>
        </div>

      </div>
    </div>
  );
}