import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { IndicatorGoalsCaptureComponent } from './indicator-goals-capture.component';
import { CaptureDetailIndicatorComponent } from './capture-detail-indicator/capture-detail-indicator.component';
import { IndicatorEvidenceCaptureComponent } from './indicator-evidence-capture/indicator-evidence-capture.component';
import { IndicatorResultCaptureComponent } from './indicator-result-capture/indicator-result-capture.component';
import { IndicatorAutoevaluationCaptureComponent } from './indicator-autoevaluation-capture/indicator-autoevaluation-capture.component';
import { IndicatorAutoevaluationreviewCaptureComponent } from './indicator-autoevaluationreview-capture/indicator-autoevaluationreview-capture.component';
import { IndicatorAutoevaluationreviewCampusdepareaComponent } from './indicator-autoevaluationreview-campusdeparea/indicator-autoevaluationreview-campusdeparea.component';
import { IndicatorAutoevaluationreviewCampusdepareaDetailComponent } from './indicator-autoevaluationreview-campusdeparea-detail/indicator-autoevaluationreview-campusdeparea-detail.component';
import { IndicatorAutoevaluationreviewViewComponent } from './indicator-autoevaluationreview-view/indicator-autoevaluationreview-view.component';
import { IndicatorImprovementplanAutorizaComponent } from './indicator-improvementplan-autoriza/indicator-improvementplan-autoriza.component';
import { IndicatorImprovementPlanDesignCaptureComponent } from './indicator-improvement-plan-design-capture/indicator-improvement-plan-design-capture.component';
import { IndicatorImprovementplanExecutionComponent } from './indicator-improvementplan-execution/indicator-improvementplan-execution.component';
import { IndicatorImprovementplanExecutionLoadReviewEvidenceComponent } from './indicator-improvementplan-execution-load-review-evidence/indicator-improvementplan-execution-load-review-evidence.component';
import { IndicatorRiE6pmdriComponent } from './indicator-ri-e6pmdri/indicator-ri-e6pmdri.component';
import { IndicatorImprovementplanExecutionCaptureComponent } from './indicator-improvementplan-execution-capture/indicator-improvementplan-execution-capture.component';

const routes: Routes = [
  { path: '', component: IndicatorGoalsCaptureComponent },
  { path: 'detailindicator', component: CaptureDetailIndicatorComponent} ,
  { path: 'evidence-capture', component: IndicatorEvidenceCaptureComponent},
  { path: 'result-capture', component: IndicatorResultCaptureComponent},
  { path: 'autoevaluation-capture', component: IndicatorAutoevaluationCaptureComponent},
  { path: 'autoevaluation-review-capture', component: IndicatorAutoevaluationreviewCaptureComponent},
  { path: 'autoevaluation-review-capture-campusdeparea', component: IndicatorAutoevaluationreviewCampusdepareaComponent},
  { path: 'autoevaluation-review-capture-campusdeparea-detail', component: IndicatorAutoevaluationreviewCampusdepareaDetailComponent},
  { path: 'autoevaluation-review-view', component: IndicatorAutoevaluationreviewViewComponent},
  { path: 'improvementplan-pm', component: IndicatorRiE6pmdriComponent,},
  { path: 'improvementplan-autoriza', component: IndicatorImprovementplanAutorizaComponent},
  { path: 'improvementplan-execution', component: IndicatorImprovementplanExecutionComponent},
  { path: 'improvementplan-execution-loadreview-evidence', component: IndicatorImprovementplanExecutionLoadReviewEvidenceComponent},
  { path: 'autoevaluation-review-view', component: IndicatorAutoevaluationreviewViewComponent},
  { path: 'improvement-plandesign-capture-autorization', component: IndicatorImprovementPlanDesignCaptureComponent}, // la misma pantalla servira para captura y autorizacion  
  { path: 'improvementplan-execution-capture', component: IndicatorImprovementplanExecutionCaptureComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IndicatorGoalsCaptureRoutingModule { }
