import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared';
import { MyInstitutionalReviewsComponent } from './my-institutional-reviews.component';
import { MyInstitutionalReviewsRoutingModule } from './my-institutional-reviews-routing.module';

@NgModule({
  declarations: [MyInstitutionalReviewsComponent],
  imports: [CommonModule, SharedModule, MyInstitutionalReviewsRoutingModule]
})
export class MyInstitutionalReviewsModule { }
