import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { fromEvent, Subject } from 'rxjs';
import { UsersService, NotificationsService } from 'src/app/core/services';
import { Auth } from 'src/app/utils/helpers';
import { Perfil, UserSession, BuzonNotificacionesAllDTO } from 'src/app/utils/models';
import { environment } from 'src/environments/environment';
import { SidenavService } from './menu-mat/sidenav.service';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
    @ViewChild('rightSidenav') rightSidenav: MatSidenav; // Referencia al sidenav derecho
    isDesktopMode: boolean;
    showSubmenuCatalogs: boolean;
    showSubmenuSeguridad: boolean;
    showSubmenuCatalogsFIMPES: boolean;
    showSubmenuConfigurations: boolean;
    showSubmenuOperations: boolean;
    showSubmenuMatrizUvm: boolean;
    showSubmenuMetasIndicador: boolean;
    showSubmenuMetasResultados: boolean;
    DatosSesion: Perfil;
    wscreen: boolean;
    arrScreen = [
        '/ciclo-detalles',
        '/evaluation-generation'
    ];
    private readonly _destroying$ = new Subject<void>();
    private name: string;
    rol: any;
    proceso: any;
    numNoti: any = null;

    constructor(
        private authService: MsalService,
        private readonly router: Router,
        private readonly users: UsersService,
        private sidenavService: SidenavService,
        private readonly NotiService: NotificationsService,
    ) {
        this.DatosSesion = Auth.getSession();

        this.isDesktopMode = true;
        this.isDesktopMode = null;
        this.name = null;
        this.showSubmenuCatalogs = null;
        this.showSubmenuSeguridad = null;
        this.showSubmenuConfigurations = null;
        this.showSubmenuCatalogsFIMPES = null;
        this.showSubmenuOperations = null;
        this.showSubmenuMatrizUvm = null;
        this.showSubmenuMetasResultados = null;
        this.showSubmenuMetasIndicador = null;
    }

    ngOnInit(): void {
        this.trackingResizeWindow();
        setTimeout(() => {
            this.name = this.DatosSesion.nombre;
            this.openSubMenu();
        }, 500);

        this.sidenavService.toggleSidenav$.subscribe(() => {
            // Aquí accede al rightSidenav y realiza la acción necesaria
            // Asegúrate de tener una referencia al rightSidenav
            //console.log('hola mundo aoeuaoeuaoeuaoeuaoeuaoeua');
            if (this.rightSidenav) {
                this.rightSidenav.toggle(); // Alternar el sidenav derecho
            }
        });
        if (!this.getCurrentRoute.includes('/seleccion-proceso')) {
            this.getProcess();
        }
        const {id} = this.users.userSession;
        //this.getNotificacionId(id);
    }

    //METHODS
    private getNotificacionId(Id: number): void {
        this.NotiService.getAllBuzonByUsuarioIdVisor(Id).subscribe((response) => {//console.log(response.output);
            if (response.output) {
                const data = response.output.map((res) => new BuzonNotificacionesAllDTO().deserialize(res));
                const noLeidas = data.filter((x)=>!x.estatus);
                if (noLeidas.length != 0) {
                    this.numNoti = noLeidas.length; 
                }
            }
        });
    }

    get currentUserName(): string {
        return this.name;
    }

    get getCurrentRoute(): string {
        return this.router.url;
    }

    private trackingResizeWindow(): void {
        fromEvent(window, 'resize').subscribe((event) => {
            const windowEvent = event.target as Window;
            if (windowEvent.innerWidth > 767) {
                this.isDesktopMode = true;
            } else {
                this.isDesktopMode = false;
            }
        });
        if (window.innerWidth > 767) {
            this.isDesktopMode = true;
        } else {
            this.isDesktopMode = false;
        }
    }

    private openSubMenu(): void {
        if (this.getCurrentRoute.includes('/catalogos')) {
            this.showSubmenuCatalogs = true;
        } else if (this.getCurrentRoute.includes('/seguridad')) {
            this.showSubmenuSeguridad = true;
        } else if (this.getCurrentRoute.includes('/catalogosfimpes')) {
            this.showSubmenuCatalogsFIMPES = true;
        } else if (this.getCurrentRoute.includes('/configuracion')) {
            this.showSubmenuConfigurations = true;
        } else if (this.getCurrentRoute.includes('/operacion')) {
            this.showSubmenuOperations = true;
        } else if (this.getCurrentRoute.includes('/matriz-uvm')) {
            this.showSubmenuMatrizUvm = true;
        } else if (this.getCurrentRoute.includes('/metas-indicador')) {
            this.showSubmenuMetasIndicador = true;
        } else if (this.getCurrentRoute.includes('/metas-resultados')) {
            this.showSubmenuMetasResultados = true;
        }
    }

    getProcess() {
        const process = JSON.parse(localStorage.getItem('process')); //console.log(process);
        if (process) {
            const { rol, proceso } = process;
            this.rol = rol;
            this.proceso = proceso;
        }
    }

    miPerfil(): void {
        window.location.assign("/mi-perfil");
    }

    logout() {
        this.users.userSession = new Perfil();
        Auth.logout();
        this.authService.logoutRedirect({
            postLogoutRedirectUri: environment.msal.redirect,
        });
    }

    ngOnDestroy(): void {
        this._destroying$.next(undefined);
        this._destroying$.complete();
    }
}
