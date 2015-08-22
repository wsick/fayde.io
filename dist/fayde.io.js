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
var Fayde;
(function (Fayde) {
    var IO;
    (function (IO) {
        var FailedEventArgs = (function () {
            function FailedEventArgs(error) {
                Object.defineProperties(this, {
                    "Error": {
                        value: error,
                        writable: false
                    }
                });
            }
            return FailedEventArgs;
        })();
        IO.FailedEventArgs = FailedEventArgs;
    })(IO = Fayde.IO || (Fayde.IO = {}));
})(Fayde || (Fayde = {}));
var Fayde;
(function (Fayde) {
    var IO;
    (function (IO) {
        var ProgressedEventArgs = (function () {
            function ProgressedEventArgs(loaded, total) {
                Object.defineProperties(this, {
                    "Loaded": {
                        value: loaded,
                        writable: false
                    },
                    "Total": {
                        value: total,
                        writable: false
                    }
                });
            }
            return ProgressedEventArgs;
        })();
        IO.ProgressedEventArgs = ProgressedEventArgs;
    })(IO = Fayde.IO || (Fayde.IO = {}));
})(Fayde || (Fayde = {}));
var Fayde;
(function (Fayde) {
    var IO;
    (function (IO) {
        (function (UploadReporting) {
            UploadReporting[UploadReporting["Complete"] = 1] = "Complete";
            UploadReporting[UploadReporting["Progress"] = 2] = "Progress";
            UploadReporting[UploadReporting["Failed"] = 4] = "Failed";
            UploadReporting[UploadReporting["Cancelled"] = 8] = "Cancelled";
        })(IO.UploadReporting || (IO.UploadReporting = {}));
        var UploadReporting = IO.UploadReporting;
        var Uploader = (function () {
            function Uploader() {
                var _this = this;
                this.Progressed = new nullstone.Event();
                this.Completed = new nullstone.Event();
                this.Failed = new nullstone.Event();
                this.Cancelled = new nullstone.Event();
                this.$active = null;
                this._OnUploadComplete = function (ev) {
                    _this.Completed.raise(_this, {});
                };
                this._OnUploadProgress = function (ev) {
                    _this.Progressed.raise(_this, new IO.ProgressedEventArgs(ev.loaded, ev.total));
                };
                this._OnUploadErrored = function (ev) {
                    _this.Failed.raise(_this, new IO.FailedEventArgs(ev));
                };
                this._OnUploadAborted = function (ev) {
                    _this.Cancelled.raise(_this, {});
                };
            }
            Object.defineProperty(Uploader.prototype, "Reporting", {
                get: function () {
                    return UploadReporting.Complete | UploadReporting.Progress | UploadReporting.Failed | UploadReporting.Cancelled;
                },
                enumerable: true,
                configurable: true
            });
            Uploader.prototype.Upload = function (url, data, filename, filetype) {
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
            };
            return Uploader;
        })();
        IO.Uploader = Uploader;
    })(IO = Fayde.IO || (Fayde.IO = {}));
})(Fayde || (Fayde = {}));

//# sourceMappingURL=fayde.io.js.map