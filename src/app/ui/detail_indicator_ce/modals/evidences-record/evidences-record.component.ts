import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { DetailsIndicatorsService, EvidencesCatalogService, EvidencesService, UsersService } from 'src/app/core/services';
import { Alert } from 'src/app/utils/helpers';
import { DetailsCEIndicatorEvidenciaDTOV1, TablePaginatorSearch } from 'src/app/utils/models';
import { DetailsIndicatorAllEvidencesDTOV1 } from 'src/app/utils/models/detailsAllEvidence.dto';
import { DetailsIndicatorEvidenciaDTOV1 } from 'src/app/utils/models/detalles-indicador-evidencia.dto';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { saveAs } from 'file-saver';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';

@Component({
  selector: 'app-evidences-record',
  templateUrl: './evidences-record.component.html',
  styleUrls: ['./evidences-record.component.scss']
})
export class EvidencesRecordComponent implements OnInit {
  [x: string]: any;
  normativeRecordForm: FormGroup;
  dataSource: MatTableDataSource<DetailsCEIndicatorEvidenciaDTOV1>;
  data: any[];
  claveStorage: any[];
  indicadorStorage: any[];
  descripcionIndicadorStorage: any[];
  componenteStorage: any[];
  elementoEvaluacionStorage: any[];
  areaCentralStorage: any[];
  subAreaCentralStorage: any[];
  activoStorage: any[];
  estatusStorage: string;
  idStorage: any;
  dataSourceAllEvidencia: MatTableDataSource<DetailsIndicatorAllEvidencesDTOV1>;
  isChecked: any;
  elementoEvaluacionIdStorage: any;
  usuarioCreacionStorage: any;
  usuarioModificacionStorage: any;
  componenteIDStorage: any;
  areaCentralIDStorage: number;
  subAreaCentralIDStorage: any;
  indicadorIDStorage: any;
  cicloEvaluacionId: number;
  //ref: any;
  //normativas: any;
  del: any[] = [];
  evidencias: any[] = [];
  resultadoGeneralEvidencia: any;
  //resultadoEvidencia: import("c:/Users/Hp/Documents/SIAC/NG-SIAC-FrontEnd/src/app/utils/models/page-result.v1").PageResultV1<import("c:/Users/Hp/Documents/SIAC/NG-SIAC-FrontEnd/src/app/utils/models/detalles-indicador-normativas.dto").DetailsIndicatorNormativaDTOV1[]>[];
  evidenciasExistentes: any;
  private searchsub$ = new Subject<string>();
  filters: TablePaginatorSearch;
  @Input() indLeer: boolean;

  //
  constructor(
    @Inject(MAT_DIALOG_DATA) public evidenciasConfiguradas: any,
    private detailsIndicator: DetailsIndicatorsService,
    private apiEvidencesCatalogService: EvidencesCatalogService,
    private readonly ref: MatDialogRef<never>,
    private basicNotification : BasicNotification,
    private users: UsersService,
  ) {
    this.filters = new TablePaginatorSearch();
    this.evidenciasExistentes = evidenciasConfiguradas;
    // console.log(this.exidenciasExistentes);
  }
  cerrar() {
    this.ref.close(false);
  }
  ngOnInit(): void {
    this.filters.filter = {
      activo: true,
    };
    this.filters.pageSize = 0;
    this.filters.pageNumber = 0;
    this.getEvidences(this.filters);
    this.searchsub$.pipe(debounceTime(300), distinctUntilChanged()).subscribe((filtervalue: string) => {
      this.filters.filter = {
          Clave: filtervalue.trim().toLowerCase() != '' ? filtervalue.trim().toLowerCase() : null,
          Nombre: filtervalue.trim().toLowerCase() != '' ? filtervalue.trim().toLowerCase() : null,
          Descripcion: filtervalue.trim().toLowerCase() != '' ? filtervalue.trim().toLowerCase() : null,
          activo: true,
          // UserId: Auth.getSession().id,
      };
      this.filters.pageNumber=0;
      this.filters.pageSize = 0;
      this.getEvidences(this.filters); 
  });


    this.getResume();
    // this.getEvidences();
  }

  public getResume(): void {
    this.idStorage = JSON.parse(localStorage.getItem('idIndicadorSiac')).procesoEvaluacionId;
    this.claveStorage = JSON.parse(localStorage.getItem('idIndicadorSiac')).claveComponente;
    this.indicadorStorage = JSON.parse(localStorage.getItem('idIndicadorSiac')).indicador;
    this.indicadorIDStorage = JSON.parse(localStorage.getItem('idIndicadorSiac')).indicadorId;
    this.cicloEvaluacionId = JSON.parse(localStorage.getItem('idIndicadorSiac')).cicloEvaluacionId;
    this.descripcionIndicadorStorage = JSON.parse(localStorage.getItem('idIndicadorSiac')).descripcionIndicador;
    this.componenteStorage = JSON.parse(localStorage.getItem('idIndicadorSiac')).componente;
    this.componenteIDStorage = JSON.parse(localStorage.getItem('idIndicadorSiac')).componenteId;
    this.elementoEvaluacionStorage = JSON.parse(localStorage.getItem('idIndicadorSiac')).elementoEvaluacion;
    this.elementoEvaluacionIdStorage = JSON.parse(localStorage.getItem('idIndicadorSiac')).elementoEvaluacionId;
    this.areaCentralStorage = JSON.parse(localStorage.getItem('idIndicadorSiac')).areaCentral;
    this.areaCentralIDStorage = JSON.parse(localStorage.getItem('idIndicadorSiac')).areaCentralId;
    this.subAreaCentralStorage = JSON.parse(localStorage.getItem('idIndicadorSiac')).subAreaCentral;
    this.subAreaCentralIDStorage = JSON.parse(localStorage.getItem('idIndicadorSiac')).subAreaCentralId;
    this.activoStorage = JSON.parse(localStorage.getItem('idIndicadorSiac')).activo;
    this.usuarioCreacionStorage = JSON.parse(localStorage.getItem('idIndicadorSiac')).usuarioCreacion;
    this.usuarioModificacionStorage = JSON.parse(localStorage.getItem('idIndicadorSiac')).usuarioModificacion;
    this.estatusStorage = this.activoStorage ? "Activo" : "Inactivo"
  }

