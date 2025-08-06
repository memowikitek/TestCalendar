import { Deserializable } from '../interfaces';
import { CatalogoElementoEvaluacionDTOV1 } from './catalogo-elemento-evaluacion.dto.v1';
import { ConfigIndicadores } from './config-indicadores';
import { ElementoEvaluacion } from './elemento-evaluacion';

export class ConfigElementosEvaluacion implements Deserializable {
    id: number | null;
    configGeneralId: number | null;
    configComponentesId: number | null;
    elementoEvaluacionId: number | null;
    elementosEvaluacion: number[] | null;
    elementoEvaluacion: CatalogoElementoEvaluacionDTOV1 | null;
    configIndicadores: ConfigIndicadores[] | null;
    activo: boolean | null;

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
