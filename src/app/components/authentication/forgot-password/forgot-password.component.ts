import {Component, DestroyRef, inject} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {confirmPasswordValidator} from '../validators';
import {AuthenticationService} from '../../../services/authentication.service';
import {NgIf} from '@angular/common';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [RouterLink, NgIf, ReactiveFormsModule],
  providers: [AuthenticationService],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  public forgotPasswordForm: FormGroup = new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    {validators: confirmPasswordValidator},
  );
  private readonly authenticationService = inject(AuthenticationService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  public resetPassword() {
    if (this.forgotPasswordForm.valid) {
      let user = {
        email: this.forgotPasswordForm.controls['email'].value,
        password: this.forgotPasswordForm.controls['password'].value,
      };

      this.authenticationService
        .resetPassword(user)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (response) => {
            console.log('Reset Password successful', response);
            this.router.navigate(['/login']);
          },
          error: (error) => {
            console.error('Reset Password failed', error);
          },
        });
    }
  }
}
