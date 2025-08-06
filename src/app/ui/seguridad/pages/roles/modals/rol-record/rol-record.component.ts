import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription, Subject, Observable } from 'rxjs';

import { filter, takeUntil } from 'rxjs/operators';
import { AccountInfo, InteractionStatus, RedirectRequest } from '@azure/msal-browser';

import { MsalBroadcastService, MsalGuardConfiguration, MsalService, MSAL_GUARD_CONFIG } from '@azure/msal-angular';

import {
    UsersService,
} from 'src/app/core/services';

import { Alert, clearForm } from 'src/app/utils/helpers';
import { MatSelectChange } from '@angular/material/select';
import { MatRadioChange } from '@angular/material/radio'
import { Router } from '@angular/router';
import { ModulesCatalogDTO } from 'src/app/utils/models/modules-catalog.dto';

import {
    TablePaginatorSearch,
    TipoRolDTO,    
    MenuVistasPermisosDTO,
    VistaPermisoDTO,
    PermisoPorVistaDTO,
    
} from 'src/app/utils/models';
import { MenuDTO } from 'src/app/utils/models/menu.dto';

import { RolData } from './rol-record.service';

import { RolesService } from 'src/app/core/services/api/roles/roles.service';
import { TipoRolService } from 'src/app/core/services/api/tipoRol/tipoRol.service';
import { MenuService } from 'src/app/core/services/api/menu/menu.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { RolPermisosDTO } from 'src/app/utils/models/rol-permisos.dto';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';

export enum ModalTitle {
    NEW = 'Nuevo Rol',
    EDIT = 'Editar Rol',
    VIEW = 'Rol',
}

interface IRama{
    hijos: number[];
    visible: boolean;
    padre: number;
}

@Component({
    selector: 'app-rol-record',
    templateUrl: './rol-record.component.html',
    styleUrls: ['./rol-record.component.scss'],
})
export class RolRecordComponent implements OnInit, OnDestroy{
    @ViewChild('input', { static: true })
    inputSearch: ElementRef;
    rolRecordForm: FormGroup;
    title: ModalTitle;
    modoLectura: boolean;
    subscription: Subscription;
    edit: boolean;

    tipoRolList: TipoRolDTO[] = [];
    menuAccesos: MenuDTO[] = [];
    menuVistaPermiso: MenuVistasPermisosDTO[] = [];
    
    //Diccionario de ramas
    arbolRolVista: { [key: string] : IRama } = { };
    arbolRolVistaPermisos: { [key: string] : IRama } = { };

    error: string;
    countPermisos: number;

    estatusRecord: boolean;
    estatus: string;

    constructor(
        @Inject(MAT_DIALOG_DATA)
        public readonly rolData: RolData,
        private router: Router,
        private readonly formBuilder: FormBuilder,
        private readonly ref: MatDialogRef<never>,
        private readonly tipoRol: TipoRolService,
        private readonly rolVistaPermiso: RolesService,
        private readonly menu: MenuService,
        private basicNotification: BasicNotification,
    ){
        this.subscription = new Subscription();
        this.title = ModalTitle.NEW;
        this.modoLectura = this.rolData && this.rolData.modoLectura;
        this.edit = null;

        this.error = '';
        this.countPermisos = 0;
        
        //Para guardar los valores de los checkbox de las vistas
        const permisoVista = new FormGroup({});
        const vistaPermiso = new FormGroup({});

        this.rolRecordForm = this.formBuilder.group({
            id: [{ value: null, disabled: true }],
            nombre: [{ value: null, disabled: this.modoLectura }, [Validators.required]],
            activo: [{ value: true, disabled: this.modoLectura }, []],
            tipoRol: [{ value: null, disabled: this.modoLectura }, [Validators.required]],
            instituciones: [{ value: null, disabled: true }, []],

            allCampus:[{ value: false, disabled: this.modoLectura }, []],

            permisoVista: permisoVista,
            vistaPermiso: vistaPermiso,
           
            vistas: [{ value: {}, disabled: this.modoLectura }, []],
        });

        this.getAllTipoRol();
        this.getMenuAccesos(permisoVista);
        this.getMenuVistaPermisos(vistaPermiso);

        //console.log(this.rolData);
        
    }

