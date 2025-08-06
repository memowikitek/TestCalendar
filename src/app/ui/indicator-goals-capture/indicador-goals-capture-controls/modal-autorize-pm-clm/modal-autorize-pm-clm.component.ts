import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EvaluationCycleService, UsersService } from 'src/app/core/services';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';
import { EstatusEtapa6Plandemejora } from 'src/app/utils/models/enums-estatus-etapas';

@Component({
  selector: 'app-modal-autorize-pm-clm',
  templateUrl: './modal-autorize-pm-clm.component.html',
  styleUrls: ['./modal-autorize-pm-clm.component.scss']
})
export class ModalAutorizePmClmComponent {
  informacionActual: any;
  errorAutorizado = false;
  EstatusEtapa6Plandemejora: any;

  constructor(@Inject(MAT_DIALOG_DATA) public readonly modalData: any,
    private readonly users: UsersService,
    private router: Router,
    private readonly refDiag: MatDialogRef<never>,
    private readonly EvaCService: EvaluationCycleService,
    private basicNotification: BasicNotification) {
    this.informacionActual = JSON.parse(JSON.stringify(modalData))// copia de la informacion actual
    this.configuraVista();
  }


  configuraVista() {
    console.log('modal data', this.modalData)
    this.EstatusEtapa6Plandemejora = EstatusEtapa6Plandemejora;
  }


  guardar() {
    this.errorAutorizado = false;
    this.modalData.usuarioId = this.users.userSession.id;

    if (this.modalData.estatusEtapa == EstatusEtapa6Plandemejora.noAutorizado && !this.modalData.comentNoAutorizado){
      this.errorAutorizado = true;
      return;
    }
     

    // {“ceetapa6PlanMejoraArchivoId”, “autorizado”, “comentNoAutorizado”, “usuarioId”}
    this.modalData.autorizado =  this.modalData.estatusEtapa == EstatusEtapa6Plandemejora.autorizado
    this.modalData.AreaId = this.modalData.areaResponsableId // Se reasigna con esta propiedad porque el modelo de recepcion lo pide asi
    
    const type = this.modalData.autorizado ? ' ' : ' no ';
    const msj = `PM/CLM${type}autorizado correctamente`;
    this.EvaCService.updateCEEtapa6PlanMejoraArchivoAutorizacion(this.modalData).subscribe(response => {
      if (response.output) {
        let result = response.output as any;
        this.refDiag.close(true);
        this.basicNotification.notif("success", msj);
      } else {
        this.basicNotification.notif("error", `La autorización No se guardo correctamente`);
      }
    })
  }

  closeModal() {
    this.refDiag.close(true);
  }
}
