import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import {
    AccessTypeService,
    CampusService,
    LevelModalityService,
    ProfileService,
    UsersService,
    ViewsService,
} from 'src/app/core/services';
import { ValidatorService } from 'src/app/shared/validators';
import { Alert, clearForm, Auth } from 'src/app/utils/helpers';
import { ModulesCatalog, PerfilDTOV1, PerfilAddUpdateDTOV1, TipoAccesoDTOV1 } from 'src/app/utils/models';

import { ProfileData } from './profile-record.service';
import { PermisosDTO } from 'src/app/utils/models/permisos.dto';
import { performance } from 'perf_hooks';

export enum ModalTitle {
    NEW = 'Nuevo perfil',
    EDIT = 'Editar perfil',
}
@Component({
    templateUrl: './profile-record.component.html',
    styleUrls: ['./profile-record.component.scss'],
})
export class ProfileRecordComponent implements OnInit, OnDestroy {
    profileRecordForm: FormGroup;
    title: ModalTitle;
    data: PerfilDTOV1;
    edit: boolean;
    subscription: Subscription;
    disabled: boolean;
    permission: boolean;
    modulesList: ModulesCatalog[];
    accessTypeList: string[];
    viewList: PermisosDTO[];
    private accessVoid: boolean;
    constructor(
        @Inject(MAT_DIALOG_DATA)
        public readonly profileData: ProfileData,
        public readonly profile: ProfileService,
        public readonly levelModality: LevelModalityService,
        private readonly formBuilder: FormBuilder,
        public readonly view: ViewsService,
        public readonly campus: CampusService,
        private readonly ref: MatDialogRef<never>,
        private users: UsersService,
        private readonly validator: ValidatorService,
        private readonly accessType: AccessTypeService
    ) {
        this.title = ModalTitle.NEW;
        this.data = new PerfilDTOV1();
        this.edit = null;
        this.disabled = null;
        this.permission = null;
        this.modulesList = [];
        this.accessTypeList = [];
        this.viewList = [];
        this.accessVoid = false;
        this.subscription = new Subscription();
        this.profileRecordForm = this.formBuilder.group({
            id: [null],
            nombre: [null, [Validators.required, Validators.maxLength(100), this.validator.noWhitespace]],
            administrador: [false, []],
            evaluador: [false, []],
            autorizador: [false, []],
            activo: [true, []],
            modules: new FormArray([]),
        });
        this.accessTypeList = ['C', 'D', 'E'];
    }

    get moduleListArr(): FormArray {
        return this.profileRecordForm.get('modules') as FormArray;
    }

    get permisosListArr(): FormArray {
        return this.profileRecordForm.get('permisos') as FormArray;
    }

