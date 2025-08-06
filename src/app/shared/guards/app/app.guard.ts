import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { AccountInfo } from '@azure/msal-browser';
import { Observable, of } from 'rxjs';
import { UsersService } from 'src/app/core/services';
import { Auth } from 'src/app/utils/helpers';
import { Perfil } from 'src/app/utils/models';

@Injectable({
    providedIn: 'root',
})
export class AppGuard implements CanActivate {
    constructor(
        private authService: MsalService,
        private readonly router: Router,
        private readonly users: UsersService
    ) {}
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        let account: AccountInfo = this.authService.instance.getAllAccounts().find(() => true);

        if (Auth.checkSession()) {
            this.users.getUserProfilePermissions(account.username).subscribe({
                next: (response) => {
                    if (response && response.output) {
                        let data = new Perfil();
                        data.id = response.output.id;
                        data.nombre = response.output.nombreUsuario;
                        data.correo = response.output.correo;
                        data.perfil = response.output.perfil;
                        data.campus = response.output.campus;
                        data.region = response.output.region;
                        data.areaResponsable = response.output.areaResponsable;
                        data.vistas = response.output.vistas;
                        data.modulos = response.output.modulos;
                        this.users.userSession = data;
                        return true;
                    } else {
                        return of(this.router.createUrlTree(['/unauthorized']));
                    }
                },
                error: (error) => {
                    of(this.router.createUrlTree(['/unauthorized']));
                },
            });
        }
        return this.router.createUrlTree(['/login']);
    }
}
