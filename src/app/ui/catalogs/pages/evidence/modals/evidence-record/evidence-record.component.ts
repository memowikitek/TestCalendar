import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, ReplaySubject, Subscription } from 'rxjs';
import { EvidencesCatalogService, UsersService } from 'src/app/core/services';
import { ValidatorService } from 'src/app/shared/validators';
import { Alert, clearForm } from 'src/app/utils/helpers';
import { EvidenceDTO, TablePaginatorSearch, Vista } from 'src/app/utils/models';
import { EvidenceData } from './evidence-record.service';
import { ModuleIdV2 } from 'src/app/utils/enums/modules-idV2';
import { Router } from '@angular/router';
import { ModulesCatalogDTO } from 'src/app/utils/models/modules-catalog.dto';
import { FileValidators } from 'ngx-file-drag-drop';

import * as $ from "jquery";
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';
import { LIMIT_BLOB_SIZE_FILE } from 'src/app/utils/constants';
export enum ModalTitle {
    NEW = 'Nueva Evidencia',
    EDIT = 'Editar Evidencia',
}

@Component({
    selector: 'app-evidence-record',
    templateUrl: './evidence-record.component.html',
    styleUrls: ['./evidence-record.component.scss'],
})
export class EvidenceRecordComponent implements OnInit, OnDestroy {
    evidenceRecordForm: FormGroup;
    title: ModalTitle;
    data: EvidenceDTO;
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

    constructor(
        @Inject(MAT_DIALOG_DATA)
        public readonly evidenceData: EvidenceData,
        private router: Router,
        private readonly formBuilder: FormBuilder,
        private readonly evidenceServ: EvidencesCatalogService,
        private readonly ref: MatDialogRef<never>,
        private users: UsersService,
        private readonly validator: ValidatorService,
        private basicNotification : BasicNotification,
    ) {
        this.title = ModalTitle.NEW;
        this.data = new EvidenceDTO();
        this.edit = null;
        this.disabled = null;
        this.permission = null;
        this.subscription = new Subscription();
        this.evidenceRecordForm = this.formBuilder.group({
            clave: [null, [Validators.required, Validators.maxLength(10), this.validator.noWhitespace]],
            nombre: [null, [Validators.required, Validators.maxLength(150), this.validator.noWhitespace]],
            descripcion: [null, [Validators.required, Validators.maxLength(250), this.validator.noWhitespace]],
            activo: [true, []],
            formatoEvidencia: [null, []],
            nombreFormato: [null],
            archivoAzureId: [null]
        });
        this.thisAccess = new Vista();
        this.permissions = [false, false, false];
        this.edit = true;
    }

