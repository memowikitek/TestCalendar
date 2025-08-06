import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { WelSettingsRecordService } from './modals';
import { SettingsWelcomeService, UsersService } from 'src/app/core/services';
import { SettingsWelcomeDTO, SettingsWelcomeDTO1, ListaArchivosModuloBienvenida, TablePaginatorSearch, Vista } from 'src/app/utils/models';
import Quill from 'quill';
import BlotFormatter, { DeleteAction, ImageSpec, ResizeAction } from 'quill-blot-formatter';
import { environment } from 'src/environments/environment';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';

Quill.register('modules/blotFormatter', BlotFormatter);

class CustomImageSpec extends ImageSpec {
    getActions() {
        return [ResizeAction, DeleteAction];
    }
}

import { LIMIT_BLOB_SIZE_FILE } from 'src/app/utils/constants';
import { Alert, DateHelper } from 'src/app/utils/helpers';
import Swal from 'sweetalert2';
import { saveAs } from 'file-saver';

export enum ModalTitle {
    NEW = 'Nuevo',
    EDIT = 'Editar',
}

@Component({
    selector: 'app-setting-welcome',
    templateUrl: './welcome-settings-record.component.html',
    styleUrls: ['./welcome-settings-record.component.scss'],
})
export class WelcomeSettingsRecordComponent implements OnInit, OnDestroy {
    thisAccess: Vista;
    permission: boolean;
    permissions: boolean[];
    title: ModalTitle;
    filters: TablePaginatorSearch;
    cfgIndicatorRecordForm: FormGroup;
    quillDisplayModuleOptions: any;
    quillEditorModuleOptions: any;
    settingsForm: FormGroup;
    data: SettingsWelcomeDTO;
    listaArchivos: ListaArchivosModuloBienvenida[];
    disabled: boolean;
    edit: boolean;
    subscription: Subscription;
    htmlData: any;
    editorData: any;
    archivos: FormData[];
    idWelcomeUpdate: number;

    constructor(
        private basicNotification: BasicNotification,
        private readonly formBuilder: FormBuilder,
        private readonly settingsWelcomeService: SettingsWelcomeService,
        private readonly modalRecord: WelSettingsRecordService,
        private users: UsersService,
        private _sanitizer: DomSanitizer,
        private readonly router: Router
    ) {
        this.permission = null;
        this.thisAccess = new Vista();
        this.permissions = [false, false, false];
        this.title = ModalTitle.NEW;
        this.data = new SettingsWelcomeDTO();
        this.listaArchivos = [];
        this.archivos = [];
        this.disabled = null;
        this.edit = null;
        this.subscription = new Subscription();
        this.htmlData = '';
        this.editorData = '';
        this.settingsForm = this.formBuilder.group({
            editorSettings: [null],
        });
    }

