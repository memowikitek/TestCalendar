import { Injectable } from '@angular/core';
import { Deserializable } from '../interfaces';
import { ModulesCatalogDTO } from './modules-catalog.dto';
import { PermisosRolesVistasDTO } from './permisos-roles-vistas';


@Injectable({
    providedIn: 'root',
})
export class Vista implements Deserializable {
    vistaId: number;
    vistaNombre: string;
    nombre: string;
    permisos: string;
    vistaPadre: number;

    constructor() {
        this.vistaId = null;
        this.vistaNombre = null;
        this.nombre = null;
        this.permisos = null;
        this.vistaPadre = null;
    }

    
    getPermissions(Modules: ModulesCatalogDTO[], Views: Vista[], Route: string): boolean[] {
        let Module: ModulesCatalogDTO = Modules.find((module) => module.url.indexOf(Route.slice(1).split('/')[1]) >= 0);
        let Access: Vista = Views.find((element) => element.vistaId == Module.id);
        let Permissions: boolean[] = [false, false, false];
        if (Access && Access.permisos && Access.permisos.length && Access.permisos.length > 0) {
            Access.permisos.split('').forEach((element, index) => {
                if (element == '*') {
                    Permissions[0] = true;
                    Permissions[1] = true;
                    Permissions[2] = true;
                }
                if (element == 'C') Permissions[0] = true;
                if (element == 'D') Permissions[1] = true;
                if (element == 'E') Permissions[2] = true;
            });
        }
        return Permissions;
    }

    getPermissionsV2(Views: PermisosRolesVistasDTO[], Route: string): string[] {
        let permisosVistaRol = Views.find(
            (module) => module.url.indexOf(Route) >= 0);

             let Permissions = permisosVistaRol?.permisos?.split(',');
        return Permissions;
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}

export class TipoAcceso {
    id: number;
    nombre: string;
    descripcion: string;
}
