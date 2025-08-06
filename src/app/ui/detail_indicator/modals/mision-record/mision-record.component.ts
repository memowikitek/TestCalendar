import { Component, Inject, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DetailsIndicatorsService, IndicatorMiService, PilarEstrategicoMiService, SubindicatorMiService } from 'src/app/core/services';
import { MisionDTO } from 'src/app/utils/models/mision.dto';
import { TextFieldModule } from '@angular/cdk/text-field';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { Alert, clearForm } from '../../../../utils/helpers';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ValidatorService } from 'src/app/shared/validators';
import { RubricasDTOV1 } from 'src/app/utils/models/rubricas-v1.dto';
import { IndicadorMIDTOV1, TablePaginatorSearch } from 'src/app/utils/models';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';



@Component({
  selector: 'app-mision-record',
  templateUrl: './mision-record.component.html',
  styleUrls: ['./mision-record.component.scss']
})
export class MisionRecordComponent implements OnInit {
  [x: string]: any;
  data: any[];
  dataSourceAllMision: any;
  evaluacionList: any;
  nombre: any;
  id: any;
  nombreMIList: any;
  nombreIndicadorMI: any;
  nombreSubIndicadorMI: any;
  misionRecordForm: FormGroup;
  bandera = false;
  misionMiExistentes: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public misionMiIndicadore: any,
    private detailsIndicator: DetailsIndicatorsService,
    private misionService: DetailsIndicatorsService,
    private readonly formBuilder: FormBuilder,
    private readonly ref: MatDialogRef<never>,
    private apiIndicatorMiService: IndicatorMiService,
    private apiSubindicatorMiService: SubindicatorMiService,
    private basicNotification : BasicNotification
  ) {
    this.misionRecordForm = this.formBuilder.group({
      //          id: [null],
      componenteId: [null, [Validators.required]],
      indicadorMiId: [null, [Validators.required]],
      subIndicadorMiId: [null,],
      pilarEstrategicoId: [null, [Validators.required]],
      pilarEstrategicoMi: [null, Validators.required],
      definitionPilarEstrategicoMi: [null, Validators.required],
    });
    this.misionMiExistentes = misionMiIndicadore;
  }

  ngOnInit(): void {
    this.getMision();
    // this.getIndicatortMI();
    // this.getSubIndicatortMI();
    this.getComponentetMI();
  }

  onChangeComponenteMI(event: any) {
    let filter: TablePaginatorSearch;
    filter = new TablePaginatorSearch();
    filter.filter = {
      ComponenteMIId: event,
      activo:true
    };
    filter.pageSize = 0;
    filter.pageNumber = 0;
    this.getIndicatortMI(filter);
  }

  onChangeindicadorMiId(event: any) {
    let filter: TablePaginatorSearch;
    filter = new TablePaginatorSearch();
    filter.filter = {
      IndicadorMIId: event,
      activo:true
    };
    filter.pageSize = 0;
    filter.pageNumber = 0;
    this.getSubIndicatortMI(filter);
    this.getPilarEstrategicoMI(event);
  }

  public getSubIndicatortMI(filters: TablePaginatorSearch): void {
    this.apiSubindicatorMiService.getAllSubIndicatorMi(filters).subscribe((response) => {
      this.misionRecordForm.controls['subIndicadorMiId'].setValue(null);
      if (response.output) {
        // this.id = response.output.id;
        if (response.output.length >0 ){
          this.nombreSubIndicadorMI = response.output;
        }
        else
        {
          this.basicNotification.notif("warning",'El indicador de misión institucional, NO contiene Subindicadores', 6000);
        }
      }
    });
  }

  public getMision(): void {
    let filter = new  TablePaginatorSearch();
    filter.filter = {
      activo: true,
    };
    filter.pageSize = 0;
    filter.pageNumber = 0;
    this.detailsIndicator.getComponentMI(filter).subscribe((response) => {
      //console.log(response);
      // this.id = response.output.id;
      this.nombreMIList = response.output;
    });
  }
  public getComponentetMI(): void {
    let filter = new  TablePaginatorSearch();
    filter.filter = {
      activo: true,
    };
    filter.pageSize = 0;
    filter.pageNumber = 0;
    this.detailsIndicator.getComponentMI(filter).subscribe((response) => {
      if (response.output) {
        this.id = response.output.id;
        this.nombreComponente = response.output;
      }
    });
  }



  public getIndicatortMI(filters: TablePaginatorSearch): void {
    this.apiIndicatorMiService.getAllIndicatorMi(filters).subscribe((response) => {
      this.nombreIndicadorMI = response.output;
      this.nombreSubIndicadorMI = [];
      this.nombreSubIndicadorMI = [];
      this.misionRecordForm.controls['pilarEstrategicoMi'].setValue(null);
      this.misionRecordForm.controls['definitionPilarEstrategicoMi'].setValue(null);
      this.misionRecordForm.controls['pilarEstrategicoId'].setValue(null);
    });
    // this.detailsIndicator.getIndicatortMI().subscribe((response) => {    
    //     if (response.output) {
    //       this.id = response.output.id;
    //       this.nombreIndicadorMI = response.output;
    //     }
    // });
  }
  public getPilarEstrategicoMI(idindicador: any): void {
    let indicadorMi = this.nombreIndicadorMI.find((x: any) => x.id == idindicador)
    console.log(indicadorMi);
    if (indicadorMi) {
      this.misionRecordForm.controls['pilarEstrategicoMi'].setValue(indicadorMi.pilarEstrategicoMi.nombre);
      this.misionRecordForm.controls['definitionPilarEstrategicoMi'].setValue(indicadorMi.pilarEstrategicoMi.descripcion);
      this.misionRecordForm.controls['pilarEstrategicoId'].setValue(indicadorMi.pilarEstrategicoMi.id);
      //   this.apiPilarEstrategicoMiService.getStrategicPillarMiById(indicadorMi.pilarEstrategicoMiid).subscribe((response) => {
      //     this.pilarEstrategicoMi = response.output;
      //   });
    }
  }


  existeEnConfiguracion() : boolean
  {
    if (this.misionMiExistentes && this.misionMiExistentes.length > 0 ){
      const tmp = this.misionRecordForm.getRawValue();
      const mision: MisionDTO = new MisionDTO().deserialize(tmp);
      mision.indicadorId = JSON.parse(localStorage.getItem('idIndicadorSiac')).indicadorId;
      mision.componenteMiId = tmp.componenteId;
      mision.indicadorMiId = tmp.indicadorMiId;
      mision.subIndicadorMiId = tmp.subIndicadorMiId;
      mision.activo = true;
      mision.usuarioModificacion = null;
      mision.componenteId = tmp.componenteId;
      mision.pilarEstrategicoMiId = tmp.pilarEstrategicoId;
      
      let indicadorMi = this.misionMiExistentes.filter((x: any) => x.indicadorId == mision.indicadorId && x.componenteMiId == mision.componenteMiId &&  x.indicadorMiId == mision.indicadorMiId && x.subIndicadorMiId == mision.subIndicadorMiId && x.pilarEstrategicoMiId == mision.pilarEstrategicoMiId)
      debugger
      return (indicadorMi.length > 0) 
    }

    return false;

  }

  submit(): void {

    if (this.existeEnConfiguracion())
    {
      this.basicNotification.notif("warning","Existe una misión institucional con la misma configuración",6000);
      return;
    }

    this.misionRecordForm.markAllAsTouched();
    // if (this.misionRecordForm.invalid) {
    //   this.createBasicNotification("warning", "Verifique que los campos sean correctos");
    //   return;
    // }
    // clearForm(this.misionRecordForm);
    const idUser = JSON.parse(localStorage.getItem('session'));
    // let getIndicador;
    // let getSubIndicador;
    // let getComponenteMI;
    // let getPilarMI;

    const tmp = this.misionRecordForm.getRawValue();
    const mision: MisionDTO = new MisionDTO().deserialize(tmp);

    /*for(var i in this.nombreComponente)
    { 
        if (tmp.componenteId === this.nombreComponente[i].id){
          getComponenteMI = this.nombreComponente[i];
          console.log(getComponenteMI);
        }
    }
    for(var i in this.nombreIndicadorMI)
    { 
        if (tmp.componenteId === this.nombreIndicadorMI[i].id){
          getIndicador = this.nombreIndicadorMI[i];
        }
    }
    for(var i in this.pilarEstrategicoMi)
    { 
        if (tmp.pilarEstrategicoMiId === this.pilarEstrategicoMi[i].id){
          getPilarMI = this.pilarEstrategicoMi[i];
        }
    }
    for(var i in this.nombreSubIndicadorMI)
    { 
        if (tmp.indicadorMiId === this.nombreSubIndicadorMI[i].id){
          getSubIndicador = this.nombreSubIndicadorMI[i];
        }
    }
*/

    mision.indicadorId = JSON.parse(localStorage.getItem('idIndicadorSiac')).indicadorId;
    // mision.componenteMiId = JSON.parse(localStorage.getItem('idIndicadorSiac')).componenteId;
    //mision.pilarEstrategicoMiId = tmp.pilarEstrategicoMiId;
    // mision.pilarEstrategicoMiId = this.pilarEstrategicoMi[0].id
    mision.componenteMiId = tmp.componenteId;
    mision.indicadorMiId = tmp.indicadorMiId;
    mision.subIndicadorMiId = tmp.subIndicadorMiId;
    mision.activo = true;
    mision.usuarioCreacion = idUser.id;
    mision.usuarioModificacion = null;
    mision.componenteId = tmp.componenteId;
    mision.pilarEstrategicoMiId = tmp.pilarEstrategicoId;
    /*      mision.claveComponente = null;
          mision.componenteMi = null;
          mision.descripcionComponenteMi = null;*/
    //mision.claveIndicadorMi = null;
    //      mision.indicadorMi = getIndicador.nombre;

    //mision.indicadorMi = null;


    //      mision.claveSubIndicadorMi = null;
    //    mision.subIndicadorMi = null;
    //mision.pilarEstrategicoMiId = getIndicador.pilarEstrategicoMiid;
    //mision.pilarEstrategicoMi = getPilarMI.nombre;
    //mision.descripcionPilarEstrategicoMi = getPilarMI.descripcion;
    /*mision.indicadorId =JSON.parse(localStorage.getItem('idIndicadorSiac')).indicadorSiacid;
    mision.indicadorMiId = tmp.IndicadorMiId;
    mision.claveIndicadorMi = getIndicador.clave;
    mision.indicadorMi = getIndicador.nombre;
    mision.subIndicadorMiId = getSubIndicador.indicadorMiid;
    mision.claveSubIndicadorMi = getIndicador.clave;
    mision.subIndicadorMi = getIndicador.nombre;

*/
    //console.log(tmp);
    const result = [];
    result.push(mision);
    //console.log(mision);
    this.detailsIndicator.getAddMision(result).subscribe(() => {
      // Alert.success('', 'Mision creada correctamente');
      this.basicNotification.notif("success",'Misión Institucional creada correctamente', 5000);
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

  onChange(event: any) {
    //console.log("event "+event);
    this.bandera = true;

    let pilarEstrategicoMi;
    this.detailsIndicator.getPilarEstrategicoId(event).subscribe((response) => {
      this.pilarEstrategicoMi = response.output;
      console.log(this.pilarEstrategicoMi[0].id);
    });

  }



}
