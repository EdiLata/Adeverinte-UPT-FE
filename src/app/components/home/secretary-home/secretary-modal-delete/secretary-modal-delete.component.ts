import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {TemplateService} from '../../../../services/template.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-secretary-modal-delete',
  standalone: true,
  imports: [],
  templateUrl: './secretary-modal-delete.component.html',
  styleUrl: './secretary-modal-delete.component.scss',
})
export class SecretaryModalDeleteComponent implements OnInit {
  public studentResponseId: number | null = null;
  public studentResponses: any = [];
  private readonly destroyRef = inject(DestroyRef);
  private readonly templateService = inject(TemplateService);

  ngOnInit() {
    this.templateService
      .getAllStudentsResponsesSource()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.studentResponses = value;
      });

    this.templateService
      .getDeleteModal()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.studentResponseId = value;
        if (value) {
          this.openModal();
        } else {
          this.closeModal();
        }
      });
  }

  public openModal() {
    const modal = document.getElementById('student-response-delete-modal');
    if (modal) {
      modal.style.display = 'block';
    }
  }

  public closeModal() {
    const modal = document.getElementById('student-response-delete-modal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  public deleteStudentResponse(id: number | null) {
    if (id) {
      this.templateService
        .deleteStudentResponse(id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(
          () => {
            const studentResponsesAfterRemoval = this.studentResponses?.filter(
              (item: any) => item.id !== id,
            );
            this.templateService.setAllStudentsResponsesSource(
              studentResponsesAfterRemoval,
            );
            this.closeModal();
          },
          (error) => {
            console.error('Error deleting student response', error);
            this.templateService.setAllStudentsResponsesSource(
              this.studentResponses,
            );
            this.closeModal();
          },
        );
    }
  }
}