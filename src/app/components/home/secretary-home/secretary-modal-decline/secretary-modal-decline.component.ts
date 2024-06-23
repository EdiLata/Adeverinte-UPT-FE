import {
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import {TemplateService} from '../../../../services/template.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ResponseStatus} from '../../../../enums/response-status.enum';
import {ToastService} from '../../../../services/toast.service';

@Component({
  selector: 'app-secretary-modal-decline',
  standalone: true,
  imports: [],
  templateUrl: './secretary-modal-decline.component.html',
  styleUrl: './secretary-modal-decline.component.scss',
})
export class SecretaryModalDeclineComponent
  implements OnInit
{
  public studentResponseId: number | null = null;
  public studentResponses: any = [];
  private totalItems = 10;
  private readonly destroyRef = inject(DestroyRef);
  private readonly templateService =
    inject(TemplateService);
  private readonly toasterService = inject(ToastService);

  ngOnInit() {
    this.templateService
      .getAllStudentsResponsesSource()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.studentResponses = value?.items;
        this.totalItems = value?.totalItems;
      });

    this.templateService
      .getDeclineModal()
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
      'student-response-decline-modal',
    );
    if (modal) {
      modal.style.display = 'block';
    }
  }

  public closeModal() {
    const modal = document.getElementById(
      'student-response-decline-modal',
    );
    if (modal) {
      modal.style.display = 'none';
    }
  }

  public declineStudentResponse(id: number | null) {
    if (id) {
      this.templateService
        .updateStudentResponseStatus(id, {
          status: ResponseStatus.DECLINED,
        })
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(
          () => {
            const studentResponsesAfterDecline =
              this.studentResponses?.filter(
                (item: any) => item.id !== id,
              );

            this.templateService.setAllStudentsResponsesSource(
              {
                items: studentResponsesAfterDecline,
                totalItems: this.totalItems - 1,
              },
            );
            this.toasterService.showSuccess(
              'Adeverință respinsă cu succes!',
            );
            this.closeModal();
          },
          () => {
            this.toasterService.showError(
              'Adeverința nu au putut fi respinsă!',
            );
            this.templateService.setAllStudentsResponsesSource(
              {
                items: this.studentResponses,
                totalItems: this.totalItems,
              },
            );
            this.closeModal();
          },
        );
    }
  }
}
