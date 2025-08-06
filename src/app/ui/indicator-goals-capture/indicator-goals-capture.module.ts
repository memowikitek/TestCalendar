import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared';
import { ReactiveFormsModule } from '@angular/forms';
import { IndicatorGoalsCaptureComponent } from './indicator-goals-capture.component'; 
import { IndicatorGoalsCaptureRoutingModule } from './indicator-goals-capture-routing.module';
import { CaptureDetailIndicatorComponent } from './capture-detail-indicator/capture-detail-indicator.component';
import { IndicatorGoalsCaptureByIndicatorComponent } from './indicador-goals-capture-controls/indicator-goals-capture-by-indicator/indicator-goals-capture-by-indicator.component';
import { IndicatorGoalsCaptureEvidenceLoadComponent } from './indicador-goals-capture-controls/indicator-goals-capture-evidence-load/indicator-goals-capture-evidence-load.component';
import { ModalIndicatorCaptureComponent } from './indicador-goals-capture-controls/modal-indicator-capture/modal-indicator-capture.component';
import { ModalAutorizeNaIndicatorComponent } from './indicador-goals-capture-controls/modal-autorize-na-indicator/modal-autorize-na-indicator.component';
import { IndicatorGoalParametersControlComponent } from './indicador-goals-capture-controls/indicator-goal-parameters-control/indicator-goal-parameters-control.component';
import { IndicatorEvidenceCaptureComponent } from './indicator-evidence-capture/indicator-evidence-capture.component';
import { TableCEIndicatorsComponent } from './indicador-goals-capture-controls/table-ceindicators/table-ceindicators.component';
import { ModalEvidenceCaptureComponent } from './indicador-goals-capture-controls/modal-evidence-capture/modal-evidence-capture.component';
import { ModalAutorizeNaEvidenceComponent } from './indicador-goals-capture-controls/modal-autorize-na-evidence/modal-autorize-na-evidence.component';
import { IndicatorResultCaptureComponent } from './indicator-result-capture/indicator-result-capture.component';
import { ModalResultCaptureComponent } from './indicador-goals-capture-controls/modal-result-capture/modal-result-capture.component';
import { IndicatorResultCaptureByLevelComponent } from './indicador-goals-capture-controls/indicator-result-capture-by-level/indicator-result-capture-by-level.component';
import { FormsModule } from '@angular/forms';
import { ModalAutorizeNaResultComponent } from './indicador-goals-capture-controls/modal-autorize-na-result/modal-autorize-na-result.component';
import { IndicatorAutoevaluationCaptureComponent } from './indicator-autoevaluation-capture/indicator-autoevaluation-capture.component';
import { IndicatorAutoevaluationCaptureByLevelComponent } from './indicador-goals-capture-controls/indicator-autoevaluation-capture-by-level/indicator-autoevaluation-capture-by-level.component';
import { ModalAutoevaluationCaptureComponent } from './indicador-goals-capture-controls/modal-autoevaluation-capture/modal-autoevaluation-capture.component';
import { ModalAutorizeNaAutoevaluationComponent } from './indicador-goals-capture-controls/modal-autorize-na-autoevaluation/modal-autorize-na-autoevaluation.component';
import { RubricaAutoevaluacionComponent } from './indicador-goals-capture-controls/modal-autoevaluation-capture/rubrica-autoevaluacion/rubrica-autoevaluacion.component';
import { IndicatorAutoevaluationreviewCaptureComponent } from './indicator-autoevaluationreview-capture/indicator-autoevaluationreview-capture.component';
import { IndicatorGoalCaptureAutoevaluationreviewComponent } from './indicador-goals-capture-controls/indicator-goal-capture-autoevaluationreview/indicator-goal-capture-autoevaluationreview.component';
import { ModalAutoevaluationreviewCaptureComponent } from './indicador-goals-capture-controls/modal-autoevaluationreview-capture/modal-autoevaluationreview-capture.component';
import { ModalAutorizeNaAutoevaluationreviewComponent } from './indicador-goals-capture-controls/modal-autorize-na-autoevaluationreview/modal-autorize-na-autoevaluationreview.component';
import { IndicatorAutoevaluationreviewCampusdepareaComponent } from './indicator-autoevaluationreview-campusdeparea/indicator-autoevaluationreview-campusdeparea.component';
import { CardAutoEvaluationRowinfoComponent } from './indicador-goals-capture-controls/card-auto-evaluation-rowinfo/card-auto-evaluation-rowinfo.component';
import { QuillModule } from 'ngx-quill';
import { ModalConfirmationAutoreviewComponent } from './indicador-goals-capture-controls/card-auto-evaluation-rowinfo/modal-confirmation-autoreview/modal-confirmation-autoreview.component';
import { IndicatorAutoevaluationreviewCampusdepareaDetailComponent } from './indicator-autoevaluationreview-campusdeparea-detail/indicator-autoevaluationreview-campusdeparea-detail.component';
import { ModalAutoevaluationreviewAjustCaptureComponent } from './indicador-goals-capture-controls/modal-autoevaluationreview-ajust-capture/modal-autoevaluationreview-ajust-capture.component';
import { RubricaAutoevaluacionAjusteComponent } from './indicador-goals-capture-controls/rubrica-autoevaluacion-ajuste/rubrica-autoevaluacion-ajuste.component';
import { ModalEvidenceAcceptComponent } from './indicador-goals-capture-controls/modal-evidence-accept/modal-evidence-accept.component';
import { ModalRevisorComponent } from './indicador-goals-capture-controls/modal-revisor/modal-revisor.component';
import { IndicatorAutoevaluationreviewViewComponent } from './indicator-autoevaluationreview-view/indicator-autoevaluationreview-view.component';
import { IndicatorImprovementPlanDesignCaptureComponent } from './indicator-improvement-plan-design-capture/indicator-improvement-plan-design-capture.component';
import { CardImprovementPlandesignRowinfoComponent } from './indicador-goals-capture-controls/card-improvement-plandesign-rowinfo/card-improvement-plandesign-rowinfo.component';
import { ModalUploadPmComponent } from './indicador-goals-capture-controls/modal-upload-pm/modal-upload-pm.component';
import { ModalAutorizePmClmComponent } from './indicador-goals-capture-controls/modal-autorize-pm-clm/modal-autorize-pm-clm.component';

