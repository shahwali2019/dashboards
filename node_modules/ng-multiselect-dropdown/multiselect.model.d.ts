export interface IDropdownSettings {
    singleSelection?: boolean;
    idField?: string;
    textField?: string;
    disabledField?: string;
    enableCheckAll?: boolean;
    selectAllText?: string;
    unSelectAllText?: string;
    allowSearchFilter?: boolean;
    clearSearchFilter?: boolean;
    maxHeight?: number;
    itemsShowLimit?: number;
    limitSelection?: number;
    searchPlaceholderText?: string;
    noDataAvailablePlaceholderText?: string;
    closeDropDownOnSelection?: boolean;
    showSelectedItemsAtTop?: boolean;
    defaultOpen?: boolean;
}
export declare class ListItem {
    id: String;
    text: String;
    isDisabled?: boolean;
    constructor(source: any);
}
