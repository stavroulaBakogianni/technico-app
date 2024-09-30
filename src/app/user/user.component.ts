import { Component, inject, OnInit } from '@angular/core';

import { User } from '../models/user';
import { UserService } from '../services/userService';
import { CommonModule } from '@angular/common';


@Component({
  imports: [CommonModule],
  selector: 'app-user',
  standalone: true,
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {

  userService = inject(UserService);

  users: User[] = [];

  ngOnInit() {
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
}
