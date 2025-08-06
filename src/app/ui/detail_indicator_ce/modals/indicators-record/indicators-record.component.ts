import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { IndicatorsService, UsersService } from 'src/app/core/services';
import { Alert, clearForm } from 'src/app/utils/helpers';
import { CatalogoUsuarioDTOV1, CatalogoElementoEvaluacionDTOV1, IndicadorMIDTOV1, IndicadorDTO, IndicadoresDTO, Vista } from 'src/app/utils/models';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogClose, } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ValidatorService } from 'src/app/shared/validators';
import { Router } from '@angular/router';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';
import tipo from 'src/assets/data/tipoRespuesta.json';
import { ReactiveFormsModule } from '@angular/forms';
import { IndicadoresCeDTO } from 'src/app/utils/models/indicadores-ce.dto';

export enum ModalTitle {
  EDIT = 'Editar Indicador',
}

@Component({
  selector: 'app-indicators-record',
  templateUrl: './indicators-record.component.html',
  styleUrls: ['./indicators-record.component.scss']
})

export class IndicatorsCeRecordComponent implements OnInit {
  private subscription: Subscription = new Subscription();
  indicadorRecordForm: FormGroup;
  title: ModalTitle;
  edit: boolean;
  estatusRecord: boolean;
  estatus: string;
  data: IndicadoresCeDTO;
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
  cicloEvaluacionId: number;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public indicadorData: any,
    private readonly formBuilder: FormBuilder,
    private indicadores: IndicatorsService,
    private readonly ref: MatDialogRef<never>,
    private readonly validator: ValidatorService,
    private readonly detailsIndicator: IndicatorsService,
    private basicNotification: BasicNotification,
    private users: UsersService,
    private router: Router
  ) {
    this.title = ModalTitle.EDIT;
    this.data = new IndicadoresCeDTO();
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
      nombreIndicador: [null, [Validators.required]],
      descripcionIndicador: [null, [Validators.required]],
      tipoResultado: [{ value: null, disabled: this.esActualizacion }, [Validators.required]],
      activo: [true, []],
    });
  }
  esActualizacion = true;
  ngOnInit(): void {
    this.getAllCategorys();
    this.title = ModalTitle.EDIT;

    if (this.indicadorData != null) 
      {
        if (this.indicadorData.data) {
          this.esActualizacion = this.indicadorData.data ? true : false
          this.estatus = this.indicadorData.data.activo ? "Activo" : "Inactivo";
          this.estatusRecord = this.indicadorData.data.activo;
        }
        else {
          this.esActualizacion = this.indicadorData ? true : false
          this.estatus = this.indicadorData.activo ? "Activo" : "Inactivo";
          this.estatusRecord = this.indicadorData.activo;
        }
      }
      else
      {
        this.esActualizacion =false;
        this.configureForm();
      }
      const idIndicadorSiac = JSON.parse(localStorage.getItem('idIndicadorSiac'));
      const { cicloEvaluacionId, indicadorId } = idIndicadorSiac;
      this.cicloEvaluacionId = cicloEvaluacionId;
      if (this.indicadorData) {
        this.indicadorRecordForm.get('areaCentralId').patchValue(this.indicadorData.areaCentralList);
        this.detailsIndicator.getCeIndicadorInfo(indicadorId, cicloEvaluacionId).subscribe((response) => {
          if (!response.output) { return; }
          const data = new IndicadoresCeDTO().deserialize(response.output);
          this.data = data;
          this.indicadorRecordForm.patchValue(data);
          let ids: any = null;
          if (Array.isArray(data.areaCentrales)) {
            ids = data.areaCentrales.map((sac: any) => sac.id).filter((id: any) => id !== undefined && id !== null);
            this.indicadorRecordForm.controls['areaCentralId'].setValue(ids);
          } else {
            this.indicadorRecordForm.controls['areaCentralId'].setValue([]);
          }
          if (Array.isArray(data.subAreaCentrales)) {
            const idsac = data.subAreaCentrales.map((sac: any) => sac.id).filter((id: any) => id !== undefined && id !== null);
            this.subAreaCentralList = data.subAreaCentrales;
            localStorage.setItem("subAreaCentralList", JSON.stringify(this.subAreaCentralList));
            this.indicadorRecordForm.get('subAreaCentralId').patchValue(this.subAreaCentralList);
            this.indicadorRecordForm.controls['subAreaCentralId'].setValue(idsac);
          } else {
            this.indicadorRecordForm.controls['subAreaCentralId'].setValue([]);
          }
        });
      }
      this.trackingStatusForm();
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
          this.subAreaCentralList = response.output.subAreaCentrales.filter ((x: any) => x.activo == true);
          localStorage.setItem("subAreaCentralList", JSON.stringify(this.subAreaCentralList));
          this.areaCentralList = response.output.areaCentrales.filter ((x: any) => x.activo == true);
          this.componentesList = response.output.componentes.filter ((x: any) => x.activo == true);
          this.UsuarioCreacion = response.output.id;
        }
        else
        {
          this.evaluacionList = response.output.elementoEvaluaciones;
          localStorage.setItem("evaluacionList", JSON.stringify(this.evaluacionList));
          this.procesoList = response.output.procesoEvaluaciones;
          this.areaCentralList = response.output.areaCentrales.filter ((x: any) => x.activo == true);
          this.componentesList = response.output.componentes;
          this.UsuarioCreacion = response.output.id;
        }
  
        // areas y sub areas centrales asignacion
          if (this.indicadorData)
          {
            if (this.indicadorData.subAreaCentrales && this.indicadorData.subAreaCentrales.length > 0 ){
              let aCentral = this.indicadorData.subAreaCentrales.map((id:any) => id.areaCentralId);
              this.indicadorRecordForm.controls['areaCentralId'].setValue(aCentral);
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
    const indicadores: IndicadoresCeDTO = new IndicadoresCeDTO().deserialize(tmp);
    const idUser = JSON.parse(localStorage.getItem('session'));
    if (this.data.procesoEvaluacionId) {
      indicadores.indicadorId = this.indicadorData.indicadorId;
      indicadores.nombreIndicador = tmp.nombreIndicador;
      indicadores.procesoEvaluacionId = tmp.procesoEvaluacionId;
      indicadores.componenteId = tmp.componenteId;
      indicadores.elementoEvaluacionId = tmp.elementoEvaluacionId;
      indicadores.claveIndicador = tmp.claveIndicador;
      indicadores.descripcionIndicador = tmp.descripcionIndicador;
      indicadores.cicloEvaluacionId = this.cicloEvaluacionId;
      indicadores.usuarioCreacion = idUser.id;
      const indicadoresSAC = [];
      const list = JSON.parse(localStorage.getItem("subAreaCentralList"));
      const n = tmp.subAreaCentralId.length;
      for (let i = 0; i < n; i++) {
        const filtro = this.searchList(tmp.subAreaCentralId[i], list);
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
        this.indicadores.updateCeIndicador(indicadores).subscribe((response) => {
          if (response.exito) {
            this.basicNotification.notif("success", 'Indicador actualizado correctamente');
            const id: any = response.output;
            indicadores.indicadorId = id;
            this.indicadores.getCeIndicadorInfo(id.indicadorId, this.cicloEvaluacionId).subscribe((response) => {
              if(response){
                this.ref.close(true);
              }
            });
          }
          else {
            this.basicNotification.notif("error", 'El Indicador No se actualizo correctamente',5000);
          }
        });
      }
    }
  }

  closeModalByConfimation(): void {
    Alert.confirm('Alerta', '¿Está seguro de que desea salir? Los datos ingresados no serán guardados.').subscribe((result) => {
      if (!result || !result.isConfirmed) { return; }
      this.ref.close(result);
    }
    );
  }

  selectionAreaCentral(areaCentralIdArr: any): void {
    let subAreaCentralList = JSON.parse(localStorage.getItem("subAreaCentralList") || '[]');
    if (!Array.isArray(areaCentralIdArr)) {
      areaCentralIdArr = [areaCentralIdArr];
    }
    const filteredSubArea = subAreaCentralList.filter(({ areaCentralId }: any) => areaCentralIdArr.includes(areaCentralId));
    this.subAreaCentralList = filteredSubArea;

    let currentSubAreaSelected = this.indicadorRecordForm.controls['subAreaCentralId'].value;
    this.indicadorRecordForm.controls['subAreaCentralId'].setValue([]);
    if (currentSubAreaSelected && currentSubAreaSelected.length > 0) {
      const updteValues = currentSubAreaSelected.filter((id: any) => 
        filteredSubArea.some(({ id: filteredId }: any) => filteredId === id)
      );
      this.indicadorRecordForm.controls['subAreaCentralId'].setValue(updteValues);
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
  ngOnDestroy() {
      this.subscription.unsubscribe();
  }

}