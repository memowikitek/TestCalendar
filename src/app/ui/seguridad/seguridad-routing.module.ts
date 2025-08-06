import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SeguridadComponent } from './seguridad.component';
import { RolesGuard } from 'src/app/shared/guards';


const routes: Routes = [
    {
        path: '',
        component: SeguridadComponent,
        children:[
            {
                path: 'roles',
                loadChildren: () => import('./pages/roles/roles.module').then((m) => m.RolesModule),
            },
            {
                path: 'usuarios',
                loadChildren: () => import('./pages/users/users.module').then((m) => m.UsersModule),
            },
            { path: '**', redirectTo: '/unauthorized' }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SeguridadRoutingModule {}

