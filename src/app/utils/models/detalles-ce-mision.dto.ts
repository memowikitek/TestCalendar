import { Deserializable } from '../interfaces';

export class CEMisionDTO implements Deserializable {
    indicadorId: number
    cicloEvaluacionId: number
    componenteMiId: number
    pilarEstrategicoMiId: number
    indicadorMiId: number
    subIndicadorMiId: number
    activo: boolean
    usuarioCreacion: number
    usuarioModificacion: number
    componenteId : number

    constructor() {

    this.indicadorId = null;
    this.cicloEvaluacionId = null;
    this.componenteMiId = null;
    this.pilarEstrategicoMiId = null;
    this.indicadorMiId = null;
    this.subIndicadorMiId = null;
    this.componenteId = null;
    this.activo = null;
    this.usuarioCreacion = null;
    this.usuarioModificacion = null;
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}

export class ComponenteCEMIDTO implements Deserializable {
    indicadorId: number
    cicloEvaluacionId: number
    id: number
    clave: string
    nombre: string
    descripcion: string
    activo: boolean
    fechaCreacion: string
    usuarioCreacion: number
    fechaModificacion: any
    usuarioModificacion: any
    indicadorMi: any
    
    
    constructor() {
        this.indicadorId = null;
        this.cicloEvaluacionId = null;
        this.id = null;
        this.clave = null;
        this.nombre = null;
        this.descripcion = null;
        this.activo = null;
        this.fechaCreacion = null;
        this.usuarioCreacion = null;
        this.fechaModificacion = null;
        this.usuarioModificacion = null;
        this.indicadorMi = [];
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
