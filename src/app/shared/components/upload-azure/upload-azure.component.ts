import { Component, Input, OnInit } from '@angular/core';
import { SettingsWelcomeService, UsersService } from 'src/app/core/services';
import { SettingsWelcomeDTO, SettingsWelcomeDTO1, ListaArchivosModuloBienvenida, TablePaginatorSearch, Vista } from 'src/app/utils/models';
import Quill from 'quill';
import BlotFormatter, { DeleteAction, ImageSpec, ResizeAction } from 'quill-blot-formatter';
import { environment } from 'src/environments/environment';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';
import { LIMIT_BLOB_SIZE_FILE } from 'src/app/utils/constants';
import { Alert, DateHelper } from 'src/app/utils/helpers';
import Swal from 'sweetalert2';
import { saveAs } from 'file-saver';

@Component({
    selector: 'app-upload-azure',
    templateUrl: './upload-azure.component.html',
    styleUrls: ['./upload-azure.component.scss'],
    standalone: false
})

export class UploadAzureComponent implements OnInit {
  @Input() nameImage: any;
  archivos: FormData[];

  constructor(
    private basicNotification: BasicNotification,
    private readonly settingsWelcomeService: SettingsWelcomeService,
    private users: UsersService
  ) {

  }

  ngOnInit(): void {

  }

  public UploadFileToWelcomeModule(files: File[]): void {
    const newName = this.nameImage + '.png'; console.log(newName);
    this.searchList(newName, true);

    this.archivos = [];
    files.forEach(async (item) => {//console.log(LIMIT_BLOB_SIZE_FILE);
      if (item.size >= LIMIT_BLOB_SIZE_FILE) {
        this.basicNotification.notif("error", 'El archivo' + item.name + ' no debe sobrepasar los 20 mb');
        return;
      }
      const formData: FormData = new FormData();
      formData.append('file', item, newName);
      formData.append('usuarioCreacion', `${this.users.userSession.id}`);
      //formData.append('bienvenidaId', `${this.idWelcomeUpdate}`);
      this.archivos.push(formData); //console.log(this.archivos);
      for (let item of this.archivos) { console.log('item',item);
        await this.settingsWelcomeService.uploadAzureStorageFile(item);
      }
      //this.basicNotification.notif("success", 'Tu archivo se ha subido correctamente.');
      console.log('Tu archivo se ha subido correctamente.');
      //Lista de archivos
      this.searchList(newName, false);
    });
  }

  async searchList(name: any, del: boolean) {
    this.settingsWelcomeService.getListFilesWelcomeModule().subscribe(async (response) => {
      const data = response.output; //console.log(data);
      if (!response.output) { return; }
      const filter = data.filter((x) => x.name === name); //console.log(filter);
      if (del && filter) {
        for (let i = 0; i < filter.length; i++) {
          console.log(del, filter[i].uri);
          await this.settingsWelcomeService.deleteAzureStorageFile(filter[i].uri);
        }
        console.warn('Imagen Actualizada');
      }
    });
  }

  canPreviewFile(nombreArchivo: string): boolean {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp']; // Agrega aquí más extensiones de imagen si es necesario

    const fileExtension = nombreArchivo.split('.').pop()?.toLowerCase();

    if (fileExtension && (imageExtensions.includes(fileExtension) || 'pdf'.includes(fileExtension))) {
      return true; // El archivo puede tener vista previa
    } else {
      return false; // El archivo no tiene una extensión válida
    }
  }

}
