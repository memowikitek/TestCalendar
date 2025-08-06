import { IndicadorMIDTO } from './indicador-mi.dto';
import { Deserializable } from '../interfaces';
import { SubIndicadorMIDTO } from './sub-indicador-mi.dto';

export class MatrizMIDTO implements Deserializable {
    matrizMIId: number;
    componenteMIId: number;
    nombreComponenteMI: string;
    descripcionComponenteMI: string;
    indicadorMIs: IndicadorMIDTO[];
    subIndicadorMIs: SubIndicadorMIDTO[];
    activo: boolean;

    constructor() {
        this.matrizMIId = 0;
        this.componenteMIId = null;
        this.nombreComponenteMI = null;
        this.descripcionComponenteMI = null;
        this.indicadorMIs = [];
        this.subIndicadorMIs = [];
        this.activo = null;
    }

    // getIndicatorMIListString(): string {
    //     return this.indicadorMIs.map((i) => `${i.nombreIndicadorMI}`).join(', ');
    // }
    // getSubIndicatorMIListString(): string {
    //     return this.subIndicadorMIs.map((i) => `${i.nombreSubIndicadorMI}`).join(', ');
    // }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
