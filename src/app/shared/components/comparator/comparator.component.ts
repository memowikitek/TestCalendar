import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-comparator',
    templateUrl: './comparator.component.html',
    styleUrls: ['./comparator.component.scss'],
    standalone: false
})
export class ComparatorComponent {
  @Input() title1: string;
  @Input() title2: string;

  constructor() {
    this.title1 = '';
    this.title2 = '';
  }
}