import { IndicatorImprovementplanAutorizaComponent } from './indicator-improvementplan-autoriza/indicator-improvementplan-autoriza.component';
import { IndicatorImprovementplanExecutionComponent } from './indicator-improvementplan-execution/indicator-improvementplan-execution.component';
import { IndicatorImprovementplanTakeDecisionComponent } from './indicador-goals-capture-controls/indicator-improvementplan-take-decision/indicator-improvementplan-take-decision.component';
import { ModalImprovementplanDecisionCaptureComponent } from './indicador-goals-capture-controls/modal-improvementplan-decision-capture/modal-improvementplan-decision-capture.component';
import { ModalAutorizeNaImproventplanComponent } from './indicador-goals-capture-controls/modal-autorize-na-improventplan/modal-autorize-na-improventplan.component';
import { TableCeindicatorsRiComponent } from './indicador-goals-capture-controls/table-ceindicators-ri/table-ceindicators-ri.component';
import { IndicatorImprovementPlanexecutionComponent } from './indicador-goals-capture-controls/indicator-improvement-planexecution/indicator-improvement-planexecution.component';
import { ModalImprovementPlanexecutionComponent } from './indicador-goals-capture-controls/modal-improvement-planexecution/modal-improvement-planexecution.component';
import { IndicatorImprovementplanExecutionLoadReviewEvidenceComponent } from './indicator-improvementplan-execution-load-review-evidence/indicator-improvementplan-execution-load-review-evidence.component';
import { CardImprovementPlanexecutionRowinfoComponent } from './indicador-goals-capture-controls/card-improvement-planexecution-rowinfo/card-improvement-planexecution-rowinfo.component';
import { IndicatorRiE6pmdriComponent } from './indicator-ri-e6pmdri/indicator-ri-e6pmdri.component';
import { IndicatorImprovementplanExecutionCaptureComponent } from './indicator-improvementplan-execution-capture/indicator-improvementplan-execution-capture.component';
import { ModalImprovementPlanexecutionMultinivelUploadfileComponent } from './indicador-goals-capture-controls/modal-improvement-planexecution-multinivel-uploadfile/modal-improvement-planexecution-multinivel-uploadfile.component';

