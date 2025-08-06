
export enum EstatusEtapa2Evidencias {
    pendiente = 1,
    cargada = 2,
    NOaceptada = 3,
    aceptada = 4,
    narevision = 5,
    naNOautorizado = 6,
    naautorizado = 7,
}

export enum EstatusEtapa3Resultados {
    pendiente = 1,
    capturada = 2,
    naenrevisión = 3,
    naNOautorizado = 4,
    naautorizado = 5,
}

export enum EstatusEtapa4Autoevaluacion {
    pendiente = 1,
    capturada = 2,
    naenrevisión = 3,
    naNOautorizado = 4,
    naautorizado = 5,
}

export enum EstatusEtapa5Revisionautoevaluacion {

}


export enum EstatusEtapa6Plandemejora {
    pendienteCarga = 11,
    pendienteRevision = 12,
    autorizado = 13,
    noAutorizado = 14,
    pendiente = 21,
    decisionTomada = 22,
    noSeRealiza_EnRevisión = 23,
    noSeRealiza_Autorizado = 24,
    noSeRealiza_No_Autorizado = 25,
    no_Requerida = 26
}

export enum EstatusEtapa7 {
    pendiente = 1,
    guardada = 2,
}

export enum ModalTitle {
    AUT = 'Autorizar',
    CON = 'Consultar',
    CAP = 'Capturar',
    AUTNA = 'Autorizar N/A'
}


