import { inject, Injectable } from '@angular/core'
import { Firestore, collection, collectionData, doc, addDoc, updateDoc, deleteDoc, docData, query, where } from '@angular/fire/firestore'
import { JournalItem } from '../shared/shared-interfaces'
import { Observable } from 'rxjs'
import { FamilyService } from './family.service'

@Injectable({ providedIn: 'root' })
export class JournalService {
    private firestore: Firestore = inject(Firestore);
    private familyService: FamilyService = inject(FamilyService);

    async loadJournalItems(): Promise<Observable<JournalItem[]>>{
        const familyId = await this.familyService.getFamilyId();
        const itemRef = collection(this.firestore, `families/${familyId}/journal`);
        return collectionData(itemRef, { idField: 'id' }) as Observable<JournalItem[]>;
    }

    async getJournalItemById(itemId: string): Promise<Observable<JournalItem>>{
        const familyId = await this.familyService.getFamilyId();
        const itemDoc = doc(this.firestore, `families/${familyId}/journal/${itemId}`);
        return docData(itemDoc, { idField: 'id' }) as Observable<JournalItem>;
    }

    async loadJournalItemsByCategory(categoryId: string): Promise<Observable<JournalItem[]>> {
        const familyId = await this.familyService.getFamilyId();
        const journalRef = collection(this.firestore, `families/${familyId}/journal`);
        const q = query(journalRef, where('categoryIds', 'array-contains', categoryId));
        return collectionData(q, { idField: 'id' }) as Observable<JournalItem[]>;
    }

    async saveJournalItem(journalItem: JournalItem): Promise<string | void> {
        const familyId = await this.familyService.getFamilyId();

        if(journalItem.id) {
            const ref = doc(this.firestore, `families/${familyId}/journal/${journalItem.id}`);
            const { id, ...updateData } = journalItem;
            await updateDoc(ref, updateData as any);
            return journalItem.id;
        } else {
            const { id, ...journalData} = journalItem;
            const ref = collection(this.firestore, `families/${familyId}/journal`);
            const docRef = await addDoc(ref, journalData as any);
            return docRef.id;
        }
    }

    async deleteJournalItem(itemId: string): Promise<void> {
        const familyId = await this.familyService.getFamilyId();
        const journalRef = doc(this.firestore, `families/${familyId}/journal/${itemId}`);
        await deleteDoc(journalRef);
    }
}