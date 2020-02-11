import { ModuleWithProviders } from '@angular/core';
import { SimpleModalServiceConfig } from './simple-modal.service';
import { SimpleModalOptions } from './simple-modal-options';
export declare class SimpleModalModule {
    static forRoot(config: SimpleModalServiceConfig, defaultModalOptions?: SimpleModalOptions): ModuleWithProviders;
    constructor();
}
