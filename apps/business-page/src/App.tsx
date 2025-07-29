import './App.css'
import { Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Home from './pages/Home'
import { AdminAuthProvider } from './AdminAuthContext'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'


function App() {

  return (
    <AdminAuthProvider>
        <Nav />
        <div className="tab-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="privacy" element={<Privacy />} />
            <Route path="terms" element={<Terms />} />
          </Routes>
        </div>
    </AdminAuthProvider>
  )
}

export default App
