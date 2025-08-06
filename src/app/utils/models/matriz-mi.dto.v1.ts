import { IndicadorMIDTOV1 } from './indicador-mi.dto.v1';
import { Deserializable } from '../interfaces';
import { SubIndicadorMIDTOV1 } from './sub-indicador-mi.dto.v1';
import { ComponenteMIDTOV1 } from './componente-mi.dto.v1';
import { IndicadorSiacDTOV1 } from './indicador-siac.dto.v1';
import { PilarEstrategicoMIDTOV1 } from './pilar-estrategico-mi.dto.v1';

export class MatrizMIDTOV1 implements Deserializable {
    id: number;
    componenteMiid: number;
    pilarEstrategicoMiid: number;
    indicadorMiid: number;
    subIndicadorMiid: number;
    indicadorId: number;
    activo: boolean;
    fechaCreacion: string;
    usuarioCreacion: number;
    fechaModificacion: string;
    usuarioModificacion: number;
    componenteMi: ComponenteMIDTOV1[];
    indicador: IndicadorSiacDTOV1[];

    constructor() {
        this.id = null;
        this.componenteMiid = null;
        this.pilarEstrategicoMiid = null;
        this.indicadorMiid = null;
        this.indicadorId = null;
        this.subIndicadorMiid = null;
        this.activo = null;
        this.fechaCreacion = null;
        this.usuarioCreacion = null;
        this.fechaModificacion = null;
        this.usuarioModificacion = null;
        this.componenteMi = [];
        this.indicador = [];
    }

    getComponenteMiListString(): string {
        return this.componenteMi.map((i) => `${i.nombre}`).join(', ');
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
