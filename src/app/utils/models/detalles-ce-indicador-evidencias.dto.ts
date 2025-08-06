import { Deserializable } from '../interfaces';

export class DetailsCEIndicatorEvidenciaDTOV1 implements Deserializable {
    indicadorId: number
    cicloEvaluacionId: number
    id: number
    evidenciaId: number
    claveEvidencia: string
    evidencia: string
    clave: string
    nombre: string
    descripcion: string
    archivoAzureId: any
    url: string
    contentType: string
    nombreArchivo: string
    archivo: string
    cantidad: number
    activo: boolean
    fechaCreacion: string
    usuarioCreacion: number
    fechaModificacion: string
    usuarioModificacion: number
    archivoAzure: any
    tblIndicadoresEvidencia: any[]
  

    constructor() {
        this.indicadorId = null;
        this.cicloEvaluacionId = null;
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
