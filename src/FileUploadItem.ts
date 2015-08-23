module Fayde.IO {
    import ObservableObject = Fayde.MVVM.ObservableObject;

    export class FileUploadItem extends ObservableObject {
        private $file: File;

        UploadProgress = 0;
        IsUploading = false;
        UploadStatus = "";
        UploadError = null;

        constructor(file: File) {
            super();
            this.$file = file;
        }

        get Size(): number {
            return this.$file ? this.$file.size : 0;
        }

        get Name(): string {
            return this.$file ? this.$file.name : "";
        }

        get Type(): string {
            return this.$file ? this.$file.type : "";
        }

        Upload(url: string, uploader: IUploader) {
            this.IsUploading = true;
            uploader.Cancelled.on(this._OnCancelled, this);
            uploader.Completed.on(this._OnCompleted, this);
            uploader.Progressed.on(this._OnProgressed, this);
            uploader.Failed.on(this._OnFailed, this);
            uploader.Upload(url, this.$file, this.Name, this.Type);
        }

        private _OnCancelled() {
            this.UploadStatus = "Cancelled";
            this.IsUploading = false;
        }

        private _OnCompleted() {
            this.UploadStatus = "Completed";
            this.IsUploading = false;
        }

        private _OnProgressed(sender, args: ProgressedEventArgs) {
            this.UploadStatus = "";
            this.UploadProgress = args.Loaded / args.Total;
        }

        private _OnFailed(sender, args: FailedEventArgs) {
            this.UploadStatus = "Failed";
            this.UploadError = args.Error;
            this.IsUploading = false;
        }
    }
    Fayde.MVVM.NotifyProperties(FileUploadItem, ["UploadProgress", "IsUploading", "UploadStatus", "UploadError"]);
}