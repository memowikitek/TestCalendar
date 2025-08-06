import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, ReplaySubject, Subscription } from 'rxjs';
import { EvidencesCatalogService, UsersService } from 'src/app/core/services';
import { ValidatorService } from 'src/app/shared/validators';
import { Alert, clearForm } from 'src/app/utils/helpers';
import { Router } from '@angular/router';
import { ModulesCatalogDTO } from 'src/app/utils/models/modules-catalog.dto';
import { InformeRevInstDTO } from 'src/app/utils/models/informe-rev-inst.dto';
import { CicloV2DTO } from 'src/app/utils/models/ciclo.v2.dto';
import { InformeRevInstService } from 'src/app/core/services/api/informe-rev-inst/informe-rev-inst.service'
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';
import { Vista, TablePaginatorSearch } from 'src/app/utils/models';
import { LIMIT_BLOB_SIZE_FILE } from 'src/app/utils/constants';

export enum ModalTitle {
    NEW = 'Nuevo Informe de revisión institucional',
    EDIT = 'Editar Informe de revisión institucional',
}

@Component({
    selector: 'app-informeris-record',
    templateUrl: './informe-ris-record.component.html',
    styleUrls: ['./informe-ris-record.component.scss'],
})
export class InformeRISRecordComponent implements OnInit, OnDestroy{
    informeRecordForm: FormGroup;
    title: ModalTitle;
    data: InformeRevInstDTO;
    edit: boolean;
    subscription: Subscription;
    disabled: boolean;
    permission: boolean;
    thisAccess: Vista;
    thisModule: ModulesCatalogDTO;
    permissions: boolean[];
    hasFile = false;
    estatus: string;
    estatusRecord: boolean;
    ciclosList: CicloV2DTO[] = [];
    idArchivoEliminar: number;

    constructor(
        @Inject(MAT_DIALOG_DATA)
        public readonly informeData: InformeRevInstDTO,
        private router: Router,
        private readonly formBuilder: FormBuilder,
        private readonly informeService: InformeRevInstService,
        private readonly ref: MatDialogRef<never>,
        private users: UsersService,
        private readonly validator: ValidatorService,
        private basicNotification : BasicNotification
    ){
        this.title = ModalTitle.NEW;
        this.data = new InformeRevInstDTO();
        this.edit = null;
        this.disabled = null;
        this.permission = null;
        this.subscription = new Subscription();
        this.informeRecordForm = this.formBuilder.group({
            ciclo: [null, [Validators.required]],
            nombreInfRi: [null, [Validators.required, Validators.maxLength(150), this.validator.noWhitespace]],
            descripcionInfRi: [null, [Validators.required, Validators.maxLength(250), this.validator.noWhitespace]],
            activo: [true, []],
            archivoInforme: [null, []],
            nombreArchivo: [null],
            archivoAzureId: [null]
        });
        this.thisAccess = new Vista();
        this.permissions = [false, false, false];
        this.edit = true;        
        this.idArchivoEliminar = null;

        this.getAllCiclos();
    }

