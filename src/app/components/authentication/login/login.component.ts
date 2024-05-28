import {Component, DestroyRef, inject} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {AuthenticationService} from '../../../services/authentication.service';
import {IUser} from '../../../interfaces/user.model';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule],
  providers: [AuthenticationService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  public loginForm: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });
  private readonly authenticationService = inject(AuthenticationService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  public loginUser() {
    let user: IUser = {
      email: this.loginForm.controls['email'].value,
      password: this.loginForm.controls['password'].value,
    };

    this.authenticationService
      .loginUser(user)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          console.log('Login successful', response);
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Login failed', error);
        },
      });
  }
}
