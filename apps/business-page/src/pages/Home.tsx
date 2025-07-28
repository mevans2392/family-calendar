import './Home.css'
import CommentBox from '../components/CommentBox';
import Footer from '../components/Footer';
import { useEffect, useState } from 'react';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

export default function Home() {
    const [updates, setUpdates] = useState<string[]>([]);

    useEffect(() => {
        const fetchUpdates = async () => {
            const docRef = doc(db, 'publicSettings', 'homepageUpdates');
            const docSnap = await getDoc(docRef);

            if(docSnap.exists()) {
                const data = docSnap.data();

                const messages = ['update1', 'update2', 'update3']
                    .map((key) => data[key])
                    .filter((msg): msg is string => Boolean(msg));

                setUpdates(messages);
            }
        };

        fetchUpdates();
    }, []);

    return (
        <div>
            <div className="wrapper">
                <div className="content-header">
                    <img src="../images/logo.webp" alt="title" />
                </div>

                <div className="content-section">
                    <div className="content">
                        <h5>Welcome to Simplizity.</h5>
                        <p>
                            Whether you're planting the first seeds of independence, building a bustling household, or embracing a slower,
                            wiser season; Simplizity is here to help you organize your life.<br/>
                            Like the Tree of Life, we believe that every branch matters. From solo schedules to shared calendars and long-term
                            goals, Simplizity grows with you. It's your digital canopy of calm; helping you stay grounded, connected, and
                            prepared no matter where you are in life's journey.<br/>
                            Life doesn't have to be chaotic to be full. Simplizity is not about doing more, it's about doing what matters,
                            simply.
                        </p>
                        <p id="price-tag">
                            Simplizity is only $19.99/year. <a href="https://familycalendar-2a3ec.web.app/register">Register </a> today and start your 14 day free trial.
                        </p>
                    </div>
                    <h5>How to:</h5>
                    <div className="videos">
                        <iframe></iframe>
                        <iframe></iframe>
                        <iframe></iframe>
                    </div>
                    <div className="what-next">
                        <h5>What's coming next:</h5>
                        <div className="updates-container">
                            {updates.length > 0 ? (
                                updates.map((msg, index) => (
                                    <div key={index} className="update-message">
                                        {msg}
                                    </div>
                                ))
                            ) : ('')}
                        </div>
                    </div>
                </div>

                <div className="comment-section">
                    <CommentBox />
                </div>
            </div>

            <div className="footer">
                <Footer />
            </div>
        </div>
    );
}
