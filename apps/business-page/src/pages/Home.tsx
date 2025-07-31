import './Home.css'
import CommentBox from '../components/CommentBox';
import Footer from '../components/Footer';
// import { useEffect, useState } from 'react';
// import { getDoc, doc } from 'firebase/firestore';
// import { db } from '../firebase';

export default function Home() {
    // const [updates, setUpdates] = useState<string[]>([]);

    // useEffect(() => {
    //     const fetchUpdates = async () => {
    //         const docRef = doc(db, 'publicSettings', 'homepageUpdates');
    //         const docSnap = await getDoc(docRef);

    //         if(docSnap.exists()) {
    //             const data = docSnap.data();

    //             const messages = ['update1', 'update2', 'update3']
    //                 .map((key) => data[key])
    //                 .filter((msg): msg is string => Boolean(msg));

    //             setUpdates(messages);
    //         }
    //     };

    //     fetchUpdates();
    // }, []);

    return (
      <div>
        <main className="wrapper">
          <section className="hero-section" id="hero-section">
            <h3>Welcome to SimplizityLife</h3>
            <p></p>
          </section>

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
