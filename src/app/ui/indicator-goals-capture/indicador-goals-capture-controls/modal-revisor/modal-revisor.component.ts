import { Component, OnInit, Inject, asNativeElements } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormControl, FormArray, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Alert, clearForm } from 'src/app/utils/helpers';
import { CriteriosEvaluacionRecordDTO, RevisorModelDTO, TablePaginatorSearch } from 'src/app/utils/models';
import { EvaluationCriteriosService, EvidencesCatalogService, EvaluationCycleService, UsersService } from 'src/app/core/services';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';
import saveAs from 'file-saver';
import { ValidatorService } from 'src/app/shared/validators';
import { EvaluationCriteriaIrService } from 'src/app/core/services/api/evaluation-criteria-ir/evaluation-criteria-ir.service';

interface crite {
  id: number
  cumple: boolean
}

@Component({
  selector: 'app-modal-revisor',
  templateUrl: './modal-revisor.component.html',
  styleUrls: ['./modal-revisor.component.scss'],
  providers: [DatePipe] // Agregar DatePipe como provider
})
export class ModalRevisorComponent implements OnInit {
  filters: TablePaginatorSearch;
  recordForm: FormGroup;
  title: string = 'Revisión Institucional';
  description: string;
  data: any;
  criterios: any;
  estatusRi: any;
  //selectedOption = '';
  compartirArea: boolean = false;
  today = new Date();
  criteriosArr: crite[] = [];
  fileArr: any[] = [];
  fileArrN: boolean = false;
  urlFileArr: any[] = [];
  urlFileArrN: boolean = false;
  errEstatus: string;
  errComentario: string;
  estatusRiid: any;
  comentarioRi: any;
  fechaSesionRi: any;
  columns = ['escala', 'seleccionado', 'seleccionajustada', 'requisitoCondicion'];
  tieneSeConfirmoRubrica: any;
  metaEtapa: any;
  metaEtapaArchivo: any;
  modelE2: any;
  etapasList: any;
  etapaInfo: any;
  //data: any[];
  //dataSource: MatTableDataSource<CicloEvaluacionIndicadoresDTO>;
  

  constructor(@Inject(MAT_DIALOG_DATA)
  public readonly metaData: any,
    private users: UsersService,
    private readonly fb: FormBuilder,
    private readonly ref: MatDialogRef<never>,
    private readonly ECService: EvaluationCriteriosService,
    private readonly evidences: EvidencesCatalogService,
    private readonly EvaCService: EvaluationCycleService,
    private readonly validator: ValidatorService,
    private etapasS: EvaluationCriteriaIrService,
    private basicNotification: BasicNotification,
    private datePipe: DatePipe
  ) {
    console.log('METADATA:', metaData);//LOG META
    this.recordForm = this.fb.group({
      comentarioRi: [null, [Validators.required, Validators.maxLength(300), this.validator.noWhitespace]],
      fechaSesionRi: [null, []],
      estatusRiid: [null, [Validators.required]],
      shared: [false, []],
      customRadios: [null]
    });
  }

