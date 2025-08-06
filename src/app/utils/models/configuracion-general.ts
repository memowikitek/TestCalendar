import { AreaResponsableDTOV1 } from './area-responsable.dto.v1';
import { NivelModalidadDTOV1 } from './nivel-modalidad.dto.v1';
import { PeriodoEvaluacionDTOV1 } from './periodo-evaluacion.dto.v1';
import { ConfigComponentes } from './config-componentes';

export class ConfiguracionGeneral {
    id: number | null;
    periodoEvaluacionId: number | null;
    areaResponsableId: number | null;
    nivelModalidadId: number | null;
    activo: boolean | null;
    fechaCreacion: string | null;
    usuarioCreacion: number | null;
    fechaModificacion: string | null;
    usuarioModificacion: number | null;
    nivelesModalidad: string | null;
    areaResponsable: AreaResponsableDTOV1 | null;
    nivelModalidad: NivelModalidadDTOV1 | null;
    periodoEvaluacion: PeriodoEvaluacionDTOV1 | null;
    configComponentes: ConfigComponentes[] | null;
}
