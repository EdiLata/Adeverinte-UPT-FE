import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {AuthenticationService} from '../../../services/authentication.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {CommonModule} from '@angular/common';
import {ToastService} from '../../../services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });
  public isSessionExpired = false;
  private readonly authenticationService = inject(AuthenticationService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toasterService = inject(ToastService);

  ngOnInit() {
    localStorage.removeItem('access_token');
    this.authenticationService
      .getSessionExpirationSource()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((isExpired) => {
        this.isSessionExpired = isExpired;
      });
  }

  public loginUser() {
    let user = {
      email: this.loginForm.controls['email'].value,
      password: this.loginForm.controls['password'].value,
    };

    this.authenticationService
      .loginUser(user)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(
        (response) => {
          this.authenticationService.setSessionExpirationSource(false);
          this.toasterService.showSuccess('Logare cu succes!');
          localStorage.setItem('access_token', response.access_token);
          this.authenticationService.setSessionExpiration(30);
          this.router.navigate(['/home']);
        },
        () => {
          this.toasterService.showError('Datele introduse sunt incorecte!');
        },
      );
  }
}
