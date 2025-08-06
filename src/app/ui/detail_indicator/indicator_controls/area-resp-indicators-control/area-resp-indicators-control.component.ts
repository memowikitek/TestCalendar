import { Component, Input, OnInit } from '@angular/core';
import { AreaResponsableService } from '../../modals';
import { DetailsIndicatorsService } from 'src/app/core/services';
import { DetailsIndicatorResponsableDTOV1 } from 'src/app/utils/models/detalles-indicador-responsable.dto';
import { MatTableDataSource } from '@angular/material/table';
import { AresponsableDTO, DetailsIndicatorDTOV1 } from 'src/app/utils/models';
import { Alert } from 'src/app/utils/helpers';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';

@Component({
  selector: 'app-area-resp-indicators-control',
  templateUrl: './area-resp-indicators-control.component.html',
  styleUrls: ['./area-resp-indicators-control.component.scss']
})
export class AreaRespIndicatorsControlComponent  implements OnInit {
  
  @Input() indicadorData: any;
  @Input() permissions: string[];
  data: any[];
  dataSourceAreas: MatTableDataSource<DetailsIndicatorDTOV1>;

  
  constructor(
    private readonly arearesponsableRecords: AreaResponsableService,
    private detailsIndicator: DetailsIndicatorsService,
    private basicNotification : BasicNotification
  ) {}

  ngOnInit(): void {
   this.getAreas();
  }

  public addResponsable(): void {
    this.arearesponsableRecords
        .open()
        .afterClosed()
        .subscribe(() => this.getAreas());
  }

  public getAreas(): void {
    const {indicadorId} = this.indicadorData; 
    let filtro = {"indicadorId":indicadorId}
    this.detailsIndicator.getAreas(filtro).subscribe((response:any) => { //console.log('output:',response.output);
      this.data = response.output.map((detailsIndicator:any) => new DetailsIndicatorResponsableDTOV1().deserialize(detailsIndicator));
      this.dataSourceAreas = new MatTableDataSource(this.data);    
    });
  }

  deleteAreaResp(indicador: AresponsableDTO): void {//console.log(indicador);
    Alert.confirm('Eliminar Área responsable', `¿Deseas eliminar el Área responsable?`).subscribe((result) => {
      if (!result || !result.isConfirmed) {
        return;
      };
      this.detailsIndicator.deleteAreaResp(indicador).subscribe(() => {
        this.getAreas()
        this.basicNotification.notif("success",'Área responsable eliminada correctamente', 5000);
      })
    });
  }
  checkPermission(p: string): boolean {
    return this.permissions?.some(r => r.trim() == p.trim())
  }
  
}
