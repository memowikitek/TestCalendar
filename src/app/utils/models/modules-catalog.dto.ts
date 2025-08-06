import { Modules } from '../enums/module';
import { Deserializable } from '../interfaces';

export class ModulesCatalogDTO implements Deserializable {
    id: number;
    name: string | null;
    url: string | null;
    gobal: boolean | null;
    section: string | null;
    key: number;

    constructor() {
        this.id = null;
        this.name = null;
        this.url = null;
        this.gobal = null;
        this.section = null;
        this.key = null;
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }

    //
    getSections(modulesList: ModulesCatalogDTO[]): string[] {
        return modulesList
            .map((item) => item.section)
            .filter((item, index) => {
                return modulesList.map((item) => item.section).indexOf(item) === index;
            })
            .filter((item) => item);
    }
}
