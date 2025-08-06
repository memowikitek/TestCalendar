import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DetailsIndicatorsService, IndicatorsService } from 'src/app/core/services';
import { CeRubricasDTOV1 } from 'src/app/utils/models/detalles-ce-rubricas-v1.dto';
import { RubricaServiceService } from '../../modals';
import { Alert } from 'src/app/utils/helpers';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';
import { MisionDTO } from 'src/app/utils/models/mision.dto';
import { DetailsCeIndicatorLectura } from 'src/app/utils/models/detalles-ce-indicador-lectura.dto';
import { TablePaginatorSearch } from 'src/app/utils/models';

@Component({
  selector: 'app-rubrica-indicators-control',
  templateUrl: './rubrica-indicators-control.component.html',
  styleUrls: ['./rubrica-indicators-control.component.scss']
})
export class RubricaIndicatorsControlComponent implements OnInit {
  filters: TablePaginatorSearch;
  @Input() indicadorData: any;
  @Input() permissions: string[];
  data: any[];
  dataSourceRubricasNA : any;    
  dataSourceRubricasDos : any;
  dataSourceRubricasCuatro : any;
  dataSourceRubricasSeis : any;
  dataSourceRubricasOcho : any;
  dataSourceRubricasDiez : any;
  dataSourceRubricas: MatTableDataSource<CeRubricasDTOV1>;
  nNA: any;
  ncero: any;
  ndos: any;
  ncuatro: any;
  nseis: any;
  nocho: any;
  ndiez: any;
  lecturaIndicador: DetailsCeIndicatorLectura;
  indLeer: boolean;


  constructor( private detailsIndicator: DetailsIndicatorsService,
    private readonly rubricaRecords: RubricaServiceService,
    private indicatorService: IndicatorsService,
    private basicNotification : BasicNotification
  ) {
    this.lecturaIndicador = new DetailsCeIndicatorLectura();
  }

  ngOnInit(): void {
    this.indicatorService.currentReadState.subscribe((valor: boolean) => {
      this.indLeer = valor;
    });
    this.getCeRubricas()
    this.getLecturaIndicador();
  }
  
  getLecturaIndicador() {
    const {etapaId, ObligadoLeerIndicador } = JSON.parse(localStorage.getItem('idIndicadorSiac'));
    if(etapaId > 0){
      this.indLeer = true;
    }
    else {
      this.indLeer = false;
    }
  }

  public getCeRubricas(): void {
    const {indicadorId, cicloEvaluacionId} = this.indicadorData;
    //let filtro = {"indicadorId":indicadorId, "cicloEvaluacionId":cicloEvaluacionId}
    const filters = new TablePaginatorSearch();
    filters.filter = {"indicadorId":indicadorId, "cicloEvaluacionId":cicloEvaluacionId}
    filters.pageSize = 40;//Limitado a 40 registros
    
    let NAList;
    let ceroList ;
    let dosList ;
    let cuatroList ;
    let seisList ;
    let ochoList ;
    let diezList ;
    this.detailsIndicator.getAllRubricaCeIndicadores(filters).subscribe((response) => {
      this.data = response.output.map((detailsIndicator) => new MisionDTO().deserialize(detailsIndicator));        
      NAList = this.data.filter(e => e.escala == -1 && e.indicadorId == indicadorId );
      ceroList = this.data.filter(e => e.escala == 0 && e.indicadorId == indicadorId );
      dosList = this.data.filter(e => e.escala == 2 && e.indicadorId == indicadorId );
      cuatroList = this.data.filter(e => e.escala == 4 && e.indicadorId == indicadorId );
      seisList = this.data.filter(e => e.escala == 6 && e.indicadorId == indicadorId );
      ochoList = this.data.filter(e => e.escala == 8 && e.indicadorId == indicadorId );
      diezList = this.data.filter(e => e.escala == 10 && e.indicadorId == indicadorId );
      this.dataSourceRubricasNA = new MatTableDataSource(NAList);    
      this.nNA = this.dataSourceRubricasNA.filteredData.length; //console.log(this.nNA);
      this.dataSourceRubricas = new MatTableDataSource(ceroList);
      this.ncero = this.dataSourceRubricas.filteredData.length; //console.log(this.ncero);
      this.dataSourceRubricasDos = new MatTableDataSource(dosList);
      this.ndos = this.dataSourceRubricasDos.filteredData.length; //console.log(this.ndos);
      this.dataSourceRubricasCuatro = new MatTableDataSource(cuatroList);
      this.ncuatro = this.dataSourceRubricasCuatro.filteredData.length; //console.log(this.ncuatro);
      this.dataSourceRubricasSeis = new MatTableDataSource(seisList);
      this.nseis = this.dataSourceRubricasSeis.filteredData.length; //console.log(this.nseis);
      this.dataSourceRubricasOcho = new MatTableDataSource(ochoList);
      this.nocho = this.dataSourceRubricasOcho.filteredData.length; //console.log(this.nocho);
      this.dataSourceRubricasDiez = new MatTableDataSource(diezList);
      this.ndiez = this.dataSourceRubricasDiez.filteredData.length; //console.log(this.ndiez);
    });
  }

  deleteCeRubrica(indicador: CeRubricasDTOV1): void {//console.log(indicador);
    Alert.confirm('Eliminar Rúbrica', `¿Deseas eliminar la Rúbrica?`).subscribe((result) => {
      if (!result || !result.isConfirmed) {
        return;
      };
      this.detailsIndicator.deleteCeRubrica(indicador).subscribe(() => {
        this.getCeRubricas();
        this.basicNotification.notif("success",'Rúbrica eliminada correctamente', 5000);
      });
    });
  }  

  editCeRubrica(rubricaDatos: CeRubricasDTOV1): void {
    this.rubricaRecords
        .open({ dataSave: rubricaDatos })
        .afterClosed()
        .subscribe(() => this.getCeRubricas());
  }

  public addCeRubrica(): void {
    this.rubricaRecords
        .open()
        .afterClosed()
        .subscribe(() => this.getCeRubricas());
  }

  checkPermission(p: string): boolean {
    return this.permissions?.some(r => r.trim() == p.trim())
  }
  
}
