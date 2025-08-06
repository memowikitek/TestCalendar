import { Deserializable } from '../interfaces';

export class IndicadoresCeDTO implements Deserializable {
    procesoEvaluacionId: number
    procesoEvaluacion: string
    componenteId: number
    elementoEvaluacionId: number
    claveElementoEvaluacion: string
    elementoEvaluacion: string
    indicadorId: number
    claveIndicador: string
    metaInstitucional: string
    nombreIndicador: string
    indicador: string
    descripcionIndicador: string
    claveComponente: string
    componente: string
    descripcionComponente: string
    totalIndicadores: number
    activo: boolean
    usuarioCreacion: number
    usuarioModificacion: number
    esEditable: boolean
    tipoResultado: number
    subAreaCentrales: any
    areaCentrales: any
    indicadorSiacid: number
    areaCentralId: number
    subAreaCentralId: number
    cicloEvaluacionId: number

    constructor() {
        this.procesoEvaluacionId = null;
        this.procesoEvaluacion = null;
        this.componenteId = null;
        this.elementoEvaluacionId = null;
        this.claveElementoEvaluacion = null;
        this.elementoEvaluacion = null;
        this.indicadorId = null;
        this.claveIndicador = null;
        this.metaInstitucional = null;
        this.indicador = null;
        this.descripcionIndicador = null;
        this.claveComponente = null;
        this.componente = null;
        this.descripcionComponente = null;
        this.totalIndicadores = null;
        this.activo = null;
        this.usuarioCreacion = null;
        this.usuarioModificacion = null;
        this.esEditable = null;
        this.tipoResultado = null;
        this.subAreaCentrales = [];
        this.areaCentrales = [];
        this.indicadorSiacid = null;
        this.areaCentralId = null;
        this.subAreaCentralId = null;
        this.nombreIndicador = null;
        this.cicloEvaluacionId = null;
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}

export interface SubAreaCentral {
    id: number
    nombre: string
    siglas: string
    areaCentralId: number
    areaCentral: string
    areaCentralSiglas: string
    activo: boolean
    usuarioCreacion: number
    usuarioModificacion: number
}
