import {
  AfterViewInit,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
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
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  public isAdmin = false;
  public isStudent = false;
  public isSecretary = false;
  public userEmail = '';
  private checkInterval: any;
  private readonly authService = inject(AuthenticationService);

  ngOnInit() {
    this.isSecretary = this.authService.isSecretary();
    this.isStudent = this.authService.isStudent();
    this.isAdmin = this.authService.isAdmin();
    this.userEmail = this.authService.getUserEmail();
    this.authService.checkSessionExpiration();

    this.checkInterval = setInterval(() => {
      this.authService.checkSessionExpiration();
    }, 60 * 1000);
  }

  public logout() {
    this.authService.clearSessionExpiration();
    this.authService.setSessionExpirationSource(false);
    this.authService.logout();
  }

  ngAfterViewInit(): void {
    this.initializeDropdowns();
  }

  private initializeDropdowns() {
    const dropdownButtonMobile = document.getElementById(
      'dropdownInformationButtonMobile',
    );
    const dropdownMenuMobile = document.getElementById(
      'dropdownInformationMobile',
    );

    if (dropdownButtonMobile && dropdownMenuMobile) {
      dropdownButtonMobile.addEventListener('click', () => {
        dropdownMenuMobile.classList.toggle('hidden');
      });
    }

    const dropdownButtonDesktop = document.getElementById(
      'dropdownInformationButtonDesktop',
    );
    const dropdownMenuDesktop = document.getElementById(
      'dropdownInformationDesktop',
    );

    if (dropdownButtonDesktop && dropdownMenuDesktop) {
      dropdownButtonDesktop.addEventListener('click', () => {
        dropdownMenuDesktop.classList.toggle('hidden');
      });
    }
  }

  ngOnDestroy(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
  }
}
