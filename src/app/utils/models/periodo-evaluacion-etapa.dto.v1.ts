import { Deserializable } from '../interfaces';

export class PeriodoEvaluacionEtapaDTOV1 implements Deserializable {
    id: string | number;
    etapaId: string | number;
    etapa: string;
    idPeriodoEvaluacion: string | number;
    fechaInicio: Date | string;
    fechaFin: Date | string;

    constructor() {
        this.id = null;
        this.etapaId = null;
        this.etapa = null;
        this.idPeriodoEvaluacion = null;
        this.fechaInicio = null;
        this.fechaFin = null;
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
