export interface Audit {
    output: any;
    exito: boolean;
    id: number;
    nombre: string;
    totalIndicadores: number;
    activo: boolean;
    usuarioCreacion: number | null;
    usuarioModificacion: number | null;    
}