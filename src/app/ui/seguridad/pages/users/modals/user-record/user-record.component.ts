import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription, Subject, Observable } from 'rxjs';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MsalBroadcastService, MsalGuardConfiguration, MsalService, MSAL_GUARD_CONFIG } from '@azure/msal-angular';
import {
    CampusService,
    RegionsService,
    ResponsibilityAreasService,
    UsersService,
    InstitutionService,
} from 'src/app/core/services';
import { Alert, clearForm } from 'src/app/utils/helpers';
import {
    AreaResponsableDTOV1,
    CampusDTOV1,
    CatalogoUsuarioDTOV1,
    //ComponenteDTOV1,
    RegionDTOV1,
    TablePaginatorSearch,
    Vista,
    InstitucionDTOV1,
    AreaCentralDTO,
    SubareaCentralDTO,
    UsuarioSubareaCentralDTO,
    ProcesoEvaluacionDTO,
    RolProcesoEvaluacionDTO,
    UsuarioProcesoEvaluacionRolDTO,
    FiltroCampusInstitucionRegionDTO,
} from 'src/app/utils/models';
import { UserData } from './user-record.service';
//import { ModuleIdV2 } from 'src/app/utils/enums/modules-idV2';
//import { invokeInstruction } from '@angular/compiler/src/render3/view/util';
import { MatRadioChange } from '@angular/material/radio'
import { Router } from '@angular/router';
import { ModulesCatalogDTO } from 'src/app/utils/models/modules-catalog.dto';
import { TipoRolDTO } from 'src/app/utils/models/tipo-rol.dto';
import { TipoRolService } from 'src/app/core/services/api/tipoRol/tipoRol.service';
import { AreaCentralService } from 'src/app/core/services/api/areaCentral/areaCentral.service';
import { SubareaCentralService } from 'src/app/core/services/api/subareaCentral/subareaCentral.service';
import { ProcesoEvaluacionService } from 'src/app/core/services/api/procesoEvaluacion/procesoEvaluacion.service'
import { RolProcesoService } from 'src/app/core/services/api/rolProcesoEvaluacion/rolProcesoEvaluacion.service'
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';

export enum ModalTitle {
    NEW = 'Nuevo Usuario',
    EDIT = 'Editar Usuario',
    VIEW = 'Datos del Usuario',
}

export enum MensajesCampus {
    NA = '',
    EMPTY = 'Selecciona una institución',
    ERROR = 'Sin datos para las instituciones'
}

@Component({
    selector: 'app-user-record',
    templateUrl: './user-record.component.html',
    styleUrls: ['./user-record.component.scss'],
})
export class UserRecordComponent implements OnInit, OnDestroy{
    @ViewChild('input', { static: true })
    inputSearch: ElementRef;
    userRecordForm: FormGroup;
    title: ModalTitle;
    userExists: boolean;
    edit: boolean;
    subscription: Subscription;
    disabled: boolean;
    permission: boolean;
    //componentList: ComponenteDTOV1[];
    msgCampus: MensajesCampus;

    thisAccess: Vista;
    thisModule: ModulesCatalogDTO;
    permissions: boolean[];
    private _destroying$: Subject<void>;

    responsbilityAreaList: AreaResponsableDTOV1[] = [];
    institucionList: InstitucionDTOV1[] = [];
    regionsList: RegionDTOV1[] = [];
    campusList: CampusDTOV1[] = [];
    tipoRolList: TipoRolDTO[] = [];
    areaCentralList: AreaCentralDTO[] = [];
    subareaCentralList: SubareaCentralDTO[] = [];
    procesoEvaluacionList: ProcesoEvaluacionDTO[] = [];
    rolesProcesoEvaluacionList: RolProcesoEvaluacionDTO[] = [];
    rolesProcesoEvaluacionListPorTipo: RolProcesoEvaluacionDTO[] = [];

    filtroCampus: FiltroCampusInstitucionRegionDTO;
    
    procesoRolEliminadoEnUpdate: boolean;

