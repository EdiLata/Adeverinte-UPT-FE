import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';

import {AdminModalDeleteComponent} from './admin-modal-delete.component';

describe('ModalDeleteComponent', () => {
  let component: AdminModalDeleteComponent;
  let fixture: ComponentFixture<AdminModalDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminModalDeleteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      AdminModalDeleteComponent,
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
