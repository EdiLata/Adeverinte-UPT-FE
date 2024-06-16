import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {TemplateService} from '../../../../services/template.service';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {DatePipe, NgForOf, TitleCasePipe} from '@angular/common';
import {ToastService} from '../../../../services/toast.service';

@Component({
  selector: 'app-secretary-generated-report',
  standalone: true,
  imports: [DatePipe, NgForOf, TitleCasePipe, RouterLink],
  templateUrl: './secretary-generated-report.component.html',
  styleUrl: './secretary-generated-report.component.scss',
})
export class SecretaryGeneratedReportComponent implements OnInit {
  public approvedStudentsResponses: any[] = [];
  private readonly templateService = inject(TemplateService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly toasterService = inject(ToastService);

  ngOnInit() {
    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((dateRange) => {
        this.templateService
          .getApprovedResponses(dateRange)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(
            (value) => {
              this.approvedStudentsResponses = value;
            },
            () => {
              this.toasterService.showError(
                'Adeverințele nu au putut fi generate!',
              );
            },
          );
      });
  }

  public printContent(): void {
    const printContent = document.getElementById('print-section')?.innerHTML;
    const WindowPrt = window.open(
      '',
      '',
      'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0',
    );
    WindowPrt?.document.write(`
      <html>
        <head>
          <style>
            @media print {
              @page {
                margin: 0;
                size: auto;
              }
              body {
                margin: 1cm;
              }
              header, footer {
                display: none;
              }
              @page {
                @top-left {
                  content: none;
                }
                @top-right {
                  content: none;
                }
                @bottom-left {
                  content: none;
                }
                @bottom-right {
                  content: none;
                }
              }
            }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);
    WindowPrt?.document.close();
    WindowPrt?.focus();
    WindowPrt?.print();
    WindowPrt?.close();
  }
}
