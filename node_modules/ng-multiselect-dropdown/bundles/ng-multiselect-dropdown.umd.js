(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/forms'), require('@angular/common')) :
    typeof define === 'function' && define.amd ? define('ng-multiselect-dropdown', ['exports', '@angular/core', '@angular/forms', '@angular/common'], factory) :
    (factory((global['ng-multiselect-dropdown'] = {}),global.ng.core,global.ng.forms,global.ng.common));
}(this, (function (exports,core,forms,common) { 'use strict';

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    var ListItem = (function () {
        function ListItem(source) {
            if (typeof source === 'string') {
                this.id = this.text = source;
                this.isDisabled = false;
            }
            if (typeof source === 'object') {
                this.id = source.id;
                this.text = source.text;
                this.isDisabled = source.isDisabled;
            }
        }
        return ListItem;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    var /** @type {?} */ DROPDOWN_CONTROL_VALUE_ACCESSOR = {
        provide: forms.NG_VALUE_ACCESSOR,
        useExisting: core.forwardRef(function () { return MultiSelectComponent; }),
        multi: true
    };
    var /** @type {?} */ noop = function () { };
    var MultiSelectComponent = (function () {
        function MultiSelectComponent(cdr) {
            this.cdr = cdr;
            this._data = [];
            this.selectedItems = [];
            this.isDropdownOpen = true;
            this._placeholder = 'Select';
            this.filter = new ListItem(this.data);
            this.defaultSettings = {
                singleSelection: false,
                idField: 'id',
                textField: 'text',
                disabledField: 'isDisabled',
                enableCheckAll: true,
                selectAllText: 'Select All',
                unSelectAllText: 'UnSelect All',
                allowSearchFilter: false,
                limitSelection: -1,
                clearSearchFilter: true,
                maxHeight: 197,
                itemsShowLimit: 999999999999,
                searchPlaceholderText: 'Search',
                noDataAvailablePlaceholderText: 'No data available',
                closeDropDownOnSelection: false,
                showSelectedItemsAtTop: false,
                defaultOpen: false
            };
            this.disabled = false;
            this.onFilterChange = new core.EventEmitter();
            this.onDropDownClose = new core.EventEmitter();
            this.onSelect = new core.EventEmitter();
            this.onDeSelect = new core.EventEmitter();
            this.onSelectAll = new core.EventEmitter();
            this.onDeSelectAll = new core.EventEmitter();
            this.onTouchedCallback = noop;
            this.onChangeCallback = noop;
        }
        Object.defineProperty(MultiSelectComponent.prototype, "placeholder", {
            set: /**
             * @param {?} value
             * @return {?}
             */ function (value) {
                if (value) {
                    this._placeholder = value;
                }
                else {
                    this._placeholder = 'Select';
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MultiSelectComponent.prototype, "settings", {
            set: /**
             * @param {?} value
             * @return {?}
             */ function (value) {
                if (value) {
                    this._settings = Object.assign(this.defaultSettings, value);
                }
                else {
                    this._settings = Object.assign(this.defaultSettings);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MultiSelectComponent.prototype, "data", {
            set: /**
             * @param {?} value
             * @return {?}
             */ function (value) {
                var _this = this;
                if (!value) {
                    this._data = [];
                }
                else {
                    // const _items = value.filter((item: any) => {
                    //   if (typeof item === 'string' || (typeof item === 'object' && item && item[this._settings.idField] && item[this._settings.textField])) {
                    //     return item;
                    //   }
                    // });
                    this._data = value.map(function (item) {
                        return typeof item === 'string'
                            ? new ListItem(item)
                            : new ListItem({
                                id: item[_this._settings.idField],
                                text: item[_this._settings.textField],
                                isDisabled: item[_this._settings.disabledField]
                            });
                    });
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @param {?} $event
         * @return {?}
         */
        MultiSelectComponent.prototype.onFilterTextChange = /**
         * @param {?} $event
         * @return {?}
         */
            function ($event) {
                this.onFilterChange.emit($event);
            };
        /**
         * @param {?} $event
         * @param {?} item
         * @return {?}
         */
        MultiSelectComponent.prototype.onItemClick = /**
         * @param {?} $event
         * @param {?} item
         * @return {?}
         */
            function ($event, item) {
                if (this.disabled || item.isDisabled) {
                    return false;
                }
                var /** @type {?} */ found = this.isSelected(item);
                var /** @type {?} */ allowAdd = this._settings.limitSelection === -1 ||
                    (this._settings.limitSelection > 0 &&
                        this.selectedItems.length < this._settings.limitSelection);
                if (!found) {
                    if (allowAdd) {
                        this.addSelected(item);
                    }
                }
                else {
                    this.removeSelected(item);
                }
                if (this._settings.singleSelection &&
                    this._settings.closeDropDownOnSelection) {
                    this.closeDropdown();
                }
            };
        /**
         * @param {?} value
         * @return {?}
         */
        MultiSelectComponent.prototype.writeValue = /**
         * @param {?} value
         * @return {?}
         */
            function (value) {
                var _this = this;
                if (value !== undefined && value !== null && value.length > 0) {
                    if (this._settings.singleSelection) {
                        try {
                            if (value.length >= 1) {
                                var /** @type {?} */ firstItem = value[0];
                                this.selectedItems = [
                                    typeof firstItem === 'string'
                                        ? new ListItem(firstItem)
                                        : new ListItem({
                                            id: firstItem[this._settings.idField],
                                            text: firstItem[this._settings.textField],
                                            isDisabled: firstItem[this._settings.disabledField]
                                        })
                                ];
                            }
                        }
                        catch (e) {
                            // console.error(e.body.msg);
                        }
                    }
                    else {
                        var /** @type {?} */ _data = value.map(function (item) {
                            return typeof item === 'string'
                                ? new ListItem(item)
                                : new ListItem({
                                    id: item[_this._settings.idField],
                                    text: item[_this._settings.textField],
                                    isDisabled: item[_this._settings.disabledField]
                                });
                        });
                        if (this._settings.limitSelection > 0) {
                            this.selectedItems = _data.splice(0, this._settings.limitSelection);
                        }
                        else {
                            this.selectedItems = _data;
                        }
                    }
                }
                else {
                    this.selectedItems = [];
                }
                this.onChangeCallback(value);
            };
        // From ControlValueAccessor interface
        /**
         * @param {?} fn
         * @return {?}
         */
        MultiSelectComponent.prototype.registerOnChange = /**
         * @param {?} fn
         * @return {?}
         */
            function (fn) {
                this.onChangeCallback = fn;
            };
        // From ControlValueAccessor interface
        /**
         * @param {?} fn
         * @return {?}
         */
        MultiSelectComponent.prototype.registerOnTouched = /**
         * @param {?} fn
         * @return {?}
         */
            function (fn) {
                this.onTouchedCallback = fn;
            };
        /**
         * @return {?}
         */
        MultiSelectComponent.prototype.onTouched = /**
         * @return {?}
         */
            function () {
                this.closeDropdown();
                this.onTouchedCallback();
            };
        /**
         * @param {?} index
         * @param {?} item
         * @return {?}
         */
        MultiSelectComponent.prototype.trackByFn = /**
         * @param {?} index
         * @param {?} item
         * @return {?}
         */
            function (index, item) {
                return item.id;
            };
        /**
         * @param {?} clickedItem
         * @return {?}
         */
        MultiSelectComponent.prototype.isSelected = /**
         * @param {?} clickedItem
         * @return {?}
         */
            function (clickedItem) {
                var /** @type {?} */ found = false;
                this.selectedItems.forEach(function (item) {
                    if (clickedItem.id === item.id) {
                        found = true;
                    }
                });
                return found;
            };
        /**
         * @return {?}
         */
        MultiSelectComponent.prototype.isLimitSelectionReached = /**
         * @return {?}
         */
            function () {
                return this._settings.limitSelection === this.selectedItems.length;
            };
        /**
         * @return {?}
         */
        MultiSelectComponent.prototype.isAllItemsSelected = /**
         * @return {?}
         */
            function () {
                return this._data.length === this.selectedItems.length;
            };
        /**
         * @return {?}
         */
        MultiSelectComponent.prototype.showButton = /**
         * @return {?}
         */
            function () {
                if (!this._settings.singleSelection) {
                    if (this._settings.limitSelection > 0) {
                        return false;
                    }
                    // this._settings.enableCheckAll = this._settings.limitSelection === -1 ? true : false;
                    return true; // !this._settings.singleSelection && this._settings.enableCheckAll && this._data.length > 0;
                }
                else {
                    // should be disabled in single selection mode
                    return false;
                }
            };
        /**
         * @return {?}
         */
        MultiSelectComponent.prototype.itemShowRemaining = /**
         * @return {?}
         */
            function () {
                return this.selectedItems.length - this._settings.itemsShowLimit;
            };
        /**
         * @param {?} item
         * @return {?}
         */
        MultiSelectComponent.prototype.addSelected = /**
         * @param {?} item
         * @return {?}
         */
            function (item) {
                if (this._settings.singleSelection) {
                    this.selectedItems = [];
                    this.selectedItems.push(item);
                }
                else {
                    this.selectedItems.push(item);
                }
                this.onChangeCallback(this.emittedValue(this.selectedItems));
                this.onSelect.emit(this.emittedValue(item));
            };
        /**
         * @param {?} itemSel
         * @return {?}
         */
        MultiSelectComponent.prototype.removeSelected = /**
         * @param {?} itemSel
         * @return {?}
         */
            function (itemSel) {
                var _this = this;
                this.selectedItems.forEach(function (item) {
                    if (itemSel.id === item.id) {
                        _this.selectedItems.splice(_this.selectedItems.indexOf(item), 1);
                    }
                });
                this.onChangeCallback(this.emittedValue(this.selectedItems));
                this.onDeSelect.emit(this.emittedValue(itemSel));
            };
        /**
         * @param {?} val
         * @return {?}
         */
        MultiSelectComponent.prototype.emittedValue = /**
         * @param {?} val
         * @return {?}
         */
            function (val) {
                var _this = this;
                var /** @type {?} */ selected = [];
                if (Array.isArray(val)) {
                    val.map(function (item) {
                        if (item.id === item.text) {
                            selected.push(item.text);
                        }
                        else {
                            selected.push(_this.objectify(item));
                        }
                    });
                }
                else {
                    if (val) {
                        if (val.id === val.text) {
                            return val.text;
                        }
                        else {
                            return this.objectify(val);
                        }
                    }
                }
                return selected;
            };
        /**
         * @param {?} val
         * @return {?}
         */
        MultiSelectComponent.prototype.objectify = /**
         * @param {?} val
         * @return {?}
         */
            function (val) {
                var /** @type {?} */ obj = {};
                obj[this._settings.idField] = val.id;
                obj[this._settings.textField] = val.text;
                obj[this._settings.disabledField] = val.isDisabled;
                return obj;
            };
        /**
         * @param {?} evt
         * @return {?}
         */
        MultiSelectComponent.prototype.toggleDropdown = /**
         * @param {?} evt
         * @return {?}
         */
            function (evt) {
                evt.preventDefault();
                if (this.disabled && this._settings.singleSelection) {
                    return;
                }
                this._settings.defaultOpen = !this._settings.defaultOpen;
                if (!this._settings.defaultOpen) {
                    this.onDropDownClose.emit();
                }
            };
        /**
         * @return {?}
         */
        MultiSelectComponent.prototype.closeDropdown = /**
         * @return {?}
         */
            function () {
                this._settings.defaultOpen = false;
                // clear search text
                if (this._settings.clearSearchFilter) {
                    this.filter.text = '';
                }
                this.onDropDownClose.emit();
            };
        /**
         * @return {?}
         */
        MultiSelectComponent.prototype.toggleSelectAll = /**
         * @return {?}
         */
            function () {
                if (this.disabled) {
                    return false;
                }
                if (!this.isAllItemsSelected()) {
                    this.selectedItems = this._data.slice();
                    this.onSelectAll.emit(this.emittedValue(this.selectedItems));
                }
                else {
                    this.selectedItems = [];
                    this.onDeSelectAll.emit(this.emittedValue(this.selectedItems));
                }
                this.onChangeCallback(this.emittedValue(this.selectedItems));
            };
        MultiSelectComponent.decorators = [
            { type: core.Component, args: [{
                        selector: 'ng-multiselect-dropdown',
                        template: "<div tabindex=\"=0\" (blur)=\"onTouched()\" class=\"multiselect-dropdown\" (clickOutside)=\"closeDropdown()\">\n  <div [class.disabled]=\"disabled\">\n    <span tabindex=\"-1\" class=\"dropdown-btn\" (click)=\"toggleDropdown($event)\">\n      <span *ngIf=\"selectedItems.length == 0\">{{_placeholder}}</span>\n      <span class=\"selected-item\" *ngFor=\"let item of selectedItems;trackBy: trackByFn;let k = index\" [hidden]=\"k > _settings.itemsShowLimit-1\">\n        {{item.text}}\n        <a style=\"padding-top:2px;padding-left:2px;color:white\" (click)=\"onItemClick($event,item)\">x</a>\n      </span>\n      <span style=\"float:right !important;padding-right:4px\">\n        <span style=\"padding-right: 6px;\" *ngIf=\"itemShowRemaining()>0\">+{{itemShowRemaining()}}</span>\n        <span [ngClass]=\"_settings.defaultOpen ? 'dropdown-up' : 'dropdown-down'\"></span>\n      </span>\n    </span>\n  </div>\n  <div class=\"dropdown-list\" [hidden]=\"!_settings.defaultOpen\">\n    <ul class=\"item1\">\n      <li (click)=\"toggleSelectAll()\" *ngIf=\"_data.length > 0 && !_settings.singleSelection && _settings.enableCheckAll && _settings.limitSelection===-1\" class=\"multiselect-item-checkbox\" style=\"border-bottom: 1px solid #ccc;padding:10px\">\n        <input type=\"checkbox\" aria-label=\"multiselect-select-all\" [checked]=\"isAllItemsSelected()\" [disabled]=\"disabled || isLimitSelectionReached()\" />\n        <div>{{!isAllItemsSelected() ? _settings.selectAllText : _settings.unSelectAllText}}</div>\n      </li>\n      <li class=\"filter-textbox\" *ngIf=\"_data.length>0 && _settings.allowSearchFilter\">\n        <input type=\"text\" aria-label=\"multiselect-search\" [readOnly]=\"disabled\" [placeholder]=\"_settings.searchPlaceholderText\" [(ngModel)]=\"filter.text\" (ngModelChange)=\"onFilterTextChange($event)\">\n      </li>\n    </ul>\n    <ul class=\"item2\" [style.maxHeight]=\"_settings.maxHeight+'px'\">\n      <li *ngFor=\"let item of _data | ng2ListFilter:filter; let i = index;\" (click)=\"onItemClick($event,item)\" class=\"multiselect-item-checkbox\">\n        <input type=\"checkbox\" aria-label=\"multiselect-item\" [checked]=\"isSelected(item)\" [disabled]=\"disabled || (isLimitSelectionReached() && !isSelected(item)) || item.isDisabled\" />\n        <div>{{item.text}}</div>\n      </li>\n      <li class='no-data' *ngIf=\"_data.length == 0\">\n        <h5>{{_settings.noDataAvailablePlaceholderText}}</h5>\n      </li>\n    </ul>\n  </div>\n</div>\n",
                        styles: [".multiselect-dropdown{position:relative;width:100%;font-size:inherit;font-family:inherit}.multiselect-dropdown .dropdown-btn{display:inline-block;border:1px solid #adadad;width:100%;padding:6px 12px;margin-bottom:0;font-weight:400;line-height:1.52857143;text-align:left;vertical-align:middle;cursor:pointer;background-image:none;border-radius:4px}.multiselect-dropdown .dropdown-btn .selected-item{border:1px solid #337ab7;margin-right:4px;background:#337ab7;padding:0 5px;color:#fff;border-radius:2px;float:left}.multiselect-dropdown .dropdown-btn .selected-item a{text-decoration:none}.multiselect-dropdown .dropdown-btn .selected-item:hover{box-shadow:1px 1px #959595}.multiselect-dropdown .dropdown-btn .dropdown-down{display:inline-block;top:10px;width:0;height:0;border-top:10px solid #adadad;border-left:10px solid transparent;border-right:10px solid transparent}.multiselect-dropdown .dropdown-btn .dropdown-up{display:inline-block;width:0;height:0;border-bottom:10px solid #adadad;border-left:10px solid transparent;border-right:10px solid transparent}.multiselect-dropdown .disabled>span{background-color:#eceeef}.dropdown-list{position:absolute;padding-top:6px;width:100%;z-index:9999;border:1px solid #ccc;border-radius:3px;background:#fff;margin-top:10px;box-shadow:0 1px 5px #959595}.dropdown-list ul{padding:0;list-style:none;overflow:auto;margin:0}.dropdown-list li{padding:6px 10px;cursor:pointer;text-align:left}.dropdown-list .filter-textbox{border-bottom:1px solid #ccc;position:relative;padding:10px}.dropdown-list .filter-textbox input{border:0;width:100%;padding:0 0 0 26px}.dropdown-list .filter-textbox input:focus{outline:0}.multiselect-item-checkbox input[type=checkbox]{border:0;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px}.multiselect-item-checkbox input[type=checkbox]:focus+div:before,.multiselect-item-checkbox input[type=checkbox]:hover+div:before{border-color:#337ab7;background-color:#f2f2f2}.multiselect-item-checkbox input[type=checkbox]:active+div:before{transition-duration:0s}.multiselect-item-checkbox input[type=checkbox]+div{position:relative;padding-left:2em;vertical-align:middle;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:pointer;margin:0;color:#000}.multiselect-item-checkbox input[type=checkbox]+div:before{box-sizing:content-box;content:'';color:#337ab7;position:absolute;top:50%;left:0;width:14px;height:14px;margin-top:-9px;border:2px solid #337ab7;text-align:center;transition:.4s}.multiselect-item-checkbox input[type=checkbox]+div:after{box-sizing:content-box;content:'';position:absolute;-webkit-transform:scale(0);transform:scale(0);-webkit-transform-origin:50%;transform-origin:50%;transition:transform .2s ease-out,-webkit-transform .2s ease-out;background-color:transparent;top:50%;left:4px;width:8px;height:3px;margin-top:-4px;border-style:solid;border-color:#fff;border-width:0 0 3px 3px;-o-border-image:none;border-image:none;-webkit-transform:rotate(-45deg) scale(0);transform:rotate(-45deg) scale(0)}.multiselect-item-checkbox input[type=checkbox]:disabled+div:before{border-color:#ccc}.multiselect-item-checkbox input[type=checkbox]:disabled:focus+div:before .multiselect-item-checkbox input[type=checkbox]:disabled:hover+div:before{background-color:inherit}.multiselect-item-checkbox input[type=checkbox]:disabled:checked+div:before{background-color:#ccc}.multiselect-item-checkbox input[type=checkbox]:checked+div:after{content:'';transition:transform .2s ease-out,-webkit-transform .2s ease-out;-webkit-transform:rotate(-45deg) scale(1);transform:rotate(-45deg) scale(1)}.multiselect-item-checkbox input[type=checkbox]:checked+div:before{-webkit-animation:.2s ease-in borderscale;animation:.2s ease-in borderscale;background:#337ab7}@-webkit-keyframes borderscale{50%{box-shadow:0 0 0 2px #337ab7}}@keyframes borderscale{50%{box-shadow:0 0 0 2px #337ab7}}"],
                        providers: [DROPDOWN_CONTROL_VALUE_ACCESSOR],
                        changeDetection: core.ChangeDetectionStrategy.OnPush
                    },] },
        ];
        /** @nocollapse */
        MultiSelectComponent.ctorParameters = function () {
            return [
                { type: core.ChangeDetectorRef, },
            ];
        };
        MultiSelectComponent.propDecorators = {
            "placeholder": [{ type: core.Input },],
            "disabled": [{ type: core.Input },],
            "settings": [{ type: core.Input },],
            "data": [{ type: core.Input },],
            "onFilterChange": [{ type: core.Output, args: ['onFilterChange',] },],
            "onDropDownClose": [{ type: core.Output, args: ['onDropDownClose',] },],
            "onSelect": [{ type: core.Output, args: ['onSelect',] },],
            "onDeSelect": [{ type: core.Output, args: ['onDeSelect',] },],
            "onSelectAll": [{ type: core.Output, args: ['onSelectAll',] },],
            "onDeSelectAll": [{ type: core.Output, args: ['onDeSelectAll',] },],
            "onTouched": [{ type: core.HostListener, args: ['blur',] },],
        };
        return MultiSelectComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    var ClickOutsideDirective = (function () {
        function ClickOutsideDirective(_elementRef) {
            this._elementRef = _elementRef;
            this.clickOutside = new core.EventEmitter();
        }
        /**
         * @param {?} event
         * @param {?} targetElement
         * @return {?}
         */
        ClickOutsideDirective.prototype.onClick = /**
         * @param {?} event
         * @param {?} targetElement
         * @return {?}
         */
            function (event, targetElement) {
                if (!targetElement) {
                    return;
                }
                var /** @type {?} */ clickedInside = this._elementRef.nativeElement.contains(targetElement);
                if (!clickedInside) {
                    this.clickOutside.emit(event);
                }
            };
        ClickOutsideDirective.decorators = [
            { type: core.Directive, args: [{
                        selector: '[clickOutside]'
                    },] },
        ];
        /** @nocollapse */
        ClickOutsideDirective.ctorParameters = function () {
            return [
                { type: core.ElementRef, },
            ];
        };
        ClickOutsideDirective.propDecorators = {
            "clickOutside": [{ type: core.Output },],
            "onClick": [{ type: core.HostListener, args: ['document:click', ['$event', '$event.target'],] },],
        };
        return ClickOutsideDirective;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    var ListFilterPipe = (function () {
        function ListFilterPipe() {
        }
        /**
         * @param {?} items
         * @param {?} filter
         * @return {?}
         */
        ListFilterPipe.prototype.transform = /**
         * @param {?} items
         * @param {?} filter
         * @return {?}
         */
            function (items, filter) {
                var _this = this;
                if (!items || !filter) {
                    return items;
                }
                return items.filter(function (item) { return _this.applyFilter(item, filter); });
            };
        /**
         * @param {?} item
         * @param {?} filter
         * @return {?}
         */
        ListFilterPipe.prototype.applyFilter = /**
         * @param {?} item
         * @param {?} filter
         * @return {?}
         */
            function (item, filter) {
                return !(filter.text && item.text && item.text.toLowerCase().indexOf(filter.text.toLowerCase()) === -1);
            };
        ListFilterPipe.decorators = [
            { type: core.Pipe, args: [{
                        name: 'ng2ListFilter',
                        pure: false
                    },] },
        ];
        return ListFilterPipe;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    var NgMultiSelectDropDownModule = (function () {
        function NgMultiSelectDropDownModule() {
        }
        /**
         * @return {?}
         */
        NgMultiSelectDropDownModule.forRoot = /**
         * @return {?}
         */
            function () {
                return {
                    ngModule: NgMultiSelectDropDownModule
                };
            };
        NgMultiSelectDropDownModule.decorators = [
            { type: core.NgModule, args: [{
                        imports: [common.CommonModule, forms.FormsModule],
                        declarations: [MultiSelectComponent, ClickOutsideDirective, ListFilterPipe],
                        exports: [MultiSelectComponent]
                    },] },
        ];
        return NgMultiSelectDropDownModule;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */

    exports.MultiSelectComponent = MultiSelectComponent;
    exports.NgMultiSelectDropDownModule = NgMultiSelectDropDownModule;
    exports.ɵb = ClickOutsideDirective;
    exports.ɵc = ListFilterPipe;
    exports.ɵa = DROPDOWN_CONTROL_VALUE_ACCESSOR;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctbXVsdGlzZWxlY3QtZHJvcGRvd24udW1kLmpzLm1hcCIsInNvdXJjZXMiOlsibmc6Ly9uZy1tdWx0aXNlbGVjdC1kcm9wZG93bi9tdWx0aXNlbGVjdC5tb2RlbC50cyIsIm5nOi8vbmctbXVsdGlzZWxlY3QtZHJvcGRvd24vbXVsdGlzZWxlY3QuY29tcG9uZW50LnRzIiwibmc6Ly9uZy1tdWx0aXNlbGVjdC1kcm9wZG93bi9jbGljay1vdXRzaWRlLmRpcmVjdGl2ZS50cyIsIm5nOi8vbmctbXVsdGlzZWxlY3QtZHJvcGRvd24vbGlzdC1maWx0ZXIucGlwZS50cyIsIm5nOi8vbmctbXVsdGlzZWxlY3QtZHJvcGRvd24vbmctbXVsdGlzZWxlY3QtZHJvcGRvd24ubW9kdWxlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBpbnRlcmZhY2UgSURyb3Bkb3duU2V0dGluZ3Mge1xyXG4gIHNpbmdsZVNlbGVjdGlvbj86IGJvb2xlYW47XHJcbiAgaWRGaWVsZD86IHN0cmluZztcclxuICB0ZXh0RmllbGQ/OiBzdHJpbmc7XHJcbiAgZGlzYWJsZWRGaWVsZD86IHN0cmluZztcclxuICBlbmFibGVDaGVja0FsbD86IGJvb2xlYW47XHJcbiAgc2VsZWN0QWxsVGV4dD86IHN0cmluZztcclxuICB1blNlbGVjdEFsbFRleHQ/OiBzdHJpbmc7XHJcbiAgYWxsb3dTZWFyY2hGaWx0ZXI/OiBib29sZWFuO1xyXG4gIGNsZWFyU2VhcmNoRmlsdGVyPzogYm9vbGVhbjtcclxuICBtYXhIZWlnaHQ/OiBudW1iZXI7XHJcbiAgaXRlbXNTaG93TGltaXQ/OiBudW1iZXI7XHJcbiAgbGltaXRTZWxlY3Rpb24/OiBudW1iZXI7XHJcbiAgc2VhcmNoUGxhY2Vob2xkZXJUZXh0Pzogc3RyaW5nO1xyXG4gIG5vRGF0YUF2YWlsYWJsZVBsYWNlaG9sZGVyVGV4dD86IHN0cmluZztcclxuICBjbG9zZURyb3BEb3duT25TZWxlY3Rpb24/OiBib29sZWFuO1xyXG4gIHNob3dTZWxlY3RlZEl0ZW1zQXRUb3A/OiBib29sZWFuO1xyXG4gIGRlZmF1bHRPcGVuPzogYm9vbGVhbjtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIExpc3RJdGVtIHtcclxuICBpZDogU3RyaW5nO1xyXG4gIHRleHQ6IFN0cmluZztcclxuICBpc0Rpc2FibGVkPzogYm9vbGVhbjtcclxuXHJcbiAgcHVibGljIGNvbnN0cnVjdG9yKHNvdXJjZTogYW55KSB7XHJcbiAgICBpZiAodHlwZW9mIHNvdXJjZSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgdGhpcy5pZCA9IHRoaXMudGV4dCA9IHNvdXJjZTtcclxuICAgICAgdGhpcy5pc0Rpc2FibGVkID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBpZiAodHlwZW9mIHNvdXJjZSA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgdGhpcy5pZCA9IHNvdXJjZS5pZDtcclxuICAgICAgdGhpcy50ZXh0ID0gc291cmNlLnRleHQ7XHJcbiAgICAgIHRoaXMuaXNEaXNhYmxlZCA9IHNvdXJjZS5pc0Rpc2FibGVkO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQge1xyXG4gIENvbXBvbmVudCxcclxuICBIb3N0TGlzdGVuZXIsXHJcbiAgZm9yd2FyZFJlZixcclxuICBJbnB1dCxcclxuICBPdXRwdXQsXHJcbiAgRXZlbnRFbWl0dGVyLFxyXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxyXG4gIENoYW5nZURldGVjdG9yUmVmXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE5HX1ZBTFVFX0FDQ0VTU09SLCBDb250cm9sVmFsdWVBY2Nlc3NvciB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcclxuaW1wb3J0IHsgTGlzdEl0ZW0sIElEcm9wZG93blNldHRpbmdzIH0gZnJvbSAnLi9tdWx0aXNlbGVjdC5tb2RlbCc7XHJcblxyXG5leHBvcnQgY29uc3QgRFJPUERPV05fQ09OVFJPTF9WQUxVRV9BQ0NFU1NPUjogYW55ID0ge1xyXG4gIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxyXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE11bHRpU2VsZWN0Q29tcG9uZW50KSxcclxuICBtdWx0aTogdHJ1ZVxyXG59O1xyXG5jb25zdCBub29wID0gKCkgPT4ge307XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ25nLW11bHRpc2VsZWN0LWRyb3Bkb3duJyxcclxuICB0ZW1wbGF0ZTogYDxkaXYgdGFiaW5kZXg9XCI9MFwiIChibHVyKT1cIm9uVG91Y2hlZCgpXCIgY2xhc3M9XCJtdWx0aXNlbGVjdC1kcm9wZG93blwiIChjbGlja091dHNpZGUpPVwiY2xvc2VEcm9wZG93bigpXCI+XHJcbiAgPGRpdiBbY2xhc3MuZGlzYWJsZWRdPVwiZGlzYWJsZWRcIj5cclxuICAgIDxzcGFuIHRhYmluZGV4PVwiLTFcIiBjbGFzcz1cImRyb3Bkb3duLWJ0blwiIChjbGljayk9XCJ0b2dnbGVEcm9wZG93bigkZXZlbnQpXCI+XHJcbiAgICAgIDxzcGFuICpuZ0lmPVwic2VsZWN0ZWRJdGVtcy5sZW5ndGggPT0gMFwiPnt7X3BsYWNlaG9sZGVyfX08L3NwYW4+XHJcbiAgICAgIDxzcGFuIGNsYXNzPVwic2VsZWN0ZWQtaXRlbVwiICpuZ0Zvcj1cImxldCBpdGVtIG9mIHNlbGVjdGVkSXRlbXM7dHJhY2tCeTogdHJhY2tCeUZuO2xldCBrID0gaW5kZXhcIiBbaGlkZGVuXT1cImsgPiBfc2V0dGluZ3MuaXRlbXNTaG93TGltaXQtMVwiPlxyXG4gICAgICAgIHt7aXRlbS50ZXh0fX1cclxuICAgICAgICA8YSBzdHlsZT1cInBhZGRpbmctdG9wOjJweDtwYWRkaW5nLWxlZnQ6MnB4O2NvbG9yOndoaXRlXCIgKGNsaWNrKT1cIm9uSXRlbUNsaWNrKCRldmVudCxpdGVtKVwiPng8L2E+XHJcbiAgICAgIDwvc3Bhbj5cclxuICAgICAgPHNwYW4gc3R5bGU9XCJmbG9hdDpyaWdodCAhaW1wb3J0YW50O3BhZGRpbmctcmlnaHQ6NHB4XCI+XHJcbiAgICAgICAgPHNwYW4gc3R5bGU9XCJwYWRkaW5nLXJpZ2h0OiA2cHg7XCIgKm5nSWY9XCJpdGVtU2hvd1JlbWFpbmluZygpPjBcIj4re3tpdGVtU2hvd1JlbWFpbmluZygpfX08L3NwYW4+XHJcbiAgICAgICAgPHNwYW4gW25nQ2xhc3NdPVwiX3NldHRpbmdzLmRlZmF1bHRPcGVuID8gJ2Ryb3Bkb3duLXVwJyA6ICdkcm9wZG93bi1kb3duJ1wiPjwvc3Bhbj5cclxuICAgICAgPC9zcGFuPlxyXG4gICAgPC9zcGFuPlxyXG4gIDwvZGl2PlxyXG4gIDxkaXYgY2xhc3M9XCJkcm9wZG93bi1saXN0XCIgW2hpZGRlbl09XCIhX3NldHRpbmdzLmRlZmF1bHRPcGVuXCI+XHJcbiAgICA8dWwgY2xhc3M9XCJpdGVtMVwiPlxyXG4gICAgICA8bGkgKGNsaWNrKT1cInRvZ2dsZVNlbGVjdEFsbCgpXCIgKm5nSWY9XCJfZGF0YS5sZW5ndGggPiAwICYmICFfc2V0dGluZ3Muc2luZ2xlU2VsZWN0aW9uICYmIF9zZXR0aW5ncy5lbmFibGVDaGVja0FsbCAmJiBfc2V0dGluZ3MubGltaXRTZWxlY3Rpb249PT0tMVwiIGNsYXNzPVwibXVsdGlzZWxlY3QtaXRlbS1jaGVja2JveFwiIHN0eWxlPVwiYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNjY2M7cGFkZGluZzoxMHB4XCI+XHJcbiAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGFyaWEtbGFiZWw9XCJtdWx0aXNlbGVjdC1zZWxlY3QtYWxsXCIgW2NoZWNrZWRdPVwiaXNBbGxJdGVtc1NlbGVjdGVkKClcIiBbZGlzYWJsZWRdPVwiZGlzYWJsZWQgfHwgaXNMaW1pdFNlbGVjdGlvblJlYWNoZWQoKVwiIC8+XHJcbiAgICAgICAgPGRpdj57eyFpc0FsbEl0ZW1zU2VsZWN0ZWQoKSA/IF9zZXR0aW5ncy5zZWxlY3RBbGxUZXh0IDogX3NldHRpbmdzLnVuU2VsZWN0QWxsVGV4dH19PC9kaXY+XHJcbiAgICAgIDwvbGk+XHJcbiAgICAgIDxsaSBjbGFzcz1cImZpbHRlci10ZXh0Ym94XCIgKm5nSWY9XCJfZGF0YS5sZW5ndGg+MCAmJiBfc2V0dGluZ3MuYWxsb3dTZWFyY2hGaWx0ZXJcIj5cclxuICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBhcmlhLWxhYmVsPVwibXVsdGlzZWxlY3Qtc2VhcmNoXCIgW3JlYWRPbmx5XT1cImRpc2FibGVkXCIgW3BsYWNlaG9sZGVyXT1cIl9zZXR0aW5ncy5zZWFyY2hQbGFjZWhvbGRlclRleHRcIiBbKG5nTW9kZWwpXT1cImZpbHRlci50ZXh0XCIgKG5nTW9kZWxDaGFuZ2UpPVwib25GaWx0ZXJUZXh0Q2hhbmdlKCRldmVudClcIj5cclxuICAgICAgPC9saT5cclxuICAgIDwvdWw+XHJcbiAgICA8dWwgY2xhc3M9XCJpdGVtMlwiIFtzdHlsZS5tYXhIZWlnaHRdPVwiX3NldHRpbmdzLm1heEhlaWdodCsncHgnXCI+XHJcbiAgICAgIDxsaSAqbmdGb3I9XCJsZXQgaXRlbSBvZiBfZGF0YSB8IG5nMkxpc3RGaWx0ZXI6ZmlsdGVyOyBsZXQgaSA9IGluZGV4O1wiIChjbGljayk9XCJvbkl0ZW1DbGljaygkZXZlbnQsaXRlbSlcIiBjbGFzcz1cIm11bHRpc2VsZWN0LWl0ZW0tY2hlY2tib3hcIj5cclxuICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgYXJpYS1sYWJlbD1cIm11bHRpc2VsZWN0LWl0ZW1cIiBbY2hlY2tlZF09XCJpc1NlbGVjdGVkKGl0ZW0pXCIgW2Rpc2FibGVkXT1cImRpc2FibGVkIHx8IChpc0xpbWl0U2VsZWN0aW9uUmVhY2hlZCgpICYmICFpc1NlbGVjdGVkKGl0ZW0pKSB8fCBpdGVtLmlzRGlzYWJsZWRcIiAvPlxyXG4gICAgICAgIDxkaXY+e3tpdGVtLnRleHR9fTwvZGl2PlxyXG4gICAgICA8L2xpPlxyXG4gICAgICA8bGkgY2xhc3M9J25vLWRhdGEnICpuZ0lmPVwiX2RhdGEubGVuZ3RoID09IDBcIj5cclxuICAgICAgICA8aDU+e3tfc2V0dGluZ3Mubm9EYXRhQXZhaWxhYmxlUGxhY2Vob2xkZXJUZXh0fX08L2g1PlxyXG4gICAgICA8L2xpPlxyXG4gICAgPC91bD5cclxuICA8L2Rpdj5cclxuPC9kaXY+XHJcbmAsXHJcbiAgc3R5bGVzOiBbYC5tdWx0aXNlbGVjdC1kcm9wZG93bntwb3NpdGlvbjpyZWxhdGl2ZTt3aWR0aDoxMDAlO2ZvbnQtc2l6ZTppbmhlcml0O2ZvbnQtZmFtaWx5OmluaGVyaXR9Lm11bHRpc2VsZWN0LWRyb3Bkb3duIC5kcm9wZG93bi1idG57ZGlzcGxheTppbmxpbmUtYmxvY2s7Ym9yZGVyOjFweCBzb2xpZCAjYWRhZGFkO3dpZHRoOjEwMCU7cGFkZGluZzo2cHggMTJweDttYXJnaW4tYm90dG9tOjA7Zm9udC13ZWlnaHQ6NDAwO2xpbmUtaGVpZ2h0OjEuNTI4NTcxNDM7dGV4dC1hbGlnbjpsZWZ0O3ZlcnRpY2FsLWFsaWduOm1pZGRsZTtjdXJzb3I6cG9pbnRlcjtiYWNrZ3JvdW5kLWltYWdlOm5vbmU7Ym9yZGVyLXJhZGl1czo0cHh9Lm11bHRpc2VsZWN0LWRyb3Bkb3duIC5kcm9wZG93bi1idG4gLnNlbGVjdGVkLWl0ZW17Ym9yZGVyOjFweCBzb2xpZCAjMzM3YWI3O21hcmdpbi1yaWdodDo0cHg7YmFja2dyb3VuZDojMzM3YWI3O3BhZGRpbmc6MCA1cHg7Y29sb3I6I2ZmZjtib3JkZXItcmFkaXVzOjJweDtmbG9hdDpsZWZ0fS5tdWx0aXNlbGVjdC1kcm9wZG93biAuZHJvcGRvd24tYnRuIC5zZWxlY3RlZC1pdGVtIGF7dGV4dC1kZWNvcmF0aW9uOm5vbmV9Lm11bHRpc2VsZWN0LWRyb3Bkb3duIC5kcm9wZG93bi1idG4gLnNlbGVjdGVkLWl0ZW06aG92ZXJ7Ym94LXNoYWRvdzoxcHggMXB4ICM5NTk1OTV9Lm11bHRpc2VsZWN0LWRyb3Bkb3duIC5kcm9wZG93bi1idG4gLmRyb3Bkb3duLWRvd257ZGlzcGxheTppbmxpbmUtYmxvY2s7dG9wOjEwcHg7d2lkdGg6MDtoZWlnaHQ6MDtib3JkZXItdG9wOjEwcHggc29saWQgI2FkYWRhZDtib3JkZXItbGVmdDoxMHB4IHNvbGlkIHRyYW5zcGFyZW50O2JvcmRlci1yaWdodDoxMHB4IHNvbGlkIHRyYW5zcGFyZW50fS5tdWx0aXNlbGVjdC1kcm9wZG93biAuZHJvcGRvd24tYnRuIC5kcm9wZG93bi11cHtkaXNwbGF5OmlubGluZS1ibG9jazt3aWR0aDowO2hlaWdodDowO2JvcmRlci1ib3R0b206MTBweCBzb2xpZCAjYWRhZGFkO2JvcmRlci1sZWZ0OjEwcHggc29saWQgdHJhbnNwYXJlbnQ7Ym9yZGVyLXJpZ2h0OjEwcHggc29saWQgdHJhbnNwYXJlbnR9Lm11bHRpc2VsZWN0LWRyb3Bkb3duIC5kaXNhYmxlZD5zcGFue2JhY2tncm91bmQtY29sb3I6I2VjZWVlZn0uZHJvcGRvd24tbGlzdHtwb3NpdGlvbjphYnNvbHV0ZTtwYWRkaW5nLXRvcDo2cHg7d2lkdGg6MTAwJTt6LWluZGV4Ojk5OTk7Ym9yZGVyOjFweCBzb2xpZCAjY2NjO2JvcmRlci1yYWRpdXM6M3B4O2JhY2tncm91bmQ6I2ZmZjttYXJnaW4tdG9wOjEwcHg7Ym94LXNoYWRvdzowIDFweCA1cHggIzk1OTU5NX0uZHJvcGRvd24tbGlzdCB1bHtwYWRkaW5nOjA7bGlzdC1zdHlsZTpub25lO292ZXJmbG93OmF1dG87bWFyZ2luOjB9LmRyb3Bkb3duLWxpc3QgbGl7cGFkZGluZzo2cHggMTBweDtjdXJzb3I6cG9pbnRlcjt0ZXh0LWFsaWduOmxlZnR9LmRyb3Bkb3duLWxpc3QgLmZpbHRlci10ZXh0Ym94e2JvcmRlci1ib3R0b206MXB4IHNvbGlkICNjY2M7cG9zaXRpb246cmVsYXRpdmU7cGFkZGluZzoxMHB4fS5kcm9wZG93bi1saXN0IC5maWx0ZXItdGV4dGJveCBpbnB1dHtib3JkZXI6MDt3aWR0aDoxMDAlO3BhZGRpbmc6MCAwIDAgMjZweH0uZHJvcGRvd24tbGlzdCAuZmlsdGVyLXRleHRib3ggaW5wdXQ6Zm9jdXN7b3V0bGluZTowfS5tdWx0aXNlbGVjdC1pdGVtLWNoZWNrYm94IGlucHV0W3R5cGU9Y2hlY2tib3hde2JvcmRlcjowO2NsaXA6cmVjdCgwIDAgMCAwKTtoZWlnaHQ6MXB4O21hcmdpbjotMXB4O292ZXJmbG93OmhpZGRlbjtwYWRkaW5nOjA7cG9zaXRpb246YWJzb2x1dGU7d2lkdGg6MXB4fS5tdWx0aXNlbGVjdC1pdGVtLWNoZWNrYm94IGlucHV0W3R5cGU9Y2hlY2tib3hdOmZvY3VzK2RpdjpiZWZvcmUsLm11bHRpc2VsZWN0LWl0ZW0tY2hlY2tib3ggaW5wdXRbdHlwZT1jaGVja2JveF06aG92ZXIrZGl2OmJlZm9yZXtib3JkZXItY29sb3I6IzMzN2FiNztiYWNrZ3JvdW5kLWNvbG9yOiNmMmYyZjJ9Lm11bHRpc2VsZWN0LWl0ZW0tY2hlY2tib3ggaW5wdXRbdHlwZT1jaGVja2JveF06YWN0aXZlK2RpdjpiZWZvcmV7dHJhbnNpdGlvbi1kdXJhdGlvbjowc30ubXVsdGlzZWxlY3QtaXRlbS1jaGVja2JveCBpbnB1dFt0eXBlPWNoZWNrYm94XStkaXZ7cG9zaXRpb246cmVsYXRpdmU7cGFkZGluZy1sZWZ0OjJlbTt2ZXJ0aWNhbC1hbGlnbjptaWRkbGU7LXdlYmtpdC11c2VyLXNlbGVjdDpub25lOy1tb3otdXNlci1zZWxlY3Q6bm9uZTstbXMtdXNlci1zZWxlY3Q6bm9uZTt1c2VyLXNlbGVjdDpub25lO2N1cnNvcjpwb2ludGVyO21hcmdpbjowO2NvbG9yOiMwMDB9Lm11bHRpc2VsZWN0LWl0ZW0tY2hlY2tib3ggaW5wdXRbdHlwZT1jaGVja2JveF0rZGl2OmJlZm9yZXtib3gtc2l6aW5nOmNvbnRlbnQtYm94O2NvbnRlbnQ6Jyc7Y29sb3I6IzMzN2FiNztwb3NpdGlvbjphYnNvbHV0ZTt0b3A6NTAlO2xlZnQ6MDt3aWR0aDoxNHB4O2hlaWdodDoxNHB4O21hcmdpbi10b3A6LTlweDtib3JkZXI6MnB4IHNvbGlkICMzMzdhYjc7dGV4dC1hbGlnbjpjZW50ZXI7dHJhbnNpdGlvbjouNHN9Lm11bHRpc2VsZWN0LWl0ZW0tY2hlY2tib3ggaW5wdXRbdHlwZT1jaGVja2JveF0rZGl2OmFmdGVye2JveC1zaXppbmc6Y29udGVudC1ib3g7Y29udGVudDonJztwb3NpdGlvbjphYnNvbHV0ZTstd2Via2l0LXRyYW5zZm9ybTpzY2FsZSgwKTt0cmFuc2Zvcm06c2NhbGUoMCk7LXdlYmtpdC10cmFuc2Zvcm0tb3JpZ2luOjUwJTt0cmFuc2Zvcm0tb3JpZ2luOjUwJTt0cmFuc2l0aW9uOnRyYW5zZm9ybSAuMnMgZWFzZS1vdXQsLXdlYmtpdC10cmFuc2Zvcm0gLjJzIGVhc2Utb3V0O2JhY2tncm91bmQtY29sb3I6dHJhbnNwYXJlbnQ7dG9wOjUwJTtsZWZ0OjRweDt3aWR0aDo4cHg7aGVpZ2h0OjNweDttYXJnaW4tdG9wOi00cHg7Ym9yZGVyLXN0eWxlOnNvbGlkO2JvcmRlci1jb2xvcjojZmZmO2JvcmRlci13aWR0aDowIDAgM3B4IDNweDstby1ib3JkZXItaW1hZ2U6bm9uZTtib3JkZXItaW1hZ2U6bm9uZTstd2Via2l0LXRyYW5zZm9ybTpyb3RhdGUoLTQ1ZGVnKSBzY2FsZSgwKTt0cmFuc2Zvcm06cm90YXRlKC00NWRlZykgc2NhbGUoMCl9Lm11bHRpc2VsZWN0LWl0ZW0tY2hlY2tib3ggaW5wdXRbdHlwZT1jaGVja2JveF06ZGlzYWJsZWQrZGl2OmJlZm9yZXtib3JkZXItY29sb3I6I2NjY30ubXVsdGlzZWxlY3QtaXRlbS1jaGVja2JveCBpbnB1dFt0eXBlPWNoZWNrYm94XTpkaXNhYmxlZDpmb2N1cytkaXY6YmVmb3JlIC5tdWx0aXNlbGVjdC1pdGVtLWNoZWNrYm94IGlucHV0W3R5cGU9Y2hlY2tib3hdOmRpc2FibGVkOmhvdmVyK2RpdjpiZWZvcmV7YmFja2dyb3VuZC1jb2xvcjppbmhlcml0fS5tdWx0aXNlbGVjdC1pdGVtLWNoZWNrYm94IGlucHV0W3R5cGU9Y2hlY2tib3hdOmRpc2FibGVkOmNoZWNrZWQrZGl2OmJlZm9yZXtiYWNrZ3JvdW5kLWNvbG9yOiNjY2N9Lm11bHRpc2VsZWN0LWl0ZW0tY2hlY2tib3ggaW5wdXRbdHlwZT1jaGVja2JveF06Y2hlY2tlZCtkaXY6YWZ0ZXJ7Y29udGVudDonJzt0cmFuc2l0aW9uOnRyYW5zZm9ybSAuMnMgZWFzZS1vdXQsLXdlYmtpdC10cmFuc2Zvcm0gLjJzIGVhc2Utb3V0Oy13ZWJraXQtdHJhbnNmb3JtOnJvdGF0ZSgtNDVkZWcpIHNjYWxlKDEpO3RyYW5zZm9ybTpyb3RhdGUoLTQ1ZGVnKSBzY2FsZSgxKX0ubXVsdGlzZWxlY3QtaXRlbS1jaGVja2JveCBpbnB1dFt0eXBlPWNoZWNrYm94XTpjaGVja2VkK2RpdjpiZWZvcmV7LXdlYmtpdC1hbmltYXRpb246LjJzIGVhc2UtaW4gYm9yZGVyc2NhbGU7YW5pbWF0aW9uOi4ycyBlYXNlLWluIGJvcmRlcnNjYWxlO2JhY2tncm91bmQ6IzMzN2FiN31ALXdlYmtpdC1rZXlmcmFtZXMgYm9yZGVyc2NhbGV7NTAle2JveC1zaGFkb3c6MCAwIDAgMnB4ICMzMzdhYjd9fUBrZXlmcmFtZXMgYm9yZGVyc2NhbGV7NTAle2JveC1zaGFkb3c6MCAwIDAgMnB4ICMzMzdhYjd9fWBdLFxyXG4gIHByb3ZpZGVyczogW0RST1BET1dOX0NPTlRST0xfVkFMVUVfQUNDRVNTT1JdLFxyXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBNdWx0aVNlbGVjdENvbXBvbmVudCBpbXBsZW1lbnRzIENvbnRyb2xWYWx1ZUFjY2Vzc29yIHtcclxuICBwdWJsaWMgX3NldHRpbmdzOiBJRHJvcGRvd25TZXR0aW5ncztcclxuICBwdWJsaWMgX2RhdGE6IEFycmF5PExpc3RJdGVtPiA9IFtdO1xyXG4gIHB1YmxpYyBzZWxlY3RlZEl0ZW1zOiBBcnJheTxMaXN0SXRlbT4gPSBbXTtcclxuICBwdWJsaWMgaXNEcm9wZG93bk9wZW4gPSB0cnVlO1xyXG4gIF9wbGFjZWhvbGRlciA9ICdTZWxlY3QnO1xyXG4gIGZpbHRlcjogTGlzdEl0ZW0gPSBuZXcgTGlzdEl0ZW0odGhpcy5kYXRhKTtcclxuICBkZWZhdWx0U2V0dGluZ3M6IElEcm9wZG93blNldHRpbmdzID0ge1xyXG4gICAgc2luZ2xlU2VsZWN0aW9uOiBmYWxzZSxcclxuICAgIGlkRmllbGQ6ICdpZCcsXHJcbiAgICB0ZXh0RmllbGQ6ICd0ZXh0JyxcclxuICAgIGRpc2FibGVkRmllbGQ6ICdpc0Rpc2FibGVkJyxcclxuICAgIGVuYWJsZUNoZWNrQWxsOiB0cnVlLFxyXG4gICAgc2VsZWN0QWxsVGV4dDogJ1NlbGVjdCBBbGwnLFxyXG4gICAgdW5TZWxlY3RBbGxUZXh0OiAnVW5TZWxlY3QgQWxsJyxcclxuICAgIGFsbG93U2VhcmNoRmlsdGVyOiBmYWxzZSxcclxuICAgIGxpbWl0U2VsZWN0aW9uOiAtMSxcclxuICAgIGNsZWFyU2VhcmNoRmlsdGVyOiB0cnVlLFxyXG4gICAgbWF4SGVpZ2h0OiAxOTcsXHJcbiAgICBpdGVtc1Nob3dMaW1pdDogOTk5OTk5OTk5OTk5LFxyXG4gICAgc2VhcmNoUGxhY2Vob2xkZXJUZXh0OiAnU2VhcmNoJyxcclxuICAgIG5vRGF0YUF2YWlsYWJsZVBsYWNlaG9sZGVyVGV4dDogJ05vIGRhdGEgYXZhaWxhYmxlJyxcclxuICAgIGNsb3NlRHJvcERvd25PblNlbGVjdGlvbjogZmFsc2UsXHJcbiAgICBzaG93U2VsZWN0ZWRJdGVtc0F0VG9wOiBmYWxzZSxcclxuICAgIGRlZmF1bHRPcGVuOiBmYWxzZVxyXG4gIH07XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgcHVibGljIHNldCBwbGFjZWhvbGRlcih2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICBpZiAodmFsdWUpIHtcclxuICAgICAgdGhpcy5fcGxhY2Vob2xkZXIgPSB2YWx1ZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuX3BsYWNlaG9sZGVyID0gJ1NlbGVjdCc7XHJcbiAgICB9XHJcbiAgfVxyXG4gIEBJbnB1dCgpXHJcbiAgZGlzYWJsZWQgPSBmYWxzZTtcclxuXHJcbiAgQElucHV0KClcclxuICBwdWJsaWMgc2V0IHNldHRpbmdzKHZhbHVlOiBJRHJvcGRvd25TZXR0aW5ncykge1xyXG4gICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgIHRoaXMuX3NldHRpbmdzID0gT2JqZWN0LmFzc2lnbih0aGlzLmRlZmF1bHRTZXR0aW5ncywgdmFsdWUpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5fc2V0dGluZ3MgPSBPYmplY3QuYXNzaWduKHRoaXMuZGVmYXVsdFNldHRpbmdzKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgcHVibGljIHNldCBkYXRhKHZhbHVlOiBBcnJheTxhbnk+KSB7XHJcbiAgICBpZiAoIXZhbHVlKSB7XHJcbiAgICAgIHRoaXMuX2RhdGEgPSBbXTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIGNvbnN0IF9pdGVtcyA9IHZhbHVlLmZpbHRlcigoaXRlbTogYW55KSA9PiB7XHJcbiAgICAgIC8vICAgaWYgKHR5cGVvZiBpdGVtID09PSAnc3RyaW5nJyB8fCAodHlwZW9mIGl0ZW0gPT09ICdvYmplY3QnICYmIGl0ZW0gJiYgaXRlbVt0aGlzLl9zZXR0aW5ncy5pZEZpZWxkXSAmJiBpdGVtW3RoaXMuX3NldHRpbmdzLnRleHRGaWVsZF0pKSB7XHJcbiAgICAgIC8vICAgICByZXR1cm4gaXRlbTtcclxuICAgICAgLy8gICB9XHJcbiAgICAgIC8vIH0pO1xyXG4gICAgICB0aGlzLl9kYXRhID0gdmFsdWUubWFwKFxyXG4gICAgICAgIChpdGVtOiBhbnkpID0+XHJcbiAgICAgICAgICB0eXBlb2YgaXRlbSA9PT0gJ3N0cmluZydcclxuICAgICAgICAgICAgPyBuZXcgTGlzdEl0ZW0oaXRlbSlcclxuICAgICAgICAgICAgOiBuZXcgTGlzdEl0ZW0oe1xyXG4gICAgICAgICAgICAgICAgaWQ6IGl0ZW1bdGhpcy5fc2V0dGluZ3MuaWRGaWVsZF0sXHJcbiAgICAgICAgICAgICAgICB0ZXh0OiBpdGVtW3RoaXMuX3NldHRpbmdzLnRleHRGaWVsZF0sXHJcbiAgICAgICAgICAgICAgICBpc0Rpc2FibGVkOiBpdGVtW3RoaXMuX3NldHRpbmdzLmRpc2FibGVkRmllbGRdXHJcbiAgICAgICAgICAgICAgfSlcclxuICAgICAgKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIEBPdXRwdXQoJ29uRmlsdGVyQ2hhbmdlJylcclxuICBvbkZpbHRlckNoYW5nZTogRXZlbnRFbWl0dGVyPExpc3RJdGVtPiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xyXG4gIEBPdXRwdXQoJ29uRHJvcERvd25DbG9zZScpXHJcbiAgb25Ecm9wRG93bkNsb3NlOiBFdmVudEVtaXR0ZXI8TGlzdEl0ZW0+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XHJcblxyXG4gIEBPdXRwdXQoJ29uU2VsZWN0JylcclxuICBvblNlbGVjdDogRXZlbnRFbWl0dGVyPExpc3RJdGVtPiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xyXG5cclxuICBAT3V0cHV0KCdvbkRlU2VsZWN0JylcclxuICBvbkRlU2VsZWN0OiBFdmVudEVtaXR0ZXI8TGlzdEl0ZW0+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XHJcblxyXG4gIEBPdXRwdXQoJ29uU2VsZWN0QWxsJylcclxuICBvblNlbGVjdEFsbDogRXZlbnRFbWl0dGVyPEFycmF5PExpc3RJdGVtPj4gPSBuZXcgRXZlbnRFbWl0dGVyPEFycmF5PGFueT4+KCk7XHJcblxyXG4gIEBPdXRwdXQoJ29uRGVTZWxlY3RBbGwnKVxyXG4gIG9uRGVTZWxlY3RBbGw6IEV2ZW50RW1pdHRlcjxBcnJheTxMaXN0SXRlbT4+ID0gbmV3IEV2ZW50RW1pdHRlcjxBcnJheTxhbnk+PigpO1xyXG5cclxuICBwcml2YXRlIG9uVG91Y2hlZENhbGxiYWNrOiAoKSA9PiB2b2lkID0gbm9vcDtcclxuICBwcml2YXRlIG9uQ2hhbmdlQ2FsbGJhY2s6IChfOiBhbnkpID0+IHZvaWQgPSBub29wO1xyXG5cclxuICBvbkZpbHRlclRleHRDaGFuZ2UoJGV2ZW50KSB7XHJcbiAgICB0aGlzLm9uRmlsdGVyQ2hhbmdlLmVtaXQoJGV2ZW50KTtcclxuICB9XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY2RyOiBDaGFuZ2VEZXRlY3RvclJlZikge31cclxuXHJcbiAgb25JdGVtQ2xpY2soJGV2ZW50OiBhbnksIGl0ZW06IExpc3RJdGVtKSB7XHJcbiAgICBpZiAodGhpcy5kaXNhYmxlZCB8fCBpdGVtLmlzRGlzYWJsZWQpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGZvdW5kID0gdGhpcy5pc1NlbGVjdGVkKGl0ZW0pO1xyXG4gICAgY29uc3QgYWxsb3dBZGQgPVxyXG4gICAgICB0aGlzLl9zZXR0aW5ncy5saW1pdFNlbGVjdGlvbiA9PT0gLTEgfHxcclxuICAgICAgKHRoaXMuX3NldHRpbmdzLmxpbWl0U2VsZWN0aW9uID4gMCAmJlxyXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRJdGVtcy5sZW5ndGggPCB0aGlzLl9zZXR0aW5ncy5saW1pdFNlbGVjdGlvbik7XHJcbiAgICBpZiAoIWZvdW5kKSB7XHJcbiAgICAgIGlmIChhbGxvd0FkZCkge1xyXG4gICAgICAgIHRoaXMuYWRkU2VsZWN0ZWQoaXRlbSk7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMucmVtb3ZlU2VsZWN0ZWQoaXRlbSk7XHJcbiAgICB9XHJcbiAgICBpZiAoXHJcbiAgICAgIHRoaXMuX3NldHRpbmdzLnNpbmdsZVNlbGVjdGlvbiAmJlxyXG4gICAgICB0aGlzLl9zZXR0aW5ncy5jbG9zZURyb3BEb3duT25TZWxlY3Rpb25cclxuICAgICkge1xyXG4gICAgICB0aGlzLmNsb3NlRHJvcGRvd24oKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHdyaXRlVmFsdWUodmFsdWU6IGFueSkge1xyXG4gICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwgJiYgdmFsdWUubGVuZ3RoID4gMCkge1xyXG4gICAgICBpZiAodGhpcy5fc2V0dGluZ3Muc2luZ2xlU2VsZWN0aW9uKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgIGlmICh2YWx1ZS5sZW5ndGggPj0gMSkge1xyXG4gICAgICAgICAgICBjb25zdCBmaXJzdEl0ZW0gPSB2YWx1ZVswXTtcclxuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEl0ZW1zID0gW1xyXG4gICAgICAgICAgICAgIHR5cGVvZiBmaXJzdEl0ZW0gPT09ICdzdHJpbmcnXHJcbiAgICAgICAgICAgICAgICA/IG5ldyBMaXN0SXRlbShmaXJzdEl0ZW0pXHJcbiAgICAgICAgICAgICAgICA6IG5ldyBMaXN0SXRlbSh7XHJcbiAgICAgICAgICAgICAgICAgICAgaWQ6IGZpcnN0SXRlbVt0aGlzLl9zZXR0aW5ncy5pZEZpZWxkXSxcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBmaXJzdEl0ZW1bdGhpcy5fc2V0dGluZ3MudGV4dEZpZWxkXSxcclxuICAgICAgICAgICAgICAgICAgICBpc0Rpc2FibGVkOiBmaXJzdEl0ZW1bdGhpcy5fc2V0dGluZ3MuZGlzYWJsZWRGaWVsZF1cclxuICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgXTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAvLyBjb25zb2xlLmVycm9yKGUuYm9keS5tc2cpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zdCBfZGF0YSA9IHZhbHVlLm1hcChcclxuICAgICAgICAgIChpdGVtOiBhbnkpID0+XHJcbiAgICAgICAgICAgIHR5cGVvZiBpdGVtID09PSAnc3RyaW5nJ1xyXG4gICAgICAgICAgICAgID8gbmV3IExpc3RJdGVtKGl0ZW0pXHJcbiAgICAgICAgICAgICAgOiBuZXcgTGlzdEl0ZW0oe1xyXG4gICAgICAgICAgICAgICAgICBpZDogaXRlbVt0aGlzLl9zZXR0aW5ncy5pZEZpZWxkXSxcclxuICAgICAgICAgICAgICAgICAgdGV4dDogaXRlbVt0aGlzLl9zZXR0aW5ncy50ZXh0RmllbGRdLFxyXG4gICAgICAgICAgICAgICAgICBpc0Rpc2FibGVkOiBpdGVtW3RoaXMuX3NldHRpbmdzLmRpc2FibGVkRmllbGRdXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgaWYgKHRoaXMuX3NldHRpbmdzLmxpbWl0U2VsZWN0aW9uID4gMCkge1xyXG4gICAgICAgICAgdGhpcy5zZWxlY3RlZEl0ZW1zID0gX2RhdGEuc3BsaWNlKDAsIHRoaXMuX3NldHRpbmdzLmxpbWl0U2VsZWN0aW9uKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5zZWxlY3RlZEl0ZW1zID0gX2RhdGE7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnNlbGVjdGVkSXRlbXMgPSBbXTtcclxuICAgIH1cclxuICAgIHRoaXMub25DaGFuZ2VDYWxsYmFjayh2YWx1ZSk7XHJcbiAgfVxyXG5cclxuICAvLyBGcm9tIENvbnRyb2xWYWx1ZUFjY2Vzc29yIGludGVyZmFjZVxyXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46IGFueSkge1xyXG4gICAgdGhpcy5vbkNoYW5nZUNhbGxiYWNrID0gZm47XHJcbiAgfVxyXG5cclxuICAvLyBGcm9tIENvbnRyb2xWYWx1ZUFjY2Vzc29yIGludGVyZmFjZVxyXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiBhbnkpIHtcclxuICAgIHRoaXMub25Ub3VjaGVkQ2FsbGJhY2sgPSBmbjtcclxuICB9XHJcblxyXG4gIC8vIFNldCB0b3VjaGVkIG9uIGJsdXJcclxuICBASG9zdExpc3RlbmVyKCdibHVyJylcclxuICBwdWJsaWMgb25Ub3VjaGVkKCkge1xyXG4gICAgdGhpcy5jbG9zZURyb3Bkb3duKCk7XHJcbiAgICB0aGlzLm9uVG91Y2hlZENhbGxiYWNrKCk7XHJcbiAgfVxyXG5cclxuICB0cmFja0J5Rm4oaW5kZXgsIGl0ZW0pIHtcclxuICAgIHJldHVybiBpdGVtLmlkO1xyXG4gIH1cclxuXHJcbiAgaXNTZWxlY3RlZChjbGlja2VkSXRlbTogTGlzdEl0ZW0pIHtcclxuICAgIGxldCBmb3VuZCA9IGZhbHNlO1xyXG4gICAgdGhpcy5zZWxlY3RlZEl0ZW1zLmZvckVhY2goaXRlbSA9PiB7XHJcbiAgICAgIGlmIChjbGlja2VkSXRlbS5pZCA9PT0gaXRlbS5pZCkge1xyXG4gICAgICAgIGZvdW5kID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gZm91bmQ7XHJcbiAgfVxyXG5cclxuICBpc0xpbWl0U2VsZWN0aW9uUmVhY2hlZCgpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0aGlzLl9zZXR0aW5ncy5saW1pdFNlbGVjdGlvbiA9PT0gdGhpcy5zZWxlY3RlZEl0ZW1zLmxlbmd0aDtcclxuICB9XHJcblxyXG4gIGlzQWxsSXRlbXNTZWxlY3RlZCgpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0aGlzLl9kYXRhLmxlbmd0aCA9PT0gdGhpcy5zZWxlY3RlZEl0ZW1zLmxlbmd0aDtcclxuICB9XHJcblxyXG4gIHNob3dCdXR0b24oKTogYm9vbGVhbiB7XHJcbiAgICBpZiAoIXRoaXMuX3NldHRpbmdzLnNpbmdsZVNlbGVjdGlvbikge1xyXG4gICAgICBpZiAodGhpcy5fc2V0dGluZ3MubGltaXRTZWxlY3Rpb24gPiAwKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIHRoaXMuX3NldHRpbmdzLmVuYWJsZUNoZWNrQWxsID0gdGhpcy5fc2V0dGluZ3MubGltaXRTZWxlY3Rpb24gPT09IC0xID8gdHJ1ZSA6IGZhbHNlO1xyXG4gICAgICByZXR1cm4gdHJ1ZTsgLy8gIXRoaXMuX3NldHRpbmdzLnNpbmdsZVNlbGVjdGlvbiAmJiB0aGlzLl9zZXR0aW5ncy5lbmFibGVDaGVja0FsbCAmJiB0aGlzLl9kYXRhLmxlbmd0aCA+IDA7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBzaG91bGQgYmUgZGlzYWJsZWQgaW4gc2luZ2xlIHNlbGVjdGlvbiBtb2RlXHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGl0ZW1TaG93UmVtYWluaW5nKCk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gdGhpcy5zZWxlY3RlZEl0ZW1zLmxlbmd0aCAtIHRoaXMuX3NldHRpbmdzLml0ZW1zU2hvd0xpbWl0O1xyXG4gIH1cclxuXHJcbiAgYWRkU2VsZWN0ZWQoaXRlbTogTGlzdEl0ZW0pIHtcclxuICAgIGlmICh0aGlzLl9zZXR0aW5ncy5zaW5nbGVTZWxlY3Rpb24pIHtcclxuICAgICAgdGhpcy5zZWxlY3RlZEl0ZW1zID0gW107XHJcbiAgICAgIHRoaXMuc2VsZWN0ZWRJdGVtcy5wdXNoKGl0ZW0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5zZWxlY3RlZEl0ZW1zLnB1c2goaXRlbSk7XHJcbiAgICB9XHJcbiAgICB0aGlzLm9uQ2hhbmdlQ2FsbGJhY2sodGhpcy5lbWl0dGVkVmFsdWUodGhpcy5zZWxlY3RlZEl0ZW1zKSk7XHJcbiAgICB0aGlzLm9uU2VsZWN0LmVtaXQodGhpcy5lbWl0dGVkVmFsdWUoaXRlbSkpO1xyXG4gIH1cclxuXHJcbiAgcmVtb3ZlU2VsZWN0ZWQoaXRlbVNlbDogTGlzdEl0ZW0pIHtcclxuICAgIHRoaXMuc2VsZWN0ZWRJdGVtcy5mb3JFYWNoKGl0ZW0gPT4ge1xyXG4gICAgICBpZiAoaXRlbVNlbC5pZCA9PT0gaXRlbS5pZCkge1xyXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRJdGVtcy5zcGxpY2UodGhpcy5zZWxlY3RlZEl0ZW1zLmluZGV4T2YoaXRlbSksIDEpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIHRoaXMub25DaGFuZ2VDYWxsYmFjayh0aGlzLmVtaXR0ZWRWYWx1ZSh0aGlzLnNlbGVjdGVkSXRlbXMpKTtcclxuICAgIHRoaXMub25EZVNlbGVjdC5lbWl0KHRoaXMuZW1pdHRlZFZhbHVlKGl0ZW1TZWwpKTtcclxuICB9XHJcblxyXG4gIGVtaXR0ZWRWYWx1ZSh2YWw6IGFueSk6IGFueSB7XHJcbiAgICBjb25zdCBzZWxlY3RlZCA9IFtdO1xyXG4gICAgaWYgKEFycmF5LmlzQXJyYXkodmFsKSkge1xyXG4gICAgICB2YWwubWFwKGl0ZW0gPT4ge1xyXG4gICAgICAgIGlmIChpdGVtLmlkID09PSBpdGVtLnRleHQpIHtcclxuICAgICAgICAgIHNlbGVjdGVkLnB1c2goaXRlbS50ZXh0KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgc2VsZWN0ZWQucHVzaCh0aGlzLm9iamVjdGlmeShpdGVtKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmICh2YWwpIHtcclxuICAgICAgICBpZiAodmFsLmlkID09PSB2YWwudGV4dCkge1xyXG4gICAgICAgICAgcmV0dXJuIHZhbC50ZXh0O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXR1cm4gdGhpcy5vYmplY3RpZnkodmFsKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBzZWxlY3RlZDtcclxuICB9XHJcblxyXG4gIG9iamVjdGlmeSh2YWw6IExpc3RJdGVtKSB7XHJcbiAgICBjb25zdCBvYmogPSB7fTtcclxuICAgIG9ialt0aGlzLl9zZXR0aW5ncy5pZEZpZWxkXSA9IHZhbC5pZDtcclxuICAgIG9ialt0aGlzLl9zZXR0aW5ncy50ZXh0RmllbGRdID0gdmFsLnRleHQ7XHJcbiAgICBvYmpbdGhpcy5fc2V0dGluZ3MuZGlzYWJsZWRGaWVsZF0gPSB2YWwuaXNEaXNhYmxlZDtcclxuICAgIHJldHVybiBvYmo7XHJcbiAgfVxyXG5cclxuICB0b2dnbGVEcm9wZG93bihldnQpIHtcclxuICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgaWYgKHRoaXMuZGlzYWJsZWQgJiYgdGhpcy5fc2V0dGluZ3Muc2luZ2xlU2VsZWN0aW9uKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHRoaXMuX3NldHRpbmdzLmRlZmF1bHRPcGVuID0gIXRoaXMuX3NldHRpbmdzLmRlZmF1bHRPcGVuO1xyXG4gICAgaWYgKCF0aGlzLl9zZXR0aW5ncy5kZWZhdWx0T3Blbikge1xyXG4gICAgICB0aGlzLm9uRHJvcERvd25DbG9zZS5lbWl0KCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjbG9zZURyb3Bkb3duKCkge1xyXG4gICAgdGhpcy5fc2V0dGluZ3MuZGVmYXVsdE9wZW4gPSBmYWxzZTtcclxuICAgIC8vIGNsZWFyIHNlYXJjaCB0ZXh0XHJcbiAgICBpZiAodGhpcy5fc2V0dGluZ3MuY2xlYXJTZWFyY2hGaWx0ZXIpIHtcclxuICAgICAgdGhpcy5maWx0ZXIudGV4dCA9ICcnO1xyXG4gICAgfVxyXG4gICAgdGhpcy5vbkRyb3BEb3duQ2xvc2UuZW1pdCgpO1xyXG4gIH1cclxuXHJcbiAgdG9nZ2xlU2VsZWN0QWxsKCkge1xyXG4gICAgaWYgKHRoaXMuZGlzYWJsZWQpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgaWYgKCF0aGlzLmlzQWxsSXRlbXNTZWxlY3RlZCgpKSB7XHJcbiAgICAgIHRoaXMuc2VsZWN0ZWRJdGVtcyA9IHRoaXMuX2RhdGEuc2xpY2UoKTtcclxuICAgICAgdGhpcy5vblNlbGVjdEFsbC5lbWl0KHRoaXMuZW1pdHRlZFZhbHVlKHRoaXMuc2VsZWN0ZWRJdGVtcykpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5zZWxlY3RlZEl0ZW1zID0gW107XHJcbiAgICAgIHRoaXMub25EZVNlbGVjdEFsbC5lbWl0KHRoaXMuZW1pdHRlZFZhbHVlKHRoaXMuc2VsZWN0ZWRJdGVtcykpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5vbkNoYW5nZUNhbGxiYWNrKHRoaXMuZW1pdHRlZFZhbHVlKHRoaXMuc2VsZWN0ZWRJdGVtcykpO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQge0RpcmVjdGl2ZSwgRWxlbWVudFJlZiwgT3V0cHV0LCBFdmVudEVtaXR0ZXIsIEhvc3RMaXN0ZW5lcn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5ARGlyZWN0aXZlKHtcclxuICAgIHNlbGVjdG9yOiAnW2NsaWNrT3V0c2lkZV0nXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBDbGlja091dHNpZGVEaXJlY3RpdmUge1xyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZikge1xyXG4gICAgfVxyXG5cclxuICAgIEBPdXRwdXQoKVxyXG4gICAgcHVibGljIGNsaWNrT3V0c2lkZSA9IG5ldyBFdmVudEVtaXR0ZXI8TW91c2VFdmVudD4oKTtcclxuXHJcbiAgICBASG9zdExpc3RlbmVyKCdkb2N1bWVudDpjbGljaycsIFsnJGV2ZW50JywgJyRldmVudC50YXJnZXQnXSlcclxuICAgIHB1YmxpYyBvbkNsaWNrKGV2ZW50OiBNb3VzZUV2ZW50LCB0YXJnZXRFbGVtZW50OiBIVE1MRWxlbWVudCk6IHZvaWQge1xyXG4gICAgICAgIGlmICghdGFyZ2V0RWxlbWVudCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBjbGlja2VkSW5zaWRlID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNvbnRhaW5zKHRhcmdldEVsZW1lbnQpO1xyXG4gICAgICAgIGlmICghY2xpY2tlZEluc2lkZSkge1xyXG4gICAgICAgICAgICB0aGlzLmNsaWNrT3V0c2lkZS5lbWl0KGV2ZW50KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgUGlwZSwgUGlwZVRyYW5zZm9ybSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuaW1wb3J0IHsgTGlzdEl0ZW0gfSBmcm9tICcuL211bHRpc2VsZWN0Lm1vZGVsJztcclxuXHJcbkBQaXBlKHtcclxuICAgIG5hbWU6ICduZzJMaXN0RmlsdGVyJyxcclxuICAgIHB1cmU6IGZhbHNlXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBMaXN0RmlsdGVyUGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xyXG4gICAgdHJhbnNmb3JtKGl0ZW1zOiBMaXN0SXRlbVtdLCBmaWx0ZXI6IExpc3RJdGVtKTogTGlzdEl0ZW1bXSB7XHJcbiAgICAgICAgaWYgKCFpdGVtcyB8fCAhZmlsdGVyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBpdGVtcztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGl0ZW1zLmZpbHRlcigoaXRlbTogTGlzdEl0ZW0pID0+IHRoaXMuYXBwbHlGaWx0ZXIoaXRlbSwgZmlsdGVyKSk7XHJcbiAgICB9XHJcblxyXG4gICAgYXBwbHlGaWx0ZXIoaXRlbTogTGlzdEl0ZW0sIGZpbHRlcjogTGlzdEl0ZW0pOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gIShmaWx0ZXIudGV4dCAmJiBpdGVtLnRleHQgJiYgaXRlbS50ZXh0LnRvTG93ZXJDYXNlKCkuaW5kZXhPZihmaWx0ZXIudGV4dC50b0xvd2VyQ2FzZSgpKSA9PT0gLTEpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IE5nTW9kdWxlLCBNb2R1bGVXaXRoUHJvdmlkZXJzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XHJcbmltcG9ydCB7IEZvcm1zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xyXG5pbXBvcnQgeyBNdWx0aVNlbGVjdENvbXBvbmVudCB9IGZyb20gJy4vbXVsdGlzZWxlY3QuY29tcG9uZW50JztcclxuaW1wb3J0IHsgQ2xpY2tPdXRzaWRlRGlyZWN0aXZlIH0gZnJvbSAnLi9jbGljay1vdXRzaWRlLmRpcmVjdGl2ZSc7XHJcbmltcG9ydCB7IExpc3RGaWx0ZXJQaXBlIH0gZnJvbSAnLi9saXN0LWZpbHRlci5waXBlJztcclxuXHJcbkBOZ01vZHVsZSh7XHJcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgRm9ybXNNb2R1bGVdLFxyXG4gIGRlY2xhcmF0aW9uczogW011bHRpU2VsZWN0Q29tcG9uZW50LCBDbGlja091dHNpZGVEaXJlY3RpdmUsIExpc3RGaWx0ZXJQaXBlXSxcclxuICBleHBvcnRzOiBbTXVsdGlTZWxlY3RDb21wb25lbnRdXHJcbn0pXHJcblxyXG5leHBvcnQgY2xhc3MgTmdNdWx0aVNlbGVjdERyb3BEb3duTW9kdWxlIHtcclxuICAgIHN0YXRpYyBmb3JSb290KCk6IE1vZHVsZVdpdGhQcm92aWRlcnMge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIG5nTW9kdWxlOiBOZ011bHRpU2VsZWN0RHJvcERvd25Nb2R1bGVcclxuICAgICAgfTtcclxuICAgIH1cclxufVxyXG4iXSwibmFtZXMiOlsiTkdfVkFMVUVfQUNDRVNTT1IiLCJmb3J3YXJkUmVmIiwiRXZlbnRFbWl0dGVyIiwiQ29tcG9uZW50IiwiQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kiLCJDaGFuZ2VEZXRlY3RvclJlZiIsIklucHV0IiwiT3V0cHV0IiwiSG9zdExpc3RlbmVyIiwiRGlyZWN0aXZlIiwiRWxlbWVudFJlZiIsIlBpcGUiLCJOZ01vZHVsZSIsIkNvbW1vbk1vZHVsZSIsIkZvcm1zTW9kdWxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBb0JBLElBQUE7MEJBS3FCLE1BQVc7WUFDNUIsSUFBSSxPQUFPLE1BQU0sS0FBSyxRQUFRLEVBQUU7Z0JBQzlCLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUM7Z0JBQzdCLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO2FBQ3pCO1lBQ0QsSUFBSSxPQUFPLE1BQU0sS0FBSyxRQUFRLEVBQUU7Z0JBQzlCLElBQUksQ0FBQyxFQUFFLEdBQUcsTUFBTSxDQUFDLEVBQUUsQ0FBQztnQkFDcEIsSUFBSSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDO2dCQUN4QixJQUFJLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUM7YUFDckM7O3VCQWxDTDtRQW9D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