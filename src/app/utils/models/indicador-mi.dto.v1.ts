import { Deserializable } from '../interfaces';
import { ComponenteMIDTOV1 } from './componente-mi.dto.v1';
import { PilarEstrategicoMIDTOV1 } from './pilar-estrategico-mi.dto.v1';
import { SubIndicadorMIDTOV1 } from './sub-indicador-mi.dto.v1';

export class IndicadorMIDTOV1 implements Deserializable {
    id: number;
    clave: string;
    nombre: string;
    descripcion: string;
    componenteMiid: any;
    pilarEstrategicoMiid: any;
    activo: boolean;
    fechaCreacion: Date;
    usuarioCreacion: number;
    fechaModificacion: Date;
    usuarioModificacion: number;
    componenteMi: ComponenteMIDTOV1;
    pilarEstrategicoMi: PilarEstrategicoMIDTOV1;
    subIndicadorMi: SubIndicadorMIDTOV1[];

    constructor() {
        this.id = null;
        this.clave = null;
        this.nombre = null;
        this.descripcion = null;
        this.componenteMiid = null;
        this.pilarEstrategicoMiid = null;
        this.activo = null;
        this.fechaCreacion = null;
        this.usuarioCreacion = null;
        this.fechaModificacion = null;
        this.usuarioModificacion = null;
        this.componenteMi = null;
        this.pilarEstrategicoMi = null;
        this.subIndicadorMi = [];
    }

    getSubIndicatorMiListString(): string {
        return this.subIndicadorMi.map((i) => `${i.nombre}`).join(', ');
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
