import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {ResponseStatus} from '../../../enums/response-status.enum';
import {Faculty} from '../../../enums/faculty.enum';
import {Specialization} from '../../../enums/specialization.enum';
import {TemplateService} from '../../../services/template.service';
import {CommonModule} from '@angular/common';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {DomSanitizer} from '@angular/platform-browser';
import {ModalViewComponent} from '../admin-home/modal-view/modal-view.component';
import {SecretaryModalDeleteComponent} from './secretary-modal-delete/secretary-modal-delete.component';
import {
  catchError,
  map,
  merge,
  Observable,
  of,
  startWith,
  switchMap,
} from 'rxjs';
import {SecretaryModalEditComponent} from './secretary-modal-edit/secretary-modal-edit.component';

@Component({
  selector: 'app-secretary-home',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ModalViewComponent,
    SecretaryModalDeleteComponent,
    SecretaryModalEditComponent,
  ],
  providers: [TemplateService],
  templateUrl: './secretary-home.component.html',
  styleUrl: './secretary-home.component.scss',
})
export class SecretaryHomeComponent implements OnInit {
  public allStudentsResponses: any[] = [];
  public faculties = Object.values(Faculty);
  public specializations = Object.values(Specialization);
  public years = [1, 2, 3, 4];
  public selectedStatus: ResponseStatus = ResponseStatus.SENT;
  public page = 1;
  public limit = 10;
  public totalItems: number = 12;
  public form: FormGroup = new FormGroup({
    faculties: new FormArray([]),
    specializations: new FormArray([]),
    years: new FormArray([]),
  });
  public searchForm: FormGroup = new FormGroup({
    searchQuery: new FormControl(''),
  });
  private readonly sanitizer = inject(DomSanitizer);
  private readonly templateService = inject(TemplateService);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.initFormControls();
    this.getAllStudentsResponses();

    this.templateService
      .getAllStudentsResponsesSource()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.allStudentsResponses = value?.filter((element: any) =>
          element?.student?.email
            ?.toLowerCase()
            .includes(this.searchForm.get('searchQuery')?.value?.toLowerCase()),
        );
      });
  }

  private initFormControls() {
    this.faculties.forEach(() => {
      (this.form.controls['faculties'] as FormArray).push(
        new FormControl(false),
      );
    });

    this.specializations.forEach(() => {
      (this.form.controls['specializations'] as FormArray).push(
        new FormControl(false),
      );
    });

    this.years.forEach(() => {
      (this.form.controls['years'] as FormArray).push(new FormControl(false));
    });

    this.form.controls['faculties'].valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.getAllStudentsResponses();
      });

    this.form.controls['specializations'].valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.getAllStudentsResponses();
      });

    this.form.controls['years'].valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.getAllStudentsResponses();
      });
  }

  private getSelectedValues(formArrayName: string, sourceArray: any[]) {
    return this.form.controls[formArrayName].value
      .map((checked: boolean, index: number) =>
        checked ? sourceArray[index] : null,
      )
      .filter((value: string | null) => value !== null);
  }

  private getAllStudentsResponses(): void {
    const selectedFaculties = this.getSelectedValues(
      'faculties',
      this.faculties,
    );
    const selectedSpecializations = this.getSelectedValues(
      'specializations',
      this.specializations,
    );
    const selectedYears = this.getSelectedValues('years', this.years);

    const searchQuery$ = this.searchForm
      .get('searchQuery')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef));

    const studentResponses$ = this.templateService
      .getAllStudentsResponses(
        this.selectedStatus,
        selectedFaculties,
        selectedSpecializations,
        selectedYears,
        this.page,
        this.limit,
      )
      .pipe(takeUntilDestroyed(this.destroyRef));

    merge(
      (searchQuery$ as Observable<any>).pipe(
        switchMap((searchQuery) =>
          this.templateService
            .getAllStudentsResponses(
              this.selectedStatus,
              selectedFaculties,
              selectedSpecializations,
              selectedYears,
              this.page,
              this.limit,
            )
            .pipe(
              catchError((error) => {
                console.error('Error fetching student responses', error);
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
      console.log(studentResponses);
      const searchedResponses = studentResponses?.filter((element: any) =>
        element?.student?.email
          ?.toLowerCase()
          .includes(searchQuery?.toLowerCase()),
      );

      this.templateService.setAllStudentsResponsesSource(searchedResponses);
    });
  }

  public onStatusChange(status: ResponseStatus): void {
    this.selectedStatus = status;
    this.getAllStudentsResponses();
  }

  public onPageChange(page: number): void {
    this.page = page;
    this.getAllStudentsResponses();
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

  protected readonly ResponseStatus = ResponseStatus;
}