    get permisoVista(){return this.rolRecordForm.get('permisoVista') as FormGroup; }
    getControlPErmisoVista(n: string){return this.permisoVista.get(n) as FormControl;}

    get vistaPermiso(){return this.rolRecordForm.get('vistaPermiso') as FormGroup; }
    getControlVistaPermiso(n: string){return this.vistaPermiso.get(n) as FormControl;}

    addCheckVistas(vistas: FormGroup){
        for(var i=0; i < this.menuAccesos.length; i++){
            //console.log(this.menuAccesos[i]);
            if(this.esVista(this.menuAccesos[i])){
                vistas.addControl("v" + this.menuAccesos[i].id, new FormControl(false, []));
            }
            
            this.arbolRolVista[this.menuAccesos[i].id.toString()] = { 
                visible: false, 
                hijos: this.menuAccesos[i].subMenus.map( (item: MenuDTO) => item.id ),
                padre: this.menuAccesos[i].vistaPadre
            };
        }
         //onsole.log(this.arbolRolVista);
        // console.log(this.arbolRolVista[60].visible, this.arbolRolVista[60].hijos)
    }

    addCheckVistasPermisos(vistas: FormGroup){
        //Menu completo de vistas y permisos
        for(var i=0; i < this.menuVistaPermiso.length; i++){
            let abierto = false;
            //Se valida que la vista tenga permisos asignados
            if(this.tienePermisos(this.menuVistaPermiso[i])){
                //Se crea un Check por cada permiso, el nombre del check esta formado por: 'vp'+idVista+'-'+idPermiso
                for(var nP = 0; nP < this.menuVistaPermiso[i].permisos.length; nP++){
                    let valorCheck = this.getValorVistaPermiso(this.menuVistaPermiso[i].id, this.menuVistaPermiso[i].permisos[nP].id);
                    abierto = abierto || valorCheck;
                    vistas.addControl("vp" + this.menuVistaPermiso[i].id + "-" + this.menuVistaPermiso[i].permisos[nP].id, 
                                       new FormControl(
                                          {value: valorCheck, disabled: this.modoLectura}, []
                                        )
                                    );
                }
            }   
            //Se crea un arbol virtual para guardar el estado (visible u oculto) de lo hijos
            this.arbolRolVistaPermisos[this.menuVistaPermiso[i].id.toString()] = { 
                visible: abierto, 
                hijos: this.menuVistaPermiso[i].subMenus.map( (item: MenuVistasPermisosDTO) => item.id ),
                padre: this.menuVistaPermiso[i].vistaPadre
            };  
            if(abierto){
                this.abrirPadresArbolVistaPermiso(this.menuVistaPermiso[i].vistaPadre);
            }       
        }
        //  console.log(this.arbolRolVistaPermisos);
        //  console.log(this.arbolRolVistaPermisos[60].visible, this.arbolRolVistaPermisos[60].hijos)
    }

    //Abre las ramas padre recursivamente
    private abrirPadresArbolVistaPermiso(idPadre: number){
        if(idPadre != null ){
            var vista: string = idPadre.toString();
            if(this.arbolRolVistaPermisos[vista]){
                this.arbolRolVistaPermisos[vista].visible = true;
                this.abrirPadresArbolVistaPermiso(this.arbolRolVistaPermisos[vista].padre);
            }
        }
    }

    //El valor default es false, solo en caso de que se este editando o viendo los roles, se toma el valor que llega de la tabla principal
    private getValorVistaPermiso(vistaId: number, permisoId: number){
        var check = false;

        if(this.rolData){
            check = this.rolData.data.permisos.some( (p) => p.vistaId === vistaId && p.permisoId === permisoId );
        }

        return check;
    }

