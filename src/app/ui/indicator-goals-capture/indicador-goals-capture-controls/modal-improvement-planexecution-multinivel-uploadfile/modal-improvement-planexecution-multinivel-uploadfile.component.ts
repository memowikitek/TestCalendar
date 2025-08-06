import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import saveAs from 'file-saver';
import { EvaluationCycleService, UsersService } from 'src/app/core/services';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';
import { CEEtapa6PMEArchivoCreateModel, CeEtapa6PmeArchivoNivModCreateModel, CEEtapa6PMECreateModel } from 'src/app/utils/models/ce-etapa6-pmearchivo-create.dto';
import { EstatusEtapa7, ModalTitle } from 'src/app/utils/models/enums-estatus-etapas';
import { filter, Observable, of, throwError, map } from 'rxjs';

@Component({
  selector: 'app-modal-improvement-planexecution-multinivel-uploadfile',
  templateUrl: './modal-improvement-planexecution-multinivel-uploadfile.component.html',
  styleUrls: ['./modal-improvement-planexecution-multinivel-uploadfile.component.scss']
})
export class ModalImprovementPlanexecutionMultinivelUploadfileComponent {
  // #region variables generales de modal captura

  //titulo del modal
  title = 'Cargar evidencia del PM/CLM';
  NombreEtapa = ''

  errorevidencia = false;
  informacionActual: any;
  // #endregion

  estatusEtapa7 = EstatusEtapa7

  esAutorizadorNR = false
  dataSourceArchivos: MatTableDataSource<any>;
  ceetapa6PlanMejoraEjecucionId: CEEtapa6PMECreateModel;
  comentarioEvidencia = ''
  listaNiveles: any;
  nivelesSeleccionados: any[];

  constructor(@Inject(MAT_DIALOG_DATA) public modalData: any,
    private readonly users: UsersService,
    private router: Router,
    private readonly refDiag: MatDialogRef<never>,
    private readonly EvaCService: EvaluationCycleService,
    private basicNotification: BasicNotification) {

    this.informacionActual = JSON.parse(JSON.stringify(modalData))// copia de la informacion actual
    this.modalData =JSON.parse(JSON.stringify(this.informacionActual[0])); 

    this.ceetapa6PlanMejoraEjecucionId = new CEEtapa6PMECreateModel();
    if (!this.ceetapa6PlanMejoraEjecucionId.archivos) {
      this.ceetapa6PlanMejoraEjecucionId.archivos = [];
    }
    this.ceetapa6PlanMejoraEjecucionId.estatusEtapa = 1
    // this.ceetapa6PlanMejoraEjecucionId.evidenciaDescripcion = 'Prueba'
    this.ceetapa6PlanMejoraEjecucionId.usuarioId = this.users.userSession.id;
    this.configuraVista();
  }

