import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs';
import { EvaluationCycleService, UsersService } from 'src/app/core/services';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';
import { TablePaginatorSearch } from 'src/app/utils/models';
import { CEIndicadorEtapa1CampusDto } from 'src/app/utils/models/ceindicador-etapa1-campus.dto';
import etapasActivasJson from 'src/assets/data/etapasHabilitadas.json';

@Component({
  selector: 'app-capture-detail-indicator',
  templateUrl: './capture-detail-indicator.component.html',
  styleUrls: ['./capture-detail-indicator.component.scss']
})
export class CaptureDetailIndicatorComponent implements OnInit {
  data: CEIndicadorEtapa1CampusDto[];
  dataSource: MatTableDataSource<CEIndicadorEtapa1CampusDto>;
  filters: TablePaginatorSearch;
  cicloEva: any;
  indicadorCapura: any
  indicadorLeido: boolean = false;
  obligadoLeerIndicador: boolean = true;
  etapasJson: any = etapasActivasJson;
  etapasActivas: any;
  // esEtapaUnoDisponible: boolean = false;
  // esEtapaDosDisponible: boolean = false;
  // esEtapa3Disponible: boolean = false;
  // esEtapa4Disponible: boolean = true;
  E1: boolean = false;
  E2: boolean = false;
  E3: boolean = false;
  E4: boolean = false;
  E5: boolean = false;
  E6: boolean = false;
  E7: boolean = false;
  E8: boolean = false;
  primerRegistro: CEIndicadorEtapa1CampusDto;
  anteriorRegistro: any;
  siguienteRegistro: any;
  ultimoRegistro: CEIndicadorEtapa1CampusDto;
  newData: any;
  tot: any;

  constructor(private readonly EvaCService: EvaluationCycleService,
    private basicNotification: BasicNotification,
    private router: Router,
    private users: UsersService,) {

    this.dataSource = new MatTableDataSource<CEIndicadorEtapa1CampusDto>;
  }

  obtenerTextEncabezado() {
    if (!this.indicadorCapura) {
      return '';
    }

    let textEncabezado = '';
    textEncabezado = `${this.indicadorCapura.campus ?? ''} | ${this.indicadorCapura.areaResponsable ?? ''} | ${this.indicadorCapura.claveNombreIndicador ?? ''}`
    return textEncabezado;
  }

  
  desHabilitarEtapa(numeroEtapa: number) {

    // (etapasActivas[4].active && (indicadorLeido && obligadoLeerIndicador))

    switch (numeroEtapa) {
      case 1:
        if (!this.etapasActivas[1].active) 
        {
          return true; // deshabilita
        }
        else
        {
          if (this.indicadorCapura?.etapa == 1 && !this.indicadorLeido && this.obligadoLeerIndicador) return true; // obligacion leer
        }
        break;
      case 2:
        if (!this.etapasActivas[2].active ) {
          return true; // deshabilita
        }
        else
        {
          if (this.indicadorCapura?.etapa == 2 && !this.indicadorLeido && this.obligadoLeerIndicador) return true; // obligacion leer
        }
        break;
      case 3:
        if (!this.etapasActivas[3].active) {
          return true; // deshabilita
        }
        else
        {
          if (this.indicadorCapura?.etapa == 3 && !this.indicadorLeido && this.obligadoLeerIndicador) return true; // obligacion leer
        }
        break;
      case 4:
        if (!this.etapasActivas[4].active) {
          return true; // deshabilita
        }
        else
        {
          if (this.indicadorCapura?.etapa == 4 && !this.indicadorLeido && this.obligadoLeerIndicador) return true; // obligacion leer
        }
        break;
      case 5:
        if (!this.etapasActivas[5].active) {
          return true; // deshabilita
        }
        else
        {
          if (this.indicadorCapura?.etapa == 5 && !this.indicadorLeido && this.obligadoLeerIndicador) return true; // obligacion leer
        }
        break;
      case 6:
        if (!this.etapasActivas[6].active) {
          return true; // deshabilita
        }
        else
        {
          if (this.indicadorCapura?.etapa == 6 && !this.indicadorLeido && this.obligadoLeerIndicador) return true; // obligacion leer
        }
        break;
      case 7:
        if (!this.etapasActivas[7].active) {
          return true; // deshabilita
        }
        else
        {
          if (this.indicadorCapura?.etapa == 7 && !this.indicadorLeido && this.obligadoLeerIndicador) return true; // obligacion leer
        }
        break;
      default:
        true;
    }
    //debugger
    return false;
  }

