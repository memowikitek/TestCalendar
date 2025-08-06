import { Deserializable } from '../interfaces';
import { ConfigComponenteDTOV1 } from './config-componentes.dto.v1';
import { ConfigIndicadorEvidenciasDTOV1 } from './config-indicador-evidencias.dto.v1';
import { ConfigIndicadorNormativasDTOV1 } from './config-indicador-normativas.dto.v1';
import { ElementoEvaluacionDTOV1 } from './elemento-evaluacion.dto.v1';
import { IndicadorSiacDTOV1 } from './indicador-siac.dto.v1';
import { NormativaDTOV1 } from './normativa.dto.v1';
import { SubIndicadorMIDTOV1 } from './sub-indicador-mi.dto.v1';
import { SubAreaCorporativaDTOV1 } from './subarea-corporativa.dto.v1';

export class ConfigIndicadorDTOV1 implements Deserializable {
    id: number;
    cfgComponentesId: number;
    areaCorporativaId: number;
    subAreaCorporativaId: number;
    indicadorSiacid: number;
    componenteMiid: number;
    pilarEstrategicoMiid: number;
    indicadorMiid: number;
    subIndicadorMiid: number;
    normativas: number[];
    evidencias: number[];
    activo: boolean;
    fechaCreacion: Date | string;
    usuarioModificacion: number;
    fechaModificacion: Date | string;
    usuarioCreacion: number;

    cfgComponentes: ConfigComponenteDTOV1;
    cfgElementosEvaluacion: ElementoEvaluacionDTOV1;
    subAreaCorporativa: SubAreaCorporativaDTOV1;
    subAreasCorporativas: SubAreaCorporativaDTOV1[];
    indicadorSiac: IndicadorSiacDTOV1;
    subIndicadorMi: SubIndicadorMIDTOV1;
    normativa: NormativaDTOV1;

    configIndicadoresNormativas: ConfigIndicadorNormativasDTOV1[];
    configIndicadoresEvidencias: ConfigIndicadorEvidenciasDTOV1[];
    areaCentralId: number;

    constructor() {
        this.id = null;
        this.cfgComponentesId = null;
        this.areaCorporativaId = null;
        this.areaCentralId = null;
        this.subAreaCorporativaId = null;
        this.subAreasCorporativas = [];
        this.indicadorSiacid = null;
        this.componenteMiid = null;
        this.pilarEstrategicoMiid = null;
        this.indicadorMiid = null;
        this.subIndicadorMiid = null;
        this.normativas = [];
        this.evidencias = [];
        this.activo = null;
        this.fechaCreacion = null;
        this.usuarioCreacion = null;
        this.fechaModificacion = null;
        this.usuarioModificacion = null;

        this.cfgComponentes = null;
        this.cfgElementosEvaluacion = null;
        this.subAreaCorporativa = null;
        this.indicadorSiac = null;
        this.subIndicadorMi = null;
        this.normativa = null;

        this.configIndicadoresEvidencias = [];
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
