import { Deserializable } from '../interfaces';
import { PeriodoEvaluacionEtapaDTOV1 } from './periodo-evaluacion-etapa.dto.v1';

export class PeriodoEvaluacionDTOV1 implements Deserializable {
    id: number;
    anio: number;
    cicloId: number;
    ciclo: string;
    institucionId: number;
    institucion: string;
    activo: boolean;
    periodoEvaluacionEtapas: PeriodoEvaluacionEtapaDTOV1[];
    fechaCreacion: Date | string;
    usuarioModificacion: number;
    fechaModificacion: Date | string;
    usuarioCreacion: number;

    constructor() {
        this.id = null;
        this.anio = null;
        this.cicloId = null;
        this.ciclo = null;
        this.institucionId = null;
        this.institucion = null;
        this.activo = null;
        this.periodoEvaluacionEtapas = [];
        this.fechaCreacion = null;
        this.usuarioCreacion = null;
        this.fechaModificacion = null;
        this.usuarioModificacion = null;
    }

    getProccessString(): number {
        return this.id;
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
