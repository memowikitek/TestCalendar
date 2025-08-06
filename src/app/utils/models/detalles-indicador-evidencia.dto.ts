import { Deserializable } from '../interfaces';

export class DetailsIndicatorEvidenciaDTOV1 implements Deserializable {
    indicadorId: number
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
/*    procesoEvaluacionId: number
    indicadorSiacid: number
    componenteId: number
    elementoEvaluacionId: number
    areaCentralId: number
    subAreaCentralId: number
    evidenciaId: number
    claveEvidencia: string
    evidencia: string
    archivoAzureId: any
    url: any
    contentType: any
    nombreArchivo: any
    archivo: any
    cantidad: number
    activo: boolean
    usuarioCreacion: number
    usuarioModificacion: number
    */
/*    id: number
    clave: string
    nombre: string
    descripcion: string
    activo: boolean
    usuarioCreacion: number
    usuarioModificacion: number
    fileBase64String: any
    nombreFormato: any
    archivoAzureId: any*/


    constructor() {
   /*     this.procesoEvaluacionId = null;
        this.indicadorSiacid = null;
        this.componenteId = null;
        this.elementoEvaluacionId = null;
        this.areaCentralId = null;
        this.subAreaCentralId = null;
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
     /*   this.id = null;
        this.clave = null;
        this.nombre = null;
        this.descripcion = null;
        this.activo = null;
        this.usuarioCreacion = null;
        this.usuarioModificacion = null;
        this.fileBase64String = null;
        this.nombreFormato = null;
        this.archivoAzureId = null;*/
        this.indicadorId = null;
        this.evidenciaId  = null;
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
        this.usuarioModificacion = null;
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
