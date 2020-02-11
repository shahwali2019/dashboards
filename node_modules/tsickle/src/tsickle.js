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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("tsickle/src/tsickle", ["require", "exports", "typescript", "tsickle/src/cli_support", "tsickle/src/decorator_downlevel_transformer", "tsickle/src/enum_transformer", "tsickle/src/externs", "tsickle/src/fileoverview_comment_transformer", "tsickle/src/googmodule", "tsickle/src/jsdoc_transformer", "tsickle/src/modules_manifest", "tsickle/src/quoting_transformer", "tsickle/src/transformer_util", "tsickle/src/externs", "tsickle/src/modules_manifest"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ts = require("typescript");
    var cli_support_1 = require("tsickle/src/cli_support");
    var decorator_downlevel_transformer_1 = require("tsickle/src/decorator_downlevel_transformer");
    var enum_transformer_1 = require("tsickle/src/enum_transformer");
    var externs_1 = require("tsickle/src/externs");
    var fileoverview_comment_transformer_1 = require("tsickle/src/fileoverview_comment_transformer");
    var googmodule = require("tsickle/src/googmodule");
    var jsdoc_transformer_1 = require("tsickle/src/jsdoc_transformer");
    var modules_manifest_1 = require("tsickle/src/modules_manifest");
    var quoting_transformer_1 = require("tsickle/src/quoting_transformer");
    var transformer_util_1 = require("tsickle/src/transformer_util");
    // Retained here for API compatibility.
    var externs_2 = require("tsickle/src/externs");
    exports.getGeneratedExterns = externs_2.getGeneratedExterns;
    var modules_manifest_2 = require("tsickle/src/modules_manifest");
    exports.ModulesManifest = modules_manifest_2.ModulesManifest;
    function mergeEmitResults(emitResults) {
        var e_1, _a;
        var diagnostics = [];
        var emitSkipped = true;
        var emittedFiles = [];
        var externs = {};
        var modulesManifest = new modules_manifest_1.ModulesManifest();
        try {
            for (var emitResults_1 = __values(emitResults), emitResults_1_1 = emitResults_1.next(); !emitResults_1_1.done; emitResults_1_1 = emitResults_1.next()) {
                var er = emitResults_1_1.value;
                diagnostics.push.apply(diagnostics, __spread(er.diagnostics));
                emitSkipped = emitSkipped || er.emitSkipped;
                emittedFiles.push.apply(emittedFiles, __spread(er.emittedFiles));
                Object.assign(externs, er.externs);
                modulesManifest.addManifest(er.modulesManifest);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (emitResults_1_1 && !emitResults_1_1.done && (_a = emitResults_1.return)) _a.call(emitResults_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return { diagnostics: diagnostics, emitSkipped: emitSkipped, emittedFiles: emittedFiles, externs: externs, modulesManifest: modulesManifest };
    }
    exports.mergeEmitResults = mergeEmitResults;
    function emitWithTsickle(program, host, tsHost, tsOptions, targetSourceFile, writeFile, cancellationToken, emitOnlyDtsFiles, customTransformers) {
        if (customTransformers === void 0) { customTransformers = {}; }
        var e_2, _a, e_3, _b;
        try {
            for (var _c = __values(program.getSourceFiles()), _d = _c.next(); !_d.done; _d = _c.next()) {
                var sf = _d.value;
                cli_support_1.assertAbsolute(sf.fileName);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_2) throw e_2.error; }
        }
        var tsickleDiagnostics = [];
        var typeChecker = program.getTypeChecker();
        var tsickleSourceTransformers = [];
        if (host.transformTypesToClosure) {
            // Only add @suppress {checkTypes} comments when also adding type annotations.
            tsickleSourceTransformers.push(fileoverview_comment_transformer_1.transformFileoverviewCommentFactory(tsickleDiagnostics));
            tsickleSourceTransformers.push(jsdoc_transformer_1.jsdocTransformer(host, tsOptions, tsHost, typeChecker, tsickleDiagnostics));
            if (host.enableAutoQuoting) {
                tsickleSourceTransformers.push(quoting_transformer_1.quotingTransformer(host, typeChecker, tsickleDiagnostics));
            }
            tsickleSourceTransformers.push(enum_transformer_1.enumTransformer(typeChecker, tsickleDiagnostics));
            tsickleSourceTransformers.push(decorator_downlevel_transformer_1.decoratorDownlevelTransformer(typeChecker, tsickleDiagnostics));
        }
        else if (host.transformDecorators) {
            tsickleSourceTransformers.push(decorator_downlevel_transformer_1.decoratorDownlevelTransformer(typeChecker, tsickleDiagnostics));
        }
        var modulesManifest = new modules_manifest_1.ModulesManifest();
        var tsickleTransformers = { before: tsickleSourceTransformers };
        var tsTransformers = {
            before: __spread((customTransformers.beforeTsickle || []), (tsickleTransformers.before || []).map(function (tf) { return skipTransformForSourceFileIfNeeded(host, tf); }), (customTransformers.beforeTs || [])),
            after: __spread((customTransformers.afterTs || []), (tsickleTransformers.after || []).map(function (tf) { return skipTransformForSourceFileIfNeeded(host, tf); })),
            afterDeclarations: customTransformers.afterDeclarations,
        };
        if (host.transformTypesToClosure) {
            // See comment on remoteTypeAssertions.
            tsTransformers.before.push(jsdoc_transformer_1.removeTypeAssertions());
        }
        if (host.googmodule) {
            tsTransformers.after.push(googmodule.commonJsToGoogmoduleTransformer(host, modulesManifest, typeChecker, tsickleDiagnostics));
        }
        var writeFileDelegate = writeFile || tsHost.writeFile.bind(tsHost);
        var writeFileImpl = function (fileName, content, writeByteOrderMark, onError, sourceFiles) {
            cli_support_1.assertAbsolute(fileName);
            if (host.addDtsClutzAliases && transformer_util_1.isDtsFileName(fileName) && sourceFiles) {
                // Only bundle emits pass more than one source file for .d.ts writes. Bundle emits however
                // are not supported by tsickle, as we cannot annotate them for Closure in any meaningful
                // way anyway.
                if (!sourceFiles || sourceFiles.length > 1) {
                    throw new Error("expected exactly one source file for .d.ts emit, got " + sourceFiles.map(function (sf) { return sf.fileName; }));
                }
                var originalSource = sourceFiles[0];
                content = addClutzAliases(fileName, content, originalSource, typeChecker, host);
            }
            writeFileDelegate(fileName, content, writeByteOrderMark, onError, sourceFiles);
        };
        var _e = program.emit(targetSourceFile, writeFileImpl, cancellationToken, emitOnlyDtsFiles, tsTransformers), tsDiagnostics = _e.diagnostics, emitSkipped = _e.emitSkipped, emittedFiles = _e.emittedFiles;
        var externs = {};
        if (host.transformTypesToClosure) {
            var sourceFiles = targetSourceFile ? [targetSourceFile] : program.getSourceFiles();
            try {
                for (var sourceFiles_1 = __values(sourceFiles), sourceFiles_1_1 = sourceFiles_1.next(); !sourceFiles_1_1.done; sourceFiles_1_1 = sourceFiles_1.next()) {
                    var sourceFile = sourceFiles_1_1.value;
                    var isDts = transformer_util_1.isDtsFileName(sourceFile.fileName);
                    if (isDts && host.shouldSkipTsickleProcessing(sourceFile.fileName)) {
                        continue;
                    }
                    var _f = externs_1.generateExterns(typeChecker, sourceFile, host, host.moduleResolutionHost, tsOptions), output = _f.output, diagnostics = _f.diagnostics;
                    if (output) {
                        externs[sourceFile.fileName] = output;
                    }
                    if (diagnostics) {
                        tsickleDiagnostics.push.apply(tsickleDiagnostics, __spread(diagnostics));
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (sourceFiles_1_1 && !sourceFiles_1_1.done && (_b = sourceFiles_1.return)) _b.call(sourceFiles_1);
                }
                finally { if (e_3) throw e_3.error; }
            }
        }
        // All diagnostics (including warnings) are treated as errors.
        // If the host decides to ignore warnings, just discard them.
        // Warnings include stuff like "don't use @type in your jsdoc"; tsickle
        // warns and then fixes up the code to be Closure-compatible anyway.
        tsickleDiagnostics = tsickleDiagnostics.filter(function (d) { return d.category === ts.DiagnosticCategory.Error ||
            !host.shouldIgnoreWarningsForPath(d.file.fileName); });
        return {
            modulesManifest: modulesManifest,
            emitSkipped: emitSkipped,
            emittedFiles: emittedFiles || [],
            diagnostics: __spread(tsDiagnostics, tsickleDiagnostics),
            externs: externs
        };
    }
    exports.emitWithTsickle = emitWithTsickle;
    /** Compares two strings and returns a number suitable for use in sort(). */
    function stringCompare(a, b) {
        if (a < b)
            return -1;
        if (a > b)
            return 1;
        return 0;
    }
    /**
     * A tsickle produced declaration file might be consumed be referenced by Clutz
     * produced .d.ts files, which use symbol names based on Closure's internal
     * naming conventions, so we need to provide aliases for all the exported symbols
     * in the Clutz naming convention.
     */
    function addClutzAliases(fileName, dtsFileContent, sourceFile, typeChecker, host) {
        var e_4, _a;
        var moduleSymbol = typeChecker.getSymbolAtLocation(sourceFile);
        var moduleExports = moduleSymbol && typeChecker.getExportsOfModule(moduleSymbol);
        if (!moduleExports)
            return dtsFileContent;
        // .d.ts files can be transformed, too, so we need to compare the original node below.
        var origSourceFile = ts.getOriginalNode(sourceFile);
        // The module exports might be re-exports, and in the case of "export *" might not even be
        // available in the module scope, which makes them difficult to export. Avoid the problem by
        // filtering out symbols who do not have a declaration in the local module.
        var localExports = moduleExports.filter(function (e) {
            // If there are no declarations, be conservative and emit the aliases.
            if (!e.declarations)
                return true;
            // Skip default exports, they are not currently supported.
            // default is a keyword in typescript, so the name of the export being default means that it's a
            // default export.
            if (e.name === 'default')
                return false;
            // Otherwise check that some declaration is from the local module.
            return e.declarations.some(function (d) { return d.getSourceFile() === origSourceFile; });
        });
        if (!localExports.length)
            return dtsFileContent;
        // TypeScript 2.8 and TypeScript 2.9 differ on the order in which the
        // module symbols come out, so sort here to make the tests stable.
        localExports.sort(function (a, b) { return stringCompare(a.name, b.name); });
        var moduleName = host.pathToModuleName('', sourceFile.fileName);
        var clutzModuleName = moduleName.replace(/\./g, '$');
        // Clutz might refer to the name in two different forms (stemming from goog.provide and
        // goog.module respectively).
        // 1) global in clutz:   ಠ_ಠ.clutz.module$contents$path$to$module_Symbol...
        // 2) local in a module: ಠ_ಠ.clutz.module$exports$path$to$module.Symbol ..
        // See examples at:
        // https://github.com/angular/clutz/tree/master/src/test/java/com/google/javascript/clutz
        // Case (1) from above.
        var globalSymbols = '';
        // Case (2) from above.
        var nestedSymbols = '';
        try {
            for (var localExports_1 = __values(localExports), localExports_1_1 = localExports_1.next(); !localExports_1_1.done; localExports_1_1 = localExports_1.next()) {
                var symbol = localExports_1_1.value;
                globalSymbols +=
                    "\t\texport {" + symbol.name + " as module$contents$" + clutzModuleName + "_" + symbol.name + "}\n";
                nestedSymbols +=
                    "\t\texport {module$contents$" + clutzModuleName + "_" + symbol.name + " as " + symbol.name + "}\n";
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (localExports_1_1 && !localExports_1_1.done && (_a = localExports_1.return)) _a.call(localExports_1);
            }
            finally { if (e_4) throw e_4.error; }
        }
        dtsFileContent += 'declare global {\n';
        dtsFileContent += "\tnamespace \u0CA0_\u0CA0.clutz {\n";
        dtsFileContent += globalSymbols;
        dtsFileContent += "\t}\n";
        dtsFileContent += "\tnamespace \u0CA0_\u0CA0.clutz.module$exports$" + clutzModuleName + " {\n";
        dtsFileContent += nestedSymbols;
        dtsFileContent += "\t}\n";
        dtsFileContent += '}\n';
        return dtsFileContent;
    }
    function skipTransformForSourceFileIfNeeded(host, delegateFactory) {
        return function (context) {
            var delegate = delegateFactory(context);
            return function (sourceFile) {
                if (host.shouldSkipTsickleProcessing(sourceFile.fileName)) {
                    return sourceFile;
                }
                return delegate(sourceFile);
            };
        };
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHNpY2tsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy90c2lja2xlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBRUgsK0JBQWlDO0lBR2pDLHVEQUE2QztJQUM3QywrRkFBZ0Y7SUFDaEYsaUVBQW1EO0lBQ25ELCtDQUEwQztJQUMxQyxpR0FBdUY7SUFDdkYsbURBQTJDO0lBQzNDLG1FQUEyRTtJQUMzRSxpRUFBbUQ7SUFDbkQsdUVBQXlEO0lBQ3pELGlFQUFpRDtJQUVqRCx1Q0FBdUM7SUFDdkMsK0NBQThDO0lBQXRDLHdDQUFBLG1CQUFtQixDQUFBO0lBQzNCLGlFQUE0RDtJQUEzQyw2Q0FBQSxlQUFlLENBQUE7SUE4QmhDLFNBQWdCLGdCQUFnQixDQUFDLFdBQXlCOztRQUN4RCxJQUFNLFdBQVcsR0FBb0IsRUFBRSxDQUFDO1FBQ3hDLElBQUksV0FBVyxHQUFHLElBQUksQ0FBQztRQUN2QixJQUFNLFlBQVksR0FBYSxFQUFFLENBQUM7UUFDbEMsSUFBTSxPQUFPLEdBQWlDLEVBQUUsQ0FBQztRQUNqRCxJQUFNLGVBQWUsR0FBRyxJQUFJLGtDQUFlLEVBQUUsQ0FBQzs7WUFDOUMsS0FBaUIsSUFBQSxnQkFBQSxTQUFBLFdBQVcsQ0FBQSx3Q0FBQSxpRUFBRTtnQkFBekIsSUFBTSxFQUFFLHdCQUFBO2dCQUNYLFdBQVcsQ0FBQyxJQUFJLE9BQWhCLFdBQVcsV0FBUyxFQUFFLENBQUMsV0FBVyxHQUFFO2dCQUNwQyxXQUFXLEdBQUcsV0FBVyxJQUFJLEVBQUUsQ0FBQyxXQUFXLENBQUM7Z0JBQzVDLFlBQVksQ0FBQyxJQUFJLE9BQWpCLFlBQVksV0FBUyxFQUFFLENBQUMsWUFBWSxHQUFFO2dCQUN0QyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ25D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QUMsSUFBSSxRQUFLLENBQUM7YUFDMUY7Ozs7Ozs7OztRQUVELGNBQWMsSUFBSSxvQkFBb0IsQ0FBQztRQUN2QyxjQUFjLElBQUkscUNBQTJCLENBQUM7UUFDOUMsY0FBYyxJQUFJLGFBQWEsQ0FBQztRQUNoQyxjQUFjLElBQUksT0FBTyxDQUFDO1FBQzFCLGNBQWMsSUFBSSxvREFBd0MsZUFBZSxTQUFNLENBQUM7UUFDaEYsY0FBYyxJQUFJLGFBQWEsQ0FBQztRQUNoQyxjQUFjLElBQUksT0FBTyxDQUFDO1FBQzFCLGNBQWMsSUFBSSxLQUFLLENBQUM7UUFFeEIsT0FBTyxjQUFjLENBQUM7SUFDeEIsQ0FBQztJQUVELFNBQVMsa0NBQWtDLENBQ3ZDLElBQWlCLEVBQ2pCLGVBQXFEO1FBQ3ZELE9BQU8sVUFBQyxPQUFpQztZQUN2QyxJQUFNLFFBQVEsR0FBRyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDMUMsT0FBTyxVQUFDLFVBQXlCO2dCQUMvQixJQUFJLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEVBQUU7b0JBQ3pELE9BQU8sVUFBVSxDQUFDO2lCQUNuQjtnQkFDRCxPQUFPLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUM5QixDQUFDLENBQUM7UUFDSixDQUFDLENBQUM7SUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcblxuaW1wb3J0IHtBbm5vdGF0b3JIb3N0fSBmcm9tICcuL2Fubm90YXRvcl9ob3N0JztcbmltcG9ydCB7YXNzZXJ0QWJzb2x1dGV9IGZyb20gJy4vY2xpX3N1cHBvcnQnO1xuaW1wb3J0IHtkZWNvcmF0b3JEb3dubGV2ZWxUcmFuc2Zvcm1lcn0gZnJvbSAnLi9kZWNvcmF0b3JfZG93bmxldmVsX3RyYW5zZm9ybWVyJztcbmltcG9ydCB7ZW51bVRyYW5zZm9ybWVyfSBmcm9tICcuL2VudW1fdHJhbnNmb3JtZXInO1xuaW1wb3J0IHtnZW5lcmF0ZUV4dGVybnN9IGZyb20gJy4vZXh0ZXJucyc7XG5pbXBvcnQge3RyYW5zZm9ybUZpbGVvdmVydmlld0NvbW1lbnRGYWN0b3J5fSBmcm9tICcuL2ZpbGVvdmVydmlld19jb21tZW50X3RyYW5zZm9ybWVyJztcbmltcG9ydCAqIGFzIGdvb2dtb2R1bGUgZnJvbSAnLi9nb29nbW9kdWxlJztcbmltcG9ydCB7anNkb2NUcmFuc2Zvcm1lciwgcmVtb3ZlVHlwZUFzc2VydGlvbnN9IGZyb20gJy4vanNkb2NfdHJhbnNmb3JtZXInO1xuaW1wb3J0IHtNb2R1bGVzTWFuaWZlc3R9IGZyb20gJy4vbW9kdWxlc19tYW5pZmVzdCc7XG5pbXBvcnQge3F1b3RpbmdUcmFuc2Zvcm1lcn0gZnJvbSAnLi9xdW90aW5nX3RyYW5zZm9ybWVyJztcbmltcG9ydCB7aXNEdHNGaWxlTmFtZX0gZnJvbSAnLi90cmFuc2Zvcm1lcl91dGlsJztcblxuLy8gUmV0YWluZWQgaGVyZSBmb3IgQVBJIGNvbXBhdGliaWxpdHkuXG5leHBvcnQge2dldEdlbmVyYXRlZEV4dGVybnN9IGZyb20gJy4vZXh0ZXJucyc7XG5leHBvcnQge0ZpbGVNYXAsIE1vZHVsZXNNYW5pZmVzdH0gZnJvbSAnLi9tb2R1bGVzX21hbmlmZXN0JztcblxuZXhwb3J0IGludGVyZmFjZSBUc2lja2xlSG9zdCBleHRlbmRzIGdvb2dtb2R1bGUuR29vZ01vZHVsZVByb2Nlc3Nvckhvc3QsIEFubm90YXRvckhvc3Qge1xuICAvKipcbiAgICogV2hldGhlciB0byBkb3dubGV2ZWwgZGVjb3JhdG9yc1xuICAgKi9cbiAgdHJhbnNmb3JtRGVjb3JhdG9ycz86IGJvb2xlYW47XG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIGNvbnZlcnMgdHlwZXMgdG8gY2xvc3VyZVxuICAgKi9cbiAgdHJhbnNmb3JtVHlwZXNUb0Nsb3N1cmU/OiBib29sZWFuO1xuICAvKipcbiAgICogV2hldGhlciB0byBhZGQgYWxpYXNlcyB0byB0aGUgLmQudHMgZmlsZXMgdG8gYWRkIHRoZSBleHBvcnRzIHRvIHRoZVxuICAgKiDgsqBf4LKgLmNsdXR6IG5hbWVzcGFjZS5cbiAgICovXG4gIGFkZER0c0NsdXR6QWxpYXNlcz86IGJvb2xlYW47XG4gIC8qKlxuICAgKiBJZiB0cnVlLCB0c2lja2xlIGFuZCBkZWNvcmF0b3IgZG93bmxldmVsIHByb2Nlc3Npbmcgd2lsbCBiZSBza2lwcGVkIGZvclxuICAgKiB0aGF0IGZpbGUuXG4gICAqL1xuICBzaG91bGRTa2lwVHNpY2tsZVByb2Nlc3NpbmcoZmlsZU5hbWU6IHN0cmluZyk6IGJvb2xlYW47XG4gIC8qKlxuICAgKiBUc2lja2xlIHRyZWF0cyB3YXJuaW5ncyBhcyBlcnJvcnMsIGlmIHRydWUsIGlnbm9yZSB3YXJuaW5ncy4gIFRoaXMgbWlnaHQgYmVcbiAgICogdXNlZnVsIGZvciBlLmcuIHRoaXJkIHBhcnR5IGNvZGUuXG4gICAqL1xuICBzaG91bGRJZ25vcmVXYXJuaW5nc0ZvclBhdGgoZmlsZVBhdGg6IHN0cmluZyk6IGJvb2xlYW47XG4gIC8qKiBXaGV0aGVyIHRvIGNvbnZlcnQgQ29tbW9uSlMgcmVxdWlyZSgpIGltcG9ydHMgdG8gZ29vZy5tb2R1bGUoKSBhbmQgZ29vZy5yZXF1aXJlKCkgY2FsbHMuICovXG4gIGdvb2dtb2R1bGU6IGJvb2xlYW47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZUVtaXRSZXN1bHRzKGVtaXRSZXN1bHRzOiBFbWl0UmVzdWx0W10pOiBFbWl0UmVzdWx0IHtcbiAgY29uc3QgZGlhZ25vc3RpY3M6IHRzLkRpYWdub3N0aWNbXSA9IFtdO1xuICBsZXQgZW1pdFNraXBwZWQgPSB0cnVlO1xuICBjb25zdCBlbWl0dGVkRmlsZXM6IHN0cmluZ1tdID0gW107XG4gIGNvbnN0IGV4dGVybnM6IHtbZmlsZU5hbWU6IHN0cmluZ106IHN0cmluZ30gPSB7fTtcbiAgY29uc3QgbW9kdWxlc01hbmlmZXN0ID0gbmV3IE1vZHVsZXNNYW5pZmVzdCgpO1xuICBmb3IgKGNvbnN0IGVyIG9mIGVtaXRSZXN1bHRzKSB7XG4gICAgZGlhZ25vc3RpY3MucHVzaCguLi5lci5kaWFnbm9zdGljcyk7XG4gICAgZW1pdFNraXBwZWQgPSBlbWl0U2tpcHBlZCB8fCBlci5lbWl0U2tpcHBlZDtcbiAgICBlbWl0dGVkRmlsZXMucHVzaCguLi5lci5lbWl0dGVkRmlsZXMpO1xuICAgIE9iamVjdC5hc3NpZ24oZXh0ZXJucywgZXIuZXh0ZXJucyk7XG4gICAgbW9kdWxlc01hbmlmZXN0LmFkZE1hbmlmZXN0KGVyLm1vZHVsZXNNYW5pZmVzdCk7XG4gIH1cbiAgcmV0dXJuIHtkaWFnbm9zdGljcywgZW1pdFNraXBwZWQsIGVtaXR0ZWRGaWxlcywgZXh0ZXJucywgbW9kdWxlc01hbmlmZXN0fTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBFbWl0UmVzdWx0IGV4dGVuZHMgdHMuRW1pdFJlc3VsdCB7XG4gIC8vIFRoZSBtYW5pZmVzdCBvZiBKUyBtb2R1bGVzIG91dHB1dCBieSB0aGUgY29tcGlsZXIuXG4gIG1vZHVsZXNNYW5pZmVzdDogTW9kdWxlc01hbmlmZXN0O1xuICAvKipcbiAgICogZXh0ZXJucy5qcyBmaWxlcyBwcm9kdWNlZCBieSB0c2lja2xlLCBpZiBhbnkuIG1vZHVsZSBJRHMgYXJlIHJlbGF0aXZlIHBhdGhzIGZyb21cbiAgICogZmlsZU5hbWVUb01vZHVsZUlkLlxuICAgKi9cbiAgZXh0ZXJuczoge1ttb2R1bGVJZDogc3RyaW5nXTogc3RyaW5nfTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBFbWl0VHJhbnNmb3JtZXJzIHtcbiAgLyoqIEN1c3RvbSB0cmFuc2Zvcm1lcnMgdG8gZXZhbHVhdGUgYmVmb3JlIFRzaWNrbGUgLmpzIHRyYW5zZm9ybWF0aW9ucy4gKi9cbiAgYmVmb3JlVHNpY2tsZT86IEFycmF5PHRzLlRyYW5zZm9ybWVyRmFjdG9yeTx0cy5Tb3VyY2VGaWxlPj47XG4gIC8qKiBDdXN0b20gdHJhbnNmb3JtZXJzIHRvIGV2YWx1YXRlIGJlZm9yZSBidWlsdC1pbiAuanMgdHJhbnNmb3JtYXRpb25zLiAqL1xuICBiZWZvcmVUcz86IEFycmF5PHRzLlRyYW5zZm9ybWVyRmFjdG9yeTx0cy5Tb3VyY2VGaWxlPj47XG4gIC8qKiBDdXN0b20gdHJhbnNmb3JtZXJzIHRvIGV2YWx1YXRlIGFmdGVyIGJ1aWx0LWluIC5qcyB0cmFuc2Zvcm1hdGlvbnMuICovXG4gIGFmdGVyVHM/OiBBcnJheTx0cy5UcmFuc2Zvcm1lckZhY3Rvcnk8dHMuU291cmNlRmlsZT4+O1xuICAvKiogQ3VzdG9tIHRyYW5zZm9ybWVycyB0byBldmFsdWF0ZSBhZnRlciBidWlsdC1pbiAuZC50cyB0cmFuc2Zvcm1hdGlvbnMuICovXG4gIGFmdGVyRGVjbGFyYXRpb25zPzogQXJyYXk8dHMuVHJhbnNmb3JtZXJGYWN0b3J5PHRzLkJ1bmRsZXx0cy5Tb3VyY2VGaWxlPj47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBlbWl0V2l0aFRzaWNrbGUoXG4gICAgcHJvZ3JhbTogdHMuUHJvZ3JhbSwgaG9zdDogVHNpY2tsZUhvc3QsIHRzSG9zdDogdHMuQ29tcGlsZXJIb3N0LCB0c09wdGlvbnM6IHRzLkNvbXBpbGVyT3B0aW9ucyxcbiAgICB0YXJnZXRTb3VyY2VGaWxlPzogdHMuU291cmNlRmlsZSwgd3JpdGVGaWxlPzogdHMuV3JpdGVGaWxlQ2FsbGJhY2ssXG4gICAgY2FuY2VsbGF0aW9uVG9rZW4/OiB0cy5DYW5jZWxsYXRpb25Ub2tlbiwgZW1pdE9ubHlEdHNGaWxlcz86IGJvb2xlYW4sXG4gICAgY3VzdG9tVHJhbnNmb3JtZXJzOiBFbWl0VHJhbnNmb3JtZXJzID0ge30pOiBFbWl0UmVzdWx0IHtcbiAgZm9yIChjb25zdCBzZiBvZiBwcm9ncmFtLmdldFNvdXJjZUZpbGVzKCkpIHtcbiAgICBhc3NlcnRBYnNvbHV0ZShzZi5maWxlTmFtZSk7XG4gIH1cblxuICBsZXQgdHNpY2tsZURpYWdub3N0aWNzOiB0cy5EaWFnbm9zdGljW10gPSBbXTtcbiAgY29uc3QgdHlwZUNoZWNrZXIgPSBwcm9ncmFtLmdldFR5cGVDaGVja2VyKCk7XG4gIGNvbnN0IHRzaWNrbGVTb3VyY2VUcmFuc2Zvcm1lcnM6IEFycmF5PHRzLlRyYW5zZm9ybWVyRmFjdG9yeTx0cy5Tb3VyY2VGaWxlPj4gPSBbXTtcbiAgaWYgKGhvc3QudHJhbnNmb3JtVHlwZXNUb0Nsb3N1cmUpIHtcbiAgICAvLyBPbmx5IGFkZCBAc3VwcHJlc3Mge2NoZWNrVHlwZXN9IGNvbW1lbnRzIHdoZW4gYWxzbyBhZGRpbmcgdHlwZSBhbm5vdGF0aW9ucy5cbiAgICB0c2lja2xlU291cmNlVHJhbnNmb3JtZXJzLnB1c2godHJhbnNmb3JtRmlsZW92ZXJ2aWV3Q29tbWVudEZhY3RvcnkodHNpY2tsZURpYWdub3N0aWNzKSk7XG4gICAgdHNpY2tsZVNvdXJjZVRyYW5zZm9ybWVycy5wdXNoKFxuICAgICAgICBqc2RvY1RyYW5zZm9ybWVyKGhvc3QsIHRzT3B0aW9ucywgdHNIb3N0LCB0eXBlQ2hlY2tlciwgdHNpY2tsZURpYWdub3N0aWNzKSk7XG4gICAgaWYgKGhvc3QuZW5hYmxlQXV0b1F1b3RpbmcpIHtcbiAgICAgIHRzaWNrbGVTb3VyY2VUcmFuc2Zvcm1lcnMucHVzaChxdW90aW5nVHJhbnNmb3JtZXIoaG9zdCwgdHlwZUNoZWNrZXIsIHRzaWNrbGVEaWFnbm9zdGljcykpO1xuICAgIH1cbiAgICB0c2lja2xlU291cmNlVHJhbnNmb3JtZXJzLnB1c2goZW51bVRyYW5zZm9ybWVyKHR5cGVDaGVja2VyLCB0c2lja2xlRGlhZ25vc3RpY3MpKTtcbiAgICB0c2lja2xlU291cmNlVHJhbnNmb3JtZXJzLnB1c2goZGVjb3JhdG9yRG93bmxldmVsVHJhbnNmb3JtZXIodHlwZUNoZWNrZXIsIHRzaWNrbGVEaWFnbm9zdGljcykpO1xuICB9IGVsc2UgaWYgKGhvc3QudHJhbnNmb3JtRGVjb3JhdG9ycykge1xuICAgIHRzaWNrbGVTb3VyY2VUcmFuc2Zvcm1lcnMucHVzaChkZWNvcmF0b3JEb3dubGV2ZWxUcmFuc2Zvcm1lcih0eXBlQ2hlY2tlciwgdHNpY2tsZURpYWdub3N0aWNzKSk7XG4gIH1cbiAgY29uc3QgbW9kdWxlc01hbmlmZXN0ID0gbmV3IE1vZHVsZXNNYW5pZmVzdCgpO1xuICBjb25zdCB0c2lja2xlVHJhbnNmb3JtZXJzOiB0cy5DdXN0b21UcmFuc2Zvcm1lcnMgPSB7YmVmb3JlOiB0c2lja2xlU291cmNlVHJhbnNmb3JtZXJzfTtcbiAgY29uc3QgdHNUcmFuc2Zvcm1lcnM6IHRzLkN1c3RvbVRyYW5zZm9ybWVycyA9IHtcbiAgICBiZWZvcmU6IFtcbiAgICAgIC4uLihjdXN0b21UcmFuc2Zvcm1lcnMuYmVmb3JlVHNpY2tsZSB8fCBbXSksXG4gICAgICAuLi4odHNpY2tsZVRyYW5zZm9ybWVycy5iZWZvcmUgfHwgW10pLm1hcCh0ZiA9PiBza2lwVHJhbnNmb3JtRm9yU291cmNlRmlsZUlmTmVlZGVkKGhvc3QsIHRmKSksXG4gICAgICAuLi4oY3VzdG9tVHJhbnNmb3JtZXJzLmJlZm9yZVRzIHx8IFtdKSxcbiAgICBdLFxuICAgIGFmdGVyOiBbXG4gICAgICAuLi4oY3VzdG9tVHJhbnNmb3JtZXJzLmFmdGVyVHMgfHwgW10pLFxuICAgICAgLi4uKHRzaWNrbGVUcmFuc2Zvcm1lcnMuYWZ0ZXIgfHwgW10pLm1hcCh0ZiA9PiBza2lwVHJhbnNmb3JtRm9yU291cmNlRmlsZUlmTmVlZGVkKGhvc3QsIHRmKSksXG4gICAgXSxcbiAgICBhZnRlckRlY2xhcmF0aW9uczogY3VzdG9tVHJhbnNmb3JtZXJzLmFmdGVyRGVjbGFyYXRpb25zLFxuICB9O1xuICBpZiAoaG9zdC50cmFuc2Zvcm1UeXBlc1RvQ2xvc3VyZSkge1xuICAgIC8vIFNlZSBjb21tZW50IG9uIHJlbW90ZVR5cGVBc3NlcnRpb25zLlxuICAgIHRzVHJhbnNmb3JtZXJzLmJlZm9yZSEucHVzaChyZW1vdmVUeXBlQXNzZXJ0aW9ucygpKTtcbiAgfVxuICBpZiAoaG9zdC5nb29nbW9kdWxlKSB7XG4gICAgdHNUcmFuc2Zvcm1lcnMuYWZ0ZXIhLnB1c2goZ29vZ21vZHVsZS5jb21tb25Kc1RvR29vZ21vZHVsZVRyYW5zZm9ybWVyKFxuICAgICAgICBob3N0LCBtb2R1bGVzTWFuaWZlc3QsIHR5cGVDaGVja2VyLCB0c2lja2xlRGlhZ25vc3RpY3MpKTtcbiAgfVxuXG4gIGNvbnN0IHdyaXRlRmlsZURlbGVnYXRlOiB0cy5Xcml0ZUZpbGVDYWxsYmFjayA9IHdyaXRlRmlsZSB8fCB0c0hvc3Qud3JpdGVGaWxlLmJpbmQodHNIb3N0KTtcbiAgY29uc3Qgd3JpdGVGaWxlSW1wbDogdHMuV3JpdGVGaWxlQ2FsbGJhY2sgPVxuICAgICAgKGZpbGVOYW1lLCBjb250ZW50LCB3cml0ZUJ5dGVPcmRlck1hcmssIG9uRXJyb3IsIHNvdXJjZUZpbGVzKSA9PiB7XG4gICAgICAgIGFzc2VydEFic29sdXRlKGZpbGVOYW1lKTtcbiAgICAgICAgaWYgKGhvc3QuYWRkRHRzQ2x1dHpBbGlhc2VzICYmIGlzRHRzRmlsZU5hbWUoZmlsZU5hbWUpICYmIHNvdXJjZUZpbGVzKSB7XG4gICAgICAgICAgLy8gT25seSBidW5kbGUgZW1pdHMgcGFzcyBtb3JlIHRoYW4gb25lIHNvdXJjZSBmaWxlIGZvciAuZC50cyB3cml0ZXMuIEJ1bmRsZSBlbWl0cyBob3dldmVyXG4gICAgICAgICAgLy8gYXJlIG5vdCBzdXBwb3J0ZWQgYnkgdHNpY2tsZSwgYXMgd2UgY2Fubm90IGFubm90YXRlIHRoZW0gZm9yIENsb3N1cmUgaW4gYW55IG1lYW5pbmdmdWxcbiAgICAgICAgICAvLyB3YXkgYW55d2F5LlxuICAgICAgICAgIGlmICghc291cmNlRmlsZXMgfHwgc291cmNlRmlsZXMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBleHBlY3RlZCBleGFjdGx5IG9uZSBzb3VyY2UgZmlsZSBmb3IgLmQudHMgZW1pdCwgZ290ICR7XG4gICAgICAgICAgICAgICAgc291cmNlRmlsZXMubWFwKHNmID0+IHNmLmZpbGVOYW1lKX1gKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3Qgb3JpZ2luYWxTb3VyY2UgPSBzb3VyY2VGaWxlc1swXTtcbiAgICAgICAgICBjb250ZW50ID0gYWRkQ2x1dHpBbGlhc2VzKGZpbGVOYW1lLCBjb250ZW50LCBvcmlnaW5hbFNvdXJjZSwgdHlwZUNoZWNrZXIsIGhvc3QpO1xuICAgICAgICB9XG4gICAgICAgIHdyaXRlRmlsZURlbGVnYXRlKGZpbGVOYW1lLCBjb250ZW50LCB3cml0ZUJ5dGVPcmRlck1hcmssIG9uRXJyb3IsIHNvdXJjZUZpbGVzKTtcbiAgICAgIH07XG5cbiAgY29uc3Qge2RpYWdub3N0aWNzOiB0c0RpYWdub3N0aWNzLCBlbWl0U2tpcHBlZCwgZW1pdHRlZEZpbGVzfSA9IHByb2dyYW0uZW1pdChcbiAgICAgIHRhcmdldFNvdXJjZUZpbGUsIHdyaXRlRmlsZUltcGwsIGNhbmNlbGxhdGlvblRva2VuLCBlbWl0T25seUR0c0ZpbGVzLCB0c1RyYW5zZm9ybWVycyk7XG5cbiAgY29uc3QgZXh0ZXJuczoge1tmaWxlTmFtZTogc3RyaW5nXTogc3RyaW5nfSA9IHt9O1xuICBpZiAoaG9zdC50cmFuc2Zvcm1UeXBlc1RvQ2xvc3VyZSkge1xuICAgIGNvbnN0IHNvdXJjZUZpbGVzID0gdGFyZ2V0U291cmNlRmlsZSA/IFt0YXJnZXRTb3VyY2VGaWxlXSA6IHByb2dyYW0uZ2V0U291cmNlRmlsZXMoKTtcbiAgICBmb3IgKGNvbnN0IHNvdXJjZUZpbGUgb2Ygc291cmNlRmlsZXMpIHtcbiAgICAgIGNvbnN0IGlzRHRzID0gaXNEdHNGaWxlTmFtZShzb3VyY2VGaWxlLmZpbGVOYW1lKTtcbiAgICAgIGlmIChpc0R0cyAmJiBob3N0LnNob3VsZFNraXBUc2lja2xlUHJvY2Vzc2luZyhzb3VyY2VGaWxlLmZpbGVOYW1lKSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHtvdXRwdXQsIGRpYWdub3N0aWNzfSA9XG4gICAgICAgICAgZ2VuZXJhdGVFeHRlcm5zKHR5cGVDaGVja2VyLCBzb3VyY2VGaWxlLCBob3N0LCBob3N0Lm1vZHVsZVJlc29sdXRpb25Ib3N0LCB0c09wdGlvbnMpO1xuICAgICAgaWYgKG91dHB1dCkge1xuICAgICAgICBleHRlcm5zW3NvdXJjZUZpbGUuZmlsZU5hbWVdID0gb3V0cHV0O1xuICAgICAgfVxuICAgICAgaWYgKGRpYWdub3N0aWNzKSB7XG4gICAgICAgIHRzaWNrbGVEaWFnbm9zdGljcy5wdXNoKC4uLmRpYWdub3N0aWNzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgLy8gQWxsIGRpYWdub3N0aWNzIChpbmNsdWRpbmcgd2FybmluZ3MpIGFyZSB0cmVhdGVkIGFzIGVycm9ycy5cbiAgLy8gSWYgdGhlIGhvc3QgZGVjaWRlcyB0byBpZ25vcmUgd2FybmluZ3MsIGp1c3QgZGlzY2FyZCB0aGVtLlxuICAvLyBXYXJuaW5ncyBpbmNsdWRlIHN0dWZmIGxpa2UgXCJkb24ndCB1c2UgQHR5cGUgaW4geW91ciBqc2RvY1wiOyB0c2lja2xlXG4gIC8vIHdhcm5zIGFuZCB0aGVuIGZpeGVzIHVwIHRoZSBjb2RlIHRvIGJlIENsb3N1cmUtY29tcGF0aWJsZSBhbnl3YXkuXG4gIHRzaWNrbGVEaWFnbm9zdGljcyA9IHRzaWNrbGVEaWFnbm9zdGljcy5maWx0ZXIoXG4gICAgICBkID0+IGQuY2F0ZWdvcnkgPT09IHRzLkRpYWdub3N0aWNDYXRlZ29yeS5FcnJvciB8fFxuICAgICAgICAgICFob3N0LnNob3VsZElnbm9yZVdhcm5pbmdzRm9yUGF0aChkLmZpbGUhLmZpbGVOYW1lKSk7XG5cbiAgcmV0dXJuIHtcbiAgICBtb2R1bGVzTWFuaWZlc3QsXG4gICAgZW1pdFNraXBwZWQsXG4gICAgZW1pdHRlZEZpbGVzOiBlbWl0dGVkRmlsZXMgfHwgW10sXG4gICAgZGlhZ25vc3RpY3M6IFsuLi50c0RpYWdub3N0aWNzLCAuLi50c2lja2xlRGlhZ25vc3RpY3NdLFxuICAgIGV4dGVybnNcbiAgfTtcbn1cblxuLyoqIENvbXBhcmVzIHR3byBzdHJpbmdzIGFuZCByZXR1cm5zIGEgbnVtYmVyIHN1aXRhYmxlIGZvciB1c2UgaW4gc29ydCgpLiAqL1xuZnVuY3Rpb24gc3RyaW5nQ29tcGFyZShhOiBzdHJpbmcsIGI6IHN0cmluZyk6IG51bWJlciB7XG4gIGlmIChhIDwgYikgcmV0dXJuIC0xO1xuICBpZiAoYSA+IGIpIHJldHVybiAxO1xuICByZXR1cm4gMDtcbn1cblxuLyoqXG4gKiBBIHRzaWNrbGUgcHJvZHVjZWQgZGVjbGFyYXRpb24gZmlsZSBtaWdodCBiZSBjb25zdW1lZCBiZSByZWZlcmVuY2VkIGJ5IENsdXR6XG4gKiBwcm9kdWNlZCAuZC50cyBmaWxlcywgd2hpY2ggdXNlIHN5bWJvbCBuYW1lcyBiYXNlZCBvbiBDbG9zdXJlJ3MgaW50ZXJuYWxcbiAqIG5hbWluZyBjb252ZW50aW9ucywgc28gd2UgbmVlZCB0byBwcm92aWRlIGFsaWFzZXMgZm9yIGFsbCB0aGUgZXhwb3J0ZWQgc3ltYm9sc1xuICogaW4gdGhlIENsdXR6IG5hbWluZyBjb252ZW50aW9uLlxuICovXG5mdW5jdGlvbiBhZGRDbHV0ekFsaWFzZXMoXG4gICAgZmlsZU5hbWU6IHN0cmluZywgZHRzRmlsZUNvbnRlbnQ6IHN0cmluZywgc291cmNlRmlsZTogdHMuU291cmNlRmlsZSxcbiAgICB0eXBlQ2hlY2tlcjogdHMuVHlwZUNoZWNrZXIsIGhvc3Q6IFRzaWNrbGVIb3N0KTogc3RyaW5nIHtcbiAgY29uc3QgbW9kdWxlU3ltYm9sID0gdHlwZUNoZWNrZXIuZ2V0U3ltYm9sQXRMb2NhdGlvbihzb3VyY2VGaWxlKTtcbiAgY29uc3QgbW9kdWxlRXhwb3J0cyA9IG1vZHVsZVN5bWJvbCAmJiB0eXBlQ2hlY2tlci5nZXRFeHBvcnRzT2ZNb2R1bGUobW9kdWxlU3ltYm9sKTtcbiAgaWYgKCFtb2R1bGVFeHBvcnRzKSByZXR1cm4gZHRzRmlsZUNvbnRlbnQ7XG5cbiAgLy8gLmQudHMgZmlsZXMgY2FuIGJlIHRyYW5zZm9ybWVkLCB0b28sIHNvIHdlIG5lZWQgdG8gY29tcGFyZSB0aGUgb3JpZ2luYWwgbm9kZSBiZWxvdy5cbiAgY29uc3Qgb3JpZ1NvdXJjZUZpbGUgPSB0cy5nZXRPcmlnaW5hbE5vZGUoc291cmNlRmlsZSk7XG4gIC8vIFRoZSBtb2R1bGUgZXhwb3J0cyBtaWdodCBiZSByZS1leHBvcnRzLCBhbmQgaW4gdGhlIGNhc2Ugb2YgXCJleHBvcnQgKlwiIG1pZ2h0IG5vdCBldmVuIGJlXG4gIC8vIGF2YWlsYWJsZSBpbiB0aGUgbW9kdWxlIHNjb3BlLCB3aGljaCBtYWtlcyB0aGVtIGRpZmZpY3VsdCB0byBleHBvcnQuIEF2b2lkIHRoZSBwcm9ibGVtIGJ5XG4gIC8vIGZpbHRlcmluZyBvdXQgc3ltYm9scyB3aG8gZG8gbm90IGhhdmUgYSBkZWNsYXJhdGlvbiBpbiB0aGUgbG9jYWwgbW9kdWxlLlxuICBjb25zdCBsb2NhbEV4cG9ydHMgPSBtb2R1bGVFeHBvcnRzLmZpbHRlcihlID0+IHtcbiAgICAvLyBJZiB0aGVyZSBhcmUgbm8gZGVjbGFyYXRpb25zLCBiZSBjb25zZXJ2YXRpdmUgYW5kIGVtaXQgdGhlIGFsaWFzZXMuXG4gICAgaWYgKCFlLmRlY2xhcmF0aW9ucykgcmV0dXJuIHRydWU7XG4gICAgLy8gU2tpcCBkZWZhdWx0IGV4cG9ydHMsIHRoZXkgYXJlIG5vdCBjdXJyZW50bHkgc3VwcG9ydGVkLlxuICAgIC8vIGRlZmF1bHQgaXMgYSBrZXl3b3JkIGluIHR5cGVzY3JpcHQsIHNvIHRoZSBuYW1lIG9mIHRoZSBleHBvcnQgYmVpbmcgZGVmYXVsdCBtZWFucyB0aGF0IGl0J3MgYVxuICAgIC8vIGRlZmF1bHQgZXhwb3J0LlxuICAgIGlmIChlLm5hbWUgPT09ICdkZWZhdWx0JykgcmV0dXJuIGZhbHNlO1xuICAgIC8vIE90aGVyd2lzZSBjaGVjayB0aGF0IHNvbWUgZGVjbGFyYXRpb24gaXMgZnJvbSB0aGUgbG9jYWwgbW9kdWxlLlxuICAgIHJldHVybiBlLmRlY2xhcmF0aW9ucy5zb21lKGQgPT4gZC5nZXRTb3VyY2VGaWxlKCkgPT09IG9yaWdTb3VyY2VGaWxlKTtcbiAgfSk7XG4gIGlmICghbG9jYWxFeHBvcnRzLmxlbmd0aCkgcmV0dXJuIGR0c0ZpbGVDb250ZW50O1xuXG4gIC8vIFR5cGVTY3JpcHQgMi44IGFuZCBUeXBlU2NyaXB0IDIuOSBkaWZmZXIgb24gdGhlIG9yZGVyIGluIHdoaWNoIHRoZVxuICAvLyBtb2R1bGUgc3ltYm9scyBjb21lIG91dCwgc28gc29ydCBoZXJlIHRvIG1ha2UgdGhlIHRlc3RzIHN0YWJsZS5cbiAgbG9jYWxFeHBvcnRzLnNvcnQoKGEsIGIpID0+IHN0cmluZ0NvbXBhcmUoYS5uYW1lLCBiLm5hbWUpKTtcblxuICBjb25zdCBtb2R1bGVOYW1lID0gaG9zdC5wYXRoVG9Nb2R1bGVOYW1lKCcnLCBzb3VyY2VGaWxlLmZpbGVOYW1lKTtcbiAgY29uc3QgY2x1dHpNb2R1bGVOYW1lID0gbW9kdWxlTmFtZS5yZXBsYWNlKC9cXC4vZywgJyQnKTtcblxuICAvLyBDbHV0eiBtaWdodCByZWZlciB0byB0aGUgbmFtZSBpbiB0d28gZGlmZmVyZW50IGZvcm1zIChzdGVtbWluZyBmcm9tIGdvb2cucHJvdmlkZSBhbmRcbiAgLy8gZ29vZy5tb2R1bGUgcmVzcGVjdGl2ZWx5KS5cbiAgLy8gMSkgZ2xvYmFsIGluIGNsdXR6OiAgIOCyoF/gsqAuY2x1dHoubW9kdWxlJGNvbnRlbnRzJHBhdGgkdG8kbW9kdWxlX1N5bWJvbC4uLlxuICAvLyAyKSBsb2NhbCBpbiBhIG1vZHVsZTog4LKgX+CyoC5jbHV0ei5tb2R1bGUkZXhwb3J0cyRwYXRoJHRvJG1vZHVsZS5TeW1ib2wgLi5cbiAgLy8gU2VlIGV4YW1wbGVzIGF0OlxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jbHV0ei90cmVlL21hc3Rlci9zcmMvdGVzdC9qYXZhL2NvbS9nb29nbGUvamF2YXNjcmlwdC9jbHV0elxuXG4gIC8vIENhc2UgKDEpIGZyb20gYWJvdmUuXG4gIGxldCBnbG9iYWxTeW1ib2xzID0gJyc7XG4gIC8vIENhc2UgKDIpIGZyb20gYWJvdmUuXG4gIGxldCBuZXN0ZWRTeW1ib2xzID0gJyc7XG4gIGZvciAoY29uc3Qgc3ltYm9sIG9mIGxvY2FsRXhwb3J0cykge1xuICAgIGdsb2JhbFN5bWJvbHMgKz1cbiAgICAgICAgYFxcdFxcdGV4cG9ydCB7JHtzeW1ib2wubmFtZX0gYXMgbW9kdWxlJGNvbnRlbnRzJCR7Y2x1dHpNb2R1bGVOYW1lfV8ke3N5bWJvbC5uYW1lfX1cXG5gO1xuICAgIG5lc3RlZFN5bWJvbHMgKz1cbiAgICAgICAgYFxcdFxcdGV4cG9ydCB7bW9kdWxlJGNvbnRlbnRzJCR7Y2x1dHpNb2R1bGVOYW1lfV8ke3N5bWJvbC5uYW1lfSBhcyAke3N5bWJvbC5uYW1lfX1cXG5gO1xuICB9XG5cbiAgZHRzRmlsZUNvbnRlbnQgKz0gJ2RlY2xhcmUgZ2xvYmFsIHtcXG4nO1xuICBkdHNGaWxlQ29udGVudCArPSBgXFx0bmFtZXNwYWNlIOCyoF/gsqAuY2x1dHoge1xcbmA7XG4gIGR0c0ZpbGVDb250ZW50ICs9IGdsb2JhbFN5bWJvbHM7XG4gIGR0c0ZpbGVDb250ZW50ICs9IGBcXHR9XFxuYDtcbiAgZHRzRmlsZUNvbnRlbnQgKz0gYFxcdG5hbWVzcGFjZSDgsqBf4LKgLmNsdXR6Lm1vZHVsZSRleHBvcnRzJCR7Y2x1dHpNb2R1bGVOYW1lfSB7XFxuYDtcbiAgZHRzRmlsZUNvbnRlbnQgKz0gbmVzdGVkU3ltYm9scztcbiAgZHRzRmlsZUNvbnRlbnQgKz0gYFxcdH1cXG5gO1xuICBkdHNGaWxlQ29udGVudCArPSAnfVxcbic7XG5cbiAgcmV0dXJuIGR0c0ZpbGVDb250ZW50O1xufVxuXG5mdW5jdGlvbiBza2lwVHJhbnNmb3JtRm9yU291cmNlRmlsZUlmTmVlZGVkKFxuICAgIGhvc3Q6IFRzaWNrbGVIb3N0LFxuICAgIGRlbGVnYXRlRmFjdG9yeTogdHMuVHJhbnNmb3JtZXJGYWN0b3J5PHRzLlNvdXJjZUZpbGU+KTogdHMuVHJhbnNmb3JtZXJGYWN0b3J5PHRzLlNvdXJjZUZpbGU+IHtcbiAgcmV0dXJuIChjb250ZXh0OiB0cy5UcmFuc2Zvcm1hdGlvbkNvbnRleHQpID0+IHtcbiAgICBjb25zdCBkZWxlZ2F0ZSA9IGRlbGVnYXRlRmFjdG9yeShjb250ZXh0KTtcbiAgICByZXR1cm4gKHNvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGUpID0+IHtcbiAgICAgIGlmIChob3N0LnNob3VsZFNraXBUc2lja2xlUHJvY2Vzc2luZyhzb3VyY2VGaWxlLmZpbGVOYW1lKSkge1xuICAgICAgICByZXR1cm4gc291cmNlRmlsZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBkZWxlZ2F0ZShzb3VyY2VGaWxlKTtcbiAgICB9O1xuICB9O1xufVxuIl19