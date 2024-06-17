import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {AuthenticationService} from '../../../services/authentication.service';
import {Router, RouterModule} from '@angular/router';
import {confirmPasswordValidator} from '../validators';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {CommonModule} from '@angular/common';
import {ToastService} from '../../../services/toast.service';
import {Faculty} from '../../../enums/faculty.enum';
import {Specialization} from '../../../enums/specialization.enum';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
})
export class RegistrationComponent implements OnInit {
  public registerForm: FormGroup = new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
      faculty: new FormControl(null),
      specialization: new FormControl(null),
      year: new FormControl(null),
    },
    {validators: confirmPasswordValidator},
  );
  public faculties = Object.values(Faculty);
  public specializations = Object.values(Specialization);
  public years = [1, 2, 3, 4];
  private readonly authenticationService = inject(AuthenticationService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toasterService = inject(ToastService);

  ngOnInit() {
    localStorage.removeItem('access_token');
  }

  public registerUser() {
    if (this.registerForm.valid) {
      let user = {
        email: this.registerForm.controls['email'].value,
        password: this.registerForm.controls['password'].value,
        faculty: this.registerForm.controls['faculty'].value ?? null,
        specialization:
          this.registerForm.controls['specialization'].value ?? null,
        year: this.registerForm.controls['year'].value ?? null,
      };

      this.authenticationService
        .registerUser(user)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(
          () => {
            this.toasterService.showSuccess('Înregistrare cu succes!');
            this.router.navigate(['/login']);
          },
          () => {
            this.toasterService.showError('Emailul nu este valid!');
          },
        );
    }
  }
}
