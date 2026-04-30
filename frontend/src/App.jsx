import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './components/common/Navbar';

import HomePage     from './pages/HomePage';
import LoginPage    from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductPage  from './pages/ProductPage';
import CartPage     from './pages/CartPage';
import OrdersPage   from './pages/OrdersPage';
import CheckoutPage from './pages/CheckoutPage';

const ProtectedRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="page-content">
        <Routes>
          <Route path="/"             element={<HomePage />} />
          <Route path="/login"        element={<LoginPage />} />
          <Route path="/register"     element={<RegisterPage />} />
          <Route path="/products/:id" element={<ProductPage />} />
          <Route path="/cart"         element={<CartPage />} />
          <Route path="/checkout"     element={
            <ProtectedRoute><CheckoutPage /></ProtectedRoute>
          } />
          <Route path="/orders"       element={
            <ProtectedRoute><OrdersPage /></ProtectedRoute>
          } />
        </Routes>
      </div>
    </div>
  );
}

export default App;