import HomePage from './pages/HomePage'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* Add more routes as you build your application */}
        {/* <Route path="/products" element={<ProductsPage />} /> */}
        {/* <Route path="/products/:id" element={<ProductDetailPage />} /> */}
        {/* <Route path="/cart" element={<CartPage />} /> */}
        {/* <Route path="/checkout" element={<CheckoutPage />} /> */}
        {/* <Route path="/account" element={<AccountPage />} /> */}
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App
