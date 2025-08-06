import { Component, Inject, OnInit, NgModule } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EvaluationCycleService, UsersService } from 'src/app/core/services';
import { ValidatorService } from 'src/app/shared/validators';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';

export enum ModalTitle {
  AUT = 'Autorizar',
  CON = 'Consultar',
  CAP = 'Capturar'
}

@Component({
  selector: 'app-modal-autorize-na-indicator',
  templateUrl: './modal-autorize-na-indicator.component.html',
  styleUrls: ['./modal-autorize-na-indicator.component.scss']
})
export class ModalAutorizeNaIndicatorComponent {
  title: any
  goalRecordForm: FormGroup;
  solictoAutorizacion = false;
  noAutorizo = false;

  errorJustificacion = false;
  errorAutorizado = false;

  estatusAutorizacion = "5";
  selectedValue: number = null;

  constructor(@Inject(MAT_DIALOG_DATA)
  public readonly metaData: any,
    private users: UsersService,
    private router: Router,
    private readonly formBuilder: FormBuilder,
    private readonly validator: ValidatorService,
    private readonly ref: MatDialogRef<never>,
    private readonly EvaCService: EvaluationCycleService,
    private basicNotification: BasicNotification) {
    console.log("no autorizado");
    console.log(metaData);
    this.title = `${ModalTitle.AUT} N/A meta` ;
    //this.selectedValue = (metaData.comentAutorizaNA == null)?5:4;
    this.selectedValue = metaData.estatusEtapa;  
    this.goalRecordForm = this.formBuilder.group({
      ceetapa1MetasId: [{ value: 0, disabled: true }],
      ceevaluacionId: [{ value: 0, disabled: true }],
      estatusEtapa: [{ value: 0, disabled: true }],
      indicador: [{ value: null, disabled: true }],
      nivel: [metaData.nivelModalidad,],
      decisionAnterior: [{ value: null, disabled: true }],
      metaAnterior: [{ value: null, disabled: true }],
      metaActual: [{ value: null, disabled: true }],
      nombreFormato: [null],
      archivoAzureId: [null],
      solicitaNa: [{ value: this.metaData.solicitaNa, disabled: true }],
      justificacionNa: [{ value: null, disabled: true }],
      autorizaNa: [{ value: this.metaData.autorizaNa, disabled: true }],
      comentAutorizaNa: [{ value: null, disabled: true }],
    });

  }

  submit() {
    this.metaData.comentAutorizaNa = this.goalRecordForm.controls['comentAutorizaNa'].value;
    if(this.metaData.estatusEtapa == 4 && !this.metaData.comentAutorizaNa) {
      this.errorAutorizado = true;
      return
    }
    this.EvaCService.addUpdateCeEtapa1Meta(this.metaData, this.users.userSession.id).subscribe((response) => {
      if (response.output) {
        let result = response.output as any;
        if (result.ceetapa1MetasId > 0) {
          this.ref.close(true);
        }console.log(result);
        if(result.comentAutorizaNa){
          this.basicNotification.notif("success", 'N/A no autorizado correctamente');
        }else{
          this.basicNotification.notif("success", 'N/A autorizado correctamente');
        }
      } else {
        this.basicNotification.notif("error", 'No guardado correctamente');
      }
    });
  }

  ngOnInit(): void {
    this.goalRecordForm.controls['ceetapa1MetasId'].setValue(this.metaData.ceetapa1MetasID);
    this.goalRecordForm.controls['ceevaluacionId'].setValue(this.metaData.ceevaluacionId);
    this.goalRecordForm.controls['estatusEtapa'].setValue(this.metaData.estatusEtapa);
    this.goalRecordForm.controls['indicador'].setValue(this.metaData.indicadorId);
    this.goalRecordForm.controls['nivel'].setValue(this.metaData.nivelModalidad);
    this.goalRecordForm.controls['decisionAnterior'].setValue(this.metaData.decisionAnterior);
    this.goalRecordForm.controls['metaAnterior'].setValue(this.metaData.metaAnterior);
    this.goalRecordForm.controls['metaActual'].setValue(this.metaData.metaActual);
    // this.goalRecordForm.controls['nombreFormato'].setValue(this.metaData.estatusEtapa);
    // this.goalRecordForm.controls['archivoAzureId'].setValue(this.metaData.estatusEtapa);
    this.goalRecordForm.controls['solicitaNa'].setValue(this.metaData.solicitaNa);
    this.goalRecordForm.controls['justificacionNa'].setValue(this.metaData.justificacionNa);
    this.goalRecordForm.controls['autorizaNa'].setValue(this.metaData.autorizaNa);
    this.goalRecordForm.controls['comentAutorizaNa'].setValue(this.metaData.comentAutorizaNa);

    // this.aplicarReglasNegocioSolicita(this.metaData.solicitaNA, null);

    if (this.goalRecordForm.controls['solicitaNa'].value == true && this.metaData.puedeAutorizar) {
      this.goalRecordForm.controls['solicitaNa'].disable();
      this.goalRecordForm.controls['justificacionNa'].disable();
      this.goalRecordForm.controls['metaActual'].disable();
    }

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

  onRadioButtonChange(event: any) {
    // console.log(event);
    this.goalRecordForm.controls['estatusEtapa'].setValue(event.value);
    this.metaData.estatusEtapa = event.value;
    this.errorJustificacion = false;
    this.errorAutorizado = false;

    if (event.value == 4) // no autorizado requiere comentarios 
    {
      this.metaData.autorizaNa =false;
      

      this.goalRecordForm.controls['autorizaNa'].setValue(false);
      this.goalRecordForm.controls['justificacionNa'].setValue(null);
      this.goalRecordForm.controls['comentAutorizaNa'].enable();
    }
    else {
      this.metaData.autorizaNa =true;
      this.goalRecordForm.controls['autorizaNa'].setValue(true);
      this.goalRecordForm.controls['comentAutorizaNa'].disable();
      this.goalRecordForm.controls['comentAutorizaNa'].setValue(null);
    }

  }

}
