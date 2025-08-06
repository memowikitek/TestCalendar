import { Deserializable } from '../interfaces';
import { ModulesCatalogDTO } from './modules-catalog.dto';
import { Vista } from './vista';
import { AreaResponsableDTOV1 } from './area-responsable.dto.v1';
import { CampusDTOV1 } from './campus.dto.v1';
import { RegionDTOV1 } from './region.dto.v1';
import { PermisosRolesVistasDTO } from './permisos-roles-vistas';
import { UsuarioRolProcesoDTOV2 } from './usuario-rol-procesoV2.dto';

export class Perfil implements Deserializable {
    id: number;
    nombre: string;
    nombrePerfil: string;
    apellidoPerfil: string;
    usuarioDePerfil: string;
    correo: string;
    perfil: string;
    campus: string;
    region: string;
    areaResponsable: string;
    areaResponsablesPerfil: string;

    institucionesPerfil : string;
    campusPerfil : string;
    regionPerfil : string;

    esAdmin: boolean;
    esAutorizador: boolean;
    esEvaluador: boolean;
    esOtro: boolean;
    vistaInicial: Vista;
    vistas: Vista[];
    modulos: ModulesCatalogDTO[];
    activo: boolean;
    fechaCreacion: Date | string;
    usuarioCreacion: number;
    fechaModificacion: Date | string;
    usuarioModificacion: number;
    campuses: CampusDTOV1[];
    regiones: RegionDTOV1[];
    perfilId: number;
    areaResponsables: AreaResponsableDTOV1[];
    permisosRolesVistas : PermisosRolesVistasDTO[];
    tipoRol: number;
    rolSelectedId: number;

    usuarioProcesoRolPerfil: UsuarioRolProcesoDTOV2[];

    areasResponsablesIds: string;
    campusIds: string;
    isAllAreas: boolean;

    constructor() {
        this.id = null;
        this.perfilId = null;
        this.nombre = null;
        this.nombrePerfil = null;
        this.usuarioDePerfil = null;
        this.apellidoPerfil = null;
        this.correo = null;
        this.perfil = null;
        this.campus = null;
        this.region = null;
        this.areaResponsable = null;
        this.areaResponsablesPerfil = null;
        this.institucionesPerfil = null;
        this.campusPerfil = null;
        this.regionPerfil = null;
        this.esAdmin = null;
        this.vistaInicial = null;
        this.vistas = [];
        this.modulos = [];
        this.activo = null;
        this.fechaCreacion = null;
        this.usuarioCreacion = null;
        this.fechaModificacion = null;
        this.usuarioModificacion = null;
        this.tipoRol = null;
        this.rolSelectedId = null;
        this.permisosRolesVistas=null;
        this.areasResponsablesIds=null;
        this.campusIds=null;
        this.isAllAreas = null;
    }

    deserialize(input: any): this {
        Object.assign(this, input);

        if (this.vistaInicial) {
            this.vistaInicial = new Vista().deserialize(this.vistaInicial);
        }

        if (this.vistas) {
            this.vistas = this.vistas.map((item) => new Vista().deserialize(item));
        }

        if (this.modulos) {
            this.modulos = this.modulos.map((item) => new ModulesCatalogDTO().deserialize(item));
        }
        return this;
    }
}
