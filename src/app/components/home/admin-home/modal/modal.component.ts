import {Component, inject, OnInit} from '@angular/core';
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

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  providers: [TemplateService],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent implements OnInit {
  public modalSpecializations = Object.values(Specialization);
  public fileError: string | null = null;
  public modalForm: FormGroup = new FormGroup({
    name: new FormControl(''),
    modalSpecializations: new FormArray([]),
    templateFile: new FormControl(null),
    dynamicInputs: new FormArray([]),
  });
  private readonly templateService = inject(TemplateService);

  ngOnInit() {
    this.initSpecializations();
  }

  private initSpecializations() {
    this.modalSpecializations.forEach(() => {
      (this.modalForm.controls['modalSpecializations'] as FormArray).push(
        new FormControl(false),
      );
    });
  }

  private getSelectedSpecializations() {
    return this.modalForm.controls['modalSpecializations'].value
      .map((checked: boolean, index: number) =>
        checked ? this.modalSpecializations[index] : null,
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

      this.templateService.uploadTemplate(formData).subscribe((data) => {
        console.log(data);
      });
    }
  }
}