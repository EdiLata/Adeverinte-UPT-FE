import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {TemplateService} from '../../../../services/template.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-modal-delete',
  standalone: true,
  imports: [],
  templateUrl: './modal-delete.component.html',
  styleUrl: './modal-delete.component.scss',
})
export class ModalDeleteComponent implements OnInit {
  public templateId: number | null = null;
  public templates: any = [];
  private readonly destroyRef = inject(DestroyRef);
  private readonly templateService = inject(TemplateService);

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
    const modal = document.getElementById('delete-modal');
    if (modal) {
      modal.style.display = 'block';
    }
  }

  public closeModal() {
    const modal = document.getElementById('delete-modal');
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
            const templateAfterRemoval = this.templates.filter(
              (item: any) => item.id !== id,
            );
            this.templateService.setTemplatesSource(templateAfterRemoval);
            this.closeModal();
          },
          (error) => {
            console.error('Error deleting template', error);
            this.templateService.setTemplatesSource(this.templates);
            this.closeModal();
          },
        );
    }
  }
}
