import { Component, Input, OnInit } from '@angular/core';
import { DetailsIndicatorsService, IndicatorsService } from 'src/app/core/services';
import { IndicatorsRecordService } from 'src/app/ui/indicators/modals';
import { EvidencesRecordService, MisionRecordService, NormativeRecordService } from '../../modals';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';
import { DetailsIndicatorDTOV1, DetailsIndicatorNormativaDTOV1 } from 'src/app/utils/models';
import { MatTableDataSource } from '@angular/material/table';
import { Alert } from 'src/app/utils/helpers';

@Component({
  selector: 'app-normative-indicators-control',
  templateUrl: './normative-indicators-control.component.html',
  styleUrls: ['./normative-indicators-control.component.scss']
})
export class NormativeIndicatorsControlComponent implements OnInit {
  @Input() indicadorData: any;
  @Input() permissions: string[];
  data: any[]
  dataSource: MatTableDataSource<DetailsIndicatorDTOV1>;

  constructor(
    private readonly indicadoresRecord: IndicatorsRecordService,
    private indicadores: IndicatorsService,
    private detailsIndicator: DetailsIndicatorsService,
    private readonly normativeRecords: NormativeRecordService,
    private basicNotification : BasicNotification) { }

    
  ngOnInit(): void {
    this.getNormatives();
  }

  public getNormatives(): void {
    let resultado ;
    const {indicadorId} = this.indicadorData;
    let filtro = {"indicadorId":indicadorId}
    this.detailsIndicator.getNormatives(filtro).subscribe((response) => {
      this.data = response.output.map((detailsIndicator) => 
        new DetailsIndicatorNormativaDTOV1().deserialize(detailsIndicator)
        );        
        // resultado = this.data.filter(e => e.indicadorSiacid == indicadorId);
        this.dataSource = new MatTableDataSource(this.data); 
        // debugger;   
    });
  }

  public addNormativa(): void {
    this.normativeRecords
        .open(this.dataSource.data)
        .afterClosed()
        .subscribe(() => this.getNormatives());
  }

  deleteNormativa(indicador: DetailsIndicatorNormativaDTOV1): void {
    // console.log("ELIMINAR INDI "+indicador);
    Alert.confirm('Eliminar Normativa', `¿Deseas eliminar la normativa?`).subscribe((result) => {
      if (!result || !result.isConfirmed) {
        return;
      };
        this.detailsIndicator.deleteNormative(indicador).subscribe(() => {
          this.getNormatives()
          this.basicNotification.notif("success",'Normativa eliminada correctamente', 5000);
        })
    });
  }  

  checkPermission(p: string): boolean {
    return this.permissions?.some(r => r.trim() == p.trim())
  }
}
