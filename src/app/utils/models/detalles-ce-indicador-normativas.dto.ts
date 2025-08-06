import { Deserializable } from '../interfaces';

export class DetailsCeIndicatorNormativaDTOV1 implements Deserializable {
/*    procesoEvaluacionId: number
    indicadorSiacid: number
    componenteId: number
    elementoEvaluacionId: number
    areaCentralId: number
    subAreaCentralId: number
    normativaId: number
    claveNormativa: string
    normativa: string
    activo: boolean
    usuarioCreacion: number
    usuarioModificacion: number
*/
    indicadorId: number
    cicloEvaluacionId: number
    normativaId: number
    claveNormativa: string
    normativa: string
    activo: boolean
    usuarioCreacion: number
    usuarioModificacion: number

    constructor() {
        /*this.procesoEvaluacionId = 9;
        this.indicadorSiacid = 195;
        this.componenteId = 3;
        this.elementoEvaluacionId = 3;
        this.areaCentralId = 2;
        this.subAreaCentralId = 4;
        this.normativaId = 3;
        this.claveNormatividad = "VIN3-1";
        this.normatividad = "Lineamiento Institucional de Investigacion de la Universidad del Valle de Mexico";
        this.activo = true;
        this.usuarioCreacion = 22;
        this.usuarioModificacion = 0;
*/
  /*      this.procesoEvaluacionId = null;
        this.indicadorSiacid = null;
        this.componenteId = null;
        this.elementoEvaluacionId = null;
        this.areaCentralId = null;
        this.subAreaCentralId = null;
        this.normativaId = null;
        this.claveNormativa = null;
        this.normativa = null;
        this.activo = null;
        this.usuarioCreacion = null;
        this.usuarioModificacion = null;*/
        this.indicadorId = null;
        this.cicloEvaluacionId = null;
        this.normativaId = null;
        this.claveNormativa = null;
        this.normativa = null;
        this.activo = null;
        this.usuarioCreacion = null;
        this.usuarioModificacion = null;

    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
