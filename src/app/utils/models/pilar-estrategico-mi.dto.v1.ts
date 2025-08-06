import { Deserializable } from '../interfaces';
import { ComponenteMIDTOV1 } from './componente-mi.dto.v1';
import { IndicadorMIDTOV1 } from './indicador-mi.dto.v1';

export class PilarEstrategicoMIDTOV1 implements Deserializable {
    id: number;
    clave: string;
    nombre: string;
    descripcion: string;
    pilarEstrategicoMiid: number;
    activo: boolean;
    fechaCreacion: Date | string;
    usuarioModificacion: number;
    fechaModificacion: Date | string;
    usuarioCreacion: number;
    indicadorMi: IndicadorMIDTOV1[];

    constructor() {
        this.id = null;
        this.clave = null;
        this.nombre = null;
        this.descripcion = null;
        this.pilarEstrategicoMiid = null;
        this.activo = null;
        this.fechaCreacion = null;
        this.usuarioCreacion = null;
        this.fechaModificacion = null;
        this.usuarioModificacion = null;
        this.indicadorMi = [];
    }

    getIndicatorMiListString(): string {
        return this.indicadorMi.map((i) => `${i.nombre}`).join(', ');
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
