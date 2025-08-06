import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'app-select-simple',
    templateUrl: './select-simple.component.html',
    styleUrls: ['./select-simple.component.scss'],
    standalone: false
})
export class SelectSimpleComponent implements OnInit {
  @Input() Name: string;
  @Input() label: string;
  @Input() list: any[];
  @Input() item: string; // Variable para row.id
  @Input() title: string; // Variable para row.nombre

  @Output() optionSelected = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit(): void {
    console.log('NAME:', this.Name);

  }

  onSelectionChange(event: any) {
    this.optionSelected.emit(event.value);
    console.log(event.value);
  }

  getValue(value: any) {
      return value;
  }
}
