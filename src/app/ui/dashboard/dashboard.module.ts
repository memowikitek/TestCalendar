import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { MenuMatComponent } from 'src/app/shared/components/menu-mat/menu-mat.component';

@NgModule({
    declarations: [DashboardComponent,MenuMatComponent],
    imports: [CommonModule, DashboardRoutingModule, SharedModule],
})
export class DashboardModule {}
