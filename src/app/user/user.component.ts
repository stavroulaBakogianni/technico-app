import { Component, inject, OnInit } from '@angular/core';
import { User } from '../models/user';
import { UserService } from '../services/userService';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

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

  users: User[] = [];
  userForm: FormGroup;
  isEditMode = false;
  selectedUser?: User;

  constructor() {
    this.userForm = this.fb.group({
      vat: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      surname: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      address: ['', Validators.maxLength(50)],
      phoneNumber: ['', [Validators.pattern(/^\d{0,14}$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(50),
      Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d).*$/)]],
      role: ['', Validators.required]
    });
  }


  ngOnInit() {
    this.loadUsers();
  }

  // Get all users
  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        console.log(this.users);
        console.log(data);
      },
      error: (err) => {
        console.error('Error fetching users:', err);
      }
    });
  }

  // Create a new user
  onCreateUser() {
    if (this.userForm.valid) {
      const newUser: User = this.userForm.value;
      this.userService.createUser(newUser).subscribe({
        next: (response) => {
          console.log('User created successfully:', response);
          this.resetForm();
          this.loadUsers();
        },
        error: (err) => {
          console.error('Error creating user:', err);
        }
      });
    } else {
      console.error('Form is invalid');
    }
  }

  // Populate form for editing a user
  onEditUser(user: User) {
    this.isEditMode = true;
    this.selectedUser = user;
    this.userForm.patchValue(user);
  }

  // Update user
  onUpdateUser() {
    if (this.userForm.valid && this.selectedUser) {
      const updatedUser: User = { ...this.selectedUser, ...this.userForm.value };
      this.userService.updateUser(updatedUser).subscribe({
        next: (user) => {
          const index = this.users.findIndex(u => u.id === user.id);
          this.users[index] = user;
          this.resetForm();
        },
        error: (err) => {
          console.error('Error updating user:', err);
        }
      });
    }
  }

  // Delete user safely
  onDeactivateUser(vat: string) {
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

  // Delete user permantly
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

  // Reset form and mode
  resetForm() {
    this.userForm.reset();
    this.isEditMode = false;
    this.selectedUser = undefined;
  }
}
