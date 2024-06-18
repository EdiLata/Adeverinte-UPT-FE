import {AfterViewInit, Component, inject, OnInit} from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';
import {AdminHomeComponent} from './admin-home/admin-home.component';
import {SecretaryHomeComponent} from './secretary-home/secretary-home.component';
import {StudentHomeComponent} from './student-home/student-home.component';
import {CommonModule} from '@angular/common';
import {TemplateService} from '../../services/template.service';

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
export class HomeComponent implements OnInit, AfterViewInit {
  public isAdmin = false;
  public isStudent = false;
  public isSecretary = false;
  public userEmail = '';
  private readonly templateService = inject(TemplateService);
  private readonly authService = inject(AuthenticationService);

  ngOnInit() {
    this.templateService.setDeleteModal(null);
    this.templateService.setEditModal(null);
    this.templateService.setAddModal(false);
    this.templateService.setViewModalContent(null);
    this.templateService.setDeclineModal(null);
    this.templateService.setRedoModal(null);
    this.templateService.setApproveModal(null);
    this.templateService.setGenerateReportModal(false);
    this.isSecretary = this.authService.isSecretary();
    this.isStudent = this.authService.isStudent();
    this.isAdmin = this.authService.isAdmin();
    this.userEmail = this.authService.getUserEmail();
  }

  public logout() {
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
}
