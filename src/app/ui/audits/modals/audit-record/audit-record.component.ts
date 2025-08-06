import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA ,  MatDialogClose,} from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AuditService, UsersService } from 'src/app/core/services';
import { ValidatorService } from 'src/app/shared/validators';
import { Alert, clearForm } from 'src/app/utils/helpers';
import { AuditDTO, AuditDTOV1, TablePaginatorSearch, CatalogoUsuarioDTOV1 } from 'src/app/utils/models';
import { AuditData } from './audit-records.service';
import { AuditRecordService } from './audit-records.service';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';

export enum ModalTitle {
  NEW = 'Nuevo proceso de evaluación',
  EDIT = 'Editar proceso de evaluación',
}

@Component({
  selector: 'app-audit-record',
  templateUrl: './audit-record.component.html',
  styleUrls: ['./audit-record.component.scss']
})
export class AuditRecordComponent implements OnInit {
  @ViewChild('myBtn') myBtn: ElementRef<HTMLElement>;
  auditRecordForm: FormGroup;
  title: ModalTitle;
  estatus: string;
  estatusRecord: boolean;
  edit: boolean;
  data: AuditDTOV1;
  subscription: Subscription;
  dialogRef: any;
  usuariosList: CatalogoUsuarioDTOV1[];
  isChecked: any;
  desactivo: boolean;
   
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public readonly auditData: AuditData,
    private router: Router,
    private readonly ref: MatDialogRef<never>,
    private readonly formBuilder: FormBuilder,
    private readonly validator: ValidatorService,
    private readonly audits: AuditService,
    private users: UsersService,
    private basicNotification : BasicNotification,
  ) {
    this.title = ModalTitle.NEW;
    this.data = new AuditDTOV1();
    this.edit = null;
//    this.bandera = 0;
    this.auditRecordForm = this.formBuilder.group({
      id: [null],
      nombre: [null, [Validators.required, Validators.maxLength(100), this.validator.noWhitespace]],
      // totalIndicadores: [,[Validators.required, Validators.maxLength(5),  this.validator.noWhitespace]],
      totalIndicadores: [null],
      activo: [true, []],
      //desactivo : true,

    }); 

  }

  ngOnInit(): void {

    this.title = this.auditData ? ModalTitle.EDIT : ModalTitle.NEW;
//    this.estatusRecord = this.auditData.data.activo;
    //this.estatusRecord =true;
    //this.estatus = this.auditData.data.activo? "Activo":"Inactivo";
    this.estatusRecord = this.auditData ? this.auditData.data.activo : true;
        this.estatus = this.auditData ? this.auditData.data.activo? "Activo":"Inactivo" : "Activo";
        
        if(!this.auditData){
          // const tmp = this.auditRecordForm.getRawValue();
          // tmp.totalIndicadores = 0;
         
          this.auditRecordForm.get('totalIndicadores').setValue(0);
        }
        
        
    if (this.auditData) {
        this.audits.getAuditById(this.auditData.data.id).subscribe((response) => {
            if (!response.output) {
                return;
            }
            const data = new AuditDTO().deserialize(response.output);
            this.data = data;            
            this.auditRecordForm.patchValue(data);
            this.auditRecordForm.get('totalIndicadores').disable();

            this.trackingStatusForm();
        });
    } else {
        this.trackingStatusForm();
    }
  }

  private trackingStatusForm(): void {
    this.subscription.add(this.auditRecordForm.statusChanges.subscribe(() => (this.edit = true)));
  }

  submit(): void {
    this.auditRecordForm.markAllAsTouched();
    if (this.auditRecordForm.invalid) {
//        Alert.error('Verifique que los campos sean correctos');
        this.basicNotification.notif("warning","Verifique que los campos sean correctos");
        return;
    }
    clearForm(this.auditRecordForm);
    const tmp = this.auditRecordForm.getRawValue();
    const auditoria: AuditDTOV1 = new AuditDTOV1().deserialize(tmp);

    if (this.data.id) {
        auditoria.id = this.data.id;
        auditoria.nombre = tmp.nombre;
        auditoria.totalIndicadores = tmp.totalIndicadores; 
        auditoria.activo = this.estatusRecord;
        
        this.audits.updateAudit(auditoria).subscribe((response) => {
          console.log(response.exito);
          if (response.exito){
            this.ref.close(true);
            this.basicNotification.notif("success","Proceso de evaluación actualizado correctamente");

          } else {
            this.ref.close(true);
            this.basicNotification.notif("success","Proceso de evaluación creado correctamente");

          }
          });
    } else {
      auditoria.nombre = auditoria.nombre;
      auditoria.totalIndicadores = auditoria.totalIndicadores;
      auditoria.fechaCreacion = new Date();
      auditoria.usuarioCreacion = this.users.userSession.id;
      this.audits.createAudit(auditoria).subscribe(() => {
          //Alert.success('', 'Evaluación correctamente');
          this.ref.close(true);
          this.basicNotification.notif("success","Proceso de evaluación creado correctamente");
      });
      //this.createBasicNotification("error","Error, validar");

    }
  }

  closeModalByConfimation(): void {
    Alert.confirm('Alerta', '¿Está seguro de que desea salir? Los datos ingresados no serán guardados.').subscribe(
        (result) => {
            if (!result || !result.isConfirmed) {
                return;
            }
            this.ref.close(result);
        }
    );
  }


  changeStatusDescription($event: any): void {
    const estatusRecord: boolean = $event.checked ;
    this.estatusRecord = estatusRecord;
    this.estatus = estatusRecord ? "Activo":"Inactivo";
    
}

  
  
}
