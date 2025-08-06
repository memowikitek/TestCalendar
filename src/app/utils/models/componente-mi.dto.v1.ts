import { Deserializable } from '../interfaces';
import { MatrizMIDTOV1 } from './matriz-mi.dto.v1';
import { PilarEstrategicoMIDTOV1 } from './pilar-estrategico-mi.dto.v1';

export class ComponenteMIDTOV1 implements Deserializable {
    id: number;
    clave: string;
    nombre: string;
    descripcion: string;
    matrizMiId: number;
    activo: boolean;
    fechaCreacion: Date | string;
    usuarioModificacion: number;
    fechaModificacion: Date | string;
    usuarioCreacion: number;
    matrizMi: MatrizMIDTOV1;
    pilarEstrategicoMi: PilarEstrategicoMIDTOV1[];

    constructor() {
        this.id = null;
        this.clave = '';
        this.nombre = null;
        this.descripcion = null;
        this.activo = null;
        this.fechaCreacion = null;
        this.usuarioCreacion = null;
        this.fechaModificacion = null;
        this.usuarioModificacion = null;
        this.matrizMi = null;
        this.pilarEstrategicoMi = [];
    }

    getPilarEstrategicoMiListString(): string {
        return this.pilarEstrategicoMi.map((i) => `${i.nombre}`).join(', ');
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
