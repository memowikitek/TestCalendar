import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { UserRecordComponent } from './modals/user-record/user-record.component';
import { UserRecordService } from './modals/user-record/user-record.service';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

const PAGES = [UsersComponent];

const MODALS = [UserRecordComponent];

const SERVICES = [UserRecordService];

// Object.defineProperty(TooltipComponent.prototype, 'message', {
//     set(v: any) {
//         const el = document.querySelectorAll('.mat-tooltip');

//         if (el) {
//             el[el.length - 1].innerHTML = v;
//         }
//     },
// });

@NgModule({
    declarations: [PAGES, MODALS],
    imports: [CommonModule, UsersRoutingModule, SharedModule, ReactiveFormsModule, MatTooltipModule],
    providers: [SERVICES],
})
export class UsersModule {}
