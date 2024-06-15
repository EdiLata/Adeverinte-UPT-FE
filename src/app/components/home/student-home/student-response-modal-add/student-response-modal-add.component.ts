import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {TemplateService} from '../../../../services/template.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-student-response-modal-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './student-response-modal-add.component.html',
  styleUrl: './student-response-modal-add.component.scss',
})
export class StudentResponseModalAddComponent implements OnInit {
  public studentSpecialization: any = null;
  public studentResponses: any = [];
  public studentId: number | null = null;
  public templateId: number | null = null;
  public templateTypes: any = [];
  public templateFields: any = [];
  public templateTypeControl = new FormControl('');
  public dynamicForm: FormGroup = new FormGroup({});
  private hasMotivInResponse = false;
  private readonly templateService = inject(TemplateService);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.templateService
      .getAddModal()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        if (value) {
          this.openModal();
        } else {
          this.closeModal();
        }
      });

    this.templateTypeControl.valueChanges.subscribe((value) => {
      this.templateId = Number(value);
      this.templateService
        .getTemplateFields(value as any)
        .subscribe((templateFields) => {
          this.templateFields = templateFields?.map((templateField: any) => {
            return templateField.fieldName;
          });

          if (!this.templateFields.includes('motiv')) {
            this.templateFields.push('motiv');
            this.hasMotivInResponse = false;
          } else {
            this.hasMotivInResponse = true;
          }

          this.dynamicForm = new FormGroup({});

          this.templateFields.forEach((field: any) => {
            this.dynamicForm.addControl(
              field,
              new FormControl('', Validators.required),
            );
          });
        });
    });

    this.templateService
      .getStudentResponsesSource()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.studentResponses = value;
        this.studentId = value?.[0]?.student.id;
        this.studentSpecialization = value?.[0]?.student.specialization;
        if (this.studentSpecialization) {
          this.studentSpecialization = [this.studentSpecialization];

          this.templateService
            .getTemplates(this.studentSpecialization)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((data) => {
              this.templateTypes = data?.map((item: any) => {
                return {
                  name: item.name,
                  id: item.id,
                };
              });
            });
        }
      });
  }

  public onSubmit() {
    if (this.dynamicForm?.valid) {
      const {motiv, ...formValueWithoutMotiv} = this.dynamicForm.value;

      let filledTemplate = {
        templateId: this.templateId,
        studentId: this.studentId,
        responses: this.hasMotivInResponse
          ? {motiv, ...formValueWithoutMotiv}
          : formValueWithoutMotiv,
        reason: motiv,
      };

      this.templateService
        .fillTemplate(filledTemplate)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(
          (data) => {
            console.log(data);
            this.templateService.setStudentResponsesSource(
              this.studentResponses.concat(data),
            );
            this.closeModal();
          },
          (error) => {
            console.error('Error filling template', error);
            this.templateService.setTemplatesSource(this.studentResponses);
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

  public openModal() {
    const modal = document.getElementById('student-response-add-modal');
    if (modal) {
      modal.style.display = 'block';
    }
  }

  public closeModal() {
    const modal = document.getElementById('student-response-add-modal');
    if (modal) {
      modal.style.display = 'none';
    }
  }
}
