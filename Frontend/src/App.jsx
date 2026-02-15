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
import Dashboard from './pages/admin/Dashboard';
import NotAuthorized from './pages/NotAuthorized';
import AuthRoute from './components/AuthRoute';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import ScrollToTop from './components/ScrollToTop';
function App() {

  return (
    <Router>
      <ScrollToTop/>
      <Routes>
        <Route element={<Layout />}>

          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login-signup" element={<Login_Sign_Forms />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/notAuthorized" element={<NotAuthorized />} />
          <Route path="/*" element={<NotFound />} />
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            {/* admin pages  */}
            <Route element={<AuthRoute role='admin' />}>
              <Route path="/admin-dashboard" element={<Dashboard />} />
            </Route>
            {/* seller pages  */}
            <Route element={<AuthRoute role='seller' />}>
              <Route path="/add-product" element={<AddProduct />} />
            </Route>
            {/* customer pages  */}
            <Route element={<AuthRoute role='customer' />}>
              <Route path="/cart" element={<Cart />} />
            </Route>
            {/*  pages for all  */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderDetails />} />
          </Route>

        </Route>
      </Routes>
    </Router>
  )
}

export default App
