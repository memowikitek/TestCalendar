import { Deserializable } from '../interfaces';
export class PonderacionDTOV1 implements Deserializable {
    id: number;
    clave: string;
    componenteId: number;
    nombre: string;
    nivelModalidadId: number;
    nivelModalidad: string;
    claveNivelModalidad: string;
    puntuacion: number;
    activo: boolean;
    fechaCreacion: Date | string;
    usuarioModificacion: number;
    fechaModificacion: Date | string;
    usuarioCreacion: number;

    constructor() {
        this.id = null;
        this.clave = null;
        this.componenteId = null;
        this.nombre = null;
        this.nivelModalidadId = null;
        this.nivelModalidad = null;
        this.claveNivelModalidad = null;
        this.puntuacion = 0;
        this.activo = null;
        this.fechaCreacion = null;
        this.usuarioCreacion = null;
        this.fechaModificacion = null;
        this.usuarioModificacion = null;
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
