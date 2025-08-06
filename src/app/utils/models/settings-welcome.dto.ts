import { Deserializable } from '../interfaces';

export class SettingsWelcomeDTO implements Deserializable {
    id: number;
    html: string;
    fechaModificacion: string | Date;
    usuarioModificacion: number;
    cicloEvaluacionId: number;

    bienvenida: string | number;
    aviso: string;
    manualUsuario: string;
    listaArchivos: ListaArchivosModuloBienvenida[];

    constructor() {
        this.id = null;
        this.html = null;
        this.fechaModificacion = null;
        this.usuarioModificacion = null;
        this.cicloEvaluacionId = null;
        this.bienvenida = null;
        this.aviso = null;
        this.manualUsuario = null;
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}

export class SettingsWelcomeDTO1 implements Deserializable {
    id: number;
    html: string;
    activo: boolean;
    fechaCreacion: string | Date;
    usuarioCreacion: number;
    fechaModificacion: string | Date;
    usuarioModificacion: number;
    cicloEvaluacionId: number;

    constructor() {
        this.id = null;
        this.html = null;
        this.activo = null;
        this.fechaCreacion = null;
        this.usuarioCreacion = null;
        this.fechaModificacion = null;
        this.usuarioModificacion = null;
        this.cicloEvaluacionId = null;
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}


export class ListaArchivosModuloBienvenida implements Deserializable {
    uri: string;
    name: string;
    contentType: string;
    archivo: string;

    constructor() {
        this.uri = null;
        this.name = null;
        this.contentType = null;
        this.archivo = null;
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}

//ADECUAR
export class ListFilesByIdDTO implements Deserializable {
    id: number;
    clave: string;
    nombre: string;
    descripcion: string;
    cantidad: number;
    activo: boolean;
    fechaCreacion: Date | string;
    usuarioModificacion: number;
    fechaModificacion: Date | string;
    usuarioCreacion: number;
    fileBase64String: string;
    nombreFormato: string;
    archivoAzureId:number;
    constructor() {
        this.id = null;
        this.clave = null;
        this.nombre = null;
        this.descripcion = null;
        this.cantidad = null;
        this.activo = null;
        this.fechaCreacion = null;
        this.usuarioCreacion = null;
        this.fechaModificacion = null;
        this.usuarioModificacion = null;
        this.fileBase64String= null;
        this.nombreFormato= null;
        this.archivoAzureId = null;
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
