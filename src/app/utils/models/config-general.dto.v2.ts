import { Deserializable } from '../interfaces';
import { AreaResponsableDTOV1 } from './area-responsable.dto.v1';
import { ConfigComponenteDTOV1 } from './config-componentes.dto.v1';
import { ConfigIndicadorDTOV1 } from './config-indicador.dto.v1';
import { ConfigRubricaEvaluacionDTOV1 } from './config-rubrica-evaluacion.dto.v1';
import { NivelModalidadDTOV1 } from './nivel-modalidad.dto.v1';
import { PeriodoEvaluacionDTOV1 } from './periodo-evaluacion.dto.v1';

export class ConfigGeneralDTOV2 implements Deserializable {
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
    componentes: ConfigComponenteDTOV1[];
    indicadores: ConfigIndicadorDTOV1[];
    rubricaEvaluacion: ConfigRubricaEvaluacionDTOV1[];

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
        this.componentes = null;
        this.indicadores = null;
        this.rubricaEvaluacion = null;
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
