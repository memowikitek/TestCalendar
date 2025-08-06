import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';

@Component({
    selector: 'app-sub-modal-file-evidence-config',
    templateUrl: './sub-modal-file-evidence-config.component.html',
    styleUrls: ['./sub-modal-file-evidence-config.component.scss'],
})
export class SubModalFileEvidenceConfigComponent implements OnInit {
    clave_evidencia = ''
    selected=''
    // tipoEvidencia : number = 1;
    indicativotipoevidencia = 'O';
    nomenclaturanombre = '22222_CCCCC_01_CCCCCCCCCC_FFFFFFFFFF_1111111111_444_P';
    tipoEvidencia: number = 0;
    justificacion: string = '';
    filename: string = '';
    matLabel: string = 'Seleccione archivo';
    tipoarchivo: number = 1; // 1 es archivo
    urlEvidencia: string = '';
    archivoBase64String: string = '';
    datarow : any;
    @ViewChild('fileInput') inputFileRef: ElementRef;
    constructor(
        public dialogRef: MatDialogRef<SubModalFileEvidenceConfigComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.datarow = data.row;
        this.nomenclaturanombre = data.nomFilename;
        if (this.datarow.formatoEvidencias){
            if (this.datarow.formatoEvidencias.length > 0){
                this.clave_evidencia = this.datarow.formatoEvidencias[0].evidencia.clave;
                this.nomenclaturanombre = this.nomenclaturanombre.replace("_O_","_" + this.clave_evidencia + "_O_");
            }
        }
    }

    ngOnInit(): void {}

    Onclose() {
        this.dialogRef.close(null);
    }

    onSave() {
        if (this.tipoarchivo == 2 && this.urlEvidencia) {
            // this.filename = this.nomenclaturanombre + '_' + this.indicativotipoevidencia;
            this.filename = this.nomenclaturanombre;
        }
        let tipoEvidencia = this.tipoEvidencia == 1 ? 'A' : 'O';
        // this.filename = this.filename.replace('indicativotipoevidencia', tipoEvidencia);
        this.dialogRef.close({
            tipoevidencia: tipoEvidencia,
            justificacion: this.justificacion,
            nombrearchivo: this.filename,
            url: this.urlEvidencia,
            archivoBase64String: this.archivoBase64String,
        });
    }

    onChangeEvidenceFile(event: any) {
        this.filename = event.target.files[0].name;
        var ext = this.filename.substring(this.filename.lastIndexOf('.') + 1);
        // this.filename = this.nomenclaturanombre + '_' + this.indicativotipoevidencia +'_' + '.' + ext;
        this.filename = this.nomenclaturanombre + '.' + ext;
        const reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = () => {
            this.archivoBase64String = reader.result.toString();
        };
    }

    public isvalid(): boolean {
        let evidenciaAdicional = true;
        if (this.tipoEvidencia == 1) evidenciaAdicional = this.justificacion.trim() != '';
        if (this.tipoarchivo == 1 && this.archivoBase64String) {
            return true && evidenciaAdicional;
        } else {
            if (this.tipoarchivo == 2 && this.urlEvidencia) {
                return true && evidenciaAdicional;
            }
        }

        return false;
    }

    onChangeClave(event: any)
    {
            this.filename = this.filename.replace(this.clave_evidencia,event.value);
            this.clave_evidencia = event.value;
    }
    tipoarchivoChange() {
        if (this.tipoarchivo == 2) {
            this.archivoBase64String = '';
            this.inputFileRef.nativeElement.value = '';
        } else {
            this.urlEvidencia = '';
        }

        this.indicativotipoevidencia = 'O';
        this.tipoEvidencia = 0;
        this.justificacion = '';
    }

    RadioTipoEvidencia(event : any){

        if (event.value == 1){
            this.indicativotipoevidencia = 'A';
            this.filename = this.filename.replace('_O_','_A_');
            return;
        }

        if (event.value == 0){
            this.indicativotipoevidencia = 'O';
            this.filename = this.filename.replace('_A_','_O_');
            return;
        }
    }
}
