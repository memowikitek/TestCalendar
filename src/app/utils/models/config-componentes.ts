import { Deserializer } from 'v8';
import { ComponenteDTOV1 } from './componente.dto.v1';
import { ConfigElementosEvaluacion } from './config-elementos-evaluacion';
import { Deserializable } from '../interfaces';

export class ConfigComponentes implements Deserializable {
    id: number | null;
    configGeneralId: number | null;
    componenteId: number | null;
    activo: boolean | null;
    fechaCreacion: Date | null;
    usuarioCreacion: number | null;
    fechaModificacion: Date | null;
    usuarioModificacion: number | null;
    componente: ComponenteDTOV1 | null;
    elementosEvaluacion: number[] | null;
    configElementosEvaluacion: ConfigElementosEvaluacion[] = [];

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
