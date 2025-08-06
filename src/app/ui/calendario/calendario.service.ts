import { Injectable } from '@angular/core';

export class Data {
  text: string;
  startDate: Date;
  endDate: Date;
}

const data: Data[] = [
  {
    text: 'Website Re-Design Plan',
    startDate: new Date(2025, 7, 11, 9, 30),
    endDate: new Date(2025, 7, 11, 11, 30),
  },
  {
    text: 'Install New Router in Dev Room',
    startDate: new Date(2025, 7, 11, 13),
    endDate: new Date(2025, 7, 11, 14),
  },
  {
    text: 'Approve Personal Computer Upgrade Plan',
    startDate: new Date(2025, 7, 12, 10),
    endDate: new Date(2025, 7, 12, 11),
  },
  {
    text: 'Final Budget Review',
    startDate: new Date(2025, 7, 12, 13, 30),
    endDate: new Date(2025, 7, 12, 15),
  },
  {
    text: 'New Brochures',
    startDate: new Date(2025, 7, 13, 15),
    endDate: new Date(2025, 7, 13, 16, 15),
  },
  {
    text: 'Install New Database',
    startDate: new Date(2025, 7, 28, 9, 45),
    endDate: new Date(2025, 7, 28, 12),
  },
  {
    text: 'Approve New Online Marketing Strategy',
    startDate: new Date(2025, 7, 28, 11, 30),
    endDate: new Date(2025, 7, 28, 16, 30),
  },
  {
    text: 'Upgrade Personal Computers',
    startDate: new Date(2025, 7, 27, 12, 30),
    endDate: new Date(2025, 7, 27, 16, 45),
  },
  {
    text: 'Prepare 2021 Marketing Plan',
    startDate: new Date(2021, 7, 3, 13),
    endDate: new Date(2021, 7, 3, 15),
  },
  {
    text: 'Brochure Design Review',
    startDate: new Date(2021, 4, 4, 12, 30),
    endDate: new Date(2021, 4, 5),
  },
  {
    text: 'Create Icons for Website',
    startDate: new Date(2025, 7, 30, 10),
    endDate: new Date(2025, 7, 30, 12),
  },
  {
    text: 'Upgrade Server Hardware',
    startDate: new Date(2025, 7, 30, 16, 30),
    endDate: new Date(2025, 7, 30, 18),
  },
  {
    text: 'Submit New Website Design',
    startDate: new Date(2021, 7, 5, 10),
    endDate: new Date(2021, 7, 5, 11, 30),
  },
  {
    text: 'Launch New Website',
    startDate: new Date(2025, 7, 30, 11, 30),
    endDate: new Date(2025, 7, 30, 16, 10),
  },
];

@Injectable()
export class DataService {
  getData() {
    return data;
  }

  getDinnerTime() {
    return { from: 12, to: 13 };
  }

  getHolidays() {
    return [
      new Date(2025, 7, 15),
      new Date(2025, 7, 25),
    ];
  }
}