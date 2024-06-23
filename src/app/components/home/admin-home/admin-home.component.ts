import {
  AfterViewInit,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import {TemplateService} from '../../../services/template.service';
import {CommonModule} from '@angular/common';
import {Specialization} from '../../../enums/specialization.enum';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';

import {DomSanitizer} from '@angular/platform-browser';
import {AdminModalAddComponent} from './admin-modal-add/admin-modal-add.component';
import {ModalViewComponent} from '../shared/modal-view/modal-view.component';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {AdminModalDeleteComponent} from './admin-modal-delete/admin-modal-delete.component';
import {AdminModalEditComponent} from './admin-modal-edit/admin-modal-edit.component';
import {ToastService} from '../../../services/toast.service';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AdminModalAddComponent,
    ModalViewComponent,
    AdminModalDeleteComponent,
    AdminModalEditComponent,
  ],
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.scss',
})
export class AdminHomeComponent
  implements OnInit, AfterViewInit
{
  public specializations = Object.values(Specialization);
  public form: FormGroup = new FormGroup({
    specializations: new FormArray([]),
  });
  public templates: any = [];
  private readonly sanitizer = inject(DomSanitizer);
  private readonly templateService =
    inject(TemplateService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toasterService = inject(ToastService);

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

  ngAfterViewInit(): void {
    this.initializeDropdowns();
  }

  private initializeDropdowns() {
    const dropdownDefaultCheckbox = document.getElementById(
      'dropdownDefaultCheckbox',
    );

    const dropdownCheckboxButton = document.getElementById(
      'dropdownCheckboxButton',
    );

    if (dropdownDefaultCheckbox && dropdownCheckboxButton) {
      dropdownCheckboxButton.addEventListener(
        'click',
        () => {
          dropdownDefaultCheckbox.classList.toggle(
            'hidden',
          );
        },
      );
    }
  }

  public downloadTemplate(template: string) {
    const parts = template.split('\\');
    this.templateService
      .downloadTemplate(parts[parts.length - 1])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(
        (response) => {
          const blob = new Blob([response], {
            type: response.type,
          });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'template';
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        },
        () => {
          this.toasterService.showError(
            'Eroare la descărcarea fișierului!',
          );
        },
      );
  }

  private initSpecializations() {
    this.specializations.forEach(() => {
      (
        this.form.controls['specializations'] as FormArray
      ).push(new FormControl(false));
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
    const selectedSpecializations =
      this.getSelectedSpecializations();
    this.templateService
      .getTemplates(selectedSpecializations)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(
        (data) => {
          this.templateService.setTemplatesSource(data);
        },
        () => {
          this.toasterService.showError(
            'Eroare la afișarea de template-uri!',
          );
          this.templateService.setTemplatesSource(null);
        },
      );
  }

  public loadDocument(filePath: string): void {
    const parts = filePath.split(/uploads[\\/]/);
    this.templateService
      .getFileUrl(parts[1])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(
        (response) => {
          const safeHtmlContent =
            this.sanitizer.bypassSecurityTrustHtml(
              response.html,
            );
          this.templateService.setViewModalContent(
            safeHtmlContent,
          );
        },
        () => {
          this.toasterService.showError(
            'Eroare la vizualizarea template-ului!',
          );
        },
      );
  }

  public openDeleteTemplateModal(id: number) {
    this.templateService.setDeleteModal(id);
  }

  public openEditTemplateModal(id: number) {
    this.templateService.setEditModal(id);
  }

  public openAddTemplateModal() {
    this.templateService.setAddModal(true);
  }
}
