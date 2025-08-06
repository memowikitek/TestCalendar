import { Deserializable } from '../interfaces';
import { PeriodoEvaluacionEtapaAddUpdateDTOV1 } from './periodo-evaluacion-etapa-add-update.dto.v1';

export class PeriodoEvaluacionAddUpdateDTOV1 implements Deserializable {
    id: string | number;
    anio: string | number;
    cicloId: string | number;
    institucionId: string | number;
    activo: boolean;
    periodoEvaluacionEtapas: PeriodoEvaluacionEtapaAddUpdateDTOV1[];
    fechaCreacion: Date | string;
    usuarioModificacion: number;
    fechaModificacion: Date | string;
    usuarioCreacion: number;

    constructor() {
        this.id = null;
        this.anio = null;
        this.cicloId = null;
        this.institucionId = null;
        this.activo = null;
        this.periodoEvaluacionEtapas = [];
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
