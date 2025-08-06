import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/core/services';
import { CicloEva, EvaluationCycleService } from 'src/app/core/services/api/evaluation-cycle/evaluation-cycle.service';
import { TablePaginatorSearch, Vista } from 'src/app/utils/models';
import { CEIndicadorEtapa1CampusDto } from 'src/app/utils/models/ceindicador-etapa1-campus.dto';
import { EstatusEtapa6Plandemejora } from 'src/app/utils/models/enums-estatus-etapas';
import { PermisosHeredadosDTO } from 'src/app/utils/models/permisos-heredados.dto';

@Component({
  selector: 'app-table-ceindicators-ri',
  templateUrl: './table-ceindicators-ri.component.html',
  styleUrls: ['./table-ceindicators-ri.component.scss']
})
export class TableCeindicatorsRiComponent {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild('input', { static: true }) inputSearch: ElementRef;
  @ViewChild('paginator', { static: true }) readonly paginator: MatPaginator;

  @Input() dataSource: MatTableDataSource<CEIndicadorEtapa1CampusDto>;
  @Input() columns: any;

  @Output() PaginatorChange = new EventEmitter<PageEvent>();
  @Output() FuncionEditar = new EventEmitter<any>();
  @Output() FuncionCaptureRevisor = new EventEmitter<any>();
  @Output() FuncionVer = new EventEmitter<any>();
  @Output() FuncionVerComentario = new EventEmitter<any>();
  @Output() FuncionaAceptarEvidencia = new EventEmitter<any>();
  filters: TablePaginatorSearch;
  @Input() pageIndex: number;
  @Input() pageSize: number;
  @Input() length: number;
  @Input() esUsuarioACentral = true;
  @Input() esAutorizadorNa = true;
  @Input() tipoVista: any;

  @Input() etapaId: number;
  @Input() esvista = false;

  @Input() revIns: any;

  permissions: string[];
  listaEstatusPedientes: any;

  

  constructor(private users: UsersService, private access: Vista, private router: Router,
    private evaCService: EvaluationCycleService) {
    this.dataSource = new MatTableDataSource<CEIndicadorEtapa1CampusDto>;
    this.tipoVista = users.userSession.tipoRol;
  }

  ngOnInit(): void { 
    this.evaCService.getEstatusEtapa(this.etapaId).subscribe((resp: any) => {
      this.listaEstatusPedientes = resp;
    });
    this.setPermissions();
  }


  paginatorChange(event: PageEvent): void {
    this.PaginatorChange.emit(event);
    //  this.filters.pageSize = event.pageSize;
    //  this.filters.pageNumber = event.pageIndex; 
    // this.getAllCicloEvaIndicadores(this.filters);
  }

  checkPermission(p: string): boolean {
    if (this.etapaId ==  5){
      return true
    }
    return this.permissions?.some(r => r.trim() == p.trim())
  }


  private setPermissions(): void {
    var permisolHeredadoList: PermisosHeredadosDTO[] = JSON.parse(localStorage.getItem('permisosHeredados'));
    var permisolHeredado = permisolHeredadoList.find(p => p.vistaHijo == this.router.url)
    this.permissions = this.access.getPermissionsV2(this.users.userSession.permisosRolesVistas, permisolHeredado.vistaPadre);
  }


  funcionEditar(event: any) {
    this.FuncionEditar.emit(event);
  }

  funcionCaptureRevisor(event: any){
    this.FuncionCaptureRevisor.emit(event);
  }

  funcionVer(event: any) {
    this.FuncionVer.emit(event);
  }

  funcionaAceptarEvidencia(evet: any) {
    this.FuncionaAceptarEvidencia.emit(evet);
  }

  visualizaEditar(element: any) {
    
    if (this.esvista){
      return false;
    }

    if (this.esUsuarioACentral) {
      return false;
    }

    return true; // solo puede visualizar si el usuario NO es usuario central
  }

