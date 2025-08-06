import { Deserializable } from '../interfaces';

export class ConfigIndicadoresModel implements Deserializable {
    id: number;
    cfgGeneralId: number;
    cfgComponentesId: number;
    cfgElementosEvaluacionId: number;

    indicadorSIACId: number;
    normativas: number[];
    evidencias: number[];
    areaCorporativaId: number;
    areaCorporativa: any;
    areasSubCorporativas: number[];
    componenteMiId: number;
    pilarestrategicoMiId: number;
    indicadorMiId: number;
    subIndicadorMiId: number;

    activo: boolean;
    fechaCreacion: Date;
    usuarioCreacion: number;
    fechaModificacion: Date;
    usuarioModificacion: number;
    areaCentralId: number;

    constructor() {
        this.id = null;
        this.cfgGeneralId = null;
        this.cfgComponentesId = null;
        this.cfgElementosEvaluacionId = null;

        this.indicadorSIACId = null;
        this.normativas = [];
        this.evidencias = [];
        this.areaCorporativaId = null;
        this.areaCorporativa = null;
        this.areasSubCorporativas = [];
        this.componenteMiId = null;
        this.pilarestrategicoMiId = null;
        this.indicadorMiId = null;
        this.subIndicadorMiId = null;

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
