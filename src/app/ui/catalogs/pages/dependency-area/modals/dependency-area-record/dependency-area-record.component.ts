import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { RegionsService, UsersService } from 'src/app/core/services';
import { ValidatorService } from 'src/app/shared/validators';
import { Alert, clearForm } from 'src/app/utils/helpers';
import { RegionDTO, TablePaginatorSearch, UsuarioDTOV1, Vista } from 'src/app/utils/models';
import { DependenciaAreaData } from './dependency-area-record.service';
import { DependenciaAreaDTOV1 } from 'src/app/utils/models/dependencia-area.dto.v1';
import { DependencyAreaService } from 'src/app/core/services/api/dependency-area/dependency-area.service';
import { Router } from '@angular/router';
import { ModulesCatalogDTO } from 'src/app/utils/models/modules-catalog.dto';

export enum ModalTitle {
    NEW = 'Nueva dependencia de área',
    EDIT = 'Editar dependencia de área',
}

@Component({
    selector: 'app-dependency-area-record',
    templateUrl: './dependency-area-record.component.html',
    styleUrls: ['./dependency-area-record.component.scss'],
    standalone: false
})
export class DependencyAreaRecordComponent implements OnInit, OnDestroy {
    [x: string]: any;
    dependenciaAreaRecordForm: FormGroup;
    title: ModalTitle;
    data: DependenciaAreaDTOV1;
    edit: boolean;
    subscription: Subscription;
    disabled: boolean;
    permission: boolean;
    usuariosList: UsuarioDTOV1[];
    thisAccess: Vista;
    thisModule: ModulesCatalogDTO;
    permissions: boolean[];

    constructor(
        @Inject(MAT_DIALOG_DATA)
        public readonly dependenciaAreaData: DependenciaAreaData,
        private readonly formBuilder: FormBuilder,
        private readonly dependenciaareas: DependencyAreaService,
        private readonly ref: MatDialogRef<never>,
        private router: Router,
        private users: UsersService,
        private readonly validator: ValidatorService
    ) {
        this.title = ModalTitle.NEW;
        this.data = new DependenciaAreaDTOV1();
        this.edit = null;
        this.disabled = null;
        this.permission = null;
        this.subscription = new Subscription();
        this.dependenciaAreaRecordForm = this.formBuilder.group({
            nombre: [null, [Validators.required, Validators.maxLength(100), this.validator.noWhitespace]],
            activo: [true, []],
        });
        this.thisAccess = new Vista();
        this.permissions = [false, false, false];
    }

    ngOnInit() {
        this.setPermissions();
        this.disabled = !this.checkPermission(2);
        this.title = this.dependenciaAreaData ? ModalTitle.EDIT : ModalTitle.NEW;
        if (this.dependenciaAreaData) {
            this.dependenciaareas.getDependenciaAreaById(this.dependenciaAreaData.data.id).subscribe((response) => {
                if (!response.output) {
                    return;
                }
                const data = new DependenciaAreaDTOV1().deserialize(response.output[0]);
                this.data = data;
                this.dependenciaAreaRecordForm.patchValue(data);
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
        this.dependenciaAreaRecordForm.markAllAsTouched();
        if (this.dependenciaAreaRecordForm.invalid) {
            Alert.error('Verifique que los campos sean correctos');
            return;
        }
        clearForm(this.dependenciaAreaRecordForm);
        const tmp = this.dependenciaAreaRecordForm.getRawValue();
        const dependenciaarea: DependenciaAreaDTOV1 = new DependenciaAreaDTOV1().deserialize(tmp);
        if (this.data.id) {
            dependenciaarea.id = this.data.id;
            dependenciaarea.fechaCreacion = this.data.fechaCreacion;
            dependenciaarea.usuarioCreacion = this.data.usuarioCreacion;
            dependenciaarea.fechaModificacion = new Date();
            dependenciaarea.usuarioModificacion = this.users.userSession.id;
            this.dependenciaareas.updateDependenciaArea(dependenciaarea).subscribe(() => {
                Alert.success('', 'Dependencia de Área actualizada correctamente');
                this.ref.close(true);
            });
        } else {
            dependenciaarea.fechaCreacion = new Date();
            dependenciaarea.usuarioCreacion = this.users.userSession.id;
            this.dependenciaareas.createDependenciaArea(dependenciaarea).subscribe(() => {
                Alert.success('', 'Dependencia de Área creada correctamente');
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
                this.ref.close(result);
            }
        );
    }

    private trackingStatusForm(): void {
        this.subscription.add(this.dependenciaAreaRecordForm.statusChanges.subscribe(() => (this.edit = true)));
    }

    private setPermissions(): void {
        this.permissions = this.thisAccess.getPermissions(
            this.users.userSession.modulos,
            this.users.userSession.vistas,
            this.router.url
        );
    }

    checkPermission(p: number): boolean {
        return this.permissions[p];
    }
}
