import { useState, useEffect } from 'react'
import { db } from '../firebase'
import {
    collection,
    doc,
    deleteDoc,
    addDoc,
    serverTimestamp,
    query,
    orderBy,
    onSnapshot,
} from 'firebase/firestore'
import type { Comment } from '../types'
import './CommentBox.css'
import { useAdminAuth } from '../AdminAuthContext'

export default function CommentBox() {
    const [familyName, setFamilyName] = useState('');
    const [text, setText] = useState('');
    const [comments, setComments] = useState<Comment[]>([]);
    const { isAdmin } = useAdminAuth();
    const [replyingToId, setReplyingToId] = useState<string | null>(null);

    const rootComments = comments.filter(c => !c.parentId)
    const replies = (parentId: string) => comments.filter(c => c.parentId === parentId);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!text.trim()) return;

        await addDoc(collection(db, 'comments'), {
            familyName: isAdmin ? '' : familyName,
            text,
            timestamp: serverTimestamp(),
            author: isAdmin ? 'admin' : 'user',
            parentId: replyingToId || null,
        });

        setText('');
        setFamilyName('');
        setReplyingToId(null);
    };

    const deleteComment = async (id: string) => {
        try {
            await deleteDoc(doc(db, 'comments', id));
        } catch (err) {
            console.error('Failed to delete comment', err);
        }
    }

    function getDisplayName(comment: Comment): string {
        if(comment.author === 'admin') return 'Mike'

        if(comment.familyName?.trim()) return comment.familyName.trim()
        return 'Anonymous'
    }

    useEffect(() => {
        const q = query(collection(db, 'comments'), orderBy('timestamp', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedComments: Comment[] = snapshot.docs.map((doc) => ({
                id: doc.id,
                familyName: doc.data().familyName || '',
                text: doc.data().text || '',
                timestamp: doc.data().timestamp,
                author: doc.data().author || 'user',
                parentId: doc.data().parentId || null,
            }));
            setComments(fetchedComments);
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className="comment-box">
            <h5>Comments:</h5>
            <form onSubmit={(handleSubmit)}>
                <input
                    type="text"
                    placeholder="Family Name (optional)"
                    className="form-control"
                    value={familyName}
                    onChange={(e) => setFamilyName(e.target.value)}
                />
                <textarea
                    placeholder="How can we improve?"
                    className="form-control"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={6}
                />
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>

            <div className="comment-list">
                <div className="first-comment"> 
                    <div className="admin-comment">
                        <strong>Mike</strong>
                        <p>
                            Please use this comments section to let us know how Simplizity is helping you. If it isn't... we would like to know how we 
                            can improve so that it can better suit your needs. Thank you!!
                        </p>
                        <span className="admin-badge">Mike</span>
                    </div>
                </div>
                {rootComments.map(comment => (
                    <div key={comment.id} className="comment-block">
                        <div className={`comment ${comment.author === 'admin' ? 'admin-comment' : ''}`}>
                            {isAdmin && (
                                <>
                                    <button onClick={() => setReplyingToId(comment.id)}>Reply</button>
                                    <button onClick={() => deleteComment(comment.id)}>Delete</button>
                                </>
                            )}
                            <strong>
                                {getDisplayName(comment)}:
                            </strong>
                            <p>{comment.text}</p>
                            {comment.author === 'admin' && <span className="admin-badge">Mike</span>}
                        </div>

                        {isAdmin && replyingToId === comment.id && (
                            <form onSubmit={handleSubmit}>
                                <textarea
                                    placeholder="Reply..."
                                    value={text}
                                    onChange={e => setText(e.target.value)}
                                    rows={4}
                                />
                                <button type="submit">Post Reply</button>
                            </form>
                        )}

                        <div className="replies">
                            {replies(comment.id).map(reply => (
                                <div key={reply.id} className="comment admin-comment reply">
                                    {isAdmin && (
                                        <button onClick={() => deleteComment(reply.id)}>Delete</button>
                                    )}
                                    <strong>
                                        {getDisplayName(reply)}:
                                    </strong>
                                    <p>{reply.text}</p>
                                    {reply.author === 'admin' && <span className="admin-badge">Admin</span>}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}