  ngOnInit(): void {
    console.log('Fecha un Año atras:', this.today.setFullYear(this.today.getFullYear() - 1));
    const { cicloEvaluacionId, ceevaluacionId, etapa, areaResponsableId, campusId, areaId } = this.metaData;
    
    this.getEvaCiterios(cicloEvaluacionId, etapa);
    const model: RevisorModelDTO = new RevisorModelDTO();
    this.modelE2 = model;
    model.cicloEvaluacionId = cicloEvaluacionId;
    model.etapaId = etapa;
    if (this.metaData.E6PM || etapa == 9) {//Etapa 6 - plan de mejora
      model.areaResponsableId = this.metaData.E6PM || etapa == 9 ? areaId : areaResponsableId;
      model.campusId = campusId;
    } else {//Para todas las etapas
      model.ceevaluacionId = ceevaluacionId;
    }//console.log('model:',model);
    this.respEvaCiterios(model);

    if (this.metaData.esVista) {
      this.filters = new TablePaginatorSearch();
      this.filters.pageSize = 0;
      this.filters.pageNumber = 0;
      this.filters.filter = {
        "cicloEvaluacionId": this.metaData.cicloEvaluacionId,
        "indicadorId": this.metaData.indicadorId,
        "campusId": this.metaData.campusId,
        "areaResponsableId": this.metaData.areaId,
        "usuarioId": this.users.userSession.id,
        "procesoEvaluacionId": this.metaData.procesoEvaluacionId,
        "etapaId": this.metaData.etapaId
      }; console.log(this.filters.filter);
      this.getEtapasRI(this.filters);
    } else {
      //CARGA ETAPA2
      this.cargaInfoArchivosE2();
      //CARGA ETAPA7
      this.cargaInfoArchivosE2E7();
      //COLUMNAS DE RUBRICA ETAPA5
      this.validacionRubricaE5();
      //
      this.getStatusRi();
    }
    this.getEtapas(etapa);
  }

  private respEvaCiterios(model: any): void {
    if (model.etapaId == 2) {
      if(!this.metaData.esVista){
        model.evidenciaId = this.metaData.evidenciaId;
        //console.log(model);
        this.ECService.postRespCeEtapa7ToEtapa2(model).subscribe((response) => {
          if (response.exito) {
            this.data = response.output; //console.log(this.data);
            this.respCeEtapa7(this.data);
          }
        });
      }
    } else {
      //console.log(model);
      this.ECService.postRespCeEtapa7(model).subscribe((response) => {
        if (response.exito) {
          this.data = response.output; //console.log(this.data);
          this.respCeEtapa7(this.data);
        }
      });
    }
  }

  respCeEtapa7(data: any) {
    //console.log('RESPUESTA RI:', data);//LOG RESPUESTA RI
    if (data.id) {
      this.recordForm.get('shared').setValue(data.compartirAtea);

      if (this.metaData.esVista) {
        this.comentarioRi = data.comentarioRi;
        this.fechaSesionRi = data.fechaSesionRi;
        this.estatusRiid = data.estatusRiid == 1 ? 'Revisado' : 'Revisado corregido';
      } else { }

      this.recordForm.get('comentarioRi').patchValue(data.comentarioRi);
      this.recordForm.get('fechaSesionRi').patchValue(data.fechaSesionRi);
      this.recordForm.get('estatusRiid').patchValue(data.estatusRiid);
      //Criterios
      setTimeout(() => {
        const { ceetapa7RiCriterio } = data; //console.log('PREGUNTAS:', ceetapa7RiCriterio);//LOG PREGUNTAS
        const n = ceetapa7RiCriterio.length;
        for (let i = 0; i < n; i++) {
          const { criteriosEvaluacionRiid, cumple } = ceetapa7RiCriterio[i];
          const cId = document.getElementById(criteriosEvaluacionRiid) as HTMLInputElement; //console.log(cId); 
          if (cId) {
            const radioButtonValue = cumple ? '1' : '2';
            const radioButton = cId.querySelector(`mat-radio-button[value="${radioButtonValue}"] input`) as HTMLInputElement;
            if (radioButton) {
              radioButton.checked = true;
              radioButton.dispatchEvent(new Event('change')); // Para disparar el evento change si es necesario
            }
          }
        }
      }, 500);
    }

  }

  private getEvaCiterios(idCe: any, idEtapa: any): void {
    this.ECService.getAllCriterios(idCe, idEtapa).subscribe((response) => {
      if (response.exito) {
        this.criterios = response.output.filter((x: { activo: boolean; }) => x.activo === true); //console.log(this.criterios);
      }
    });
  }

  private getStatusRi() {
    this.ECService.getStatusRI().subscribe((response) => {
      if (response.exito) {
        this.estatusRi = response.output; //console.log('estatusRi:',this.estatusRi);
      }
    });
  }

