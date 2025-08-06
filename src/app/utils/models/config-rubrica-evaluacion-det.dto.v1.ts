import { Deserializable } from '../interfaces';
import { RubricaEscalaDTOV1 } from './config-rubrica-escala.dto.v1';
import { ConfigRubricaEvaluacionDTOV1 } from './config-rubrica-evaluacion.dto.v1';

export class ConfigRubricaEvaluacionDetDTOV1 implements Deserializable {
    id: number;
    cfgIndicadorId: number;
    condicionCalidad: string;
    cumplimientoAutoevaluacion: boolean;
    puntajeAutoevaluacion: boolean;
    revisionCumplimientoAutoevaluacion: boolean;
    revisionPuntajeAutoevaluacion: boolean;
    activo: boolean;
    fechaCreacion: Date | string;
    usuarioModificacion: number;
    fechaModificacion: Date | string;
    usuarioCreacion: number;
    escalaNavigation: RubricaEscalaDTOV1;
    escala: number;
    descripcion: string;
    cfgRubricaEvaluacion: ConfigRubricaEvaluacionDTOV1;

    constructor() {
        this.id = null;
        this.condicionCalidad = null;
        this.cumplimientoAutoevaluacion = null;
        this.puntajeAutoevaluacion = null;
        this.revisionCumplimientoAutoevaluacion = null;
        this.revisionPuntajeAutoevaluacion = null;
        this.activo = null;
        this.fechaCreacion = null;
        this.usuarioCreacion = null;
        this.fechaModificacion = null;
        this.usuarioModificacion = null;
        this.escalaNavigation = null;
        this.escala = null;
        this.descripcion = null;
        this.cfgRubricaEvaluacion = null;
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
