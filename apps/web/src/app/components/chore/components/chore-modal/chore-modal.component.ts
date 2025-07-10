import { Component, EventEmitter, Input, Output, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chore, MonthOption, MONTHS } from '../../../../shared/shared-interfaces';
import { ChoreService } from '../../../../services/chore.service';
import { Observable, map } from 'rxjs';
import { Firestore, doc, docData } from '@angular/fire/firestore';
import { FamilyService } from '../../../../services/family.service';

@Component({
  selector: 'app-chore-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chore-modal.component.html',
  styleUrl: './chore-modal.component.css'
})
export class ChoreModalComponent implements OnInit {
  @Input() chore: Partial<Chore> | null = null;
  
  @Output() close = new EventEmitter<void>();

  formChore: Partial<Chore> = {};
  MONTHS: (MonthOption | '')[] = ['', ...MONTHS];
  private choreService = inject(ChoreService);
  private firestore = inject(Firestore);
  private familyService = inject(FamilyService);
  subStatus$!: Observable<'free' | 'trial' | 'paid' | 'expired' | undefined>;

  ngOnInit() {
    // Initialize local formChore so template bindings are always safe
    this.formChore = this.chore ?? {
      title: '',
      points: 0,
      assignedUser: '',
      complete: false,
      lastCompletedAt: '',
      month: ''
    };
    this.loadSubStatus();
  }

  async loadSubStatus() {
      const familyId = await this.familyService.getFamilyId();
      const familyRef = doc(this.firestore, `families/${familyId}`);
  
      this.subStatus$ = docData(familyRef).pipe(
        map((data: any) => data?.subStatus ?? 'free')
      );
    }

  async save() {
    const choreToSave = {
      ...this.formChore,
      complete: this.formChore.complete ?? false,
      lastCompletedAt: this.formChore.lastCompletedAt ?? ''
    } as Chore;

    await this.choreService.saveChore(choreToSave);
    this.close.emit();
  }

  async deleteChore() {
    if(!this.formChore?.id) return;

    const confirmed = confirm('Are you sure you want to delete this chore?');

    if(confirmed) {
      await this.choreService.deleteChore(this.formChore.id);
      this.close.emit();
    }
  }

  onClose() {
    this.close.emit();
  }
}

