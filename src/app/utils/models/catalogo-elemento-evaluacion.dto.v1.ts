import { Deserializable } from '../interfaces';
import { ComponenteDTOV1 } from './componente.dto.v1';

export class CatalogoElementoEvaluacionDTOV1 implements Deserializable {
    id: number;
    clave: string;
    nombre: string;
    componenteId: number;
    componente: ComponenteDTOV1;
    activo: boolean;
    fechaCreacion: Date | string;
    usuarioModificacion: number;
    fechaModificacion: Date | string;
    usuarioCreacion: number;

    constructor() {
        this.id = null;
        this.clave = null;
        this.nombre = null;
        this.componenteId = null;
        this.componente = null;
        this.activo = null;
        this.fechaCreacion = null;
        this.usuarioCreacion = null;
        this.fechaModificacion = null;
        this.usuarioModificacion = null;
    }

    getClaveNombre(): string {
        if (this.componente !== null) return `${this.componente.clave} - ${this.componente.nombre}`;
        else return '';
    }
    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
