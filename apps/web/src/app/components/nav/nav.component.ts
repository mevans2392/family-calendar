import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';
import { Firestore, doc, docData } from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { FamilyService } from '../../services/family.service';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterModule, AsyncPipe],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent implements OnInit {
  subStatus$!: Observable<'free' | 'trial' | 'paid' | 'expired' | undefined>;

  private firestore = inject(Firestore);
  private authService = inject(AuthService);
  private familyService = inject(FamilyService);

  ngOnInit(): void {
    this.loadSubStatus();
  }

  async loadSubStatus() {
    const familyId = await this.familyService.getFamilyId();
    const familyRef = doc(this.firestore, `families/${familyId}`);
    this.subStatus$ = docData(familyRef).pipe(
      map((data: any) => data?.subStatus ?? 'free')
    );
  }

  logout() {
    this.authService.logout();
  }
}
