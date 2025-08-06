
export class CEEtapa6PMECreateModel {
    usuarioId: number | null;
    evidenciaDescripcion: string | null;
    estatusEtapa: number | null;
    archivos: CEEtapa6PMEArchivoCreateModel[];
}

export class CEEtapa6PMEArchivoCreateModel {
  base64: any | null;
  // formFile: FormFile | null;
  nivelesModalidad: CeEtapa6PmeArchivoNivModCreateModel[] | null;
}

export class CeEtapa6PmeArchivoNivModCreateModel {
  ceetapa6PlanMejoraEjecucionId: number;
  ceevaluacionId: number;
  nombreArchivo: string | null;
  nombreArchivoVisual: string | null;
}