  expadirEtapa(numeroEtapa: number) {
    switch (numeroEtapa) {
      case 1:
        if (!(this.indicadorCapura?.etapa == 1)) {
          return false; // deshabilita
        }
        break;
      case 2:
        if (!(this.indicadorCapura?.etapa == 2)) {
          return false; // deshabilita
        }
        break;
      case 3:
        if (!(this.indicadorCapura?.etapa == 3)) {
          return false; // deshabilita
        }
        break;
      case 4:
        if (!(this.indicadorCapura?.etapa == 4)) {
          return false; // deshabilita
        }
        break;
      case 5:
        if (!(this.indicadorCapura?.etapa == 5)) {
          return false; // deshabilita
        }
        break;
        case 6:
          if (!(this.indicadorCapura?.etapa == 6)) {
            return false; // deshabilita
          }
          break;
        case 7:
          if (!(this.indicadorCapura?.etapa == 7)) {
             return false; // deshabilita
           }
          break;
      default:
        false;
    }
    if (!this.indicadorLeido && this.obligadoLeerIndicador) return false; // obligacion leer

    return true;
  }

  ngOnInit(): void {
    let jsonstr = localStorage.getItem("indicadorcaptura")
    this.indicadorCapura = JSON.parse(jsonstr); console.log(this.indicadorCapura);
    this.cicloEva = JSON.parse(localStorage.getItem('cycleStage')); //console.log(this.cicloEva);
    this.filters = new TablePaginatorSearch();
    this.filters.pageSize = 10000000;
    this.filters.pageNumber = 0;
    this.filters.filter = {
      "cicloEvaluacionId": this.cicloEva[0].cicloEvaluacionId,
      "UsuarioId": this.users.userSession.id,
      "Activo": true,
      "textoBusqueda": null
    };
    //this.getAllCicloEvaIndicadores(this.filters);
    this.getAllCeIndicadoresDB();
    //Habilitar Etapas
      this.etapasHabilitadas();      
  }

  
  /*
  private getAllCicloEvaIndicadores(filter: TablePaginatorSearch) {
    this.dataSource.data = [];
    this.data = [];
    switch (this.indicadorCapura.etapa) {
      case 1:
        console.log('Etapa: ' + this.indicadorCapura.etapa);
        this.EvaCService.getCEIndicadoresEtapa1(filter).subscribe((response) => {
          if (response.output) {
            this.data = response.output.indicadoresEtapas.map((indicadorCiclo: any) => new CEIndicadorEtapa1CampusDto().deserialize(indicadorCiclo));
            this.paginadorIndicadores();            
          }
        });
      break;
      case 2:
        console.log('Etapa: ' + this.indicadorCapura.etapa);
        this.EvaCService.getCeIndicadoresEtapa2(filter).subscribe((response) => {
          if (response.output) {
            this.data = response.output.indicadoresEtapas.map((indicadorCiclo: any) => new CEIndicadorEtapa1CampusDto().deserialize(indicadorCiclo));
            this.paginadorIndicadores();
          }
        });
      break;
      case 3:
        console.log('Etapa: ' + this.indicadorCapura.etapa);
        this.EvaCService.getCeIndicadoresEtapa3(filter).subscribe((response) => {
          if (response.output) {
            this.data = response.output.indicadoresEtapas.map((indicadorCiclo: any) => new CEIndicadorEtapa1CampusDto().deserialize(indicadorCiclo));
            this.paginadorIndicadores();
          }
        });
      break;
      case 4:
        console.log('Etapa: ' + this.indicadorCapura.etapa);
        this.EvaCService.getCeIndicadoresEtapa4(filter).subscribe((response) => {
          if (response.output) {
            this.data = response.output.indicadoresEtapas.map((indicadorCiclo: any) => new CEIndicadorEtapa1CampusDto().deserialize(indicadorCiclo));
            this.paginadorIndicadores();
          }
        });
      break;
      case 5:
        console.log('Etapa: ' + this.indicadorCapura.etapa);
      break;
      case 6:
        console.log('Etapa: ' + this.indicadorCapura.etapa);
      break;
      case 7:
        console.log('Etapa: ' + (this.indicadorCapura.etapa-1));
      break;
      case 8:
        console.log('Etapa: ' + this.indicadorCapura.etapa);
      break;
      default:
        const msj = 'Error: Etapa no encontrada!';
        console.warn(msj);
        this.basicNotification.notif("error",msj, 5000);
      break;
    }
    
  }*/

