/// <reference path="upload/Uploader" />

module Fayde.IO {
    import Control = Fayde.Controls.Control;
    import ItemsControl = Fayde.Controls.ItemsControl;
    import ObservableCollection = Fayde.Collections.ObservableCollection;
    import ButtonBase = Fayde.Controls.Primitives.ButtonBase;

    export class FileUploadControl extends Control {
        static ItemsProperty = DependencyProperty.RegisterReadOnly("Items", () => ObservableCollection, FileUploadControl);
        static UploaderTypeProperty = DependencyProperty.Register("UploaderType", () => Function, FileUploadControl, Uploader, (d: FileUploadControl, args) => d.OnUploaderTypeChanged(args.OldValue, args.NewValue));
        static HasNoProgressProperty = DependencyProperty.RegisterReadOnly("HasNoProgress", () => Boolean, FileUploadControl, false);
        static UploadUriProperty = DependencyProperty.Register("UploadUri", () => Uri, FileUploadControl);
        Items: ObservableCollection<FileUploadItem>;
        UploaderType: IUploader;
        HasNoProgress: boolean;
        UploadUri: Uri;

        private $control: FileControl = null;
        private $upload: ButtonBase = null;

        constructor() {
            super();
            this.DefaultStyleKey = FileUploadControl;
            this.SetCurrentValue(FileUploadControl.ItemsProperty, new ObservableCollection<FileUploadItem>());
        }

        protected OnUploaderTypeChanged(oldType: Function, newType: Function) {
            var hasProgress = true;
            if (!newType || typeof newType !== "function") {
                hasProgress = false;
            } else {
                var test: IUploader = IUploader_.as(new (<any>newType)());
                hasProgress = !!test && (test.Reporting & UploadReporting.Progress) === 0;
            }
            this.SetCurrentValue(FileUploadControl.HasNoProgressProperty, !hasProgress);
        }

        protected CreateUploader(): IUploader {
            return new (<any>this.UploaderType)();
        }

        OnApplyTemplate() {
            super.OnApplyTemplate();

            if (this.$control)
                this.$control.FilesChanged.off(this._OnFilesChanged, this);
            this.$control = <FileControl>this.GetTemplateChild("FileControl", FileControl);
            if (this.$control)
                this.$control.FilesChanged.on(this._OnFilesChanged, this);

            if (this.$upload)
                this.$upload.Click.off(this._OnStart, this);
            this.$upload = <ButtonBase>this.GetTemplateChild("UploadButton", ButtonBase);
            if (this.$upload)
                this.$upload.Click.on(this._OnStart, this);
        }

        private _OnFilesChanged(sender, args: FilesChangedEventArgs) {
            this.Items.Clear();
            this.Items.AddRange(args.NewFiles.map(file => new FileUploadItem(file)));
        }

        private _OnStart(sender, args) {
            var url: string;
            if (!this.UploadUri || !(url = this.UploadUri.toString())) {
                console.warn("Cannot upload with UploadUri set.");
                return;
            }
            for (var en = this.Items.getEnumerator(); en.moveNext();) {
                en.current.Upload(url, this.CreateUploader());
            }
        }
    }
    Fayde.Controls.TemplateParts(FileUploadControl,
        {Name: "FileControl", Type: FileControl},
        {Name: "UploadButton", Type: ButtonBase},
        {Name: "ItemsProgress", Type: ItemsControl});
}