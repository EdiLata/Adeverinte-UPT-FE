import {
  AfterViewInit,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
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
import {PaginationService} from '../../../services/pagination.service';
import {SecretaryModalApproveComponent} from './secretary-modal-approve/secretary-modal-approve.component';
import {SecretaryModalRedoComponent} from './secretary-modal-redo/secretary-modal-redo.component';
import {SecretaryModalDeclineComponent} from './secretary-modal-decline/secretary-modal-decline.component';

@Component({
  selector: 'app-secretary-home',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ModalViewComponent,
    SecretaryModalDeleteComponent,
    SecretaryModalEditComponent,
    SecretaryModalApproveComponent,
    SecretaryModalRedoComponent,
    SecretaryModalDeclineComponent,
  ],
  providers: [TemplateService, PaginationService],
  templateUrl: './secretary-home.component.html',
  styleUrl: './secretary-home.component.scss',
})
export class SecretaryHomeComponent implements OnInit, AfterViewInit {
  public allStudentsResponses: any[] = [];
  public faculties = Object.values(Faculty);
  public specializations = Object.values(Specialization);
  public years = [1, 2, 3, 4];
  public selectedStatus: ResponseStatus = ResponseStatus.SENT;
  public page: number = 1;
  public limit: number = 10;
  public totalItems: number = 10;
  public form: FormGroup = new FormGroup({
    faculties: new FormArray([]),
    specializations: new FormArray([]),
    years: new FormArray([]),
  });
  public searchForm: FormGroup = new FormGroup({
    searchQuery: new FormControl(''),
  });
  protected readonly ResponseStatus = ResponseStatus;
  private readonly sanitizer = inject(DomSanitizer);
  private readonly templateService = inject(TemplateService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly paginationService = inject(PaginationService);

  ngOnInit(): void {
    this.page = this.paginationService.getDefaultPageNumber();
    this.limit = this.paginationService.getDefaultPageSize();

    this.initFormControls();
    this.getAllStudentsResponses();

    this.templateService
      .getAllStudentsResponsesSource()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        console.log(value);
        this.allStudentsResponses = value?.items?.filter((element: any) =>
          element?.student?.email
            ?.toLowerCase()
            .includes(this.searchForm.get('searchQuery')?.value?.toLowerCase()),
        );

        this.totalItems = value?.totalItems;
      });
  }

  ngAfterViewInit(): void {
    this.initializeDropdowns();
  }

  private initializeDropdowns() {
    const dropdownFacultyCheckbox = document.getElementById(
      'dropdownFacultyCheckbox',
    );

    const dropdownFacultyCheckboxButton = document.getElementById(
      'dropdownFacultyCheckboxButton',
    );

    if (dropdownFacultyCheckbox && dropdownFacultyCheckboxButton) {
      dropdownFacultyCheckboxButton.addEventListener('click', () => {
        dropdownFacultyCheckbox.classList.toggle('hidden');
      });
    }

    const dropdownSpecializationCheckbox = document.getElementById(
      'dropdownSpecializationCheckbox',
    );

    const dropdownSpecializationCheckboxButton = document.getElementById(
      'dropdownSpecializationCheckboxButton',
    );

    if (
      dropdownSpecializationCheckbox &&
      dropdownSpecializationCheckboxButton
    ) {
      dropdownSpecializationCheckboxButton.addEventListener('click', () => {
        dropdownSpecializationCheckbox.classList.toggle('hidden');
      });
    }

    const dropdownYearCheckbox = document.getElementById(
      'dropdownYearCheckbox',
    );

    const dropdownYearCheckboxButton = document.getElementById(
      'dropdownYearCheckboxButton',
    );

    if (dropdownYearCheckbox && dropdownYearCheckboxButton) {
      dropdownYearCheckboxButton.addEventListener('click', () => {
        dropdownYearCheckbox.classList.toggle('hidden');
      });
    }
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
      const searchedResponses = studentResponses?.items?.filter(
        (element: any) =>
          element?.student?.email
            ?.toLowerCase()
            .includes(searchQuery?.toLowerCase()),
      );

      this.totalItems = studentResponses?.totalItems;

      console.log(searchedResponses);
      this.templateService.setAllStudentsResponsesSource({
        items: searchedResponses,
        totalItems: this.totalItems,
      });
    });
  }

  public onStatusChange(status: ResponseStatus): void {
    this.selectedStatus = status;
    this.page = this.paginationService.getDefaultPageNumber();
    this.limit = this.paginationService.getDefaultPageSize();
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

  public openApproveStudentResponseModal(id: number) {
    this.templateService.setApproveModal(id);
  }

  public openDeclineStudentResponseModal(id: number) {
    this.templateService.setDeclineModal(id);
  }

  public openRedoStudentResponseModal(id: number) {
    this.templateService.setRedoModal(id);
  }

  public printStudentResponse(filePath: string): void {
    const parts = filePath.split(/uploads[\\/]/);
    this.templateService
      .getFileUrl(parts[1])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((response) => {
        const WindowPrt = window.open(
          '',
          '',
          'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0',
        );
        WindowPrt?.document.write(`
      <html>
        <head>
          <style>
            @media print {
              @page {
                margin: 0;
                size: auto;
              }
              body {
                margin: 1cm;
              }
              header, footer {
                display: none;
              }
              @page {
                @top-left {
                  content: none;
                }
                @top-right {
                  content: none;
                }
                @bottom-left {
                  content: none;
                }
                @bottom-right {
                  content: none;
                }
              }
            }
          </style>
        </head>
        <body>
          ${response.html}
        </body>
      </html>
    `);
        WindowPrt?.document.close();
        WindowPrt?.focus();
        WindowPrt?.print();
        WindowPrt?.close();
      });
  }
}
