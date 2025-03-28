import HomePage from './pages/HomePage'
import StorePage from './pages/StorePage'
import ProductDetailPage from './pages/ProductDetailPage';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import UserProfile from './components/Auth/UserProfile';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/store" element={<StorePage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />} />
          {/* Add more routes as you build your application */}
          {/* <Route path="/cart" element={<CartPage />} /> */}
          {/* <Route path="/checkout" element={<CheckoutPage />} /> */}
          {/* <Route path="/account" element={<AccountPage />} /> */}
          {/* <Route path="*" element={<NotFoundPage />} /> */}

          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/orders" element={<UserProfile />} />
            <Route path="/checkout" element={<UserProfile />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App