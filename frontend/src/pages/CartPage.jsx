import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  removeFromCart,
  updateQuantity,
  clearCart,
} from '../features/cart/cartSlice';
import './CartPage.css';

export default function CartPage() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { items } = useSelector((state) => state.cart);
  const { token } = useSelector((state) => state.auth);

  const subtotal = items.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.quantity, 0
  );
  const itemCount = items.reduce(
    (sum, item) => sum + item.quantity, 0
  );

  const handleCheckout = () => {
    if (!token) {
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <div className="container">
        <div className="empty-state">
          <div className="empty-cart-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Add some products to get started</p>
          <Link to="/" className="btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page container">
      <h1 className="cart-title">
        Shopping Cart
        <span className="cart-title-count">
          ({itemCount} {itemCount === 1 ? 'item' : 'items'})
        </span>
      </h1>

      <div className="cart-layout">

        {/* Cart Items */}
        <div className="cart-items">

          {/* Header row */}
          <div className="cart-items-header">
            <span>Product</span>
            <span>Price</span>
            <span>Quantity</span>
            <span>Total</span>
            <span></span>
          </div>

          {items.map((item) => (
            <div key={item.id} className="cart-item">

              {/* Product info */}
              <div className="cart-item-product">
                <img
                  src={item.imageUrl || 'https://via.placeholder.com/80'}
                  alt={item.name}
                  className="cart-item-image"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/80';
                  }}
                />
                <div className="cart-item-details">
                  <Link
                    to={`/products/${item.id}`}
                    className="cart-item-name"
                  >
                    {item.name}
                  </Link>
                  <span className="cart-item-category">
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="cart-item-price">
                ${parseFloat(item.price).toFixed(2)}
              </div>

              {/* Quantity */}
              <div className="cart-item-qty">
                <div className="quantity-controls">
                  <button
                    className="qty-btn"
                    onClick={() => dispatch(updateQuantity({
                      id: item.id,
                      quantity: item.quantity - 1
                    }))}
                  >−</button>
                  <span className="qty-display">{item.quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => dispatch(updateQuantity({
                      id: item.id,
                      quantity: item.quantity + 1
                    }))}
                  >+</button>
                </div>
              </div>

              {/* Item total */}
              <div className="cart-item-total">
                ${(parseFloat(item.price) * item.quantity).toFixed(2)}
              </div>

              {/* Remove */}
              <button
                className="cart-item-remove"
                onClick={() => dispatch(removeFromCart(item.id))}
              >
                ✕
              </button>

            </div>
          ))}

          {/* Clear cart */}
          <div className="cart-clear-row">
            <button
              className="btn-secondary"
              onClick={() => dispatch(clearCart())}
            >
              Clear Cart
            </button>
            <Link to="/" className="btn-secondary">
              Continue Shopping
            </Link>
          </div>

        </div>

        {/* Order Summary */}
        <div className="cart-summary">
          <h3 className="summary-title">Order Summary</h3>

          <div className="summary-row">
            <span>Subtotal ({itemCount} items)</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span className="free-shipping">FREE</span>
          </div>
          <div className="summary-divider" />
          <div className="summary-row summary-total">
            <span>Order Total</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          <button
            className="checkout-btn"
            onClick={handleCheckout}
          >
            Proceed to Checkout
          </button>

          {!token && (
            <p className="signin-note">
              You'll need to sign in to complete your order
            </p>
          )}
        </div>

      </div>
    </div>
  );
}