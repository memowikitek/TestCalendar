import { Deserializable } from '../interfaces';
import { IndicadorMIDTOV1 } from './indicador-mi.dto.v1';

export class SubIndicadorMIDTOV1 implements Deserializable {
    id: number;
    clave: string;
    nombre: string;
    indicadorMiid: number;
    componenteMiid: number;
    activo: boolean;
    fechaCreacion: Date | string;
    usuarioCreacion: number;
    fechaModificacion: Date | string;
    usuarioModificacion: number;
    indicadorMi: IndicadorMIDTOV1;

    constructor() {
        this.id = null;
        this.clave = null;
        this.nombre = null;
        this.indicadorMiid = null;
        this.componenteMiid = null;
        this.activo = null;
        this.fechaCreacion = null;
        this.usuarioCreacion = null;
        this.fechaModificacion = null;
        this.usuarioModificacion = null;
        this.indicadorMi = null;
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
