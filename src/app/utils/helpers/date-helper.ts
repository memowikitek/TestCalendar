import * as moment from 'moment';

export class DateHelper {
    // static FULL_DATE_FORMAT = 'DD/MM/YYYY HH:mm:ss';
    static FULL_DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

    private static DATE_FORMAT = 'DD/MM/YYYY';

    private static FULL_DATE_FORMAT_ = 'YYYY-MM-DD';

    static isValidDateString(dateToValid: string): boolean {
        const date = moment(dateToValid, this.DATE_FORMAT);
        return date.isValid();
    }

    static isValidDate(dateToValid: Date): boolean {
        const date = moment(dateToValid);
        return date.isValid();
    }

    static convertToDate(dateString: string): Date {
        if (!this.isValidDateString(dateString)) {
            return null;
        }
        const date = moment(dateString, this.DATE_FORMAT);
        return date.toDate();
    }

    static convertToString(date: Date): string {
        if (!this.isValidDate(date)) {
            return null;
        }
        const dateString: string = moment(date).format(this.DATE_FORMAT);
        return dateString;
    }

    static convertToStringWithFormat(date: Date, format: string): string {
        if (!this.isValidDate(date)) {
            return null;
        }
        const dateString: string = moment(date).format(format);
        return dateString;
    }

    static convertToStringYYMMD(date: Date): string {
        if (!this.isValidDate(date) || date == null) {
            return null;
        }
        let dateString: string = moment(date).format(this.FULL_DATE_FORMAT_);//console.log('DATESTRING:',dateString);
        return (dateString === '0001-01-01') ? null : dateString;
    }

    static addPeriodToDate(dateString: string, period: any, amount: number): Date {
        if (!this.isValidDate(this.convertToDate(dateString))) {
            return null;
        }
        const date = moment(dateString, this.DATE_FORMAT);
        date.add(amount, period);
        // const date = moment(dateString).add(amount, period).format(this.DATE_FORMAT);
        return date.toDate();
    }

    // static getLocalDateTime(): Date {
    //     const date = moment().tz('Mexico/General').utc().valueOf();
    //     return new Date(date);
    // }

    static fechaActual() {
        let date = new Date();
        let day = date.getDate();
        let dd = (day < 10) ? `0${day}` : day;
        let month = date.getMonth() + 1;
        let mm = (month < 10) ? `0${month}` : month;
        let yy = date.getFullYear();
        let fecha = `${yy}-${mm}-${dd}`;
        return fecha;
    }
}
