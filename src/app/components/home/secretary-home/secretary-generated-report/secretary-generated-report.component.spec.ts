import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';

import {SecretaryGeneratedReportComponent} from './secretary-generated-report.component';

describe('SecretaryGeneratedReportComponent', () => {
  let component: SecretaryGeneratedReportComponent;
  let fixture: ComponentFixture<SecretaryGeneratedReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecretaryGeneratedReportComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      SecretaryGeneratedReportComponent,
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
