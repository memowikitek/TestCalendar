import { Deserializable } from '../interfaces';
import { NormativaDTOV1 } from './normativa.dto.v1';

export class IndicadorNormativa implements Deserializable {
    id: number | null;
    cfgIndicadorId: number | null;
    normativaId: number | null;
    activo: boolean | null;
    fechaCreacion: Date | null;
    usuarioCreacion: number | null;
    fechaModificacion: Date | null;
    usuarioModificacion: number | null;
    normativa: NormativaDTOV1 | null;

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
