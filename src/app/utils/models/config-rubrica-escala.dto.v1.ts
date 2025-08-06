import { Deserializable } from '../interfaces';

export class RubricaEscalaDTOV1 implements Deserializable {
    id: number;
    escala: number;
    descripcion: string;
  requisitoCondicion: any;
  escalaRubricaId: any;

    constructor() {
        this.id = null;
        this.escala = null;
        this.descripcion = null;
    }

    getEscalaStr(): string {
        if (this.escala == -1) return 'NA';
        else return `${this.escala}`;
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
