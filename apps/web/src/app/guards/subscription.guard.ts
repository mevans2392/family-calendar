import { CanActivateFn, Router } from '@angular/router';
import { Injectable, inject } from '@angular/core';
import { FamilyService } from '../services/family.service';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Family } from '../shared/shared-interfaces';

export function subscriptionGuard(requiredPlanType: 'family' | 'individual'): CanActivateFn {
  return async () => {
    const familyService = inject(FamilyService);
    const firestore = inject(Firestore);
    const router = inject(Router);

    try {
      const familyId = await familyService.getFamilyId();
      const snap = await getDoc(doc(firestore, `families/${familyId}`));
      const data = snap.data() as Family;

      const status = data?.subStatus ?? 'free';
      const planType = data?.planType ?? '';

      const hasActiveSub = status === 'paid' || status === 'trial';

      if(hasActiveSub && planType === requiredPlanType) {
        return true;
      } else {
        router.navigate(['/home']);
        return false;
      }
    } catch (e) {
      router.navigate(['/home']);
      return false;
    }
    
  };
} 
