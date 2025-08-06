import { Deserializable } from '../interfaces';

export class DetailsIndicatorAllEvidencesDTOV1 implements Deserializable {
 /*   id: number
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
    tblIndicadoresEvidencia: any[]*/
    /*indicadorId: number
    evidenciaId: number
    claveEvidencia: string
    evidencia: string
    archivoAzureId: number
    url: string
    contentType: string
    nombreArchivo: string
    archivo: string
    cantidad: number
    activo: boolean
    usuarioCreacion: number
    usuarioModificacion: number
    */
    id: number
    clave: string
    nombre: string
    descripcion: string
    activo: boolean
    usuarioCreacion: number
    usuarioModificacion: number
    fileBase64String: any
    nombreFormato: any
    archivoAzureId: any
  
    constructor() {
        /*this.id = null;
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
        this.tblIndicadoresEvidencia = [];*/
       /* this.indicadorId = null;
        this.evidenciaId = null;
        this.claveEvidencia = null;
        this.evidencia = null;
        this.archivoAzureId = null;
        this.url = null;
        this.contentType = null;
        this.nombreArchivo = null;
        this.archivo = null;
        this.cantidad = null;
        this.activo = null;
        this.usuarioCreacion = null;
        this.usuarioModificacion = null;*/
        this.id = null;
        this.clave = null;
        this.nombre = null;
        this.descripcion = null;
        this.activo = null;
        this.usuarioCreacion = null;
        this.usuarioModificacion = null;
        this.fileBase64String = null;
        this.nombreFormato = null;
        this.archivoAzureId = null;

    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
