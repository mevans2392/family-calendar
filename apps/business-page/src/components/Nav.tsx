import { Link } from 'react-router-dom'
import './Nav.css'
import { useState } from 'react';

export default function Nav() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="navbar">
        <div className="nav-container">
          <div className="brand">
            <Link to="/"><img src="/images/logo.webp" /></Link>
          </div>



          {/* menu links */}
          <ul className={`nav-links ${isOpen ? 'open' : ''}`}>
            <li><Link to="/">Home</Link></li>
            <li><Link to="features">Features</Link></li>
          </ul>

          <button className="btn btn-outline-secondary register-btn"><a href="https://calendar.simplizitylife.com/register">Try the App</a></button>

          {/* toggle menu */}
          <button
            className="hamburger"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            ☰
          </button>
        </div>

      </div>

    );
}
