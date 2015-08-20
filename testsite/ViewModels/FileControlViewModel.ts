class FileControlViewModel extends Fayde.MVVM.ViewModelBase {
    FilesChanged(pars: Fayde.IEventBindingArgs<Fayde.IO.FilesChangedEventArgs>) {
        console.log(pars.args.NewFiles);
    }
}
export = FileControlViewModel;