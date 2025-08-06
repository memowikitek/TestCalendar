import { Component, OnInit,Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DetailsIndicatorsService } from 'src/app/core/services';
import { rubricaData } from 'src/app/core/services/api/details-indicators/details-indicators.service';
import { Alert, clearForm } from 'src/app/utils/helpers';
import { RubricaEscalaDTOV1 } from 'src/app/utils/models/config-rubrica-escala.dto.v1';
import { RubricasDTOV1 } from 'src/app/utils/models/rubricas-v1.dto';
import { RubricaData, RubricaServiceService } from './rubrica-service.service';
import { Subscription } from 'rxjs';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';
import Quill from 'quill';
import BlotFormatter, { DeleteAction, ImageSpec, ResizeAction } from 'quill-blot-formatter';
import { QuillModule } from 'ngx-quill';

export enum ModalTitle {
  NEW = 'Nuevo requisito a cumplir y condiciones de calidad a demostrar',
  EDIT = 'Editar requisito a cumplir y condiciones de calidad a demostrar',
}

Quill.register('modules/blotFormatter', BlotFormatter);

class CustomImageSpec extends ImageSpec {
    getActions() {
        return [ResizeAction, DeleteAction];
    }
}

@Component({
  selector: 'app-rubrica-record',
  templateUrl: './rubrica-record.component.html',
  styleUrls: ['./rubrica-record.component.scss']
})
export class RubricaRecordComponent implements OnInit {
  RubricaRecordForm: FormGroup;
  subscription: Subscription;