    ngOnInit() {
        // $('.nameevaluation').maxlength({
        //     alwaysShow: true,
        //     warningClass: 'form-text pr-3',
        //     limitReachedClass: 'form-text pr-3',
        //     placement: 'bottom-right-inside' 
        //   })
        // this.setPermissions();
        this.disabled = !this.checkPermission(2);
        this.title = this.evidenceData ? ModalTitle.EDIT : ModalTitle.NEW;
        this.estatusRecord = this.evidenceData ? this.evidenceData.data.activo : true;
        this.estatus = this.evidenceData ? this.evidenceData.data.activo? "Activo":"Inactivo" : "Activo";
        if (this.evidenceData) {
            this.evidenceServ.getEvidenceById(this.evidenceData.data.id).subscribe((response) => {
                if (!response.output) {
                    return;
                }

                const data = new EvidenceDTO().deserialize(response.output);
                this.data = data;
                this.evidenceRecordForm.patchValue(data);
                this.evidenceRecordForm.get('clave').disable();
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

    convertFile(file: File): Observable<string> {
        const result = new ReplaySubject<string>(1);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => result.next(event.target.result.toString());
        return result;
    }


    submit(): void {
        this.evidenceRecordForm.markAllAsTouched();
        if (this.evidenceRecordForm.invalid) {
            // Alert.error('Verifique que los campos sean correctos');
            this.basicNotification.notif("error",'Verifique que los campos sean correctos');
            return;
        }
        clearForm(this.evidenceRecordForm);
        const tmp = this.evidenceRecordForm.getRawValue();
        const evidence: EvidenceDTO = new EvidenceDTO().deserialize(tmp);
        if (this.data.id) {
            evidence.id = this.data.id;
            evidence.nombre = evidence.nombre;
            evidence.descripcion = evidence.descripcion;

            evidence.fechaCreacion = this.data.fechaCreacion;
            evidence.usuarioCreacion = this.data.usuarioCreacion;
            evidence.fechaModificacion = new Date();
            evidence.usuarioModificacion = this.users.userSession.id;
            evidence.activo = this.estatusRecord;

            if (tmp.formatoEvidencia && tmp.formatoEvidencia.length > 0) {

                   for (let item of tmp.formatoEvidencia) {
                        if (item.size >= LIMIT_BLOB_SIZE_FILE) {
                            this.basicNotification.notif("error", 'El archivo1' + item.name + ' no debe sobrepasar los 20 mb');
                            return;
                        
                        }
                    }
                

                tmp.formatoEvidencia.forEach((item: File) => {
                    this.convertFile(item).subscribe(base64 => {
                        evidence.fileBase64String = base64
                        evidence.nombreFormato = item.name;

                        this.evidenceServ.updateEvidence(evidence).subscribe(() => {
                            // Alert.success('', 'Evidencia actualizada correctamente');
                            this.basicNotification.notif("success",'Evidencia actualizada correctamente');
                            this.ref.close(true);
                        });
                    });
                });
            }
            else {
                this.evidenceServ.updateEvidence(evidence).subscribe(() => {
                    // Alert.success('', 'Evidencia actualizada correctamente');
                    this.basicNotification.notif("success",'Evidencia actualizada correctamente');
                    this.ref.close(true);
                });
            }
        } else {
            evidence.nombre = evidence.nombre;
            evidence.descripcion = evidence.descripcion;
            evidence.fechaCreacion = new Date();
            evidence.usuarioCreacion = this.users.userSession.id;

            if (tmp.formatoEvidencia && tmp.formatoEvidencia.length > 0) {
                tmp.formatoEvidencia.forEach((item: File) => {
                    this.convertFile(item).subscribe(base64 => {
                        evidence.fileBase64String = base64
                        evidence.nombreFormato = item.name;
                        this.evidenceServ.createEvidence(evidence).subscribe(() => {
                            // Alert.success('', 'Evidencia creada correctamente');
                            this.basicNotification.notif("success",'Evidencia creada correctamente');
                            this.ref.close(true);
                        });
                    });
                });
            }
            else {
                this.evidenceServ.createEvidence(evidence).subscribe(() => {
                    // Alert.success('', 'Evidencia creada correctamente');
                    this.basicNotification.notif("success",'Evidencia creada correctamente');
                    this.ref.close(true);
                });
            }
        }
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

    private trackingStatusForm(): void {
        this.subscription.add(this.evidenceRecordForm.statusChanges.subscribe(() => (this.edit = true)));
    }

    private setPermissions(): void {
        this.permissions = this.thisAccess.getPermissions(
            this.users.userSession.modulos,
            this.users.userSession.vistas,
            this.router.url
        );
    }

    checkPermission(p: number): boolean {
        return true;
        // eliminar el codigo desues de verificar permisos
        return this.permissions[p];
    }

    changeStatusDescription($event: any): void {
        const estatusRecord: boolean = $event.checked ;
        this.estatusRecord = estatusRecord;
        this.estatus = estatusRecord ? "Activo":"Inactivo";
        
    }

    onDeleteFile() {
        let idazure = this.evidenceRecordForm.controls['archivoAzureId'].value
        if (idazure != null) {
            Alert.confirm('Eliminar archivo de evidencia', `¿Deseas eliminar el archivo de evidencia?`).subscribe(
                (result) => {
                    if (!result || !result.isConfirmed) {
                        return;
                    }
                    // Elimina
                    this.evidenceServ.deleteAzureStorageFile(idazure).then((resp) => {
                        if (resp.exito) {
                            this.evidenceRecordForm.controls['archivoAzureId'].setValue(null);
                            this.evidenceRecordForm.controls['nombreFormato'].setValue(null);
                            this.hasFile = false;
                            // Alert.success('', 'Archivo eliminado correctamente');
                            this.basicNotification.notif("success",'Archivo eliminado correctamente');
                        }
                    });
                    //
                }
            );
        }

    }

}
