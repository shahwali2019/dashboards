/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("tsickle/src/decorators", ["require", "exports", "typescript", "tsickle/src/transformer_util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ts = require("typescript");
    var transformer_util_1 = require("tsickle/src/transformer_util");
    /**
     * Returns the declarations for the given decorator.
     */
    function getDecoratorDeclarations(decorator, typeChecker) {
        // Walk down the expression to find the identifier of the decorator function.
        var node = decorator;
        while (node.kind !== ts.SyntaxKind.Identifier) {
            if (node.kind === ts.SyntaxKind.Decorator || node.kind === ts.SyntaxKind.CallExpression) {
                node = node.expression;
            }
            else {
                // We do not know how to handle this type of decorator.
                return [];
            }
        }
        var decSym = typeChecker.getSymbolAtLocation(node);
        if (!decSym)
            return [];
        if (decSym.flags & ts.SymbolFlags.Alias) {
            decSym = typeChecker.getAliasedSymbol(decSym);
        }
        return decSym.getDeclarations() || [];
    }
    exports.getDecoratorDeclarations = getDecoratorDeclarations;
    /**
     * Returns true if node has an exporting decorator  (i.e., a decorator with @ExportDecoratedItems
     * in its JSDoc).
     */
    function hasExportingDecorator(node, typeChecker) {
        return node.decorators &&
            node.decorators.some(function (decorator) { return isExportingDecorator(decorator, typeChecker); });
    }
    exports.hasExportingDecorator = hasExportingDecorator;
    /**
     * Returns true if the given decorator has an @ExportDecoratedItems directive in its JSDoc.
     */
    function isExportingDecorator(decorator, typeChecker) {
        return getDecoratorDeclarations(decorator, typeChecker).some(function (declaration) {
            var e_1, _a;
            var range = transformer_util_1.getAllLeadingComments(declaration);
            if (!range) {
                return false;
            }
            try {
                for (var range_1 = __values(range), range_1_1 = range_1.next(); !range_1_1.done; range_1_1 = range_1.next()) {
                    var text = range_1_1.value.text;
                    if (/@ExportDecoratedItems\b/.test(text)) {
                        return true;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (range_1_1 && !range_1_1.done && (_a = range_1.return)) _a.call(range_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return false;
        });
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVjb3JhdG9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9kZWNvcmF0b3JzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQUVILCtCQUFpQztJQUVqQyxpRUFBeUQ7SUFFekQ7O09BRUc7SUFDSCxTQUFnQix3QkFBd0IsQ0FDcEMsU0FBdUIsRUFBRSxXQUEyQjtRQUN0RCw2RUFBNkU7UUFDN0UsSUFBSSxJQUFJLEdBQVksU0FBUyxDQUFDO1FBQzlCLE9BQU8sSUFBSSxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLFVBQVUsRUFBRTtZQUM3QyxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLGNBQWMsRUFBRTtnQkFDdkYsSUFBSSxHQUFJLElBQXlDLENBQUMsVUFBVSxDQUFDO2FBQzlEO2lCQUFNO2dCQUNMLHVEQUF1RDtnQkFDdkQsT0FBTyxFQUFFLENBQUM7YUFDWDtTQUNGO1FBRUQsSUFBSSxNQUFNLEdBQUcsV0FBVyxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ25ELElBQUksQ0FBQyxNQUFNO1lBQUUsT0FBTyxFQUFFLENBQUM7UUFDdkIsSUFBSSxNQUFNLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFO1lBQ3ZDLE1BQU0sR0FBRyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDL0M7UUFDRCxPQUFPLE1BQU0sQ0FBQyxlQUFlLEVBQUUsSUFBSSxFQUFFLENBQUM7SUFDeEMsQ0FBQztJQW5CRCw0REFtQkM7SUFFRDs7O09BR0c7SUFDSCxTQUFnQixxQkFBcUIsQ0FBQyxJQUFhLEVBQUUsV0FBMkI7UUFDOUUsT0FBTyxJQUFJLENBQUMsVUFBVTtZQUNsQixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxVQUFBLFNBQVMsSUFBSSxPQUFBLG9CQUFvQixDQUFDLFNBQVMsRUFBRSxXQUFXLENBQUMsRUFBNUMsQ0FBNEMsQ0FBQyxDQUFDO0lBQ3RGLENBQUM7SUFIRCxzREFHQztJQUVEOztPQUVHO0lBQ0gsU0FBUyxvQkFBb0IsQ0FBQyxTQUF1QixFQUFFLFdBQTJCO1FBQ2hGLE9BQU8sd0JBQXdCLENBQUMsU0FBUyxFQUFFLFdBQVcsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLFdBQVc7O1lBQ3RFLElBQU0sS0FBSyxHQUFHLHdDQUFxQixDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ2pELElBQUksQ0FBQyxLQUFLLEVBQUU7Z0JBQ1YsT0FBTyxLQUFLLENBQUM7YUFDZDs7Z0JBQ0QsS0FBcUIsSUFBQSxVQUFBLFNBQUEsS0FBSyxDQUFBLDRCQUFBLCtDQUFFO29CQUFoQixJQUFBLDJCQUFJO29CQUNkLElBQUkseUJBQXlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO3dCQUN4QyxPQUFPLElBQUksQ0FBQztxQkFDYjtpQkFDRjs7Ozs7Ozs7O1lBQ0QsT0FBTyxLQUFLLENBQUM7UUFDZixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuXG5pbXBvcnQge2dldEFsbExlYWRpbmdDb21tZW50c30gZnJvbSAnLi90cmFuc2Zvcm1lcl91dGlsJztcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBkZWNsYXJhdGlvbnMgZm9yIHRoZSBnaXZlbiBkZWNvcmF0b3IuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXREZWNvcmF0b3JEZWNsYXJhdGlvbnMoXG4gICAgZGVjb3JhdG9yOiB0cy5EZWNvcmF0b3IsIHR5cGVDaGVja2VyOiB0cy5UeXBlQ2hlY2tlcik6IHRzLkRlY2xhcmF0aW9uW10ge1xuICAvLyBXYWxrIGRvd24gdGhlIGV4cHJlc3Npb24gdG8gZmluZCB0aGUgaWRlbnRpZmllciBvZiB0aGUgZGVjb3JhdG9yIGZ1bmN0aW9uLlxuICBsZXQgbm9kZTogdHMuTm9kZSA9IGRlY29yYXRvcjtcbiAgd2hpbGUgKG5vZGUua2luZCAhPT0gdHMuU3ludGF4S2luZC5JZGVudGlmaWVyKSB7XG4gICAgaWYgKG5vZGUua2luZCA9PT0gdHMuU3ludGF4S2luZC5EZWNvcmF0b3IgfHwgbm9kZS5raW5kID09PSB0cy5TeW50YXhLaW5kLkNhbGxFeHByZXNzaW9uKSB7XG4gICAgICBub2RlID0gKG5vZGUgYXMgdHMuRGVjb3JhdG9yIHwgdHMuQ2FsbEV4cHJlc3Npb24pLmV4cHJlc3Npb247XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFdlIGRvIG5vdCBrbm93IGhvdyB0byBoYW5kbGUgdGhpcyB0eXBlIG9mIGRlY29yYXRvci5cbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gIH1cblxuICBsZXQgZGVjU3ltID0gdHlwZUNoZWNrZXIuZ2V0U3ltYm9sQXRMb2NhdGlvbihub2RlKTtcbiAgaWYgKCFkZWNTeW0pIHJldHVybiBbXTtcbiAgaWYgKGRlY1N5bS5mbGFncyAmIHRzLlN5bWJvbEZsYWdzLkFsaWFzKSB7XG4gICAgZGVjU3ltID0gdHlwZUNoZWNrZXIuZ2V0QWxpYXNlZFN5bWJvbChkZWNTeW0pO1xuICB9XG4gIHJldHVybiBkZWNTeW0uZ2V0RGVjbGFyYXRpb25zKCkgfHwgW107XG59XG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIG5vZGUgaGFzIGFuIGV4cG9ydGluZyBkZWNvcmF0b3IgIChpLmUuLCBhIGRlY29yYXRvciB3aXRoIEBFeHBvcnREZWNvcmF0ZWRJdGVtc1xuICogaW4gaXRzIEpTRG9jKS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGhhc0V4cG9ydGluZ0RlY29yYXRvcihub2RlOiB0cy5Ob2RlLCB0eXBlQ2hlY2tlcjogdHMuVHlwZUNoZWNrZXIpIHtcbiAgcmV0dXJuIG5vZGUuZGVjb3JhdG9ycyAmJlxuICAgICAgbm9kZS5kZWNvcmF0b3JzLnNvbWUoZGVjb3JhdG9yID0+IGlzRXhwb3J0aW5nRGVjb3JhdG9yKGRlY29yYXRvciwgdHlwZUNoZWNrZXIpKTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgdGhlIGdpdmVuIGRlY29yYXRvciBoYXMgYW4gQEV4cG9ydERlY29yYXRlZEl0ZW1zIGRpcmVjdGl2ZSBpbiBpdHMgSlNEb2MuXG4gKi9cbmZ1bmN0aW9uIGlzRXhwb3J0aW5nRGVjb3JhdG9yKGRlY29yYXRvcjogdHMuRGVjb3JhdG9yLCB0eXBlQ2hlY2tlcjogdHMuVHlwZUNoZWNrZXIpIHtcbiAgcmV0dXJuIGdldERlY29yYXRvckRlY2xhcmF0aW9ucyhkZWNvcmF0b3IsIHR5cGVDaGVja2VyKS5zb21lKGRlY2xhcmF0aW9uID0+IHtcbiAgICBjb25zdCByYW5nZSA9IGdldEFsbExlYWRpbmdDb21tZW50cyhkZWNsYXJhdGlvbik7XG4gICAgaWYgKCFyYW5nZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IHt0ZXh0fSBvZiByYW5nZSkge1xuICAgICAgaWYgKC9ARXhwb3J0RGVjb3JhdGVkSXRlbXNcXGIvLnRlc3QodGV4dCkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfSk7XG59XG4iXX0=