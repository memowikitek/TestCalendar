import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewWelcomeComponent } from './new-welcome.component';

const routes: Routes = [{ path: '', component: NewWelcomeComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class NewWelcomeRoutingModule {}
