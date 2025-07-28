import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Home from './pages/Home'
import { AdminAuthProvider } from './AdminAuthContext'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'


function App() {

  return (
    <AdminAuthProvider>
      <Router>
        <Nav />
        <div className="tab-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="privacy" element={<Privacy />} />
            <Route path="terms" element={<Terms />} />
          </Routes>
        </div>
      </Router>
    </AdminAuthProvider>
  )
}

export default App
