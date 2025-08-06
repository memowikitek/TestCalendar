import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-title-cycle-bar',
    templateUrl: './title-cycle-bar.component.html',
    styleUrls: ['./title-cycle-bar.component.scss'],
    standalone: false
})
export class TitleCycleBarComponent {
  @Input() nombre: string;
  @Input() proceso: string;
}