    ngOnInit(): void {
        this.title = this.profileData ? ModalTitle.EDIT : ModalTitle.NEW;
        Promise.all([this.getModulesList()]).then(() => {
            this.buildModuleFormArr();
        });
        if (this.profileData) {
            this.data = this.profileData.record;
            this.profileRecordForm.patchValue(this.data);
            this.viewList = this.data.permisos;
            // // console.log(this.data.permisos);
            // // console.log(Auth.getSession().vistas);
            setTimeout(() => {
                this.assignViewStatusLoad(this.viewList);
                this.edit = false;
            }, 500);
        }
        this.trackingStatusForm();
        this.checkPermission();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    submit(): void {
        this.accessVoid = false;
        this.profileRecordForm.markAllAsTouched();
        clearForm(this.profileRecordForm);
        const perfil: PerfilDTOV1 = new PerfilDTOV1();
        const modules: AbstractControl[] = this.getControlsSelected(this.moduleListArr.controls);
        modules.forEach((c) => {
            const vista: PermisosDTO = new PermisosDTO();
            vista.vistaId = c.get('idVista').value;
            vista.permisos = c.get('tipoAccesoIds').value.toString().replaceAll(',', '');

            perfil.permisos.push(vista);
            if (!vista.permisos || vista.permisos.length === 0) {
                this.accessVoid = true;
            }
        });
        if (this.accessVoid) {
            Alert.error('Para poder guardar deberá asignar un permiso ');
            return;
        }
        // // console.log(perfil)
        if (this.data.id) {
            perfil.id = this.data.id;
            perfil.nombre = this.profileRecordForm.get('nombre').value;
            perfil.administrador = this.profileRecordForm.get('administrador').value;
            perfil.evaluador = this.profileRecordForm.get('evaluador').value;
            perfil.autorizador = this.profileRecordForm.get('autorizador').value;
            perfil.activo = this.profileRecordForm.get('activo').value;
            perfil.fechaCreacion = this.data.fechaCreacion;
            perfil.usuarioCreacion = this.data.usuarioCreacion;
            perfil.fechaModificacion = new Date();
            perfil.usuarioModificacion = this.users.userSession.id;
            this.profile.updateProfile(perfil).subscribe(() => {
                if (perfil.id == this.users.userSession.perfilId) {
                    this.setProfileSession(perfil);
                }

                Alert.success('', 'Perfil actualizado correctamente');
                this.ref.close(true);
            });
        } else {
            perfil.nombre = this.profileRecordForm.get('nombre').value;
            perfil.administrador = this.profileRecordForm.get('administrador').value;
            perfil.evaluador = this.profileRecordForm.get('evaluador').value;
            perfil.autorizador = this.profileRecordForm.get('autorizador').value;
            perfil.activo = this.profileRecordForm.get('activo').value;
            perfil.fechaCreacion = new Date();
            perfil.usuarioCreacion = this.users.userSession.id;
            this.profile.createProfile(perfil).subscribe(() => {
                if (perfil.id == this.users.userSession.perfilId) {
                    this.setProfileSession(perfil);
                }
                Alert.success('', 'Perfil creado correctamente');
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

    private getRelPerfilVistaId(vistaId: string | number): string | number {
        const perfilVista: PermisosDTO = this.data.permisos.find((rel) => rel.vistaId === vistaId);
        if (perfilVista) {
            return perfilVista.vistaId;
        }
        return 0;
    }

    checkCatalogs(idVista: string | number, event: MatCheckboxChange): void {
        const module: ModulesCatalog = this.modulesList.find((module) => module.id == idVista);
        const data: AbstractControl[] = this.moduleListArr.controls;
        const control: AbstractControl = data.find((item) => item.get('idVista').value == idVista);
        if (!event.checked) {
            this.viewList = this.viewList.filter((item) => item.vistaId != idVista);
            control.get('tipoAccesoIds').reset();
        } else {
            const permiso = this.getPermisoFromModule(module);
            this.viewList = this.viewList.filter((item) => item.vistaId != idVista);
            this.viewList.push(permiso);
        }
    }

    private getPermisoFromModule(module: ModulesCatalog) {
        const permiso: PermisosDTO = new PermisosDTO();
        permiso.vistaId = module.id;
        permiso.vista = module.name;
        permiso.permisos = '';
        return permiso;
    }

    private getControlsSelected(controlSelectd: AbstractControl[]): AbstractControl[] {
        return controlSelectd.filter((i) => i.get('vistaSelected').value === true);
    }

    private getModulesList(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.view.getAllViews().subscribe((response) => {
                if (response.output) {
                    this.modulesList = response.output.map((vista) => new ModulesCatalog().deserialize(vista));
                    resolve(true);
                }
            });
        });
    }

    private setProfileSession(Perfil: PerfilDTOV1) {
        var userSession = Auth.getSession();
        userSession.esAdmin = Perfil.administrador;
        userSession.esEvaluador = Perfil.evaluador;
        userSession.esAutorizador = Perfil.autorizador;
        userSession.esOtro = Perfil.otro;
        var ids = Perfil.permisos.map((x) => x.vistaId);
        userSession.vistas = userSession.vistas.filter((x) => ids.includes(x.vistaId) || ids.includes(x.vistaPadre));
        // // console.log(ids)
        Auth.login(userSession);
    }
    private buildModuleFormArr(): void {
        this.modulesList.forEach((module) => {
            // transform from Modules to Permisos
            this.moduleListArr.push(this.createItem(module));
        });
    }

    private createItem(control: ModulesCatalog): FormGroup {
        return this.formBuilder.group({
            idVista: [control.id],
            vistaSelected: [false],
            vistaNombre: [control.name],
            tipoAccesoIds: [[]],
        });
    }

    getViewName(idVista: string | number): string {
        const vista: ModulesCatalog = this.modulesList.find((module) => module.id == idVista);
        if (vista) {
            return vista.name;
        }
        return '';
    }

    private assignViewStatusLoad(viewList: PermisosDTO[]): void {
        const moduleList: AbstractControl[] = this.moduleListArr.controls;
        viewList.forEach((view) => {
            const control: AbstractControl = moduleList.find((control) => control.get('idVista').value == view.vistaId);
            const accessType: (string | number)[] = view.permisos.split('');
            if (control) {
                control.get('vistaSelected').setValue(true);
                control.get('tipoAccesoIds').setValue(accessType);
            }
        });
    }

    private trackingStatusForm(): void {
        this.subscription.add(this.profileRecordForm.statusChanges.subscribe(() => (this.edit = true)));
    }

    private checkPermission(): void {
        // this.permission = this.users.checkPermission("", true);
        // if (!this.permission) {
        //   this.profileRecordForm.disable();
        // }
    }
}
