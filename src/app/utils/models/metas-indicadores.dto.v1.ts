import { Deserializable } from '../interfaces';
import {
    AreaResponsableDTOV1,
    CampusDTOV1,
    NivelModalidadDTOV1,
    PeriodoEvaluacionDTOV1,
    PeriodoEvaluacionEtapaDTOV1,
    RegionDTOV1,
    TablePaginatorSearch,
} from 'src/app/utils/models';
import { ConfigIndicadoresModel } from './ConfigIndicadores.dto.v1';

export class MetasIndicadoresDTOV1 implements Deserializable {
    public id: number;
    configGeneralId: number;
    cfgGeneralId: number;
    metasAreaResponsableId: number;

    periodoEvaluacionId: number;
    periodoEvaluacion: PeriodoEvaluacionDTOV1;
    regionId: number;
    region: RegionDTOV1;
    campusId: number;
    campus: CampusDTOV1;
    campusn: string;

    areaResponsableId: number;
    areaResponsable: AreaResponsableDTOV1;
    nivelModalidadId: number;
    nivelModalidad: NivelModalidadDTOV1;
    nivelesModalidad: [];
    niveles: string;

    normativa: string;
    pilarestartegico: string;
    indicadorMi: string;
    subindicadorMi: string;
    indicador: ConfigIndicadoresModel[];

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

    anio: number;
    cicloId: number;

    constructor() {
        this.id = null;
        this.configGeneralId = null;
        this.cfgGeneralId = null;
        this.metasAreaResponsableId = null;
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
        this.activo = null;
        this.fechaCreacion = null;
        this.usuarioCreacion = null;
        this.fechaModificacion = null;
        this.usuarioModificacion = null;
        this.normativa = null;
        this.pilarestartegico = null;
        this.indicadorMi = null;
        this.subindicadorMi = null;
        this.indicador = [];

        this.anio = null;
        this.cicloId = null;
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
