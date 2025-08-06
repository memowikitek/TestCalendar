import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ValidatorService } from 'src/app/shared/validators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { DetailsIndicatorsService, ResponsibilityAreasService } from 'src/app/core/services';
import { AresponsableDTO, IndicadoresNmdet, TablePaginatorSearch, Vista } from '../../../../utils/models';
import { Alert, clearForm } from '../../../../utils/helpers';
import { Router } from '@angular/router';
import tipo from 'src/assets/data/tipoRespuesta.json';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';

export enum ModalTitle {
  NEW = 'Agregar Área responsable',
  EDIT = 'Editar Área responsable',
}

@Component({
  selector: 'app-area-responsable',
  templateUrl: './area-responsable.component.html',
  styleUrls: ['./area-responsable.component.scss']
})

export class AreaResponsableComponent implements OnInit {
  FormAR: FormGroup;
  title: ModalTitle;
  data: AresponsableDTO;
  edit: boolean;
  subscription: Subscription;
  disabled: boolean;
  permission: boolean;
  thisAccess: Vista;
  permissions: boolean[];
  //LISTAS
  nombreInstitucion: any;
  claveAR: any;
  listaAR: any;
  listaAR2: any;
  listaTR: any = tipo;
  listaNivel: any;
  //LOCAL STORAGE
  indicadorSiac: any;
  Institucion: any;
  ListadoAR: any;
  ListadoNivel: any;

  constructor(
    private detailsIndicator: DetailsIndicatorsService,
    private readonly ref: MatDialogRef<never>,
    private readonly formBuilder: FormBuilder,
    public readonly DetailsIndicatorsServiceData: DetailsIndicatorsService,
    private router: Router,
    private readonly validator: ValidatorService,
    private fb: FormBuilder,
    private apiAreaResponsableService: ResponsibilityAreasService,
    private basicNotification : BasicNotification
  ) {
    this.title = ModalTitle.NEW;
    this.data = new AresponsableDTO();
    this.edit = null;
    this.disabled = null;
    this.permission = null;
    this.subscription = new Subscription();
    this.FormAR = this.fb.group({
      institucionId: [null, [Validators.required, Validators.maxLength(9), this.validator.noWhitespace]],
      areaResponsableId: [null, [Validators.required, Validators.maxLength(9), this.validator.noWhitespace]],
      areaResponsable: [null, []],
      tipoResultado: [null, [Validators.required, Validators.maxLength(2), this.validator.noWhitespace]],
      nivelModalidadId: [null, [Validators.required]],
      activo: [true, []],
      indicadoresNmdet: [null]
    });
    this.thisAccess = new Vista();
    this.permissions = [false, false, false];
  }

  ngOnInit(): void {
    this.getInstitucion();
    //this.getListadoTipoResultado(); //console.log('TipoResultado', this.listaTR);
    this.getListadoNivel();
    this.indicadorSiac = JSON.parse(localStorage.getItem("idIndicadorSiac"));
    this.Institucion = JSON.parse(localStorage.getItem("Institucion"));
    this.ListadoAR = JSON.parse(localStorage.getItem("ListadoAR"));
    this.ListadoNivel = JSON.parse(localStorage.getItem("ListadoNivel"));
    if (this.indicadorSiac){
      this.FormAR.controls['tipoResultado'].setValue(this.indicadorSiac.tipoResultado ?? 1);
      this.FormAR.controls['tipoResultado'].disable();
    }
  }

  public getInstitucion(): void {
    let filter = new  TablePaginatorSearch();
    filter.filter = {
      activo: true,
    };
    filter.pageSize = 0;
    filter.pageNumber = 0;
    this.detailsIndicator.getInstitucion(filter).subscribe((response) => {
      if (response.output) {
        this.nombreInstitucion = response.output; //console.log(this.nombreInstitucion);
        localStorage.setItem("Institucion", JSON.stringify(this.nombreInstitucion));
      }
    });
  }


  public selectioninstitucion(idInstitucion: any): void {
    this.getListadoAR(idInstitucion);
  }

  public getListadoAR(idInstitucion: any): void {
    let filter = new  TablePaginatorSearch();
    filter.filter = {
      InstitucionId: idInstitucion,
      activo: true,
    };
    filter.pageSize = 0;
    filter.pageNumber = 0;
    this.apiAreaResponsableService.getAllResponsibilityAreas(filter).subscribe((response) => {

      if (response.output) {
        this.listaAR = response.output; //console.log(this.listaAR);
        this.listaAR2 = this.listaAR; //console.log(this.listaAR2);
        localStorage.setItem("ListadoAR", JSON.stringify(this.listaAR));
      } 
      
      if (response.output && response.output.length == 0) {
        this.basicNotification.notif("warning",'La institución seleccionada, No tiene áreas responsables asignadas', 6000);
      }
    });
    
    // this.detailsIndicator.getAR().subscribe((response) => {
    //   if (response.output) {
    //     this.listaAR = response.output; //console.log(this.listaAR);
    //     this.listaAR2 = this.listaAR; //console.log(this.listaAR2);
    //     localStorage.setItem("ListadoAR", JSON.stringify(this.listaAR));
    //   }
    // });
  }

