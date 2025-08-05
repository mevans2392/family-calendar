import { Component, OnInit } from '@angular/core';
import { Form, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { FamilyService } from '../../services/family.service';
import { CommonModule } from '@angular/common';
import { SubscriptionService } from '../../services/subscription.service';
import { FamilyMembersService } from '../../services/family-members.service';
import { httpsCallable, Functions } from '@angular/fire/functions';

@Component({
  selector: 'app-register-family',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register-family.component.html',
  styleUrl: './register-family.component.css'
})
export class RegisterFamilyComponent implements OnInit {
  registerForm: FormGroup;
  errorMessage = '';
  isManagingExistingFamily = false;
  subStatus: 'free' | 'trial' | 'paid' | 'expired' = 'free';
  familyId: string | null = null;

  constructor (
    private fb: FormBuilder,
    private auth: Auth,
    private router: Router,
    private familyService: FamilyService,
    private subscriptionService: SubscriptionService,
    private familyMembersService: FamilyMembersService,
    private functions: Functions
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      familyName: ['', Validators.required],
      planType: ['family', Validators.required],
      members: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.familyId = localStorage.getItem('familyId');
    if(this.familyId) {
      this.isManagingExistingFamily = true;
      this.registerForm.removeControl('email');
      this.registerForm.removeControl('password');
      this.loadFamilyData(this.familyId);
    } else {
      this.addMember('Anyone');
    }
  }  

  loadFamilyData(familyId: string): void {
    this.subscriptionService.getFamilyData().subscribe(family => {
      if(family) {
        this.subStatus = family.subStatus;

        this.registerForm.patchValue({
          familyName: family.familyName,
          planType: family.planType || 'family'
        });

        this.members.clear();

        this.familyMembersService.getMembers().then(members$ => {
          members$.subscribe(members => {
            members.forEach(member => {
              const memberGroup = this.fb.group({
                name: [member.name, Validators.required],
                color: [member.color, Validators.required]
              });

              if(member.name === 'Anyone') {
                memberGroup.get('name')?.disable();
              }

              this.members.push(memberGroup);
            });
          });
        });
      }
    });
  }

  get members(): FormArray {
    return this.registerForm.get('members') as FormArray;
  }

  addMember(defaultName: string = ''): void {
    const memberGroup = this.fb.group({
      name: [defaultName, Validators.required],
      color: [this.presetColors[0], Validators.required]
    });
    this.members.push(memberGroup);
  }

  removeMember(index: number): void {
    const member = this.members.at(index);
    if(member.get('name')?.value === 'Anyone') return;

    this.members.removeAt(index);
  }

  async submit(): Promise<void> {
    if(!this.registerForm.valid) { 

      this.members.controls.forEach((control, index) => {
        console.log(`Member ${index}`, {
          name: control.get('name')?.value,
          color: control.get('color')?.value,
          valid: control.valid,
          errors: {
            name: control.get('name')?.errors,
            color: control.get('color')?.errors
          }
        });
      });

      return;
    }

    const rawForm = this.registerForm.getRawValue();
    const { email, password, familyName, planType, members } = rawForm;

    try {
      if(this.isManagingExistingFamily) {
        await this.familyService.updateFamily(familyName, members, planType);
      } else {
        const credential = await createUserWithEmailAndPassword(this.auth, email, password);
        const uid = credential.user.uid;

        await this.familyService.registerFamily(uid, email, familyName, members, planType);
      }
      
      this.router.navigate(['home']);
    } catch (err: any) {
      console.error(err);
      this.errorMessage = err.message || 'Registration failed.';
    }
  }

  readonly presetColors = ['#f94144', '#f3722c', '#f9844a', '#f9c74f', '#90be6d', '#43aa8b', '#577590'];
  selectedColor: string = this.presetColors[0];

  loading = false;
  
  async startCheckout() {
    this.loading = true;

    const createCheckoutSession = httpsCallable(
      this.functions,
      'createCheckoutSessionCallable'
    );

    createCheckoutSession({})
      .then((result: any) => {
        const url = result.data.url;
        if(url) {
          window.location.href = url;
        }
      })
      .catch((err) => {
        console.error('Stripe checkout error:', err);
        this.loading = false;
      });
  }

  async cancelSubscription() {
    const confirmed = confirm("Are you sure you want to cancel your subscription?");

    if(!confirmed) return;
    
    try{
      const cancel = httpsCallable(this.functions, 'cancelSubscription');
      await cancel({});
      this.subscriptionService.getFamilyData().subscribe(family => {
        if(family) this.subStatus = family.subStatus;
      });
    } catch(error) {
      console.error('Failed to cancel subscription:', error);
    }
  }

}
