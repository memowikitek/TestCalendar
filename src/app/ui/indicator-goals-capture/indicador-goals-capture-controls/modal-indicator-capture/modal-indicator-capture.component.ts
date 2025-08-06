import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EvaluationCycleService, UsersService } from 'src/app/core/services';
import { ValidatorService } from 'src/app/shared/validators';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';
import { FormsModule } from '@angular/forms';
import { Console } from 'console';
import { NotificacionesNaDto } from 'src/app/utils/models/notificaciones-na.dto';

export enum ModalTitle {
  AUT = 'Autorizar',
  CON = 'Consultar',
  CAP = ''
}

@Component({
  selector: 'app-modal-indicator-capture',
  templateUrl: './modal-indicator-capture.component.html',
  styleUrls: ['./modal-indicator-capture.component.scss']
})
export class ModalIndicatorCaptureComponent implements OnInit {
  title: any;
  goalRecordForm: FormGroup;
  solictoAutorizacion = false;
  noAutorizo = false;

  errorJustificacion = false;
  errorAutorizado = false;

  estatusAutorizacion = "5";

  constructor(@Inject(MAT_DIALOG_DATA)
  public readonly metaData: any,
    private users: UsersService,
    private router: Router,
    private readonly formBuilder: FormBuilder,
    private readonly validator: ValidatorService,
    private readonly ref: MatDialogRef<never>,
    private readonly EvaCService: EvaluationCycleService,
    private basicNotification: BasicNotification) {
    console.log("modal captura");
    console.log(metaData);
    this.title = (this.metaData.esVista) ? `${ModalTitle.CON} Captura de Metas ` : `${ModalTitle.CAP} Captura de Metas ` ;

    if (!this.metaData.esVista) {
      this.goalRecordForm = this.formBuilder.group({
        ceetapa1MetasId: [0,],
        ceevaluacionId: [0,],
        estatusEtapa: [0,],
        indicador: [metaData.claveIndicador + "-" + metaData.nombreIndicador],
        nivel: [metaData.nivelModalidad,],
        decisionAnterior: [null,],
        decisionAnteriorNombre: [null,],
        metaAnterior: [null],
        metaActual: [null, []],
        nombreFormato: [null],
        archivoAzureId: [null],
        solicitaNa: [this.metaData.solicitaNA],
        justificacionNa: [{ value: null, disabled: true }],
        autorizaNa: [this.metaData.autorizaNA],
        comentAutorizaNa: [{ value: null, disabled: true }],
      });
    }
    else {

      this.goalRecordForm = this.formBuilder.group({
        ceetapa1MetasId: [{ value: 0, disabled: false }],
        ceevaluacionId: [{ value: 0, disabled: false }],
        estatusEtapa: [{ value: 0, disabled: false }],
        indicador: [{ value: null, disabled: false }],
        nivel: [metaData.nivelModalidad,],
        decisionAnterior: [{ value: null, disabled: false }],
        decisionAnteriorNombre: [null,],
        metaAnterior: [{ value: null, disabled: false }],
        metaActual: [{ value: null, disabled: false }],
        nombreFormato: [null],
        archivoAzureId: [null],
        solicitaNa: [{ value: this.metaData.solicitaNA, disabled: false }],
        justificacionNa: [{ value: null, disabled: false }],
        autorizaNa: [{ value: this.metaData.autorizaNA, disabled: false }],
        comentAutorizaNa: [{ value: null, disabled: false }],
      });

    }
  }

