import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { clearCart } from '../../features/cart/cartSlice';
import './Navbar.css';

export default function Navbar() {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const { user }   = useSelector((state) => state.auth);
  const { items }  = useSelector((state) => state.cart);

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner container">

        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-text">🛒 ShopZone</span>
        </Link>

        {/* Search bar */}
        <div className="navbar-search">
          <input
            type="text"
            placeholder="Search products..."
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.target.value.trim()) {
                navigate(`/?search=${e.target.value.trim()}`);
              }
            }}
          />
          <button className="search-btn">🔍</button>
        </div>

        {/* Right side */}
        <div className="navbar-right">

          {user ? (
            <>
              <div className="navbar-user">
                <span className="user-greeting">
                  Hello, {user.name?.split(' ')[0]}
                </span>
                <button
                  className="navbar-link"
                  onClick={handleLogout}
                >
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <Link to="/login" className="navbar-link">
              Sign In
            </Link>
          )}

          <Link to="/orders" className="navbar-link">
            Orders
          </Link>

          <Link to="/cart" className="navbar-cart">
            <span className="cart-icon">🛒</span>
            <span className="cart-label">Cart</span>
            {cartCount > 0 && (
              <span className="badge">{cartCount}</span>
            )}
          </Link>

        </div>
      </div>
    </nav>
  );
}