const PAGES = [IndicatorGoalsCaptureComponent];

@NgModule({
  declarations: [PAGES, CaptureDetailIndicatorComponent, IndicatorGoalsCaptureByIndicatorComponent, 
    IndicatorGoalsCaptureEvidenceLoadComponent, ModalIndicatorCaptureComponent, 
    ModalAutorizeNaIndicatorComponent, IndicatorGoalParametersControlComponent, 
    IndicatorEvidenceCaptureComponent, TableCEIndicatorsComponent, 
    ModalEvidenceCaptureComponent, ModalAutorizeNaEvidenceComponent, 
    IndicatorResultCaptureComponent, ModalResultCaptureComponent, IndicatorResultCaptureByLevelComponent, 
    ModalAutorizeNaResultComponent, IndicatorAutoevaluationCaptureComponent, IndicatorAutoevaluationCaptureByLevelComponent
    ,ModalAutoevaluationCaptureComponent, ModalAutorizeNaAutoevaluationComponent,RubricaAutoevaluacionComponent, 
    IndicatorAutoevaluationreviewCaptureComponent, ModalEvidenceAcceptComponent, ModalRevisorComponent
    ,ModalAutoevaluationreviewCaptureComponent, ModalAutorizeNaAutoevaluationreviewComponent,
    ModalConfirmationAutoreviewComponent,IndicatorAutoevaluationreviewCampusdepareaDetailComponent,
    ModalAutoevaluationreviewAjustCaptureComponent,RubricaAutoevaluacionAjusteComponent,
    IndicatorAutoevaluationreviewCampusdepareaComponent,CardAutoEvaluationRowinfoComponent,
    IndicatorGoalCaptureAutoevaluationreviewComponent, IndicatorAutoevaluationreviewViewComponent,
    IndicatorImprovementPlanDesignCaptureComponent, CardImprovementPlandesignRowinfoComponent,
    IndicatorImprovementplanAutorizaComponent, IndicatorImprovementplanExecutionComponent,
    IndicatorAutoevaluationreviewCampusdepareaComponent,CardAutoEvaluationRowinfoComponent,
    IndicatorGoalCaptureAutoevaluationreviewComponent,IndicatorAutoevaluationreviewViewComponent,
    IndicatorImprovementPlanDesignCaptureComponent,
    ModalUploadPmComponent, ModalAutorizePmClmComponent, IndicatorImprovementplanTakeDecisionComponent, 
    ModalImprovementplanDecisionCaptureComponent, ModalAutorizeNaImproventplanComponent, 
    TableCeindicatorsRiComponent, IndicatorImprovementPlanexecutionComponent,
    ModalImprovementPlanexecutionComponent,IndicatorImprovementplanExecutionLoadReviewEvidenceComponent, 
        CardImprovementPlanexecutionRowinfoComponent, IndicatorRiE6pmdriComponent, IndicatorImprovementplanExecutionCaptureComponent, ModalImprovementPlanexecutionMultinivelUploadfileComponent],
    imports: [CommonModule, IndicatorGoalsCaptureRoutingModule, SharedModule, ReactiveFormsModule, FormsModule
    ,QuillModule.forRoot({ suppressGlobalRegisterWarning: true })],
})
export class IndicatorGoalsCaptureModule {}
