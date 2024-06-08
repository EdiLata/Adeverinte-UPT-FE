import {Component, DestroyRef, inject} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {AuthenticationService} from '../../../services/authentication.service';
import {Router, RouterModule} from '@angular/router';
import {confirmPasswordValidator} from '../validators';
import {NgIf} from '@angular/common';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterModule, NgIf],
  providers: [AuthenticationService],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
})
export class RegistrationComponent {
  public registerForm: FormGroup = new FormGroup(
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

  public registerUser() {
    if (this.registerForm.valid) {
      let user = {
        email: this.registerForm.controls['email'].value,
        password: this.registerForm.controls['password'].value,
      };

      this.authenticationService
        .registerUser(user)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (response) => {
            console.log('Register successful', response);
            this.router.navigate(['/login']);
          },
          error: (error) => {
            console.error('Register failed', error);
          },
        });
    }
  }
}
