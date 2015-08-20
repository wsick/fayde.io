module Fayde.IO {
    import Control = Fayde.Controls.Control;
    import ObservableCollection = Fayde.Collections.ObservableCollection;
    import ButtonBase = Fayde.Controls.Primitives.ButtonBase;

    export class FileControl extends Control {
        static IsMultipleProperty = DependencyProperty.Register("IsMultiple", () => Boolean, FileControl, false, (d: FileControl, args) => d.OnIsMultipleChanged(args.OldValue, args.NewValue));
        static FilterProperty = DependencyProperty.Register("Filter", () => String, FileControl, undefined, (d: FileControl, args) => d.OnFilterChanged(args.OldValue, args.NewValue));
        static FilesProperty = DependencyProperty.RegisterReadOnly("Files", () => ObservableCollection, FileControl);
        IsMultiple: boolean;
        Filter: string;
        Files: ObservableCollection<File>;

        private $element: HTMLInputElement = null;
        private $button: ButtonBase = null;

        constructor() {
            super();
            this.DefaultStyleKey = FileControl;
            this.SetCurrentValue(FileControl.FilesProperty, new ObservableCollection());
        }

        OnApplyTemplate() {
            super.OnApplyTemplate();
            this.$button = <ButtonBase>this.GetTemplateChild("BrowseButton", ButtonBase);
            if (this.$button)
                this.$button.Click.on(this.Open, this);
        }

        OnIsMultipleChanged(oldValue: boolean, newValue: boolean) {
            var el = this.$element;
            if (el)
                el.multiple = newValue === true;
        }

        OnFilterChanged(oldValue: string, newValue: string) {
            var el = this.$element;
            if (el) {
                el.accept = newValue || undefined;
            }
        }

        Open() {
            var el = this.$element;
            if (!el) {
                el = this.$element = createFileInput(this.IsMultiple, this.Filter);
                var _this = this;
                el.addEventListener('change', function () {
                    _this.OnFilesChanged(this.files);
                }, false);
            }
            el.click();
        }

        protected OnFilesChanged(files: FileList) {
            var fs: File[] = [];
            for (var i = 0; i < files.length; i++) {
                fs.push(files[i]);
            }
            this.Files.Clear();
            this.Files.AddRange(fs);
        }
    }
    Fayde.Controls.TemplateParts(FileControl,
        { Name: "BrowseButton", Type: ButtonBase });

    function createFileInput(isMultiple: boolean, filter: string): HTMLInputElement {
        var el = document.createElement('input');
        el.type = "file";
        el.multiple = isMultiple === true;
        el.accept = filter || undefined;
        el.style.opacity = "0.0";
        document.body.appendChild(el);
        return el;
    }
}