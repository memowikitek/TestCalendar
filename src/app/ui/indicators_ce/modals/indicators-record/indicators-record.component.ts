import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { IndicatorsService, UsersService } from 'src/app/core/services';
import { Alert, clearForm } from 'src/app/utils/helpers';
import { CatalogoUsuarioDTOV1, CatalogoElementoEvaluacionDTOV1, IndicadorMIDTOV1, IndicadoresDTOV1, IndicadorDTO, IndicadoresDTO, Vista } from 'src/app/utils/models';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogClose, } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ValidatorService } from 'src/app/shared/validators';
import { Router } from '@angular/router';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';
import tipo from 'src/assets/data/tipoRespuesta.json';


export enum ModalTitle {
  NEW = 'Nuevo Indicador',
  EDIT = 'Editar Indicador',
}

@Component({
  selector: 'app-indicators-record',
  templateUrl: './indicators-record.component.html',
  styleUrls: ['./indicators-record.component.scss']
})

export class IndicatorsRecordComponent implements OnInit {
  indicadorRecordForm: FormGroup;
  title: ModalTitle;
  edit: boolean;
  subscription: Subscription;
  estatusRecord: boolean;
  estatus: string;
  data: IndicadoresDTOV1;
  disabled: boolean;
  UsuarioCreacion: any;
  evaluacionList: any;
  procesoList: any;
  subAreaCentralList: any;
  areaCentralList: any;
  componentesList: any;
  regionData: any;
  activo: any;
  listaTR: any = tipo;
  thisAccess: Vista;
  permission: boolean;
  permissions: boolean[];
  componenteSeleccionado  = false;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public indicadorData: any,
    private readonly formBuilder: FormBuilder,
    private indicadores: IndicatorsService,
    private readonly ref: MatDialogRef<never>,
    private readonly validator: ValidatorService,
    private basicNotification: BasicNotification,
    private users: UsersService,
    private router: Router
  ) {
    this.title = ModalTitle.NEW;
    this.data = new IndicadoresDTOV1();
    //this.disabled = null;
    this.configureForm();
    this.edit = null;
    this.estatus = "Activo";
    this.estatusRecord = true;
    this.permission = null;
    this.thisAccess = new Vista();
    this.permissions = [false, false, false];
  }

  private configureForm(){
    this.indicadorRecordForm = this.formBuilder.group({
      id: [null],
      procesoEvaluacionId: [{ value: null, disabled: this.esActualizacion }, [Validators.required, Validators.maxLength(5), this.validator.noWhitespace]],
      componenteId: [{ value: null, disabled: this.esActualizacion }, [Validators.required, Validators.maxLength(5), this.validator.noWhitespace]],
      elementoEvaluacionId: [{ value: null, disabled: this.esActualizacion }, [Validators.required, Validators.maxLength(5), this.validator.noWhitespace]],
      areaCentralId: [{ value: null}, [Validators.required, Validators.maxLength(5), this.validator.noWhitespace]],
      subAreaCentralId: [{ value: null}, [Validators.required, Validators.maxLength(5), this.validator.noWhitespace]],
      claveIndicador: [null, [Validators.required]],
      indicador: [null, [Validators.required]],
      descripcionIndicador: [null, [Validators.required]],
      tipoResultado: [{ value: null, disabled: this.esActualizacion }, [Validators.required]],
      activo: [true, []],
    });
  }
  esActualizacion = true;
  ngOnInit(): void {
    //todo: revisar seguridad
    //this.setPermissions();
    this.getAllCategorys();
    this.title = this.indicadorData ? ModalTitle.EDIT : ModalTitle.NEW;
    let indicadorId = 0;

    if (this.indicadorData != null) 
      {
        if (this.indicadorData.data) {
          this.esActualizacion = this.indicadorData.data ? true : false
          this.estatus = this.indicadorData.data.activo ? "Activo" : "Inactivo";
          this.estatusRecord = this.indicadorData.data.activo;
          indicadorId = this.indicadorData.data.indicadorId;
        }
        else {
          this.esActualizacion = this.indicadorData ? true : false
          this.estatus = this.indicadorData.activo ? "Activo" : "Inactivo";
          this.estatusRecord = this.indicadorData.activo;
          indicadorId = this.indicadorData.indicadorId;
        }
      }
      else
      {
        this.esActualizacion =false;
        this.configureForm();
      }


      //this.disabled = !this.checkPermission(2);
      //this.disabled = this.indicadorData.data.esEditable;
      if (this.indicadorData) {
        this.indicadores.getIndicadorByIdCatalog(indicadorId).subscribe((response) => {
          if (!response.output) { return; }
          const data = new IndicadoresDTOV1().deserialize(response.output);
          this.data = data;
          this.indicadorRecordForm.patchValue(data);
          this.indicadorRecordForm.get('procesoEvaluacionId');
          this.trackingStatusForm();
        });
      } else {
        this.trackingStatusForm();
      }

    }

  private trackingStatusForm(): void {
    this.subscription.add(this.indicadorRecordForm.statusChanges.subscribe(() => (this.edit = true)));
  }

  private getAllCategorys(): void {
    this.indicadores.getCategory().subscribe((response) => {
      if (response.output) {

        if(!this.esActualizacion){
          this.evaluacionList = response.output.elementoEvaluaciones.filter((x: any) => x.activo == true);
          localStorage.setItem("evaluacionList", JSON.stringify(this.evaluacionList));
          this.procesoList = response.output.procesoEvaluaciones.filter ((x: any) => x.activo == true);
          let subAreaCentralList = response.output.subAreaCentrales.filter ((x: any) => x.activo == true);
          localStorage.setItem("subAreaCentralList", JSON.stringify(subAreaCentralList));
          this.areaCentralList = response.output.areaCentrales.filter ((x: any) => x.activo == true);
          this.componentesList = response.output.componentes.filter ((x: any) => x.activo == true);
          this.UsuarioCreacion = response.output.id;
        }
        else
        {
          this.evaluacionList = response.output.elementoEvaluaciones;
          localStorage.setItem("evaluacionList", JSON.stringify(this.evaluacionList));
          this.procesoList = response.output.procesoEvaluaciones;
          this.subAreaCentralList = response.output.subAreaCentrales.filter ((x: any) => x.activo == true);
          localStorage.setItem("subAreaCentralList", JSON.stringify(this.subAreaCentralList));
          this.areaCentralList = response.output.areaCentrales.filter ((x: any) => x.activo == true);
          this.componentesList = response.output.componentes;
          this.UsuarioCreacion = response.output.id;
        }
  
        // areas y sub areas centrales asignacion
          if (this.indicadorData)
          {
            if (this.indicadorData.subAreaCentrales && this.indicadorData.subAreaCentrales.length > 0 ){
              let subacentral = this.indicadorData.subAreaCentrales.map((id:any) => id.id);
              let aCentral = this.indicadorData.subAreaCentrales.map((id:any) => id.areaCentralId);
              this.subAreaCentralList = this.subAreaCentralList.filter((x: any) => subacentral.some((id:any) => id == x.id)) // se re selecciona los que ya estan en el indicador
              this.indicadorRecordForm.controls['areaCentralId'].setValue(aCentral);
              this.indicadorRecordForm.controls['subAreaCentralId'].setValue(subacentral);
            }
          }
      }
    });
  }

  changestatus(event:any)
  {
    this.estatusRecord = event.checked;
    if (event.checked){
      this.estatus='Activo';
    }
    else{
      this.estatus='Inactivo';
    }
  }

  submit(): void {
    this.indicadorRecordForm.markAllAsTouched();
    clearForm(this.indicadorRecordForm);
    const tmp = this.indicadorRecordForm.getRawValue(); console.log('form:', tmp);
    const indicadores: IndicadoresDTOV1 = new IndicadoresDTOV1().deserialize(tmp);
    const idUser = JSON.parse(localStorage.getItem('session'));
    if (this.data.procesoEvaluacionId) {
      indicadores.indicadorId = this.indicadorData.indicadorId;
      indicadores.procesoEvaluacionId = tmp.procesoEvaluacionId;
      indicadores.componenteId = tmp.componenteId;
      indicadores.elementoEvaluacionId = tmp.elementoEvaluacionId;
      indicadores.claveIndicador = tmp.claveIndicador;
      indicadores.descripcionIndicador = tmp.descripcionIndicador;
      indicadores.usuarioCreacion = idUser.id;
      const indicadoresSAC = [];
      const list = JSON.parse(localStorage.getItem("subAreaCentralList"));
      const n = tmp.subAreaCentralId.length;
      for (let i = 0; i < n; i++) {
        const filtro = this.searchList(tmp.subAreaCentralId[i], list);//console.log('filtro',filtro);
        const { id, nombre, siglas, areaCentralId, areaCentral, areaCentralSiglas, activo, usuarioCreacion, usuarioModificacion } = filtro[0];
        indicadoresSAC.push({
          id,
          nombre,
          siglas,
          areaCentralId,
          areaCentral,
          areaCentralSiglas,
          activo,
          usuarioCreacion,
          usuarioModificacion
        });
      }
      indicadores.subAreaCentrales = indicadoresSAC;
      indicadores.activo = this.estatusRecord;
      if (this.esActualizacion){
        indicadores.usuarioModificacion = this.users.userSession.id;
        this.indicadores.updateIndicadorDetalle(indicadores).subscribe((response) => {
          if (response.exito) {
            this.basicNotification.notif("success", 'Indicador actualizado correctamente');
            const id: any = response.output;
            // indicadores.indicadorId = id;
            this.indicadores.getIndicadorByIdCatalog(id.indicadorId).subscribe((responseNuevoIndicador) => {
              if (response.exito) {
                this.redirectDetail(responseNuevoIndicador.output);
              }
              else {
                this.ref.close(true);
              }
            });
          }
          else {
            this.basicNotification.notif("error", 'El Indicador No se actualizo correctamente',5000);
          }
        });
      }
    } else {
      indicadores.procesoEvaluacionId = tmp.procesoEvaluacionId;
      indicadores.componenteId = tmp.componenteId;
      indicadores.elementoEvaluacionId = tmp.elementoEvaluacionId;
      indicadores.claveIndicador = tmp.claveIndicador;
      indicadores.descripcionIndicador = tmp.descripcionIndicador;
      indicadores.usuarioCreacion = idUser.id;
      const indicadoresSAC = [];
      const list = JSON.parse(localStorage.getItem("subAreaCentralList"));
      const n = tmp.subAreaCentralId.length;
      for (let i = 0; i < n; i++) {
        const filtro = this.searchList(tmp.subAreaCentralId[i], list);//console.log('filtro',filtro);
        const { id, nombre, siglas, areaCentralId, areaCentral, areaCentralSiglas, activo, usuarioCreacion, usuarioModificacion } = filtro[0];
        indicadoresSAC.push({
          id,
          nombre,
          siglas,
          areaCentralId,
          areaCentral,
          areaCentralSiglas,
          activo,
          usuarioCreacion,
          usuarioModificacion
        });
      }
      indicadores.subAreaCentrales = indicadoresSAC;
      indicadores.usuarioCreacion = this.users.userSession.id;
      this.indicadores.createIndicator(indicadores).subscribe((response) => {
        if (response.exito) {
          this.basicNotification.notif("success", 'Indicador creado correctamente',6000);
          const id: any = response.output;
          // indicadores.indicadorId = id;
          this.indicadores.getIndicadorByIdCatalog(id).subscribe((responseNuevoIndicador) => {
            if (response.exito) {
              this.redirectDetail(responseNuevoIndicador.output);
            }
            else {
              this.ref.close(true);
            }
          });
        }
        else {
          this.basicNotification.notif("error", 'El Indicador No se creo correctamente',6000);
        }
      });
    }
  }

  redirectDetail(indicador: any): void {
    localStorage.setItem('idIndicadorSiac', JSON.stringify(indicador));
    setTimeout(() => {
      window.location.assign("/detalles-indicadores");
    }, 1500);
    this.ref.close(true);
  }

  closeModalByConfimation(): void {
    Alert.confirm('Alerta', '¿Está seguro de que desea salir? Los datos ingresados no serán guardados.').subscribe((result) => {
      if (!result || !result.isConfirmed) { return; }
      this.ref.close(result);
    }
    );
  }

  selectionAreaCentral(areaCentralIdArr: any) {
    let subAreaCentralList = JSON.parse(localStorage.getItem("subAreaCentralList"));
    const filteredSubArea = subAreaCentralList.filter(({ areaCentralId }: any) => areaCentralIdArr.includes(areaCentralId));
    console.log(filteredSubArea);
    this.subAreaCentralList = filteredSubArea;
    
    let currentSubAreaSelected = this.indicadorRecordForm.controls['subAreaCentralId'].value;
    this.indicadorRecordForm.controls['subAreaCentralId'].setValue(null)
    if (currentSubAreaSelected) {
      const updteValues = subAreaCentralList.filter(({ areaCentralId }: any) => !areaCentralIdArr.includes(areaCentralId))
      for (let sub of updteValues) {
        let index = currentSubAreaSelected.findIndex((x: any) => x === sub.id);
        if (index != -1) {
          currentSubAreaSelected.splice(index, 1);
        }
      }
      this.indicadorRecordForm.controls['subAreaCentralId'].setValue(currentSubAreaSelected);
    }
  }

  selectionComponente(id: number) {
    const compList = this.componentesList; 
    const evalList = JSON.parse(localStorage.getItem("evaluacionList"));
    const regComp = compList.filter((row: { id: number; }) => row.id === id);
    const claveComp = regComp[0].clave;
    const filtrados = evalList.filter((row: { clave: any; }) => row.clave.substr(0, 1) === claveComp.substr(0, 1));
    if (!filtrados || filtrados.length == 0) {
      this.basicNotification.notif("warning", 'El componente seleccionado, NO contiene elementos de evaluacion', 6000);
    }
    this.evaluacionList = filtrados;
    this.componenteSeleccionado = true;
  }

  searchList(id: number, lista: any) {
    return lista.filter((row: { id: number; }) => row.id === id);
  }

  searchListIndicadorId(id: number, lista: any) {
    return lista.filter((row: { indicadorId: number; }) => row.indicadorId === id);
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



