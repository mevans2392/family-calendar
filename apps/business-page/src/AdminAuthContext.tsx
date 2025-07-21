import {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode
} from 'react'
import { getAuth, onAuthStateChanged, signOut, type User } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { db } from './firebase'

interface AdminContextType {
    user: User | null;
    isAdmin: boolean;
    logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminContextType | null>(null);

export function useAdminAuth() {
    const context = useContext(AdminAuthContext);
    if(!context) {
        throw new Error('useAdminAuth must be used within AdminAuthProvider');
    }
    return context
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const auth = getAuth();

        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if(currentUser) {
                const adminDoc = await getDoc(doc(db, 'admin', 'main'));
                const adminUid = adminDoc.exists() ? adminDoc.data().uid : null;

                if(currentUser.uid === adminUid) {
                    setUser(currentUser);
                    setIsAdmin(true);
                } else {
                    await signOut(auth);
                    setUser(null);
                    setIsAdmin(false);
                }
            } else {
                setUser(null);
                setIsAdmin(false);
            }
        })

        return () => unsubscribe();
    }, [])

    const logout = async () => {
        await signOut(getAuth());
        setUser(null);
        setIsAdmin(false)
    }

    return (
        <AdminAuthContext.Provider value={{ user, isAdmin, logout }}>
            {children}
        </AdminAuthContext.Provider>
    )
}