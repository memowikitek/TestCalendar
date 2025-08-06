import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-componentes',
  templateUrl: './componentes.component.html',
  styleUrls: ['./componentes.component.scss']
})
export class ComponentesComponent implements OnInit {
  fecIni: any = '2024-06-05';
  fecFin: any = '2024-07-25';

  //list: any[] = [2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030];
  list: any[] = [
    {
      id: 1,
      nombre: 'nuevo1',
      otro: 'Otro nuevo1'
    },
    {
      id: 2,
      nombre: 'nuevo2',
      otro: 'Otro nuevo2'
    }
  ];
  selectedOption: any;

  constructor() { }

  ngOnInit(): void {
  }

  handleOptionSelected(option: any) {
    this.selectedOption = option;
    console.log('Option selected:', option);
  }

  getValue(value: any) {
    return value;
  }

}
