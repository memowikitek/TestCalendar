import { Component, OnInit, Inject, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfNivelAreaResponsableDTO, ConfigGeneralDTO } from 'src/app/utils/models';
import { ConfiguracionGeneral } from 'src/app/utils/models/configuracion-general';

@Component({
    selector: 'app-header-evaluation-configuration',
    templateUrl: './header-evaluation-configuration.component.html',
    styleUrls: ['./header-evaluation-configuration.component.scss'],
})
export class HeaderEvaluationConfigurationComponent implements OnInit {
    @Input() configGeneralData = new ConfiguracionGeneral();
    @Input() title = 'Configuración General';

    panelOpenState = false;
    constructor() { }

    getAreaResponsableString(configGeneral: any) {

        if (configGeneral.areaResponsable?.tipoArea?.length == 1) {
            return configGeneral.areaResponsable?.tipoArea === 'G' ? 'Area Común' : 'Nivel / Modalidad'
        }

        if (configGeneral.tipoArea?.length == 1) {
            return configGeneral.tipoArea === 'G' ? 'Area Común' : 'Nivel / Modalidad'
        }

        return configGeneral.areaResponsable?.tipoArea;
    }

    getNivelesModalidad(configGeneral: any){
        
        if (configGeneral.niveles){
            return configGeneral.niveles;    
        }
        if (configGeneral.nivelesModalidad){
            return configGeneral.nivelesModalidad;
        }
        return configGeneral.niveles;
    }

    ngOnInit(): void {
    }
}
