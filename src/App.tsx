import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Expertise from './pages/Expertise';
import About from './pages/About';
import Contact from './pages/Contact';
import ScrollToTop from './components/ScrollToTop';
import { RegionCode, isValidRegionCode } from './utils/regionUtils';

const RegionRoute: React.FC<{
  element: React.ReactNode;
  path: string;
}> = ({ element, path }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathParts = location.pathname.split('/');
  const regionCode = pathParts[1];

  React.useEffect(() => {
    if (!regionCode || !isValidRegionCode(regionCode)) {
      // Only redirect if we're not already going to the home page
      if (path !== '/') {
        navigate(`/global-en`, { replace: true });
      }
    }
  }, [regionCode, path, navigate]);

  if (!regionCode || !isValidRegionCode(regionCode)) {
    return null;
  }

  return <>{element}</>;
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/global-en" replace />} />
          <Route path="/:region" element={<RegionRoute element={<Home />} path="/" />} />
          <Route path="/:region/products" element={<RegionRoute element={<Products />} path="/products" />} />
          <Route path="/:region/products/:categorySlug" element={<RegionRoute element={<Products />} path="/products/:categorySlug" />} />
          <Route path="/:region/products/:categorySlug/:subcategorySlug" element={<RegionRoute element={<Products />} path="/products/:categorySlug/:subcategorySlug" />} />
          <Route path="/:region/expertise" element={<RegionRoute element={<Expertise />} path="/expertise" />} />
          <Route path="/:region/about" element={<RegionRoute element={<About />} path="/about" />} />
          <Route path="/:region/contact" element={<RegionRoute element={<Contact />} path="/contact" />} />
          <Route path="*" element={<Navigate to="/global-en" replace />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;