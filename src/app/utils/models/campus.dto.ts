import { Deserializable } from '../interfaces';
import { NivelModalidadDTO } from './nivel-modalidad.dto';

export class CampusDTO implements Deserializable {
    campusId: number;
    nombre: string;
    regionId: number;
    regionNombre: string;
    activo: boolean;
    nivelModalidades: NivelModalidadDTO[];

    constructor() {
        this.campusId = null;
        this.nombre = null;
        this.regionId = null;
        this.regionNombre = null;
        this.activo = null;
        this.nivelModalidades = [];
    }

    getLevelModalityListString(): string {
        return this.nivelModalidades.map((i) => `${i.nivel}/${i.modalidad}`).join(', ');
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
