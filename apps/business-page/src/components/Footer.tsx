import { useState } from 'react'
import { useAdminAuth } from '../AdminAuthContext'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { isAdmin, logout } = useAdminAuth();
    const auth = getAuth();

    const login = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err) {
            console.error('Login failed:', err);
        }
    }

    return (
      <div className="footer">
        <div className="row">
          <div className="col-10">
            <p>Admin Login:</p>
            {isAdmin ? (
                <button className="btn btn-primary" onClick={logout}>Logout</button>
            ) : (
                <div>
                <input
                    className="form-control"
                    style={{width: '150px', height: '30px'}}
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <input
                    className="form-control"
                    style={{width: '150px', height: '30px'}}
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <button className="btn btn-primary" onClick={login}>Login</button>
                </div>
            )}
          </div>
          <div className="col-2" id="links">
            <p>Links:</p>
            <a><Link to="privacy">Privacy Policy</Link></a><br/>
            <a><Link to="terms">Terms of Use</Link></a>
          </div>
        </div>
      </div>
    )

}
