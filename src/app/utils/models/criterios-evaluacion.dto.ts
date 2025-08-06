import { Deserializable } from '../interfaces';

export class CriteriosEvaluacionDTO implements Deserializable {
    id: number;
    cicloEvaluacionId: number;
    cicloEvaluacion: string | null;
    etapaId: number;
    etapa: string | null;
    criterioRevision: string;
    activo: boolean;
    fechaCreacion: Date | string;
    usuarioCreacion: number;
    fechaModificacion: Date | string;
    usuarioModificacion: number;
    evidenciaId: number;

    constructor() {
        this.id = null;
        this.cicloEvaluacionId = null;
        this.cicloEvaluacion = null;
        this.etapaId = null;
        this.etapa = null;
        this.criterioRevision = null;
        this.activo = null;
        this.fechaCreacion = null;
        this.usuarioCreacion = null;
        this.fechaModificacion = null;
        this.usuarioModificacion = null;
        this.evidenciaId = null;
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}


export class CriteriosEvaluacionRecordDTO implements Deserializable {
    id: number
    cicloEvaluacionId: number
    ceevaluacionId: number
    etapaId: number
    areaResponsableId: number
    campusId: number
    comentarioRi: string
    estatusRiid: number
    fechaSesionRi: Date | string
    compartirAtea: boolean
    fechaCreacion: Date | string
    usuarioCreacion: number
    fechaModificacion: Date | string
    usuarioModificacion: number
    ceetapa7RiCriterio: Ceetapa7RiCriterio[]
    evidenciaId: number;

    constructor() {
        this.id = null;
        this.cicloEvaluacionId = null;
        this.ceevaluacionId = null;
        this.etapaId = null;
        this.areaResponsableId = null;
        this.campusId = null;
        this.comentarioRi = null;
        this.estatusRiid = null;
        this.fechaSesionRi = null;
        this.compartirAtea = null;
        this.fechaCreacion = null;
        this.usuarioCreacion = null;
        this.fechaModificacion = null;
        this.usuarioModificacion = null;
        this.ceetapa7RiCriterio = [];
        this.evidenciaId = null;
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}

export interface Ceetapa7RiCriterio {
    id: number
    criteriosEvaluacionRiid: number
    cumple: boolean
    noCumple: boolean
    fechaCreacion: Date | string
    usuarioCreacion: number
    fechaModificacion: Date | string
    usuarioModificacion: number
}
