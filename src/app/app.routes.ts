import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { UserComponent } from './user/user.component';

export const routes: Routes = [{ path: 'register', component: RegisterComponent },{path: 'home', component: UserComponent}];
