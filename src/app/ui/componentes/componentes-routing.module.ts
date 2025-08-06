import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComponentesComponent } from './componentes.component';

const routes: Routes = [{ path: '', component: ComponentesComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ComponentesRoutingModule {}
