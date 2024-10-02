import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../services/userService';
import { User } from '../models/user';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'

})
export class RegisterComponent {
  userService = inject(UserService);
  fb = inject(FormBuilder);
  router = inject(Router);
  userForm: FormGroup;

  constructor() {
    this.userForm = this.fb.group({
      vat: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      surname: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      address: ['', Validators.maxLength(50)],
      phoneNumber: ['', [Validators.pattern(/^\d{0,14}$/), Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(50),
      Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d).*$/)]],
      role: ['', Validators.required]
    });
  }

  // Create a new user
  onCreateUser() {
    if (this.userForm.valid) {
      const newUser: User = this.userForm.value;
      this.userService.createUser(newUser).subscribe({
        next: (user) => {
          this.userService.setCurrentUser(user);
          console.log('Login successful', user);
          if (user.role === "PROPERTY_OWNER") {
            this.router.navigate(['/home']);
          }
          else { this.router.navigate(['/users']); }
        },
        error: (err) => {
          console.error('Error creating user:', err);
        }
      });
    } else {
      console.error('Form is invalid');
    }
  }

  // Reset form
  resetForm() {
    this.userForm.reset();
  }
}
