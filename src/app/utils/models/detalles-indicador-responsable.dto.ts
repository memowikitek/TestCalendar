import { Deserializable } from '../interfaces';

export class DetailsIndicatorResponsableDTOV1 implements Deserializable {
    procesoEvaluacionId: number
    indicadorSiacid: number
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
    dependenciaAreaId: any
    dependenciaArea: any
    consolidacion: boolean
    activo: boolean
    usuarioCreacion: number
    usuarioModificacion: number
    indicadoresNmdet: any
  

    constructor() {
        this.procesoEvaluacionId = null;
        this.indicadorSiacid = null;
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