  submit() {
    this.recordForm.markAllAsTouched();
    if (this.recordForm.invalid) {
      console.log('this.recordForm.invalid:', this.recordForm.invalid);
      //this.basicNotification.notif("warning", "Verifique que los campos sean correctos y no esten vacios.");
      //return;
    }
    //clearForm(this.recordForm);
    const form = this.recordForm.getRawValue();
    delete form.shared;
    delete form.customRadios;//console.log(form);
    const model: CriteriosEvaluacionRecordDTO = new CriteriosEvaluacionRecordDTO().deserialize(form);
    const idUser = JSON.parse(localStorage.getItem('session'));

    //Default
    model.cicloEvaluacionId = this.metaData.cicloEvaluacionId;
    model.etapaId = this.metaData.etapa;
    //
    model.ceevaluacionId = (!this.metaData.E6PM) ? this.metaData.ceevaluacionId : null;
    //Etapa 6 - PM
    model.areaResponsableId = (this.metaData.E6PM) ? this.metaData.areaId : this.metaData.areaResponsableId;
    model.campusId = (this.metaData.E6PM) ? this.metaData.campusId : null;
    //
    model.compartirAtea = this.compartirArea;
    //console.log(this.data);
    if (this.data.id) {
      console.log('Editar');
      model.fechaCreacion = this.data.fechaCreacion;
      model.usuarioCreacion = this.data.usuarioCreacion;
      model.fechaModificacion = new Date();
      model.usuarioModificacion = idUser.id;
    } else {
      console.log('Guardar');
      model.fechaCreacion = new Date();
      model.usuarioCreacion = idUser.id;
    }
    //ceetapa7RiCriterio
    const ceetapa7RiCriterio = [];
    const n = this.criteriosArr.length;
    for (let i = 0; i < n; i++) {
      const { id, cumple } = this.criteriosArr[i];
      ceetapa7RiCriterio.push({
        id: 0,
        criteriosEvaluacionRiid: id,
        cumple: cumple,
        noCumple: !cumple,
        fechaCreacion: (this.data.id) ? this.data.ceetapa7RiCriterio.fechaCreacion : new Date(),
        usuarioCreacion: (this.data.id) ? this.data.ceetapa7RiCriterio.usuarioCreacion : idUser.id,
        fechaModificacion: (this.data.id) ? new Date() : null,
        usuarioModificacion: (this.data.id) ? idUser.id : null
      });
    }
    model.ceetapa7RiCriterio = ceetapa7RiCriterio;
    console.log('model', model);
    //Validacion de preguntas
    if (model.ceetapa7RiCriterio.length == 0) {
      console.error('Seleccione Criterios');
      this.basicNotification.notif("error", 'Seleccione las opciones de las preguntas de criterios');
    }
    if (model.estatusRiid == null) {
      console.error('Este campo es obligatorio');
      this.errEstatus = 'Este campo es obligatorio';
    } else { this.errEstatus = null }
    if (model.comentarioRi == null || model.comentarioRi == '') {
      console.error('Este campo es obligatorio');
      this.errComentario = 'Este campo es obligatorio';
    } else { this.errComentario = null }
    console.log('Etapa:', this.metaData.etapa);
    if (model.ceetapa7RiCriterio.length == 0 || model.estatusRiid == null || model.comentarioRi == null || model.comentarioRi == '') { return; }
    //
    if (this.metaData.etapa != 5) {
      this.saveUpdateCeEtapa7(model);
    } else {
      console.log('metaData:', this.metaData);
      this.EvaCService.addUpdateCeEtapa5RevisionAutoevaluacion(this.metaData, idUser.id).subscribe(response => {
        if (response.exito) {
          console.log('Autoevaluación actualizada correctamente');
          this.saveUpdateCeEtapa7(model);
        } else {
          this.basicNotification.notif("error", 'Revisión institucional No se guardo correctamente');
        }
      });
    }
  }

