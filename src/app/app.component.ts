import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { UserComponent } from "./user/user.component";
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from "./login/login.component";
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, UserComponent, RegisterComponent, LoginComponent, CommonModule, HomeComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'technico-app';
  public router: Router; 

  constructor(router: Router) {
    this.router = router;
  }
}
