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

@Component({
  selector: 'app-modal-evidence-accept',
  templateUrl: './modal-evidence-accept.component.html',
  styleUrls: ['./modal-evidence-accept.component.scss']
})
export class ModalEvidenceAcceptComponent {
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  dataSource: MatTableDataSource<any>;
  dataSourceArchivos: MatTableDataSource<any>;

  announcer = inject(LiveAnnouncer);
  @ViewChild('uri') uri: ElementRef;

  // goalRecordForm: FormGroup;
  solictoAutorizacion = false;
  noAutorizo = false;

  errorJustificacion = false;
  errorAutorizado = false;

  estatusAutorizacion = "7";
  selectedValueAutorize: number = null;

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

      
    this.dataSource = new MatTableDataSource<any>;
    this.dataSource.data = evidenciaData.evidenciaUrls

    this.dataSourceArchivos = new MatTableDataSource<any>;
    this.dataSourceArchivos.data = evidenciaData.evidenciaArchivos;
    this.selectedValueAutorize = this.evidenciaData.estatusEtapa;
    
  }

  ngAfterViewInit(): void {
  
  }

  guardar() {

    if (this.selectedValueAutorize == 3) {// No autorizado requiere comentario obligatorio
      this.evidenciaData.estatusEtapa =3;
      if (this.evidenciaData.comentAceptar ==null || !this.evidenciaData.comentAceptar) {
        this.errorAutorizado = true;
        return;
      }
    }
    else {
      if (this.selectedValueAutorize == 4) { // autorizado no requiere comentarios
        this.evidenciaData.estatusEtapa = 4;
        // this.evidenciaData.autorizaNa = true
        // this.evidenciaData.comentAutorizaNa = null;
      }
    }

    this.evidenciaData.usuarioId = this.users.userSession.id;
    this.EvaCService.addUpdateCeEtapa2Meta(this.evidenciaData).subscribe((response) => {
      if (response.output) {
        let result = response.output as any;
        this.ref.close(true);
        let msgEvidencia = this.selectedValueAutorize == 3 ? `Evidencia no aceptada correctamente` : this.selectedValueAutorize == 4 ? `Evidencia aceptada correctamente` : `Evidencia guardada correctamente`;
        this.basicNotification.notif("success", msgEvidencia);
      }
      else {
        this.basicNotification.notif("error", 'Evidencia no guardada');
      }
    });
  }

  ngOnInit(): void {
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

  onRadioButtonChange(event: any) {
    this.selectedValueAutorize = event.value;
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
    };
  }

  remove(archivo: any): void {
    const index = this.evidenciaData.evidenciaArchivos.indexOf(archivo);
    if (index >= 0) {
      this.evidenciaData.evidenciaArchivos.splice(index, 1);
      this.announcer.announce(`Removed ${archivo}`);
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

  canViewFile(file:any) : boolean{
    if(file.nombre){
        if (file.nombre.includes('.pdf')){
            return true;      
        }
    }
    return false
}

viewFileEvidence(file:any){
  this.evidences.GetAzureFileCapturaEvidencia(file.archivoId).subscribe((res:any) => {
      let blob = new Blob([res], { type: 'application/pdf' });
      let pdfUrl = window.URL.createObjectURL(blob);
      var PDF_link = document.createElement('a');
      PDF_link.href = pdfUrl;
      window.open(pdfUrl, '_blank');
      PDF_link.download = file.nombre;
      PDF_link.click();
  });
}

}