  public getEvidences(filters: TablePaginatorSearch): void {
   
    this.apiEvidencesCatalogService.getAllEvidence(filters).subscribe((response) => {
      let dataTodasLasEvidencias = response.output.map((detailsIndicator) => new DetailsCEIndicatorEvidenciaDTOV1().deserialize(detailsIndicator));
      if (this.evidenciasExistentes && this.evidenciasExistentes.length > 0 ){
          let ids = this.evidenciasExistentes.map((x:any)=> x.evidenciaId);
          let  evidenciasFiltradas = dataTodasLasEvidencias.filter(evidencia=> !ids.some((id:any)=> id === evidencia.id))

            let filtrados = evidenciasFiltradas.map((x)=> new DetailsIndicatorAllEvidencesDTOV1().deserialize(x));
            this.dataSourceAllEvidencia  = new MatTableDataSource(filtrados);  
       }
       else 
       {
            let filtrados = dataTodasLasEvidencias.map((x)=> new DetailsIndicatorAllEvidencesDTOV1().deserialize(x));
           this.dataSourceAllEvidencia = new MatTableDataSource(filtrados); 
       }
    });

  }



  onChange($event: any, indica: DetailsIndicatorAllEvidencesDTOV1) {
    // console.log(indica);
    const newIndicador: DetailsCEIndicatorEvidenciaDTOV1 = new DetailsCEIndicatorEvidenciaDTOV1();
    this.isChecked = $event.checked;
    newIndicador.indicadorId = this.indicadorIDStorage;
    newIndicador.evidenciaId = indica.id;
    newIndicador.claveEvidencia = indica.clave;
    newIndicador.evidencia = indica.nombre;
    newIndicador.archivoAzureId = indica.archivoAzureId;
    newIndicador.url = null;
    newIndicador.contentType = null;
    newIndicador.nombreArchivo = null;
    newIndicador.archivo = null;
    newIndicador.cantidad = null;
    newIndicador.activo = true;
    newIndicador.usuarioCreacion = this.usuarioCreacionStorage;
    newIndicador.usuarioModificacion = this.usuarioModificacionStorage;



    if (this.isChecked == true) {
      this.evidencias.push(newIndicador);
    }

    if(this.isChecked == false){
      this.del.push(newIndicador.evidenciaId);
    }
    const res = this.evidencias.filter(x => !this.del.includes(x.evidenciaId));
    this.evidencias = res;
  }

  public guardar(): void {
    //console.log("EVIDENCES "+this.newIndicador); 
    this.evidencias.forEach(element => {
      element.usuarioCreacion = this.users.userSession.id;
      element.CicloEvaluacionId = this.cicloEvaluacionId;
    })     
    this.detailsIndicator.getAddCeEvidencias(this.evidencias).subscribe((response) => {
      //      console.log(response);
      if (response.exito) {
        this.basicNotification.notif("success",'Evidencia agregada correctamente', 5000);
        // Alert.success('', 'Evidencia agregada correctamente');
        this.ref.close(true);
      } else {
        // Alert.success('', 'No se puede agregar la evidencia');
        this.basicNotification.notif("error",'No se puede agregar la evidencia', 5000);
        this.ref.close(false);
      }
    });
  }


  downloadFile(indicador: any): void {
    let id = indicador.archivoAzureId;
    let file = indicador.nombreFormato;
    var fileExt = file.split('.');
    if (fileExt.length > 1) {
      this.detailsIndicator.downloadAzureStorageFile(id).subscribe((res: any) => {
        saveAs(res, file);
      });
    }

  }

  viewFile(indicador: any): void {
    let file = indicador.nombreFormato;
    this.detailsIndicator.downloadAzureStorageFile(indicador.archivoAzureId).subscribe((res: any) => {
      let blob = new Blob([res], { type: 'application/pdf' });
      let pdfUrl = window.URL.createObjectURL(blob);
      var PDF_link = document.createElement('a');
      PDF_link.href = pdfUrl;
      window.open(pdfUrl, '_blank');
      PDF_link.download = file;
      PDF_link.click();
    });
  }
  canViewFile(indicador: any): boolean {
    let file = indicador.nombreFormato;

    if (file) {
      if (file.includes('.pdf')) {
        return true;
      }
    }
    return false
  }
  canDownloadFile(indicador: any): boolean {
    let file = indicador.nombreFormato;

    if (file) {
      var fileExt = file.split('.');
      if (fileExt.length < 2) // no tiene extension
      {
        return false;
      }
      if (!file.includes('.pdf')) {
        return true;
      }
    }

    return false;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchsub$.next(filterValue);
    // if (filterValue.length > 2 || filterValue.length == 0) {
    //     this.filters.filter = {
    //         clave: filterValue.trim().toLowerCase(),
    //         nombre: filterValue.trim().toLowerCase(),
    //         descripcion: filterValue.trim().toLowerCase(),
    //     };
    //     this.paginator.firstPage();
    //     this.getAllIndicatorsSiac(this.filters);
    //     this.dataSource.filter = filterValue.trim().toLowerCase();
    // }
}






}