  visualizaEditarUsuCentralAutorizador(element: any): boolean {

    if (this.esvista){
      return false;
    }

    if (!this.esUsuarioACentral) // solo puedde visualizarse en usuariocentral
    {
      return false;
    }

    if (!this.esAutorizadorNa) // solo puedde visualizarse en usuariocentral
    {
      return false;
    }

    if(this.etapaId == 6) // en etapa 6 puede haber aparte de NA etapas esperando por por autorizacion de NR
    {

      if (element.estatusEtapa === EstatusEtapa6Plandemejora.noSeRealiza_EnRevisión 
         || element.estatusEtapa === EstatusEtapa6Plandemejora.noSeRealiza_Autorizado
         || element.estatusEtapa === EstatusEtapa6Plandemejora.noSeRealiza_No_Autorizado
      )
      {
        return true
      }
      else{
        return false
      }
    }

    let existeEstatus = this.listaEstatusPedientes.findIndex((ele: any) => ele.estatusId === element.estatusEtapa && (ele.descripcion.includes('en revisión') || ele.descripcion.includes('no autorizado') || ele.descripcion.includes('autorizado')));
    if (existeEstatus == -1) // no existe en los estatus para visualizar
    {
      return false;
    }
    return true;
  }

  visualizaEditarNaDeshabilitado(element: any): boolean {
    
    if (this.esvista){
      return false;
    }

    if (!this.esUsuarioACentral) // solo puedde visualizarse si el usuario no es de area central
    {
      return false;
    }

    if (!this.esAutorizadorNa) // solo puedde visualizarse en usuariocentral
    {
      return false;
    }

    
    if(this.etapaId == 6) // en etapa 6 puede haber aparte de NA etapas esperando por por autorizacion de NR
    {
      if (element.estatusEtapa === EstatusEtapa6Plandemejora.noSeRealiza_EnRevisión
        || element.estatusEtapa === EstatusEtapa6Plandemejora.noSeRealiza_Autorizado
        || element.estatusEtapa === EstatusEtapa6Plandemejora.noSeRealiza_No_Autorizado
      ) {
        return false
      }
      else {
        return true
      }
    }

    let existeEstatus = this.listaEstatusPedientes.findIndex((ele: any) => ele.estatusId === element.estatusEtapa);
    if (existeEstatus != -1) // si existe en los estatus para visualizar no se muestra el boton inhabilitado
    {
      return false;
    }

    return true;

  }

  visualizaAceptarDeshabilitado(element: any) {


    if (!this.esUsuarioACentral) // solo puedde visualizarse si el usuario no es de area central
    {
      return false;
    }

    if (!this.esAutorizadorNa) // solo puedde visualizarse en usuariocentral
    {
      return false;
    }

    
    if (this.etapaId != 2) // retorna false si no es evidencias
    {
      return false;
    }
    
    
    // retorna false si no es evidencias
    if ((element.estatusEtapa == 2 || element.estatusEtapa == 3 || element.estatusEtapa == 4 )) {
      return false;
    }

    return true;
  }

  visualizaAceptar(element: any) {
        
    if (!this.esUsuarioACentral) // solo puedde visualizarse en usuariocentral
    {
      return false;
    }

    if (!this.esAutorizadorNa) // solo puedde visualizarse en usuariocentral
    {
      return false;
    }

    if (this.etapaId != 2) // retorna false si no es evidencias
    {
      return false;
    }

    
    // retorna false si no es evidencias
    if ((element.estatusEtapa == 1 || element.estatusEtapa == 5 || element.estatusEtapa == 6 || element.estatusEtapa == 7)) {
      return false;
    }
   
    return true;

  }

  visualizaComentario(element: any) : boolean{
    if (this.etapaId != 5 || !element.comentarioRetro || !this.esAutorizadorNa) // retorna false si no es etapa 5 o no tiene comentario para mostrar o no eres autorizador
    {
      return false;
    }
    return true;
  }

  funcionVerComentario(element: any){
    this.FuncionVerComentario.emit(element);
  }

  visualizaComentarioDeshabilitado(element: any)
  {
    if (this.etapaId == 5 && !element.comentarioRetro && this.esAutorizadorNa) // si es estapa 5 y tienen datos el campo comentarios
    {
      return true;
    }
 
    return false;
  }
}
