import {Component, inject} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {confirmPasswordValidator} from '../validators';
import {AuthenticationService} from '../../../services/authentication.service';
import {IUser} from '../../../interfaces/user.model';
import {NgIf} from '@angular/common';

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
  private authenticationService = inject(AuthenticationService);
  private router = inject(Router);

  public resetPassword() {
    if (this.forgotPasswordForm.valid) {
      let user: IUser = {
        email: this.forgotPasswordForm.controls['email'].value,
        password: this.forgotPasswordForm.controls['password'].value,
      };

      this.authenticationService.resetPassword(user).subscribe({
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
