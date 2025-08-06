import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EvaluationCycleService, UsersService } from 'src/app/core/services';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';
import { EstatusEtapa6Plandemejora } from 'src/app/utils/models/enums-estatus-etapas';

@Component({
  selector: 'app-modal-upload-pm',
  templateUrl: './modal-upload-pm.component.html',
  styleUrls: ['./modal-upload-pm.component.scss']
})
export class ModalUploadPmComponent {

  nombreArchivo = ''
  informacionActual: any;

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
    var regexAll = /[^\\]*\.(\w+)$/;
    var total = file.name.match(regexAll);
    var filename = total[0];
    var extension = total[1];
    /////
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.modalData.nombreArchivoPmclm = file.name;
      this.modalData.base64ArchivoPmclm = reader.result
    };
  }

  guardar() {

    this.modalData.usuarioId = this.users.userSession.id;
    this.modalData.AreaId = this.modalData.areaResponsableId // Se reasigna con esta propiedad porque el modelo de recepcion lo pide asi
    this.modalData.estatusEtapa = EstatusEtapa6Plandemejora.pendienteRevision;
    
    this.EvaCService.addDeleteCeEtapa6PlanMejoraArchivo(this.modalData).subscribe(response => {
      if (response.output) {
        let result = response.output as any;
        this.refDiag.close(true);
        this.basicNotification.notif("success", `Archivo PM/CLM enviado correctamente`);

      }
      else {
        this.basicNotification.notif("error", `Archivo PM/CLM NO enviado correctamente`);
      }
    })
  }

  closeModal() {
    this.refDiag.close(true);
  }

}
