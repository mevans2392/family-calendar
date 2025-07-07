import { Component, EventEmitter, Input, Output, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Reward, FamilyMember } from '../../../../shared/shared-interfaces';
import { RewardService } from '../../../../services/reward.service';
import { FamilyMembersService } from '../../../../services/family-members.service';

@Component({
  selector: 'app-reward-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reward-modal.component.html',
  styleUrl: './reward-modal.component.css'
})
export class RewardModalComponent implements OnInit {
  @Input() reward: Partial<Reward> | null = null;
  @Input() members: FamilyMember[] = [];

  @Output() close = new EventEmitter<void>();

  formReward: Partial<Reward> = {};
  selectedMember: FamilyMember | null = null;
  private rewardService = inject(RewardService);
  private familyService = inject(FamilyMembersService);
  filteredMembers: FamilyMember[] = [];

  async ngOnInit() {
    this.formReward = this.reward ?? {
      title: '',
      points: 0,
    };

    const members$ = await this.familyService.getMembers();
    members$.subscribe(data => {
      this.members = data;
      this.filteredMembers = data.filter(m => m.name !== 'Anyone');
    });
  }

  async save() {
    const rewardToSave = {
      ...this.formReward,
    } as Reward;

    await this.rewardService.saveReward(rewardToSave);
    this.close.emit();
  }

  async deleteReward() {
    if(!this.formReward?.id) return;

    const confirmed = confirm('Are you sure you want to delete this reward?');

    if(confirmed) {
      await this.rewardService.deleteReward(this.formReward.id);
      this.close.emit();
    }
  }

  async giveRewardtoMember() {
    if(!this.selectedMember || !this.formReward?.points) return;

    if(this.selectedMember.points < this.formReward.points) {
      alert(`${this.selectedMember.name} does not have enough points for this reward`);
      return;
    }

    const newPoints = (this.selectedMember.points || 0) - this.formReward.points;
    await this.familyService.updatePoints(this.selectedMember.id!, newPoints);

    this.close.emit();
  }

  onClose() {
    this.close.emit();
  }

}
