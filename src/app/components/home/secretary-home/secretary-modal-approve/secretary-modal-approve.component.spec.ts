import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SecretaryModalApproveComponent} from './secretary-modal-approve.component';

describe('SecretaryModalApproveComponent', () => {
  let component: SecretaryModalApproveComponent;
  let fixture: ComponentFixture<SecretaryModalApproveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecretaryModalApproveComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SecretaryModalApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
