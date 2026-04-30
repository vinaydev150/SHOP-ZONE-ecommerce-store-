import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../features/cart/cartSlice';
import API from '../api/axios';
import './CheckoutPage.css';

export default function CheckoutPage() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { items } = useSelector((state) => state.cart);
  const { user }  = useSelector((state) => state.auth);

  const [loading, setLoading]   = useState(false);
  const [error,   setError]     = useState('');
  const [form,    setForm]      = useState({
    fullName: user?.name || '',
    email:    user?.email || '',
    address:  '',
    city:     '',
    zip:      '',
    phone:    '',
  });

  const subtotal = items.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.quantity, 0
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Build order request matching our backend DTO
      const orderRequest = {
        items: items.map(item => ({
          productId: item.id,
          quantity:  item.quantity,
        })),
      };

      await API.post('/orders', orderRequest);

      // Success — clear cart and go to orders page
      dispatch(clearCart());
      navigate('/orders');

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="checkout-page container">
      <h1 className="checkout-title">Checkout</h1>

      <div className="checkout-layout">

        {/* Left — Shipping Form */}
        <div className="checkout-form-section">
          <div className="checkout-card">
            <h2 className="checkout-section-title">
              📦 Shipping Information
            </h2>

            {error && (
              <div className="alert alert-error">{error}</div>
            )}

            <form onSubmit={handlePlaceOrder}>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  required
                />
              </div>

              <div className="form-group">
                <label>Street Address</label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="123 Main Street, Apt 4B"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="Bengaluru"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>ZIP / Postal Code</label>
                  <input
                    type="text"
                    name="zip"
                    value={form.zip}
                    onChange={handleChange}
                    placeholder="560001"
                    required
                  />
                </div>
              </div>

              {/* Payment section */}
              <div className="checkout-card payment-section">
                <h2 className="checkout-section-title">
                  💳 Payment Method
                </h2>
                <div className="payment-options">
                  <label className="payment-option selected">
                    <input
                      type="radio"
                      name="payment"
                      defaultChecked
                      readOnly
                    />
                    <span className="payment-icon">💵</span>
                    <div>
                      <p className="payment-label">Cash on Delivery</p>
                      <p className="payment-sub">Pay when you receive</p>
                    </div>
                  </label>

                  <label className="payment-option disabled">
                    <input type="radio" name="payment" disabled />
                    <span className="payment-icon">💳</span>
                    <div>
                      <p className="payment-label">Credit / Debit Card</p>
                      <p className="payment-sub">Coming soon</p>
                    </div>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="place-order-btn"
                disabled={loading}
              >
                {loading ? 'Placing Order...' : `Place Order · $${subtotal.toFixed(2)}`}
              </button>

            </form>
          </div>
        </div>

        {/* Right — Order Summary */}
        <div className="checkout-summary">
          <div className="checkout-card">
            <h2 className="checkout-section-title">🧾 Order Summary</h2>

            <div className="checkout-items">
              {items.map((item) => (
                <div key={item.id} className="checkout-item">
                  <img
                    src={item.imageUrl || 'https://via.placeholder.com/60'}
                    alt={item.name}
                    className="checkout-item-img"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/60';
                    }}
                  />
                  <div className="checkout-item-info">
                    <p className="checkout-item-name">{item.name}</p>
                    <p className="checkout-item-qty">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="checkout-item-price">
                    ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="checkout-totals">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span className="free-shipping">FREE</span>
              </div>
              <div className="summary-row">
                <span>Tax</span>
                <span>$0.00</span>
              </div>
              <div className="summary-divider" />
              <div className="summary-row summary-total">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}