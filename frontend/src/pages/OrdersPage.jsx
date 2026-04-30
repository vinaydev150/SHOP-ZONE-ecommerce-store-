import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import './OrdersPage.css';

export default function OrdersPage() {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get('/orders');
        setOrders(res.data.data);
      } catch (err) {
        setError('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusStyle = (status) => {
    const styles = {
      PENDING:   { background: '#fff3cd', color: '#856404' },
      CONFIRMED: { background: '#cce5ff', color: '#004085' },
      SHIPPED:   { background: '#d4edda', color: '#155724' },
      DELIVERED: { background: '#d4edda', color: '#155724' },
      CANCELLED: { background: '#f8d7da', color: '#721c24' },
    };
    return styles[status] || { background: '#e2e3e5', color: '#383d41' };
  };

  if (loading) return (
    <div className="container">
      <div className="spinner" />
    </div>
  );

  if (error) return (
    <div className="container">
      <div className="alert alert-error">{error}</div>
    </div>
  );

  if (orders.length === 0) {
    return (
      <div className="container">
        <div className="empty-state">
          <div style={{ fontSize: 64, marginBottom: 16 }}>📦</div>
          <h3>No orders yet</h3>
          <p>Start shopping to see your orders here</p>
          <Link to="/" className="btn-primary">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page container">
      <h1 className="orders-title">Your Orders</h1>
      <p className="orders-subtitle">
        {orders.length} {orders.length === 1 ? 'order' : 'orders'} placed
      </p>

      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-card">

            {/* Order Header */}
            <div className="order-header">
              <div className="order-meta">
                <div className="order-meta-item">
                  <span className="order-meta-label">Order ID</span>
                  <span className="order-meta-value">#{order.id}</span>
                </div>
                <div className="order-meta-item">
                  <span className="order-meta-label">Date</span>
                  <span className="order-meta-value">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day:   'numeric',
                      month: 'long',
                      year:  'numeric',
                    })}
                  </span>
                </div>
                <div className="order-meta-item">
                  <span className="order-meta-label">Total</span>
                  <span className="order-meta-value order-total">
                    ${parseFloat(order.totalAmount).toFixed(2)}
                  </span>
                </div>
                <div className="order-meta-item">
                  <span className="order-meta-label">Status</span>
                  <span
                    className="order-status-badge"
                    style={getStatusStyle(order.status)}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="order-items">
              {order.orderItems.map((item) => (
                <div key={item.id} className="order-item">
                  <img
                    src={item.productImageUrl ||
                      'https://via.placeholder.com/70'}
                    alt={item.productName}
                    className="order-item-img"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/70';
                    }}
                  />
                  <div className="order-item-details">
                    <p className="order-item-name">{item.productName}</p>
                    <p className="order-item-meta">
                      Qty: {item.quantity} ×
                      ${parseFloat(item.priceAtPurchase).toFixed(2)}
                    </p>
                  </div>
                  <span className="order-item-total">
                    ${(item.quantity *
                      parseFloat(item.priceAtPurchase)).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Order Footer */}
            <div className="order-footer">
              <Link to="/" className="btn-secondary">
                Buy Again
              </Link>
              <div className="order-status-track">
                {['PENDING','CONFIRMED','SHIPPED','DELIVERED'].map(
                  (step, i) => {
                    const steps = [
                      'PENDING','CONFIRMED','SHIPPED','DELIVERED'
                    ];
                    const currentIndex = steps.indexOf(order.status);
                    const isDone = i <= currentIndex;
                    const isCancelled = order.status === 'CANCELLED';
                    return (
                      <div
                        key={step}
                        className={`track-step
                          ${isDone && !isCancelled ? 'done' : ''}
                          ${isCancelled ? 'cancelled' : ''}`}
                      >
                        <div className="track-dot" />
                        <span className="track-label">{step}</span>
                      </div>
                    );
                  }
                )}
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}