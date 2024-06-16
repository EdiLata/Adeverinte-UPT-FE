import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {ToastService} from '../../../services/toast.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ToastType} from '../../../enums/toast-type.enum';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
})
export class ToastComponent implements OnInit {
  public message: string = '';
  public type: ToastType = ToastType.SUCCESS;
  public show: boolean = false;
  protected readonly ToastType = ToastType;
  private readonly toastService = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.toastService
      .getToastState()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((state) => {
        if (state) {
          this.message = state.message;
          this.type = state.type;
          this.show = true;

          setTimeout(() => {
            this.show = false;
          }, 3000);
        } else {
          this.show = false;
        }
      });
  }

  public closeToast() {
    this.toastService.closeToast();
  }
}
