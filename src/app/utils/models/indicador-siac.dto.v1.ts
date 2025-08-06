import { Deserializable } from '../interfaces';
import { CatalogoElementoEvaluacionDTOV1 } from './catalogo-elemento-evaluacion.dto.v1';
import { ElementoEvaluacionDTOV1 } from './elemento-evaluacion.dto.v1';

export class IndicadorSiacDTOV1 implements Deserializable {
    id: number;
    clave: string;
    nombre: string;
    descripcion: string;
    elementoEvaluacionId: number;
    elementoEvaluacion: CatalogoElementoEvaluacionDTOV1;
    activo: boolean;
    fechaCreacion: Date | string;
    usuarioModificacion: number;
    fechaModificacion: Date | string;
    usuarioCreacion: number;

    constructor() {
        this.id = null;
        this.clave = null;
        this.nombre = null;
        this.descripcion = null;
        this.elementoEvaluacionId = null;
        this.elementoEvaluacion = null;
        this.activo = null;
        this.fechaCreacion = null;
        this.usuarioCreacion = null;
        this.fechaModificacion = null;
        this.usuarioModificacion = null;
    }

    getClaveNombre(): string {
        if (this.elementoEvaluacion !== null)
            return `${this.elementoEvaluacion.clave} - ${this.elementoEvaluacion.nombre}`;
        else return '';
    }
    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
