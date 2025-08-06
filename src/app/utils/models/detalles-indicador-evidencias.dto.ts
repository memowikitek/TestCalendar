import { Deserializable } from '../interfaces';

export class DetailsIndicatorEvidenciaDTOV1 implements Deserializable {
    id: number
    clave: string
    nombre: string
    descripcion: string
    archivoAzureId: any
    cantidad: number
    activo: boolean
    fechaCreacion: string
    usuarioCreacion: number
    fechaModificacion: string
    usuarioModificacion: number
    archivoAzure: any
    tblIndicadoresEvidencia: any[]
  

    constructor() {
        this.id = null;
        this.clave = null;
        this.nombre = null;
        this.descripcion = null;
        this.archivoAzureId = null;
        this.cantidad = null;
        this.activo = null;
        this.fechaCreacion = null;
        this.usuarioCreacion = null;
        this.fechaModificacion = null;
        this.usuarioModificacion = null;
        this.archivoAzure = null;
        this.tblIndicadoresEvidencia = null;

    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
