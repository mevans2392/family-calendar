import { useState } from 'react'
import { useAdminAuth } from '../AdminAuthContext'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

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
        <footer>
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
        </footer>
    )

}