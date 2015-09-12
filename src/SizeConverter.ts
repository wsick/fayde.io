module Fayde.IO {
    var TB = Math.pow(2, 40);
    var GB = Math.pow(2, 30);
    var MB = Math.pow(2, 20);
    var KB = Math.pow(2, 10);
    var threshold = 0.9;

    function round(val: number, digits: number) {
        var factor = Math.pow(10, digits);
        return Math.round(val * factor) / factor;
    }

    export class SizeConverter implements Fayde.Data.IValueConverter {
        Convert(value: any, targetType: IType, parameter: any, culture: any): any {
            var short: number;
            if ((short = value / TB) > threshold)
                return round(short, 2).toString() + "TB";
            if ((short = value / GB) > threshold)
                return round(short, 2).toString() + "GB";
            if ((short = value / MB) > threshold)
                return round(short, 2).toString() + "MB";
            if ((short = value / KB) > threshold)
                return round(short, 2).toString() + "KB";
            return value;
        }

        ConvertBack(value: any, targetType: IType, parameter: any, culture: any): any {
            return value;
        }
    }
    Fayde.Data.IValueConverter_.mark(SizeConverter);
}