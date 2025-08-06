import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/shared';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { CicloEvaDTOV1, TablePaginatorSearch, Vista } from 'src/app/utils/models';
import { SettingsWelcomeService, UsersService } from 'src/app/core/services';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-welcome-new',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './welcome-new.component.html',
  styleUrl: './welcome-new.component.scss',
  providers: [DatePipe] // Agregar DatePipe como provider
})
export default class WelcomeNewComponent {
  thisAccess: Vista;
  permission: boolean;
  permissions: boolean[];
  pageIndex: number;
  pageSize: number;
  length: number;
  filters: TablePaginatorSearch;
  dataSource: MatTableDataSource<CicloEvaDTOV1>;
  data: CicloEvaDTOV1[];
  showCard: boolean = false;
  ciclos: any;
  proceso: any;
  rol: any;
  pagesChild: boolean;
  areaPerfil: string;

  constructor(
    private readonly router: Router,
    private datePipe: DatePipe,
    private readonly config: SettingsWelcomeService,
    private users: UsersService
  ) {
    this.permission = null;
    this.thisAccess = new Vista();
    this.permissions = [false, false, false];

    const {areaResponsablesPerfil } = this.users.userSession;
    this.areaPerfil = (areaResponsablesPerfil == 'ACADEM') ? 'Academia' : 'Finanzas'; 
  }

  ngOnInit(): void {
    this.getProcess();
  }

  //METHODS

  getProcess() {
    const process = JSON.parse(localStorage.getItem('process')); //console.log(process);
    if (process) {
      const { rol, proceso } = process;
      this.proceso = proceso;
    }
  }

  fechaActual() {
    let date = new Date();
    let day = date.getDate();
    let dd = (day < 10) ? `0${day}` : day;
    let month = date.getMonth() + 1;
    let mm = (month < 10) ? `0${month}` : month;
    let yy = date.getFullYear();
    let fecha = `${yy}-${mm}-${dd}`;
    return fecha;
  }

  private setPermissions(): void {
    this.permissions = this.thisAccess.getPermissions(
      this.users.userSession.modulos,
      this.users.userSession.vistas,
      this.router.url
    );
  }

  checkPermission(p: number): boolean {
    //todo: revisar seguridad
    return true;
    return this.permissions[p];
  }
}
