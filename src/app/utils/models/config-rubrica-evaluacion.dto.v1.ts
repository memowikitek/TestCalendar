import { Deserializable } from '../interfaces';
import { ComponenteDTOV1 } from './componente.dto.v1';
import { ConfigRubricaEvaluacionDetDTOV1 } from './config-rubrica-evaluacion-det.dto.v1';
import { IndicadorMIDTOV1 } from './indicador-mi.dto.v1';
import { IndicadorSiacDTOV1 } from './indicador-siac.dto.v1';
import { NormativaDTOV1 } from './normativa.dto.v1';

export class ConfigRubricaEvaluacionDTOV1 implements Deserializable {
    id: number;
    cfgIndicadorId: number;
    escala: number;
    descripcion: string;
    activo: boolean;
    fechaCreacion: Date;
    usuarioCreacion: number;
    fechaModificacion: Date;
    usuarioModificacion: number;

    configRubricaEvaluacionDet: ConfigRubricaEvaluacionDetDTOV1[] | null;

    constructor() {
        this.id = null;
        this.cfgIndicadorId = null;
        this.escala = null;
        this.descripcion = null;
        this.activo = null;
        this.fechaCreacion = null;
        this.usuarioCreacion = null;
        this.fechaModificacion = null;
        this.usuarioModificacion = null;
        this.configRubricaEvaluacionDet = [];
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
