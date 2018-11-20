import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordingDetailsDialogComponent } from './recording-details-dialog.component';

describe('RecordingDetailsDialogComponent', () => {
  let component: RecordingDetailsDialogComponent;
  let fixture: ComponentFixture<RecordingDetailsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordingDetailsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordingDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
