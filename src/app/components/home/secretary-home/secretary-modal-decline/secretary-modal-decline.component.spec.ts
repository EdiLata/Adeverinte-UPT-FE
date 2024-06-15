import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SecretaryModalDeclineComponent} from './secretary-modal-decline.component';

describe('SecretaryModalDeclineComponent', () => {
  let component: SecretaryModalDeclineComponent;
  let fixture: ComponentFixture<SecretaryModalDeclineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecretaryModalDeclineComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SecretaryModalDeclineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
