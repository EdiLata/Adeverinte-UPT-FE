import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {TemplateService} from '../../../../services/template.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {Router} from '@angular/router';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-secretary-modal-generate-report',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl:
    './secretary-modal-generate-report.component.html',
  styleUrl:
    './secretary-modal-generate-report.component.scss',
})
export class SecretaryModalGenerateReportComponent
  implements OnInit, AfterViewInit
{
  @ViewChild('startDateField', {static: true})
  public startDateField!: ElementRef;
  @ViewChild('endDateField', {static: true})
  public endDateField!: ElementRef;

  public dateRangeForm: FormGroup = new FormGroup({
    start: new FormControl('', Validators.required),
    end: new FormControl('', Validators.required),
  });
  public isDateRangeInvalid = true;
  private readonly templateService =
    inject(TemplateService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.templateService
      .getGenerateReportModal()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        if (value) {
          this.openModal();
        } else {
          this.closeModal();
        }
      });

    this.dateRangeForm.valueChanges.subscribe((value) => {
      if (value.start && value.end) {
        const start = new Date(value.start);
        const end = new Date(value.end);

        this.isDateRangeInvalid = start > end;
      } else {
        this.isDateRangeInvalid = true;
      }
    });
  }

  ngAfterViewInit() {
    this.initDatePickerElement(
      this.startDateField.nativeElement,
    );
    this.initDatePickerElement(
      this.endDateField.nativeElement,
    );
  }

  public openModal() {
    const modal = document.getElementById(
      'generate-report-modal',
    );
    if (modal) {
      modal.style.display = 'block';
    }
  }

  public closeModal() {
    const modal = document.getElementById(
      'generate-report-modal',
    );
    if (modal) {
      modal.style.display = 'none';
    }
  }

  public generateReport() {
    const queryParams = this.dateRangeForm.value;
    this.router.navigate(['/generated-report'], {
      queryParams,
    });
  }

  private initDatePickerElement(element: any): void {
    new Datepicker(element, {});

    element.addEventListener('changeDate', (e: any) => {
      const value = e.target.value;
      const formControlName = e.target.getAttribute('name');
      const formControl =
        this.dateRangeForm.get(formControlName);
      formControl?.setValue(value);
      formControl?.markAsDirty();
    });
  }
}

declare var Datepicker: any;
