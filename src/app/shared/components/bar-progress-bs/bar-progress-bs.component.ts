import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-bar-progress-bs',
  templateUrl: './bar-progress-bs.component.html',
  styleUrls: ['./bar-progress-bs.component.scss'],
  providers: [DatePipe] // Agregar DatePipe como provider
})

export class BarProgressBsComponent implements OnInit {
//Fecha Actual
date = new Date();
dd = this.date.getDate();
month = this.date.getMonth() + 1;
mm = (this.month < 10) ? `0${this.month}` : this.month;
yy = this.date.getFullYear();

//Fechas
@Input() fecIni: any; // Fecha Inicio
@Input() fecFin: any; // Fecha Fin
@Input() etapas: any;
//@Output() opt = new EventEmitter<any>();

//Fecha Inicio
dIni: number;
mIni: number;
yIni: number;

//Fecha Fin
dFin: number;
mFin: number;
yFin: number;

mesResA: string;
mesResI: string;
mesResF: string;
diasXMA: number;
diasXMI: number;
diasRes: number;
diasIni: number;
diasRan: number;
diasAva: number;

//Dias tranacurridos
diasTransHoy: number;
diasTransIni: number;
diasTransFin: number;
diasPeriodo: number;
diasResIni: number;
diasResFin: number;

porcAva: number;
porcentaje: any;
on: boolean = false;
before: boolean = false;
after: boolean = false;

mesesArray: any[] = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Novienbre", "Diciembre"];

  constructor(private datePipe: DatePipe) { }

  ngOnInit(): void { 
    //this.fecIni = '2024-05-24';
    //this.fecFin = '2024-05-23'
    console.log(this.fecIni,this.fecFin);
    //Fecha Inicio
    this.dIni = parseInt(this.fecIni.substr(8, 2));
    this.mIni = parseInt(this.fecIni.substr(5, 2));
    this.yIni = parseInt(this.fecIni.substr(0, 4));

    //Fecha Fin
    this.dFin = parseInt(this.fecFin.substr(8, 2));
    this.mFin = parseInt(this.fecFin.substr(5, 2));
    this.yFin = parseInt(this.fecFin.substr(0, 4));
    this.calFec();
    this.styleMenu();
  }

  calFec() {
    console.log('Fecha Actual: ' + this.fechaActual());
    this.diasTransHoy = this.diasTranscurridos(new Date(this.yy,this.month,this.dd)); console.log('Dias Transcurridos Hoy', this.diasTransHoy);
    this.diasTransIni = this.diasTranscurridos(new Date(this.yIni,this.mIni,this.dIni)); console.log('Dias Transcurridos Inicio',this.diasTransIni,this.fecIni);
    this.diasTransFin = this.diasTranscurridos(new Date(this.yFin,this.mFin,this.dFin)); console.log('Dias Transcurridos Fin',this.diasTransFin,this.fecFin);
    this.diasPeriodo = this.diasTransFin - this.diasTransIni; console.log('Dias Periodo',this.diasPeriodo);
    this.diasResIni = (this.diasTransIni >= this.diasTransHoy)? this.diasTransIni - this.diasTransHoy:0; console.log('Dias Restantes Inicio',this.diasResIni);
    this.diasResFin = (this.diasTransFin >= this.diasTransHoy)? this.diasTransFin - (this.diasTransHoy - 1):0; console.log('Dias Restantes Fin',this.diasResFin);
    //Meses
    this.mesResI = this.mesesArray[this.mIni - 1]; //console.log('Mes Inicio: ' + this.mesResI);
    this.mesResF = this.mesesArray[this.mFin - 1]; //console.log('Mes Final: ' + this.mesResF);
    // Verificar si la fecha actual está dentro del rango
    this.before = this.diasTransIni > this.diasTransHoy; console.log('before:' + this.before);
    this.on = this.diasTransHoy >= this.diasTransIni && this.diasTransHoy <= this.diasTransFin; console.log('on:' + this.on);
    this.after = this.diasResFin === 0; console.log('after:' + this.after);
    //.toFixed(2)
    this.porcAva = (100 / this.diasPeriodo) * (this.diasPeriodo - this.diasResFin); console.log(this.porcAva);
    this.porcentaje = (this.on) ? this.porcAva.toFixed(2) : 0; console.log('Porcentaje: '+this.porcentaje);
  }

  diasEnUnMes(m: string, y: any) {
    return new Date(y, this.mesesArray.indexOf(m) + 1, 0).getDate();
  }

  fechaActual() {
    let date = new Date();
    let dd = date.getDate();
    let month = date.getMonth() + 1;
    let mm = (month < 10) ? `0${month}` : month;
    let yy = date.getFullYear();
    let fecha = `${yy}-${mm}-${dd}`;
    var hora = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    return fecha + ' ' + hora;
  }

  obtenerFechaFormateada(fecha: string): string {
    return this.datePipe.transform(fecha, 'MMMM dd, yyyy') || '';
  }

  diasTranscurridos(fecha: any){
    const previo: any = new Date(2024,1,1);
    const actual: any = new Date(fecha.getTime());
    return Math.ceil((actual - previo + 1) / 86400000);
  }

  styleMenu() {
    const btnT = document.getElementById('btnT'); //console.log(btnT);
    btnT.addEventListener('click', (e) => {
      const menuId = document.getElementById('mat-menu-panel-1'); //console.log(menuId); //mat-menu-panel-1
      if (menuId) {
        menuId.style.maxWidth = '530px';
        for (let i = 1; i <= 8; i++) {
          const itemId = document.getElementById('item-' + i); //console.log(itemId);
          if (itemId) {
            itemId.style.width = '100%';
            itemId.style.display = 'flex';
            itemId.style.flexDirection = 'row';
            itemId.style.justifyContent = 'space-between';
            //itemId.style.borderBottom = '1px solid #999';  
          }
          const extId = document.getElementById('ext-' + i); //console.log(itemId);
          if (extId) {
            extId.style.width = '100%';
            extId.style.display = 'flex';
            extId.style.flexDirection = 'row';
            extId.style.justifyContent = 'space-between';
          }
        }
      }
    });
  }

}
