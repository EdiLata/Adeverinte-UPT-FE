import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {TemplateService} from '../../../../services/template.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ResponseStatus} from '../../../../enums/response-status.enum';

@Component({
  selector: 'app-secretary-modal-redo',
  standalone: true,
  imports: [],
  templateUrl: './secretary-modal-redo.component.html',
  styleUrl: './secretary-modal-redo.component.scss',
})
export class SecretaryModalRedoComponent implements OnInit {
  public studentResponseId: number | null = null;
  public studentResponses: any = [];
  private totalItems = 10;
  private readonly destroyRef = inject(DestroyRef);
  private readonly templateService = inject(TemplateService);

  ngOnInit() {
    this.templateService
      .getAllStudentsResponsesSource()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.studentResponses = value?.items;
        this.totalItems = value?.totalItems;
      });

    this.templateService
      .getRedoModal()
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
    const modal = document.getElementById('student-response-redo-modal');
    if (modal) {
      modal.style.display = 'block';
    }
  }

  public closeModal() {
    const modal = document.getElementById('student-response-redo-modal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  public redoStudentResponse(id: number | null) {
    if (id) {
      this.templateService
        .updateStudentResponseStatus(id, {
          status: ResponseStatus.SENT,
        })
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(
          () => {
            const studentResponsesAfterRedoing = this.studentResponses?.filter(
              (item: any) => item.id !== id,
            );

            this.templateService.setAllStudentsResponsesSource({
              items: studentResponsesAfterRedoing,
              totalItems: this.totalItems - 1,
            });
            this.closeModal();
          },
          (error) => {
            console.error('Error redoing student response', error);
            this.templateService.setAllStudentsResponsesSource({
              items: this.studentResponses,
              totalItems: this.totalItems,
            });
            this.closeModal();
          },
        );
    }
  }
}
