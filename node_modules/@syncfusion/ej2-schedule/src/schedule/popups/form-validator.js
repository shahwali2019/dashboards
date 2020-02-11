import { createElement, remove } from '@syncfusion/ej2-base';
import { FormValidator } from '@syncfusion/ej2-inputs';
import * as cls from '../base/css-constant';
/**
 * Appointment window field validation
 */
var FieldValidator = /** @class */ (function () {
    function FieldValidator() {
    }
    FieldValidator.prototype.renderFormValidator = function (form, rules, element) {
        var _this = this;
        this.element = element;
        this.formObj = new FormValidator(form, {
            customPlacement: function (inputElement, error) {
                _this.errorPlacement(inputElement, error);
            },
            rules: rules,
            validationComplete: function (args) {
                _this.validationComplete(args);
            }
        });
    };
    FieldValidator.prototype.validationComplete = function (args) {
        var elem = this.element.querySelector('#' + args.inputName + '_Error');
        if (elem) {
            elem.style.display = (args.status === 'failure') ? '' : 'none';
        }
    };
    FieldValidator.prototype.errorPlacement = function (inputElement, error) {
        var id = error.getAttribute('for');
        var elem = this.element.querySelector('#' + id + '_Error');
        if (!elem) {
            this.createTooltip(inputElement, error, id, '');
        }
    };
    FieldValidator.prototype.createTooltip = function (element, error, name, display) {
        var dlgContent;
        var client;
        var inputClient = element.getBoundingClientRect();
        if (this.element.classList.contains(cls.POPUP_WRAPPER_CLASS)) {
            dlgContent = this.element;
            client = this.element.getBoundingClientRect();
        }
        else {
            dlgContent = this.element.querySelector('.e-schedule-dialog .e-dlg-content');
            client = dlgContent.getBoundingClientRect();
        }
        var div = createElement('div', {
            className: 'e-tooltip-wrap e-popup ' + cls.ERROR_VALIDATION_CLASS,
            id: name + '_Error',
            styles: 'display:' + display + ';top:' +
                (inputClient.bottom - client.top + dlgContent.scrollTop + 9) + 'px;left:' +
                (inputClient.left - client.left + dlgContent.scrollLeft + inputClient.width / 2) + 'px;'
        });
        var content = createElement('div', { className: 'e-tip-content' });
        content.appendChild(error);
        var arrow = createElement('div', { className: 'e-arrow-tip e-tip-top' });
        arrow.appendChild(createElement('div', { className: 'e-arrow-tip-outer e-tip-top' }));
        arrow.appendChild(createElement('div', { className: 'e-arrow-tip-inner e-tip-top' }));
        div.appendChild(content);
        div.appendChild(arrow);
        dlgContent.appendChild(div);
        div.style.left = (parseInt(div.style.left, 10) - div.offsetWidth / 2) + 'px';
    };
    FieldValidator.prototype.destroyToolTip = function () {
        if (this.element) {
            var elements = [].slice.call(this.element.querySelectorAll('.' + cls.ERROR_VALIDATION_CLASS));
            for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
                var elem = elements_1[_i];
                remove(elem);
            }
        }
        if (this.formObj && this.formObj.element) {
            this.formObj.reset();
        }
    };
    /**
     * @hidden
     */
    FieldValidator.prototype.destroy = function () {
        if (this.formObj && !this.formObj.isDestroyed) {
            this.formObj.destroy();
        }
    };
    return FieldValidator;
}());
export { FieldValidator };
