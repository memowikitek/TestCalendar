import { AfterViewInit, Component, ElementRef, Inject, OnInit, SecurityContext, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EvaluationCycleService, EvidencesCatalogService, UsersService } from 'src/app/core/services';
import { ValidatorService } from 'src/app/shared/validators';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import saveAs from 'file-saver';
import { NotificacionesNaDto } from 'src/app/utils/models/notificaciones-na.dto';
import { EstatusEtapa2Evidencias } from 'src/app/utils/models/enums-estatus-etapas';


@Component({
  selector: 'app-modal-evidence-capture',
  templateUrl: './modal-evidence-capture.component.html',
  styleUrls: ['./modal-evidence-capture.component.scss']
})
export class ModalEvidenceCaptureComponent implements OnInit, AfterViewInit {
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  dataSource: MatTableDataSource<any>;
  dataSourceArchivos: MatTableDataSource<any>;

  announcer = inject(LiveAnnouncer);
  @ViewChild('uri') uri: ElementRef;
  @ViewChild('comentariosna') comentariosna: ElementRef;

  // goalRecordForm: FormGroup;
  solictoAutorizacion = false;
  noAutorizo = false;

  errorJustificacion = false;
  errorAutorizado = false;

  estatusAutorizacion = "5";
  backcurrentData: any;
  title: any;

  constructor(@Inject(MAT_DIALOG_DATA)
  public readonly evidenciaData: any,
    private users: UsersService,
    private router: Router,
    private readonly formBuilder: FormBuilder,
    private readonly validator: ValidatorService,
    private readonly ref: MatDialogRef<never>,
    private readonly EvaCService: EvaluationCycleService,
    private basicNotification: BasicNotification,
    public sanitizer: DomSanitizer,
    private readonly evidences: EvidencesCatalogService) {
    this.backcurrentData = JSON.parse(JSON.stringify(evidenciaData))

    this.dataSource = new MatTableDataSource<any>;
    this.dataSource.data = evidenciaData.evidenciaUrls

    this.dataSourceArchivos = new MatTableDataSource<any>;
    this.dataSourceArchivos.data = evidenciaData.evidenciaArchivos
    console.log(evidenciaData);

  }

  ngAfterViewInit(): void {
    this.comentariosna.nativeElement.value = this.evidenciaData.justificacionNa;
  }

  configuraNa() {

    this.evidenciaData.evidenciaArchivos = [];
    this.evidenciaData.evidenciaUrls = [];
    this.dataSource.data = this.evidenciaData.evidenciaUrls;
  }

  guardar() {

    this.evidenciaData.estatusEtapa = EstatusEtapa2Evidencias.cargada;

    if (this.evidenciaData.solicitaNa == true) {
      this.evidenciaData.estatusEtapa = EstatusEtapa2Evidencias.narevision;
      this.evidenciaData.justificacionNa = this.comentariosna.nativeElement.value

      if (!this.evidenciaData.justificacionNa) {
        this.errorJustificacion = true;
        return;
      }

      this.configuraNa();
    }
    else {
      this.evidenciaData.justificacionNA = null;
    }
    this.validaEstatusNa();
    this.evidenciaData.usuarioId = this.users.userSession.id;
    this.EvaCService.addUpdateCeEtapa2Meta(this.evidenciaData).subscribe((response) => {
      if (response.output) {
        let result = response.output as any;
        this.ref.close(true);
        this.basicNotification.notif("success", 'Evidencia guardada correctamente');
        if (this.evidenciaData.solicitaNa) {
          this.enviaNotificacionNA(this.evidenciaData);
        }
      }
      else {
        this.basicNotification.notif("error", 'Evidencia no guardada');
      }
    });
  }

  // valida si tenia seleccionado na y actualmente lo desactivo
  validaEstatusNa() {
    if (this.backcurrentData.solicitaNa == true && this.evidenciaData.solicitaNa == false) {
      this.evidenciaData.estatusEtapa = this.validaTieneDatosCapturados() ? EstatusEtapa2Evidencias.cargada : EstatusEtapa2Evidencias.pendiente;
    }
  }

  // Validaciones personalizadas para determinar si se realizo una captura
  validaTieneDatosCapturados(): boolean {
    if (this.evidenciaData.evidenciaArchivos) {
      if (this.evidenciaData.evidenciaArchivos.length > 0) {
        return true;
      }
    }
    if (this.evidenciaData.evidenciaUrls) {
      if (this.evidenciaData.evidenciaUrls.length > 0) {
        return true;
      }
    }
    return false;
  }

  enviaNotificacionNA(dataMsg: any) {
    let datoCicloEvaluacion = this.EvaCService.obtenerDatosDeStorageCicloEvaluacion();
    let msg = new NotificacionesNaDto();
    msg.cicloEvaluacionId = dataMsg.cicloEvaluacionId;
    msg.titulo = `Autorización NA: ${datoCicloEvaluacion.etapaEvaluacion[0].etapa}`;
    msg.mensaje = `${datoCicloEvaluacion.cicloEvaluacion} ${dataMsg.infoindicador.campus} ${dataMsg.infoindicador.areaResponsable} ${dataMsg.claveIndicador}`
    msg.usuarioCreacion = this.users.userSession.id;
    this.EvaCService.sendNotificacionNA(msg).subscribe((respmsg: any) => {
      if (respmsg.Exito) {
        console.info("el mensaje fue enviado correctamente", msg);
      }
    });
  }

  ngOnInit(): void {
    this.title = this.evidenciaData.esVista ? 'Consultar Carga de Evidencias' :  'Carga de Evidencias'
  }

  closeModal() {
    this.ref.close(false);
  }

