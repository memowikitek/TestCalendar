import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-title-bar',
    templateUrl: './title-bar.component.html',
    styleUrls: ['./title-bar.component.scss'],
    standalone: false
})
export class TitleBarComponent implements OnInit {
  @Input() title?: string;
  @Input() desc?: string;

  constructor() { }

  ngOnInit(): void {
  }

}
