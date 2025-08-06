import { Deserializable } from '../interfaces';
import { TipoRolDTO } from './tipo-rol.dto'
import { PermisoPorVistaDTO } from './permisos-por-vista.dto';

export class InformeRevInstDTO implements Deserializable{
    id: number;
    nombreInfRi: string;
    descripcionInfRi: string;
    activo: boolean;
    cicloEvaluacionId: number;
    cicloEvaluacionNombre: string;
    nombreArchivo: string;
    archivoAzureId: number;
    fileBase64String: string;
    fechaCreacion: Date | string;
    usuarioCreacion: number;
    fechaModificacion: Date | string;
    usuarioModificacion: number;
    permisos: PermisoPorVistaDTO[] = [];

    constructor(){
        this.id = null;
        this.nombreInfRi = null;
        this.descripcionInfRi = null;
        this.activo = null;
        this.cicloEvaluacionId = null;
        this.cicloEvaluacionNombre = null;
        this.nombreArchivo = null;
        this.archivoAzureId = null;
        this.fileBase64String = null;
        this.fechaCreacion = null;
        this.usuarioCreacion = null;
        this.fechaModificacion = null;
        this.usuarioModificacion = null;
        this.permisos = [];
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}