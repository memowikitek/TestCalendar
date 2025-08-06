import { Component, Input, OnInit } from '@angular/core';
import { MisionRecordService } from '../../modals';
import { MatTableDataSource } from '@angular/material/table';
import { MisionDTO } from 'src/app/utils/models/mision.dto';
import { DetailsIndicatorsService } from 'src/app/core/services';
import { Alert } from 'src/app/utils/helpers';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';

@Component({
  selector: 'app-mi-indicators-control',
  templateUrl: './mi-indicators-control.component.html',
  styleUrls: ['./mi-indicators-control.component.scss']
})
export class MiIndicatorsControlComponent implements OnInit {

  @Input() indicadorData: any;
  @Input() permissions: string[];
  data: any[];
  dataSourceMision: MatTableDataSource<MisionDTO>;
  
  constructor
  (    
    private readonly misionRecords: MisionRecordService,
    private detailsIndicator: DetailsIndicatorsService,
    private basicNotification : BasicNotification
  ){}

  ngOnInit(): void {
    this.getMision();
  }

  public addMision(): void {
    this.misionRecords
      .open(this.dataSourceMision.data)
      .afterClosed()
      .subscribe(() => this.getMision());
  }

  public getMision(): void {
    const {indicadorId} = this.indicadorData;
    let filtro = {"indicadorId":indicadorId}
    this.detailsIndicator.getAllMision(filtro).subscribe((response) => {
      this.data = response.output.map((detailsIndicator) => new MisionDTO().deserialize(detailsIndicator));        
      this.dataSourceMision = new MatTableDataSource(this.data);    
    });
  }

  deleteMI(indicador: MisionDTO): void {//console.log(indicador);
    Alert.confirm('Eliminar Misión Institucional', `¿Deseas eliminar la Misión Institucional?`).subscribe((result) => {
      if (!result || !result.isConfirmed) {
        return;
      };
      this.detailsIndicator.deleteMision(indicador).subscribe(() => {
        this.getMision()
        this.basicNotification.notif("success",'Misión Institucional eliminada correctamente', 5000);
      });
    });
  }

  checkPermission(p: string): boolean {
    return this.permissions?.some(r => r.trim() == p.trim())
  }

}
