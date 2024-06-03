import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {TemplateService} from '../../../services/template.service';
import {CommonModule} from '@angular/common';
import {Specialization} from '../../../enums/specialization.enum';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';

import {NgxDocViewerModule} from 'ngx-doc-viewer';
import {DomSanitizer} from '@angular/platform-browser';
import {ModalAddComponent} from './modal-add/modal-add.component';
import {ModalViewComponent} from './modal-view/modal-view.component';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ModalDeleteComponent} from './modal-delete/modal-delete.component';
import {ModalEditComponent} from './modal-edit/modal-edit.component';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ModalAddComponent,
    NgxDocViewerModule,
    ModalViewComponent,
    ModalDeleteComponent,
    ModalEditComponent,
  ],
  providers: [TemplateService],
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.scss',
})
export class AdminHomeComponent implements OnInit {
  public specializations = Object.values(Specialization);
  public form: FormGroup = new FormGroup({
    specializations: new FormArray([]),
  });
  public templates: any = [];
  private readonly sanitizer = inject(DomSanitizer);
  private readonly templateService = inject(TemplateService);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.initSpecializations();
    this.getTemplates();
    this.templateService
      .getTemplatesSource()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.templates = value;
      });
  }

  public downloadTemplate(template: string) {
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

  private initSpecializations() {
    this.specializations.forEach(() => {
      (this.form.controls['specializations'] as FormArray).push(
        new FormControl(false),
      );
    });

    this.form.controls['specializations'].valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
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
    this.templateService
      .getTemplates(selectedSpecializations)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(
        (data) => {
          this.templateService.setTemplatesSource(data);
        },
        (error) => {
          console.error('Error fetching templates', error);
          this.templateService.setTemplatesSource(null);
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

  public openDeleteTemplateModal(id: number) {
    this.templateService.setDeleteModal(id);
  }

  public openEditTemplateModal(id: number) {
    this.templateService.setEditModal(id);
  }
}
