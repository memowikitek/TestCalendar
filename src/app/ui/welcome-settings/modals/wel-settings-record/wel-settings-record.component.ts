import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Alert } from 'src/app/utils/helpers';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';
import { LIMIT_BLOB_SIZE_FILE, LIMIT_SIZE_FILE } from 'src/app/utils/constants';
import { ListaArchivosModuloBienvenida, SettingsWelcomeDTO, TablePaginatorSearch, Vista } from 'src/app/utils/models';
import { SettingsWelcomeService, UsersService } from 'src/app/core/services';
import { WelcomeData } from './wel-settings-record.service';

@Component({
    selector: 'app-wel-settings-record',
    templateUrl: './wel-settings-record.component.html',
    styleUrls: ['./wel-settings-record.component.scss'],
    standalone: false
})
export class WelSettingsRecordComponent implements OnInit {
  //data: SettingsWelcomeDTO;
  title: any;
  welRecordForm: FormGroup;
  files: any[];
  archivos: FormData[];
  listaArchivos: ListaArchivosModuloBienvenida[];
  idWelcomeUpdate: any;
  wId: any;

  constructor(
    //@Inject(MAT_DIALOG_DATA)
    //public readonly interfaceData: WelcomeData,
    private basicNotification: BasicNotification,
    private readonly ref: MatDialogRef<never>,
    private readonly formBuilder: FormBuilder,
    private readonly settingsWelcomeService: SettingsWelcomeService,
    private users: UsersService
  ) {
    this.title = 'Agregar archivos';
    //this.data = new SettingsWelcomeDTO;
    this.welRecordForm = this.formBuilder.group({
      archivo: [null, []]
    });
  }

  ngOnInit(): void { //console.log(this.interfaceData);
    this.idWelcomeUpdate = JSON.parse(localStorage.getItem('idWelcomeUpdate')); //console.log(this.idWelcomeUpdate);
    this.wId = JSON.parse(localStorage.getItem('wId')); console.log(this.wId);
  }

  submit() {
    this.archivos = [];
    this.files.forEach(async (item) => {
      if (item.size >= LIMIT_BLOB_SIZE_FILE) {
        this.basicNotification.notif("error", 'El archivo' + item.name + ' no debe sobrepasar los ' + LIMIT_SIZE_FILE + ' mb');
        return;
      }
      const formData: FormData = new FormData();
      formData.append('file', item, item.name);
      formData.append('usuarioCreacion', `${this.users.userSession.id}`);
      formData.append('bienvenidaId', `${this.wId}`);
      this.archivos.push(formData);
      for (let item of this.archivos) {
        await this.settingsWelcomeService.uploadAzureStorageFile(item);
      }
      //Actualizamos la la lista de archivos
      this.settingsWelcomeService.getArchivosAzureById(this.wId).subscribe((response) => {
        if (!response.output) { return; }
        if (response.output) {
          this.basicNotification.notif("success", 'Archivo agregado correctamente.');
          //console.log(response.output);
          //this.listaArchivos = response.output.map((item) => new ListaArchivosModuloBienvenida().deserialize(item));
          this.ref.close(true);
        }
      });
    });
    //this.ref.close(true);
  }

  UploadFileToWelcomeModule(files: File[]): void {
    this.files = files; //console.log(files);
  }

  closeModalByConfimation(): void {
    Alert.confirm('Alerta', '¿Está seguro de que desea salir? Los datos ingresados no serán guardados.').subscribe((result) => {
      if (!result || !result.isConfirmed) { return; }
      this.ref.close(result);
    });
  }

}