  handleUpload(event: any) {

    // archivo
    const file = event.target.files[0];
    if (file.size > 40000000) {
      this.basicNotification.notif("error", 'No se puede agregar el archivo ya que es mayor a 40MB');
      return;
    }
    ///
    // extension
    /////
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {

      let cEEtapa6PMEArchivoCreateModel = new CEEtapa6PMEArchivoCreateModel();
      cEEtapa6PMEArchivoCreateModel.base64 = reader.result;
      cEEtapa6PMEArchivoCreateModel.nivelesModalidad = [];

          
      this.listaNiveles.forEach((nivelmodalidadItem: any) => {
        if(this.nivelesSeleccionados.includes(nivelmodalidadItem.nivelModalidadId))
          {
          let ceEtapa6PmeArchivoNivModCreateModel = new CeEtapa6PmeArchivoNivModCreateModel();
          ceEtapa6PmeArchivoNivModCreateModel.ceetapa6PlanMejoraEjecucionId = nivelmodalidadItem.ceetapa6PlanMejoraEjecucionId;
          ceEtapa6PmeArchivoNivModCreateModel.ceevaluacionId = nivelmodalidadItem.ceevaluacionId;

          var extension = file.name.split('.').pop();
          let nmDescripciones = this.listaNiveles.filter((x:any)=> this.nivelesSeleccionados.includes(x.nivelModalidadId))
          .map((names:any)=> names.nivelModalidadDescripcion ).join();
          
          var nameVisual = this.getnombreevidencia(`(${nmDescripciones})`,null);
          ceEtapa6PmeArchivoNivModCreateModel.nombreArchivoVisual = nameVisual + '.' + extension;

          let nivelMdalidadInfoActual = this.informacionActual.filter((x:any)=> x.nivelModalidadDescripcion === nivelmodalidadItem.nivelModalidadDescripcion);
          var name = this.getnombreevidencia(nivelmodalidadItem.nivelModalidadDescripcion,nivelMdalidadInfoActual)
          // para asignar nomenclatura
          ceEtapa6PmeArchivoNivModCreateModel.nombreArchivo = name + '.' + extension;
          cEEtapa6PMEArchivoCreateModel.nivelesModalidad.push(ceEtapa6PmeArchivoNivModCreateModel);
          this.modalData.archivos.push(this.ceetapa6PlanMejoraEjecucionId);
          if (this.modalData.esCarga && this.ceetapa6PlanMejoraEjecucionId.archivos.length > 0) {
            this.dataSourceArchivos = new MatTableDataSource<any>;
            this.dataSourceArchivos.data = this.ceetapa6PlanMejoraEjecucionId.archivos
          }
        }
      });
      this.ceetapa6PlanMejoraEjecucionId.archivos.push(cEEtapa6PMEArchivoCreateModel);
    };
  }

  guardaarchivo() {
    this.errorevidencia = false;
    this.modalData.estatusEtapa = this.estatusEtapa7.guardada;

    if (!this.comentarioEvidencia) {
      this.errorevidencia = true;
      return;
    }

    this.ceetapa6PlanMejoraEjecucionId.estatusEtapa = this.estatusEtapa7.guardada; 
    this.ceetapa6PlanMejoraEjecucionId.evidenciaDescripcion = this.comentarioEvidencia;
    
    if (!this.ceetapa6PlanMejoraEjecucionId.archivos || this.ceetapa6PlanMejoraEjecucionId.archivos.length < 1){
      this.basicNotification.notif("error", `Se requiere agregar archivos`,5000);
      return;
    }

    if (!this.nivelesSeleccionados){
      this.basicNotification.notif("error", `Se requiere seleccionar al menor un nivel.`,5000);
      return;
    }

    this.EvaCService.addCeEtapa6PlanMejoraEvidencia(this.ceetapa6PlanMejoraEjecucionId).subscribe(response => {
      if (response.output) {
        let result = response.output as any;
        this.refDiag.close(true);
        this.basicNotification.notif("success", `Evidencia guardada correctamente`);
      }
      else {
        this.basicNotification.notif("error", `Evidencia no guardada`);
      }
    })
  }

  guardar() {
    this.guardaarchivo();
  }

  closeModal() {
    this.refDiag.close(true);
  }

  // #region Funciones generales modal captura

  configuraVista() {
    this.listaNiveles = [];
    this.informacionActual.forEach((element: any) => {
      this.listaNiveles.push({ nivelModalidadId: element.nivelModalidadId, 
        nivelModalidadDescripcion: element.nivelModalidadDescripcion,
        ceetapa6PlanMejoraEjecucionId: element.ceetapa6PlanMejoraEjecucionId,
        ceevaluacionId: element.ceevaluacionId
       });
    });

    console.log('this.listaNiveles', this.listaNiveles);
    if (this.modalData.esCarga) {
      this.modalData.archivos = [];
      this.dataSourceArchivos = new MatTableDataSource<any>;
      this.dataSourceArchivos.data = this.ceetapa6PlanMejoraEjecucionId.archivos
    }
    else {
      this.dataSourceArchivos = new MatTableDataSource<any>;
      this.dataSourceArchivos.data = this.modalData.archivos
    }

  }

  // #endregion

  DownloadFile(file: any) {
    var fileExt = file.archivoNombre.split('.');
    if (fileExt.length > 1) {
      this.EvaCService.getAzureFilePM(file.archivoId).subscribe((res: any) => {
        saveAs(res, file.nombre);
      });
    }
  }

