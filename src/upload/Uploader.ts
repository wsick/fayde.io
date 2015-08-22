module Fayde.IO {
    export enum UploadReporting {
        Complete = 1,
        Progress = 2,
        Failed = 4,
        Cancelled = 8
    }

    export interface IUploader {
        Reporting: UploadReporting;
        Progressed: nullstone.Event<ProgressedEventArgs>;
        Completed: nullstone.Event<any>;
        Failed: nullstone.Event<FailedEventArgs>;
        Cancelled: nullstone.Event<any>;
        Upload(url: string, data: any, filename: string, filetype: string);
    }

    export class Uploader implements IUploader {
        get Reporting(): UploadReporting {
            return UploadReporting.Complete | UploadReporting.Progress | UploadReporting.Failed | UploadReporting.Cancelled;
        }

        Progressed = new nullstone.Event<ProgressedEventArgs>();
        Completed = new nullstone.Event<any>();
        Failed = new nullstone.Event<FailedEventArgs>();
        Cancelled = new nullstone.Event<any>();

        private $active: XMLHttpRequest = null;

        Upload(url: string, data: any, filename: string, filetype: string) {
            if (this.$active)
                throw new Error("Uploader can only upload once.");
            var xhr = this.$active = new XMLHttpRequest();
            xhr.open("POST", url, true);
            xhr.setRequestHeader("X-File-Name", filename);
            xhr.setRequestHeader("X-File-Type", filetype);

            if (xhr.upload) {
                xhr.upload.addEventListener("load", this._OnUploadComplete, false);
                xhr.upload.addEventListener("progress", this._OnUploadProgress, false);
                xhr.upload.addEventListener("error", this._OnUploadErrored, false);
                xhr.upload.addEventListener("abort", this._OnUploadAborted, false);
            }

            xhr.send(data);
        }

        private _OnUploadComplete = (ev: Event) => {
            this.Completed.raise(this, {});
        };

        private _OnUploadProgress = (ev: ProgressEvent) => {
            this.Progressed.raise(this, new ProgressedEventArgs(ev.loaded, ev.total));
        };

        private _OnUploadErrored = (ev: ErrorEvent) => {
            this.Failed.raise(this, new FailedEventArgs(ev));
        };

        private _OnUploadAborted = (ev: UIEvent) => {
            this.Cancelled.raise(this, {});
        };
    }
}