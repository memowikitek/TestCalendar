

// import { ElementosEvaluacionModel } from "./elementosEvaluacionModel";
// import { MatrizMiModel } from "./matrizMiModel";
// import { NormativaModel } from "./normativaModel";
// import { IndicadorEvidenciaModel } from "./indicadorEvidenciaModel";

import { NormativaDTOV1 } from "./normativa.dto.v1";

export class Indicador {
    id: number | null;
    cfgElementoEvaluacionId: number | null;
    matrizUvmId: number | null;
    normativaId: number | null;
    activo: boolean | null;
    fechaCreacion: string | null;
    usuarioCreacion: number | null;
    fechaModificacion: string | null;
    usuarioModificacion: number | null;
    cfgElementoEvaluacion: any | null;
    matrizUvm: any | null;
    normativa: NormativaDTOV1 | null;
    indicadorEvidencia: any[] | null;
    // cfgElementoEvaluacion: ElementosEvaluacionModel | null;
    // matrizUvm: MatrizMiModel | null;
    // normativa: NormativaModel | null;
    // indicadorEvidencia: IndicadorEvidenciaModel[] | null;
}