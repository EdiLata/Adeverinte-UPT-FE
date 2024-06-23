import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';

import {SecretaryModalGenerateReportComponent} from './secretary-modal-generate-report.component';

describe('SecretaryModalGenerateReportComponent', () => {
  let component: SecretaryModalGenerateReportComponent;
  let fixture: ComponentFixture<SecretaryModalGenerateReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecretaryModalGenerateReportComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      SecretaryModalGenerateReportComponent,
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
