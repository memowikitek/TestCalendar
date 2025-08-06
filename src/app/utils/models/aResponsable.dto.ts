import { Deserializable } from '../interfaces';

export class AresponsableDTO implements Deserializable {
    procesoEvaluacionId: number
    indicadorId: number
    componenteId: number
    elementoEvaluacionId: number
    areaCentralId: number
    subAreaCentralId: number
    institucionId: number
    tipoResultado: number
    claveInstitucion: string
    institucion: string
    areaResponsableId: number
    claveAreaResponsable: string
    areaResponsable: string
    dependenciaAreaId: number
    dependenciaArea: string
    consolidacion: boolean
    activo: boolean
    usuarioCreacion: number
    usuarioModificacion: number
    indicadoresNmdet: IndicadoresNmdet[]

    constructor() {
        this.procesoEvaluacionId = null;
        this.indicadorId = null;
        this.componenteId = null;
        this.elementoEvaluacionId = null;
        this.areaCentralId = null;
        this.subAreaCentralId = null;
        this.institucionId = null;
        this.tipoResultado = null;
        this.claveInstitucion = null;
        this.institucion = null;
        this.areaResponsableId = null;
        this.claveAreaResponsable = null;
        this.areaResponsable = null;
        this.dependenciaAreaId = null;
        this.dependenciaArea = null;
        this.consolidacion = null;
        this.activo = null;
        this.usuarioCreacion = null;
        this.usuarioModificacion = null;
        this.indicadoresNmdet = [];

    }
    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}

/*export class IndicadoresNmdet implements Deserializable {
    indicadorSiacid: number
    areaResponsableId: number
    nivelModalidadId: any
    nivelModalidad: string
    
    constructor() {
        this.indicadorSiacid = null;
        this.areaResponsableId = null;
        this.nivelModalidadId = null;
        this.nivelModalidad = null;
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}*/

export class IndicadoresNmdet {
    indicadorId: number
    areaResponsableId: number
    nivelModalidadId: any
    nivelModalidad: string
}