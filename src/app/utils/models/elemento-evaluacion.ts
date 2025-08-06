
// import { TblElementosEvaluacion } from "./tblElementosEvaluacion";

export class ElementoEvaluacion {
    id: number | null;
    clave: string | null;
    nombre: string | null;
    activo: boolean | null;
    fechaCreacion: string | null;
    usuarioCreacion: number | null;
    fechaModificacion: string | null;
    usuarioModificacion: number | null;
    tblElementosEvaluacion: any[] | null;
}