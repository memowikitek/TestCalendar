import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import Quill from 'quill';
import BlotFormatter, { DeleteAction, ImageSpec, ResizeAction } from 'quill-blot-formatter';
import { QuillModule } from 'ngx-quill';
import { Alert } from 'src/app/utils/helpers';

Quill.register('modules/blotFormatter', BlotFormatter);

class CustomImageSpec extends ImageSpec {
  getActions() {
    return [ResizeAction, DeleteAction];
  }
}

@Component({
  selector: 'app-modal-confirmation-autoreview',
  templateUrl: './modal-confirmation-autoreview.component.html',
  styleUrls: ['./modal-confirmation-autoreview.component.scss']
})
export class ModalConfirmationAutoreviewComponent {

  quillEditorModuleOptions: any;

  constructor() {
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

  contentChanged(contentChangedEvent: any) {
    // contentChangedEvent.html
    console.log(contentChangedEvent);
  }

  
  closeModal(){


  }

  guardar(){

  }
  
}
