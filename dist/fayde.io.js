var Fayde;
(function (Fayde) {
    var IO;
    (function (IO) {
        IO.version = '0.1.0';
    })(IO = Fayde.IO || (Fayde.IO = {}));
})(Fayde || (Fayde = {}));
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Fayde;
(function (Fayde) {
    var IO;
    (function (IO) {
        var ContentControl = Fayde.Controls.ContentControl;
        var ObservableCollection = Fayde.Collections.ObservableCollection;
        var ButtonBase = Fayde.Controls.Primitives.ButtonBase;
        var FileControl = (function (_super) {
            __extends(FileControl, _super);
            function FileControl() {
                _super.call(this);
                this.FilesChanged = new nullstone.Event();
                this.$element = null;
                this.$button = null;
                this.DefaultStyleKey = FileControl;
                this.SetCurrentValue(FileControl.FilesProperty, new ObservableCollection());
            }
            FileControl.prototype.OnApplyTemplate = function () {
                _super.prototype.OnApplyTemplate.call(this);
                this.$button = this.GetTemplateChild("BrowseButton", ButtonBase);
                if (this.$button)
                    this.$button.Click.on(this.Open, this);
            };
            FileControl.prototype.OnIsMultipleChanged = function (oldValue, newValue) {
                var el = this.$element;
                if (el)
                    el.multiple = newValue === true;
            };
            FileControl.prototype.OnFilterChanged = function (oldValue, newValue) {
                var el = this.$element;
                if (el) {
                    el.accept = newValue || undefined;
                }
            };
            FileControl.prototype.Open = function () {
                var el = this.$element;
                if (!el) {
                    el = this.$element = createFileInput(this.IsMultiple, this.Filter);
                    var _this = this;
                    el.addEventListener('change', function () {
                        _this.OnFilesChanged(this.files);
                    }, false);
                }
                el.files = null;
                el.click();
            };
            FileControl.prototype.OnFilesChanged = function (files) {
                var fs = [];
                for (var i = 0; i < files.length; i++) {
                    fs.push(files[i]);
                }
                var old = this.Files.ToArray();
                this.Files.Clear();
                this.Files.AddRange(fs);
                this.FilesChanged.raise(this, new IO.FilesChangedEventArgs(old, fs));
            };
            FileControl.IsMultipleProperty = DependencyProperty.Register("IsMultiple", function () { return Boolean; }, FileControl, false, function (d, args) { return d.OnIsMultipleChanged(args.OldValue, args.NewValue); });
            FileControl.FilterProperty = DependencyProperty.Register("Filter", function () { return String; }, FileControl, undefined, function (d, args) { return d.OnFilterChanged(args.OldValue, args.NewValue); });
            FileControl.FilesProperty = DependencyProperty.RegisterReadOnly("Files", function () { return ObservableCollection; }, FileControl);
            return FileControl;
        })(ContentControl);
        IO.FileControl = FileControl;
        Fayde.Controls.TemplateParts(FileControl, { Name: "BrowseButton", Type: ButtonBase });
        function createFileInput(isMultiple, filter) {
            var el = document.createElement('input');
            el.type = "file";
            el.multiple = isMultiple === true;
            el.accept = filter || undefined;
            el.style.opacity = "0.0";
            document.body.appendChild(el);
            return el;
        }
    })(IO = Fayde.IO || (Fayde.IO = {}));
})(Fayde || (Fayde = {}));
var Fayde;
(function (Fayde) {
    var IO;
    (function (IO) {
        var FilesChangedEventArgs = (function () {
            function FilesChangedEventArgs(oldFiles, newFiles) {
                Object.defineProperties(this, {
                    "OldFiles": {
                        value: oldFiles,
                        writable: false
                    },
                    "NewFiles": {
                        value: newFiles,
                        writable: false
                    }
                });
            }
            return FilesChangedEventArgs;
        })();
        IO.FilesChangedEventArgs = FilesChangedEventArgs;
    })(IO = Fayde.IO || (Fayde.IO = {}));
})(Fayde || (Fayde = {}));

//# sourceMappingURL=fayde.io.js.map