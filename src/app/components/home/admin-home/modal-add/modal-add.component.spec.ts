import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ModalAddComponent} from './modal-add.component';

describe('ModalComponent', () => {
  let component: ModalAddComponent;
  let fixture: ComponentFixture<ModalAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalAddComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
