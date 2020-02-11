/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("tsickle/src/modules_manifest", ["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /** A class that maintains the module dependency graph of output JS files. */
    var ModulesManifest = /** @class */ (function () {
        function ModulesManifest() {
            /** Map of googmodule module name to file name */
            this.moduleToFileName = {};
            /** Map of file name to arrays of imported googmodule module names */
            this.referencedModules = {};
        }
        ModulesManifest.prototype.addManifest = function (other) {
            Object.assign(this.moduleToFileName, other.moduleToFileName);
            Object.assign(this.referencedModules, other.referencedModules);
        };
        ModulesManifest.prototype.addModule = function (fileName, module) {
            this.moduleToFileName[module] = fileName;
            this.referencedModules[fileName] = [];
        };
        ModulesManifest.prototype.addReferencedModule = function (fileName, resolvedModule) {
            this.referencedModules[fileName].push(resolvedModule);
        };
        Object.defineProperty(ModulesManifest.prototype, "modules", {
            get: function () {
                return Object.keys(this.moduleToFileName);
            },
            enumerable: true,
            configurable: true
        });
        ModulesManifest.prototype.getFileNameFromModule = function (module) {
            return this.moduleToFileName[module];
        };
        Object.defineProperty(ModulesManifest.prototype, "fileNames", {
            get: function () {
                return Object.keys(this.referencedModules);
            },
            enumerable: true,
            configurable: true
        });
        ModulesManifest.prototype.getReferencedModules = function (fileName) {
            return this.referencedModules[fileName];
        };
        return ModulesManifest;
    }());
    exports.ModulesManifest = ModulesManifest;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlc19tYW5pZmVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzX21hbmlmZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0lBTUgsNkVBQTZFO0lBQzdFO1FBQUE7WUFDRSxpREFBaUQ7WUFDekMscUJBQWdCLEdBQW9CLEVBQUUsQ0FBQztZQUMvQyxxRUFBcUU7WUFDN0Qsc0JBQWlCLEdBQXNCLEVBQUUsQ0FBQztRQStCcEQsQ0FBQztRQTdCQyxxQ0FBVyxHQUFYLFVBQVksS0FBc0I7WUFDaEMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsS0FBSyxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFDN0QsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDakUsQ0FBQztRQUVELG1DQUFTLEdBQVQsVUFBVSxRQUFnQixFQUFFLE1BQWM7WUFDeEMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxHQUFHLFFBQVEsQ0FBQztZQUN6QyxJQUFJLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ3hDLENBQUM7UUFFRCw2Q0FBbUIsR0FBbkIsVUFBb0IsUUFBZ0IsRUFBRSxjQUFzQjtZQUMxRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ3hELENBQUM7UUFFRCxzQkFBSSxvQ0FBTztpQkFBWDtnQkFDRSxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFDNUMsQ0FBQzs7O1dBQUE7UUFFRCwrQ0FBcUIsR0FBckIsVUFBc0IsTUFBYztZQUNsQyxPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN2QyxDQUFDO1FBRUQsc0JBQUksc0NBQVM7aUJBQWI7Z0JBQ0UsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1lBQzdDLENBQUM7OztXQUFBO1FBRUQsOENBQW9CLEdBQXBCLFVBQXFCLFFBQWdCO1lBQ25DLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzFDLENBQUM7UUFDSCxzQkFBQztJQUFELENBQUMsQUFuQ0QsSUFtQ0M7SUFuQ1ksMENBQWUiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmV4cG9ydCBpbnRlcmZhY2UgRmlsZU1hcDxUPiB7XG4gIFtmaWxlTmFtZTogc3RyaW5nXTogVDtcbn1cblxuLyoqIEEgY2xhc3MgdGhhdCBtYWludGFpbnMgdGhlIG1vZHVsZSBkZXBlbmRlbmN5IGdyYXBoIG9mIG91dHB1dCBKUyBmaWxlcy4gKi9cbmV4cG9ydCBjbGFzcyBNb2R1bGVzTWFuaWZlc3Qge1xuICAvKiogTWFwIG9mIGdvb2dtb2R1bGUgbW9kdWxlIG5hbWUgdG8gZmlsZSBuYW1lICovXG4gIHByaXZhdGUgbW9kdWxlVG9GaWxlTmFtZTogRmlsZU1hcDxzdHJpbmc+ID0ge307XG4gIC8qKiBNYXAgb2YgZmlsZSBuYW1lIHRvIGFycmF5cyBvZiBpbXBvcnRlZCBnb29nbW9kdWxlIG1vZHVsZSBuYW1lcyAqL1xuICBwcml2YXRlIHJlZmVyZW5jZWRNb2R1bGVzOiBGaWxlTWFwPHN0cmluZ1tdPiA9IHt9O1xuXG4gIGFkZE1hbmlmZXN0KG90aGVyOiBNb2R1bGVzTWFuaWZlc3QpIHtcbiAgICBPYmplY3QuYXNzaWduKHRoaXMubW9kdWxlVG9GaWxlTmFtZSwgb3RoZXIubW9kdWxlVG9GaWxlTmFtZSk7XG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLnJlZmVyZW5jZWRNb2R1bGVzLCBvdGhlci5yZWZlcmVuY2VkTW9kdWxlcyk7XG4gIH1cblxuICBhZGRNb2R1bGUoZmlsZU5hbWU6IHN0cmluZywgbW9kdWxlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLm1vZHVsZVRvRmlsZU5hbWVbbW9kdWxlXSA9IGZpbGVOYW1lO1xuICAgIHRoaXMucmVmZXJlbmNlZE1vZHVsZXNbZmlsZU5hbWVdID0gW107XG4gIH1cblxuICBhZGRSZWZlcmVuY2VkTW9kdWxlKGZpbGVOYW1lOiBzdHJpbmcsIHJlc29sdmVkTW9kdWxlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLnJlZmVyZW5jZWRNb2R1bGVzW2ZpbGVOYW1lXS5wdXNoKHJlc29sdmVkTW9kdWxlKTtcbiAgfVxuXG4gIGdldCBtb2R1bGVzKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5tb2R1bGVUb0ZpbGVOYW1lKTtcbiAgfVxuXG4gIGdldEZpbGVOYW1lRnJvbU1vZHVsZShtb2R1bGU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMubW9kdWxlVG9GaWxlTmFtZVttb2R1bGVdO1xuICB9XG5cbiAgZ2V0IGZpbGVOYW1lcygpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMucmVmZXJlbmNlZE1vZHVsZXMpO1xuICB9XG5cbiAgZ2V0UmVmZXJlbmNlZE1vZHVsZXMoZmlsZU5hbWU6IHN0cmluZyk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGhpcy5yZWZlcmVuY2VkTW9kdWxlc1tmaWxlTmFtZV07XG4gIH1cbn1cbiJdfQ==