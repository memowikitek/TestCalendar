import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-bar-progress',
    templateUrl: './bar-progress.component.html',
    styleUrls: ['./bar-progress.component.scss'],
    providers: [DatePipe] // Agregar DatePipe como provider
    ,
    standalone: false
})

export class BarProgressComponent implements OnInit {
  //Fecha Actual
  date = new Date();
  dd = this.date.getDate();
  month = this.date.getMonth() + 1;
  mm = (this.month < 10) ? `0${this.month}` : this.month;
  yy = this.date.getFullYear();

  //Fechas
  @Input() fecIni: any; // Fecha Inicio
  @Input() fecFin: any; // Fecha Fin
  @Input() fecIniExt: any; // Fecha Inicio
  @Input() fecFinExt: any; // Fecha Fin
  //@Output() opt = new EventEmitter<any>();

  //Fecha Inicio
  dIni: number;
  mIni: number;
  yIni: number;
  dIniExt: number;
  mIniExt: number;
  yIniExt: number;

  //Fecha Fin
  dFin: number;
  mFin: number;
  yFin: number;
  dFinExt: number;
  mFinExt: number;
  yFinExt: number;

  mesResA: string;
  mesResI: string;
  mesResF: string;
  //diasXMA: number;
  //diasXMI: number;
  //diasRes: number;
  //diasIni: number;
  //diasRan: number;
  //diasAva: number;

  //Dias tranacurridos
  diasTransHoy: number;
  diasTransIni: number;
  diasTransFin: number;
  diasPeriodo: number;
  diasTransIniExt: number;
  diasTransFinExt: number;
  diasPeriodoExt: number;
  diasResIni: number;
  diasResFin: number;
  diasResIniExt: number;
  diasResFinExt: number;
  diasResFinTot: number;

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
    //console.log(this.fecIni,this.fecFin);
    //console.log(this.fecIniExt,this.fecFinExt);
    //Fecha Inicio
    this.dIni = parseInt(this.fecIni.substr(8, 2));
    this.mIni = parseInt(this.fecIni.substr(5, 2));
    this.yIni = parseInt(this.fecIni.substr(0, 4));
    //Fecha Fin
    this.dFin = parseInt(this.fecFin.substr(8, 2));
    this.mFin = parseInt(this.fecFin.substr(5, 2));
    this.yFin = parseInt(this.fecFin.substr(0, 4));
    if(this.fecIniExt && this.fecFinExt){
      //Fecha Inicio EXT
      this.dIniExt = parseInt(this.fecIniExt.substr(8, 2));
      this.mIniExt = parseInt(this.fecIniExt.substr(5, 2));
      this.yIniExt = parseInt(this.fecIniExt.substr(0, 4));
      //Fecha Fin EXT
      this.dFinExt = parseInt(this.fecFinExt.substr(8, 2));
      this.mFinExt = parseInt(this.fecFinExt.substr(5, 2));
      this.yFinExt = parseInt(this.fecFinExt.substr(0, 4));
    }
    //
    this.calFec();
  }

  calFec() {
    console.log('Fecha Actual: ' + this.fechaActual());
    this.diasTransHoy = this.diasTranscurridos(new Date(this.yy,this.month,this.dd)); //console.log('Dias Transcurridos Hoy', this.diasTransHoy);
    //Fechas
    this.diasTransIni = this.diasTranscurridos(new Date(this.yIni,this.mIni,this.dIni)); //console.log('Dias Transcurridos Inicio',this.diasTransIni,this.fecIni);
    this.diasTransFin = this.diasTranscurridos(new Date(this.yFin,this.mFin,this.dFin)); //console.log('Dias Transcurridos Fin',this.diasTransFin,this.fecFin);
    this.diasPeriodo = this.diasTransFin - this.diasTransIni; //console.log('Dias Periodo',this.diasPeriodo);
    this.diasResIni = (this.diasTransIni >= this.diasTransHoy)? this.diasTransIni - this.diasTransHoy:0; //console.log('Dias Restantes Inicio',this.diasResIni);
    this.diasResFin = (this.diasTransFin >= this.diasTransHoy)? this.diasTransFin - (this.diasTransHoy - 1):0; //console.log('Dias Restantes Fin',this.diasResFin);
    if(this.fecIniExt && this.fecFinExt){
      //Fechas Extemporaneas
      this.diasTransIniExt = this.diasTranscurridos(new Date(this.yIniExt,this.mIniExt,this.dIniExt)); console.log('Dias Transcurridos InicioExtExt',this.diasTransIniExt,this.fecIniExt);
      this.diasTransFinExt = this.diasTranscurridos(new Date(this.yFinExt,this.mFinExt,this.dFinExt)); console.log('Dias Transcurridos FinExt',this.diasTransFinExt,this.fecFinExt);
      this.diasPeriodoExt = this.diasTransFinExt - this.diasTransIniExt; console.log('Dias PeriodoExt',this.diasPeriodoExt);
      this.diasResIniExt = (this.diasTransIniExt >= this.diasTransHoy)? this.diasTransIniExt - this.diasTransHoy:0; console.log('Dias Restantes Inicio',this.diasResIniExt);
      this.diasResFinExt = (this.diasTransFinExt >= this.diasTransHoy)? this.diasTransFinExt - (this.diasTransHoy - 1):0; console.log('Dias Restantes Fin',this.diasResFinExt);
    }
    //Meses
    this.mesResI = this.mesesArray[this.mIni - 1]; //console.log('Mes Inicio: ' + this.mesResI);
    this.mesResF = this.mesesArray[this.mFin - 1]; //console.log('Mes Final: ' + this.mesResF);
    // Verificar si la fecha actual está dentro del rango
    const diasTransFinTo = (this.diasTransFin)?this.diasTransFin:this.diasTransFin;
    this.before = this.diasTransIni > this.diasTransHoy; //console.log('before:' + this.before);
    this.on = this.diasTransHoy >= this.diasTransIni && (this.diasTransHoy <= diasTransFinTo); //console.log('on:' + this.on);
    this.after = (this.diasResFinExt)?this.diasResFinExt === 0:this.diasResFin === 0; //console.log('after:' + this.after);
    //.toFixed(2)
    this.diasResFinTot = (this.diasResFinExt) ? this.diasResFinExt : this.diasResFin;
    this.porcAva = (100 / this.diasPeriodo) * (this.diasPeriodo - this.diasResFinTot); //console.log(this.porcAva);
    this.porcentaje = (this.on) ? this.porcAva.toFixed(2) : 0; //console.log('Porcentaje: '+this.porcentaje);
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
  
}