    esVista(item: MenuDTO){
        return !item.subMenus || !item.subMenus.length;
    }
    tienePermisos(item: MenuVistasPermisosDTO){
        return item.permisos && item.permisos.length;
    }
    

    toggle(arbolRolVista: any, id: number){
        if(arbolRolVista[id]){
            arbolRolVista[id].visible = !arbolRolVista[id].visible;
        }
    }


    ngOnInit(): void {
        this.title = this.rolData ? (this.modoLectura ? ModalTitle.VIEW : ModalTitle.EDIT) : ModalTitle.NEW;

        this.estatusRecord = this.rolData ? this.rolData.data.activo : true;
        this.estatus = this.rolData ? this.rolData.data.activo? "Activo":"Inactivo" : "Activo";

        if(this.rolData){
            
            this.rolRecordForm.get('id').patchValue(this.rolData.data.id);  
            this.rolRecordForm.get('nombre').patchValue(this.rolData.data.nombre);     
            this.rolRecordForm.get('activo').patchValue(this.rolData.data.activo);
            this.rolRecordForm.get('tipoRol').patchValue(this.rolData.data.tipoRolId);
            this.rolRecordForm.get('allCampus').patchValue(this.rolData.data.isAllAreas);

        }
        this.trackingStatusForm();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    private trackingStatusForm(): void {
        this.subscription.add(this.rolRecordForm.statusChanges.subscribe(() => (this.edit = true)));
    }

    closeModalByConfimation(): void {
        if (!this.edit || !this.rolRecordForm.dirty) {
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

    private getAllTipoRol(): void {
        const filters = new TablePaginatorSearch();
        filters.pageSize = 999999;
        this.tipoRol.getAllTipoRol(filters).subscribe((response) => {
            if (response.exito) {
                this.tipoRolList = response.output.filter((rol) => rol.activo).map((rol) => new TipoRolDTO().deserialize(rol));
              
            }
        });
    }

    private getMenuAccesos(vistas: FormGroup): void {
        const filters = new TablePaginatorSearch();
        filters.pageSize = 999999;
        filters.filter = { activo: true };
        this.menu.getAllMenusVista(filters).subscribe((response) => {
            if (response.exito) { 
                this.menuAccesos = response.output.map((menu) => new MenuDTO().deserialize(menu));           
                this.addCheckVistas(vistas);   
            }
        });
    }

    private getMenuVistaPermisos(vistas: FormGroup): void {
        const filters = new TablePaginatorSearch();
        filters.pageSize = 999999;
        filters.filter = { activo: true };
        this.menu.getAllMenusVistaPermisos(filters).subscribe((response) => {
            if (response.exito) {
                this.menuVistaPermiso = response.output.map((menu) => new MenuVistasPermisosDTO().deserialize(menu));         
                this.addCheckVistasPermisos(vistas);   
                //console.log(response.output);
                this.menuVistaPermiso = this.menuVistaPermiso.filter((menu) => menu.vistaPadre == null)
        // console.log("this.menuVistaPermiso " + this.menuVistaPermiso)
            }
        });
    }

    onCheckParent(event: MatCheckboxChange, idItem: number, idPadre: number){
        // console.log(event, idItem, idPadre);
        
        //for(var i=0; i < this.permisoVista.controls.length; i++){}
    }

   
    onCheckPermiso(event: MatCheckboxChange){
        if(event.checked){
            this.countPermisos++;
        }
        else{
            this.countPermisos--;
        }
    }



    onTipoRolChange(event: MatRadioChange): void { 
        //console.log(event.value);
        //this.validacionPorTipoRol(event.value);
    }







    validaSubmitUserRecord(): boolean{        
        return this.countPermisos == 0 || 
        this.error.length > 0 || (this.rolData && this.rolRecordForm.pristine) || this.rolRecordForm.invalid;
    }

    submit(): void{
        //console.log(this.permisoVista);
        if (this.rolRecordForm.invalid) {
            this.basicNotification.notif('error', 'Verifique que los campos sean correctos');
            return;
        }

        const rol: RolPermisosDTO = new RolPermisosDTO();

        //Datos del rol
        rol.nombre = this.rolRecordForm.get('nombre').value;
        rol.tipoRolId = this.rolRecordForm.get('tipoRol').value;
        rol.activo = this.rolRecordForm.get('activo').value;
        rol.isAllAreas = this.rolRecordForm.get('tipoRol').value == 1 ? this.rolRecordForm.get('allCampus').value : null;

        //this.agregarVistasAlRol(rol);
        this.agregarVistasPermisosAlRol(rol);
        

        if (this.rolData) {
            
            rol.id = this.rolData.data.id;
            rol.fechaCreacion = this.rolData.data.fechaCreacion;
            rol.usuarioCreacion = this.rolData.data.usuarioCreacion;
            rol.fechaModificacion = new Date();            
            rol.usuarioModificacion = this.rolVistaPermiso.userSession.id;
            rol.activo = this.estatusRecord;
            // console.log(rol);

            this.rolVistaPermiso.updateRol(rol).subscribe(() => {
                this.basicNotification.notif('success', 'Rol actualizado correctamente');
                this.ref.close(true);
            });
        } else {
            rol.fechaModificacion = rol.fechaCreacion = new Date();
            rol.usuarioModificacion = rol.usuarioCreacion = this.rolVistaPermiso.userSession.id;
           
            //  console.log(rol);
            //  return;
            this.rolVistaPermiso.creaRolVistaPermiso(rol).subscribe( () => {
                this.basicNotification.notif('success', 'Rol creado correctamente');
                this.ref.close(true);
            });
        }        
        //console.log(rol);        
    }

    changeStatusDescription($event: any): void {
        const estatusRecord: boolean = $event.checked ;
        this.rolRecordForm.get('activo').setValue(estatusRecord);
        this.estatusRecord = estatusRecord;
        this.estatus = estatusRecord ? "Activo":"Inactivo";
        
    }

    // agregarVistasAlRol(rol: RolPermisosDTO){
    //     //Se agregan las vistas de los checks seleccionados, los id de los checks se forman con: 'v' + (id de la vista)
    //     Object.keys(this.permisoVista.controls).forEach(key => {            
    //         //console.log(key, this.permisoVista.controls[key].value);
    //         if(this.permisoVista.controls[key].value){
    //             let id = parseInt(key.substring(1), 10);                
    //             rol.vistasId.push(id);
    //             this.agregarVistasPadreAlRol(rol, id);
    //         }
    //       });
    // }

    
    //Se agregan las vistas de los checks seleccionados, los id de los checks se forman con: 'vp' + (id de la vista) + '-' + (id del permiso)
    agregarVistasPermisosAlRol(rol: RolPermisosDTO){  
        //Se recorren todos los checks      
        Object.keys(this.vistaPermiso.controls).forEach(key => {            
            //console.log(key, this.vistaPermiso.controls[key].value);
            if(this.vistaPermiso.controls[key].value){
                let relacion = key.substring(2).split('-');    
                let vistaPermiso = new PermisoPorVistaDTO();
                vistaPermiso.vistaId = parseInt(relacion[0]);
                vistaPermiso.permisoId = parseInt(relacion[1]);  
                rol.permisos.push(vistaPermiso); 
                //rol.addPermisoPorVista(parseInt(relacion[0]), parseInt(relacion[1]) );
                rol.vistasId.push(vistaPermiso.vistaId);
                this.agregarVistasPadreAlRol(rol, vistaPermiso.vistaId);
            }
          });
    }

    agregarVistasPadreAlRol(rol: RolPermisosDTO, idRamaActual: number){
        if(this.arbolRolVista[idRamaActual].padre){
            if(!rol.vistasId.find(r => r == this.arbolRolVista[idRamaActual].padre)){
                rol.vistasId.push(this.arbolRolVista[idRamaActual].padre);
            }            
            this.agregarVistasPadreAlRol(rol, this.arbolRolVista[idRamaActual].padre);
        }
    }



}


