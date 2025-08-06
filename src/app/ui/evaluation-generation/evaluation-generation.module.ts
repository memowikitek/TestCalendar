import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared';
import { ReactiveFormsModule } from '@angular/forms';
import { EvaluationGenerationComponent } from './evaluation-generation.component';
import { EvaluationGenerationRoutingModule } from './evaluation-generation-routing.module';

const PAGES = [EvaluationGenerationComponent];





@NgModule({
  declarations: [PAGES],
  imports: [CommonModule, EvaluationGenerationRoutingModule, SharedModule, ReactiveFormsModule],
  
})
export class EvaluationGenerationModule {}


