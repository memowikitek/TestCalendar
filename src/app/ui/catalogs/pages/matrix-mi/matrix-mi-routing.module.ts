import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatrixMiComponent } from './matrix-mi.component';

const routes: Routes = [{ path: '', component: MatrixMiComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MatrixMiRoutingModule {}
