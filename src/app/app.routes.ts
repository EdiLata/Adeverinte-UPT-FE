import {Routes} from '@angular/router';
import {RegistrationComponent} from './components/authentication/registration/registration.component';
import {LoginComponent} from './components/authentication/login/login.component';
import {ForgotPasswordComponent} from './components/authentication/forgot-password/forgot-password.component';
import {HomeComponent} from './components/home/home.component';

export const routes: Routes = [
  {path: 'authentication/register', component: RegistrationComponent},
  {path: 'authentication/login', component: LoginComponent},
  {path: 'authentication/forgot-password', component: ForgotPasswordComponent},
  {path: 'home', component: HomeComponent},
  {path: '**', redirectTo: 'authentication/login'},
];
