
export class ConfigRubricaEvaluacion {
    id: number | null;
    cfgIndicadorId: number | null;
    escala: number | null;
    descripcion: string | null;
    activo: boolean | null;
    fechaCreacion: string | null;
    usuarioCreacion: number | null;
    fechaModificacion: string | null;
    usuarioModificacion: number | null;
    // configRubricasEvaluacionDet: ConfigRubricaEvaluacionDetModel[] | null;
    configRubricasEvaluacionDet: any[] | null;
}