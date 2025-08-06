import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/guards';

const routes: Routes = [
    // {
    //     path: '',
    //     redirectTo: 'dashboard'
    // },
    {
        path: '',
        loadChildren: () => import('./ui/dashboard/dashboard.module').then((m) => m.DashboardModule),
        // canActivate: [AuthGuard],
    },
    {
        path: 'login',
        loadChildren: () => import('./ui/auth/login/login.module').then((m) => m.LoginModule),
        // canActivate: [AuthGuard],
    },
    {
        path: 'unauthorized',
        loadChildren: () => import('./ui/auth/unauthorized/unauthorized.module').then((m) => m.UnauthorizedModule),
    },
    {
        path: 'unauthorized-rol',
        loadChildren: () => import('./ui/auth/unauthorized-rol/unauthorized-rol.module').then((m) => m.UnauthorizedRolModule),
    },
    { path: '**', redirectTo: '/login' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
