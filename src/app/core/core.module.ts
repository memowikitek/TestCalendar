import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ErrorHandler, NgModule, Optional, SkipSelf } from '@angular/core';

import { throwIfAlreadyLoaded } from '../utils/helpers';
import { GlobalErrorHandler } from './handlers/global-error/global-error.handler';
import { HttpErrorInterceptor, HttpJwtInterceptor } from './interceptors';
import { ProgressModule } from './modules/progress';
import {
    AccessTypeService,
    CampusService,
    FileUploadService,
    InstitutionService,
    RegionsService,
    ProfileService,
    RoleAssignmentService,
    RolesService,
    UsersService,
    ViewsService,
    WeightService,
    ComponentsService,
    CorporateAreaService,
    LevelModalityService,
    ResponsibilityAreasService,
    SitesService,
} from './services';

const SERVICES = [
    AccessTypeService,
    CampusService,
    FileUploadService,
    InstitutionService,
    RegionsService,
    ProfileService,
    RoleAssignmentService,
    RolesService,
    UsersService,
    ViewsService,
    WeightService,
    ComponentsService,
    CorporateAreaService,
    LevelModalityService,
    ResponsibilityAreasService,
    SitesService,
];

@NgModule({ exports: [ProgressModule], imports: [ProgressModule.forRoot()], providers: [
        SERVICES,
        { provide: ErrorHandler, useClass: GlobalErrorHandler },
        { provide: HTTP_INTERCEPTORS, useClass: HttpJwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
        provideHttpClient(withInterceptorsFromDi()),
    ] })
export class CoreModule {
    constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
        throwIfAlreadyLoaded(parentModule, 'CoreModule');
    }
}
