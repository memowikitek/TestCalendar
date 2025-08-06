import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MsalBroadcastService, MsalGuardConfiguration, MsalService, MSAL_GUARD_CONFIG } from '@azure/msal-angular';
import { AccountInfo, InteractionStatus, RedirectRequest } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { AuthMsalService, UsersService } from 'src/app/core/services';
import { Alert, Auth } from 'src/app/utils/helpers';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';
import { Perfil } from 'src/app/utils/models';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: false
})
export class LoginComponent implements OnInit, OnDestroy {
    private _destroying$: Subject<void>;

    constructor(
        @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
        private authService: MsalService,
        private broadcastService: MsalBroadcastService,
        private readonly router: Router,
        private readonly users: UsersService,
        private authMsal: AuthMsalService,
        private basicNotification: BasicNotification,
    ) {
        this._destroying$ = new Subject<void>();
    }

    ngOnInit(): void {
        localStorage.setItem("validMenu", "true");
        this.broadcastService.inProgress$
            .pipe(
                filter((status: InteractionStatus) => status === InteractionStatus.None),
                takeUntil(this._destroying$)
            )
            .subscribe(() => {
                let account: AccountInfo = this.authService.instance.getAllAccounts().find(() => true);
                if (!!account) {
                    //CODIGO LIM
                    //SE OBTIENEN LOS PERMISOS
                    this.users.getUserProfilePermissions(account.username).subscribe({
                        next: (response) => {
                            if (response && !response.output) {
                                this.basicNotification.notif('error', response.mensaje);
                                // Alert.error(response.mensaje);
                                this.router.navigate(['/unauthorized']);
                            }

                            if (!response.exito) {
                                // Alert.error(response.mensaje);
                                this.basicNotification.notif('error', response.mensaje);
                                this.router.navigate(['/unauthorized']);
                            }
                            let data = new Perfil();
                            //console.log(response.output);
                            data.id = response.output.id;
                            data.nombre = response.output.nombreUsuario;
                            data.nombrePerfil = response.output.nombre;
                            data.apellidoPerfil = response.output.apellidos;
                            data.usuarioDePerfil = response.output.tipoRol;
                            data.areaResponsablesPerfil = response.output.areasResponsables;
                            data.usuarioProcesoRolPerfil = response.output.usuarioProcesoRolPerfil;

                            data.institucionesPerfil = response.output.institucionesStr;
                            data.campusPerfil = response.output.campusStr;
                            data.regionPerfil = response.output.regionesStr;

                            data.correo = response.output.correo;
                            data.perfil = response.output.perfil;
                            data.campus = response.output.campus;
                            data.campuses = response.output.campuses;
                            data.esAdmin = response.output.administrador;
                            data.esAutorizador = response.output.autorizador;
                            data.esEvaluador = response.output.evaluador;
                            //data.region = response.output.region;
                            //data.regiones = response.output.regiones;
                            data.areaResponsable = response.output.areaResponsable;
                            data.areaResponsables = response.output.areasResponsables;
                           
                            data.vistas = response.output.vistas;
                            data.modulos = response.output.modulos;
                            data.perfilId = response.output.perfilId;
                            data.tipoRol = response.output.tipoRolId;
                            data.roles = response.output.roles;
                            data.areasResponsablesIds = response.output.areasResponsablesIds;
                            data.campusIds = response.output.campusIds;
                            this.users.userSession = data;
                            Auth.login(data);
                            //this.router.navigate(['/welcome-screen']);
                            this.router.navigate(['/inicio']);//Actualizado
                        },
                        error: (error) => {
                            this.basicNotification.notif('error', 'Ha ocurrido un error al validar tu cuenta. Vuelve a intentar el inicio de sesión');
                            // Alert.error(
                            //     'Ha ocurrido un error al validar tu cuenta. Vuelve a intentar el inicio de sesión',
                            //     'Validación de Cuenta'
                            // );
                            this.router.navigate(['/unauthorized']);
                        },
                    });
                }
            });
    }

    login() {
        if (this.msalGuardConfig.authRequest) {
            this.authService.loginRedirect({
                ...this.msalGuardConfig.authRequest,
            } as RedirectRequest);
        } else {
            this.authService.loginRedirect();
        }
    }

    ngOnDestroy(): void {
        this._destroying$.next(undefined);
        this._destroying$.complete();
    }
}
