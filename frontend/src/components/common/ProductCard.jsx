import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../features/cart/cartSlice';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();

  const handleAddToCart = (e) => {
    e.preventDefault(); // prevent navigating to product page
    dispatch(addToCart(product));
  };

  return (
    <Link to={`/products/${product.id}`} className="product-card">
      <div className="product-card-image">
        <img
          src={product.imageUrl || 'https://via.placeholder.com/300x200'}
          alt={product.name}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200';
          }}
        />
        {product.stock === 0 && (
          <div className="out-of-stock-overlay">Out of Stock</div>
        )}
      </div>

      <div className="product-card-body">
        <p className="product-category">{product.category}</p>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>

        <div className="product-card-footer">
          <span className="product-price">
            ${parseFloat(product.price).toFixed(2)}
          </span>
          <button
            className="add-to-cart-btn"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>

        {product.stock > 0 && product.stock <= 10 && (
          <p className="low-stock">Only {product.stock} left!</p>
        )}
      </div>
    </Link>
  );
}