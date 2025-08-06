import { Deserializable } from '../interfaces';

export class CriterioDTO implements Deserializable {
    acreditadoraProcesoId: number;

    carreraId: number;
    carreraNombre: string;

    capituloId: string;
    capituloNombre: string;

    tipoEvidenciaId: number;
    tipoEvidenciaNombre: string;

    criterioId: string;
    descripcion: string;

    constructor() {
        this.acreditadoraProcesoId = 0;
        this.criterioId = '0';
        this.carreraId = null;
        this.carreraNombre = null;
        this.capituloId = null;
        this.capituloNombre = null;
        this.tipoEvidenciaId = null;
        this.tipoEvidenciaNombre = null;
        this.descripcion = null;
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