  saveUpdateCeEtapa7(data: any) {
    if (this.metaData.etapa == 2) {
      data.evidenciaId = this.metaData.evidenciaId;
      this.ECService.addUpdateCeEtapa7ToEtapa2(data).subscribe((response) => {
        if (response.exito) {//console.log(response.output);
          this.basicNotification.notif("success", 'Revisión institucional guardada correctamente');
        } else {
          this.basicNotification.notif("error", 'Revisión institucional No se guardo correctamente');
        }
        this.ref.close(true);
      });
    } else {
      this.ECService.addUpdateCeEtapa7(data).subscribe((response) => {
        if (response.exito) {//console.log(response.output);
          this.basicNotification.notif("success", 'Revisión institucional guardada correctamente');
        } else {
          this.basicNotification.notif("error", 'Revisión institucional No se guardo correctamente');
        }
        this.ref.close(true);
      });
    }

  }

  shared(event: any) {
    this.compartirArea = event.checked; //console.log(this.compartirArea);
  }

  onRadioCriterios(event: any, id: number) {
    const isChecked = parseInt(event.value); //console.log(id, isChecked);
    const res = (this.criteriosArr.length > 0) ? this.criteriosArr.filter(x => x.id !== id) : [];
    const obj = { id, cumple: (isChecked == 1) };
    res.push(obj);
    this.criteriosArr = res; //console.log(this.criteriosArr);
  }

  closeModal() {
    this.ref.close(false);
  }

  openLink(url: any) {
    window.open(url, '_blank');
  }

  /** DESCARGA DE ARCHIVOS EN ETAPA E6PM[9] - E6E[7] - E6D[6] *************************************************************/
  DownloadFileVista(file: any){ console.log('DownloadFileVista:',file);
    //archivoId / nombreArchivoPmclm - [9,6]
    //idArchivoPmclm / nombreArchivoPmclm - [7]
    const archivoId = file.archivoId ? file.archivoId : file.idArchivoPmclm;
    const nombreFile = file.nombreArchivoPmclm;
    //console.log(archivoId,nombreFile);
    this.EvaCService.GetAzureFileByIdFile(archivoId, 'ceplanmejoraevidencias').subscribe(res => {
      var fileExt = nombreFile.split('.');
      if (fileExt.length > 1) {
        saveAs(res, nombreFile);
      }
    });
  }

  DownloadFile(file: any) { console.log('DownloadFile:',file);
    const archivoId = file.pmarchivoId ? file.pmarchivoId : file.archivoId ? file.archivoId : file.archivoIdPMCLM;
    const nombreFile = file.pmarchivoNombre ? file.pmarchivoNombre : file.nombreArchivoPMCLM ? file.nombreArchivoPMCLM : file.nombrePMCLM;
    //console.log(archivoId,nombreFile);
    var fileExt = nombreFile.split('.');
    if (fileExt.length > 1) {
      this.EvaCService.getAzureFilePM(archivoId).subscribe((res: any) => {
        saveAs(res, nombreFile);
      });
    }
  }
  /***************************************************************************************************************************/

  canViewFile(file: any): boolean {
    const nombreFile = file.archivoNombre ? file.archivoNombre : file.nombre;
    if (nombreFile) {
        if (nombreFile.includes('.pdf')) {
            return true;
        }
    }
    return false
  }

  canDownloadFile(file: any): boolean {
    const nombreFile = file.archivoNombre ? file.archivoNombre : file.nombre;
    if (nombreFile) {
        var fileExt = nombreFile.split('.');
        if (fileExt.length < 2) {// no tiene extension
            return false;
        }
        if (!nombreFile.includes('.pdf')) {
            return true;
        }
    }

    return false;
  }

  DownloadFileE7(file: any) {
    var fileExt = file.archivoNombre.split('.');
    if (fileExt.length > 1) {
      this.EvaCService.getAzureFilePM(file.archivoId).subscribe((res: any) => {
        saveAs(res, file.archivoNombre);
      });
    }
  }

