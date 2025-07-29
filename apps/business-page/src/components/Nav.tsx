import { Link, useLocation } from 'react-router-dom'
import './Nav.css'

export default function Nav() {
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="tab-container">
            <div className={`tab ${isActive('/') ? 'active' : ''}`}>
                <button className={`button ${isActive('/') ? 'active' : ''}`}>
                    <Link to="/">Home</Link>
                </button>
            </div>
            <div className={`tab ${isActive('/features') ? 'active' : ''}`}>
                <button className={`button ${isActive('/features') ? 'active' : ''}`}>
                    <Link to="features">Features</Link>
                </button>
            </div>
            <div className="tab">
                <button className="button"><a href="https://familycalendar-2a3ec.web.app/login">Calendar</a></button>
            </div>
        </div>
    );
}
