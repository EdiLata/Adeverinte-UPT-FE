import {
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {TemplateService} from '../../../../services/template.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {
  CommonModule,
  NgForOf,
  NgIf,
  TitleCasePipe,
} from '@angular/common';
import {ToastService} from '../../../../services/toast.service';

@Component({
  selector: 'app-secretary-modal-edit',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './secretary-modal-edit.component.html',
  styleUrl: './secretary-modal-edit.component.scss',
})
export class SecretaryModalEditComponent implements OnInit {
  public studentResponses: any = [];
  public studentResponse: any = null;
  public templateFields: any = [];
  public dynamicForm: FormGroup = new FormGroup({});
  private hasMotivInResponse = false;
  private totalItems = 10;
  private readonly destroyRef = inject(DestroyRef);
  private readonly templateService =
    inject(TemplateService);
  private readonly toasterService = inject(ToastService);

  ngOnInit() {
    this.templateService
      .getAllStudentsResponsesSource()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.studentResponses = value?.items;
        this.totalItems = value?.totalItems;
      });

    this.templateService
      .getEditModal()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((id) => {
        this.dynamicForm = new FormGroup({});
        this.templateFields = [];
        if (id) {
          this.templateService
            .getStudentResponse(id)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((data) => {
              this.studentResponse = data;
              if (this.studentResponse.responses.motiv) {
                this.hasMotivInResponse = true;
                this.updateForm(
                  this.studentResponse.responses,
                );
              } else {
                this.hasMotivInResponse = false;
                this.updateForm({
                  ...this.studentResponse.responses,
                  motiv: this.studentResponse.reason,
                });
              }
            });
          this.openModal();
        } else {
          this.closeModal();
        }
      });
  }

  public openModal() {
    const modal = document.getElementById(
      'student-response-edit-modal',
    );
    if (modal) {
      modal.style.display = 'block';
    }
  }

  public closeModal() {
    const modal = document.getElementById(
      'student-response-edit-modal',
    );
    if (modal) {
      modal.style.display = 'none';
    }
  }

  private updateForm(responses: any) {
    Object.keys(responses).forEach((field: string) => {
      this.templateFields =
        this.templateFields?.concat(field);
      this.dynamicForm.addControl(
        field,
        new FormControl(
          responses[field],
          Validators.required,
        ),
      );
    });
  }

  public onSubmit(): void {
    if (this.dynamicForm?.valid) {
      const {motiv, ...formValueWithoutMotiv} =
        this.dynamicForm.value;

      let editedStudentResponse = {
        responses: this.hasMotivInResponse
          ? {motiv, ...formValueWithoutMotiv}
          : formValueWithoutMotiv,
        reason: motiv,
      };

      this.templateService
        .editStudentResponse(
          this.studentResponse.id,
          editedStudentResponse,
        )
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(
          (data) => {
            const updatedStudentResponses =
              this.studentResponses.map(
                (studentResponse: any) =>
                  studentResponse.id === data.id
                    ? data
                    : studentResponse,
              );

            this.templateService.setAllStudentsResponsesSource(
              {
                items: updatedStudentResponses,
                totalItems: this.totalItems,
              },
            );
            this.toasterService.showSuccess(
              'Adeverință editată cu succes!',
            );
            this.closeModal();
          },
          () => {
            this.toasterService.showError(
              'Adeverința nu au putut fi editată!',
            );
            this.templateService.setAllStudentsResponsesSource(
              {
                items: this.studentResponses,
                totalItems: this.totalItems,
              },
            );
            this.closeModal();
          },
        );
      this.dynamicForm.reset();
    }
  }

  public isFormValid(): boolean {
    return (
      this.dynamicForm.valid &&
      Object.keys(this.dynamicForm.controls).length > 0
    );
  }
}
