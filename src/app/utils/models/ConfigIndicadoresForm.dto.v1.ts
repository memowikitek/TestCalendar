import { Deserializable } from '../interfaces';
import { IndicadorEvidencia } from './indicador-evidencia';
import { IndicadorNormativa } from './indicador-normativa';
import { SubAreaCorporativaDTOV1 } from './subarea-corporativa.dto.v1';

export class ConfigIndicadoresFormDTOV1 implements Deserializable {
    id: number;
    cfgComponenteId: number;
    cfgElementoEvaluacionId: number;

    componente: number;
    elementoEvaluacion: number;
    indicadorSIAC: number;
    evidencias: IndicadorEvidencia[];
    normativas: IndicadorNormativa[];
    areaCorporativa: number;
    subAreasCorporativas: SubAreaCorporativaDTOV1[];
    componenteMI: number;
    pilarEstrategico: number;
    indicadorMI: number;
    subIndicadorMI: number;

    formatoEvidencia: File[];

    activo: boolean;
    fechaCreacion: Date;
    usuarioCreacion: number;
    fechaModificacion: Date;
    usuarioModificacion: number;

    constructor() {
        this.id = null;
        this.cfgComponenteId = null;
        this.cfgElementoEvaluacionId = null;

        this.componente = null;
        this.elementoEvaluacion = null;
        this.indicadorSIAC = null;
        this.normativas = [];
        this.evidencias = [];
        this.areaCorporativa = null;
        this.subAreasCorporativas = [];
        this.componenteMI = null;
        this.pilarEstrategico = null;
        this.indicadorMI = null;
        this.subIndicadorMI = null;

        this.formatoEvidencia = [];

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
