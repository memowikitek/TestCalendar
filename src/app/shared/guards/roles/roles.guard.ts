import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthMsalService, RolesService, UsersService } from 'src/app/core/services';
import { MODULESCATALOG, MODULESCATALOGV2 } from 'src/app/utils/constants';
import { Alert } from 'src/app/utils/helpers';

@Injectable({
    providedIn: 'root',
})
export class RolesGuard implements CanActivate {
    constructor(
        private readonly roles: RolesService,
        private readonly router: Router,
        private users: UsersService,
        private readonly authMsal: AuthMsalService
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
        const url = state.url.slice(1);
        const moduleList = this.users.userSession.modulos;
        const modulePermission = moduleList.find(function (module) {
            return module.url.indexOf(url.split('/')[1]) >= 0;
        });

        if (moduleList.length === 0) {
            Alert.info('Usuario no cuenta con acceso asignado. Favor de validarlo el administrador.');
            return this.router.createUrlTree(['unauthorized']);
        }

        if (!modulePermission) {
            Alert.info('Usuario no cuenta con permisos. Favor de validarlo el administrador.');
            return this.router.createUrlTree(['unauthorized']);
        }

        return true;
        // // const initalViewId: number = parseInt(this.users.userSession.vistaInicial.vistaId);
        // const initalViewId: number = this.users.userSession.vistaInicial
        //     ? this.users.userSession.vistaInicial.vistaId
        //         ? this.users.userSession.vistaInicial.vistaId
        //         : null
        //     : null;

        // const userModules = MODULESCATALOGV2.filter((item) => viewList.find((view) => view.vistaId === item.id));
        // const mainView = MODULESCATALOGV2.find((item) => item.id === initalViewId);

        // // const validUrl = userModules.find((item) => item.url.includes(url));

        // const validUrl = url.includes('/mi-perfil') ? true : userModules.find((item) => item.url.includes(url));

        // const globalModules = MODULESCATALOGV2.find((item) => item.url === url && item.global);

        // if (globalModules) {
        //     return true;
        // }

        // if (this.users.userSession.esAdmin) {
        //     const navigation = MODULESCATALOGV2.find((item) => url.includes(item.url));

        //     return navigation && url.trim().length !== 0
        //         ? true
        //         : mainView
        //         ? this.router.createUrlTree(['/' + mainView.url])
        //         : this.router.createUrlTree(['/mi-perfil']);
        // }

        // return validUrl
        //     ? true
        //     : mainView
        //     ? this.router.createUrlTree(['/' + mainView.url])
        //     : this.router.createUrlTree(['/mi-perfil']);
    }
}