    modoLectura: boolean;

    estatusRecord: boolean;
    estatus: string;


    constructor(
        @Inject(MAT_DIALOG_DATA)
        public readonly userData: UserData,

        private router: Router,

        private authService: MsalService,
        private broadcastService: MsalBroadcastService,

        private readonly formBuilder: FormBuilder,
        private readonly ref: MatDialogRef<never>,
        private users: UsersService,
        //private readonly profiles: ProfileService,
        private readonly campus: CampusService,
        private readonly responsibilityAreas: ResponsibilityAreasService,
        private readonly regions: RegionsService,
        //private readonly component: ComponentsService,
        private readonly instituciones: InstitutionService,
        private readonly tipoRol: TipoRolService,
        private readonly areaCentral: AreaCentralService,
        private readonly subareaCentral: SubareaCentralService,
        private readonly procesoEvaluaion: ProcesoEvaluacionService,
        private readonly rolProceso: RolProcesoService,
        private basicNotification: BasicNotification,
    ){
        this.title = ModalTitle.NEW;
        this.userExists = false;
        this.edit = null;
        this.disabled = null;
        this.permission = null;
        this.subscription = new Subscription();

        this.msgCampus = MensajesCampus.EMPTY;

        this.procesoRolEliminadoEnUpdate = false;

        this.modoLectura = this.userData && this.userData.modoLectura;

        this.filtroCampus = new FiltroCampusInstitucionRegionDTO();

        this.userRecordForm = this.formBuilder.group({
            id: [{ value: null, disabled: true }],
            correo: [{ value: null, disabled: this.modoLectura }, [Validators.required, Validators.email]],
            nombre: [{ value: null, disabled: this.modoLectura }, [Validators.required]],
            apellidos: [{ value: null, disabled: this.modoLectura }, [Validators.required]],
            instituciones: [{ value: null, disabled: this.modoLectura }, [Validators.required]],
            //regiones: [{ value: null, disabled: this.modoLectura }, [Validators.required]],
            tipoRol: [{ value: 1, disabled: this.modoLectura }, [Validators.required]],
            activo: [{ value: true, disabled: this.modoLectura }, []],
            //Para rol 1
            campuses: [{ value: null, disabled: this.modoLectura }, [Validators.required]],
            areaResponsables: [{ value: null, disabled: this.modoLectura }, [Validators.required]],
            //Para rol 2
            areaCentral: [{ value: null, disabled: this.modoLectura }, [Validators.required]],
            subareaCentral: [{ value: null, disabled: this.modoLectura }, [Validators.required]],
            //Arreglo de Procesos de Evaluacion Vs Rol
            procesosEvaluacionRol: this.formBuilder.array([]),

        });

        // if(this.userData && this.userData.data?.procesosEvaluacionRol?.length){            
        //     for(var i=0; i < this.userData.data.procesosEvaluacionRol.length; i++){                
        //         this.addProcesoRol();
        //     }
        // }
        // else{
        //     this.addProcesoRol();
        // }

        if(!this.userData || !this.userData.data?.rolesId?.length){
            this.addProcesoRol();
        }
        

        this.permissions = [false, false, false];
        this.getAllResponsibilityAreas();        
        //this.getAllCampus();
        this.getAllInstituciones();
        this.getAllTipoRol();
        this.getAllAreaCentral();
        // this.getAllSubareaCentral();
        //this.getAllProcesosEvaluacion();
        this.getAllRolesProcesosEvaluacion();       

    }

    get procesosEvaluacionRol(){  
        return this.userRecordForm.get('procesosEvaluacionRol') as FormArray;
    }
    addProcesoRol() {
        const perForm = this.formBuilder.group({
            //procesoEvaluacion:[{ value: null, disabled: this.modoLectura }, [Validators.required]],
            rol:[{ value: null, disabled: this.modoLectura }, [Validators.required]]
        });
      
        this.procesosEvaluacionRol.push(perForm);
      }
    deleteProcesoRol(index: number) {
        if(this.procesosEvaluacionRol.length > 1){
            this.procesosEvaluacionRol.removeAt(index);
            this.procesoRolEliminadoEnUpdate = true;
        }
    }
    clearProcesoRol(){
        while ( this.procesosEvaluacionRol.length > 0 ) {
            this.procesosEvaluacionRol.removeAt(0);
        } 
        this.procesoRolEliminadoEnUpdate = true;
    }

