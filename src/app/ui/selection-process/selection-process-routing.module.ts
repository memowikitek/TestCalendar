import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SelectionProcessComponent } from './selection-process.component';

const routes: Routes = [{ path: '', component: SelectionProcessComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SelectionProcessRoutingModule {}
