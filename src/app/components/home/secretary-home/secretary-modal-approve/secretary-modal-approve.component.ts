import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {TemplateService} from '../../../../services/template.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ResponseStatus} from '../../../../enums/response-status.enum';
import {ToastService} from '../../../../services/toast.service';

@Component({
  selector: 'app-secretary-modal-approve',
  standalone: true,
  imports: [],
  templateUrl: './secretary-modal-approve.component.html',
  styleUrl: './secretary-modal-approve.component.scss',
})
export class SecretaryModalApproveComponent implements OnInit {
  public studentResponseId: number | null = null;
  public studentResponses: any = [];
  private totalItems = 10;
  private readonly destroyRef = inject(DestroyRef);
  private readonly templateService = inject(TemplateService);
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
      .getApproveModal()
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
    const modal = document.getElementById('student-response-approve-modal');
    if (modal) {
      modal.style.display = 'block';
    }
  }

  public closeModal() {
    const modal = document.getElementById('student-response-approve-modal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  public approveStudentResponse(id: number | null) {
    if (id) {
      this.templateService
        .updateStudentResponseStatus(id, {
          status: ResponseStatus.APPROVED,
        })
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(
          () => {
            const studentResponsesAfterApproval = this.studentResponses?.filter(
              (item: any) => item.id !== id,
            );

            this.templateService.setAllStudentsResponsesSource({
              items: studentResponsesAfterApproval,
              totalItems: this.totalItems - 1,
            });
            this.toasterService.showSuccess('Adeverință aprobată cu succes!');
            this.closeModal();
          },
          () => {
            this.toasterService.showError(
              'Adeverința nu au putut fi aprobată!',
            );
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
