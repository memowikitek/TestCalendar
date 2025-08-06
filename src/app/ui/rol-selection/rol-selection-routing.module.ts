import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolSelectionComponent } from './rol-selection.component';

const routes: Routes = [{ path: '', component: RolSelectionComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SettingdRoutingModule {}
