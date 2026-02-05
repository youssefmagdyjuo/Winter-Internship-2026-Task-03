import './App.css'
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import Home from './pages/Home';
import Login_Sign_Forms from './pages/Login_Sign_Forms';
import Layout from './pages/Layout';
import About from './pages/About';
import Products from './pages/Products';
import Contact from './pages/Contact';
import ProtectedRoute from './components/ProtectedRoute';
import AddProduct from './pages/AddProduct';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
function App() {

  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>

          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login-signup" element={<Login_Sign_Forms />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderDetails />} />
          </Route>

        </Route>
      </Routes>
    </Router>
  )
}

export default App
