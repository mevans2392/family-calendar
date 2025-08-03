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
        <main className="wrapper">
          <section className="hero-section" id="hero-section">
            <div className="words">
              <h5>Your Life. Your Roots. All in One Place.</h5>
              <h6>Simple schedule, meal, and chore tracker</h6>
              <button className="btn btn-primary"><a href="https://calendar.simplizitylife.com/register">Start Your Free Trial</a></button>
              <p>Works on any device with a web browser!</p>
            </div>

            <div className="picture">
              <img src="/images/month-events.webp" alt="calendar"/>
            </div>
          </section>

          <div className="updates">
            <p>What's coming next:</p>
            <ul>
              {updates.map((update, index) => (
                <li key={index}>{update}</li>
              ))}
            </ul>
          </div>

          <section className="comment-section" id="comment-section">
            <CommentBox />
          </section>
        </main>

        <footer className="footer">
          <Footer />
        </footer>
      </div>
    );
}
