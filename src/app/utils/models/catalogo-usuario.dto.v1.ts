import { Deserializable } from '../interfaces';
import { AreaResponsableDTOV1 } from './area-responsable.dto.v1';
import { CampusDTOV1 } from './campus.dto.v1';
import { InstitucionDTOV1 } from './institucion.dto.v1';
import { RegionDTOV1 } from './region.dto.v1';
import { UsuarioProcesoEvaluacionRolDTO } from './usuario-procesoEvaluacion-rol.dto';
import { UsuarioSubareaCentralDTO } from './usuario-subarea-central.dto'


export class CatalogoUsuarioDTOV1 implements Deserializable {
    
    id: number;
    nombre: string;
    apellidos: string;
    correo: string;
    tipoRolId: number;
    activo: boolean;
    fechaCreacion: Date | string;
    usuarioCreacion: number;
    fechaModificacion: Date | string;
    usuarioModificacion: number;
    institucionesId: number[];
    regionesId: number[];
    campusId: number[];
    areasResponsablesId: number[];
    areasCentralesId: number[];
    subAreasCentralesId: number[];
    subAreasCentrales: UsuarioSubareaCentralDTO[];
    procesosEvaluacionRol: UsuarioProcesoEvaluacionRolDTO[];

    constructor(){
        this.id = null;
        this.nombre = null;
        this.apellidos = null;
        this.correo = null;
        this.tipoRolId = null;
        this.activo = null;
        this.fechaCreacion = null;
        this.usuarioCreacion = null;
        this.fechaModificacion = null;
        this.usuarioModificacion = null;
        this.institucionesId = [];
        this.regionesId = [];
        this.campusId = [];
        this.areasResponsablesId = [];
        this.procesosEvaluacionRol = [];
        this.areasCentralesId = [];
        this.subAreasCentralesId = [];
        this.subAreasCentrales = [];
    }

    /*
    id: number;
    nombre: string;
    apellidos: string;
    correo: string;
    perfilId: number;
    perfil: string;
    todos: boolean;
    esAdmin: boolean;
    campusId: number;
    campusClave: string;
    campus: string;
    regionId: number;
    regionClave: string;
    region: string;
    areaResponsableId: number;
    areaResponsableClave: string;
    areaResponsable: string;

    campuses: CampusDTOV1[];
    regiones: RegionDTOV1[];
    areaResponsables: AreaResponsableDTOV1[];
    tipoRol: number;

    instituciones: InstitucionDTOV1[];

    activo: boolean;
    fechaCreacion: Date | string;
    usuarioCreacion: number;
    fechaModificacion: Date | string;
    usuarioModificacion: number;

    constructor() {
        this.id = null;
        this.nombre = null;
        this.apellidos = null;
        this.correo = null;
        this.perfilId = null;
        this.perfil = null;
        this.todos = null;
        this.esAdmin = null;
        this.campusId = null;
        this.campusClave = null;
        this.campus = null;
        this.regionId = null;
        this.regionClave = null;
        this.region = null;
        this.areaResponsableId = null;
        this.areaResponsableClave = null;
        this.areaResponsable = null;

        this.tipoRol = null;

        this.campuses = [];
        this.regiones = [];
        this.areaResponsables = [];

        this.activo = null;
        this.fechaCreacion = null;
        this.usuarioCreacion = null;
        this.fechaModificacion = null;
        this.usuarioModificacion = null;
    }
    */

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
