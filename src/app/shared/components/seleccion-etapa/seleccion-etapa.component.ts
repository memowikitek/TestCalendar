import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Vista } from 'src/app/utils/models';
import { UsersService } from 'src/app/core/services';
import { PermisosHeredadosDTO } from 'src/app/utils/models/permisos-heredados.dto';
import { DateHelper } from 'src/app/utils/helpers';
import { url } from 'inspector';
import urlEtapas from 'src/assets/data/urlSeleccionEtapas.json';

@Component({
  selector: 'app-seleccion-etapa',
  templateUrl: './seleccion-etapa.component.html',
  styleUrls: ['./seleccion-etapa.component.scss'],
  providers: [DatePipe] // Agregar DatePipe como provider
})
export class SeleccionEtapaComponent implements OnInit {
  thisAccess: Vista;
  permission: boolean;
  permissions: boolean[];
  cicloStage: any;
  nombre: string;
  proceso: string;
  etapas: any;
  etapasActivas: any;
  tipo: any;
  disabled4: boolean = false;
  disabled5: boolean = false;
  revIns: boolean = false;
  redirect: any = urlEtapas;

  constructor(
    private router: Router,
    private users: UsersService,
    private datePipe: DatePipe
  ) {
    this.permission = null;
    this.thisAccess = new Vista();
    this.permissions = [false, false, false];
    this.tipo = users.userSession.tipoRol;
  }

  ngOnInit(): void {
    //todo: revisar seguridad
    //this.setPermissions();
    this.revIns = JSON.parse(localStorage.getItem('revIns'));
    this.loadData();
  }

  loadData() {
    this.cicloStage = JSON.parse(localStorage.getItem('CE')); //console.log(this.cicloStage);
    const { cicloEvaluacion, procesoEvaluacion, etapaEvaluacion } = this.cicloStage[0];
    this.nombre = cicloEvaluacion; //console.log(this.nombre,cicloEvaluacion);
    this.proceso = procesoEvaluacion;
    this.etapas = etapaEvaluacion;
    this.calculoFechas(etapaEvaluacion);
  }

  btnNext(id: number, urln: number) { //console.log(id);
    //urln = (this.tipo == 2) ? 0 : urln;
    let urlRedirect = (this.getCurrentRoute.includes('/mis-evaluaciones')) ? '/mis-evaluaciones/ciclo-etapas' : '/mis-revisiones-institucionales/ciclo-etapas';
    const ci = this.cicloStage;
    delete ci[0].etapaEvaluacion;
    for (let i = 0; i < this.etapasActivas.length; i++) {
      if (this.etapasActivas[i].etapaId == id) {
        console.log('Click Etapa' + id);
        // Buscar la URL correspondiente al ID de etapa
        const redirect = this.redirect.find((x: { etapa: number; }) => x.etapa === id);
        urlRedirect = (Array.isArray(redirect.url)) ? redirect.url[urln] : (redirect) ? redirect.url : urlRedirect;
        //if(Array.isArray(redirect.url)){urlRedirect =  redirect.url[urln]; // toma el numero enviando desde el boton y selecciona elindex del array 
        //}else{urlRedirect = (redirect) ? redirect.url : urlRedirect; }//console.log(urlRedirect);
        // Filtrar y añadir la etapa correspondiente a etapaEvaluacion
        const etapa = this.etapas.filter((row: { etapaId: number; }) => row.etapaId === id); //console.log(etapa);
        ci[0].etapaEvaluacion = etapa; //console.log(ci);
        localStorage.setItem("cycleStage", JSON.stringify(ci));
        if (Array.isArray(redirect.url)) {
          // le asigno permisos heredados a todas las paginas configuradas
          for (let x = 0; x < redirect.url.length; x++) {
            this.setPermisosHeredados(redirect.url[x]);
          }
        } else {
          this.setPermisosHeredados(urlRedirect);
        }
        if(urlRedirect){
          console.log('urlRedirect', urlRedirect)
          window.location.assign(urlRedirect);  
        }
      }
    }
  }

