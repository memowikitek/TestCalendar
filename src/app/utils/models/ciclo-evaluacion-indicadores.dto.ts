import { Deserializable } from '../interfaces';
export class CicloEvaluacionIndicadoresDTO implements Deserializable {

    CampusId: number;
    Nombre: string;
    InsitucionId: number;
    Id: number;
    NivelModalidadId: number;
    Clave: string;
    Activo: boolean;
    Area: string;
    Indicador: string;
    Nivel: string;

    constructor() {
        this.Id = null;
        this.Nombre = null;
        this.InsitucionId = null;
        this.CampusId = null;
        this.NivelModalidadId = null;
        this.Clave = null;
        this.Activo = null;
        this.Area = null;
        this.Indicador = null;
        this.Nivel = null;
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}

export class CicloCeEvaluacionAll implements Deserializable {
    ceevaluacionId: number
    cicloEvaluacionId: number
    procesoEvaluacion: string
    claveInstitucion: string
    cicloEvaluacion: string
    anio: number
    ciclo: string
    nombreCampus: string
    claveCampus: any
    claveArea: string
    nombreArea: string
    nivelModalidad: string
    claveComponente: string
    nombreComponente: string
    claveElementoEvaluacion: string
    nombreElementoEvaluacion: string
    claveIndicador: string
    nombreIndicador: string
    descripcionIndicador: string
    indicadorTipoResultado: number
    activo: boolean
    metaInstitucional: string

    constructor() {
        this.ceevaluacionId = null;
        this.cicloEvaluacionId = null;
        this.procesoEvaluacion = null;
        this.claveInstitucion = null;
        this.cicloEvaluacion = null;
        this.anio = null;
        this.ciclo = null;
        this.nombreCampus = null;
        this.claveCampus = null;
        this.claveArea = null;
        this.nombreArea = null;
        this.nivelModalidad = null;
        this.claveComponente = null;
        this.nombreComponente = null;
        this.claveElementoEvaluacion = null;
        this.nombreElementoEvaluacion = null;
        this.claveIndicador = null;
        this.nombreIndicador = null;
        this.descripcionIndicador = null;
        this.indicadorTipoResultado = null;
        this.activo = null;
        this.metaInstitucional = null;
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
