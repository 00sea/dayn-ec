import HomePage from './pages/HomePage'
import StorePage from './pages/StorePage'
import ProductDetailPage from './pages/ProductDetailPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/store" element={<StorePage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        {/* Add more routes as you build your application */}
        {/* <Route path="/cart" element={<CartPage />} /> */}
        {/* <Route path="/checkout" element={<CheckoutPage />} /> */}
        {/* <Route path="/account" element={<AccountPage />} /> */}
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App