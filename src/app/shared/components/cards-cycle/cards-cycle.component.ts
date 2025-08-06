import { Component, Input, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { SettingsWelcomeService, UsersService } from 'src/app/core/services';
import { SettingsWelcomeDTO, TablePaginatorSearch } from 'src/app/utils/models';
import { environment } from 'src/environments/environment';
import { PermisosHeredadosDTO } from 'src/app/utils/models/permisos-heredados.dto';

@Component({
  selector: 'app-cards-cycle',
  templateUrl: './cards-cycle.component.html',
  styleUrls: ['./cards-cycle.component.scss'],
  providers: [DatePipe] // Agregar DatePipe como provider
})
export class CardsCycleComponent implements OnInit {
  @Input() ciclos: any;
  //@Input() data: any;
  filters: TablePaginatorSearch;
  data: any;
  data2: any;
  filterData2: any;
  html: any = null;
  cover: any;
  host: any = environment.api;
  tipoRol: any;

  constructor(
    private readonly router: Router,
    private readonly config: SettingsWelcomeService,
    private users: UsersService,
    private datePipe: DatePipe
  ) { 
    this.tipoRol = users.userSession.tipoRol;
  }

  ngOnInit(): void {
    //setTimeout(() => { console.log(this.ciclos) }, 2000);
    //this.getCE();
  }

  private getAllCEWelcome(Id: number): void {
    let filters = new TablePaginatorSearch();
    filters.filter = { cicloEvaluacionId: Id };
    filters.pageSize = 0;
    filters.pageNumber = 0;
    this.config.getAllConfigPantallaBienvenida(filters).subscribe((response) => {
      if (!response.output) { return; }
      if (response.exito) {
        const data = new SettingsWelcomeDTO().deserialize(response.output[0]);
        this.data = data; //console.log(this.data.cicloEvaluacionId);
        localStorage.setItem("welcomeId", this.data.cicloEvaluacionId);
        window.location.assign('/welcome-screen');
      }
    });
  }

  getCiclo(Id: any): void {
    const ciclo = this.ciclos.filter((row: { cicloEvaluacionId: number; }) => row.cicloEvaluacionId === Id); //console.log(ciclo);
    localStorage.setItem("CE", JSON.stringify(ciclo));
    if (this.getCurrentRoute.includes('/welcome-cycle')) {
      console.log('cicloId:', Id);
      this.getAllCEWelcome(Id);
    }
    if (this.getCurrentRoute.includes('/mis-evaluaciones') || this.getCurrentRoute.includes('/mis-revisiones-institucionales')) {
      const urlRedirect = this.getCurrentRoute.includes('/mis-evaluaciones') ? "/mis-evaluaciones/ciclo-etapas" : (this.tipoRol == 1) ? '/mis-revisiones-institucionales/indicador-ri-tipo1':"/mis-revisiones-institucionales/ciclo-etapas";  
      this.setPermisosHeredados(urlRedirect);
      window.location.assign(urlRedirect);
    }
  }

  obtenerFechaFormateada(fecha: string): string {
    return this.datePipe.transform(fecha, `dd MMMM`) || '';
  }

  obtenerFechaFormateadaA(fecha: string): string {
    return this.datePipe.transform(fecha, 'yyyy') || '';
  }

  get getCurrentRoute(): string {
    return this.router.url;
  }

  setPermisosHeredados(urlRedirect: string) {
    var permiso = new PermisosHeredadosDTO();
    permiso.vistaPadre = this.router.url;
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

}
