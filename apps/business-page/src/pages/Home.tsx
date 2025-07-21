import './Home.css'
import CommentBox from '../components/CommentBox';
import Footer from '../components/Footer';

export default function Home() {
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
                            When my wife and I had our first child staying organized got messy, literally. Dry-erase boards were a hassle. Bulletin boards got cluttered.
                            Most family planning apps were either too expensive or filled with ads.<br/>
                            As a software engineering student trying to make a big career change, I decided to build a better solution. Something simple, clean and
                            actually useful. I built Simplizity for <em>my</em> family using feedback from my wife and my mother every step of the way.<br/>
                            Simplizity isn't overwhelming and doesn't have the flair of the other family planning apps. It is simple and affordable ($19.99/year) to help 
                            you focus on what really matters: your family.<br/>
                            <a href="https://familycalendar-2a3ec.web.app/register">Register </a> today and start your 14 day free trial.
                        </p>
                    </div>
                    <div className="videos">
                        <iframe></iframe>
                        <iframe></iframe>
                        <iframe></iframe>
                    </div>
                    <div className="what-next">
                        <h5>What's coming next:</h5>
                        <p>📱 Native Android and iOS apps.</p>
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