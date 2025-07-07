import { Component, OnInit } from '@angular/core';
import { Form, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { FamilyService } from '../../services/family.service';
import { CommonModule } from '@angular/common';

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

  constructor (
    private fb: FormBuilder,
    private auth: Auth,
    private router: Router,
    private familyService: FamilyService
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      familyName: ['', Validators.required],
      members: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.addMember('Anyone');
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
    if(this.registerForm.invalid) return;

    const { email, password, familyName, members } = this.registerForm.value;
    try {
      const credential = await createUserWithEmailAndPassword(this.auth, email, password);
      const uid = credential.user.uid;

      await this.familyService.registerFamily(uid, email, familyName, members);
      this.router.navigate(['home']);
    } catch (err: any) {
      console.error(err);
      this.errorMessage = err.message || 'Registration failed.';
    }
  }

  readonly presetColors = ['#f94144', '#f3722c', '#f9844a', '#f9c74f', '#90be6d', '#43aa8b', '#577590'];
  selectedColor: string = this.presetColors[0];

}
