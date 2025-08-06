import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnauthorizedRolComponent } from './unauthorized-rol.component';

const routes: Routes = [{ path: '', component: UnauthorizedRolComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UnauthorizedRolRoutingModule {}
