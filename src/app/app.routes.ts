import {Routes} from '@angular/router';
import {RegistrationComponent} from './components/authentication/registration/registration.component';
import {LoginComponent} from './components/authentication/login/login.component';
import {ForgotPasswordComponent} from './components/authentication/forgot-password/forgot-password.component';
import {HomeComponent} from './components/home/home.component';
import {SecretaryGeneratedReportComponent} from './components/home/secretary-home/secretary-generated-report/secretary-generated-report.component';
import {AuthGuard} from './guards/auth.guard';
import {SecretaryReportGuard} from './guards/secretary-report.guard';

export const routes: Routes = [
  {
    path: 'authentication/register',
    component: RegistrationComponent,
  },
  {
    path: 'authentication/login',
    component: LoginComponent,
  },
  {
    path: 'authentication/forgot-password',
    component: ForgotPasswordComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'generated-report',
    component: SecretaryGeneratedReportComponent,
    canActivate: [AuthGuard, SecretaryReportGuard],
  },
  {
    path: '**',
    redirectTo: 'authentication/login',
  },
];
