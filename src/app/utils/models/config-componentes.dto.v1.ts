import { Deserializable } from '../interfaces';
import { ComponenteDTOV1 } from './componente.dto.v1';
import { ElementoEvaluacionDTOV1 } from './elemento-evaluacion.dto.v1';
import { IndicadorSiacDTOV1 } from './indicador-siac.dto.v1';

export class ConfigComponenteDTOV1 implements Deserializable {
    id: number;
    clave: string;
    nombre: string;
    activo: boolean;
    fechaCreacion: Date | string;
    usuarioModificacion: number;
    fechaModificacion: Date | string;
    usuarioCreacion: number;
    componente: ComponenteDTOV1;
    elementosEvaluacion: ElementoEvaluacionDTOV1[];
    indicadoresSIAC: IndicadorSiacDTOV1;

    constructor() {
        this.id = null;
        this.clave = null;
        this.nombre = null;
        this.activo = null;
        this.fechaCreacion = null;
        this.usuarioCreacion = null;
        this.fechaModificacion = null;
        this.usuarioModificacion = null;
        this.componente = null;
        this.elementosEvaluacion = [];
        this.indicadoresSIAC = null;
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
