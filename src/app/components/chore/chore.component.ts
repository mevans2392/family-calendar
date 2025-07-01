import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemberColumnComponent } from './components/member-column/member-column.component';
import { Chore, FamilyMember, MONTHS, MonthOption } from '../../shared/shared-interfaces';
import { ChoreService } from '../../services/chore.service';
import { FamilyMembersService } from '../../services/family-members.service';
import { Observable } from 'rxjs';
import { NavComponent } from '../nav/nav.component';
import { UnassignedChoresComponent } from './components/unassigned-chores/unassigned-chores.component';
import { ChoreModalComponent } from './components/chore-modal/chore-modal.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-chore',
  imports: [CommonModule, RouterModule, NavComponent, MemberColumnComponent, UnassignedChoresComponent, ChoreModalComponent],
  templateUrl: './chore.component.html',
  styleUrl: './chore.component.css'
})
export class ChoreComponent {
  private choreService = inject(ChoreService);
  private familyService = inject(FamilyMembersService);
  
  members$!: Observable<FamilyMember[]>;
  chores$!: Observable<Chore[]>;
  openModal = false;
  selectedChore: Chore | null = null;

  async ngOnInit() {
    this.members$ = await this.familyService.getMembers();
    await this.loadChores();
  }

  async loadChores() {
    this.chores$ = await this.choreService.loadChores();
  }

  getChoresForMember(memberId: string, chores: Chore[]): Chore[] {
    return chores.filter(c => c.assignedUser === memberId);
  }

  getUnassignedChores(chores: Chore[]): Chore[] {
    const currentMonth = this.getCurrentMonthName();

    return chores.filter(c => 
      !c.assignedUser &&
      (c.month === '' || c.month === currentMonth)
    );
  }

  getCurrentMonthName(): MonthOption {
    const monthIndex = new Date().getMonth();
    return MONTHS[monthIndex];
  }

  getDropListIds(members: FamilyMember[]): string[] {
    return members.map(m => 'dropList-' + m.id).concat('unassigned-chore-list');
  }

  openEditModal(chore: Chore) {
    this.selectedChore = chore;
    this.openModal = true;
  }

}
