import { Injectable, inject } from '@angular/core';
import { Firestore, doc, getDoc, setDoc, updateDoc, onSnapshot, DocumentReference } from '@angular/fire/firestore';
import { MealEntry } from '../shared/shared-interfaces';
import { FamilyMembersService } from './family-members.service';

@Injectable({
  providedIn: 'root'
})
export class MealPlannerService {
    private firestore = inject(Firestore);
    private familyService = inject(FamilyMembersService);

    private async getDayRef(day:string): Promise<DocumentReference> {
        const familyId = await this.familyService.getFamilyId();
        return doc(this.firestore, `families/${familyId}/mealPlanner/${day}`);
    }

    subscribeToDay(day: string, callback: (data: any) => void): void {
        this.getDayRef(day).then(ref => {
            onSnapshot(ref, (snap) => {
                callback(snap.exists() ? snap.data() : {});
            });
        });
    }

    async subscribeToMealPlanner(
        days: string[],
        callback: (data: Record<string, any>) => void
    ): Promise<void> {
        const familyId = await this.familyService.getFamilyId();
        const mealData: Record<string, any> = {};

        for (const day of days) {
        const ref = doc(this.firestore, `families/${familyId}/mealPlanner/${day}`);
        onSnapshot(ref, (snap) => {
            mealData[day] = snap.exists() ? snap.data() : {};
            callback({ ...mealData }); // Send copy to trigger change detection
        });
        }
    }

    async saveMeal(day: string, meal: string, entries: MealEntry[]): Promise<void> {
        const ref = await this.getDayRef(day);
        const payload = { [meal]: entries };
        await setDoc(ref, payload, { merge: true }); // merge keeps other meals on the same day
    }

    async deleteMealEntry(day: string, meal: string, index: number): Promise<void> {
        const ref = await this.getDayRef(day);
        const snapshot = await getDoc(ref);

        if (!snapshot.exists()) return;

        const data = snapshot.data();
        const updated = [...(data[meal] || [])];
        updated.splice(index, 1);

        await setDoc(ref, { [meal]: updated }, { merge: true });
    }
}