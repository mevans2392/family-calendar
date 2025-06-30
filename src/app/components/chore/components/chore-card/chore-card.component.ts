import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chore } from '../../../../shared/shared-interfaces';
import { ChoreService } from '../../../../services/chore.service';
import { FamilyMembersService } from '../../../../services/family-members.service';

@Component({
  selector: 'app-chore-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chore-card.component.html',
  styleUrl: './chore-card.component.css'
})
export class ChoreCardComponent {
  @Input() chore!: Chore;
  @Output() edit = new EventEmitter<Chore>();

  private choreService = inject(ChoreService);
  private familyService = inject(FamilyMembersService);

  async toggleComplete(event: Event) {
    event.stopPropagation();
    const updated = {
      ...this.chore,
      complete: !this.chore.complete,
      lastCompletedAt: !this.chore.complete ? new Date().toISOString() : ''
    };

    if(!this.chore.complete && this.chore.assignedUser) {
      await this.familyService.addPointsToMember(this.chore.assignedUser, this.chore.points);
    }

    await this.choreService.saveChore(updated);
  }
}
