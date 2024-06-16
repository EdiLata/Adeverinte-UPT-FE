import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ModalViewComponent} from '../shared/modal-view/modal-view.component';
import {TemplateService} from '../../../services/template.service';
import {DomSanitizer} from '@angular/platform-browser';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {AuthenticationService} from '../../../services/authentication.service';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {StudentResponseModalAddComponent} from './student-response-modal-add/student-response-modal-add.component';
import {StudentResponseModalDeleteComponent} from './student-response-modal-delete/student-response-modal-delete.component';
import {StudentResponseModalEditComponent} from './student-response-modal-edit/student-response-modal-edit.component';
import {
  catchError,
  map,
  merge,
  Observable,
  of,
  startWith,
  switchMap,
} from 'rxjs';
import {ToastService} from '../../../services/toast.service';

@Component({
  selector: 'app-student-home',
  standalone: true,
  imports: [
    CommonModule,
    ModalViewComponent,
    ReactiveFormsModule,
    StudentResponseModalAddComponent,
    StudentResponseModalDeleteComponent,
    StudentResponseModalEditComponent,
  ],
  templateUrl: './student-home.component.html',
  styleUrl: './student-home.component.scss',
})
export class StudentHomeComponent implements OnInit {
  public studentResponses: any = [];
  public searchForm: FormGroup = new FormGroup({
    searchQuery: new FormControl(''),
  });
  private readonly sanitizer = inject(DomSanitizer);
  private readonly templateService = inject(TemplateService);
  private readonly authService = inject(AuthenticationService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toasterService = inject(ToastService);

  ngOnInit(): void {
    this.getStudentResponses(this.authService.getUserId());

    this.templateService
      .getStudentResponsesSource()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.studentResponses = value?.filter((element: any) =>
          element?.template?.name
            ?.toLowerCase()
            .includes(this.searchForm.get('searchQuery')?.value?.toLowerCase()),
        );
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
        () => {
          this.toasterService.showError('Eroare la descărcarea fișierului!');
        },
      );
  }

  private getStudentResponses(studentId: number) {
    const searchQuery$ = this.searchForm
      .get('searchQuery')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef));

    const studentResponses$ = this.templateService
      .getStudentResponses(studentId)
      .pipe(takeUntilDestroyed(this.destroyRef));

    merge(
      (searchQuery$ as Observable<any>).pipe(
        switchMap((searchQuery) =>
          this.templateService.getStudentResponses(studentId).pipe(
            catchError(() => {
              this.toasterService.showError(
                'Eroare la afișarea adeverințelor!',
              );
              return of(null);
            }),
            map((studentResponses) => ({searchQuery, studentResponses})),
          ),
        ),
      ),
      studentResponses$.pipe(
        switchMap((studentResponses) =>
          (searchQuery$ as Observable<any>).pipe(
            startWith(''),
            map((searchQuery) => ({searchQuery, studentResponses})),
          ),
        ),
      ),
    ).subscribe(({searchQuery, studentResponses}) => {
      const searchedResponses = studentResponses?.filter((element: any) =>
        element?.template?.name
          ?.toLowerCase()
          .includes(searchQuery?.toLowerCase()),
      );

      this.templateService.setStudentResponsesSource(searchedResponses);
    });
  }

  public loadDocument(filePath: string): void {
    const parts = filePath.split(/uploads[\\/]/);
    this.templateService
      .getFileUrl(parts[1])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(
        (response) => {
          const safeHtmlContent = this.sanitizer.bypassSecurityTrustHtml(
            response.html,
          );
          this.templateService.setViewModalContent(safeHtmlContent);
        },
        () => {
          this.toasterService.showError('Eroare la vizualizarea adeverinței!');
        },
      );
  }

  public openDeleteStudentResponseModal(id: number) {
    this.templateService.setDeleteModal(id);
  }

  public openEditStudentResponseModal(id: number) {
    this.templateService.setEditModal(id);
  }

  public openAddStudentResponseModal() {
    this.templateService.setAddModal(true);
  }
}
