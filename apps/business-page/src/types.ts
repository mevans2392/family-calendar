import { Timestamp } from 'firebase/firestore';

export interface Comment {
    id: string;
    familyName: string;
    text: string;
    timestamp: Timestamp;
    author?: 'admin' | 'user'
    parentId?: string | null
}

export interface Update {
    id: string;
    title: string;
    text: string;
}