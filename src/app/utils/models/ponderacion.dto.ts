import { Deserializable } from '../interfaces';
export class PonderacionDTO implements Deserializable {
    ponderacionId: number;
    componenteId: number;
    componenteNombre: string;
    nivelModalidadId: number;
    nivelModalidadNombre: string;
    puntuacion: number;
    activo: boolean;

    constructor() {
        this.ponderacionId = null;
        this.componenteId = null;
        this.componenteNombre = null;
        this.nivelModalidadId = null;
        this.nivelModalidadNombre = null;
        this.puntuacion = null;
        this.activo = null;
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
