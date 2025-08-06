import { Deserializable } from '../interfaces';

export class DetailsCeIndicatorLectura implements Deserializable {
    indicadorId: number | 0;
    usuarioId: number | 0;
    ObligadoLeerIndicador: boolean | false;
    indicadorLeido: boolean | false;
    etapaId: number | 0;
    procesoEvaluacionId: number | 0;
    cicloEvaluacionId: number | 0;

    constructor() {
        this.indicadorId = null
        this.usuarioId = null
        this.ObligadoLeerIndicador = false
        this.indicadorLeido = false
        this.etapaId = null
        this.procesoEvaluacionId = null
        this.cicloEvaluacionId = null
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}