  calculoFechas(etapas: any) {
    setTimeout(() => {
      const today = DateHelper.fechaActual();
      const activas: any[] = [];//console.log(etapas);
      for (let i = 0; i < etapas.length; i++) {
        const { etapaId, fechaInicio, fechaFin, fechaInicioExt, fechaFinExt } = etapas[i];//console.log(i,etapas[i]);
        const btnEtapa = document.getElementById('E' + i); //console.log(btnEtapa);
        //Selección de Etapas "Mis Evaluaciones" 
        if (this.getCurrentRoute.includes('/mis-evaluaciones')) {
          if (((fechaInicio <= today && today <= fechaFin) || (fechaInicioExt <= today && today <= fechaFinExt)) && i != 7) {//console.log(i,etapaId,'ok');
            btnEtapa.classList.add('activo');
            activas.push({ etapaId });
            this.addEtapa9(i);
          }else{
            if(i == 4){this.disabled4 = true;}
            if(i == 5){this.disabled5 = true;}
          }
        }
        //Selección de Etapas "Mis Revisiones Institucionales"
        if (this.getCurrentRoute.includes('/mis-revisiones-institucionales')) {
          //const today = '2024-09-14';
          const fecFinal = (fechaFin < fechaFinExt) ? fechaFinExt : fechaFin; //console.log('E'+(i+1),'fecFinal:',fecFinal);
          if (fecFinal < today) {//console.log(i,etapaId,'ok');
            btnEtapa.classList.add('activo');
            activas.push({ etapaId });
            this.addEtapa9(i);
          }
          //ocultar [i=3]-ETAPA-4
          if (i == 3) {
            btnEtapa.classList.add('d-none');
          }
          //if(i == 6){}
        }
        //ocultar [i=7]-ETAPA-7
        if (i == 7) {
          btnEtapa.classList.add('d-none');
        }
      }
      this.etapasActivas = activas; //console.log(this.etapasActivas);
    }, 500);
  }

  addEtapa9(i: number){
    if(i == 5){
      const btnEtapa = document.getElementById('E6pm');
      if (btnEtapa != null) { btnEtapa.classList.add('activo'); }
    }
  }

  fechaActual() {
    let date = new Date();
    let day = date.getDate();
    let dd = (day < 10) ? `0${day}` : day;
    let month = date.getMonth() + 1;
    let mm = (month < 10) ? `0${month}` : month;
    let yy = date.getFullYear();
    let fecha = `${yy}-${mm}-${dd}`;
    return fecha;
  }

  obtenerFechaFormateada(fecha: string): string {
    return this.datePipe.transform(fecha, `dd/MM/yy`) || '';
  }

  get getCurrentRoute(): string {
    return this.router.url;
  }

  setPermisosHeredados(urlRedirect: string) {
    var permiso = new PermisosHeredadosDTO();
    permiso.vistaPadre = this.getCurrentRoute.includes('/mis-evaluaciones') ? "/mis-evaluaciones" : "/mis-revisiones-institucionales";// "/mis-evaluaciones";
    permiso.vistaHijo = urlRedirect;

    var permisosHeredados: PermisosHeredadosDTO[] = JSON.parse(localStorage.getItem('permisosHeredados'));
    if (permisosHeredados == null) {
      permisosHeredados = [];
      permisosHeredados.push(permiso);
    } else {
      var permisoFind = permisosHeredados.find(p => p.vistaHijo == urlRedirect)
      if (permisoFind == null) {
        permisosHeredados.push(permiso);
      }
    }
    localStorage.setItem('permisosHeredados', JSON.stringify(permisosHeredados));
  }

  private setPermissions(): void {
    this.permissions = this.thisAccess.getPermissions(
      this.users.userSession.modulos,
      this.users.userSession.vistas,
      this.router.url
    );
  }

  checkPermission(p: number): boolean {
    //todo: revisar seguridad
    return true;
    return this.permissions[p];
  }

}
