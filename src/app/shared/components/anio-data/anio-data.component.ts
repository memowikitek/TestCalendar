import { Component, OnInit } from '@angular/core';
import {FormControl, FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import {MatDatepicker} from '@angular/material/datepicker';

import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import * as _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-anio-data',
  templateUrl: './anio-data.component.html',
  styleUrls: ['./anio-data.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class AnioDataComponent implements OnInit {
  cicloEvaRecordForm: FormGroup;
  date = new FormControl(moment());

  constructor() { }

  ngOnInit(): void {
  }


  setMonthAndYear(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value; console.log('ctrlValue'+ctrlValue);
    ctrlValue.year(normalizedYear.year()); console.log('Year:'+normalizedYear.year());
    this.date.setValue(ctrlValue);
    datepicker.close();
  }

  chosenYearHandler(normalizedYear: Date) {
    const ctrlValue = this.date.value;
    ctrlValue.setFullYear(normalizedYear.getFullYear());
    this.date.setValue(ctrlValue);
  }
}
