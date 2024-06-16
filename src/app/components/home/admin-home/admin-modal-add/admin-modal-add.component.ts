import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {Specialization} from '../../../../enums/specialization.enum';
import {TemplateService} from '../../../../services/template.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ToastService} from '../../../../services/toast.service';

@Component({
  selector: 'app-admin-modal-add',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './admin-modal-add.component.html',
  styleUrl: './admin-modal-add.component.scss',
})
export class AdminModalAddComponent implements OnInit {
  public specializations = Object.values(Specialization);
  public fileError: string | null = null;
  public specializationsError: string | null = null;
  public modalForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    modalSpecializations: new FormArray([], Validators.required),
    templateFile: new FormControl(null, Validators.required),
    dynamicInputs: new FormArray([], Validators.required),
  });
  public templates: any = [];
  private readonly templateService = inject(TemplateService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toasterService = inject(ToastService);

  ngOnInit() {
    this.modalForm.controls['modalSpecializations'].valueChanges
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
      .getAddModal()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        if (value) {
          this.openModal();
        } else {
          this.closeModal();
        }
      });

    this.initSpecializations();
    this.templateService
      .getTemplatesSource()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.templates = value;
      });
  }

  private initSpecializations() {
    this.specializations.forEach(() => {
      (this.modalForm.controls['modalSpecializations'] as FormArray).push(
        new FormControl(false, Validators.required),
      );
    });
  }

  private getSelectedSpecializations() {
    return this.modalForm.controls['modalSpecializations'].value
      .map((checked: boolean, index: number) =>
        checked ? this.specializations[index] : null,
      )
      .filter((value: string | null) => value !== null);
  }

  public onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (fileExtension === 'docx') {
        this.modalForm.patchValue({templateFile: file});
        this.fileError = null;
      } else {
        this.modalForm.patchValue({templateFile: null});
        this.fileError = 'Fișierul trebuie să aibă extensia .docx';
      }
    }
  }

  get dynamicInputs(): FormArray {
    return this.modalForm.get('dynamicInputs') as FormArray;
  }

  public addInput(): void {
    this.dynamicInputs.push(new FormControl('', Validators.required));
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
        fields: this.modalForm.controls['dynamicInputs'].value,
      };

      const formData = new FormData();
      formData.append('file', template.file, template.file.name);
      formData.append('name', template.name);
      formData.append('fields', template.fields);
      formData.append('specializations', template.specializations);

      this.templateService
        .uploadTemplate(formData)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(
          (data) => {
            this.templateService.setTemplatesSource(
              this.templates.concat(data),
            );
            this.toasterService.showSuccess('Template adăugat cu succes!');
            this.closeModal();
          },
          () => {
            this.toasterService.showError('Template-ul nu a putut fi adăugat!');
            this.templateService.setTemplatesSource(this.templates);
            this.closeModal();
          },
        );
    }
  }

  public openModal() {
    const modal = document.getElementById('admin-add-modal');
    if (modal) {
      modal.style.display = 'block';
    }
  }

  public closeModal() {
    const modal = document.getElementById('admin-add-modal');
    if (modal) {
      modal.style.display = 'none';
    }
  }
}
