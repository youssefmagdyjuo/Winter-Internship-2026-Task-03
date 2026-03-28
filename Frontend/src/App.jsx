import './App.css'
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import Home from './pages/Home';
import Login_Sign_Forms from './pages/Login_Sign_Forms';
import Layout from './pages/Layout';
import About from './pages/About';
import Contact from './pages/Contact';
import ProtectedRoute from './components/ProtectedRoute';
import Cart from './pages/Cart';
import OrderDetails from './pages/OrderDetails';
import Dashboard from './pages/admin/Dashboard';
import NotAuthorized from './pages/NotAuthorized';
import AuthRoute from './components/AuthRoute';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import ScrollToTop from './components/ScrollToTop';
import Services from './pages/Services';
import ServiceDetails from './pages/ServiceDetails';
import AddService from './pages/AddService';
import Bookings from './pages/Bookings';
function App() {

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>

          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login-signup" element={<Login_Sign_Forms />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:id" element={<ServiceDetails />} />
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
            <Route element={<AuthRoute role='provider' />}>
              <Route path="/add-service" element={<AddService />} />
            </Route>
            {/* customer pages  */}
            <Route element={<AuthRoute role='customer' />}>
              <Route path="/cart" element={<Cart />} />
            </Route>
            {/*  pages for all  */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/bookings" element={<Bookings/>} />
            <Route path="/orders/:id" element={<OrderDetails />} />
          </Route>

        </Route>
      </Routes>
    </Router>
  )
}

export default App
