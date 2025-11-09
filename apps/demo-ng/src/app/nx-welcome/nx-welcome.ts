import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayScrollbarInitialized, OverlayScrollbarsComponent, OverlayScrollbarScroll } from 'ksr-scrollable/ng-scrollable';
import { OverlayScrollbars } from 'overlayscrollbars';

@Component({
  selector: 'app-nx-welcome',
  imports: [CommonModule, OverlayScrollbarsComponent],
  templateUrl: `./nx-welcome.html`,
  styleUrl: 'nx-welcome.css',
  encapsulation: ViewEncapsulation.None,
})
export class NxWelcome {
  protected logOsScroll($event: OverlayScrollbarScroll) {
    console.log($event);
  }

  protected logOsInitial($event: OverlayScrollbarInitialized) {
    console.log(`OS inited`, $event);
  }

  scroll2(instance: OverlayScrollbars, event: Event) {
    console.log(instance, event);
  }
}
