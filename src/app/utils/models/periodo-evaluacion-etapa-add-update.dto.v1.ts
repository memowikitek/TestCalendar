import { Deserializable } from '../interfaces';

export class PeriodoEvaluacionEtapaAddUpdateDTOV1 implements Deserializable {
    id: string | number;
    etapaId: string | number;;
    periodoEvaluacionId: string | number;
    fechaInicio: Date | string;
    fechaFin: Date | string;

    constructor() {
        this.id = null;
        this.etapaId = null;
        this.periodoEvaluacionId = null;
        this.fechaInicio = null;
        this.fechaFin = null;
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
