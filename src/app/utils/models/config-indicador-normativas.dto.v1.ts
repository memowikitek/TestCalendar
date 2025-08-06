import { Deserializable } from '../interfaces';
import { ConfigIndicadorDTOV1 } from './config-indicador.dto.v1';
import { NormativaDTOV1 } from './normativa.dto.v1';

export class ConfigIndicadorNormativasDTOV1 implements Deserializable {
    id: number;
    cfgIndicadorId: number;
    normativaId: number;
    activo: boolean;
    fechaCreacion: Date | string;
    usuarioModificacion: number;
    fechaModificacion: Date | string;
    usuarioCreacion: number;
    cfgIndicador: ConfigIndicadorDTOV1;
    normativa: NormativaDTOV1;

    constructor() {
        this.id = null;
        this.cfgIndicadorId = null;
        this.normativaId = null;
        this.activo = null;
        this.fechaCreacion = null;
        this.usuarioCreacion = null;
        this.fechaModificacion = null;
        this.usuarioModificacion = null;
        this.cfgIndicador = null;
        this.normativa = null;
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
