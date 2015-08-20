module Fayde.IO {
    export class ProgressedEventArgs implements nullstone.IEventArgs {
        Loaded: number;
        Total: number;

        constructor(loaded: number, total: number) {
            Object.defineProperties(this, {
                "Loaded": {
                    value: loaded,
                    writable: false
                },
                "Total": {
                    value: total,
                    writable: false
                }
            })
        }
    }
}