  viewFileE7(file: any) {
    this.EvaCService.getAzureFilePM(file.archivoId).subscribe((res: any) => {
      let blob = new Blob([res], { type: 'application/pdf' });
      let pdfUrl = window.URL.createObjectURL(blob);
      var PDF_link = document.createElement('a');
      PDF_link.href = pdfUrl;
      window.open(pdfUrl, '_blank');
      PDF_link.download = file.archivoNombre;
      PDF_link.click();
    });
  }

  DownloadFileEvidence(file: any) {//console.log(file);
    var fileExt = file.nombre.split('.'); //console.log(fileExt);
    if (fileExt.length > 1) {
      this.evidences.GetAzureFileCapturaEvidencia(file.archivoId).subscribe((res: any) => {
        saveAs(res, file.nombre);
      });
    }
  }

  viewFileEvidence(file: any) {
    this.evidences.GetAzureFileCapturaEvidencia(file.archivoId).subscribe((res: any) => {
      let blob = new Blob([res], { type: 'application/pdf' });
      let pdfUrl = window.URL.createObjectURL(blob);
      var PDF_link = document.createElement('a');
      PDF_link.href = pdfUrl;
      window.open(pdfUrl, '_blank');
      PDF_link.download = file.nombre;
      PDF_link.click();
    });
  }

  evidenceAcept() {
    //setTimeout(() => {
      console.log('evidenceAcept');
      const idAcept = document.getElementById('evidenceAcept') as HTMLFormElement; //console.log(idAcept);
      if (idAcept) {
        const radioButtonValue = this.metaData.estatusDescripcion == 'Aceptada' ? '4' : this.metaData.estatusDescripcion == 'No aceptada' ? '3' : null;
        const radioButton = idAcept.querySelector(`mat-radio-button[value="${radioButtonValue}"] input`) as HTMLInputElement;
        if (radioButton) {
          radioButton.checked = true;
          radioButton.dispatchEvent(new Event('change')); // Para disparar el evento change si es necesario
        }
      }
    //}, 500); 
  }

  actualizaAjusteRubrica(event: any) {//actualizaRubricaAjuste(event: any) { //console.log(event);
    this.metaData.rubrica[event.id].seleccionAjustada = event.seleccionAjustada;
    /*let ind = this.metaData.rubrica.findIndex((x: any) => x.rubricaEvaluacionId === event.rubricaEvaluacionId);console.log(ind);
    if (ind != -1) { console.log(event.seleccionAjustada);
      this.metaData.rubrica[ind].seleccionAjustada = event.seleccionAjustada;
    } *///console.log(this.metaData);
  }

  obtenerFechaFormateada(fecha: string): string {
    return this.datePipe.transform(fecha, 'dd/MM/yy') || '';
  }

  replace(x: string, n: number) {
    let val = '';
    for (let i = 0; i <= 10; i++) {
      if (i == n) {
        val = x.replace('' + i + '', '');
      }
    }
    return val;
  }

  cargaInfoArchivosE2(){
    if (this.metaData.etapa == 2) {
      this.fileArr = this.metaData.evidenciaArchivos;
      this.fileArrN = (this.fileArr) ? this.fileArr.length > 0 : false;
      this.urlFileArr = this.metaData.evidenciaUrls;
      this.urlFileArrN = (this.urlFileArr) ? this.urlFileArr.length > 0 : false;
      //
      this.evidenceAcept();  
    }
  }

  cargaInfoArchivosE2E7(){
    if (this.metaData.etapa == 7) {
      this.fileArr = this.metaData.archivos;
      this.fileArrN = (this.fileArr) ? this.fileArr.length > 0 : false;
      //this.evidenceAcept();  
    }
  }