  submit() {
    if(this.goalRecordForm.controls['solicitaNa'].value && !this.goalRecordForm.controls['justificacionNa'].value){
      this.errorJustificacion = true;
      return;
    }

    /*if(!this.goalRecordForm.controls['solicitaNa'].value && !this.goalRecordForm.controls['metaActual'].value){
      this.errorMetaActual = true;
      return;
    }*/

    if (this.goalRecordForm.controls['solicitaNa'].value && 
    !this.goalRecordForm.controls['justificacionNa'].value && 
    !this.metaData.puedeAutorizar && 
    this.goalRecordForm.controls['estatusEtapa'].value == null) {
      this.errorJustificacion = true;
      return;
    }

    if (this.goalRecordForm.controls['autorizaNa'].value &&
     !this.goalRecordForm.controls['comentAutorizaNa'].value && 
     this.goalRecordForm.controls['estatusEtapa'].value == 4) {
      this.errorAutorizado = true;
      return;
    }

    let data = this.goalRecordForm.getRawValue();
    if (data.metaActual != null) {
      data.estatusEtapa = 2 // capturada
    }
    else {

      if (this.goalRecordForm.controls['solicitaNa'].value == true &&
        (this.goalRecordForm.controls['autorizaNa'].value == false || this.goalRecordForm.controls['autorizaNa'].value == null)) {
        data.estatusEtapa = 3 // N/A en revision
      }
      if (this.goalRecordForm.controls['solicitaNa'].value == true &&
        this.goalRecordForm.controls['autorizaNa'].value == true) {
        data.estatusEtapa = 5 // N/A autorizado
      }
      if (this.goalRecordForm.controls['solicitaNa'].value == true &&
        this.goalRecordForm.controls['autorizaNa'].value == false &&
        this.metaData.puedeAutorizar) {
        data.estatusEtapa = 4 // N/A no autorizado
      }
    }

    this.EvaCService.addUpdateCeEtapa1Meta(data, this.users.userSession.id).subscribe((response) => {
      if (response.output) {
        let result = response.output as any;
        if (result.ceetapa1MetasId > 0) {
          this.ref.close(true);
        }
        this.basicNotification.notif("success", 'Meta guardada correctamente');

        if (data.solicitaNa){
          this.enviaNotificacionNA(this.metaData);
        }

      } else {
        this.basicNotification.notif("error", 'La meta no fue guardado');
      }
    });
  }

  enviaNotificacionNA(dataMsg: any) {
    let datoCicloEvaluacion = this.EvaCService.obtenerDatosDeStorageCicloEvaluacion();
    let msg = new NotificacionesNaDto();
    msg.cicloEvaluacionId = dataMsg.cicloEvaluacionId;
    msg.titulo = `Autorización NA: ${datoCicloEvaluacion.etapaEvaluacion[0].etapa}`;
    msg.mensaje = `${datoCicloEvaluacion.cicloEvaluacion} ${dataMsg.infoindicador.campus} ${dataMsg.infoindicador.areaResponsable} ${dataMsg.infoindicador.claveNombreIndicador}`
    msg.usuarioCreacion = this.users.userSession.id;
    this.EvaCService.sendNotificacionNA(msg).subscribe((respmsg: any) => {
      if (respmsg.Exito) {
        console.info("el mensaje fue enviado correctamente", msg);
      }
    });
  }

