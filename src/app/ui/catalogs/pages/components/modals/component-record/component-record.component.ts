import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ComponentsService, EvaluationElementCatalogService, UsersService } from 'src/app/core/services';
import { ValidatorService } from 'src/app/shared/validators';
import { Alert, clearForm } from 'src/app/utils/helpers';
import {
    NivelModalidadDTOV1,
    ComponenteDTO,
    ComponenteDTOV1,
    Vista,
    CatalogoElementoEvaluacionDTOV1,
    ElementoEvaluacionDTOV1,
    TablePaginatorSearch,
} from 'src/app/utils/models';
import { ComponentData } from './component-record.service';
import { ModuleIdV2 } from 'src/app/utils/enums/modules-idV2';
import { ModulesCatalogDTO } from 'src/app/utils/models/modules-catalog.dto';
import { Router } from '@angular/router';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';

export enum ModalTitle {
    NEW = 'Nuevo componente',
    EDIT = 'Editar componente',
}
@Component({
    templateUrl: './component-record.component.html',
    styleUrls: ['./component-record.component.scss'],
})
export class ComponentsRecordComponent implements OnInit, OnDestroy {
    componentRecordForm: FormGroup;
    //j031
    evaluationElementList: CatalogoElementoEvaluacionDTOV1[];

    title: ModalTitle;
    data: ComponenteDTOV1;
    edit: boolean;
    subscription: Subscription;
    disabled: boolean;
    permission: boolean;
    thisAccess: Vista;
    thisModule: ModulesCatalogDTO;
    permissions: boolean[];
    estatus: string;
    estatusRecord: boolean;
    constructor(
        @Inject(MAT_DIALOG_DATA)
        public readonly componentsData: ComponentData,
        private router: Router,
        private readonly formBuilder: FormBuilder,
        private readonly ref: MatDialogRef<never>,
        private users: UsersService,
        private components: ComponentsService,
        private readonly validator: ValidatorService,
        private basicNotification : BasicNotification,
        

        public readonly evaluationElement: EvaluationElementCatalogService
    ) {
        this.title = ModalTitle.NEW;
        this.data = new ComponenteDTOV1();
        this.edit = null;
        this.disabled = null;
        this.permission = null;
        this.subscription = new Subscription();
        this.componentRecordForm = this.formBuilder.group({
            clave: [null, [Validators.required, Validators.maxLength(50), this.validator.noWhitespace]],
            nombre: [null, [Validators.required, Validators.maxLength(150), this.validator.noWhitespace]],
            activo: [true, []],
        });
        this.thisAccess = new Vista();
        this.permissions = [false, false, false];
        this.evaluationElementList = [];
    }

    ngOnInit(): void {
        //todo: revisar seguridad
        // this.setPermissions();
        // this.disabled = !this.checkPermission(2);
        this.disabled=false;

        this.estatusRecord = this.componentsData ? this.componentsData.data.activo : true;
        this.estatus = this.componentsData ? this.componentsData.data.activo? "Activo":"Inactivo" : "Activo";

        this.title = this.componentsData ? ModalTitle.EDIT : ModalTitle.NEW;
        if (this.componentsData) {
            const data = new ComponenteDTOV1().deserialize(this.componentsData.data);
            this.data = data;
            this.componentRecordForm.patchValue(data);
            this.componentRecordForm.get('clave').disable();
            this.trackingStatusForm();
        } else {
            this.trackingStatusForm();
        }
    }
    ngOnDestroy(): void {
        this.subscription.unsubscribe();
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

    submit(): void {
        this.componentRecordForm.markAllAsTouched();
        if (this.componentRecordForm.invalid) {
            // Alert.error('Verifique que los campos sean correctos');
            this.basicNotification.notif("error",'Verifique que los campos sean correctos');
            return;
        }
        clearForm(this.componentRecordForm);
        const tmp = this.componentRecordForm.getRawValue();
        const component: ComponenteDTOV1 = new ComponenteDTOV1().deserialize(tmp);
        
        if (this.data.id) {
            component.id = this.data.id;
            component.nombre = tmp.nombre;
            component.fechaCreacion = this.data.fechaCreacion;
            component.usuarioCreacion = this.data.usuarioCreacion;
            component.fechaModificacion = new Date();
            component.usuarioModificacion = this.users.userSession.id;
            component.activo = this.estatusRecord;

            this.components.updateComponent(component).subscribe(() => {
                // Alert.success('', 'Componente actualizado correctamente');
                this.basicNotification.notif("success",'Componente actualizado correctamente');
                this.ref.close(true);
            });
        } else {
            component.fechaCreacion = new Date();
            component.usuarioCreacion = this.users.userSession.id;
            this.components.createComponent(component).subscribe(() => {
                // Alert.success('', 'Componente creado correctamente');
                this.basicNotification.notif("success",'Componente creado correctamente');
                this.ref.close(true);
            });
        }
    }

    private trackingStatusForm(): void {
        this.subscription.add(this.componentRecordForm.statusChanges.subscribe(() => (this.edit = true)));
    }

    private setPermissions(): void {
        this.permissions = this.thisAccess.getPermissions(
            this.users.userSession.modulos,
            this.users.userSession.vistas,
            this.router.url
        );
    }

    private getEvaluationElementList(): void {
        const filters = new TablePaginatorSearch();

        this.evaluationElement.getAllEvaluationElementsCatalogs(filters).subscribe((response) => {
            if (response.output) {
                this.evaluationElementList = response.output.map((item) =>
                    new CatalogoElementoEvaluacionDTOV1().deserialize(item)
                );
                // aoeu
                // this.componentRecordForm.
            }
        });
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