  paginadorIndicadores() {
    //this.dataSource.data = [];
    this.newData = this.data.map((obj, index) => {
      return { ...obj, id: index + 1 };
    }); console.log('this.newData', this.newData);
    this.dataSource.data = this.newData; //console.log(this.dataSource.data);
    this.tot = this.data.length;
    const n = (this.tot >= 1) ? this.data.length - 1 : 0;
    const antId = this.indicadorCapura.id - 1;
    const sigId = this.indicadorCapura.id + 1;
    setTimeout(() => {
      this.primerRegistro = (antId > 0) ? this.newData[0] : null; //console.log('primerRegistro',this.primerRegistro);
      this.anteriorRegistro = (antId > 0) ? this.newData.find((item: { id: number; }) => item.id == antId) : null; //console.log('anteriorRegistro',this.anteriorRegistro);
      this.siguienteRegistro = (sigId <= this.tot) ? this.newData.find((item: { id: number; }) => item.id == sigId) : null; //console.log('siguienteRegistro',this.siguienteRegistro);
      this.ultimoRegistro = (sigId <= this.tot) ? this.newData[n] : null; //console.log('ultimoRegistro',this.ultimoRegistro);            
    }, 500);
  }

  viewData(row: any) { //console.log('CARGA:',row,this.cicloEva);
      if(this.indicadorCapura.etapa == 5){
        this.indicadorCapura.id= row.id;
        this.indicadorCapura.campus = row.campus;
        this.indicadorCapura.claveNombreIndicador = row.claveNombreIndicador;
        this.indicadorCapura.areaResponsable = row.areaResponsable;
        this.indicadorCapura.descripcionIndicador = '';
        // this.indicadorCapura.descripcionIndicador falta que este dato lo proporcine el row de memo 
        this.indicadorCapura.indicadorId = row.indicadorId;
        localStorage.setItem('indicadorcaptura', JSON.stringify(this.indicadorCapura));
        setTimeout(() => { location.reload() }, 1000);  
      }
      else{
        row.etapa = this.indicadorCapura.etapa;
        row.infoEvaluacion = this.cicloEva;
        row.CicloEvaluacionInfo = this.cicloEva[0];
        row.campusId = row.campusId;
        row.AreaResponsableid = row.areaId;
        row.soloVisualiza = this.indicadorCapura.soloVisualiza;//true;
        row.esAutorizadorNa = false;
        localStorage.setItem('indicadorcaptura', JSON.stringify(row));
        setTimeout(() => { location.reload() }, 1000);
  
      }
  }

