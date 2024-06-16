import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {TemplateService} from '../../../../services/template.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ToastService} from '../../../../services/toast.service';

@Component({
  selector: 'app-admin-modal-delete',
  standalone: true,
  imports: [],
  templateUrl: './admin-modal-delete.component.html',
  styleUrl: './admin-modal-delete.component.scss',
})
export class AdminModalDeleteComponent implements OnInit {
  public templateId: number | null = null;
  public templates: any = [];
  private readonly destroyRef = inject(DestroyRef);
  private readonly templateService = inject(TemplateService);
  private readonly toasterService = inject(ToastService);

  ngOnInit() {
    this.templateService
      .getTemplatesSource()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.templates = value;
      });

    this.templateService
      .getDeleteModal()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.templateId = value;
        if (value) {
          this.openModal();
        } else {
          this.closeModal();
        }
      });
  }

  public openModal() {
    const modal = document.getElementById('admin-delete-modal');
    if (modal) {
      modal.style.display = 'block';
    }
  }

  public closeModal() {
    const modal = document.getElementById('admin-delete-modal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  public deleteTemplate(id: number | null) {
    if (id) {
      this.templateService
        .deleteTemplate(id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(
          () => {
            const templatesAfterRemoval = this.templates.filter(
              (item: any) => item.id !== id,
            );
            this.templateService.setTemplatesSource(templatesAfterRemoval);
            this.toasterService.showSuccess('Template șters cu succes!');
            this.closeModal();
          },
          () => {
            this.toasterService.showError('Template-ul nu a putut fi șters!');
            this.templateService.setTemplatesSource(this.templates);
            this.closeModal();
          },
        );
    }
  }
}
