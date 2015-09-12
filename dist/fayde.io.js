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
        (function (UploadReporting) {
            UploadReporting[UploadReporting["Complete"] = 1] = "Complete";
            UploadReporting[UploadReporting["Progress"] = 2] = "Progress";
            UploadReporting[UploadReporting["Failed"] = 4] = "Failed";
            UploadReporting[UploadReporting["Cancelled"] = 8] = "Cancelled";
        })(IO.UploadReporting || (IO.UploadReporting = {}));
        var UploadReporting = IO.UploadReporting;
        IO.IUploader_ = new nullstone.Interface("IUploader");
        IO.IUploader_.is = function (o) {
            return o && typeof o.Upload === "function";
        };
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
                var fdata = new FormData();
                fdata.append('image', data);
                xhr.send(fdata);
            };
            return Uploader;
        })();
        IO.Uploader = Uploader;
    })(IO = Fayde.IO || (Fayde.IO = {}));
})(Fayde || (Fayde = {}));
/// <reference path="upload/Uploader" />
var Fayde;
(function (Fayde) {
    var IO;
    (function (IO) {
        var Control = Fayde.Controls.Control;
        var ItemsControl = Fayde.Controls.ItemsControl;
        var ObservableCollection = Fayde.Collections.ObservableCollection;
        var ButtonBase = Fayde.Controls.Primitives.ButtonBase;
        var FileUploadControl = (function (_super) {
            __extends(FileUploadControl, _super);
            function FileUploadControl() {
                _super.call(this);
                this.$control = null;
                this.$upload = null;
                this.DefaultStyleKey = FileUploadControl;
                this.SetCurrentValue(FileUploadControl.ItemsProperty, new ObservableCollection());
            }
            FileUploadControl.prototype.OnUploaderTypeChanged = function (oldType, newType) {
                var hasProgress = true;
                if (!newType || typeof newType !== "function") {
                    hasProgress = false;
                }
                else {
                    var test = IO.IUploader_.as(new newType());
                    hasProgress = !!test && (test.Reporting & IO.UploadReporting.Progress) === 0;
                }
                this.SetCurrentValue(FileUploadControl.HasNoProgressProperty, !hasProgress);
            };
            FileUploadControl.prototype.CreateUploader = function () {
                return new this.UploaderType();
            };
            FileUploadControl.prototype.OnApplyTemplate = function () {
                _super.prototype.OnApplyTemplate.call(this);
                if (this.$control)
                    this.$control.FilesChanged.off(this._OnFilesChanged, this);
                this.$control = this.GetTemplateChild("FileControl", IO.FileControl);
                if (this.$control)
                    this.$control.FilesChanged.on(this._OnFilesChanged, this);
                if (this.$upload)
                    this.$upload.Click.off(this._OnStart, this);
                this.$upload = this.GetTemplateChild("UploadButton", ButtonBase);
                if (this.$upload)
                    this.$upload.Click.on(this._OnStart, this);
            };
            FileUploadControl.prototype._OnFilesChanged = function (sender, args) {
                this.Items.Clear();
                this.Items.AddRange(args.NewFiles.map(function (file) { return new IO.FileUploadItem(file); }));
            };
            FileUploadControl.prototype._OnStart = function (sender, args) {
                var url;
                if (!this.UploadUri || !(url = this.UploadUri.toString())) {
                    console.warn("Cannot upload with UploadUri set.");
                    return;
                }
                for (var en = this.Items.getEnumerator(); en.moveNext();) {
                    en.current.Upload(url, this.CreateUploader());
                }
            };
            FileUploadControl.ItemsProperty = DependencyProperty.RegisterReadOnly("Items", function () { return ObservableCollection; }, FileUploadControl);
            FileUploadControl.UploaderTypeProperty = DependencyProperty.Register("UploaderType", function () { return Function; }, FileUploadControl, IO.Uploader, function (d, args) { return d.OnUploaderTypeChanged(args.OldValue, args.NewValue); });
            FileUploadControl.HasNoProgressProperty = DependencyProperty.RegisterReadOnly("HasNoProgress", function () { return Boolean; }, FileUploadControl, false);
            FileUploadControl.UploadUriProperty = DependencyProperty.Register("UploadUri", function () { return Fayde.Uri; }, FileUploadControl);
            return FileUploadControl;
        })(Control);
        IO.FileUploadControl = FileUploadControl;
        Fayde.Controls.TemplateParts(FileUploadControl, { Name: "FileControl", Type: IO.FileControl }, { Name: "UploadButton", Type: ButtonBase }, { Name: "ItemsProgress", Type: ItemsControl });
    })(IO = Fayde.IO || (Fayde.IO = {}));
})(Fayde || (Fayde = {}));
var Fayde;
(function (Fayde) {
    var IO;
    (function (IO) {
        var ObservableObject = Fayde.MVVM.ObservableObject;
        var FileUploadItem = (function (_super) {
            __extends(FileUploadItem, _super);
            function FileUploadItem(file) {
                _super.call(this);
                this.UploadProgress = 0;
                this.IsUploading = false;
                this.UploadStatus = "";
                this.UploadError = null;
                this.$file = file;
            }
            Object.defineProperty(FileUploadItem.prototype, "Size", {
                get: function () {
                    return this.$file ? this.$file.size : 0;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FileUploadItem.prototype, "Name", {
                get: function () {
                    return this.$file ? this.$file.name : "";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FileUploadItem.prototype, "Type", {
                get: function () {
                    return this.$file ? this.$file.type : "";
                },
                enumerable: true,
                configurable: true
            });
            FileUploadItem.prototype.Upload = function (url, uploader) {
                this.IsUploading = true;
                uploader.Cancelled.on(this._OnCancelled, this);
                uploader.Completed.on(this._OnCompleted, this);
                uploader.Progressed.on(this._OnProgressed, this);
                uploader.Failed.on(this._OnFailed, this);
                uploader.Upload(url, this.$file, this.Name, this.Type);
            };
            FileUploadItem.prototype._OnCancelled = function () {
                this.UploadStatus = "Cancelled";
                this.IsUploading = false;
            };
            FileUploadItem.prototype._OnCompleted = function () {
                this.UploadStatus = "Completed";
                this.IsUploading = false;
            };
            FileUploadItem.prototype._OnProgressed = function (sender, args) {
                this.UploadStatus = "";
                this.UploadProgress = args.Loaded / args.Total;
            };
            FileUploadItem.prototype._OnFailed = function (sender, args) {
                this.UploadStatus = "Failed";
                this.UploadError = args.Error;
                this.IsUploading = false;
            };
            return FileUploadItem;
        })(ObservableObject);
        IO.FileUploadItem = FileUploadItem;
        Fayde.MVVM.NotifyProperties(FileUploadItem, ["UploadProgress", "IsUploading", "UploadStatus", "UploadError"]);
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
        var TB = Math.pow(2, 40);
        var GB = Math.pow(2, 30);
        var MB = Math.pow(2, 20);
        var KB = Math.pow(2, 10);
        var threshold = 0.9;
        function round(val, digits) {
            var factor = Math.pow(10, digits);
            return Math.round(val * factor) / factor;
        }
        var SizeConverter = (function () {
            function SizeConverter() {
            }
            SizeConverter.prototype.Convert = function (value, targetType, parameter, culture) {
                var short;
                if ((short = value / TB) > threshold)
                    return round(short, 2).toString() + "TB";
                if ((short = value / GB) > threshold)
                    return round(short, 2).toString() + "GB";
                if ((short = value / MB) > threshold)
                    return round(short, 2).toString() + "MB";
                if ((short = value / KB) > threshold)
                    return round(short, 2).toString() + "KB";
                return value;
            };
            SizeConverter.prototype.ConvertBack = function (value, targetType, parameter, culture) {
                return value;
            };
            return SizeConverter;
        })();
        IO.SizeConverter = SizeConverter;
        Fayde.Data.IValueConverter_.mark(SizeConverter);
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

//# sourceMappingURL=fayde.io.js.map