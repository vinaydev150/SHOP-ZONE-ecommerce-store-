import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import {
  fetchProducts,
  fetchProductsByCategory,
  fetchCategories,
  searchProducts,
  setSelectedCategory,
} from '../features/products/productSlice';
import ProductCard from '../components/common/ProductCard';
import './HomePage.css';

export default function HomePage() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const searchKeyword = searchParams.get('search') || '';

  const {
    items,
    categories,
    loading,
    error,
    totalPages,
    currentPage,
    selectedCategory,
  } = useSelector((state) => state.products);

  // Load categories once on mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Load products when search/category/page changes
  useEffect(() => {
    if (searchKeyword) {
      dispatch(searchProducts({ keyword: searchKeyword, page: 0 }));
    } else if (selectedCategory) {
      dispatch(fetchProductsByCategory({
        category: selectedCategory, page: 0
      }));
    } else {
      dispatch(fetchProducts({ page: 0 }));
    }
  }, [dispatch, searchKeyword, selectedCategory]);

  const handleCategoryClick = (category) => {
    dispatch(setSelectedCategory(
      category === selectedCategory ? '' : category
    ));
  };

  const handlePageChange = (newPage) => {
    if (selectedCategory) {
      dispatch(fetchProductsByCategory({
        category: selectedCategory, page: newPage
      }));
    } else {
      dispatch(fetchProducts({ page: newPage }));
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="home-page">

      {/* Hero Banner */}
      <div className="hero-banner">
        <div className="container">
          <h1 className="hero-title">Welcome to ShopZone</h1>
          <p className="hero-subtitle">
            Discover amazing products at unbeatable prices
          </p>
          {searchKeyword && (
            <p className="search-info">
              Showing results for: <strong>"{searchKeyword}"</strong>
            </p>
          )}
        </div>
      </div>

      <div className="container home-layout">

        {/* Sidebar — Category Filters */}
        <aside className="category-sidebar">
          <h3 className="sidebar-title">Categories</h3>
          <ul className="category-list">
            <li>
              <button
                className={`category-btn ${!selectedCategory ? 'active' : ''}`}
                onClick={() => dispatch(setSelectedCategory(''))}
              >
                All Products
              </button>
            </li>
            {categories.map((cat) => (
              <li key={cat}>
                <button
                  className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => handleCategoryClick(cat)}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main content */}
        <main className="products-main">

          {/* Header */}
          <div className="products-header">
            <h2 className="products-title">
              {searchKeyword
                ? `Search: "${searchKeyword}"`
                : selectedCategory || 'All Products'}
            </h2>
            <span className="products-count">
              {items.length} products
            </span>
          </div>

          {/* Loading */}
          {loading && <div className="spinner" />}

          {/* Error */}
          {error && (
            <div className="alert alert-error">{error}</div>
          )}

          {/* Empty state */}
          {!loading && !error && items.length === 0 && (
            <div className="empty-state">
              <h3>No products found</h3>
              <p>Try a different search or category</p>
            </div>
          )}

          {/* Product Grid */}
          {!loading && items.length > 0 && (
            <div className="product-grid">
              {items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="page-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
              >
                ← Prev
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  className={`page-btn ${currentPage === i ? 'active' : ''}`}
                  onClick={() => handlePageChange(i)}
                >
                  {i + 1}
                </button>
              ))}

              <button
                className="page-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
              >
                Next →
              </button>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}