import { IndicadorMIDTOV1 } from './indicador-mi.dto.v1';
import { Deserializable } from '../interfaces';
import { SubIndicadorMIDTOV1 } from './sub-indicador-mi.dto.v1';
import { ComponenteMIDTOV1 } from './componente-mi.dto.v1';
import { IndicadorSiacDTOV1 } from './indicador-siac.dto.v1';
import { PilarEstrategicoMIDTOV1 } from './pilar-estrategico-mi.dto.v1';

export class MatrizMIDTOV2 implements Deserializable {
    subIndicadorMiid: number;
    subIndicadorMiClave: string;
    subIndicadorMi: string;
    indicadorMiid: number;
    indicadorMiClave: string;
    indicadorMi: string;
    pilarEstrategicoMiid: number;
    //pilarEstrategicoMiClave: string;
    pilarEstrategicoMi: string;
    componenteMiid: number;
    componenteMiClave: string;
    componenteMi: string;
    matrizMiid: number;
    activo: boolean;
    fechaCreacion: string;
    usuarioCreacion: number;
    fechaModificacion: any;
    usuarioModificacion: number;

    constructor() {
        this.matrizMiid = null;
        this.componenteMiid = null;
        this.componenteMiClave = null;
        this.componenteMi = null;
        this.pilarEstrategicoMiid = null;
        //this.pilarEstrategicoMiClave = null;
        this.pilarEstrategicoMi = null;
        this.indicadorMiid = null;
        this.indicadorMiClave = null;
        this.indicadorMi = null;
        this.subIndicadorMiid = null;
        this.subIndicadorMiClave = null;
        this.subIndicadorMi = null;
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
