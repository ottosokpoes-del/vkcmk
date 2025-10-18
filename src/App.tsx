import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import CarDetails from './pages/CarDetails';
import Favorites from './pages/Favorites';
import AdminDashboard from './pages/AdminDashboard';
import EditCar from './pages/EditCar';
import AddCar from './pages/AddCar';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import UserLogin from './pages/UserLogin';
import Register from './pages/Register';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import NotFound from './pages/NotFound';
import { UnauthorizedPage } from './components/ProtectedRoute';
import { SecurityProvider, HTTPSRedirect, SecurityMonitor } from './components/SecurityProvider';
import { withSecurity } from './components/withSecurity';

function App() {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <SecurityProvider>
      <HTTPSRedirect />
      <SecurityMonitor />
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/car/:id" element={<CarDetails />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/add" element={<AddCar />} />
            <Route path="/admin/edit/:id" element={<EditCar />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/user-login" element={<UserLogin />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </SecurityProvider>
  );
}

export default withSecurity(App);