    ngOnInit(): void {
        //todo: revisar seguridad
        //this.setPermissions();
        this.idWelcomeUpdate = JSON.parse(localStorage.getItem('idWelcomeUpdate')); //console.log(this.idWelcomeUpdate);
        this.quillDisplayModuleOptions = { toolbar: false };
        this.quillEditorModuleOptions = {
            blotFormatter: {
                specs: [CustomImageSpec],
            },
            syntax: false, // Include syntax module
            toolbar: [
                ['bold', 'italic', 'underline', 'strike'], // toggled buttons
                // ["blockquote", "code-block"],
                [{ header: 1 }, { header: 2 }], // custom button values
                [{ list: 'ordered' }, { list: 'bullet' }],
                [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
                [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
                [{ direction: 'rtl' }], // text direction
                //[{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
                [{ header: [1, 2, 3, 4, 5, 6, false] }],
                [{ color: [] }, { background: [] }], // dropdown with defaults from theme
                [{ font: [] }],
                [{ align: [] }],
                ['clean'], // remove formatting button
                ['link', 'image'],//['link', 'image', 'video'], // link and image, video
            ],
        };

        /**NEW */
        this.getConfigWelcome();
        /***/

        /*this.settingsWelcomeService.getConfigPantallaBienvenida().subscribe((response) => {
            if (!response.output) {
                return;
            }
            const data = new SettingsWelcomeDTO().deserialize(response.output);
            this.data = data;

            this.patchValueQuillEditor(this.data.html);
            this.trackingStatusForm();
        });*/

        /*this.settingsWelcomeService.getListFilesWelcomeModule().subscribe((response) => {
            if (!response.output) {
                return;
            }
            this.listaArchivos = response.output.map((item) => new ListaArchivosModuloBienvenida().deserialize(item));
        });*/
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    private getConfigWelcome(): void {
        let filters = new TablePaginatorSearch();
        filters.filter = {cicloEvaluacionId: this.idWelcomeUpdate};
        filters.pageSize = 0;
        filters.pageNumber = 0;
        this.settingsWelcomeService.getAllConfigPantallaBienvenida(filters).subscribe((response) => {
            if (!response.output) { return; }
            if (response.exito) {
                const data = new SettingsWelcomeDTO().deserialize(response.output[0]);
                this.data = data; console.log(this.data);
                localStorage.setItem("wId", JSON.stringify(this.data.id));
                this.title = this.data.id ? ModalTitle.EDIT : ModalTitle.NEW;//
                this.patchValueQuillEditor(this.data.html);
                this.trackingStatusForm();
                if (this.data.id) {
                    setTimeout(() => {
                        this.listFiles(this.data.id);    
                    }, 1000);
                }
            }
        });
    }

    private listFiles(Id: any): void {
        this.settingsWelcomeService.getArchivosAzureById(Id).subscribe((response) => {
            if (!response.output) { return; }
            if(response.output){console.log(response.output);
                this.listaArchivos = response.output.map((item) => new ListaArchivosModuloBienvenida().deserialize(item));
            }               
        });            
    }

    private patchValueQuillEditor(data: any): void {
        this.htmlData = data;
        this.settingsForm.get('editorSettings').patchValue(data);
        this.settingsForm.updateValueAndValidity();
    }

    contentChanged(contentChangedEvent: any) {
        this.editorData = contentChangedEvent.html;
    }

    submit(): void {
        const idUser = JSON.parse(localStorage.getItem('session'));
        if (this.data.id) {
            console.log('Editado');
            const setting: SettingsWelcomeDTO = new SettingsWelcomeDTO();
            setting.id = this.data.id;
            setting.html = this.settingsForm.get('editorSettings').value;
            //setting.activo = true;
            //setting.fechaCreacion = this.data.fechaCreacion;
            //setting.usuarioCreacion = this.data.usuarioModificacion;
            setting.fechaModificacion = new Date();
            setting.usuarioModificacion = idUser.id;
            setting.cicloEvaluacionId = this.idWelcomeUpdate;
            console.log(setting);
            this.settingsWelcomeService.updatePantallaBienvenida(setting).subscribe((response) => {
                if (response.exito) {//console.log(response.output);
                    const data: any = response.output; console.log(data);
                    localStorage.setItem("welcomeId", data.cicloEvaluacionId);
                    this.basicNotification.notif("success", 'Configuración actualizada correctamente');
                    this.edit = false;
                    /*setTimeout(() => {
                        this.router.navigate(['/welcome-screen']);
                        //return;    
                    }, 3000);*/
                } else {
                    this.basicNotification.notif("error", 'Configuración No actualizada');
                }
            });
        } else {
            console.log('Creado');
            const setting: SettingsWelcomeDTO1 = new SettingsWelcomeDTO1();
            setting.id = 0;
            setting.html = this.settingsForm.get('editorSettings').value;
            setting.activo = true;
            setting.fechaCreacion = new Date();
            setting.usuarioCreacion = idUser.id;
            //setting.fechaModificacion = new Date();
            setting.usuarioModificacion = 0;
            setting.cicloEvaluacionId = this.idWelcomeUpdate;
            console.log(setting);
            this.settingsWelcomeService.createPantallaBienvenida(setting).subscribe((response) => {
                if (response.exito) {
                    const data: any = response.output; console.log(data);
                    localStorage.setItem("welcomeId", data.cicloEvaluacionId);
                    this.basicNotification.notif("success", 'Configuración de Bienvenida creada correctamente');
                    this.edit = false;
                    this.getConfigWelcome();
                    /*setTimeout(() => {
                        this.router.navigate(['/welcome-screen']);
                        //return;    
                    }, 3000);*/
                } else {
                    this.basicNotification.notif("error", 'Configuración de Bienvenida No creada');
                }
            });
        }
    }

    cancelByConfimation(): void {
        //console.log(this.edit);
        if (!this.edit) {
            localStorage.setItem("welcomeId", JSON.stringify(this.idWelcomeUpdate));
            history.back();
            return;
        }
        Alert.confirm('Alerta', '¿Está seguro de que desea salir? Los datos ingresados no serán guardados.').subscribe(
            (result) => {
                if (!result || !result.isConfirmed) {
                    return;
                }
                localStorage.setItem("welcomeId", JSON.stringify(this.idWelcomeUpdate));
                history.back();
            }
        );
    }

    private trackingStatusForm(): void {
        this.subscription.add(this.settingsForm.statusChanges.subscribe(() => (this.edit = true)));
    }

    /*
    UploadFileToWelcomeModule(files: File[]): void {
        this.archivos = [];
        files.forEach(async (item) => {
            if (item.size >= LIMIT_BLOB_SIZE_FILE) {
                //Alert.error('El archivo' + item.name + ' no debe sobrepasar los 20 mb');
                this.basicNotification.notif("error", 'El archivo' + item.name + ' no debe sobrepasar los 20 mb');
                return;
            }
            const formData: FormData = new FormData();
            formData.append('file', item, item.name);
            formData.append('usuarioCreacion', `${this.users.userSession.id}`);
            this.archivos.push(formData);
            for (let item of this.archivos) {
                await this.settingsWelcomeService.uploadAzureStorageFile(item);
            }
            //Alert.success('', ' Tu archivo se ha subido correctamente.');
            this.basicNotification.notif("success", 'Tu archivo se ha subido correctamente.');
            //Actualizamos la la lista de archivos
            this.settingsWelcomeService.getListFilesWelcomeModule().subscribe((response) => {
                if (!response.output) {
                    return;
                }
                this.listaArchivos = response.output.map((item) =>
                    new ListaArchivosModuloBienvenida().deserialize(item)
                );
            });
        });
    }*/

    downloadFile(file: ListaArchivosModuloBienvenida): void {
        console.log(file);
        this.settingsWelcomeService
            .downloadAzureStorageFile(file.uri)
            .subscribe((response) => saveAs(response, file.name));
    }

    async deleteFile(file: ListaArchivosModuloBienvenida): Promise<void> {
        console.log(file, file.uri);
        await this.settingsWelcomeService.deleteAzureStorageFile(file.uri);
        //Alert.success('', 'El archivo ha sido eliminado.');
        this.basicNotification.notif("success", 'Archivo eliminado correctamente.');
        this.listFiles(this.data.id);
        /*this.settingsWelcomeService.getListFilesWelcomeModule().subscribe((response) => {
            if (!response.output) {
                return;
            }
            this.listaArchivos = response.output.map((item) => new ListaArchivosModuloBienvenida().deserialize(item));
        });*/
    }

    previewFile(file: ListaArchivosModuloBienvenida): boolean {
        this.settingsWelcomeService.downloadAzureStorageFile(file.uri).subscribe((response) => {
            let blob = new Blob([response], { type: 'application/pdf' });
            let pdfUrl = window.URL.createObjectURL(blob);
            var PDF_link = document.createElement('a');
            PDF_link.href = pdfUrl;
            window.open(pdfUrl, '_blank');
            //PDF_link.download = file.name;
            //PDF_link.click();
        });


        //navigator.clipboard.writeText(environment.api.concat(`/Bienvenida/GetArchivoUrl/${file.uri}`));
        //Alert.success('', 'URL copiado');
        //this.basicNotification.notif("success", 'URL copiado.');
        //     this.settingsWelcomeService.downloadAzureStorageFile(file.name).subscribe((response) => {
        //         if (response) {
        //             let blob = new Blob([response]);
        //             let title = 'Vista previa de la imagen';
        //             let url = window.URL.createObjectURL(blob);
        //             let width = 'auto';
        //             const fileExtension = file.name.split('.').pop()?.toLowerCase();
        //             let tag = `<img src="${url}" alt="Imagen"  style="display: initial; width: 100%;">`;
        //             if (fileExtension && 'pdf'.includes(fileExtension)) {
        //                 width = '75%';
        //                 title = 'Vista previa de documento';
        //                 // Crear un objeto de archivo con los datos del blob y el nombre modificado
        //                 var pdfFileName = 'vistaPrevia.pdf'; // Cambiar el nombre del archivo con la extensión .pdf
        //                 var pdfFile = new File([blob], pdfFileName, { type: 'application/pdf' });
        //                 url = window.URL.createObjectURL(pdfFile);
        //                 tag = `
        //     <iframe src="${url}" class="img-responsive" style="width:100%;height:500px;"></iframe>
        //   `;
        //             }

        //             Swal.fire({
        //                 title: title,
        //                 html: tag, // Pasar la etiqueta de imagen como contenido HTML
        //                 width: width,
        //             }).then(() => {
        //                 Alert.success('', 'URL copiado');
        //             });
        //             //return;
        //         }
        //     });
        return true;
    }

    copyUrl(file: any): boolean {
        navigator.clipboard.writeText(environment.api.concat(`/Bienvenida/GetArchivoUrl/${file.uri}`));
        //navigator.clipboard.writeText(file.archivo);
        //Alert.success('', 'URL copiado');
        this.basicNotification.notif("success", 'URL copiado.');
        return true;
    }

    private auto_bom(blob: Blob): Blob {
        // prepend BOM for UTF-8 XML and text/* types (including HTML)
        // note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
        if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
            return new Blob([String.fromCharCode(0xfeff), blob], { type: blob.type });
        }
        return blob;
    }

    canPreviewFile(nombreArchivo: any): boolean {
        console.log(nombreArchivo);
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp']; // Agrega aquí más extensiones de imagen si es necesario

        const fileExtension = nombreArchivo.split('.').pop()?.toLowerCase();

        if (fileExtension && (imageExtensions.includes(fileExtension) || 'pdf'.includes(fileExtension))) {
            return true; // El archivo puede tener vista previa
        } else {
            return false; // El archivo no tiene una extensión válida
        }
    }


    /**/

    viewFile(file: any) {
        console.log(file);
        this.settingsWelcomeService.downloadAzureStorageFile(file.archivoAzureId).subscribe((res: any) => {
            let blob = new Blob([res], { type: 'application/pdf' });
            let pdfUrl = window.URL.createObjectURL(blob);
            var PDF_link = document.createElement('a');
            PDF_link.href = pdfUrl;
            window.open(pdfUrl, '_blank');
            PDF_link.download = file.name;
            PDF_link.click();
        });
    }

    DownloadFile(file: any) {
        var fileExt = file.name.split('.');
        if (fileExt.length > 1) {
            // archivo con extension
            this.settingsWelcomeService.downloadAzureStorageFile(file.archivoAzureId).subscribe((res: any) => {
                saveAs(res, file.name);
            });
        }
    }

    canViewFile(file: any): boolean {
        if (file.name) {
            if (file.name.includes('.pdf')) {
                return true;
            }
        }
        return false
    }

    canDownloadFile(file: any): boolean {
        if (file.name) {
            var fileExt = file.name.split('.');
            if (fileExt.length < 2) // no tiene extension
            {
                return false;
            }
            if (!file.name.includes('.pdf')) {
                return true;
            }
        }

        return false;
    }

    //MODAL
    openRecord(): void {
        this.modalRecord.open().afterClosed()
        .subscribe(() => {setTimeout(() => {this.listFiles(this.data.id)}, 1000)});
    }

    private setPermissions(): void {
        this.permissions = this.thisAccess.getPermissions(
            this.users.userSession.modulos,
            this.users.userSession.vistas,
            this.router.url
        );
    }

    checkPermission(p: number): boolean {
        //todo: revisar seguridad
        return true;
        return this.permissions[p];
    }
}
