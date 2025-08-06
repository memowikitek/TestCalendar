import { Deserializable } from '../interfaces';

export class MisionDTO implements Deserializable {
   /* procesoEvaluacionId: number
    indicadorSiacid: number
    componenteId: number
    elementoEvaluacionId: number
    areaCentralId: number
    subAreaCentralId: number
    componenteMiId: number
    claveComponente: string
    componenteMi: string
    pilarEstrategicoMiId: number
    pilarEstrategicoMi: string
    indicadorMiId: number
    claveIndicadorMi: string
    indicadorMi: string
    subIndicadorMiId: number
    claveSubIndicadorMi: string
    subIndicadorMi: string
    activo: boolean
    usuarioCreacion: number
    usuarioModificacion: number
    descripcionComponenteMi: string
    descripcionPilarEstrategicoMi: string*/


    indicadorId: number
    componenteMiId: number
    //componenteMi: string
    //descripcionComponenteMi: string
    pilarEstrategicoMiId: number
    //pilarEstrategicoMi: string
    //descripcionPilarEstrategicoMi: string
    indicadorMiId: number
    //claveIndicadorMi: string
    //indicadorMi: string
    subIndicadorMiId: number
    //claveSubIndicadorMi: string
    //subIndicadorMi: string
    activo: boolean
    usuarioCreacion: number
    usuarioModificacion: number
    componenteId : number

    constructor() {
/*        this.procesoEvaluacionId = null;
        this.indicadorSiacid = null;
        this.componenteId = null;
        this.elementoEvaluacionId = null;
        this.areaCentralId = null;
        this.subAreaCentralId = null;
        this.componenteMiId = null;
        this.claveComponente = null;
        this.componenteMi = null;
        this.pilarEstrategicoMiId = null;
        this.pilarEstrategicoMi = null;
        this.indicadorMiId = null;
        this.claveIndicadorMi = null;
        this.indicadorMi = null;
        this.subIndicadorMiId = null;
        this.claveSubIndicadorMi = null;
        this.subIndicadorMi = null;
        this.activo = null;
        this.usuarioCreacion = null;
        this.usuarioModificacion = null;
        this.descripcionComponenteMi = null;
        this.descripcionPilarEstrategicoMi = null;
*/

    this.indicadorId = null;
    this.componenteMiId = null;
    this.pilarEstrategicoMiId = null;
    this.indicadorMiId = null;
    this.subIndicadorMiId = null;
    this.componenteId = null;
    this.activo = null;
    this.usuarioCreacion = null;
    this.usuarioModificacion = null;

/*    this.pilarEstrategicoMi = null;
    this.claveComponente = null;
    this.componenteMi = null;
    this.descripcionComponenteMi = null;
    this.descripcionPilarEstrategicoMi = null;
    this.claveIndicadorMi = null;
    this.indicadorMi = null;
    this.claveSubIndicadorMi = null;
    this.subIndicadorMi = null;*/
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}


export class ComponenteMIDTO implements Deserializable {
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
        this.id = null;
        this.clave = null;
        this.nombre = null;
        this.descripcion = null;
        this.activo = null;
        this.fechaCreacion = null;
        this.usuarioCreacion = null;
        this.fechaModificacion = null;
        this.usuarioModificacion = null;
        this.indicadorMi = null;
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