  data: any[];
  dataSourceRubricas: any;
  nombreMIList: any;
  nombreMIListCatalog: any;
  title: ModalTitle;
  edit: boolean;
  datos: RubricasDTOV1;
  banderaRubrica = true;
  quillEditorModuleOptions: any;
  condicionCalidad: string;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public readonly rubricaData: RubricaData,
    private readonly formBuilder: FormBuilder,
    private readonly ref: MatDialogRef<never>,
    private detailsIndicator: DetailsIndicatorsService,
    //public readonly auditData: RubricaData,
    private readonly rubricas: DetailsIndicatorsService,
    private basicNotification : BasicNotification
  ) {
//    this.edit = true;
 //   this.title = ModalTitle.NEW;
    this.RubricaRecordForm = this.formBuilder.group({      
        //id: [null, []],
        descripcion: [null, []],
        requisitoCondicion: [null, []],
    });           
   }

   contentChanged(contentChangedEvent: any) {
     this.condicionCalidad = contentChangedEvent.html;
    }

  ngOnInit(): void {

    this.quillEditorModuleOptions = {
      blotFormatter: {
          specs: [CustomImageSpec],
      },
      syntax: false, // Include syntax module
      toolbar: [
          ['bold', 'italic', 'underline', 'strike', 'clean'], // toggled buttons
          [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
      ],
  };

    this.getRubricas();
    this.getRubricasCatalog();
    const tmp = this.RubricaRecordForm.getRawValue();    
    this.RubricaRecordForm.markAllAsTouched();
    clearForm(this.RubricaRecordForm);
    const rubrica: RubricasDTOV1 = new RubricasDTOV1().deserialize(tmp);
    const idUser = JSON.parse(localStorage.getItem('session'));

    if (this.rubricaData != null){
      this.banderaRubrica = false;

      this.title = ModalTitle.EDIT;
      //console.log(this.rubricaData.dataSave);
      let datos = new RubricasDTOV1().deserialize(this.rubricaData.dataSave);
      this.RubricaRecordForm.patchValue(datos);
      this.RubricaRecordForm.get('descripcion')?.setValue(datos.escalaRubricaId);
      this.RubricaRecordForm.get('requisitoCondicion')?.setValue(datos.requisitoCondicion);
    } else {
      this.title = ModalTitle.NEW;
    }
  }

  private trackingStatusForm(): void {
    this.subscription.add(this.RubricaRecordForm.statusChanges.subscribe(() => (this.edit = true)));
  }


  submit(): void {
    //console.log(this.rubricaData);
    let catalogoMision;
    const tmp = this.RubricaRecordForm.getRawValue();    
    const idUser = JSON.parse(localStorage.getItem('session'));
    let rubrica: RubricasDTOV1 = new RubricasDTOV1().deserialize(tmp);      
    
    for(var i in this.nombreMIListCatalog)
    { 
        if (tmp.descripcion === this.nombreMIListCatalog[i].id){
          catalogoMision = this.nombreMIListCatalog[i];
        }
    }
    rubrica.indicadorId =JSON.parse(localStorage.getItem('idIndicadorSiac')).indicadorId;
    rubrica.escalaRubricaId = catalogoMision.id;        
    rubrica.descripcion = catalogoMision.descripcion;
    rubrica.activo = true;
    rubrica.fechaCreacion = null;
    rubrica.usuarioCreacion = idUser.id;
    rubrica.fechaModificacion = null;
    rubrica.usuarioModificacion = null;
/*
    rubrica.procesoEvaluacionId =JSON.parse(localStorage.getItem('idIndicadorSiac')).procesoEvaluacionId;
    rubrica.componenteId =JSON.parse(localStorage.getItem('idIndicadorSiac')).componenteId;
    rubrica.elementoEvaluacionId =JSON.parse(localStorage.getItem('idIndicadorSiac')).elementoEvaluacionId;
    rubrica.areaCentralId =JSON.parse(localStorage.getItem('idIndicadorSiac')).areaCentralId;
    rubrica.subAreaCentralId =JSON.parse(localStorage.getItem('idIndicadorSiac')).subAreaCentralId;        

*/
    if (this.rubricaData != null){
      let datos = new RubricasDTOV1().deserialize(this.rubricaData.dataSave);
//      rubrica.rubricaEvaluacionId = datos.rubricaEvaluacionId;        
      rubrica.rubricaEvaluacionId = datos.rubricaEvaluacionId;        
      rubrica.requisitoCondicion = tmp.requisitoCondicion;
      rubrica.escala = catalogoMision.escala;        
      //console.log(rubrica);
      rubrica.usuarioModificacion = idUser.id;
      this.detailsIndicator.getRubricaUpdate(rubrica).subscribe(() => {
        // Alert.success('', 'Rubrica actualizada correctamente');
        this.basicNotification.notif("success",'Rúbrica actualizada correctamente', 5000);
        this.ref.close(true);
      });
    } else 
    {
      rubrica.requisitoCondicion = tmp.requisitoCondicion;
      rubrica.escala = tmp.descripcion;        

      //console.log(rubrica);

      this.detailsIndicator.createRubrica(rubrica).subscribe(() => {
        // Alert.success('', 'Rubrica creada correctamente');
        this.basicNotification.notif("success",'Rúbrica creada correctamente', 5000);
        this.ref.close(true);
      });

    }
  }

public getRubricas(): void {
  let resultado;
  this.detailsIndicator.getAllRubrica().subscribe((response) => {
    //console.log(response.output);
    this.nombreMIList = response.output;
    
    //console.log(response.output);
    //this.data = response.output.map((detailsIndicator) => new RubricasDTOV1().deserialize(detailsIndicator));
//      resultado = this.data.filter(e => e.escala == 6);
//    console.log(resultado[0].tblIndicadoresRubrica[0].tblIndicadoresRubrica);
   //this.dataSourceRubricas = new MatTableDataSource(this.data);    
  });
}
public getRubricasCatalog(): void {
  this.detailsIndicator.getAllRubricaCatalog().subscribe((response) => {
    this.nombreMIListCatalog = response.output;    
    //console.log(this.nombreMIListCatalog);
 });
}


closeModalByConfimation(): void {
    this.ref.close();
    // Alert.confirm('Alerta', '¿Está seguro de que desea salir? Los datos ingresados no serán guardados.').subscribe(
    //     (result) => {
    //         if (!result || !result.isConfirmed) {
    //             return;
    //         }
    //         this.ref.close(result);
    //     }
    // );
}


}