  validacionRubricaE5(){
    if (this.metaData.etapa == 5) {
      //this.tieneSeConfirmoRubrica = this.metaData.seConfirmoRubrica || this.metaData.seConfirmoRubrica != null; console.log('seConfirmoRubrica:',this.tieneSeConfirmoRubrica);   
      const tieneSeleccionAjustadaTrue = this.metaData.rubrica.some((x: { seleccionAjustada: boolean; }) => x.seleccionAjustada === true);   
      this.columns = this.metaData.seAjustoRubrica || tieneSeleccionAjustadaTrue ? ['escala', 'seleccionado', 'seleccionajustada', 'requisitoCondicion'] : ['escala', 'seleccionado', 'requisitoCondicion'];
      console.log('Columna:',this.metaData.seAjustoRubrica,tieneSeleccionAjustadaTrue);
    }
  }

  getEtapasRI(filter: any) {
    console.log('Etapa:', this.metaData.etapa);
    if (this.metaData.etapa == 1) {
      this.EvaCService.getCeEvaluacionEtapa1All(filter, this.metaData.cicloEvaluacionId).subscribe((response) => {
        if (response.output) {//console.log(response.output);
          this.metaEtapa = response.output.indicadoresEtapa1.find((x: {
            ceevaluacionId: any;
            nivelModalidadDescripcion: any;  
          }) => x.ceevaluacionId === this.metaData.ceevaluacionId && x.nivelModalidadDescripcion === this.metaData.nivelModalidad);
          console.log('Response Etapa:', this.metaEtapa); 
          this.metaData.decisionAnteriorNombre = this.metaEtapa.decisionAnteriorNombre;
          this.metaData.metaActual = this.metaEtapa.metaActual;
          this.metaData.metaAnterior = this.metaEtapa.metaAnterior;
          this.metaData.metaInstitucional = this.metaEtapa.metaInstitucional;
        }
      });
    }
    if (this.metaData.etapa == 2) {
      this.EvaCService.getCeEvaluacionEtapa2All(filter, this.metaData.cicloEvaluacionId).subscribe((response) => {
        if (response.output) { //console.log(response.output);
          this.metaEtapa = response.output.indicadoresEtapas.find((x: {
            ceevaluacionId: any;
            nivelModalidadDescripcion: any;  
          }) => x.ceevaluacionId === this.metaData.ceevaluacionId && x.nivelModalidadDescripcion === this.metaData.nivelModalidad);
          console.log('Response Etapa:', this.metaEtapa);  
          this.metaData.claveEvidencia = this.metaEtapa.claveEvidencia;
          this.metaData.nombreEvidencia = this.metaEtapa.nombreEvidencia;
          this.metaData.formatoEvidencia = this.metaEtapa.formatoEvidencia;
          this.metaData.descripcionEvidencia = this.metaEtapa.descripcionEvidencia;
          this.metaData.estatusDescripcion = this.metaEtapa.estatusDescripcion;
          this.metaData.comentAceptar = this.metaEtapa.comentAceptar;
          //CARGA ETAPA2
          this.metaData.evidenciaUrls = this.metaEtapa.evidenciaUrls;
          this.metaData.evidenciaArchivos = this.metaEtapa.evidenciaArchivos; 
          this.cargaInfoArchivosE2();
          //MODEL 2
          this.modelE2.evidenciaId = this.metaEtapa.evidenciaId;
          this.ECService.postRespCeEtapa7ToEtapa2(this.modelE2).subscribe((response) => {
          if (response.exito) {
            this.data = response.output; //console.log(this.data);
            this.respCeEtapa7(this.data);
          }
      });     
        }
      });
    }
    if (this.metaData.etapa == 3) {
      this.EvaCService.getCeEvaluacionEtapa3All(filter, this.metaData.cicloEvaluacionId).subscribe((response) => {
        if (response.output) {//console.log(response.output);
          this.metaEtapa = response.output.indicadoresEtapas.find((x: {
            ceevaluacionId: any;
            nivelModalidadDescripcion: any;  
          }) => x.ceevaluacionId === this.metaData.ceevaluacionId && x.nivelModalidadDescripcion === this.metaData.nivelModalidad);
          console.log('Response Etapa:', this.metaEtapa);
          this.metaData.resultadoAnterior = this.metaEtapa.resultadoAnterior;
          this.metaData.resultadoActual = this.metaEtapa.resultadoActual;
          this.metaData.metaActual = this.metaEtapa.metaActual;
          this.metaData.cumplimientoAnterior = this.metaEtapa.cumplimientoAnterior;
          this.metaData.justificacionIncumplimiento = this.metaEtapa.justificacionIncumplimiento; 
          //this.metaData.cumplimientoAnterior = this.metaEtapa.cumplimientoAnterior;
          //this.metaData.cumplimientoActual = this.metaEtapa.cumplimientoActual;         
        }
      });
    }
    if (this.metaData.etapa == 5) {
      this.EvaCService.getCeEvaluacionEtapa5All(filter, this.metaData.cicloEvaluacionId).subscribe((response) => {
        if (response.output) {//console.log(response.output);
          this.metaEtapa = response.output.indicadoresEtapas.find((x: {
            ceevaluacionId: any;
            nivelModalidadDescripcion: any;  
          }) => x.ceevaluacionId === this.metaData.ceevaluacionId && x.nivelModalidadDescripcion === this.metaData.nivelModalidad);
          console.log('Response Etapa:', this.metaEtapa);
          this.metaData.metaActual = this.metaEtapa.metaActual;
          this.metaData.resultadoActual = this.metaEtapa.resultadoActual;
          this.metaData.puntaje = this.metaEtapa.puntaje;
          this.metaData.puntajeAjustado = this.metaEtapa.puntajeAjustado;
          this.metaData.observacionAjuste = this.metaEtapa.observacionAjuste;
          this.metaData.rubrica = this.metaEtapa.rubrica;
          this.metaData.seConfirmoRubrica = this.metaEtapa.seConfirmoRubrica;
          this.metaData.seAjustoRubrica = this.metaEtapa.seAjustoRubrica;
          this.metaData.seConfirmoPuntaje = this.metaEtapa.seConfirmoPuntaje;
          this.metaData.seAjustoPuntaje = this.metaEtapa.seAjustoPuntaje;
          this.metaData.comentario = this.metaEtapa.comentario;
          this.metaData.puntajeKeyValue = this.metaEtapa.puntajeKeyValue;
          //COLUMNAS DE RUBRICA ETAPA5
          this.validacionRubricaE5();
        }
      });
    }
    if (this.metaData.etapa == 6) {
      this.EvaCService.getCeIndicadoresEtapa6PMDAll(filter).subscribe((response) => {
        if (response.output) { //console.log(response.output);
          this.metaEtapa = response.output.indicadoresEtapas.find((x: {
            ceevaluacionId: any;
            nivelModalidadDescripcion: any;  
          }) => x.ceevaluacionId === this.metaData.ceevaluacionId && x.nivelModalidadDescripcion === this.metaData.nivelModalidad);
          console.log('Response Etapa:', this.metaEtapa); 
          this.metaData.sugerenciaSIAC = this.metaEtapa.sugerenciaSIAC;
          this.metaData.estatusDescripcion = this.metaEtapa.estatusDescripcion;
          this.metaData.decisionAreaDescripcion = this.metaEtapa.decisionAreaDescripcion; 
        }
      });
      //Consultar Archivo
      //this.consultarArchivoPM(filter);
      this.EvaCService.getCeEtapa6CampusVw1(filter).subscribe((response) => {      
        if (response.output) {//console.log(response.output);
          this.metaEtapaArchivo = response.output.indicadoresEtapas.find((x: {
            areaResponsableId: any;
            campusId: any;
          }) => x.areaResponsableId === this.metaData.areaId && x.campusId === this.metaData.campusId);
          console.log('Response EtapaArchivo:', this.metaEtapaArchivo); 
          this.metaData.pmarchivoNombre = this.metaEtapaArchivo.nombreArchivoPmclm;
        }
      });
    }
    if (this.metaData.etapa == 7) {
      this.EvaCService.getCeIndicadoresEtapa6PMEAll(filter).subscribe((response) => {
        if (response.output) { //console.log(response.output); 
          this.metaEtapa = response.output.indicadoresEtapas.find((x: {
            ceevaluacionId: any;
            nivelModalidadDescripcion: any;  
          }) => x.ceevaluacionId === this.metaData.ceevaluacionId && x.nivelModalidadDescripcion === this.metaData.nivelModalidad);
          console.log('Response Etapa:', this.metaEtapa);
          this.metaData.sugerenciaSIAC = this.metaEtapa.sugerenciaSIAC;
          this.metaData.estatusDescripcion = this.metaEtapa.estatusDescripcion;
          this.metaData.decisionArea = this.metaEtapa.decisionAreaDescripcion; 
          this.metaData.archivos = this.metaEtapa.archivos;

          this.metaData.estatusPMCLMDescripcion = this.metaEtapa.estatusPMCLMDescripcion;
           //CARGA ETAPA2-7
           this.cargaInfoArchivosE2E7();        
        }
      });
      //Consultar Archivo
      //this.consultarArchivoPM(filter);
      this.EvaCService.getCeEtapa6ECampusVw1(filter).subscribe((response) => {
        if (response.output) {//console.log(response.output);
          this.metaEtapaArchivo = response.output.indicadoresEtapas.find((x: {
            areaResponsableId: any;
            campusId: any;
          }) => x.areaResponsableId === this.metaData.areaId && x.campusId === this.metaData.campusId);
          console.log('Response EtapaArchivo:', this.metaEtapaArchivo); 
          this.metaData.nombrePMCLM = this.metaEtapaArchivo.nombreArchivoPmclm;
        }
      });
    }
    if (this.metaData.etapa == 9) {
      this.consultarArchivoPM(filter);
    }
  }

