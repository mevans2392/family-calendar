import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Home from './pages/Home'
import { AdminAuthProvider } from './AdminAuthContext'


function App() {

  return (
    <AdminAuthProvider>
      <Router>
        <Nav />
        <div className="tab-content">
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
      </Router>
    </AdminAuthProvider>
  )
}

export default App
