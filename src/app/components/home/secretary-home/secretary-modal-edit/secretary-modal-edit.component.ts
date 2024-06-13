import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {TemplateService} from '../../../../services/template.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {CommonModule, NgForOf, NgIf, TitleCasePipe} from '@angular/common';

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
  private readonly destroyRef = inject(DestroyRef);
  private readonly templateService = inject(TemplateService);

  ngOnInit() {
    this.templateService
      .getAllStudentsResponses()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        if (value) {
          this.studentResponses = value;
        }
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
              this.updateForm(this.studentResponse.responses);
            });
          this.openModal();
        } else {
          this.closeModal();
        }
      });
  }

  public openModal() {
    const modal = document.getElementById('student-response-edit-modal');
    if (modal) {
      modal.style.display = 'block';
    }
  }

  public closeModal() {
    const modal = document.getElementById('student-response-edit-modal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  private updateForm(responses: any) {
    Object.keys(responses).forEach((field: string) => {
      this.templateFields = this.templateFields?.concat(field);
      this.dynamicForm.addControl(
        field,
        new FormControl(responses[field], Validators.required),
      );
    });
  }

  public onSubmit(): void {
    if (this.dynamicForm?.valid) {
      const formValues = this.dynamicForm.value;

      let editedStudentResponse = {
        responses: formValues,
      };

      this.templateService
        .editStudentResponse(this.studentResponse.id, editedStudentResponse)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(
          (data) => {
            console.log(data);
            const updatedStudentResponses = this.studentResponses.map(
              (studentResponse: any) =>
                studentResponse.id === data.id ? data : studentResponse,
            );
            this.templateService.setAllStudentsResponsesSource(
              updatedStudentResponses,
            );
            this.closeModal();
          },
          (error) => {
            console.error('Error editing student response', error);
            this.templateService.setAllStudentsResponsesSource(
              this.studentResponses,
            );
            this.closeModal();
          },
        );
      this.dynamicForm.reset();
    } else {
      console.log('Form is invalid');
    }
  }

  public isFormValid(): boolean {
    return (
      this.dynamicForm.valid &&
      Object.keys(this.dynamicForm.controls).length > 0
    );
  }
}
