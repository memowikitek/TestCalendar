import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DetailsIndicatorDTOV1 } from 'src/app/utils/models';
import { EvidencesRecordService } from '../../modals';
import { DetailsIndicatorAllEvidencesDTOV1 } from 'src/app/utils/models/detailsAllEvidence.dto';
import { DetailsIndicatorsService } from 'src/app/core/services';
import { DetailsIndicatorEvidenciaDTOV1 } from 'src/app/utils/models/detalles-indicador-evidencia.dto';
import { Alert } from 'src/app/utils/helpers';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';
import saveAs from 'file-saver';

@Component({
  selector: 'app-evidence-indicators-control',
  templateUrl: './evidence-indicators-control.component.html',
  styleUrls: ['./evidence-indicators-control.component.scss']
})
export class EvidenceIndicatorsControlComponent implements OnInit{
  @Input() indicadorData: any;
  @Input() permissions: string[];
  dataSourceEvidences: MatTableDataSource<DetailsIndicatorDTOV1>;
  data: any[];

  constructor(    
  private readonly evidenceRecords: EvidencesRecordService,
  private detailsIndicator: DetailsIndicatorsService,
  private basicNotification : BasicNotification
  ){}

  ngOnInit(): void {
    this.getEvidences()
  }

  public addEvidence(): void {
    this.evidenceRecords
        .open(this.dataSourceEvidences.data)
        .afterClosed()
        .subscribe(() => this.getEvidences());
  }

  public getEvidences(): void {
    const {indicadorId} = this.indicadorData;
    let filtro = {"indicadorId":indicadorId}
    const newIndicador: DetailsIndicatorAllEvidencesDTOV1 = new DetailsIndicatorAllEvidencesDTOV1();
    this.detailsIndicator.getEvidences(filtro).subscribe((response:any) => {
      this.data = response.output.map((detailsIndicator:any) => new DetailsIndicatorEvidenciaDTOV1().deserialize(detailsIndicator));
      this.dataSourceEvidences = new MatTableDataSource(this.data);    
    });
  }

  deleteEvidencia(indicador: DetailsIndicatorEvidenciaDTOV1): void {
    Alert.confirm('Eliminar Evidencia', `¿Deseas eliminar la evidencia?`).subscribe((result) => {
      if (!result || !result.isConfirmed) {
        return;
      };
        this.detailsIndicator.deleteEvidencia(indicador).subscribe(() => {
          this.getEvidences()
          this.basicNotification.notif("success",'Evidencia eliminada correctamente', 5000);
        })
    });
  }
  
  downloadFile(indicador: DetailsIndicatorEvidenciaDTOV1): void {  
    let id = indicador.archivoAzureId;
    let file = indicador.nombreArchivo;
        var fileExt = file.split('.');
        if (fileExt.length > 1){
            this.detailsIndicator.downloadAzureStorageFile(id).subscribe((res:any) => {
                saveAs(res, file);
            });
        }

  }
  
  viewFile(indicador: DetailsIndicatorEvidenciaDTOV1): void {  
    let file = indicador.nombreArchivo;
    this.detailsIndicator.downloadAzureStorageFile(indicador.archivoAzureId).subscribe((res:any) => {
      let blob = new Blob([res], { type: 'application/pdf' });
      let pdfUrl = window.URL.createObjectURL(blob);
      var PDF_link = document.createElement('a');
      PDF_link.href = pdfUrl;
      window.open(pdfUrl, '_blank');
      PDF_link.download = file;
      PDF_link.click();
    });
  }
  canViewFile(indicador: DetailsIndicatorEvidenciaDTOV1) : boolean{
    let file = indicador.nombreArchivo;

    if(file){
        if (file.includes('.pdf')){
            return true;      
        }
    }
    return false
  }
  canDownloadFile(indicador: DetailsIndicatorEvidenciaDTOV1) : boolean{
    let file = indicador.nombreArchivo;

      if(file){
          var fileExt = file.split('.');
          if (fileExt.length < 2) // no tiene extension
          {
              return false;
          }
          if (!file.includes('.pdf')){
              return true;      
          }
      }

      return false;
  }

  checkPermission(p: string): boolean {
    return this.permissions?.some(r => r.trim() == p.trim())
  }
  
}