  aplicarReglasNegocioSolicita(checked: boolean, event: any) {
    if (event) {
      this.evidenciaData.solicitaNa = event.checked;
      if (!event.checked) {
        this.evidenciaData.justificacionNa = null;
      }
    }
  }

  openLink(url: any) {
    window.open(url, '_blank');
  }

  handleUpload(event: any) {

    if (!this.evidenciaData.evidenciaArchivos) {
      this.evidenciaData.evidenciaArchivos = [];
    }
    // archivo
    const file = event.target.files[0];
    if (file.size > 40000000) {
      this.basicNotification.notif("error", 'No se puede agregar el archivo ya que es mayor a 40MB');
      return;
    }
    /////

    // extension
    var regexAll = /[^\\]*\.(\w+)$/;
    var total = file.name.match(regexAll);
    var filename = total[0];
    var extension = total[1];
    /////

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      let archivo = { ceEtapa2EvidenciasArchivosId: 0, cEEtapa2EvidenciasId: 0, archivoId: 0, nombre: this.getnombreevidencia(1) + "." + extension, archivo: reader.result }
      this.evidenciaData.evidenciaArchivos.push(archivo);


      this.dataSourceArchivos = new MatTableDataSource<any>;
      this.dataSourceArchivos.data = this.evidenciaData.evidenciaArchivos

    };
  }

  remove(archivo: any): void {
    const index = this.evidenciaData.evidenciaArchivos.indexOf(archivo);
    if (index >= 0) {
      this.evidenciaData.evidenciaArchivos.splice(index, 1);
      this.announcer.announce(`Removed ${archivo}`);

      this.dataSourceArchivos = new MatTableDataSource<any>;
      this.dataSourceArchivos.data = this.evidenciaData.evidenciaArchivos


    }
  }

  agregaurl() {

    if (!this.uri.nativeElement.value) {
      this.basicNotification.notif("error", 'Se requiere agregar una dirección en el campo URL');
      return;
    }

    let urlData = { cEEtapa2EvidenciasId: 0, cEEtapa2EvidenciasURLsId: 0, nombre: this.getnombreevidencia(2), url: this.uri.nativeElement.value }
    this.evidenciaData.evidenciaUrls.push(urlData);
    this.dataSource.data = this.evidenciaData.evidenciaUrls;
    this.uri.nativeElement.value = '';
  }

  getnombreevidencia(tiponombre: number) {
    let proceso = this.evidenciaData.infoindicador.CicloEvaluacionInfo.procesoEvaluacion;
    let claveInstitucion = this.evidenciaData.infoindicador.CicloEvaluacionInfo.claveInstitucion;
    let anio = this.evidenciaData.infoindicador.CicloEvaluacionInfo.anio;
    let ciclo = this.evidenciaData.infoindicador.CicloEvaluacionInfo.ciclo;
    let clavecampus = this.evidenciaData.infoindicador.campusId;
    let areaResponsableSiglas = this.evidenciaData.claveAreaResponsable;
    let claveComponente = this.evidenciaData.claveComponente;
    let claveIndicador = this.evidenciaData.claveIndicador;
    let nivelModalidad = this.evidenciaData.nivelModalidadDescripcion;
    let claveEdivencia = this.evidenciaData.claveEvidencia;

    let consecutivo = 1;
    if (tiponombre == 1)// archivos
    {
      if (this.evidenciaData.evidenciaArchivos) {
        consecutivo = this.evidenciaData.evidenciaArchivos.length + 1;
      }

    }
    else // urls
    {
      if (this.evidenciaData.evidenciaUrls) {
        consecutivo = this.evidenciaData.evidenciaUrls.length + 1
      }
    }
    return `${proceso}_${claveInstitucion}_${anio}_${ciclo}_${clavecampus}_${areaResponsableSiglas}_${claveComponente}_${claveIndicador}_${nivelModalidad}_${claveEdivencia}_${consecutivo}`;
  }

  eliminaurl(url: any) {
    const index = this.evidenciaData.evidenciaUrls.indexOf(url);
    if (index >= 0) {
      this.evidenciaData.evidenciaUrls.splice(index, 1);
      this.announcer.announce(`Removed ${url}`);
    }
    this.dataSource.data = this.evidenciaData.evidenciaUrls;
  }


  DownloadFileEvidence(file: any) {
    var fileExt = file.nombre.split('.');
    if (fileExt.length > 1) {
      this.evidences.GetAzureFileCapturaEvidencia(file.archivoId).subscribe((res: any) => {
        saveAs(res, file.nombre);
      });
    }
  }

  canDownloadFile(file: any): boolean {
    if (file.nombre) {
      var fileExt = file.nombre.split('.');
      if (fileExt.length < 2) // no tiene extension
      {
        return false;
      }
      if (!file.nombre.includes('.pdf')) {
        return true;
      }
    }
    return false;
  }

  canViewFile(file: any): boolean {

    if (file.archivoId == 0) {
      return false;
    }

    if (file.nombre) {
      if (file.nombre.includes('.pdf')) {
        return true;
      }
    }
    return false
  }

  canDelete(file: any): boolean {


    if (!file) {
      return false;
    }
    if (!file.archivoId) {
      return false;
    }

    if (file.archivoId == 0) {
      return false;
    }

    return true
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

  habilitaBotonGuardar(){

    if (!this.evidenciaData.evidenciaUrls && !this.evidenciaData.evidenciaArchivos && !this.evidenciaData.solicitaNa){
      return false;
    } 

    
    if (this.evidenciaData.evidenciaUrls.length < 1 && this.evidenciaData.evidenciaArchivos.length < 1 && !this.evidenciaData.solicitaNa ){
      return false;
    } 

    return true
  }

}
