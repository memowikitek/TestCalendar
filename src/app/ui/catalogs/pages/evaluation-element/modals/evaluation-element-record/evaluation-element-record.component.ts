import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ComponentsService, UsersService } from 'src/app/core/services';
import { EvaluationElementCatalogService } from 'src/app/core/services/api/evaluation-element-catalog/evaluation-element-catalog.service';
import { ValidatorService } from 'src/app/shared/validators';
import { Alert, clearForm } from 'src/app/utils/helpers';
import { CatalogoElementoEvaluacionDTOV1, ComponenteDTOV1, TablePaginatorSearch, Vista } from 'src/app/utils/models';
import { EvaluationElementCatalogData } from './evaluation-element-record.service';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';

export enum ModalTitle {
    NEW = 'Nuevo elemento de Evaluación',
    EDIT = 'Editar elemento de Evaluación',
}
@Component({
    selector: 'app-evaluation-element-record',
    templateUrl: './evaluation-element-record.component.html',
    styleUrls: ['./evaluation-element-record.component.scss'],
})
export class EvaluationElementRecordComponent implements OnInit, OnDestroy {
    evaluationElementeRecordForm: FormGroup;
    title: ModalTitle;
    data: CatalogoElementoEvaluacionDTOV1;
    componentsList: ComponenteDTOV1[];
    edit: boolean;
    subscription: Subscription;
    disabled: boolean;
    permission: boolean;
    thisAccess: Vista;
    permissions: boolean[];
    estatus: string;
    estatusRecord: boolean;
    constructor(
        @Inject(MAT_DIALOG_DATA)
        public readonly EvaluationElementCatalogData: EvaluationElementCatalogData,
        private router: Router,
        public readonly evaluationElementCatalogService: EvaluationElementCatalogService,
        private readonly components: ComponentsService,
        private readonly formBuilder: FormBuilder,
        private readonly ref: MatDialogRef<never>,
        private users: UsersService,
        private readonly validator: ValidatorService,
        private basicNotification : BasicNotification,
    ) {
        this.title = ModalTitle.NEW;
        this.data = new CatalogoElementoEvaluacionDTOV1();
        this.edit = null;
        this.disabled = null;
        this.permission = null;
        this.componentsList = [];
        this.subscription = new Subscription();
        this.evaluationElementeRecordForm = this.formBuilder.group({
            clave: [null, [Validators.required, Validators.maxLength(5), this.validator.noWhitespace]],
            nombre: [null, [Validators.required, Validators.maxLength(300), this.validator.noWhitespace]],
            componenteId: [null, [Validators.required]],
            activo: [true, []],
        });
        this.thisAccess = new Vista();
        this.permissions = [false, false, false];
        this.getAllComponentes();
    }

    ngOnInit(): void {
        setTimeout(this.setfieldcounter, 2000);

        // console.log($(".nameevaluation").val());
        //todo: revisar seguridad
        // this.setPermissions();
        this.disabled = !this.checkPermission(2);

        this.title = this.EvaluationElementCatalogData ? ModalTitle.EDIT : ModalTitle.NEW;
        this.estatusRecord = this.EvaluationElementCatalogData ? this.EvaluationElementCatalogData.data.activo : true;
        this.estatus = this.EvaluationElementCatalogData ? this.EvaluationElementCatalogData.data.activo? "Activo":"Inactivo" : "Activo";

        if (this.EvaluationElementCatalogData) {
            this.evaluationElementCatalogService
                .getEvaluationElementCatalogById(this.EvaluationElementCatalogData.data.id)
                .subscribe((response) => {
                    if (!response.output) {
                        return;
                    }
                    const data = new CatalogoElementoEvaluacionDTOV1().deserialize(response.output[0]);
                    this.data = data;
                    this.evaluationElementeRecordForm.patchValue(data);
                    this.evaluationElementeRecordForm.get('clave').disable();
                    this.evaluationElementeRecordForm.get('componenteId').disable();
                    
                    this.trackingStatusForm();
                });
        } else {
            this.trackingStatusForm();
        }
    }
    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    submit(): void {
        this.evaluationElementeRecordForm.markAllAsTouched();
        if (this.evaluationElementeRecordForm.invalid) {
            // Alert.error('Verifique que los campos sean correctos');
            this.basicNotification.notif("error","Verifique que los campos sean correctos");
            return;
        }
        clearForm(this.evaluationElementeRecordForm);
        const tmp = this.evaluationElementeRecordForm.getRawValue();
        const elementoEvaluacion: CatalogoElementoEvaluacionDTOV1 = new CatalogoElementoEvaluacionDTOV1().deserialize(
            tmp
        );
        if (this.data.id) {
            elementoEvaluacion.id = this.data.id;
            elementoEvaluacion.fechaCreacion = this.data.fechaCreacion;
            elementoEvaluacion.usuarioCreacion = this.data.usuarioCreacion;
            elementoEvaluacion.fechaModificacion = new Date();
            elementoEvaluacion.usuarioModificacion = this.users.userSession.id;
            elementoEvaluacion.activo = this.estatusRecord;
            this.evaluationElementCatalogService.updateEvaluationElementCatalog(elementoEvaluacion).subscribe(() => {
                // Alert.success('', 'Elemento actualizado correctamente');
                this.basicNotification.notif("success","Elemento actualizado correctamente");
                this.ref.close(true);
            });
        } else {
            elementoEvaluacion.fechaCreacion = new Date();
            elementoEvaluacion.usuarioCreacion = this.users.userSession.id;
            this.evaluationElementCatalogService.createEvaluationElementCatalog(elementoEvaluacion).subscribe(() => {
                // Alert.success('', 'Elemento creado correctamente');
                this.basicNotification.notif("success","Elemento creado correctamente");
                this.ref.close(true);
            });
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
                this.ref.close();
            }
        );
    }

    getAllComponentes() {
        const filter = new TablePaginatorSearch();
        filter.pageSize = 1000;
        filter.filter = { activo: true };
        this.componentsList = [];
        this.components.getAllComponents(filter).subscribe((response) => {
            if (response.output) {
                this.componentsList = response.output.map((componente) =>
                    new ComponenteDTOV1().deserialize(componente)
                );
            }
        });
    }
    setfieldcounter() {}
    private trackingStatusForm(): void {
        this.subscription.add(this.evaluationElementeRecordForm.statusChanges.subscribe(() => (this.edit = true)));
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

    changeStatusDescription($event: any): void {
        const estatusRecord: boolean = $event.checked ;
        this.estatusRecord = estatusRecord;
        this.estatus = estatusRecord ? "Activo":"Inactivo";
        
    }
}