  public getListadoNivel(): void {
    let filter = new  TablePaginatorSearch();
    filter.filter = {
      activo: true,
    };
    filter.pageSize = 0;
    filter.pageNumber = 0;
    this.detailsIndicator.getTipoNivel(filter).subscribe((response) => {
      if (response.output) {
        this.listaNivel = response.output; //console.log(this.listaNivel);
        localStorage.setItem("ListadoNivel", JSON.stringify(this.listaNivel));
      }
    });
  }

  submit(): void {
    this.FormAR.markAllAsTouched();
    clearForm(this.FormAR);
    const form = this.FormAR.getRawValue(); //console.log(form);
    const modelAR: AresponsableDTO = new AresponsableDTO();
    const idUser = JSON.parse(localStorage.getItem('session'));
    console.log('indicadorSiac', this.indicadorSiac);
    const { areaCentralId, componenteId, elementoEvaluacionId, indicadorId, procesoEvaluacionId, subAreaCentralId, totalIndicadores } = this.indicadorSiac;
    //if(){}else{}
    modelAR.procesoEvaluacionId = procesoEvaluacionId;
    modelAR.indicadorId = indicadorId;
    modelAR.componenteId = componenteId;
    modelAR.elementoEvaluacionId = elementoEvaluacionId;
    modelAR.areaCentralId = areaCentralId;
    modelAR.subAreaCentralId = subAreaCentralId;
    modelAR.institucionId = form.institucionId;
    modelAR.usuarioModificacion = 0;
    modelAR.areaResponsableId = form.areaResponsableId;
    modelAR.tipoResultado = form.tipoResultado;
    modelAR.claveInstitucion = this.searchClave(form.institucionId, this.Institucion);
    modelAR.institucion = this.searchName(form.institucionId, this.Institucion);
    modelAR.claveAreaResponsable = this.searchClave(form.areaResponsableId, this.ListadoAR);
    modelAR.areaResponsable = this.searchName(form.areaResponsableId, this.ListadoAR);
    //modelAR.dependenciaAreaId = 0; //???
    //Agregar Nivel/Modalidad
    const indicadoresNM = [];
    const n = form.nivelModalidadId.length; //console.log(n);
    for (let i = 0; i < n; i++) {
      const areaResponsableId = form.areaResponsableId;
      const nivelModalidadId = form.nivelModalidadId[i]; //console.log(i, nivelModalidadId);
      const nivelModalidad = this.searchClave(nivelModalidadId, this.ListadoNivel);//console.log(nivelModalidadId,nivelModalidad);
      indicadoresNM.push({
        //procesoEvaluacionId,
        indicadorId,
        //componenteId,
        //elementoEvaluacionId,
        //ºCentralId,
        //subAreaCentralId,
        areaResponsableId,
        nivelModalidadId,
        nivelModalidad
      });
    }
    //console.log('indicadoresNM',indicadoresNM);
    modelAR.indicadoresNmdet = indicadoresNM;
    modelAR.activo = form.activo;
    modelAR.usuarioCreacion = idUser.id;
    let arrModelAR = [];
    arrModelAR.push(modelAR); console.log(arrModelAR);
    this.detailsIndicator.getAddAResponsable(arrModelAR).subscribe(() => {
      // Alert.success('', 'Area creada correctamente');
      this.basicNotification.notif("success",'Área responsable creada correctamente', 5000);
      this.ref.close(true);
    });
  }

  closeModalByConfimation(): void {
    this.ref.close();
    // Alert.confirm('Alerta', '¿Está seguro de que desea salir? Los datos ingresados no serán guardados.').subscribe(
    //   (result) => {
    //     if (!result || !result.isConfirmed) {
    //       return;
    //     }
    //     this.ref.close(result);
    //   }
    // );
  }

  // Método para filtrar las opciones del segundo select basado en la selección del primero
  selectionAreaResp(claveId: number) {
    const opcion = this.listaAR2.find((row: { id: number; }) => row.id === claveId)?.nombre;
    if (opcion) {
      this.FormAR.get('areaResponsable')?.setValue(opcion);
    }
  }

  searchName(id: number, lista: any) {
    return lista.find((row: { id: number; }) => row.id === id)?.nombre;
  }

  searchClave(id: number, lista: any) {
    return lista.find((row: { id: number; }) => row.id === id)?.clave;
  }

}
