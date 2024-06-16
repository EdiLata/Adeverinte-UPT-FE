import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SafeHtml} from '@angular/platform-browser';
import {TemplateService} from '../../../../services/template.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-modal-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-view.component.html',
  styleUrl: './modal-view.component.scss',
})
export class ModalViewComponent implements OnInit {
  public safeHtmlContent: SafeHtml | null = null;
  private readonly destroyRef = inject(DestroyRef);
  private readonly templateService = inject(TemplateService);

  ngOnInit() {
    this.templateService
      .getViewModalContent()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((content) => {
        this.safeHtmlContent = content;
        if (this.safeHtmlContent) {
          this.openModal();
        } else {
          this.closeModal();
        }
      });
  }

  public openModal() {
    const modal = document.getElementById('view-modal');
    if (modal) {
      modal.style.display = 'block';
    }
  }

  public closeModal() {
    const modal = document.getElementById('view-modal');
    if (modal) {
      modal.style.display = 'none';
    }
  }
}
