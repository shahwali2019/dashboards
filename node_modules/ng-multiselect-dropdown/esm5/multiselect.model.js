/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @record
 */
export function IDropdownSettings() { }
function IDropdownSettings_tsickle_Closure_declarations() {
    /** @type {?|undefined} */
    IDropdownSettings.prototype.singleSelection;
    /** @type {?|undefined} */
    IDropdownSettings.prototype.idField;
    /** @type {?|undefined} */
    IDropdownSettings.prototype.textField;
    /** @type {?|undefined} */
    IDropdownSettings.prototype.disabledField;
    /** @type {?|undefined} */
    IDropdownSettings.prototype.enableCheckAll;
    /** @type {?|undefined} */
    IDropdownSettings.prototype.selectAllText;
    /** @type {?|undefined} */
    IDropdownSettings.prototype.unSelectAllText;
    /** @type {?|undefined} */
    IDropdownSettings.prototype.allowSearchFilter;
    /** @type {?|undefined} */
    IDropdownSettings.prototype.clearSearchFilter;
    /** @type {?|undefined} */
    IDropdownSettings.prototype.maxHeight;
    /** @type {?|undefined} */
    IDropdownSettings.prototype.itemsShowLimit;
    /** @type {?|undefined} */
    IDropdownSettings.prototype.limitSelection;
    /** @type {?|undefined} */
    IDropdownSettings.prototype.searchPlaceholderText;
    /** @type {?|undefined} */
    IDropdownSettings.prototype.noDataAvailablePlaceholderText;
    /** @type {?|undefined} */
    IDropdownSettings.prototype.closeDropDownOnSelection;
    /** @type {?|undefined} */
    IDropdownSettings.prototype.showSelectedItemsAtTop;
    /** @type {?|undefined} */
    IDropdownSettings.prototype.defaultOpen;
}
var ListItem = /** @class */ (function () {
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
export { ListItem };
function ListItem_tsickle_Closure_declarations() {
    /** @type {?} */
    ListItem.prototype.id;
    /** @type {?} */
    ListItem.prototype.text;
    /** @type {?} */
    ListItem.prototype.isDisabled;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGlzZWxlY3QubW9kZWwuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZy1tdWx0aXNlbGVjdC1kcm9wZG93bi8iLCJzb3VyY2VzIjpbIm11bHRpc2VsZWN0Lm1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBLElBQUE7c0JBS3FCLE1BQVc7UUFDNUIsRUFBRSxDQUFDLENBQUMsT0FBTyxNQUFNLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztZQUMvQixJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDO1lBQzdCLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO1NBQ3pCO1FBQ0QsRUFBRSxDQUFDLENBQUMsT0FBTyxNQUFNLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztZQUMvQixJQUFJLENBQUMsRUFBRSxHQUFHLE1BQU0sQ0FBQyxFQUFFLENBQUM7WUFDcEIsSUFBSSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDO1lBQ3hCLElBQUksQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQztTQUNyQzs7bUJBbENMO0lBb0NDLENBQUE7QUFoQkQsb0JBZ0JDIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGludGVyZmFjZSBJRHJvcGRvd25TZXR0aW5ncyB7XHJcbiAgc2luZ2xlU2VsZWN0aW9uPzogYm9vbGVhbjtcclxuICBpZEZpZWxkPzogc3RyaW5nO1xyXG4gIHRleHRGaWVsZD86IHN0cmluZztcclxuICBkaXNhYmxlZEZpZWxkPzogc3RyaW5nO1xyXG4gIGVuYWJsZUNoZWNrQWxsPzogYm9vbGVhbjtcclxuICBzZWxlY3RBbGxUZXh0Pzogc3RyaW5nO1xyXG4gIHVuU2VsZWN0QWxsVGV4dD86IHN0cmluZztcclxuICBhbGxvd1NlYXJjaEZpbHRlcj86IGJvb2xlYW47XHJcbiAgY2xlYXJTZWFyY2hGaWx0ZXI/OiBib29sZWFuO1xyXG4gIG1heEhlaWdodD86IG51bWJlcjtcclxuICBpdGVtc1Nob3dMaW1pdD86IG51bWJlcjtcclxuICBsaW1pdFNlbGVjdGlvbj86IG51bWJlcjtcclxuICBzZWFyY2hQbGFjZWhvbGRlclRleHQ/OiBzdHJpbmc7XHJcbiAgbm9EYXRhQXZhaWxhYmxlUGxhY2Vob2xkZXJUZXh0Pzogc3RyaW5nO1xyXG4gIGNsb3NlRHJvcERvd25PblNlbGVjdGlvbj86IGJvb2xlYW47XHJcbiAgc2hvd1NlbGVjdGVkSXRlbXNBdFRvcD86IGJvb2xlYW47XHJcbiAgZGVmYXVsdE9wZW4/OiBib29sZWFuO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTGlzdEl0ZW0ge1xyXG4gIGlkOiBTdHJpbmc7XHJcbiAgdGV4dDogU3RyaW5nO1xyXG4gIGlzRGlzYWJsZWQ/OiBib29sZWFuO1xyXG5cclxuICBwdWJsaWMgY29uc3RydWN0b3Ioc291cmNlOiBhbnkpIHtcclxuICAgIGlmICh0eXBlb2Ygc291cmNlID09PSAnc3RyaW5nJykge1xyXG4gICAgICB0aGlzLmlkID0gdGhpcy50ZXh0ID0gc291cmNlO1xyXG4gICAgICB0aGlzLmlzRGlzYWJsZWQgPSBmYWxzZTtcclxuICAgIH1cclxuICAgIGlmICh0eXBlb2Ygc291cmNlID09PSAnb2JqZWN0Jykge1xyXG4gICAgICB0aGlzLmlkID0gc291cmNlLmlkO1xyXG4gICAgICB0aGlzLnRleHQgPSBzb3VyY2UudGV4dDtcclxuICAgICAgdGhpcy5pc0Rpc2FibGVkID0gc291cmNlLmlzRGlzYWJsZWQ7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiJdfQ==