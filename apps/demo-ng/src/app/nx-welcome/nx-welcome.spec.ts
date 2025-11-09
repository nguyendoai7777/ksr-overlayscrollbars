import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NxWelcome } from './nx-welcome';

describe('NxWelcome', () => {
  let component: NxWelcome;
  let fixture: ComponentFixture<NxWelcome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NxWelcome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NxWelcome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
