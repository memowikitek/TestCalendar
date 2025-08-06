import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UsersService } from 'src/app/core/services';
import { CicloEva, EvaluationCycleService } from 'src/app/core/services/api/evaluation-cycle/evaluation-cycle.service';
import { ValidatorService } from 'src/app/shared/validators';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';
import { CicloEvaDTOV1, EtapaEvaluacion, TablePaginatorSearch } from 'src/app/utils/models';
import { CicloEvaluacionData } from './criteria-record.service';
import { EvaluationCriteriaIrService } from 'src/app/core/services/api/evaluation-criteria-ir/evaluation-criteria-ir.service';
import { clearForm } from 'src/app/utils/helpers';
import { CriteriosEvaluacionDTO } from 'src/app/utils/models/criterios-evaluacion.dto';

export enum ModalTitle {
  NEW = 'Agregar criterios',
  EDIT = 'Editar criterios',
}

@Component({
  selector: 'app-criteria-record',
  templateUrl: './criteria-record.component.html',
  styleUrls: ['./criteria-record.component.scss']
})
export class CriteriaRecordComponent implements OnInit {
  evaluationCriteriaRecordForm: FormGroup;
  title: ModalTitle;
  edit: boolean;
  subscription: Subscription;
  disabled: boolean;
  permission: boolean;
  filters: TablePaginatorSearch;
  ciclosEvaluacionList: any;
  etapasList: EtapaEvaluacion[];
  estatus: string = 'Activo';
  estatusRecord: boolean = true;

  constructor(
    private router: Router,
    private readonly formBuilder: FormBuilder,
    private readonly ref: MatDialogRef<never>,
    @Inject('CicloEvaluacionData') public readonly cicloEvaluacionData: CicloEvaluacionData,
    private readonly cicloEvaluacionService: EvaluationCycleService,
    public dialogRef: MatDialogRef<CriteriaRecordComponent>,
    private etapas: EvaluationCriteriaIrService,
    private criterioEvaluacion: EvaluationCriteriaIrService,
    private readonly validator: ValidatorService,
    private users: UsersService,
    private basicNotification: BasicNotification,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.title = ModalTitle.NEW;
    this.ciclosEvaluacionList = [];
    this.etapasList = [];
    this.evaluationCriteriaRecordForm = this.formBuilder.group({
      cicloEvaluacionId: [null, [Validators.required, this.validator.noWhitespace]],
      etapaId: [null, [Validators.required, this.validator.noWhitespace]],
      CriterioRevision: [null, [Validators.required, Validators.maxLength(200), this.validator.noWhitespace]],
      activo: [true, []],
    });
    this.subscription = new Subscription();
  }

  ngOnInit(): void {
    this.getAllEvaluationCycles();
    this.getAllAplicablePhasesToECIR();
    this.evaluationCriteriaRecordForm = this.formBuilder.group({
      cicloEvaluacionId: [this.data.cicloEvaluacionId, [Validators.required, this.validator.noWhitespace]],
      etapaId: [this.data.etapaId, [Validators.required, this.validator.noWhitespace]],
      CriterioRevision: [this.data.criterioRevision, [Validators.required, Validators.maxLength(200), this.validator.noWhitespace]],
      activo: [this.data.activo, []],
    });
    this.title = this.data ? ModalTitle.EDIT : ModalTitle.NEW;
    if (this.data) this.evaluationCriteriaRecordForm.markAllAsTouched();
    this.trackingStatusForm();
  }

  private getAllEvaluationCycles(): void {
    const filters = new TablePaginatorSearch();
    const procesoEvaluacionId = 1;
    filters.pageSize = 100;
    this.criterioEvaluacion.getAllCriteriaEvaluacionCycle(filters, procesoEvaluacionId).subscribe((response) => {
      if (!response.output) {
        return;
      }
      this.ciclosEvaluacionList = response.output.map((item: any) => {
        return {
          value: item.cicloEvaluacionId,
          text: item.cicloEvaluacion,
        };
      });
      if (this.data) {
        this.evaluationCriteriaRecordForm.get('cicloEvaluacionId').patchValue(this.data.cicloEvaluacionId);
      }else{
        this.evaluationCriteriaRecordForm.get('cicloEvaluacionId').patchValue(this.ciclosEvaluacionList);
      }
    });
  }
  
  private getAllAplicablePhasesToECIR(): void {
    const filters = { filter: { 'AplicaCriterioEvaluacion': true } };
    this.etapas.getAllAplicablePhasesToECIR(filters).subscribe((response: any) => {
      if (!response.output) {
        return;
      }

      this.etapasList = response.output.map((item: any) => {
        return {
          etapaId: item.id,
          etapa: item.clave + ': ' + item.nombre,
        };
      });
      if (this.data) {
        this.evaluationCriteriaRecordForm.get('cicloEvaluacionId').patchValue(this.data.cicloEvaluacionId);
      }
      else{
        this.evaluationCriteriaRecordForm.get('etapaId').patchValue(this.etapasList);
      }
    });
  } 

  private trackingStatusForm(): void {
    this.subscription.add(this.evaluationCriteriaRecordForm.statusChanges.subscribe(() => (this.edit = true)));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  submit(): void {
    this.evaluationCriteriaRecordForm.markAllAsTouched();
    if (this.evaluationCriteriaRecordForm.invalid) {
        this.basicNotification.notif("error",'Verifique que los campos sean correctos');
        return;
    }
    const tmp = this.evaluationCriteriaRecordForm.getRawValue();
    clearForm(this.evaluationCriteriaRecordForm);
    const criterio: CriteriosEvaluacionDTO = new CriteriosEvaluacionDTO().deserialize(tmp);
    if (this.data) {
        criterio.id = this.data.id;
        criterio.fechaCreacion = this.data.fechaCreacion;
        criterio.usuarioCreacion = this.data.usuarioCreacion;
        criterio.fechaModificacion = new Date();
        criterio.usuarioModificacion = this.users.userSession.id;
        criterio.activo = this.estatusRecord;
        this.criterioEvaluacion.updateEvaluationCriteria(criterio).subscribe(() => {
            this.basicNotification.notif("success",'Criterio actualizado correctamente');
            this.ref.close(true);
            this.data = null;
        });
    } else {
      criterio.fechaCreacion = new Date();
      criterio.usuarioCreacion = this.users.userSession.id;
        this.criterioEvaluacion.createEvaluationCriteria(criterio).subscribe(() => {
            this.basicNotification.notif("success",'Criterio creado correctamente');
            this.ref.close(true);
        });
      }
    }

  closeModalByConfimation(): void {
    this.dialogRef.close();
  }

  changeStatusDescription(event: any): void {
    this.estatusRecord = event.checked;
    this.estatus = this.estatusRecord ? 'Activo' : 'Inactivo';
  }
}
