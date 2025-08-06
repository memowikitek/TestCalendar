import { Deserializable } from '../interfaces';

export class NivelModalidadDTOV1 implements Deserializable {
    id: number;
    clave: string;
    nivelId: number;
    nivel: string;
    niveles: string;
    modalidadId: number;
    modalidad: string;
    activo: boolean;
    fechaCreacion: Date | string;
    usuarioModificacion: number;
    fechaModificacion: Date | string;
    usuarioCreacion: number;

    constructor() {
        this.id = null;
        this.clave = null;
        this.nivelId = null;
        this.nivel = null;
        this.niveles = null;
        this.modalidadId = null;
        this.modalidad = null;
        this.activo = null;
        this.fechaCreacion = null;
        this.usuarioCreacion = null;
        this.fechaModificacion = null;
        this.usuarioModificacion = null;
    }

    getLevelModality(): string {
        //return `${this.clave} - ${this.nivel} / ${this.modalidad}`;
        return `${this.clave}`;
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
