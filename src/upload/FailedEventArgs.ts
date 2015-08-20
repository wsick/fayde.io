module Fayde.IO {
    export class FailedEventArgs implements nullstone.IEventArgs {
        Error: any;

        constructor(error: any) {
            Object.defineProperties(this, {
                "Error": {
                    value: error,
                    writable: false
                }
            })
        }
    }
}