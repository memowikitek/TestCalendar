import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormArray, FormGroup, Validators, FormRecord } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ValidatorService } from 'src/app/shared/validators';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';
import { Alert, clearForm } from 'src/app/utils/helpers';
import { Subscription, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { NotiData } from './notifications-settings.service';
import { NotificacionesAllDTO, CicloEvaDTOV1, RolProcesoEvaluacionDTO, CampusDTOV1, CatalogoUsuarioDTOV1, TablePaginatorSearch } from 'src/app/utils/models';
import { NotificationsService, EvaluationCycleService, CampusService, ResponsibilityAreasService, UsersService } from 'src/app/core/services';
import { MatSelectChange } from '@angular/material/select';
import { RolProcesoService } from 'src/app/core/services/api/rolProcesoEvaluacion/rolProcesoEvaluacion.service'
import Quill from 'quill';
import BlotFormatter, { DeleteAction, ImageSpec, ResizeAction } from 'quill-blot-formatter';
import { QuillModule } from 'ngx-quill';

Quill.register('modules/blotFormatter', BlotFormatter);

class CustomImageSpec extends ImageSpec {
  getActions() {
    return [ResizeAction, DeleteAction];
  }
}

export interface User {
  id: number;
  name: string;
}

@Component({
  selector: 'app-notifications-settings-record',
  templateUrl: './notifications-settings-record.component.html',
  styleUrls: ['./notifications-settings-record.component.scss']
})

export class NotificationsSettingsRecordComponent implements OnInit {
  pageIndex: number;
  pageSize: number;
  length: number;
  filters: TablePaginatorSearch;
  quillDisplayModuleOptions: any;
  quillEditorModuleOptions: any;
  condicionCalidad: string;
  RecordForm: FormGroup;
  title: string;
  description: string;
  edit: boolean;
  subscription: Subscription;
  showBuscar: boolean = false;
  showVista: boolean = false;
  usuariosList: CatalogoUsuarioDTOV1[];
  //Listas
  listaCampus: any;
  listaAR: any;
  listaRoles: any;
  proceso: any;
  //ciclos: any[];
  listaCiclos: any[];
  //Usuarios
  myControl = new FormControl<string | User>('');
  options: User[];
  filteredOptions: Observable<User[]>;
  usersLoad: any[] = [];
  usersDel: any[] = [];
  inputValue: any;
  msj: any = null;
  showUsers: boolean = false;
  activeBtn: boolean = false;
  hideBusqueda: boolean = true;
  hideBusqueda2: boolean = true;
  usuariosIdErr: boolean = false;
  rolesIdErr: boolean = false;
  campusesIdErr: boolean = false;
  areasRespIdErr: boolean = false;
  mensajeErr: boolean = false;
  dataId: any;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public readonly interfaceData: NotiData,
    private readonly formBuilder: FormBuilder,
    private readonly ref: MatDialogRef<never>,
    private readonly validator: ValidatorService,
    private readonly NotiService: NotificationsService,
    private readonly ciclosS: EvaluationCycleService,
    private readonly rolesS: RolProcesoService,
    private readonly campusS: CampusService,
    private readonly areasS: ResponsibilityAreasService,
    private basicNotification: BasicNotification,
    private users: UsersService,
  ) {
    this.RecordForm = this.formBuilder.group({
      usuariosId: [null],
      cicloEvaluacionId: [null, Validators.required],
      rolesId: [null, Validators.required],
      campusesId: [null, Validators.required],
      areasResponsablesId: [null, Validators.required],
      titulo: [null, [Validators.required, Validators.maxLength(75), this.validator.noWhitespace]],
      requisitoCondicion: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.title = this.interfaceData ? this.interfaceData.data.duplicar ? 'Duplicar' : this.interfaceData.data.esVista ? 'Consultar' : 'Editar' : 'Nueva notificación';
    if (this.interfaceData) { console.log(this.interfaceData.data);
      this.activeBtn = true;
      this.showVista = this.interfaceData.data.esVista;
      this.hideBusqueda = !this.interfaceData.data.esVista;
      this.hideBusqueda2 = !this.interfaceData.data.duplicar;
      const { usuariosId, cicloEvaluacionId, rolesId, campusesId, areasResponsablesId, titulo, mensaje } = this.interfaceData.data;
      this.RecordForm.get('usuariosId').patchValue(usuariosId);
      this.RecordForm.get('cicloEvaluacionId').patchValue(cicloEvaluacionId);
      this.RecordForm.get('rolesId').patchValue(rolesId);
      this.RecordForm.get('campusesId').patchValue(campusesId);
      this.RecordForm.get('areasResponsablesId').patchValue(areasResponsablesId);
      this.RecordForm.get('titulo').patchValue(titulo);
      this.RecordForm.get('requisitoCondicion').patchValue(mensaje);
      //Inhabilitar
      if (this.interfaceData.data.esVista) {
        //this.RecordForm.get('usuariosId').disable();
        //this.RecordForm.get('cicloEvaluacionId').disable();
        //this.RecordForm.get('rolesId').disable();
        //this.RecordForm.get('campusesId').disable();
        //this.RecordForm.get('areasResponsablesId').disable();
        this.RecordForm.get('titulo').disable();
        this.RecordForm.get('requisitoCondicion').disable();
      }
      if (cicloEvaluacionId) { this.selectionCicloId(cicloEvaluacionId); }
    }
    //
    this.controlBars();
    this.catalogos();
    //
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filter(name as string) : this.options.slice();
      }),
    );

  }

  contentChanged(contentChangedEvent: any) {
    const { text } = contentChangedEvent;
    this.condicionCalidad = contentChangedEvent.html;
    if (text != '') { 
      const n = contentChangedEvent.text.length-1;//console.log(n);
      if (n > 200) {
        const {html} = contentChangedEvent;
        this.RecordForm.get('requisitoCondicion').patchValue(html.substr(0, 203));
      }
    }
  }

  controlBars() {
    this.quillDisplayModuleOptions = { toolbar: false };
    this.quillEditorModuleOptions = {
      blotFormatter: {
        specs: [CustomImageSpec],
      },
      syntax: false, // Include syntax module
      toolbar: [
        ['bold', 'italic', 'underline'], // toggled buttons
      ],
    };
  }

  submit() {
    this.RecordForm.markAllAsTouched();
    /*if (this.RecordForm.invalid) {
      console.log('this.RecordForm.invalid:', this.RecordForm.invalid);
      this.basicNotification.notif("warning", "Verifique que los campos sean correctos");
      return;
    }*/
    clearForm(this.RecordForm);
    const form = this.RecordForm.getRawValue(); //console.log(form);
    const model: NotificacionesAllDTO = new NotificacionesAllDTO().deserialize(form);
    const idUser = JSON.parse(localStorage.getItem('session'));
    const validarForm = this.validarForm(form);
    if (validarForm) { return; }
    //Default
    model.cicloEvaluacionId = form.cicloEvaluacionId;
    model.titulo = form.titulo;
    model.mensaje = form.requisitoCondicion;
    //Destinatarios
    model.usuariosId = form.usuariosId;
    model.rolesId = form.rolesId;
    model.campusesId = form.campusesId;
    model.areasResponsablesId = form.areasResponsablesId;
    if (this.interfaceData && this.interfaceData.data.id && !this.interfaceData.data.duplicar) {
      console.log('Editar');
      //Modo Editar
      model.fechaCreacion = form.fechaCreacion;
      model.usuarioCreacion = form.usuarioCreacion;
      model.id = this.interfaceData.data.id;
      console.log(model);
      this.NotiService.updateNotification(model).subscribe((response) => {
        if (response.exito) {
          console.log('Editado', response);
          this.basicNotification.notif("success", 'Notificación editada correctamente');
          //this.ref.close(true);
        }
      });
    } else {
      console.log('Guardar');
      //Modo Guardar
      model.fechaCreacion = new Date();
      model.usuarioCreacion = idUser.id;
      console.log('model:', model);
      this.NotiService.createNotification(model).subscribe((response) => {
        if (response.exito) {
          console.log('Guardado', response);
          this.basicNotification.notif("success", 'Notificación guardada correctamente');
          this.activeBtn = true;
          //this.ref.close(true);
          this.dataId = response.id;
        }
      });
    }
  }

  sendAction(): void {
    Alert.confirm('Enviar notificación', '¿Desea enviar la notificación?').subscribe((result) => {
      if (!result || !result.isConfirmed) { return; }
      //ENVIO
      clearForm(this.RecordForm);
      const form = this.RecordForm.getRawValue(); //console.log('form', form, this.dataId);
      const model: NotificacionesAllDTO = new NotificacionesAllDTO().deserialize(form);
      const idUser = JSON.parse(localStorage.getItem('session'));
      const validarForm = this.validarForm(form);
      if (validarForm) { return; }
      if ((this.interfaceData && this.interfaceData.data.id) || this.dataId) {
        console.log('Enviar');
        //Modo Envio
        model.fechaEnvio = new Date();
        model.usuarioEnvio = idUser.id;
        //Default
        model.id = (this.dataId) ? this.dataId : this.interfaceData.data.id;
        model.cicloEvaluacionId = form.cicloEvaluacionId;
        model.titulo = form.titulo;
        model.mensaje = form.requisitoCondicion;
        //Destinatarios
        model.usuariosId = form.usuariosId;
        model.rolesId = form.rolesId;
        model.campusesId = form.campusesId;
        model.areasResponsablesId = form.areasResponsablesId;
        console.log(model);
        this.NotiService.postSendNotification(model).subscribe((response) => {
          if (response.exito) {
            console.log('Enviado', response);
            this.basicNotification.notif("success", 'Notificación enviada correctamente');
            this.ref.close(result);
          }
        });
      }
    });
  }

  validarForm(form: any) {
    const { titulo, cicloEvaluacionId, requisitoCondicion, usuariosId, rolesId, campusesId, areasResponsablesId } = form; //console.log(titulo, cicloEvaluacionId, requisitoCondicion);
    this.mensajeErr = requisitoCondicion == null;
    let msj = (!titulo || !cicloEvaluacionId || !requisitoCondicion) ? "Verifique que los campos (titulo o cicloEvaluacionId o requisitoCondicion) sean correctos y que no esten vacios." : null;
    //if (!titulo || !cicloEvaluacionId || !requisitoCondicion) { console.log(msj); }
    if (this.showBuscar) {
      this.usuariosIdErr = usuariosId == null || usuariosId.length == 0;
      msj = (usuariosId == null || usuariosId.length == 0) ? "Elije un usuario o más usuarios" : msj;//if (usuariosId == null) {console.log(msj);}
    } else {
      this.rolesIdErr = rolesId == null || rolesId.length == 0; 
      this.campusesIdErr = campusesId == null || campusesId.length == 0;
      this.areasRespIdErr = areasResponsablesId == null || areasResponsablesId.length == 0;
      msj = ((rolesId == null || rolesId.length == 0) || (campusesId == null || campusesId.length == 0) || (areasResponsablesId == null || areasResponsablesId.length == 0)) ? "Elije un roles, campus y áreas responsables" : msj;//if (rolesId == null || campusesId == null || areasResponsablesId == null) {console.log(msj);}
    }
    console.warn(msj);
    return msj;
  }

  closeModalByConfimation(): void {
    Alert.confirm('Alerta', '¿Está seguro de que desea salir? Los datos ingresados no serán guardados.').subscribe((result) => {
      if (!result || !result.isConfirmed) { return; }
      this.ref.close(result);
    });
  }

  closeModal(): void {
    this.ref.close(true);
  }

  //BUSCAR USUARIO
  private getAllUsers(): void {
    let filter = new TablePaginatorSearch();
    filter.filter = { activo: true, };
    filter.pageSize = 999999;
    filter.pageNumber = 0;
    const usuarios: any = [];
    this.users.getAllUsers(filter).subscribe((response) => {
      if (response.output) {
        this.usuariosList = response.output.map((region) => new CatalogoUsuarioDTOV1().deserialize(region)); //console.log(this.usuariosList);
        for (let i = 0; i < this.usuariosList.length; i++) {
          const { id, nombre, apellidos } = this.usuariosList[i];
          usuarios.push({ id, name: nombre + ' ' + apellidos });
        }
        this.options = usuarios; //console.log('Usuarios', usuarios);        
        if (this.interfaceData) {
          const { usuariosId } = this.interfaceData.data; //console.log(usuariosId);
          this.usersLoad = usuarios.filter((item: { id: any; }) => usuariosId.includes(item.id)); //console.log(this.usersLoad);
          this.showUsers = (this.usersLoad.length != 0);
          this.showBuscar = usuariosId.length != 0 && (this.interfaceData.data.esVista || this.interfaceData.data.duplicar);
        }
      }
    });
  }

  cleanName() {
    this.myControl.setValue(null);
  }

  addUser(): void {
    this.inputValue = this.myControl.value; //console.log(this.inputValue);
    if(this.inputValue!= ''){
      const q = this.usersLoad.filter((x) => x.name === this.inputValue.name); //console.log('q',q);
      if (q.length == 0) {
        this.usersLoad.push(this.inputValue); //console.log('Almacenado', this.usersLoad);
        this.msj = '';
      } else {
        this.msj = 'Usuario ' + this.inputValue.name + ' ya esta agregado.';
        console.warn(this.msj);
      }
      //if (this.usersLoad.length != 0) { this.showUsers = true; }
      this.usuariosIdErr = false;
      this.totalUsers();
    }
  }

  delUser(id: any) {
    //this.usersDel.push(id);
    //const res = this.usersLoad.filter(x => !this.usersDel.includes(x.id));
    const res = this.usersLoad.filter(x => x.id != id);
    this.usersLoad = res; //console.log(this.usersLoad);
    //this.usersDel=[];
    this.totalUsers();
  }

  totalUsers() {
    const Ids: any = [];
    for (let i = 0; i < this.usersLoad.length; i++) {
      const { id } = this.usersLoad[i];
      Ids.push(id);
    }//console.log('Usuarios restantes:', Ids);
    //if(this.usersLoad.length == 0){this.usersDel=[]}
    this.showUsers = (this.usersLoad.length != 0);
    this.RecordForm.get('usuariosId').patchValue(Ids);
  }

  btnBuscar(b: boolean) {
    this.showBuscar = b;
    this.showUsers = false;
    this.usersLoad = [];
  }

  displayFn(user: User): string {
    return user && user.name ? user.name : '';
  }

  private _filter(name: string): User[] {
    const filterValue = name.toLowerCase();
    return this.options.filter(option => option.name.toLowerCase().includes(filterValue));
  }
  //

  fechaActual() {
    let date = new Date();
    let day = date.getDate();
    let dd = (day < 10) ? `0${day}` : day;
    let month = date.getMonth() + 1;
    let mm = (month < 10) ? `0${month}` : month;
    let yy = date.getFullYear();
    let fecha = `${yy}-${mm}-${dd}`;
    return fecha;
  }

  //CATALOGOS
  private catalogos(): void {
    this.getAllUsers();
    this.getProcess();
    this.getAllCycles();
    this.getAllRoles();
  }

  getProcess() {
    const process = JSON.parse(localStorage.getItem('process')); //console.log(process);
    if (process) {
      const { rol, proceso } = process;
      this.proceso = proceso;
    }
  }

  private getAllCycles(): void {
    let filters = new TablePaginatorSearch();
    filters.filter = {
      procesoEvaluacion: this.proceso,
      activo: true
    };
    filters.pageSize = 0;
    filters.pageNumber = 0;
    const today = this.fechaActual();
    /*this.ciclosS.getCEEvaluacion(filters, today).subscribe((response) => {
      if (response.output) {
        const data = response.output.map((res) => new CicloEvaDTOV1().deserialize(res));
        this.ciclos = data; console.log('Ciclos:', this.ciclos);
      }
    });*/
    this.ciclosS.getCEEvaluacionCatalogo(filters, today).subscribe((response) => {
      if (response.output) {
        const data = response.output.map((res) => new CicloEvaDTOV1().deserialize(res));
        this.listaCiclos = data; //console.log('ListaCiclos:', this.listaCiclos);
      }
    });
  }

  getAllRoles() {
    const filters = new TablePaginatorSearch();
    filters.pageSize = 999999;
    this.rolesS.getAllRolesProcesoEvaluacion(filters).subscribe((response) => {
      if (response.exito) {
        const data = response.output.filter((rol) => rol.activo).map((rol) => new RolProcesoEvaluacionDTO().deserialize(rol));
        this.listaRoles = data; //console.log('ListasRoles:', this.listaRoles);
      }
    });
  }

  getCatCampusIds(Ids: any) {
    this.NotiService.getCampusIds(Ids).subscribe((response) => {
      if (response.output) {
        const data = response.output.filter((x: any) => x.activo);
        this.listaCampus = data; //console.log('ListasCampus:', this.listaCampus);
      }
    });
  }

  getCatAreaResIds(Ids: any) {
    this.NotiService.getAreaResponsableIds(Ids).subscribe((response) => {
      if (response.output) {
        const data = response.output.filter((x: any) => x.activo);
        this.listaAR = data; //console.log('ListasAreaResp:', this.listaAR);
      }
    });
  }

  selectionCicloId(id: any): void {
    const cicloId = [id]; //console.log(cicloId);
    this.getCatCampusIds(cicloId);
    this.getCatAreaResIds(cicloId);
  }

  onSelectionChange(event: MatSelectChange, campo: any) {
    let val = event.value; //console.log('Event.value', val);
    if (campo === 'rolesId') {
      if (val.length <= this.listaRoles.length) {
        if (val[0] === 0) {
          val.splice(0, 1);
          this.RecordForm.controls.rolesId.patchValue(val);
        }
      }
    }
    if (campo === 'campusesId') {
      if (val.length <= this.listaCampus.length) {
        if (val[0] === 0) {
          val.splice(0, 1);
          this.RecordForm.controls.campusesId.patchValue(val);
        }
      }
    }
    if (campo === 'areasResponsablesId') {
      if (val.length <= this.listaAR.length) {
        if (val[0] === 0) {
          val.splice(0, 1);
          this.RecordForm.controls.areasResponsablesId.patchValue(val);
        }
      }
    }
    //console.log(val);
  }

  toggleAllSelection(campo: any) {
    if (campo === 'rolesId') {
      const allSelected = this.RecordForm.controls.rolesId.value.length === this.listaRoles.length; //console.log(this.RecordForm.controls.rolesId.value.length,this.listaRoles.length,allSelected);
      this.RecordForm.controls.rolesId.patchValue(allSelected ? [] : [0, ...this.listaRoles.map((item: { id: any; }) => item.id)]); //console.log([0,...this.listaRoles.map((item: { id: any; }) => item.id)]);
    }
    if (campo === 'campusesId') {
      const allSelected = this.RecordForm.controls.campusesId.value.length === this.listaCampus.length; //console.log(this.RecordForm.controls.campuses.value.length,this.campusList.length,allSelected);
      this.RecordForm.controls.campusesId.patchValue(allSelected ? [] : [0, ...this.listaCampus.map((item: { id: any; }) => item.id)]); //console.log([0,...this.campusList.map(item => item.id)]);
    }
    if (campo === 'areasResponsablesId') {
      const allSelected = this.RecordForm.controls.areasResponsablesId.value.length === this.listaAR.length; //console.log(this.RecordForm.controls.estatus.value.length,2,allSelected);
      this.RecordForm.controls.areasResponsablesId.patchValue(allSelected ? [] : [0, ...this.listaAR.map((item: { id: any; }) => item.id)]); //console.log([0,...this.campusList.map(item => item.id)]);  
    }
  }

}
