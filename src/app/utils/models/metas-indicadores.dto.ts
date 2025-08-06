import { Deserializable } from '../interfaces';
import { AreaResponsableDTOV1 } from './area-responsable.dto.v1';
import { CampusDTOV1 } from './campus.dto.v1';
import { NivelModalidadDTOV1 } from './nivel-modalidad.dto.v1';
import { PeriodoEvaluacionEtapaDTOV1 } from './periodo-evaluacion-etapa.dto.v1';
import { PeriodoEvaluacionDTOV1 } from './periodo-evaluacion.dto.v1';
import { RegionDTOV1 } from './region.dto.v1';

export class MetasIndicadoresDTO implements Deserializable {
    id: number;
    configGeneralId: number;

    periodoEvaluacionId: number;
    periodoEvaluacion: PeriodoEvaluacionDTOV1;
    regionId: number;
    region: RegionDTOV1;
    campusId: number;
    campus: CampusDTOV1;

    areaResponsableId: number;
    areaResponsable: AreaResponsableDTOV1;
    nivelModalidadId: number;
    nivelModalidad: NivelModalidadDTOV1;
    nivelesModalidad: [];

    etapaId: number;
    etapa: PeriodoEvaluacionEtapaDTOV1;
    fechaInicio: Date | string;
    fechaFin: Date | string;

    porcentajeMaximo: number;
    cantidadIndicadores: number;
    porcentajeIndicador: number;
    indicadoresMeta: number;
    calculoAvance: number;

    activo: boolean;
    fechaCreacion: Date | string;
    usuarioCreacion: number;
    fechaModificacion: Date | string;
    usuarioModificacion: number;

    constructor() {
        this.id = null;
        this.configGeneralId = null;

        this.periodoEvaluacionId = null;
        this.periodoEvaluacion = null;

        this.regionId = null;
        this.region = null;
        this.campusId = null;
        this.campus = null;

        this.areaResponsableId = null;
        this.areaResponsable = null;
        this.nivelModalidadId = null;
        this.nivelModalidad = null;
        this.nivelesModalidad = [];

        this.etapaId = null;
        this.etapa = null;
        this.fechaInicio = null;
        this.fechaFin = null;

        this.porcentajeMaximo = null;
        this.cantidadIndicadores = null;
        this.porcentajeIndicador = null;
        this.indicadoresMeta = null;
        this.calculoAvance = null;

        this.activo = null;
        this.fechaCreacion = null;
        this.usuarioCreacion = null;
        this.fechaModificacion = null;
        this.usuarioModificacion = null;
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
