import { inject, Injectable } from '@angular/core';
import { Observable, combineLatest, map } from 'rxjs';
import { SubscriptionService } from './subscription.service';
import { hasActiveSub } from '../shared/subscription-utils';

@Injectable({ providedIn: 'root' })
export class NavAccessService {
    private subscriptionService = inject(SubscriptionService);

    canAccess$(): Observable<boolean> {
        return this.subscriptionService.subStatus$.pipe(
            map(subStatus => hasActiveSub(subStatus))
        );
    }

    famVisible$(): Observable<boolean> {
        return this.subscriptionService.planType$.pipe(
            map(planType => planType === 'family')
        );
    }

    indVisible$(): Observable<boolean> {
        return this.subscriptionService.planType$.pipe(
            map(planType => planType === 'individual')
        );
    }
}