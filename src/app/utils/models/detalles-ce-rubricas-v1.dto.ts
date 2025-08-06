import { Deserializable } from '../interfaces';

export class CeRubricasDTOV1 implements Deserializable {

  /*  indicadorSiacid: number
    procesoEvaluacionId: number
    componenteId: number
    elementoEvaluacionId: number
    areaCentralId: number
    subAreaCentralId: number
    escalaRubricaId: number
    rubricaEvaluacionId: number
    escala: number
    descripcion: string
    requisitoCondicion: string
    activo: boolean
    fechaCreacion: Date
    usuarioCreacion: any
    fechaModificacion: any
    usuarioModificacion: any*/
    indicadorId: number
    cicloEvaluacionId: number
    escalaRubricaId: number
    rubricaEvaluacionId: number
    escala: number
    descripcion: string
    requisitoCondicion: string
    activo: boolean
    fechaCreacion: string
    usuarioCreacion: number
    fechaModificacion: string
    usuarioModificacion: number

    constructor() {
     /*   this.indicadorSiacid = null;
        this.procesoEvaluacionId = null;
        this.componenteId = null;
        this.elementoEvaluacionId = null;
        this.areaCentralId = null;
        this.subAreaCentralId = null;
        this.escalaRubricaId = null;
        this.rubricaEvaluacionId = null;
        this.escala = null;
        this.descripcion = null;
        this.requisitoCondicion = null;
        this.activo = null;
        this.fechaCreacion = null;
        this.usuarioCreacion = null;
        this.fechaModificacion = null;
        this.usuarioModificacion = null;*/
        this.indicadorId = null;
        this.escalaRubricaId  = null;
        this.rubricaEvaluacionId  = null;
        this.escala  = null;
        this.descripcion = null;
        this.requisitoCondicion  = null;
        this.activo  = null;
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
