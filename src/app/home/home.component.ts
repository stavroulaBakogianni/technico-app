import { Component, inject, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/userService';
import { User } from '../models/user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  fb = inject(FormBuilder);
  router = inject(Router);
  userService = inject(UserService);

  userForm: FormGroup;
  currentUser: User | null = null; // Current user

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

  ngOnInit() {
    // Get the current user from the userService
    this.currentUser = this.userService.getCurrentUser();

    if (this.currentUser) {
      this.onEditUser(this.currentUser); // Populate the form with the user's data
    }
}

 // Populate form for editing a user
 onEditUser(user: User) {
  this.userForm.patchValue(user);
}

// Update user
onUpdateUser() {
  if (this.userForm.valid && this.currentUser) {
    const updatedUser: User = { ...this.currentUser, ...this.userForm.value };
    this.userService.updateUser(updatedUser).subscribe({
      next: (user) => {
        console.log("Updated succefully")
        this.userService.setCurrentUser(user)
        this.currentUser=user
      },
      error: (err) => {
        console.error('Error updating user:', err);
      }
    });
  }
}

// Delete user safely
onDeactivateUser() {
  if (this.currentUser?.vat) {
    this.userService.deleteUserSafely(this.currentUser?.vat).subscribe({
      next: () => {
        console.log("Deactivated succefully")
        this.router.navigate(['']); 
      },
      error: (err) => {
        console.error('Error deleting user:', err);
      }
    });
  }
}
}