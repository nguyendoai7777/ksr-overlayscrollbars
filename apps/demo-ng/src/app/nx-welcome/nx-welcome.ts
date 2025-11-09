import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  OverlayScrollbarDestroyed,
  OverlayScrollbarInitialized,
  OverlayScrollbarsComponent,
  OverlayScrollbarScroll,
  OverlayScrollbarUpdated,
} from 'ng-scrollable';
import { OverlayScrollbars } from 'overlayscrollbars';

@Component({
  selector: 'app-nx-welcome',
  imports: [CommonModule, OverlayScrollbarsComponent],
  templateUrl: `./nx-welcome.html`,
  styleUrl: 'nx-welcome.css',
  encapsulation: ViewEncapsulation.None,
})
export class NxWelcome {
  scroll2(instance: OverlayScrollbars, event: Event) {
    console.log(instance, event);
  }

  protected onScroll($event: OverlayScrollbarScroll) {}
  protected osInitialized($event: OverlayScrollbarInitialized) {}
  protected osDestroyed($event: OverlayScrollbarDestroyed) {}
  protected osUpdated($event: OverlayScrollbarUpdated) {}
}
