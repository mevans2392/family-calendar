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
    this.addMember();
  }  

  get members(): FormArray {
    return this.registerForm.get('members') as FormArray;
  }

  addMember(): void {
    this.members.push(this.fb.group({
      name: ['', Validators.required],
      color: ['', Validators.required]
    }));
  }

  removeMember(index: number): void {
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

}
