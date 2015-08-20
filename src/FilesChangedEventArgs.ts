module Fayde.IO {
    export class FilesChangedEventArgs implements nullstone.IEventArgs {
        OldFiles: File[];
        NewFiles: File[];

        constructor(oldFiles: File[], newFiles: File[]) {
            Object.defineProperties(this, {
                "OldFiles": {
                    value: oldFiles,
                    writable: false
                },
                "NewFiles": {
                    value: newFiles,
                    writable: false
                }
            })
        }
    }
}