  remove(index: any, row: any): void {
    if (this.modalData.esCarga && this.ceetapa6PlanMejoraEjecucionId.archivos.length > 0) {
      this.ceetapa6PlanMejoraEjecucionId.archivos.splice(index, 1)
      this.dataSourceArchivos = new MatTableDataSource<any>;
      this.dataSourceArchivos.data = this.ceetapa6PlanMejoraEjecucionId.archivos
    }
  }

  getnombreevidencia(nivelModalidadDescripcion: any , nivelActual : any) 
  {
    let ciclodatos = this.EvaCService.obtenerDatosDeStorageCicloEvaluacion();
    let proceso = ciclodatos.procesoEvaluacion; //this.evidenciaData.infoindicador.CicloEvaluacionInfo.procesoEvaluacion;
    let claveInstitucion = ciclodatos.claveInstitucion;
    let anio = ciclodatos.anio;
    let ciclo = ciclodatos.ciclo;
    let clavecampus = this.modalData.claveCampus;
    let areaResponsableSiglas = this.modalData.claveAreaResponsable; 
    let claveComponente = this.modalData.claveComponente; 
    let claveIndicador = this.modalData.claveIndicador;
    let nivelModalidad = nivelModalidadDescripcion.toUpperCase().includes('CAMPUS') ? 'COMUN' : nivelModalidadDescripcion;
    let claveEdivencia = '' //this.modalData.claveEvidencia;
    let nombre = `${proceso}_${claveInstitucion}_${anio}_${ciclo}_${clavecampus}_${areaResponsableSiglas}${claveComponente}_${claveIndicador}_${nivelModalidad}${claveEdivencia}`    
    
    if (nivelActual != null) // calculo pera elnombre de archivo que se va a la base de datos
    {
      let cantidadArchivosActual = 0
      if (nivelActual[0].archivos)
      {
        cantidadArchivosActual =  nivelActual[0].archivos ? nivelActual[0].archivos.length : 0;  
      }

      let arcvhiosEnGrid = 0
      if (this.ceetapa6PlanMejoraEjecucionId.archivos){
        arcvhiosEnGrid  =  this.ceetapa6PlanMejoraEjecucionId.archivos ? this.ceetapa6PlanMejoraEjecucionId.archivos.length : 0;
      }

      if (arcvhiosEnGrid > 0  || cantidadArchivosActual > 0)
      {
          let consecutivo= arcvhiosEnGrid + cantidadArchivosActual +  1
          nombre =  nombre + "_" + consecutivo.toString()
      }

      if (arcvhiosEnGrid == 0  && cantidadArchivosActual == 0)
      {
        nombre =  nombre + "_1";
      }
      

    }
    let nombreMayuscula = 'PM_' + this.Convert(nombre).toUpperCase();
    return nombreMayuscula;
  }

  removeAzure(row: any, index: any): void {
    console.log(row);

    if (!row.ceetapa6PlanMejoraEjecucionArchivoId) {
      return;
    }
    this.EvaCService.deleteCeEtapa6PMEEvidenciaArchivo(row.ceetapa6PlanMejoraEjecucionArchivoId).subscribe(response => {
      if (response.output) {
        this.basicNotification.notif("success", `Evidencia eliminada correctamente`);
        if (!this.modalData.esCarga) {
          this.modalData.archivos.splice(index, 1);
          this.dataSourceArchivos = new MatTableDataSource<any>;
          this.dataSourceArchivos.data = this.modalData.archivos
        }
      }
      else {
        this.basicNotification.notif("error", `Evidencia no eliminada`);
      }
    })
  }

  toggleAllSelection(event: any) {
    let seleccionoTodos = this.nivelesSeleccionados.findIndex(x => x == 0);
    if (seleccionoTodos == -1) // des selecciono la opcion de todos
    {
      this.nivelesSeleccionados = []
    }
    else {
      let seleccionoTodos = this.listaNiveles.map((x: any) => x.nivelModalidadId);
      console.log(seleccionoTodos);
      this.nivelesSeleccionados = [0].concat(seleccionoTodos);
    }
  }

  Convert(string: any){
    return string.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
}
