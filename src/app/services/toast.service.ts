import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {ToastType} from '../enums/toast-type.enum';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastState = new BehaviorSubject<any>(null);

  public getToastState() {
    return this.toastState.asObservable();
  }

  public showSuccess(message: string): void {
    this.toastState.next({
      message,
      type: ToastType.SUCCESS,
    });
  }

  public showError(message: string): void {
    this.toastState.next({
      message,
      type: ToastType.ERROR,
    });
  }

  public closeToast(): void {
    this.toastState.next(null);
  }
}
