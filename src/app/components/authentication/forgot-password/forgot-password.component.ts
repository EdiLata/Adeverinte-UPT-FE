import {
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {confirmPasswordValidator} from '../validators';
import {AuthenticationService} from '../../../services/authentication.service';
import {CommonModule} from '@angular/common';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ToastService} from '../../../services/toast.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent implements OnInit {
  public forgotPasswordForm: FormGroup = new FormGroup(
    {
      email: new FormControl('', [
        Validators.required,
        Validators.email,
      ]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [
        Validators.required,
      ]),
    },
    {validators: confirmPasswordValidator},
  );
  private readonly authenticationService = inject(
    AuthenticationService,
  );
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toasterService = inject(ToastService);

  ngOnInit() {
    localStorage.removeItem('access_token');
  }

  public resetPassword() {
    if (this.forgotPasswordForm.valid) {
      let user = {
        email:
          this.forgotPasswordForm.controls['email'].value,
        password:
          this.forgotPasswordForm.controls['password']
            .value,
      };

      this.authenticationService
        .resetPassword(user)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(
          () => {
            this.toasterService.showSuccess(
              'Resetare parolă cu succes!',
            );
            this.router.navigate(['/login']);
          },
          () => {
            this.toasterService.showError(
              'Noua parolă nu poate să fie cea veche!',
            );
          },
        );
    }
  }
}
