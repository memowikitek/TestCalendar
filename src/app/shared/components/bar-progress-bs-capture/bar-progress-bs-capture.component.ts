import { Component, OnInit, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-bar-progress-bs-capture',
  templateUrl: './bar-progress-bs-capture.component.html',
  styleUrls: ['./bar-progress-bs-capture.component.scss'],
  providers: [DatePipe] // Agregar DatePipe como provider
})
export class BarProgressBsCaptureComponent {
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
porcAva: number;
porcentaje: any;
on: boolean = false;
before: boolean = false;
after: boolean = false;

mesesArray: any[] = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Novienbre", "Diciembre"];

  constructor(private datePipe: DatePipe) { }

  ngOnInit(): void {//console.log(this.etapas);
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
    this.mesResA = this.mesesArray[this.month - 1]; //console.log('Mes Actual: ' + this.mesResA);
    this.mesResI = this.mesesArray[this.mIni - 1]; //console.log('Mes Inicio: ' + this.mesResI);
    this.mesResF = this.mesesArray[this.mFin - 1]; //console.log('Mes Final: ' + this.mesResF);
    this.diasXMA = this.diasEnUnMes(this.mesResA, this.yy); //console.log('Dias del (Mes Actual): ' + this.diasXMA);
    this.diasXMI = this.diasEnUnMes(this.mesResI, this.yy); //console.log('Dias del (Mes Inicial): ' + this.diasXMI);
    this.diasIni = (this.mIni>this.month)? (this.diasXMA - this.dd)+this.dIni: this.dIni - this.dd; //console.log('Dias Inicio: ' + this.diasIni);
    this.diasRan = (this.diasIni < this.dFin && this.month == this.mFin) ? this.dFin - this.dIni : (this.diasXMA - this.dIni) + this.dFin;
    //console.log('dias Rango (Periodo): ' + this.diasRan);

    /* */
    this.diasRes = (this.dd < this.dFin && this.month == this.mFin) ?
      this.dFin - this.dd :
      (this.mFin > this.month) ? (this.diasXMA - this.dd) + this.dFin : 0;
    //console.log('dias Restantes: ' + this.diasRes);
    /* */

    // Definir las fechas de inicio y fin
    this.fecIni = new Date(this.fecIni);
    this.fecFin = new Date(this.fecFin);
    // Verificar si la fecha actual está dentro del rango
    this.before = this.date < this.fecIni; //console.log('before:' + this.before);
    this.on = this.date >= this.fecIni && this.date <= this.fecFin; //console.log('on:' + this.on);
    this.after = this.date > this.fecFin; //console.log('after:' + this.after);
    //.toFixed(2)
    this.porcAva = (100/this.diasRan)*(this.diasRan-this.diasRes); //console.log(this.porcAva);
    this.porcentaje = (this.date <= this.fecFin && this.date >= this.fecIni && this.on)?this.porcAva.toFixed(2):0; //console.log('Porcentaje: '+this.porcentaje);
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

  styleMenu(){
    const btnT = document.getElementById('btnT'); //console.log(btnT);
    btnT.addEventListener('click', (e) => {
      const menuId = document.getElementById('mat-menu-panel-0'); //console.log(menuId);
      menuId.style.maxWidth = '530px';
      for(let i = 1; i <= 8; i++) {
        const itemId = document.getElementById('item-'+i); //console.log(itemId);
        if(itemId){
          itemId.style.width = '100%';
          itemId.style.display = 'flex';
          itemId.style.flexDirection = 'row';
          itemId.style.justifyContent = 'space-between';
          //itemId.style.borderBottom = '1px solid #999';  
        }
        const extId = document.getElementById('ext-'+i); //console.log(itemId);
        if(extId){
          extId.style.width = '100%';
          extId.style.display = 'flex';
          extId.style.flexDirection = 'row';
          extId.style.justifyContent = 'space-between';
        }
      }
    });
  }

}
