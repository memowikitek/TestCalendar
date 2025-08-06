import { Deserializable } from '../interfaces';

export class NotificacionesAllDTO implements Deserializable {
    id: number
    cicloEvaluacionId: number
    titulo: string
    mensaje: string
    fechaCreacion: string | Date
    usuarioCreacion: number
    fechaEnvio: string | Date
    usuarioEnvio: any
    destinatarios: any
    estatusId: number
    rolesId: number[]
    areasResponsablesId: any[]
    campusesId: any[]
    usuariosId: any[]
    esVista: boolean
    duplicar: boolean
    //cicloEvaluacionDescripcion: string

    constructor() {
        this.id = null;
        this.cicloEvaluacionId = null;
        this.titulo = null;
        this.mensaje = null;
        this.fechaCreacion = null;
        this.usuarioCreacion = null;
        this.fechaEnvio = null;
        this.usuarioEnvio = null;
        this.destinatarios = null;
        this.estatusId = null;
        this.rolesId = [];
        this.areasResponsablesId = [];
        this.campusesId = [];
        this.usuariosId = [];
        //this.cicloEvaluacionDescripcion = null;
        this.esVista = false;
        this.duplicar = false;
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}

export class BuzonNotificacionesAllDTO implements Deserializable {
    id: number
    usuarioId: number
    notificacionId: number
    estatus: boolean
    notificacion: Notificacion

    constructor() {
        this.id = null;
        this.usuarioId = null;
        this.notificacionId = null;
        this.estatus = null;
        this.notificacion = null;
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}

export interface Notificacion {
    titulo: string
    mensaje: string
    fechaEnvio: any
}

export class MisNotificacionesDTOV1 implements Deserializable {
    titulo: string
    mensaje: string
    fecha: string | Date
    estatus: boolean

    constructor() {
        this.titulo = null;
        this.mensaje = null;
        this.fecha = null;
        this.estatus = null;
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}

