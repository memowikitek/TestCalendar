import { Indicador } from './indicador';
import { AreaCorporativaDTOV1 } from './area-corporativa.dto.v1';
import { SubAreaCorporativaDTOV1 } from './subarea-corporativa.dto.v1';
import { IndicadorEvidencia } from './indicador-evidencia';
import { ConfigRubricaEvaluacion } from './config-rubrica-evaluacion';
import { PilarEstrategicoMi } from './pilar-estrategico-mi';
import { ComponenteDTOV1 } from './componente.dto.v1';
import { CatalogoElementoEvaluacionDTOV1 } from './catalogo-elemento-evaluacion.dto.v1';
import { IndicadorNormativa } from './indicador-normativa';

export class ConfigIndicadores {
    id: number | null;
    cfgComponentesId: number | null;
    cfgElementosEvaluacionId: number | null;
    indicadorSiacid: number | null;
    indicadorMiid: number | null;
    activo: boolean | null;
    fechaCreacion: string | null;
    usuarioCreacion: number | null;
    fechaModificacion: string | null;
    usuarioModificacion: number | null;
    indicadorSiac: any | null;
    subAreaCorporativaId: number | null;
    subAreaCorporativa: SubAreaCorporativaDTOV1[] | null;
    subIndicadorMiid: number | null;
    subIndicadorMi: any;
    indicadorMi: any;
    pilarEstrategicoMi: PilarEstrategicoMi;
    componenteMi: any;
    cfgComponentes: ComponenteDTOV1 | null;
    cfgElementosEvaluacion: CatalogoElementoEvaluacionDTOV1 | null;
    configIndicadoresEvidencias: IndicadorEvidencia[] | null;
    configIndicadoresNormativas: IndicadorNormativa[] | null;
    configIndicadoresAreasCorporativas: any | null;
    configRubricasEvaluacion: ConfigRubricaEvaluacion[] | null;
    configRubricasEvaluacionDet: any | null;

    indicadorSIAC: Indicador | null;
    areaCorporativa: AreaCorporativaDTOV1 | null;
}
