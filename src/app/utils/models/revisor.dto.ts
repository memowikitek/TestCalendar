import { Deserializable } from '../interfaces';

export class RevisorModelDTO implements Deserializable {
    areaResponsableId: number
    campusId: number
    ceevaluacionId: number
    cicloEvaluacionId: number
    etapaId: number

    constructor(){
        this.areaResponsableId = null;
        this.campusId = null;
        this.ceevaluacionId = null;
        this.cicloEvaluacionId = null;
        this.etapaId = null;
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}