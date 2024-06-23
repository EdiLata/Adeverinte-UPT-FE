import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';

import {SecretaryModalDeleteComponent} from './secretary-modal-delete.component';

describe('SecretaryModalDeleteComponent', () => {
  let component: SecretaryModalDeleteComponent;
  let fixture: ComponentFixture<SecretaryModalDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecretaryModalDeleteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      SecretaryModalDeleteComponent,
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
