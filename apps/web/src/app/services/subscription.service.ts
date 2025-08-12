import { Injectable, inject } from '@angular/core';
import { Firestore, doc, docData } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Family } from '../shared/shared-interfaces';
import { FamilyService } from './family.service';

@Injectable({
    providedIn: 'root',
})
export class SubscriptionService {
    private firestore = inject(Firestore);
    private auth = inject(Auth);
    private familyData$ = new BehaviorSubject<Family | null>(null);
    private familyService = inject(FamilyService);

    constructor() {this.init();}

    private init() {
        const familyId = localStorage.getItem('familyId');

        if (familyId) {
            const familyDocRef = doc(this.firestore, `families/${familyId}`);
            docData(familyDocRef).subscribe(data => {
            if (data) {
                this.familyData$.next(data as Family);
            }
            }, error => {
            console.error('❌ Failed to load family data:', error);
            });
        } else {
            console.warn('⚠️ No familyId found in localStorage');
            this.familyData$.next(null);
        }
    }

    getFamilyData(): Observable<Family | null> {
        return this.familyData$.asObservable();
    }

    // convenience streams
    get subStatus$(): Observable<Family['subStatus'] | undefined> {
        return this.familyData$.pipe(map(family => family?.subStatus));
    }

    get planType$(): Observable<Family['planType'] | undefined> {
        return this.familyData$.pipe(map(family => family?.planType));
    }

    getTrialDaysLeft(trialStartDate: string | Date): number {
        const start = new Date(trialStartDate);
        const now = new Date();
        const diff = now.getTime() - start.getTime();
        return Math.max(0, 14 - Math.floor(diff / (1000 * 60 * 60 * 24)));
    }

}
