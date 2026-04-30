import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../features/cart/cartSlice';
import API from '../api/axios';
import './ProductPage.css';

export default function ProductPage() {
  const { id }       = useParams();
  const dispatch     = useDispatch();
  const navigate     = useNavigate();
  const [product,  setProduct]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');
  const [quantity, setQuantity] = useState(1);
  const [added,    setAdded]    = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/products/${id}`);
        setProduct(res.data.data);
      } catch (err) {
        setError('Product not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      dispatch(addToCart(product));
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
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

  if (!product) return null;

  return (
    <div className="product-page container">

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span onClick={() => navigate('/')} className="breadcrumb-link">
          Home
        </span>
        <span> › </span>
        <span
          onClick={() => navigate(`/?category=${product.category}`)}
          className="breadcrumb-link"
        >
          {product.category}
        </span>
        <span> › </span>
        <span className="breadcrumb-current">{product.name}</span>
      </div>

      <div className="product-detail">

        {/* Left — Image */}
        <div className="product-detail-image">
          <img
            src={product.imageUrl || 'https://via.placeholder.com/500x400'}
            alt={product.name}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/500x400';
            }}
          />
        </div>

        {/* Right — Info */}
        <div className="product-detail-info">
          <p className="product-detail-category">{product.category}</p>
          <h1 className="product-detail-name">{product.name}</h1>

          <div className="product-detail-price">
            ${parseFloat(product.price).toFixed(2)}
          </div>

          <div className="product-detail-divider" />

          <p className="product-detail-description">{product.description}</p>

          <div className="product-detail-divider" />

          {/* Stock status */}
          <div className="stock-status">
            {product.stock > 10 ? (
              <span className="in-stock">✓ In Stock</span>
            ) : product.stock > 0 ? (
              <span className="low-stock-warn">
                ⚠ Only {product.stock} left in stock
              </span>
            ) : (
              <span className="out-of-stock-text">✗ Out of Stock</span>
            )}
          </div>

          {/* Quantity selector */}
          {product.stock > 0 && (
            <div className="quantity-selector">
              <label>Quantity:</label>
              <div className="quantity-controls">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="qty-btn"
                >−</button>
                <span className="qty-display">{quantity}</span>
                <button
                  onClick={() =>
                    setQuantity(q => Math.min(product.stock, q + 1))
                  }
                  className="qty-btn"
                >+</button>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="product-detail-actions">
            <button
              className={`add-to-cart-large ${added ? 'added' : ''}`}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              {added ? '✓ Added to Cart!' : 'Add to Cart'}
            </button>

            <button
              className="buy-now-btn"
              onClick={() => {
                handleAddToCart();
                navigate('/cart');
              }}
              disabled={product.stock === 0}
            >
              Buy Now
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}