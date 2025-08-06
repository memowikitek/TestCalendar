import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
    selector: 'app-resumen-bar',
    templateUrl: './resumen-bar.component.html',
    styleUrls: ['./resumen-bar.component.scss'],
    standalone: false
})
export class ResumenBarComponent implements OnInit {

  resumenArray: any[] = [
    {
      id_proceso: 10,
      Ano: 2023,
      Ciclo: "Ciclo2",
      Institucion: "UVM",
      Region: "Centro",
      Campus: "Coyoacán"
    }
  ];

  resumenArray2: any[] = [
    {
      "id proceso": "10",
      "Año": "2023",
      "Ciclo": "Ciclo2",
      "Institución": "UVM",
      "Región": "Centro",
      "Campus": "Coyoacán"
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  getKeys(obj: any): string[] {
    return Object.keys(obj);
  }
}
