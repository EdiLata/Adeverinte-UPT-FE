import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ModalViewComponent} from '../admin-home/modal-view/modal-view.component';
import {TemplateService} from '../../../services/template.service';
import {NgxDocViewerModule} from 'ngx-doc-viewer';
import {DomSanitizer} from '@angular/platform-browser';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {AuthenticationService} from '../../../services/authentication.service';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {StudentResponseModalAddComponent} from './student-response-modal-add/student-response-modal-add.component';
import {StudentResponseModalDeleteComponent} from './student-response-modal-delete/student-response-modal-delete.component';
import {StudentResponseModalEditComponent} from './student-response-modal-edit/student-response-modal-edit.component';

@Component({
  selector: 'app-student-home',
  standalone: true,
  imports: [
    CommonModule,
    NgxDocViewerModule,
    ModalViewComponent,
    ReactiveFormsModule,
    StudentResponseModalAddComponent,
    StudentResponseModalDeleteComponent,
    StudentResponseModalEditComponent,
  ],
  providers: [TemplateService, AuthenticationService],
  templateUrl: './student-home.component.html',
  styleUrl: './student-home.component.scss',
})
export class StudentHomeComponent implements OnInit {
  public studentResponses: any = [];
  public searchedStudentResponses: any = [];
  public searchForm: FormGroup = new FormGroup({
    searchQuery: new FormControl(''),
  });
  private readonly sanitizer = inject(DomSanitizer);
  private readonly templateService = inject(TemplateService);
  private readonly authService = inject(AuthenticationService);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.getStudentResponses(this.authService.getUserId());
    this.templateService
      .getStudentResponsesSource()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.studentResponses = value;
      });

    this.searchForm
      .get('searchQuery')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.studentResponses = this.searchedStudentResponses?.filter(
          (element: any) =>
            element?.template?.name
              ?.toLowerCase()
              .includes(value?.toLowerCase()),
        );

        this.templateService.setStudentResponsesSource(this.studentResponses);
      });
  }

  public downloadStudentResponse(template: string) {
    const parts = template.split('\\');
    this.templateService
      .downloadTemplate(parts[parts.length - 1])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(
        (response) => {
          const blob = new Blob([response], {type: response.type});
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'template';
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        },
        (error) => {
          console.error('Error downloading the file', error);
        },
      );
  }

  private getStudentResponses(studentId: number) {
    this.templateService
      .getStudentResponses(studentId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(
        (data) => {
          this.templateService.setStudentResponsesSource(data);
          this.searchedStudentResponses = data;
        },
        (error) => {
          console.error('Error fetching student responses', error);
          this.templateService.setStudentResponsesSource(null);
        },
      );
  }

  public loadDocument(filePath: string): void {
    const parts = filePath.split(/uploads[\\/]/);
    this.templateService
      .getFileUrl(parts[1])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((response) => {
        const safeHtmlContent = this.sanitizer.bypassSecurityTrustHtml(
          response.html,
        );
        this.templateService.setViewModalContent(safeHtmlContent);
      });
  }

  public openDeleteStudentResponseModal(id: number) {
    this.templateService.setDeleteModal(id);
  }

  public openEditStudentResponseModal(id: number) {
    this.templateService.setEditModal(id);
  }
}
