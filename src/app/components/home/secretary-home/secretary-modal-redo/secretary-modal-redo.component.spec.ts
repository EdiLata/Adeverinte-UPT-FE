import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SecretaryModalRedoComponent} from './secretary-modal-redo.component';

describe('SecretaryModalRedoComponent', () => {
  let component: SecretaryModalRedoComponent;
  let fixture: ComponentFixture<SecretaryModalRedoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecretaryModalRedoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SecretaryModalRedoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
