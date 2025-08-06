import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogsComponent } from './catalogs.component';
import { RolesGuard } from 'src/app/shared/guards';

const routes: Routes = [
    {
        path: '',
        component: CatalogsComponent,
        //TODO: VALIDAR ROLES
        //canActivate: [RolesGuard],
        children: [
            {
                path: 'perfiles',
                loadChildren: () => import('./pages/profiles/profiles.module').then((m) => m.ProfilesModule),
            },
            {
                path: 'instituciones',
                loadChildren: () =>
                    import('src/app/ui/catalogs/pages/institutions/institutions.module').then(
                        (m) => m.InstitutionsModule
                    ),
            },
            {
                path: 'campus',
                loadChildren: () =>
                    import('src/app/ui/catalogs/pages/campus/campus.module').then((m) => m.CampusModule),
            },
            {
                path: 'areas-responsabilidad',
                loadChildren: () =>
                    import('src/app/ui/catalogs/pages/responsibility-areas/responsibility-areas.module').then(
                        (m) => m.ResponsibilityAreasModule
                    ),
            },
            {
                path: 'areas-corporativas',
                loadChildren: () =>
                    import('./pages/corporate-areas/corporate-areas.module').then((m) => m.CorporateAreasModule),
            },
            {
                path: 'dependencia-area',
                loadChildren: () =>
                    import('src/app/ui/catalogs/pages/dependency-area/dependency-area.module').then(
                        (m) => m.DependencyAreaModule
                    ),
            },
            {
                path: 'subareas-corporativas',
                loadChildren: () =>
                    import('./pages/corporate-subareas/corporate-subareas.module').then(
                        (m) => m.CorporateSubAreasModule
                    ),
            },
            /*{
                path: 'sedes',
                loadChildren: () => import('./pages/sites/sites.module').then((m) => m.SitesModule),
            },*/
            /*{
                path: 'componentes',
                loadChildren: () => import('./pages/components/components.module').then((m) => m.ComponentsModule),
            },*/
            { path: '**', redirectTo: '/unauthorized' },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CatalogsRoutingModule {}
