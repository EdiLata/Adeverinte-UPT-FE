import {
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import {TemplateService} from '../../../../services/template.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ToastService} from '../../../../services/toast.service';

@Component({
  selector: 'app-student-response-modal-delete',
  standalone: true,
  imports: [],
  templateUrl:
    './student-response-modal-delete.component.html',
  styleUrl:
    './student-response-modal-delete.component.scss',
})
export class StudentResponseModalDeleteComponent
  implements OnInit
{
  public studentResponseId: number | null = null;
  public studentResponses: any = [];
  private readonly destroyRef = inject(DestroyRef);
  private readonly templateService =
    inject(TemplateService);
  private readonly toasterService = inject(ToastService);

  ngOnInit() {
    this.templateService
      .getStudentResponsesSource()
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
    const modal = document.getElementById(
      'student-response-delete-modal',
    );
    if (modal) {
      modal.style.display = 'block';
    }
  }

  public closeModal() {
    const modal = document.getElementById(
      'student-response-delete-modal',
    );
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
            const studentResponsesAfterRemoval =
              this.studentResponses.filter(
                (item: any) => item.id !== id,
              );
            this.templateService.setStudentResponsesSource(
              studentResponsesAfterRemoval,
            );
            this.toasterService.showSuccess(
              'Adeverință ștearsă cu succes!',
            );
            this.closeModal();
          },
          () => {
            this.toasterService.showError(
              'Eroare la ștergerea adeverinței!',
            );
            this.templateService.setStudentResponsesSource(
              this.studentResponses,
            );
            this.closeModal();
          },
        );
    }
  }
}
