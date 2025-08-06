import { Deserializable } from '../interfaces';
import { CatalogoElementoEvaluacionDTOV1 } from './catalogo-elemento-evaluacion.dto.v1';
import { ComponenteDTOV1 } from './componente.dto.v1';
import { ElementoEvaluacionDTOV1 } from './elemento-evaluacion.dto.v1';

export class ConfigElementosEvaluacionDTOV1 implements Deserializable {
    configGeneralId: number;
    configComponentesId: number;
    elementoEvaluacionId: number;
    configComponentes: ComponenteDTOV1;
    elementoEvaluacion: ElementoEvaluacionDTOV1;
    elementosEvaluacion: number[];
    elementosEvaluacionDto: CatalogoElementoEvaluacionDTOV1[];

    constructor() {
        this.configComponentesId = null;
        this.elementoEvaluacionId = null;
        this.configComponentes = null;
        this.elementoEvaluacion = null;
        this.elementosEvaluacion = [];
        this.elementosEvaluacionDto =[];
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