  ngOnInit(): void {
    if (!this.metaData.ceEtapa1MetasID || this.metaData.ceEtapa1MetasID == null) {
      this.metaData.ceEtapa1MetasID = 0 // nuevo
    }
    this.goalRecordForm.controls['ceetapa1MetasId'].setValue(this.metaData.ceEtapa1MetasID);
    this.goalRecordForm.controls['ceevaluacionId'].setValue(this.metaData.ceevaluacionId);
    this.goalRecordForm.controls['estatusEtapa'].setValue(this.metaData.estatusEtapa);
    this.goalRecordForm.controls['indicador'].setValue(this.metaData.indicadorId);
    this.goalRecordForm.controls['nivel'].setValue(this.metaData.nivelModalidadDescripcion);
    this.goalRecordForm.controls['decisionAnterior'].setValue(this.metaData.decisionAnterior);
    this.goalRecordForm.controls['decisionAnteriorNombre'].setValue(this.metaData.decisionAnteriorNombre);
    this.goalRecordForm.controls['metaAnterior'].setValue(this.metaData.metaAnterior);
    this.goalRecordForm.controls['metaActual'].setValue(this.metaData.metaActual);
    // this.goalRecordForm.controls['nombreFormato'].setValue(this.metaData.estatusEtapa);
    // this.goalRecordForm.controls['archivoAzureId'].setValue(this.metaData.estatusEtapa);
    this.goalRecordForm.controls['solicitaNa'].setValue(this.metaData.solicitaNa);
    this.goalRecordForm.controls['justificacionNa'].setValue(this.metaData.justificacionNa);
    this.goalRecordForm.controls['autorizaNa'].setValue(this.metaData.autorizaNa);
    this.goalRecordForm.controls['comentAutorizaNa'].setValue(this.metaData.comentAutorizaNa);

    this.aplicarReglasNegocioSolicita(this.metaData.solicitaNa, null);

    if(this.goalRecordForm.controls['solicitaNa'].value == true && this.metaData.puedeAutorizar){
      this.goalRecordForm.controls['solicitaNa'].disable();
      this.goalRecordForm.controls['justificacionNa'].disable();
      this.goalRecordForm.controls['metaActual'].disable();
    }

    // this.goalRecordForm.valueChanges.subscribe(value =>  {
    //   this.aplicarReglasNegocio();
    // });

  }

  closeModal() {
    this.ref.close(false);
  }



  aplicarReglasNegocioSolicita(checked: boolean, event: any) {

    if (this.metaData.esVista) {
      this.goalRecordForm.controls['solicitaNa'].disable(); 
      this.goalRecordForm.controls['justificacionNa'].disable();
      this.goalRecordForm.controls['metaActual'].disable();
      return;
    }

    // setTimeout(() => {
    if (checked) {
      this.goalRecordForm.controls['justificacionNa'].enable();
      this.goalRecordForm.controls['metaActual'].setValue(null);
      this.goalRecordForm.controls['metaActual'].disable();
    }
    else {
      this.goalRecordForm.controls['justificacionNa'].disable();
      this.goalRecordForm.controls['justificacionNa'].setValue(null);
      this.goalRecordForm.controls['metaActual'].enable();
    }

    this.errorJustificacion = false;
    this.errorAutorizado = false;
    // })

  }

  // aplicarReglasNegocioAutoriza(checked: boolean, event: any) {
  //   if (checked) {
  //     this.goalRecordForm.controls['comentAutorizaNa'].enable();
  //     this.goalRecordForm.controls['metaActual'].setValue(null);
  //     this.goalRecordForm.controls['metaActual'].disable();
  //   }
  //   else {
  //     this.goalRecordForm.controls['comentAutorizaNa'].disable();
  //     this.goalRecordForm.controls['comentAutorizaNa'].setValue(null);
  //     this.goalRecordForm.controls['metaActual'].enable();
  //   }

  //   this.errorJustificacion = false;
  //   this.errorAutorizado = false;
  // }

  onRadioButtonChange(event: any) {
    // console.log(event);
    this.goalRecordForm.controls['estatusEtapa'].setValue(event.value);
    this.errorJustificacion = false;
    this.errorAutorizado = false;

    if (event.value == 4) // no autorizado requiere comentarios 
    {
      this.goalRecordForm.controls['autorizaNa'].setValue(false);
      this.goalRecordForm.controls['justificacionNa'].setValue(null);
      this.goalRecordForm.controls['comentAutorizaNa'].enable();
    }
    else {
      this.goalRecordForm.controls['autorizaNa'].setValue(true);
      this.goalRecordForm.controls['comentAutorizaNa'].disable();
      this.goalRecordForm.controls['comentAutorizaNa'].setValue(null);
    }

  }

  limitarCaracteres(event: any) {
    const valor = event.target.value;
    if(valor){
      event.target.value = valor.replace('.','');
    }
    if (valor.length > 6) {
      event.target.value = valor.slice(0, 6);
    }
  }
  
}
