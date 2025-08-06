import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IndicatorGoalCaptureDataService {

    private autoEvaluationReviewData = new BehaviorSubject(null);
    private autoEvaluationReviewData$ = this.autoEvaluationReviewData.asObservable();
    nameAutoEvaluationReviewData = "autoEvaluationReviewData";
    //etapa 6 
    private ceIndicadoresEtapa6PMDData = new BehaviorSubject(null);
    private ceIndicadoresEtapa6PMDData$ = this.ceIndicadoresEtapa6PMDData.asObservable();
    private nameceIndicadoresEtapa6PMDData = 'ceIndicadoresEtapa6PMDData';
    // fin etapa 6

    //etapa 6 execution
    private ceIndicadoresEtapa6PMDexecutionData = new BehaviorSubject(null);
    private ceIndicadoresEtapa6PMDexecutionData$ = this.ceIndicadoresEtapa6PMDData.asObservable();
    private nameceIndicadoresEtapa6PMDexecutionData = 'ceIndicadoresEtapa6PMDexecutionData';
    // fin etapa 6 execution

    
    setCeIndicadoresEtapa6PMDExecutionData(data :any, saveOnStorage = false)
    {
      if(saveOnStorage){
        localStorage.setItem(this.nameceIndicadoresEtapa6PMDexecutionData, JSON.stringify(data));
      }
      this.ceIndicadoresEtapa6PMDexecutionData.next(data);
    }

    getCeIndicadoresEtapa6PMDexecutionData(): Observable<any>
    {
      let jsonstr = localStorage.getItem(this.nameceIndicadoresEtapa6PMDexecutionData) 
      if (jsonstr)
      {
        let dataSt = JSON.parse(jsonstr);
        return of(dataSt);
      }
      return this.ceIndicadoresEtapa6PMDexecutionData$;
    }

    setAutoEvaluationReviewData(data: any, saveOnStorage = false) {
      if(saveOnStorage){
        localStorage.setItem(this.nameAutoEvaluationReviewData, JSON.stringify(data));
      }
      this.autoEvaluationReviewData.next(data);
    }

    setCeIndicadoresEtapa6PMDData(data :any, saveOnStorage = false)
    {
      if(saveOnStorage){
        localStorage.setItem(this.nameceIndicadoresEtapa6PMDData, JSON.stringify(data));
      }
      this.ceIndicadoresEtapa6PMDData.next(data);
    }

    getCeIndicadoresEtapa6PMDData(): Observable<any>
    {
      let jsonstr = localStorage.getItem(this.nameceIndicadoresEtapa6PMDData) 
      if (jsonstr)
      {
        let dataSt = JSON.parse(jsonstr);
        return of(dataSt);
      }
      return this.ceIndicadoresEtapa6PMDData$;
    }

    getautoEvaluationReviewData(): Observable<any>
    {
      let jsonstr = localStorage.getItem(this.nameAutoEvaluationReviewData) 
      if (jsonstr)
      {
        let dataSt = JSON.parse(jsonstr);
        return of(dataSt);
      }

      return this.autoEvaluationReviewData$;
    }

}
