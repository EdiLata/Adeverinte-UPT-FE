import {Component, inject, OnInit} from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';
import {AdminHomeComponent} from './admin-home/admin-home.component';
import {SecretaryHomeComponent} from './secretary-home/secretary-home.component';
import {StudentHomeComponent} from './student-home/student-home.component';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    AdminHomeComponent,
    SecretaryHomeComponent,
    StudentHomeComponent,
    CommonModule,
  ],
  providers: [AuthenticationService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  public isAdmin = false;
  public isStudent = false;
  public isSecretary = false;
  private authService = inject(AuthenticationService);

  ngOnInit() {
    this.isSecretary = this.authService.isSecretary();
    this.isStudent = this.authService.isStudent();
    this.isAdmin = this.authService.isAdmin();
  }
}