    ngAfterContentInit(){
        //console.log("ngAfterContentInit")
    }

    ngOnInit(): void {

        //Se elimina required para area y sub area central ya que por default el tipo rol es campus
        //Cuando se cambie de uno a otro se cambia dinamiamente
        this.userRecordForm.controls['areaCentral'].clearValidators();
        this.userRecordForm.controls['subareaCentral'].clearValidators();
        this.userRecordForm.controls['areaCentral'].clearValidators();
        this.userRecordForm.controls['subareaCentral'].clearValidators();

        this.title = this.userData ? (this.modoLectura ? ModalTitle.VIEW : ModalTitle.EDIT) : ModalTitle.NEW;

        this.estatusRecord = this.userData ? this.userData.data.activo : true;
        this.estatus = this.userData ? this.userData.data.activo? "Activo":"Inactivo" : "Activo";

        if(this.userData){
            
            this.userRecordForm.get('id').patchValue(this.userData.data.id);  
            this.userRecordForm.get('nombre').patchValue(this.userData.data.nombre);        
            this.userRecordForm.get('correo').patchValue(this.userData.data.correo);        
            this.userRecordForm.get('apellidos').patchValue(this.userData.data.apellidos);
            this.userRecordForm.get('tipoRol').patchValue(this.userData.data.tipoRolId);
            this.userRecordForm.get('activo').patchValue(this.userData.data.activo);

            this.validacionPorTipoRol(this.userData.data.tipoRolId);
        }
        this.trackingStatusForm();
        
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    submit(): void {
        this.userRecordForm.markAllAsTouched();
        // console.log("this.userRecordForm.invalid " + this.userRecordForm.invalid)
        // const invalid = [];
        // const controls = this.userRecordForm.controls;
        // for (const name in controls) {
        //     if (controls[name].invalid) {
        //         console.log("name " + name)
        //         invalid.push(name);
        //     }
        // }

        if (this.userRecordForm.invalid) {
            this.basicNotification.notif('error', 'Verifique que los campos sean correctos');
            return;
        }


        clearForm(this.userRecordForm);
        const tmp = this.userRecordForm.getRawValue();
        const user: CatalogoUsuarioDTOV1 = new CatalogoUsuarioDTOV1();

        user.nombre = this.userRecordForm.get('nombre').value;
        user.correo = this.userRecordForm.get('correo').value;        
        user.apellidos = this.userRecordForm.get('apellidos').value;
        user.tipoRolId = this.userRecordForm.get('tipoRol').value;
        user.activo = this.userRecordForm.get('activo').value;
        
        if(user.tipoRolId == 1){
            user.campusId = this.userRecordForm.get('campuses').value.map((item: CampusDTOV1) => item.id);
            user.areasResponsablesId = this.userRecordForm.get('areaResponsables').value.map((item: AreaResponsableDTOV1) => item.id);
            user.institucionesId = this.userRecordForm.get('instituciones').value.map((item: InstitucionDTOV1) => item.id);
            //user.regionesId = this.userRecordForm.get('regiones').value.map((item: RegionDTOV1) => item.id);
            user.areasCentralesId = [];
            user.subAreasCentrales = [];
        }
        else if(user.tipoRolId == 2){
            user.campusId = [];
            user.areasResponsablesId = [];
            user.institucionesId = [];
            user.regionesId = [];
            user.areasCentralesId = this.userRecordForm.get('areaCentral').value.map((item: AreaCentralDTO) => item.id);
            user.subAreasCentrales = this.userRecordForm.get('subareaCentral').value.map((i: SubareaCentralDTO) => {
                                        return <UsuarioSubareaCentralDTO>{subAreaCentralId: i.id, areaCentralId: i.areaCentralId}
                                    });
        }

        user.procesosEvaluacionRol = [];
         for(var i=0; i<this.procesosEvaluacionRol.controls.length; i++){
            //  user.procesosEvaluacionRol.push(new UsuarioProcesoEvaluacionRolDTO());
            //  //user.procesosEvaluacionRol[i].procesoEvaluacionId = this.procesosEvaluacionRol.controls[i].get('procesoEvaluacion').value.id;
            //  user.procesosEvaluacionRol[i].rolId = this.procesosEvaluacionRol.controls[i].get('rol').value.id;

            if(!user.rolesId.includes(this.procesosEvaluacionRol.controls[i].get('rol').value.id))
                user.rolesId.push(this.procesosEvaluacionRol.controls[i].get('rol').value.id);
         }

        
        if (this.userData) {
            
            user.id = this.userData.data.id;
            user.fechaCreacion = this.userData.data.fechaCreacion;
            user.usuarioCreacion = this.userData.data.usuarioCreacion;
            user.fechaModificacion = new Date();            
            user.usuarioModificacion = this.users.userSession.id;
            user.activo = this.estatusRecord;

            //console.log("user", user);
            
            this.users.updateUser(user).subscribe(() => {
                this.basicNotification.notif('success', 'Usuario actualizado correctamente');
                this.ref.close(true);
            });
        } else {
            user.fechaCreacion = new Date();
            user.usuarioCreacion = this.users.userSession.id;
            user.fechaModificacion = user.fechaCreacion;
            user.usuarioModificacion = user.usuarioCreacion;
            this.users.createUser(user).subscribe(() => {
                this.basicNotification.notif('success', 'Usuario creado correctamente');
                this.ref.close(true);
            });
        }
    }

    closeModalByConfimation(): void {
        if (!this.edit || !this.userRecordForm.dirty) {
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

    changeStatusDescription($event: any): void {
        const estatusRecord: boolean = $event.checked ;
        this.userRecordForm.get('activo').setValue(estatusRecord);
        this.estatusRecord = estatusRecord;
        this.estatus = estatusRecord ? "Activo":"Inactivo";
        
    }

    private getAllInstituciones(): void {
        const filters = new TablePaginatorSearch();
        filters.pageSize = 999999;
        filters.filter= {
            activo: true 

        }
        this.instituciones.getAllInstitutions(filters).subscribe((response) => {
            if(response.exito){
                this.institucionList = response.output.map((inst) => new InstitucionDTOV1().deserialize(inst));
                if(this.userData){
                    var list = this.institucionList.filter( (item: InstitucionDTOV1) => this.userData.data.institucionesId?.includes(item.id) );
                    this.userRecordForm.get('instituciones').patchValue(list);
                    console.log(this.userData.data.campusId);
                    if(this.userData.data.campusId?.length)
                        this.getFilteredCampus();
                }
                //this.getAllRegions();
                this.getAllResponsibilityAreas();
            }
        });
    }

    /*
    private getAllRegions(): void {
        const filters = new TablePaginatorSearch();
        filters.pageSize = 999999;
        filters.filter= {
            activo: true 

        }
        this.regions.getAllRegions(filters).subscribe((response) => {
            if (response.exito) {
                this.regionsList = response.output.map((region) => new RegionDTOV1().deserialize(region));
                if(this.userData){
                    var list = this.regionsList.filter( (item: RegionDTOV1) => this.userData.data.regionesId.includes(item.id) );
                    //this.userRecordForm.get('regiones').patchValue(list);
                    this.getFilteredCampus(true);
                }
            }
        });
    }
    */

    /*private getAllCampus(cargaUnaVez?: boolean): void{        
        this.campus.getCampusPorInstitucionRegion(this.filtroCampus).subscribe((response)=>{
            if (response.exito) {
                this.campusList = response.output.map((campus) => new CampusDTOV1().deserialize(campus));

                if(this.campusList.length)
                    this.msgCampus = MensajesCampus.NA;
                else
                    this.msgCampus = MensajesCampus.ERROR;

                if(this.userRecordForm.get('campuses').value){
                    var campus = this.userRecordForm.get('campuses').value.filter((f:CampusDTOV1) => 
                        this.campusList.map(c => c.id).includes(f.id) 
                    );
                    this.userRecordForm.get('campuses').setValue(campus); 
                }

                if(cargaUnaVez && this.userData){
                    var list = this.campusList.filter( (item: CampusDTOV1) => this.userData.data.campusId.includes(item.id) ); 
                    this.userRecordForm.get('campuses').setValue(list);   
                }
            }
        });
    }*/

    
    private getAllCampus(insIds: any): void{
        const filters = new TablePaginatorSearch();
        filters.pageSize = 999999;
        this.campus.getAllCampus(filters).subscribe((response) => {            
            if(response.isSuccess){
                const campusList = response.data.filter((campus) => campus.activo).map((campus) => new CampusDTOV1().deserialize(campus));  
                console.log("campus",campusList);              
                this.campusList = campusList.filter(x => insIds.includes(x.institucionId));
                if(this.userData && this.userData.data.campusId?.length){
                    var list = this.campusList.filter( (item: CampusDTOV1) => this.userData.data.campusId.includes(item.id) );
                    this.userRecordForm.get('campuses').patchValue(list);
                }
            }
        });
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

    private getAllAreaCentral():void{
        const filters = new TablePaginatorSearch();
        filters.pageSize = 999999;
        this.areaCentral.getAllAreaCentral(filters).subscribe((response) => {
            if (response.exito) {
                this.areaCentralList = response.output.filter((area) => area.activo).map((area) => new AreaCentralDTO().deserialize(area));
                if(this.userData && this.userData.data.areasCentralesId?.length){                    
                    var list = this.areaCentralList.filter( (item: AreaCentralDTO) => this.userData.data.areasCentralesId.includes(item.id) );
                    this.userRecordForm.get('areaCentral').patchValue(list);
                    this.getFilteredSubareaCentral();
                }
            }
        });
    }

    // private getAllSubareaCentral():void{
    //     const filters = new TablePaginatorSearch();
    //     filters.pageSize = 999999;
    //     this.subareaCentral.getAllSubareaCentral(filters).subscribe((response) => {
    //         if (response.exito) {
    //             this.subareaCentralList = response.output.filter((area) => area.activo).map((area) => new SubareaCentralDTO().deserialize(area));
    //             if(this.userData){
    //                 var list = this.subareaCentralList.filter( (item: SubareaCentralDTO) => 
    //                     this.userData.data.subAreasCentrales.find((sa: UsuarioSubareaCentralDTO) => 
    //                         sa.areaCentralId == item.areaCentralId && sa.subAreaCentralId == item.id));
    //                 this.userRecordForm.get('subareaCentral').patchValue(list);
    //             }
    //         }
    //     });
    // }

    /*private getAllProcesosEvaluacion(): void {
        const filters = new TablePaginatorSearch();
        filters.pageSize = 999999;
        this.procesoEvaluaion.getAllProcesosEvaluacion(filters).subscribe((response) => {
            if (response.exito) {
                this.procesoEvaluacionList = response.output.filter((p) => p.activo).map((p) => new ProcesoEvaluacionDTO().deserialize(p));
                if(this.userData){
                    for(var i=0; i < this.userData.data.procesosEvaluacionRol.length; i++){
                        let item = this.procesoEvaluacionList.find(item=>item.id == this.userData.data.procesosEvaluacionRol[i].procesoEvaluacionId);
                        //this.procesosEvaluacionRol.controls[i].get("procesoEvaluacion").patchValue(item);
                    }
                }
            }
        });
    }*/

    private getAllRolesProcesosEvaluacion(): void {
        const filters = new TablePaginatorSearch();
        filters.pageSize = 999999;
        this.rolProceso.getAllRolesProcesoEvaluacion(filters).subscribe((response) => {
            if (response.exito) {
                this.rolesProcesoEvaluacionList = response.output.filter((rol) => rol.activo).map((rol) => new RolProcesoEvaluacionDTO().deserialize(rol));
                
                if(this.userData){
                    for(var i=0; i < this.userData.data.rolesId?.length; i++){
                        let item = this.rolesProcesoEvaluacionList.find(item=>item.id == this.userData.data.rolesId[i]);                        
                        this.addProcesoRol();
                        this.procesosEvaluacionRol.controls[i].get("rol").patchValue(item);                        
                    }
                    this.filtraRolesPorTipo(this.userData.data.tipoRolId);
                 
                }
                else{
                    this.filtraRolesPorTipo(1); 
                }
            }
        });
    }

    filtraRolesPorTipo(tipoRol: Number) {
        this.rolesProcesoEvaluacionListPorTipo = this.rolesProcesoEvaluacionList.filter(item => item.tipoRolId == tipoRol);
        //console.log(this.rolesProcesoEvaluacionListPorTipo,this.rolesProcesoEvaluacionList );
    }

    
    private getAllResponsibilityAreas(): void {
        const filters = new TablePaginatorSearch();
        filters.pageSize = 999999;
        filters.filter = {};
        filters.filter= {
            institucionesId: this.userRecordForm.get('instituciones').value?.map((item: InstitucionDTOV1) => item.id),
            activo: true 
        }
        this.responsbilityAreaList = [];
        this.responsibilityAreas.getAllResponsibilityAreas(filters).subscribe((response) => {
            if (response.exito) {
                this.responsbilityAreaList = response.output.map((areaResponsable) => new AreaResponsableDTOV1().deserialize(areaResponsable));
                if(this.userData && this.userData.data.areasResponsablesId?.length){
                    var list = this.responsbilityAreaList.filter( (item: AreaResponsableDTOV1) => this.userData.data.areasResponsablesId.includes(item.id) );
                    this.userRecordForm.get('areaResponsables').patchValue(list);
                }
            }
        });
    }

    getFilteredCampus(){
        this.getAllResponsibilityAreas();
        this.filtroCampus.institucionesId = this.userRecordForm.get('instituciones').value?.map((item: InstitucionDTOV1) => item.id);
        //this.filtroCampus.regionesId = this.userRecordForm.get('regiones').value?.map((item: RegionDTOV1) => item.id);
        
        this.campusList = [];
                
        console.log("this.filtroCampus.institucionesId",this.filtroCampus.institucionesId);
        if(this.filtroCampus.institucionesId && this.filtroCampus.institucionesId?.length){
            console.log('getAllCampus', this.filtroCampus.institucionesId);
            this.getAllCampus(this.filtroCampus.institucionesId);
        }
        else{
            this.userRecordForm.get('campuses').reset(); 
            this.msgCampus = MensajesCampus.EMPTY;
        }
    }

    getFilteredSubareaCentral(){
        const filters = new TablePaginatorSearch();
        filters.pageSize = 999999;
        filters.filter = {};
        filters.filter.areaCentralesId = this.userRecordForm.get('areaCentral').value?.map((item: AreaCentralDTO) => item.id);
        this.subareaCentral.getByAreaCentral(filters).subscribe((response) => {
            if (response.exito) {
                this.subareaCentralList = response.output.filter((area) => area.activo).map((area) => new SubareaCentralDTO().deserialize(area));
                if(this.userData &&  this.userData.data.subAreasCentralesId?.length){
                    var list = this.subareaCentralList.filter( (item: SubareaCentralDTO) => 
                        this.userData.data.subAreasCentralesId.includes(item.id));
                        this.userRecordForm.get('subareaCentral').patchValue(list);
                }
            }
        })   
    }

    

    hasMsgCampus(){
        return this.msgCampus != MensajesCampus.NA
    }

    onTipoRolChange(event: MatRadioChange): void { 
        this.validacionPorTipoRol(event.value);
        this.clearProcesoRol();
        this.addProcesoRol();
        this.filtraRolesPorTipo(event.value);
    }

    validacionPorTipoRol(value: number){
        //Se cambain de forma dinammica los Validators.required
        //Para el rol 1 se requieren de campuses y areaResponsables
        //Para el rol 2 se requieren de areaCentral y subareaCentral
        if(value == 1){
            this.userRecordForm.controls['campuses'].setValidators([Validators.required]);
            this.userRecordForm.controls['areaResponsables'].setValidators([Validators.required]);
            this.userRecordForm.controls['instituciones'].setValidators([Validators.required]);
            
            this.userRecordForm.controls['areaCentral'].clearValidators();
            this.userRecordForm.controls['subareaCentral'].clearValidators();
        }
        else if(value == 2){
            this.userRecordForm.controls['campuses'].clearValidators();
            this.userRecordForm.controls['areaResponsables'].clearValidators();
            this.userRecordForm.controls['instituciones'].clearValidators();
            
            this.userRecordForm.controls['areaCentral'].setValidators([Validators.required]);
            this.userRecordForm.controls['subareaCentral'].setValidators([Validators.required]);
        }
        this.userRecordForm.controls['campuses'].updateValueAndValidity();
        this.userRecordForm.controls['areaResponsables'].updateValueAndValidity();

        this.userRecordForm.controls['areaCentral'].updateValueAndValidity();
        this.userRecordForm.controls['subareaCentral'].updateValueAndValidity();

        this.userRecordForm.controls['instituciones'].updateValueAndValidity();
        

    }

    compareItems(i1: any, i2: any) {
        return i1 && i2 && i1.id === i2.id;
    }

    private setPermissions(): void {
        if(this.users.userSession.modulos){
            this.thisModule = this.users.userSession.modulos.find(
                (module) => module.url.indexOf(this.router.url.slice(1).split('/')[1]) >= 0
            );
        }

        if(this.users.userSession.vistas){
            this.thisAccess = this.users.userSession.vistas.find((element) => element.vistaId == this.thisModule.id);
        }
        if (
            this.thisAccess &&
            this.thisAccess.permisos &&
            this.thisAccess.permisos.length &&
            this.thisAccess.permisos.length > 0
        ) {
            // consulta
            this.thisAccess.permisos.split('').forEach((element, index) => {
                if (element == '*') {
                    this.permissions[0] = true;
                    this.permissions[1] = true;
                    this.permissions[2] = true;
                }
                if (element == 'C') this.permissions[0] = true;
                if (element == 'D') this.permissions[1] = true;
                if (element == 'E') this.permissions[2] = true;
            });
        }
    }

    checkPermission(p: number): boolean {
        return this.permissions[p];
    }

    private trackingStatusForm(): void {
        this.subscription.add(this.userRecordForm.statusChanges.subscribe(() => (this.edit = true)));
    }

    validaSubmitUserRecord(): boolean{        
        return (this.userData && this.userRecordForm.pristine && !this.procesoRolEliminadoEnUpdate) || this.userRecordForm.invalid;
    }


    
      isChecked(nameModel: string, values: any[]): boolean {
         var model = this.userRecordForm.get(nameModel);
         return model.value && values.length
           && model.value.length === values.length;
       }
    
      isIndeterminate(nameModel: string, values: any[]): boolean {
        var model = this.userRecordForm.get(nameModel);
        var indeterminado = model.value && values.length && model.value.length && model.value.length < values.length;
        return indeterminado === true;
      }
    
      toggleSelection(change: MatCheckboxChange, nameModel: string, values: any[]): void {
        var model = this.userRecordForm.get(nameModel);
        if (change.checked) {
          model.setValue(values);
        } else {
          model.setValue([]);
        }
      }

      onSelectionChange(campo: any) {
        
      }

}