  redirectViewIndicatorCE(): void {
    let indicadorCapuraCe = {
      indicadorId: this.indicadorCapura.indicadorId,
      usuarioId: this.users.userSession.id,
      indicadorLeido: this.indicadorLeido,
      ObligadoLeerIndicador: this.obligadoLeerIndicador,
      etapaId: this.indicadorCapura.CicloEvaluacionInfo.etapaEvaluacion[0].etapaId,
      cicloEvaluacionId: this.indicadorCapura.cicloEvaluacionId,
      procesoEvaluacionId: this.indicadorCapura.CicloEvaluacionInfo.procesoEvaluacionId,
      areaResponsable: this.indicadorCapura.areaResponsable,
      campus: this.indicadorCapura.campus,
      nivelModalidad: this.indicadorCapura.nivelModalidad,
      claveInstitucion: this.indicadorCapura.CicloEvaluacionInfo.claveInstitucion,
      procesoEvaluacion: this.indicadorCapura.CicloEvaluacionInfo.procesoEvaluacion
    };
    console.table(indicadorCapuraCe)
    localStorage.setItem('idIndicadorSiac', JSON.stringify(indicadorCapuraCe));
    window.location.assign("/detalles-indicadores-ce");
  }

  actualizaLecturaIndicadorInfo(event: any) {
    this.indicadorLeido = event.indicadorLeido;
    this.obligadoLeerIndicador = event.obligadoLeerIndicador;
  }

  BackIndicadores() {
    let numeroEtapa = this.indicadorCapura?.etapa;
    switch (numeroEtapa) {
      case 1:
        window.location.assign("/indicator-goals-capture");
        break;
      case 2:
        window.location.assign("/indicator-goals-capture/evidence-capture");
        break;
      case 3:
        window.location.assign("/indicator-goals-capture/result-capture");
        break;
      case 4:
        window.location.assign("/indicator-goals-capture/autoevaluation-capture");
        break;
      case 5:
        if (this.indicadorCapura?.subnumeroEtapa) 
        {
          let numeroSubEtapa = this.indicadorCapura?.subnumeroEtapa;
          switch (numeroSubEtapa) 
          {
            case 1:
              window.location.assign("/indicator-goals-capture/autoevaluation-review-capture");
              break;
            case 2:
              window.location.assign("/indicator-goals-capture/autoevaluation-review-capture");
              break;
            default:
              window.location.assign("/mis-evaluaciones/ciclo-etapas");
              break;
          }
        }
        else {
          const url = (this.users.userSession.tipoRol == 1) ? "/indicator-goals-capture/autoevaluation-review-capture-campusdeparea-detail" : "/indicator-goals-capture/autoevaluation-review-capture-campusdeparea";
          window.location.assign(url);
        }
        break;
        case 6:
          window.location.assign("/indicator-goals-capture/improvementplan-autoriza");
          break;
        case 7:
          // es diferente pantalla dependiendo del usuario 23082024
          if(this.users.userSession.tipoRol == 1) // usuario campus 
          {
            window.location.assign("/indicator-goals-capture/improvementplan-execution-capture?vw=1");
          }
          else // usuario de area central 
          {
            window.location.assign("/indicator-goals-capture/improvementplan-execution");
          }
          break;
      default:
        window.location.assign("/mis-evaluaciones/ciclo-etapas");
        break;
    }
  }

  private getAllCeIndicadoresDB() {
    const request = indexedDB.open("MyDatabase");
    request.onerror = (event: any) => {
      this.basicNotification.notif("error", 'Error al abrir la base de datos');
    };

    request.onsuccess = (event: any) => {
      const db = event.target.result;
      const transaction = db.transaction(["indicadoresCE"], "readonly");
      const objectStore = transaction.objectStore("indicadoresCE");
      const getAllRequest = objectStore.getAll();

      getAllRequest.onsuccess = (event: any) => {
        const allData = event.target.result; console.log('Datos leídos DB');
        this.data = allData;
        this.paginadorIndicadores();
      };

      getAllRequest.onerror = (event: any) => {
        this.basicNotification.notif("error", 'Error al leer los datos');
      };
    };
  }

  etapasHabilitadas(){
    this.etapasActivas = this.etapasJson.map((item: { id: number; active: any; }) => {
      return {
          ...item,
          active: item.id <= this.indicadorCapura.etapa ? true : item.active
      };
    });
  }

}
