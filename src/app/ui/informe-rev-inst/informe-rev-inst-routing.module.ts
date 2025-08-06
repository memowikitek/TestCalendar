import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InformeRevInstComponent } from './informe-rev-inst.component'
const routes: Routes = [{
    path: '', 
    component: InformeRevInstComponent,
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class InformeRevInstRoutingModule {}