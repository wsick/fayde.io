class FileControlViewModel extends Fayde.MVVM.ViewModelBase {
    Files: File[];

    FilesChanged(pars: Fayde.IEventBindingArgs<Fayde.IO.FilesChangedEventArgs>) {
        this.Files = pars.args.NewFiles;
        console.log(pars.args.NewFiles);
    }

    Upload() {
        var fi: File;
        if (!this.Files || !(fi = this.Files[0]))
            return;
        var uploader = new Fayde.IO.Uploader();
        uploader.Completed.on(() => console.log("Completed"), this);
        uploader.Progressed.on((sender, args) => console.log("Progressed", args), this);
        uploader.Upload("http://localhost:3000/api/upload", fi, fi.name, fi.type);
    }
}
export = FileControlViewModel;