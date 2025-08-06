import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-title',
    templateUrl: './title.component.html',
    styleUrls: ['./title.component.scss'],
    standalone: false
})
export class TitleComponent {
  @Input() title?: string;
  @Input() desc?: string;

}