  consultarArchivoPM(filter: any){
    this.metaData.E6PM = true;
    filter.filter = {
      "cicloEvaluacionId": this.metaData.cicloEvaluacionId,
      "campusId": this.metaData.campusId,
      "areaId": this.metaData.areaId
    };//console.log('FILTER',filter);
    this.EvaCService.getCeEtapa6CampusVw1RI(filter).subscribe((response) => {
      if (response.output) {//console.log(response.output);
        if(response.output.indicadoresEtapas.length > 0){
          this.metaEtapaArchivo = response.output.indicadoresEtapas[0];
          console.log('Response EtapaArchivo:', this.metaEtapaArchivo); 
          this.metaData.nombreArchivoPMCLM = this.metaEtapaArchivo.nombreArchivoPmclm;
          this.metaData.comentNoAutorizado = this.metaEtapaArchivo.comentNoAutorizado;
          this.metaData.comentarioRetro = this.metaEtapaArchivo.comentarioRetro;
          this.metaData.estatusDescripcion = this.metaEtapaArchivo.estatusDescripcion;
          this.metaData.sesionRetro = this.metaEtapaArchivo.sesionRetro;  
        }
      }
    });
  }

  getEtapas(Id: any) {
    const filters = { filter: { 'AplicaCriterioEvaluacion': true } };
    this.etapasS.getAllAplicablePhasesToECIR(filters).subscribe((response: any) => {
      if (!response.output) {return;}
      this.etapasList = response.output.map((item: any) => {
        return {
          etapaId: item.id,
          etapa: item.clave + ' ' + item.nombre,
          clave: item.clave,
          nombre: item.nombre
        };
      });//console.log('etapasList:',this.etapasList);
      this.etapaInfo =  this.etapasList.find((x: { etapaId: any; }) => x.etapaId === Id); //console.log('EtapaInfo:',this.etapaInfo);
      this.title = (this.metaData.esVista) ? 'Consultar ' + this.title + ' - ' + this.etapaInfo.nombre : this.title + ' - ' + this.etapaInfo.nombre;
    });
  }

}
