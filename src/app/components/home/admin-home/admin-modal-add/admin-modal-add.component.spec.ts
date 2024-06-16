import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AdminModalAddComponent} from './admin-modal-add.component';

describe('ModalComponent', () => {
  let component: AdminModalAddComponent;
  let fixture: ComponentFixture<AdminModalAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminModalAddComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminModalAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
