import { Component, inject, OnInit } from '@angular/core';
import { User } from '../models/user';
import { UserService } from '../services/userService';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  imports: [CommonModule, ReactiveFormsModule],
  selector: 'app-user',
  standalone: true,
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  userService = inject(UserService);
  fb = inject(FormBuilder);
  router = inject(Router);
  route = inject(ActivatedRoute);

  users: User[] = [];
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

    // Check if the current user is a Staff Member
    if (this.currentUser?.role === 'STAFF_MEMBER') {
      this.loadUsers();
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
          this.currentUser = user
        },
        error: (err) => {
          console.error('Error updating user:', err);
        }
      });
    }
  }

  // Delete user safely
  onDeactivateUser(vat: string | undefined) {
    if (vat) {
      this.userService.deleteUserSafely(vat).subscribe({
        next: () => {
          const index = this.users.findIndex(u => u.vat === vat);
          this.users[index].deleted = true;
        },
        error: (err) => {
          console.error('Error deleting user:', err);
        }
      });
    }

  }

  // Get all users
  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        console.log(this.users);
      },
      error: (err) => {
        console.error('Error fetching users:', err);
      }
    });
  }

  // Delete user permanently
  onDeleteUser(vat: string) {
    this.userService.deleteUserPermanently(vat).subscribe({
      next: () => {
        this.users = this.users.filter(user => user.vat !== vat); // Remove deleted user from the list
      },
      error: (err) => {
        console.error('Error deleting user:', err);
      }
    });
  }
}
