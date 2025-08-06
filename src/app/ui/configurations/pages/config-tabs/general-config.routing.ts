import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GeneralConfigComponent } from './general-config.component';

const routes: Routes = [
    {
        path: '',
        component: GeneralConfigComponent,
        // children: [
        //     {
        //         path: 'ConfiguracionGeneral',
        //         loadChildren: () =>
        //             import(
        //                 './pages/configuration-main/tabs/configuration-general/configuration-general.component'
        //             ).then((m) => m.ConfigurationGeneralComponent),
        //     },
        //     // { path: 'tab2', component: Tab2Component },
        //     // { path: 'tab3', component: Tab3Component },
        // ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class GeneralConfigRoutingModule {}
