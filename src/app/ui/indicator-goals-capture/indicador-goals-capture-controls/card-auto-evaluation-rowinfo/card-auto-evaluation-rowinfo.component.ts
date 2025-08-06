import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import Quill from 'quill';
import BlotFormatter, { DeleteAction, ImageSpec, ResizeAction } from 'quill-blot-formatter';
import { QuillModule } from 'ngx-quill';
import { Alert } from 'src/app/utils/helpers';
import { ModalConfirmationAutoreviewComponent } from './modal-confirmation-autoreview/modal-confirmation-autoreview.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';


Quill.register('modules/blotFormatter', BlotFormatter);

class CustomImageSpec extends ImageSpec {
  getActions() {
    return [ResizeAction, DeleteAction];
  }
}

@Component({
  selector: 'app-card-auto-evaluation-rowinfo',
  templateUrl: './card-auto-evaluation-rowinfo.component.html',
  styleUrls: ['./card-auto-evaluation-rowinfo.component.scss']
})
export class CardAutoEvaluationRowinfoComponent implements OnInit {
  @Input() dataRow: any;
  @Output() seleccionaRow = new EventEmitter<any>();
  @Output() activaRetroalimentacion = new EventEmitter<any>();
  @Output() guardarComentarioRetroalimentacion = new EventEmitter<any>();
  // @Output() cancelarComentarioRetroalimentacion = new EventEmitter<any>();
  quillEditorModuleOptions: any;
  txtComentario = '';
  /**
   *
   */
  constructor(private ref: ChangeDetectorRef,
  ) {
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
  }
  ngOnInit(): void {
    this.txtComentario = this.dataRow.comentarioRetro;
  }

  checkActivaRetroalimentacion(event: any) {

    let text = 'El objetivo de esta sesión de retroalimentación es revisar con el responsable de área el puntaje y el cumplimiento de acciones de acuerdo con la rúbrica, para confirmar o realizar los ajustes necesarios. '
    +'<br /> <br /> Una vez seleccionada esta opción, no podrá desmarcarse. Confirma que sí te encuentras en la sesión con el responsable de área.';
    Alert.confirmSession('Confirmación', text).subscribe((result) => {
      if (!result || !result.isConfirmed) {
        setTimeout(() => {
          this.dataRow.sesionRetro = null;
        }, 500);

        this.ref.detectChanges();
        
        setTimeout(() => {
          this.dataRow.sesionRetro = false;
          this.ref.detectChanges();
        }, 1000);

      }
      else {
        this.dataRow.comentarioRetro =  this.txtComentario;;
        this.dataRow.sesionRetro = true;
        event.dataRow = this.dataRow;
        this.activaRetroalimentacion.emit(this.dataRow);
      }
    });
  }


  revisionAutoevaluacion() 
  {
    this.seleccionaRow.emit(this.dataRow);
    localStorage.setItem("retroE5", JSON.stringify({
      menu3: 'Etapa 5 Revisión de la Autoevaluación',
      url3:'/indicator-goals-capture/autoevaluation-review-capture-campusdeparea',
      menu4: this.dataRow.campus + ' | ' + this.dataRow.areaResponsable
    }));
  }

  contentChanged(contentChangedEvent: any) {
    // contentChangedEvent.html
    // console.log(contentChangedEvent);
    this.txtComentario = contentChangedEvent.html;
  }

  guardaComentario() 
  {
    this.dataRow.comentarioRetro = this.txtComentario;
    this.guardarComentarioRetroalimentacion.emit(this.dataRow);
  }

}
