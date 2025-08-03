import './App.css'
import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Nav from './components/Nav'
import Home from './pages/Home'
import { AdminAuthProvider } from './AdminAuthContext'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Features from './pages/Features'
import 'bootstrap-icons/font/bootstrap-icons.css';


function App() {

  function AnalyticsListener() {
    const location = useLocation();

    useEffect(() => {
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'page_view', {
          page_path: location.pathname,
          page_title: document.title,
        });
      }
    }, [location]);

    return null;
  }

  return (
    <AdminAuthProvider>
        <nav className="sticky-nav">
          <Nav />
        </nav>

        <AnalyticsListener />
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="privacy" element={<Privacy />} />
            <Route path="terms" element={<Terms />} />
            <Route path="features" element={<Features />} />
          </Routes>
        </div>
    </AdminAuthProvider>
  )
}

export default App
