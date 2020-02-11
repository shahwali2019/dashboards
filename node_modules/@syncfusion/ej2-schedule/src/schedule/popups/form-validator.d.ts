/**
 * Appointment window field validation
 */
export declare class FieldValidator {
    private formObj;
    private element;
    renderFormValidator(form: HTMLFormElement, rules: {
        [key: string]: Object;
    }, element: HTMLElement): void;
    private validationComplete;
    private errorPlacement;
    private createTooltip;
    destroyToolTip(): void;
    /**
     * @hidden
     */
    destroy(): void;
}
