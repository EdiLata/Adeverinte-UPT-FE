import {
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import {TemplateService} from '../../../../services/template.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {CommonModule} from '@angular/common';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {Specialization} from '../../../../enums/specialization.enum';
import {ToastService} from '../../../../services/toast.service';

@Component({
  selector: 'app-admin-modal-edit',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './admin-modal-edit.component.html',
  styleUrl: './admin-modal-edit.component.scss',
})
export class AdminModalEditComponent implements OnInit {
  public specializations = Object.values(Specialization);
  public fileError: string | null = null;
  public specializationsError: string | null = null;
  public modalForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    modalSpecializations: new FormArray(
      [],
      Validators.required,
    ),
    templateFile: new FormControl(null),
    dynamicInputs: new FormArray([], Validators.required),
  });
  public templates: any = [];
  public template: any = null;
  public isTemplateUploadEnabled: boolean = false;
  private readonly destroyRef = inject(DestroyRef);
  private readonly templateService =
    inject(TemplateService);
  private readonly toasterService = inject(ToastService);

  ngOnInit() {
    this.modalForm.controls[
      'modalSpecializations'
    ].valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        if (value.every((element: boolean) => !element)) {
          this.specializationsError =
            'Trebuie să selectezi minim o specializare.';
        } else {
          this.specializationsError = null;
        }
      });

    this.templateService
      .getTemplatesSource()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.templates = value;
      });

    this.initSpecializations();

    this.templateService
      .getEditModal()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((id) => {
        if (id) {
          this.templateService
            .getTemplate(id)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((data) => {
              this.template = data;
              this.updateForm(this.template);
            });
          this.openModal();
        } else {
          this.closeModal();
        }
      });
  }

  public openModal() {
    const modal = document.getElementById(
      'admin-edit-modal',
    );
    if (modal) {
      modal.style.display = 'block';
    }
  }

  public closeModal() {
    const modal = document.getElementById(
      'admin-edit-modal',
    );
    if (modal) {
      modal.style.display = 'none';
    }
  }
  private initSpecializations() {
    this.specializations.forEach(() => {
      (
        this.modalForm.controls[
          'modalSpecializations'
        ] as FormArray
      ).push(new FormControl(false, Validators.required));
    });
  }

  private getSelectedSpecializations() {
    const modalSpecializationsArray = this.modalForm.get(
      'modalSpecializations',
    ) as FormArray;
    return modalSpecializationsArray.value
      .map((checked: boolean, index: number) =>
        checked ? this.specializations[index] : null,
      )
      .filter((value: string | null) => value !== null);
  }

  public onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const fileExtension = file.name
        .split('.')
        .pop()
        ?.toLowerCase();
      if (fileExtension === 'docx') {
        this.modalForm.patchValue({
          templateFile: file,
        });
        this.fileError = null;
      } else {
        this.modalForm.patchValue({
          templateFile: null,
        });
        this.fileError =
          'Fișierul trebuie să aibă extensia .docx';
      }
    }
  }

  get modalSpecializations(): FormArray {
    return this.modalForm.get(
      'modalSpecializations',
    ) as FormArray;
  }

  get dynamicInputs(): FormArray {
    return this.modalForm.get('dynamicInputs') as FormArray;
  }

  public addInput(): void {
    this.dynamicInputs.push(
      new FormControl('', Validators.required),
    );
  }

  public removeInput(index: number): void {
    this.dynamicInputs.removeAt(index);
  }

  public onSubmit(): void {
    if (this.modalForm.valid) {
      let template = {
        name: this.modalForm.controls['name'].value,
        specializations: this.getSelectedSpecializations(),
        file: this.modalForm.controls['templateFile'].value,
        fields:
          this.modalForm.controls['dynamicInputs'].value,
      };

      const formData = new FormData();
      if (this.modalForm.controls['templateFile'].value) {
        formData.append(
          'file',
          template.file,
          template.file.name,
        );
      }
      formData.append('name', template.name);
      formData.append('fields', template.fields);
      formData.append(
        'specializations',
        template.specializations,
      );

      this.templateService
        .editTemplate(this.template.id, formData)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(
          (data) => {
            const updatedTemplates = this.templates.map(
              (template: any) =>
                template.id === data.id ? data : template,
            );
            this.templateService.setTemplatesSource(
              updatedTemplates,
            );
            this.toasterService.showSuccess(
              'Template editat cu succes!',
            );
            this.closeModal();
          },
          () => {
            this.toasterService.showError(
              'Template-ul nu a putut fi editat!',
            );
            this.templateService.setTemplatesSource(
              this.templates,
            );
            this.closeModal();
          },
        );
    }
  }

  private updateForm(template: any) {
    if (template.name) {
      this.modalForm.patchValue({
        name: template.name,
      });
    }

    const modalSpecializationsArray = this.modalForm.get(
      'modalSpecializations',
    ) as FormArray;
    modalSpecializationsArray.clear();

    if (
      template.specializations &&
      Array.isArray(template.specializations)
    ) {
      const result = this.specializations.map((item) =>
        template.specializations.includes(item),
      );
      result.forEach((checked) => {
        modalSpecializationsArray.push(
          new FormControl(checked),
        );
      });
    }

    const dynamicInputsArray = this.modalForm.get(
      'dynamicInputs',
    ) as FormArray;
    dynamicInputsArray.clear();
    if (template.fields && Array.isArray(template.fields)) {
      template.fields.forEach((input: any) => {
        dynamicInputsArray.push(
          new FormControl(input.fieldName),
        );
      });
    }
  }

  public toggleTemplateUpload() {
    this.isTemplateUploadEnabled =
      !this.isTemplateUploadEnabled;
    this.fileError = null;
  }
}
