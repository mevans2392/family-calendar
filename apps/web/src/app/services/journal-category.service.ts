import { inject, Injectable } from '@angular/core'
import { Firestore, collection, collectionData, doc, addDoc, updateDoc, deleteDoc, docData } from '@angular/fire/firestore'
import { JournalCategory } from '../shared/shared-interfaces'
import { Observable } from 'rxjs'
import { FamilyService } from './family.service'

@Injectable({ providedIn: 'root' })
export class JournalCategoryService {
    private firestore: Firestore = inject(Firestore);
    private familyService: FamilyService = inject(FamilyService);

    async loadCategories(): Promise<Observable<JournalCategory[]>> {
        const familyId = await this.familyService.getFamilyId();
        const catRef = collection(this.firestore, `families/${familyId}/journalCategories`);
        return collectionData(catRef, { idField: 'id' }) as Observable<JournalCategory[]>;
    }

    async getCategoryById(categoryId: string): Promise<Observable<JournalCategory>> {
        const familyId = await this.familyService.getFamilyId();
        const catDoc = doc(this.firestore, `families/${familyId}/journalCategories/${categoryId}`);
        return docData(catDoc, { idField: 'id' }) as Observable<JournalCategory>;
    }

    async saveCategory(category: JournalCategory): Promise<string | void> {
        const familyId = await this.familyService.getFamilyId();

        if(category.id) {
            const ref = doc(this.firestore, `families/${familyId}/journalCategories/${category.id}`);
            const { id, ...updateData } = category;
            await updateDoc(ref, updateData as any);
        } else {
            const { id, ...categoryData } = category;
            const ref = collection(this.firestore, `families/${familyId}/journalCategories`);
            const docRef = await addDoc(ref, categoryData as any);
            return docRef.id;
        }
    }

    async deleteCategory(categoryId: string): Promise<void> {
        const familyId = await this.familyService.getFamilyId();
        const catRef = doc(this.firestore, `families/${familyId}/journalCategories/${categoryId}`);
        await deleteDoc(catRef);
    }
}