import { Deserializable } from '../interfaces';
import { AreaResponsableDTOV1 } from './area-responsable.dto.v1';
import { NivelModalidadDTOV1 } from './nivel-modalidad.dto.v1';
import { PeriodoEvaluacionDTOV1 } from './periodo-evaluacion.dto.v1';

export class ConfigGeneralDTOV1 implements Deserializable {
    id: number;
    periodoEvaluacionId: number;
    areaResponsableId: number;
    nivelModalidadId: number;
    activo: boolean;
    fechaCreacion: Date | string;
    usuarioCreacion: number;
    fechaModificacion: Date | string;
    usuarioModificacion: number;
    nivelesModalidad: string;
    areaResponsable: AreaResponsableDTOV1;
    nivelModalidad: NivelModalidadDTOV1;
    periodoEvaluacion: PeriodoEvaluacionDTOV1;

    constructor() {
        this.id = null;
        this.periodoEvaluacionId = null;
        this.areaResponsableId = null;
        this.nivelModalidadId = null;
        this.activo = null;
        this.fechaCreacion = null;
        this.usuarioCreacion = null;
        this.fechaModificacion = null;
        this.usuarioModificacion = null;
        this.nivelesModalidad = null;
        this.areaResponsable = null;
        this.nivelModalidad = null;
        this.periodoEvaluacion = null;
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
