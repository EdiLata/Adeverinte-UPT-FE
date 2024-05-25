import {Component, inject, OnInit} from '@angular/core';
import {TemplateService} from '../../../services/template.service';
import {CommonModule} from '@angular/common';
import {Specialization} from '../../../enums/specialization.enum';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import {ModalComponent} from './modal/modal.component';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalComponent],
  providers: [TemplateService],
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.scss',
})
export class AdminHomeComponent implements OnInit {
  public specializations = Object.values(Specialization);
  public templates: any[] = [];
  public form: FormGroup = new FormGroup({
    specializations: new FormArray([]),
  });
  private readonly templateService = inject(TemplateService);

  ngOnInit() {
    this.initSpecializations();
    this.getTemplates();
  }

  public downloadTemplate(template: string) {
    const parts = template.split('\\');
    this.templateService.downloadTemplate(parts[parts.length - 1]).subscribe(
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

  private initSpecializations() {
    this.specializations.forEach(() => {
      (this.form.controls['specializations'] as FormArray).push(
        new FormControl(false),
      );
    });

    this.form.controls['specializations'].valueChanges.subscribe((data) => {
      console.log(data);
      this.getTemplates();
    });
  }

  private getSelectedSpecializations() {
    return this.form.controls['specializations'].value
      .map((checked: boolean, index: number) =>
        checked ? this.specializations[index] : null,
      )
      .filter((value: string | null) => value !== null);
  }

  private getTemplates() {
    const selectedSpecializations = this.getSelectedSpecializations();
    console.log(selectedSpecializations);
    this.templateService.getTemplates(selectedSpecializations).subscribe(
      (data) => {
        console.log(data);
        this.templates = data;
      },
      (error) => {
        console.error('Error fetching templates', error);
      },
    );
  }
}