    ngOnInit(){
        // this.disabled = !this.checkPermission(2);
        this.title = this.informeData ? ModalTitle.EDIT : ModalTitle.NEW;
        this.estatusRecord = this.informeData ? this.informeData.activo : true;
        this.estatus = this.informeData ? this.informeData.activo? "Activo":"Inactivo" : "Activo";

        if (this.informeData) { 
            this.informeService.getInformeById(this.informeData.id).subscribe((response) => {
                if (!response.output) {
                    return;
                }

                const data = new InformeRevInstDTO().deserialize(response.output); 
                this.data = data;
                this.informeRecordForm.patchValue(data);
                
                this.trackingStatusForm();
                if (data.archivoAzureId != null) {
                    this.hasFile = true;
                } 
                
            });
        } else {
            this.trackingStatusForm();
        }
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    getAllCiclos():void{
        const filters = new TablePaginatorSearch();
        filters.pageSize = 999999;
        filters.filter = {activo: true}
        this.informeService.getAllCiclos(filters).subscribe((response) => {
            if (response.exito) {
                this.ciclosList = response.output.map((ciclo) => new CicloV2DTO().deserialize(ciclo)); 
                if (this.informeData)
                {
                    let ciclo = this.ciclosList.find(item => item.id == this.informeData.cicloEvaluacionId);
                    this.informeRecordForm.get('ciclo').patchValue(ciclo);
                    this.informeRecordForm.get('ciclo').disable();
                }
            }
        });
    }

    convertFile(file: File): Observable<string> {
        const result = new ReplaySubject<string>(1);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => result.next(event.target.result.toString());
        return result;
    }

    closeModalByConfimation(): void {
        if (!this.edit) {
            this.ref.close();
            return;
        }
        Alert.confirm('Alerta', '¿Está seguro de que desea salir? Los datos ingresados no serán guardados.').subscribe(
            (result) => {
                if (!result || !result.isConfirmed) {
                    return;
                }
                this.ref.close(result);
            }
        );
    }

    changeStatusDescription($event: any): void {
        const estatusRecord: boolean = $event.checked ;
        this.estatusRecord = estatusRecord;
        this.estatus = estatusRecord ? "Activo":"Inactivo";
        
    }

    private trackingStatusForm(): void {
        this.subscription.add(this.informeRecordForm.statusChanges.subscribe(() => (this.edit = true)));
    }

    // checkPermission(p: number): boolean {
    //     return this.permissions[p];
    // }

    onDeleteFile() {
        this.idArchivoEliminar = this.informeRecordForm.controls['archivoAzureId'].value
        if (this.idArchivoEliminar != null) {
            Alert.confirm('Eliminar archivo del informe', `¿Deseas eliminar el archivo del informe?`).subscribe(
                (result) => {
                    if (!result || !result.isConfirmed) {
                        this.idArchivoEliminar = null;
                        return;
                    }
                    else{
                        this.informeRecordForm.controls['archivoAzureId'].setValue(null);
                        this.informeRecordForm.controls['nombreArchivo'].setValue(null);
                        this.hasFile = false;
                    }
                }
            );
        }
    }
    eliminarArchivo(informe: InformeRevInstDTO, campos: any){
        this.informeService.deleteAzureStorageFile(this.idArchivoEliminar).then((resp) => {
            if (resp.exito) {                
                this.guardar(informe, campos);
            }
            else{
                this.basicNotification.notif("error",'No fue posible eliminar el archivo anterior, los cambios no han sido guardados');
            }
        });
    }

    submit(){
        this.informeRecordForm.markAllAsTouched();
        if (this.informeRecordForm.invalid) {
            this.basicNotification.notif("error",'Verifique que los campos sean correctos');
            return;
        }
        clearForm(this.informeRecordForm);
        const tmp = this.informeRecordForm.getRawValue();
        const informe: InformeRevInstDTO = new InformeRevInstDTO().deserialize(tmp);
        informe.cicloEvaluacionId = this.informeRecordForm.get('ciclo').value.id;
        informe.activo = this.estatusRecord;
        informe.permisos = null;

        if (!informe.nombreArchivo && (!tmp.archivoInforme || !tmp.archivoInforme.length))
        {
            this.basicNotification.notif("error",'Es necesario el archivo del informe');
            return;
        }

        if(this.idArchivoEliminar){
            this.eliminarArchivo(informe, tmp)
        }
        else
        {
            this.guardar(informe, tmp);
        }
    }

    guardar(informe: InformeRevInstDTO, tmp: any){
        if (this.data.id){
            informe.id = this.data.id;
            informe.fechaCreacion = this.data.fechaCreacion;
            informe.usuarioCreacion = this.data.usuarioCreacion;
            informe.fechaModificacion = new Date();
            informe.usuarioModificacion = this.users.userSession.id;
            
            if (tmp.archivoInforme && tmp.archivoInforme.length > 0) {

                if (tmp.archivoInforme && tmp.archivoInforme.length > 0) {
                    for (let item of tmp.archivoInforme) {
                        if (item.size >= LIMIT_BLOB_SIZE_FILE) {
                            this.basicNotification.notif("error", 'El archivo ' + item.name + ' no debe sobrepasar los 20 mb');
                            return;
                        
                        }
                    }
                }

                tmp.archivoInforme.forEach((item: File) => {
                    this.convertFile(item).subscribe(base64 => {
                        informe.fileBase64String = base64
                        informe.nombreArchivo = item.name;
                        this.informeService.updateInforme(informe).subscribe(() => {
                            this.basicNotification.notif("success",'Informe actualizado correctamente');
                            this.ref.close(true);
                        });
                    });
                });
            }
            else{
                this.informeService.updateInforme(informe).subscribe(() => {
                    this.basicNotification.notif("success",'Informe actualizado correctamente');
                    this.ref.close(true);
                });
            }
            
        }
        else{
            informe.fechaCreacion = new Date();
            informe.usuarioCreacion = this.users.userSession.id;
            if (tmp.archivoInforme && tmp.archivoInforme.length > 0) {

                if (tmp.archivoInforme && tmp.archivoInforme.length > 0) {
                    for (let item of tmp.archivoInforme) {
                        if (item.size >= LIMIT_BLOB_SIZE_FILE) {
                            this.basicNotification.notif("error", 'El archivo ' + item.name + ' no debe sobrepasar los 20 mb');
                            return;
                        
                        }
                    }
                }

                tmp.archivoInforme.forEach((item: File) => {
                    this.convertFile(item).subscribe(base64 => {
                        informe.fileBase64String = base64
                        informe.nombreArchivo = item.name;
                        this.informeService.creaInforme(informe).subscribe(() => {
                            this.basicNotification.notif("success",'Informe creado correctamente');
                            this.ref.close(true);
                        });
                    });
                });
            }
            else{
                this.informeService.creaInforme(informe).subscribe(() => {
                    this.basicNotification.notif("success",'Informe creado correctamente');
                    this.ref.close(true);
                });
            }
             
             
        }
    }
}

