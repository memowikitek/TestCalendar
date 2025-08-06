import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DetailsIndicatorsService, IndicatorMiService, PilarEstrategicoMiService, SubindicatorMiService } from 'src/app/core/services';
import { CEMisionDTO, ComponenteCEMIDTO } from 'src/app/utils/models/detalles-ce-mision.dto';
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
  cicloEvaluacionId: number;
  @Input() indLeer: boolean;
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
      descripcionPilarEstrategicoMi: [null, Validators.required],
    });
    this.misionMiExistentes = misionMiIndicadore;
  }

  ngOnInit(): void {
    this.getMision();
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
      this.misionRecordForm.controls['descripcionPilarEstrategicoMi'].setValue(null);
      this.misionRecordForm.controls['pilarEstrategicoId'].setValue(null);
    });
  }
  public getPilarEstrategicoMI(idindicador: any): void {
    let indicadorMi = this.nombreIndicadorMI.find((x: any) => x.id == idindicador)
    console.log(indicadorMi);
    if (indicadorMi) {
      this.misionRecordForm.controls['pilarEstrategicoMi'].setValue(indicadorMi.pilarEstrategicoMi.nombre);
      this.misionRecordForm.controls['descripcionPilarEstrategicoMi'].setValue(indicadorMi.pilarEstrategicoMi.descripcion);
      this.misionRecordForm.controls['pilarEstrategicoId'].setValue(indicadorMi.pilarEstrategicoMi.id);
    }
  }


  existeEnConfiguracion() : boolean
  {
    if (this.misionMiExistentes && this.misionMiExistentes.length > 0 ){
      let indicadorInfo = JSON.parse(localStorage.getItem('idIndicadorSiac'));
      const tmp = this.misionRecordForm.getRawValue();
      const mision: ComponenteCEMIDTO = new ComponenteCEMIDTO().deserialize(tmp);
      mision.indicadorMi.indicadorId = indicadorInfo.indicadorId;
      mision.indicadorMi.componenteMiId = tmp.componenteId;
      mision.indicadorMi.indicadorMiId = tmp.indicadorMiId;
      mision.indicadorMi.subIndicadorMiId = tmp.subIndicadorMiId;
      mision.activo = true;
      mision.usuarioModificacion = null;
      mision.indicadorMi.componenteId = tmp.componenteId;
      mision.indicadorMi.pilarEstrategicoMiId = tmp.pilarEstrategicoId;
      this.cicloEvaluacionId = indicadorInfo.cicloEvaluacionId;
      
      let indicadorMi = this.misionMiExistentes.filter((x: any) => x.indicadorId == mision.indicadorMi.indicadorId && x.componenteMiId == mision.indicadorMi.componenteMiId &&  x.indicadorMiId == mision.indicadorMi.indicadorMiId && x.subIndicadorMiId == mision.indicadorMi.subIndicadorMiId && x.pilarEstrategicoMiId == mision.indicadorMi.pilarEstrategicoMiId)
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
    const idUser = JSON.parse(localStorage.getItem('session'));

    const tmp = this.misionRecordForm.getRawValue();
    const mision: CEMisionDTO = new CEMisionDTO().deserialize(tmp);

    const {indicadorId, cicloEvaluacionId} = JSON.parse(localStorage.getItem('idIndicadorSiac'));
    mision.indicadorId = indicadorId;
    mision.cicloEvaluacionId = cicloEvaluacionId;
    mision.componenteMiId = tmp.componenteId;
    mision.indicadorMiId = tmp.indicadorMiId;
    mision.subIndicadorMiId = tmp.subIndicadorMiId;
    mision.activo = true;
    mision.usuarioCreacion = idUser.id;
    mision.usuarioModificacion = null;
    mision.componenteId = tmp.componenteId;
    mision.pilarEstrategicoMiId = tmp.pilarEstrategicoId;
    //mision.indicadorMi.cicloEvaluacion = this.cicloEvaluacionId;
    //const result: ComponenteCEMIDTO = mision;
    //result.push(mision);
    this.detailsIndicator.getAddCeMision(mision).subscribe(() => {
      this.basicNotification.notif("success",'Misión Institucional creada correctamente', 5000);
      this.ref.close(true);
    });

  }
  closeModalByConfimation(): void {
    this.ref.close();
  }

  onChange(event: any) {
    this.bandera = true;

    let pilarEstrategicoMi;
    this.detailsIndicator.getPilarEstrategicoId(event).subscribe((response) => {
      this.pilarEstrategicoMi = response.output;
      console.log(this.pilarEstrategicoMi[0].id);
    });

  }



}
