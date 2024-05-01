import {Component, inject} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {AuthenticationService} from '../../../services/authentication.service';
import {CommonModule} from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import {IUser} from '../../../interfaces/user.model';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterModule],
  providers: [AuthenticationService],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
})
export class RegistrationComponent {
  public registerForm: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });
  private authenticationService = inject(AuthenticationService);
  private router = inject(Router);

  public registerUser() {
    let user: IUser = {
      email: this.registerForm.controls['email'].value,
      password: this.registerForm.controls['password'].value,
    };

    this.authenticationService.registerUser(user).subscribe({
      next: (response) => {
        console.log('Register successful', response);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Login failed', error);
      },
    });
  }
}
