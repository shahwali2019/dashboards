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
        define("tsickle/src/module_type_translator", ["require", "exports", "typescript", "tsickle/src/googmodule", "tsickle/src/jsdoc", "tsickle/src/transformer_util", "tsickle/src/type_translator"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @fileoverview module_type_translator builds on top of type_translator, adding functionality to
     * translate types within the scope of a single module. The main entry point is
     * ModuleTypeTranslator.
     */
    var ts = require("typescript");
    var googmodule = require("tsickle/src/googmodule");
    var jsdoc = require("tsickle/src/jsdoc");
    var transformer_util_1 = require("tsickle/src/transformer_util");
    var typeTranslator = require("tsickle/src/type_translator");
    /**
     * We are in the process of transitioning tsickle from using goog.forwardDeclare()
     * into using goog.requireType().  Flipping this flag makes it easy for us to toggle
     * between the two.
     */
    var USE_REQUIRE_TYPE = false;
    /**
     * MutableJSDoc encapsulates a (potential) JSDoc comment on a specific node, and allows code to
     * modify (including delete) it.
     */
    var MutableJSDoc = /** @class */ (function () {
        function MutableJSDoc(node, sourceComment, tags) {
            this.node = node;
            this.sourceComment = sourceComment;
            this.tags = tags;
        }
        MutableJSDoc.prototype.updateComment = function (escapeExtraTags) {
            var text = jsdoc.toStringWithoutStartEnd(this.tags, escapeExtraTags);
            if (this.sourceComment) {
                if (!text) {
                    // Delete the (now empty) comment.
                    var comments_1 = ts.getSyntheticLeadingComments(this.node);
                    var idx = comments_1.indexOf(this.sourceComment);
                    comments_1.splice(idx, 1);
                    this.sourceComment = null;
                    return;
                }
                this.sourceComment.text = text;
                return;
            }
            // Don't add an empty comment.
            if (!text)
                return;
            var comment = {
                kind: ts.SyntaxKind.MultiLineCommentTrivia,
                text: text,
                hasTrailingNewLine: true,
                pos: -1,
                end: -1,
            };
            var comments = ts.getSyntheticLeadingComments(this.node) || [];
            comments.push(comment);
            ts.setSyntheticLeadingComments(this.node, comments);
        };
        return MutableJSDoc;
    }());
    exports.MutableJSDoc = MutableJSDoc;
    /** Returns the Closure name of a function parameter, special-casing destructuring. */
    function getParameterName(param, index) {
        switch (param.name.kind) {
            case ts.SyntaxKind.Identifier:
                var name_1 = transformer_util_1.getIdentifierText(param.name);
                // TypeScript allows parameters named "arguments", but Closure
                // disallows this, even in externs.
                if (name_1 === 'arguments')
                    name_1 = 'tsickle_arguments';
                return name_1;
            case ts.SyntaxKind.ArrayBindingPattern:
            case ts.SyntaxKind.ObjectBindingPattern:
                // Closure crashes if you put a binding pattern in the externs.
                // Avoid this by just generating an unused name; the name is
                // ignored anyway.
                return "__" + index;
            default:
                // The above list of kinds is exhaustive.  param.name is 'never' at this point.
                var paramName = param.name;
                throw new Error("unhandled function parameter kind: " + ts.SyntaxKind[paramName.kind]);
        }
    }
    /**
     * ModuleTypeTranslator encapsulates knowledge and helper functions to translate types in the scope
     * of a specific module. This includes managing Closure requireType statements and any symbol
     * aliases in scope for a whole file.
     */
    var ModuleTypeTranslator = /** @class */ (function () {
        function ModuleTypeTranslator(sourceFile, typeChecker, host, diagnostics, isForExterns) {
            this.sourceFile = sourceFile;
            this.typeChecker = typeChecker;
            this.host = host;
            this.diagnostics = diagnostics;
            this.isForExterns = isForExterns;
            /**
             * A mapping of aliases for symbols in the current file, used when emitting types. TypeScript
             * emits imported symbols with unpredictable prefixes. To generate correct type annotations,
             * tsickle creates its own aliases for types, and registers them in this map (see
             * `emitImportDeclaration` and `requireType()` below). The aliases are then used when emitting
             * types.
             */
            this.symbolsToAliasedNames = new Map();
            /**
             * The set of module symbols requireTyped in the local namespace.  This tracks which imported
             * modules we've already added to additionalImports below.
             */
            this.requireTypeModules = new Set();
            /**
             * The list of generated goog.requireType statements for this module. These are inserted into
             * the module's body statements after translation.
             */
            this.additionalImports = [];
        }
        ModuleTypeTranslator.prototype.debugWarn = function (context, messageText) {
            transformer_util_1.reportDebugWarning(this.host, context, messageText);
        };
        ModuleTypeTranslator.prototype.error = function (node, messageText) {
            transformer_util_1.reportDiagnostic(this.diagnostics, node, messageText);
        };
        /**
         * Convert a TypeScript ts.Type into the equivalent Closure type.
         *
         * @param context The ts.Node containing the type reference; used for resolving symbols
         *     in context.
         * @param type The type to translate; if not provided, the Node's type will be used.
         * @param resolveAlias If true, do not emit aliases as their symbol, but rather as the resolved
         *     type underlying the alias. This should be true only when emitting the typedef itself.
         */
        ModuleTypeTranslator.prototype.typeToClosure = function (context, type) {
            if (this.host.untyped) {
                return '?';
            }
            var typeChecker = this.typeChecker;
            if (!type) {
                type = typeChecker.getTypeAtLocation(context);
            }
            return this.newTypeTranslator(context).translate(type);
        };
        ModuleTypeTranslator.prototype.newTypeTranslator = function (context) {
            var _this = this;
            // In externs, there is no local scope, so all types must be relative to the file level scope.
            var translationContext = this.isForExterns ? this.sourceFile : context;
            var translator = new typeTranslator.TypeTranslator(this.host, this.typeChecker, translationContext, this.host.typeBlackListPaths, this.symbolsToAliasedNames, function (sym) { return _this.ensureSymbolDeclared(sym); });
            translator.isForExterns = this.isForExterns;
            translator.warn = function (msg) { return _this.debugWarn(context, msg); };
            return translator;
        };
        ModuleTypeTranslator.prototype.isBlackListed = function (context) {
            var type = this.typeChecker.getTypeAtLocation(context);
            var sym = type.symbol;
            if (!sym)
                return false;
            if (sym.flags & ts.SymbolFlags.Alias) {
                sym = this.typeChecker.getAliasedSymbol(sym);
            }
            return this.newTypeTranslator(context).isBlackListed(sym);
        };
        /**
         * Get the ts.Symbol at a location or throw.
         * The TypeScript API can return undefined when fetching a symbol, but in many contexts we know it
         * won't (e.g. our input is already type-checked).
         */
        ModuleTypeTranslator.prototype.mustGetSymbolAtLocation = function (node) {
            var sym = this.typeChecker.getSymbolAtLocation(node);
            if (!sym)
                throw new Error('no symbol');
            return sym;
        };
        /** Finds an exported (i.e. not global) declaration for the given symbol. */
        ModuleTypeTranslator.prototype.findExportedDeclaration = function (sym) {
            var _this = this;
            // TODO(martinprobst): it's unclear when a symbol wouldn't have a declaration, maybe just for
            // some builtins (e.g. Symbol)?
            if (!sym.declarations || sym.declarations.length === 0)
                return undefined;
            // A symbol declared in this file does not need to be imported.
            if (sym.declarations.some(function (d) { return d.getSourceFile() === _this.sourceFile; }))
                return undefined;
            // Find an exported declaration.
            // Because tsickle runs with the --declaration flag, all types referenced from exported types
            // must be exported, too, so there must either be some declaration that is exported, or the
            // symbol is actually a global declaration (declared in a script file, not a module).
            var decl = sym.declarations.find(function (d) {
                // Check for Export | Default (default being a default export).
                if (!transformer_util_1.hasModifierFlag(d, ts.ModifierFlags.ExportDefault))
                    return false;
                // Exclude symbols declared in `declare global {...}` blocks, they are global and don't need
                // imports.
                var current = d;
                while (current) {
                    if (current.flags & ts.NodeFlags.GlobalAugmentation)
                        return false;
                    current = current.parent;
                }
                return true;
            });
            return decl;
        };
        /**
         * Records that we we want a `const x = goog.requireType...` import of the given `importPath`,
         * which will be inserted when we emit.
         * This also registers aliases for symbols from the module that map to this requireType.
         *
         * @param isExplicitImport True if this comes from an underlying 'import' statement, false
         *     if this reference is needed just because a symbol's type relies on it.
         * @param isDefaultImport True if the import statement is a default import, e.g.
         *     `import Foo from ...;`, which matters for adjusting whether we emit a `.default`.
         */
        ModuleTypeTranslator.prototype.requireType = function (importPath, moduleSymbol, isExplicitImport, isDefaultImport) {
            var _this = this;
            if (isDefaultImport === void 0) { isDefaultImport = false; }
            var e_1, _a;
            if (this.host.untyped)
                return;
            // Already imported? Do not emit a duplicate requireType.
            if (this.requireTypeModules.has(moduleSymbol))
                return;
            if (typeTranslator.isBlacklisted(this.host.typeBlackListPaths, moduleSymbol)) {
                return; // Do not emit goog.requireType for blacklisted paths.
            }
            var nsImport = googmodule.extractGoogNamespaceImport(importPath);
            var requireTypePrefix = "tsickle_forward_declare_" + (this.requireTypeModules.size + 1);
            var moduleNamespace = nsImport !== null ?
                nsImport :
                this.host.pathToModuleName(this.sourceFile.fileName, importPath);
            // In TypeScript, importing a module for use in a type annotation does not cause a runtime load.
            // In Closure Compiler, goog.require'ing a module causes a runtime load, so emitting requires
            // here would cause a change in load order, which is observable (and can lead to errors).
            // Instead, goog.requireType types, which allows using them in type annotations without
            // causing a load.
            //   const requireTypePrefix = goog.requireType(moduleNamespace)
            this.additionalImports.push(ts.createVariableStatement(undefined, ts.createVariableDeclarationList([ts.createVariableDeclaration(requireTypePrefix, undefined, ts.createCall(ts.createPropertyAccess(ts.createIdentifier('goog'), USE_REQUIRE_TYPE ? 'requireType' : 'forwardDeclare'), undefined, [ts.createLiteral(moduleNamespace)]))], ts.NodeFlags.Const)));
            this.requireTypeModules.add(moduleSymbol);
            var exports = this.typeChecker.getExportsOfModule(moduleSymbol).map(function (e) {
                if (e.flags & ts.SymbolFlags.Alias) {
                    e = _this.typeChecker.getAliasedSymbol(e);
                }
                return e;
            });
            if (!USE_REQUIRE_TYPE) {
                // TODO(evmar): delete this block when USE_REQUIRE_TYPE is removed.
                var hasValues = exports.some(function (e) {
                    var isValue = (e.flags & ts.SymbolFlags.Value) !== 0;
                    var isConstEnum = (e.flags & ts.SymbolFlags.ConstEnum) !== 0;
                    // const enums are inlined by TypeScript (if preserveConstEnums=false), so there is never a
                    // value import generated for them. That means for the purpose of force-importing modules,
                    // they do not count as values. If preserveConstEnums=true, this shouldn't hurt.
                    return isValue && !isConstEnum;
                });
                if (isExplicitImport && !hasValues) {
                    // Closure Compiler's toolchain will drop files that are never goog.require'd *before* type
                    // checking (e.g. when using --closure_entry_point or similar tools). This causes errors
                    // complaining about values not matching 'NoResolvedType', or modules not having a certain
                    // member.
                    // To fix, explicitly goog.require() modules that only export types. This should usually not
                    // cause breakages due to load order (as no symbols are accessible from the module - though
                    // contrived code could observe changes in side effects).
                    // This is a heuristic - if the module exports some values, but those are never imported,
                    // the file will still end up not being imported. Hopefully modules that export values are
                    // imported for their value in some place.
                    // goog.require("${moduleNamespace}");
                    var hardRequire = ts.createStatement(ts.createCall(ts.createPropertyAccess(ts.createIdentifier('goog'), 'require'), undefined, [transformer_util_1.createSingleQuoteStringLiteral(moduleNamespace)]));
                    var comment = {
                        kind: ts.SyntaxKind.SingleLineCommentTrivia,
                        text: ' force type-only module to be loaded',
                        hasTrailingNewLine: true,
                        pos: -1,
                        end: -1,
                    };
                    ts.setSyntheticTrailingComments(hardRequire, [comment]);
                    this.additionalImports.push(hardRequire);
                }
            }
            try {
                for (var exports_1 = __values(exports), exports_1_1 = exports_1.next(); !exports_1_1.done; exports_1_1 = exports_1.next()) {
                    var sym = exports_1_1.value;
                    // goog: imports don't actually use the .default property that TS thinks they have.
                    var qualifiedName = nsImport && isDefaultImport ? requireTypePrefix : requireTypePrefix + '.' + sym.name;
                    this.symbolsToAliasedNames.set(sym, qualifiedName);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (exports_1_1 && !exports_1_1.done && (_a = exports_1.return)) _a.call(exports_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        };
        ModuleTypeTranslator.prototype.ensureSymbolDeclared = function (sym) {
            var decl = this.findExportedDeclaration(sym);
            if (!decl)
                return;
            if (this.isForExterns) {
                this.error(decl, "declaration from module used in ambient type: " + sym.name);
                return;
            }
            // Actually import the symbol.
            var sourceFile = decl.getSourceFile();
            if (sourceFile === ts.getOriginalNode(this.sourceFile))
                return;
            var moduleSymbol = this.typeChecker.getSymbolAtLocation(sourceFile);
            // A source file might not have a symbol if it's not a module (no ES6 im/exports).
            if (!moduleSymbol)
                return;
            // TODO(martinprobst): this should possibly use fileNameToModuleId.
            this.requireType(sourceFile.fileName, moduleSymbol, /* isExplicitlyImported? */ false);
        };
        ModuleTypeTranslator.prototype.insertAdditionalImports = function (sourceFile) {
            var insertion = 0;
            // Skip over a leading file comment holder.
            if (sourceFile.statements.length &&
                sourceFile.statements[0].kind === ts.SyntaxKind.NotEmittedStatement) {
                insertion++;
            }
            return ts.updateSourceFileNode(sourceFile, __spread(sourceFile.statements.slice(0, insertion), this.additionalImports, sourceFile.statements.slice(insertion)));
        };
        /**
         * Parses and synthesizes comments on node, and returns the JSDoc from it, if any.
         * @param reportWarnings if true, will report warnings from parsing the JSDoc. Set to false if
         *     this is not the "main" location dealing with a node to avoid duplicated warnings.
         */
        ModuleTypeTranslator.prototype.getJSDoc = function (node, reportWarnings) {
            var _a = __read(this.parseJSDoc(node, reportWarnings), 1), tags = _a[0];
            return tags;
        };
        ModuleTypeTranslator.prototype.getMutableJSDoc = function (node) {
            var _a = __read(this.parseJSDoc(node, /* reportWarnings */ true), 2), tags = _a[0], comment = _a[1];
            return new MutableJSDoc(node, comment, tags);
        };
        ModuleTypeTranslator.prototype.parseJSDoc = function (node, reportWarnings) {
            // synthesizeLeadingComments below changes text locations for node, so extract the location here
            // in case it is needed later to report diagnostics.
            var start = node.getFullStart();
            var length = node.getLeadingTriviaWidth(this.sourceFile);
            var comments = jsdoc.synthesizeLeadingComments(node);
            if (!comments || comments.length === 0)
                return [[], null];
            for (var i = comments.length - 1; i >= 0; i--) {
                var comment = comments[i];
                var parsed = jsdoc.parse(comment);
                if (parsed) {
                    if (reportWarnings && parsed.warnings) {
                        var range = comment.originalRange || { pos: start, end: start + length };
                        transformer_util_1.reportDiagnostic(this.diagnostics, node, parsed.warnings.join('\n'), range, ts.DiagnosticCategory.Warning);
                    }
                    return [parsed.tags, comment];
                }
            }
            return [[], null];
        };
        /**
         * Creates the jsdoc for methods, including overloads.
         * If overloaded, merges the signatures in the list of SignatureDeclarations into a single jsdoc.
         * - Total number of parameters will be the maximum count found across all variants.
         * - Different names at the same parameter index will be joined with "_or_"
         * - Variable args (...type[] in TypeScript) will be output as "...type",
         *    except if found at the same index as another argument.
         * @param fnDecls Pass > 1 declaration for overloads of same name
         * @return The list of parameter names that should be used to emit the actual
         *    function statement; for overloads, name will have been merged.
         */
        ModuleTypeTranslator.prototype.getFunctionTypeJSDoc = function (fnDecls, extraTags) {
            if (extraTags === void 0) { extraTags = []; }
            var e_2, _a, e_3, _b, e_4, _c, e_5, _d, e_6, _e, e_7, _f;
            var typeChecker = this.typeChecker;
            // De-duplicate tags and docs found for the fnDecls.
            var tagsByName = new Map();
            function addTag(tag) {
                var existing = tagsByName.get(tag.tagName);
                tagsByName.set(tag.tagName, existing ? jsdoc.merge([existing, tag]) : tag);
            }
            try {
                for (var extraTags_1 = __values(extraTags), extraTags_1_1 = extraTags_1.next(); !extraTags_1_1.done; extraTags_1_1 = extraTags_1.next()) {
                    var extraTag = extraTags_1_1.value;
                    addTag(extraTag);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (extraTags_1_1 && !extraTags_1_1.done && (_a = extraTags_1.return)) _a.call(extraTags_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
            var lens = fnDecls.map(function (fnDecl) { return fnDecl.parameters.length; });
            var minArgsCount = Math.min.apply(Math, __spread(lens));
            var maxArgsCount = Math.max.apply(Math, __spread(lens));
            var isConstructor = fnDecls.find(function (d) { return d.kind === ts.SyntaxKind.Constructor; }) !== undefined;
            // For each parameter index i, paramTags[i] is an array of parameters
            // that can be found at index i.  E.g.
            //    function foo(x: string)
            //    function foo(y: number, z: string)
            // then paramTags[0] = [info about x, info about y].
            var paramTags = [];
            var returnTags = [];
            var typeParameterNames = new Set();
            var thisReturnType = null;
            try {
                for (var fnDecls_1 = __values(fnDecls), fnDecls_1_1 = fnDecls_1.next(); !fnDecls_1_1.done; fnDecls_1_1 = fnDecls_1.next()) {
                    var fnDecl = fnDecls_1_1.value;
                    // Construct the JSDoc comment by reading the existing JSDoc, if
                    // any, and merging it with the known types of the function
                    // parameters and return type.
                    var tags = this.getJSDoc(fnDecl, /* reportWarnings */ false);
                    try {
                        // Copy all the tags other than @param/@return into the new
                        // JSDoc without any change; @param/@return are handled specially.
                        // TODO: there may be problems if an annotation doesn't apply to all overloads;
                        // is it worth checking for this and erroring?
                        for (var tags_1 = __values(tags), tags_1_1 = tags_1.next(); !tags_1_1.done; tags_1_1 = tags_1.next()) {
                            var tag = tags_1_1.value;
                            if (tag.tagName === 'param' || tag.tagName === 'return')
                                continue;
                            addTag(tag);
                        }
                    }
                    catch (e_4_1) { e_4 = { error: e_4_1 }; }
                    finally {
                        try {
                            if (tags_1_1 && !tags_1_1.done && (_c = tags_1.return)) _c.call(tags_1);
                        }
                        finally { if (e_4) throw e_4.error; }
                    }
                    var flags = ts.getCombinedModifierFlags(fnDecl);
                    // Add @abstract on "abstract" declarations.
                    if (flags & ts.ModifierFlags.Abstract) {
                        addTag({ tagName: 'abstract' });
                    }
                    // Add @protected/@private if present.
                    if (flags & ts.ModifierFlags.Protected) {
                        addTag({ tagName: 'protected' });
                    }
                    else if (flags & ts.ModifierFlags.Private) {
                        addTag({ tagName: 'private' });
                    }
                    // Add any @template tags.
                    // Multiple declarations with the same template variable names should work:
                    // the declarations get turned into union types, and Closure Compiler will need
                    // to find a union where all type arguments are satisfied.
                    if (fnDecl.typeParameters) {
                        try {
                            for (var _g = __values(fnDecl.typeParameters), _h = _g.next(); !_h.done; _h = _g.next()) {
                                var tp = _h.value;
                                typeParameterNames.add(transformer_util_1.getIdentifierText(tp.name));
                            }
                        }
                        catch (e_5_1) { e_5 = { error: e_5_1 }; }
                        finally {
                            try {
                                if (_h && !_h.done && (_d = _g.return)) _d.call(_g);
                            }
                            finally { if (e_5) throw e_5.error; }
                        }
                    }
                    // Merge the parameters into a single list of merged names and list of types
                    var sig = typeChecker.getSignatureFromDeclaration(fnDecl);
                    if (!sig || !sig.declaration)
                        throw new Error("invalid signature " + fnDecl.name);
                    if (sig.declaration.kind === ts.SyntaxKind.JSDocSignature) {
                        throw new Error("JSDoc signature " + fnDecl.name);
                    }
                    for (var i = 0; i < sig.declaration.parameters.length; i++) {
                        var paramNode = sig.declaration.parameters[i];
                        var name_2 = getParameterName(paramNode, i);
                        var isThisParam = name_2 === 'this';
                        var newTag = {
                            tagName: isThisParam ? 'this' : 'param',
                            optional: paramNode.initializer !== undefined || paramNode.questionToken !== undefined,
                            parameterName: isThisParam ? undefined : name_2,
                        };
                        var type = typeChecker.getTypeAtLocation(paramNode);
                        if (paramNode.dotDotDotToken !== undefined) {
                            newTag.restParam = true;
                            // In TypeScript you write "...x: number[]", but in Closure
                            // you don't write the array: "@param {...number} x".  Unwrap
                            // the Array<> wrapper.
                            if ((type.flags & ts.TypeFlags.Object) === 0 && type.flags & ts.TypeFlags.TypeParameter) {
                                // function f<T extends string[]>(...ts: T) has the Array type on the type parameter
                                // constraint, not on the parameter itself. Resolve it.
                                var baseConstraint = typeChecker.getBaseConstraintOfType(type);
                                if (baseConstraint)
                                    type = baseConstraint;
                            }
                            if (type.flags & ts.TypeFlags.Object &&
                                type.objectFlags & ts.ObjectFlags.Reference) {
                                var typeRef = type;
                                if (!typeRef.typeArguments) {
                                    throw new Error('rest parameter does not resolve to a reference type');
                                }
                                type = typeRef.typeArguments[0];
                            }
                        }
                        newTag.type = this.typeToClosure(fnDecl, type);
                        try {
                            for (var tags_2 = __values(tags), tags_2_1 = tags_2.next(); !tags_2_1.done; tags_2_1 = tags_2.next()) {
                                var _j = tags_2_1.value, tagName = _j.tagName, parameterName = _j.parameterName, text = _j.text;
                                if (tagName === 'param' && parameterName === newTag.parameterName) {
                                    newTag.text = text;
                                    break;
                                }
                            }
                        }
                        catch (e_6_1) { e_6 = { error: e_6_1 }; }
                        finally {
                            try {
                                if (tags_2_1 && !tags_2_1.done && (_e = tags_2.return)) _e.call(tags_2);
                            }
                            finally { if (e_6) throw e_6.error; }
                        }
                        if (!paramTags[i])
                            paramTags.push([]);
                        paramTags[i].push(newTag);
                    }
                    // Return type.
                    if (!isConstructor) {
                        var returnTag = {
                            tagName: 'return',
                        };
                        var retType = typeChecker.getReturnTypeOfSignature(sig);
                        // tslint:disable-next-line:no-any accessing TS internal field.
                        if (retType.isThisType) {
                            // foo(): this
                            thisReturnType = retType;
                            addTag({ tagName: 'template', text: 'THIS' });
                            addTag({ tagName: 'this', type: 'THIS' });
                            returnTag.type = 'THIS';
                        }
                        else {
                            returnTag.type = this.typeToClosure(fnDecl, retType);
                            try {
                                for (var tags_3 = __values(tags), tags_3_1 = tags_3.next(); !tags_3_1.done; tags_3_1 = tags_3.next()) {
                                    var _k = tags_3_1.value, tagName = _k.tagName, text = _k.text;
                                    if (tagName === 'return') {
                                        returnTag.text = text;
                                        break;
                                    }
                                }
                            }
                            catch (e_7_1) { e_7 = { error: e_7_1 }; }
                            finally {
                                try {
                                    if (tags_3_1 && !tags_3_1.done && (_f = tags_3.return)) _f.call(tags_3);
                                }
                                finally { if (e_7) throw e_7.error; }
                            }
                        }
                        returnTags.push(returnTag);
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (fnDecls_1_1 && !fnDecls_1_1.done && (_b = fnDecls_1.return)) _b.call(fnDecls_1);
                }
                finally { if (e_3) throw e_3.error; }
            }
            if (typeParameterNames.size > 0) {
                addTag({ tagName: 'template', text: Array.from(typeParameterNames.values()).join(', ') });
            }
            var newDoc = Array.from(tagsByName.values());
            // Merge the JSDoc tags for each overloaded parameter.
            // Ensure each parameter has a unique name; the merging process can otherwise
            // accidentally generate the same parameter name twice.
            var paramNames = new Set();
            var foundOptional = false;
            for (var i = 0; i < maxArgsCount; i++) {
                var paramTag = jsdoc.merge(paramTags[i]);
                if (paramNames.has(paramTag.parameterName)) {
                    paramTag.parameterName += i.toString();
                }
                paramNames.add(paramTag.parameterName);
                // If the tag is optional, mark parameters following optional as optional,
                // even if they are not, since Closure restricts this, see
                // https://github.com/google/closure-compiler/issues/2314
                if (!paramTag.restParam && (paramTag.optional || foundOptional || i >= minArgsCount)) {
                    foundOptional = true;
                    paramTag.optional = true;
                }
                newDoc.push(paramTag);
                if (paramTag.restParam) {
                    // Cannot have any parameters after a rest param.
                    // Just dump the remaining parameters.
                    break;
                }
            }
            // Merge the JSDoc tags for each overloaded return.
            if (!isConstructor) {
                newDoc.push(jsdoc.merge(returnTags));
            }
            return {
                tags: newDoc,
                parameterNames: newDoc.filter(function (t) { return t.tagName === 'param'; }).map(function (t) { return t.parameterName; }),
                thisReturnType: thisReturnType,
            };
        };
        return ModuleTypeTranslator;
    }());
    exports.ModuleTypeTranslator = ModuleTypeTranslator;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlX3R5cGVfdHJhbnNsYXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVfdHlwZV90cmFuc2xhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBRUg7Ozs7T0FJRztJQUVILCtCQUFpQztJQUdqQyxtREFBMkM7SUFDM0MseUNBQWlDO0lBQ2pDLGlFQUE0STtJQUM1SSw0REFBb0Q7SUFFcEQ7Ozs7T0FJRztJQUNILElBQU0sZ0JBQWdCLEdBQUcsS0FBSyxDQUFDO0lBRS9COzs7T0FHRztJQUNIO1FBQ0Usc0JBQ1ksSUFBYSxFQUFVLGFBQXlDLEVBQ2pFLElBQWlCO1lBRGhCLFNBQUksR0FBSixJQUFJLENBQVM7WUFBVSxrQkFBYSxHQUFiLGFBQWEsQ0FBNEI7WUFDakUsU0FBSSxHQUFKLElBQUksQ0FBYTtRQUFHLENBQUM7UUFFaEMsb0NBQWEsR0FBYixVQUFjLGVBQTZCO1lBQ3pDLElBQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLGVBQWUsQ0FBQyxDQUFDO1lBQ3ZFLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtnQkFDdEIsSUFBSSxDQUFDLElBQUksRUFBRTtvQkFDVCxrQ0FBa0M7b0JBQ2xDLElBQU0sVUFBUSxHQUFHLEVBQUUsQ0FBQywyQkFBMkIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFFLENBQUM7b0JBQzVELElBQU0sR0FBRyxHQUFHLFVBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO29CQUNqRCxVQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDeEIsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7b0JBQzFCLE9BQU87aUJBQ1I7Z0JBQ0QsSUFBSSxD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QyxDQUFDLGFBQWMsRUFBaEIsQ0FBZ0IsQ0FBQztnQkFDcEYsY0FBYyxnQkFBQTthQUNmLENBQUM7UUFDSixDQUFDO1FBQ0gsMkJBQUM7SUFBRCxDQUFDLEFBN2RELElBNmRDO0lBN2RZLG9EQUFvQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IG1vZHVsZV90eXBlX3RyYW5zbGF0b3IgYnVpbGRzIG9uIHRvcCBvZiB0eXBlX3RyYW5zbGF0b3IsIGFkZGluZyBmdW5jdGlvbmFsaXR5IHRvXG4gKiB0cmFuc2xhdGUgdHlwZXMgd2l0aGluIHRoZSBzY29wZSBvZiBhIHNpbmdsZSBtb2R1bGUuIFRoZSBtYWluIGVudHJ5IHBvaW50IGlzXG4gKiBNb2R1bGVUeXBlVHJhbnNsYXRvci5cbiAqL1xuXG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcblxuaW1wb3J0IHtBbm5vdGF0b3JIb3N0fSBmcm9tICcuL2Fubm90YXRvcl9ob3N0JztcbmltcG9ydCAqIGFzIGdvb2dtb2R1bGUgZnJvbSAnLi9nb29nbW9kdWxlJztcbmltcG9ydCAqIGFzIGpzZG9jIGZyb20gJy4vanNkb2MnO1xuaW1wb3J0IHtjcmVhdGVTaW5nbGVRdW90ZVN0cmluZ0xpdGVyYWwsIGdldElkZW50aWZpZXJUZXh0LCBoYXNNb2RpZmllckZsYWcsIHJlcG9ydERlYnVnV2FybmluZywgcmVwb3J0RGlhZ25vc3RpY30gZnJvbSAnLi90cmFuc2Zvcm1lcl91dGlsJztcbmltcG9ydCAqIGFzIHR5cGVUcmFuc2xhdG9yIGZyb20gJy4vdHlwZV90cmFuc2xhdG9yJztcblxuLyoqXG4gKiBXZSBhcmUgaW4gdGhlIHByb2Nlc3Mgb2YgdHJhbnNpdGlvbmluZyB0c2lja2xlIGZyb20gdXNpbmcgZ29vZy5mb3J3YXJkRGVjbGFyZSgpXG4gKiBpbnRvIHVzaW5nIGdvb2cucmVxdWlyZVR5cGUoKS4gIEZsaXBwaW5nIHRoaXMgZmxhZyBtYWtlcyBpdCBlYXN5IGZvciB1cyB0byB0b2dnbGVcbiAqIGJldHdlZW4gdGhlIHR3by5cbiAqL1xuY29uc3QgVVNFX1JFUVVJUkVfVFlQRSA9IGZhbHNlO1xuXG4vKipcbiAqIE11dGFibGVKU0RvYyBlbmNhcHN1bGF0ZXMgYSAocG90ZW50aWFsKSBKU0RvYyBjb21tZW50IG9uIGEgc3BlY2lmaWMgbm9kZSwgYW5kIGFsbG93cyBjb2RlIHRvXG4gKiBtb2RpZnkgKGluY2x1ZGluZyBkZWxldGUpIGl0LlxuICovXG5leHBvcnQgY2xhc3MgTXV0YWJsZUpTRG9jIHtcbiAgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIG5vZGU6IHRzLk5vZGUsIHByaXZhdGUgc291cmNlQ29tbWVudDogdHMuU3ludGhlc2l6ZWRDb21tZW50fG51bGwsXG4gICAgICBwdWJsaWMgdGFnczoganNkb2MuVGFnW10pIHt9XG5cbiAgdXBkYXRlQ29tbWVudChlc2NhcGVFeHRyYVRhZ3M/OiBTZXQ8c3RyaW5nPikge1xuICAgIGNvbnN0IHRleHQgPSBqc2RvYy50b1N0cmluZ1dpdGhvdXRTdGFydEVuZCh0aGlzLnRhZ3MsIGVzY2FwZUV4dHJhVGFncyk7XG4gICAgaWYgKHRoaXMuc291cmNlQ29tbWVudCkge1xuICAgICAgaWYgKCF0ZXh0KSB7XG4gICAgICAgIC8vIERlbGV0ZSB0aGUgKG5vdyBlbXB0eSkgY29tbWVudC5cbiAgICAgICAgY29uc3QgY29tbWVudHMgPSB0cy5nZXRTeW50aGV0aWNMZWFkaW5nQ29tbWVudHModGhpcy5ub2RlKSE7XG4gICAgICAgIGNvbnN0IGlkeCA9IGNvbW1lbnRzLmluZGV4T2YodGhpcy5zb3VyY2VDb21tZW50KTtcbiAgICAgICAgY29tbWVudHMuc3BsaWNlKGlkeCwgMSk7XG4gICAgICAgIHRoaXMuc291cmNlQ29tbWVudCA9IG51bGw7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHRoaXMuc291cmNlQ29tbWVudC50ZXh0ID0gdGV4dDtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBEb24ndCBhZGQgYW4gZW1wdHkgY29tbWVudC5cbiAgICBpZiAoIXRleHQpIHJldHVybjtcblxuICAgIGNvbnN0IGNvbW1lbnQ6IHRzLlN5bnRoZXNpemVkQ29tbWVudCA9IHtcbiAgICAgIGtpbmQ6IHRzLlN5bnRheEtpbmQuTXVsdGlMaW5lQ29tbWVudFRyaXZpYSxcbiAgICAgIHRleHQsXG4gICAgICBoYXNUcmFpbGluZ05ld0xpbmU6IHRydWUsXG4gICAgICBwb3M6IC0xLFxuICAgICAgZW5kOiAtMSxcbiAgICB9O1xuICAgIGNvbnN0IGNvbW1lbnRzID0gdHMuZ2V0U3ludGhldGljTGVhZGluZ0NvbW1lbnRzKHRoaXMubm9kZSkgfHwgW107XG4gICAgY29tbWVudHMucHVzaChjb21tZW50KTtcbiAgICB0cy5zZXRTeW50aGV0aWNMZWFkaW5nQ29tbWVudHModGhpcy5ub2RlLCBjb21tZW50cyk7XG4gIH1cbn1cblxuLyoqIFJldHVybnMgdGhlIENsb3N1cmUgbmFtZSBvZiBhIGZ1bmN0aW9uIHBhcmFtZXRlciwgc3BlY2lhbC1jYXNpbmcgZGVzdHJ1Y3R1cmluZy4gKi9cbmZ1bmN0aW9uIGdldFBhcmFtZXRlck5hbWUocGFyYW06IHRzLlBhcmFtZXRlckRlY2xhcmF0aW9uLCBpbmRleDogbnVtYmVyKTogc3RyaW5nIHtcbiAgc3dpdGNoIChwYXJhbS5uYW1lLmtpbmQpIHtcbiAgICBjYXNlIHRzLlN5bnRheEtpbmQuSWRlbnRpZmllcjpcbiAgICAgIGxldCBuYW1lID0gZ2V0SWRlbnRpZmllclRleHQocGFyYW0ubmFtZSBhcyB0cy5JZGVudGlmaWVyKTtcbiAgICAgIC8vIFR5cGVTY3JpcHQgYWxsb3dzIHBhcmFtZXRlcnMgbmFtZWQgXCJhcmd1bWVudHNcIiwgYnV0IENsb3N1cmVcbiAgICAgIC8vIGRpc2FsbG93cyB0aGlzLCBldmVuIGluIGV4dGVybnMuXG4gICAgICBpZiAobmFtZSA9PT0gJ2FyZ3VtZW50cycpIG5hbWUgPSAndHNpY2tsZV9hcmd1bWVudHMnO1xuICAgICAgcmV0dXJuIG5hbWU7XG4gICAgY2FzZSB0cy5TeW50YXhLaW5kLkFycmF5QmluZGluZ1BhdHRlcm46XG4gICAgY2FzZSB0cy5TeW50YXhLaW5kLk9iamVjdEJpbmRpbmdQYXR0ZXJuOlxuICAgICAgLy8gQ2xvc3VyZSBjcmFzaGVzIGlmIHlvdSBwdXQgYSBiaW5kaW5nIHBhdHRlcm4gaW4gdGhlIGV4dGVybnMuXG4gICAgICAvLyBBdm9pZCB0aGlzIGJ5IGp1c3QgZ2VuZXJhdGluZyBhbiB1bnVzZWQgbmFtZTsgdGhlIG5hbWUgaXNcbiAgICAgIC8vIGlnbm9yZWQgYW55d2F5LlxuICAgICAgcmV0dXJuIGBfXyR7aW5kZXh9YDtcbiAgICBkZWZhdWx0OlxuICAgICAgLy8gVGhlIGFib3ZlIGxpc3Qgb2Yga2luZHMgaXMgZXhoYXVzdGl2ZS4gIHBhcmFtLm5hbWUgaXMgJ25ldmVyJyBhdCB0aGlzIHBvaW50LlxuICAgICAgY29uc3QgcGFyYW1OYW1lID0gcGFyYW0ubmFtZSBhcyB0cy5Ob2RlO1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGB1bmhhbmRsZWQgZnVuY3Rpb24gcGFyYW1ldGVyIGtpbmQ6ICR7dHMuU3ludGF4S2luZFtwYXJhbU5hbWUua2luZF19YCk7XG4gIH1cbn1cblxuLyoqXG4gKiBNb2R1bGVUeXBlVHJhbnNsYXRvciBlbmNhcHN1bGF0ZXMga25vd2xlZGdlIGFuZCBoZWxwZXIgZnVuY3Rpb25zIHRvIHRyYW5zbGF0ZSB0eXBlcyBpbiB0aGUgc2NvcGVcbiAqIG9mIGEgc3BlY2lmaWMgbW9kdWxlLiBUaGlzIGluY2x1ZGVzIG1hbmFnaW5nIENsb3N1cmUgcmVxdWlyZVR5cGUgc3RhdGVtZW50cyBhbmQgYW55IHN5bWJvbFxuICogYWxpYXNlcyBpbiBzY29wZSBmb3IgYSB3aG9sZSBmaWxlLlxuICovXG5leHBvcnQgY2xhc3MgTW9kdWxlVHlwZVRyYW5zbGF0b3Ige1xuICAvKipcbiAgICogQSBtYXBwaW5nIG9mIGFsaWFzZXMgZm9yIHN5bWJvbHMgaW4gdGhlIGN1cnJlbnQgZmlsZSwgdXNlZCB3aGVuIGVtaXR0aW5nIHR5cGVzLiBUeXBlU2NyaXB0XG4gICAqIGVtaXRzIGltcG9ydGVkIHN5bWJvbHMgd2l0aCB1bnByZWRpY3RhYmxlIHByZWZpeGVzLiBUbyBnZW5lcmF0ZSBjb3JyZWN0IHR5cGUgYW5ub3RhdGlvbnMsXG4gICAqIHRzaWNrbGUgY3JlYXRlcyBpdHMgb3duIGFsaWFzZXMgZm9yIHR5cGVzLCBhbmQgcmVnaXN0ZXJzIHRoZW0gaW4gdGhpcyBtYXAgKHNlZVxuICAgKiBgZW1pdEltcG9ydERlY2xhcmF0aW9uYCBhbmQgYHJlcXVpcmVUeXBlKClgIGJlbG93KS4gVGhlIGFsaWFzZXMgYXJlIHRoZW4gdXNlZCB3aGVuIGVtaXR0aW5nXG4gICAqIHR5cGVzLlxuICAgKi9cbiAgc3ltYm9sc1RvQWxpYXNlZE5hbWVzID0gbmV3IE1hcDx0cy5TeW1ib2wsIHN0cmluZz4oKTtcblxuICAvKipcbiAgICogVGhlIHNldCBvZiBtb2R1bGUgc3ltYm9scyByZXF1aXJlVHlwZWQgaW4gdGhlIGxvY2FsIG5hbWVzcGFjZS4gIFRoaXMgdHJhY2tzIHdoaWNoIGltcG9ydGVkXG4gICAqIG1vZHVsZXMgd2UndmUgYWxyZWFkeSBhZGRlZCB0byBhZGRpdGlvbmFsSW1wb3J0cyBiZWxvdy5cbiAgICovXG4gIHByaXZhdGUgcmVxdWlyZVR5cGVNb2R1bGVzID0gbmV3IFNldDx0cy5TeW1ib2w+KCk7XG5cbiAgLyoqXG4gICAqIFRoZSBsaXN0IG9mIGdlbmVyYXRlZCBnb29nLnJlcXVpcmVUeXBlIHN0YXRlbWVudHMgZm9yIHRoaXMgbW9kdWxlLiBUaGVzZSBhcmUgaW5zZXJ0ZWQgaW50b1xuICAgKiB0aGUgbW9kdWxlJ3MgYm9keSBzdGF0ZW1lbnRzIGFmdGVyIHRyYW5zbGF0aW9uLlxuICAgKi9cbiAgcHJpdmF0ZSBhZGRpdGlvbmFsSW1wb3J0czogdHMuU3RhdGVtZW50W10gPSBbXTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIHB1YmxpYyBzb3VyY2VGaWxlOiB0cy5Tb3VyY2VGaWxlLFxuICAgICAgcHVibGljIHR5cGVDaGVja2VyOiB0cy5UeXBlQ2hlY2tlcixcbiAgICAgIHByaXZhdGUgaG9zdDogQW5ub3RhdG9ySG9zdCxcbiAgICAgIHByaXZhdGUgZGlhZ25vc3RpY3M6IHRzLkRpYWdub3N0aWNbXSxcbiAgICAgIHByaXZhdGUgaXNGb3JFeHRlcm5zOiBib29sZWFuLFxuICApIHt9XG5cbiAgZGVidWdXYXJuKGNvbnRleHQ6IHRzLk5vZGUsIG1lc3NhZ2VUZXh0OiBzdHJpbmcpIHtcbiAgICByZXBvcnREZWJ1Z1dhcm5pbmcodGhpcy5ob3N0LCBjb250ZXh0LCBtZXNzYWdlVGV4dCk7XG4gIH1cblxuICBlcnJvcihub2RlOiB0cy5Ob2RlLCBtZXNzYWdlVGV4dDogc3RyaW5nKSB7XG4gICAgcmVwb3J0RGlhZ25vc3RpYyh0aGlzLmRpYWdub3N0aWNzLCBub2RlLCBtZXNzYWdlVGV4dCk7XG4gIH1cblxuICAvKipcbiAgICogQ29udmVydCBhIFR5cGVTY3JpcHQgdHMuVHlwZSBpbnRvIHRoZSBlcXVpdmFsZW50IENsb3N1cmUgdHlwZS5cbiAgICpcbiAgICogQHBhcmFtIGNvbnRleHQgVGhlIHRzLk5vZGUgY29udGFpbmluZyB0aGUgdHlwZSByZWZlcmVuY2U7IHVzZWQgZm9yIHJlc29sdmluZyBzeW1ib2xzXG4gICAqICAgICBpbiBjb250ZXh0LlxuICAgKiBAcGFyYW0gdHlwZSBUaGUgdHlwZSB0byB0cmFuc2xhdGU7IGlmIG5vdCBwcm92aWRlZCwgdGhlIE5vZGUncyB0eXBlIHdpbGwgYmUgdXNlZC5cbiAgICogQHBhcmFtIHJlc29sdmVBbGlhcyBJZiB0cnVlLCBkbyBub3QgZW1pdCBhbGlhc2VzIGFzIHRoZWlyIHN5bWJvbCwgYnV0IHJhdGhlciBhcyB0aGUgcmVzb2x2ZWRcbiAgICogICAgIHR5cGUgdW5kZXJseWluZyB0aGUgYWxpYXMuIFRoaXMgc2hvdWxkIGJlIHRydWUgb25seSB3aGVuIGVtaXR0aW5nIHRoZSB0eXBlZGVmIGl0c2VsZi5cbiAgICovXG4gIHR5cGVUb0Nsb3N1cmUoY29udGV4dDogdHMuTm9kZSwgdHlwZT86IHRzLlR5cGUpOiBzdHJpbmcge1xuICAgIGlmICh0aGlzLmhvc3QudW50eXBlZCkge1xuICAgICAgcmV0dXJuICc/JztcbiAgICB9XG5cbiAgICBjb25zdCB0eXBlQ2hlY2tlciA9IHRoaXMudHlwZUNoZWNrZXI7XG4gICAgaWYgKCF0eXBlKSB7XG4gICAgICB0eXBlID0gdHlwZUNoZWNrZXIuZ2V0VHlwZUF0TG9jYXRpb24oY29udGV4dCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLm5ld1R5cGVUcmFuc2xhdG9yKGNvbnRleHQpLnRyYW5zbGF0ZSh0eXBlKTtcbiAgfVxuXG4gIG5ld1R5cGVUcmFuc2xhdG9yKGNvbnRleHQ6IHRzLk5vZGUpIHtcbiAgICAvLyBJbiBleHRlcm5zLCB0aGVyZSBpcyBubyBsb2NhbCBzY29wZSwgc28gYWxsIHR5cGVzIG11c3QgYmUgcmVsYXRpdmUgdG8gdGhlIGZpbGUgbGV2ZWwgc2NvcGUuXG4gICAgY29uc3QgdHJhbnNsYXRpb25Db250ZXh0ID0gdGhpcy5pc0ZvckV4dGVybnMgPyB0aGlzLnNvdXJjZUZpbGUgOiBjb250ZXh0O1xuXG4gICAgY29uc3QgdHJhbnNsYXRvciA9IG5ldyB0eXBlVHJhbnNsYXRvci5UeXBlVHJhbnNsYXRvcihcbiAgICAgICAgdGhpcy5ob3N0LCB0aGlzLnR5cGVDaGVja2VyLCB0cmFuc2xhdGlvbkNvbnRleHQsIHRoaXMuaG9zdC50eXBlQmxhY2tMaXN0UGF0aHMsXG4gICAgICAgIHRoaXMuc3ltYm9sc1RvQWxpYXNlZE5hbWVzLCAoc3ltOiB0cy5TeW1ib2wpID0+IHRoaXMuZW5zdXJlU3ltYm9sRGVjbGFyZWQoc3ltKSk7XG4gICAgdHJhbnNsYXRvci5pc0ZvckV4dGVybnMgPSB0aGlzLmlzRm9yRXh0ZXJucztcbiAgICB0cmFuc2xhdG9yLndhcm4gPSBtc2cgPT4gdGhpcy5kZWJ1Z1dhcm4oY29udGV4dCwgbXNnKTtcbiAgICByZXR1cm4gdHJhbnNsYXRvcjtcbiAgfVxuXG4gIGlzQmxhY2tMaXN0ZWQoY29udGV4dDogdHMuTm9kZSkge1xuICAgIGNvbnN0IHR5cGUgPSB0aGlzLnR5cGVDaGVja2VyLmdldFR5cGVBdExvY2F0aW9uKGNvbnRleHQpO1xuICAgIGxldCBzeW0gPSB0eXBlLnN5bWJvbDtcbiAgICBpZiAoIXN5bSkgcmV0dXJuIGZhbHNlO1xuICAgIGlmIChzeW0uZmxhZ3MgJiB0cy5TeW1ib2xGbGFncy5BbGlhcykge1xuICAgICAgc3ltID0gdGhpcy50eXBlQ2hlY2tlci5nZXRBbGlhc2VkU3ltYm9sKHN5bSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLm5ld1R5cGVUcmFuc2xhdG9yKGNvbnRleHQpLmlzQmxhY2tMaXN0ZWQoc3ltKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIHRzLlN5bWJvbCBhdCBhIGxvY2F0aW9uIG9yIHRocm93LlxuICAgKiBUaGUgVHlwZVNjcmlwdCBBUEkgY2FuIHJldHVybiB1bmRlZmluZWQgd2hlbiBmZXRjaGluZyBhIHN5bWJvbCwgYnV0IGluIG1hbnkgY29udGV4dHMgd2Uga25vdyBpdFxuICAgKiB3b24ndCAoZS5nLiBvdXIgaW5wdXQgaXMgYWxyZWFkeSB0eXBlLWNoZWNrZWQpLlxuICAgKi9cbiAgbXVzdEdldFN5bWJvbEF0TG9jYXRpb24obm9kZTogdHMuTm9kZSk6IHRzLlN5bWJvbCB7XG4gICAgY29uc3Qgc3ltID0gdGhpcy50eXBlQ2hlY2tlci5nZXRTeW1ib2xBdExvY2F0aW9uKG5vZGUpO1xuICAgIGlmICghc3ltKSB0aHJvdyBuZXcgRXJyb3IoJ25vIHN5bWJvbCcpO1xuICAgIHJldHVybiBzeW07XG4gIH1cblxuICAvKiogRmluZHMgYW4gZXhwb3J0ZWQgKGkuZS4gbm90IGdsb2JhbCkgZGVjbGFyYXRpb24gZm9yIHRoZSBnaXZlbiBzeW1ib2wuICovXG4gIHByb3RlY3RlZCBmaW5kRXhwb3J0ZWREZWNsYXJhdGlvbihzeW06IHRzLlN5bWJvbCk6IHRzLkRlY2xhcmF0aW9ufHVuZGVmaW5lZCB7XG4gICAgLy8gVE9ETyhtYXJ0aW5wcm9ic3QpOiBpdCdzIHVuY2xlYXIgd2hlbiBhIHN5bWJvbCB3b3VsZG4ndCBoYXZlIGEgZGVjbGFyYXRpb24sIG1heWJlIGp1c3QgZm9yXG4gICAgLy8gc29tZSBidWlsdGlucyAoZS5nLiBTeW1ib2wpP1xuICAgIGlmICghc3ltLmRlY2xhcmF0aW9ucyB8fCBzeW0uZGVjbGFyYXRpb25zLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAvLyBBIHN5bWJvbCBkZWNsYXJlZCBpbiB0aGlzIGZpbGUgZG9lcyBub3QgbmVlZCB0byBiZSBpbXBvcnRlZC5cbiAgICBpZiAoc3ltLmRlY2xhcmF0aW9ucy5zb21lKGQgPT4gZC5nZXRTb3VyY2VGaWxlKCkgPT09IHRoaXMuc291cmNlRmlsZSkpIHJldHVybiB1bmRlZmluZWQ7XG5cbiAgICAvLyBGaW5kIGFuIGV4cG9ydGVkIGRlY2xhcmF0aW9uLlxuICAgIC8vIEJlY2F1c2UgdHNpY2tsZSBydW5zIHdpdGggdGhlIC0tZGVjbGFyYXRpb24gZmxhZywgYWxsIHR5cGVzIHJlZmVyZW5jZWQgZnJvbSBleHBvcnRlZCB0eXBlc1xuICAgIC8vIG11c3QgYmUgZXhwb3J0ZWQsIHRvbywgc28gdGhlcmUgbXVzdCBlaXRoZXIgYmUgc29tZSBkZWNsYXJhdGlvbiB0aGF0IGlzIGV4cG9ydGVkLCBvciB0aGVcbiAgICAvLyBzeW1ib2wgaXMgYWN0dWFsbHkgYSBnbG9iYWwgZGVjbGFyYXRpb24gKGRlY2xhcmVkIGluIGEgc2NyaXB0IGZpbGUsIG5vdCBhIG1vZHVsZSkuXG4gICAgY29uc3QgZGVjbCA9IHN5bS5kZWNsYXJhdGlvbnMuZmluZChkID0+IHtcbiAgICAgIC8vIENoZWNrIGZvciBFeHBvcnQgfCBEZWZhdWx0IChkZWZhdWx0IGJlaW5nIGEgZGVmYXVsdCBleHBvcnQpLlxuICAgICAgaWYgKCFoYXNNb2RpZmllckZsYWcoZCwgdHMuTW9kaWZpZXJGbGFncy5FeHBvcnREZWZhdWx0KSkgcmV0dXJuIGZhbHNlO1xuICAgICAgLy8gRXhjbHVkZSBzeW1ib2xzIGRlY2xhcmVkIGluIGBkZWNsYXJlIGdsb2JhbCB7Li4ufWAgYmxvY2tzLCB0aGV5IGFyZSBnbG9iYWwgYW5kIGRvbid0IG5lZWRcbiAgICAgIC8vIGltcG9ydHMuXG4gICAgICBsZXQgY3VycmVudDogdHMuTm9kZXx1bmRlZmluZWQgPSBkO1xuICAgICAgd2hpbGUgKGN1cnJlbnQpIHtcbiAgICAgICAgaWYgKGN1cnJlbnQuZmxhZ3MgJiB0cy5Ob2RlRmxhZ3MuR2xvYmFsQXVnbWVudGF0aW9uKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIGN1cnJlbnQgPSBjdXJyZW50LnBhcmVudDtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0pO1xuICAgIHJldHVybiBkZWNsO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlY29yZHMgdGhhdCB3ZSB3ZSB3YW50IGEgYGNvbnN0IHggPSBnb29nLnJlcXVpcmVUeXBlLi4uYCBpbXBvcnQgb2YgdGhlIGdpdmVuIGBpbXBvcnRQYXRoYCxcbiAgICogd2hpY2ggd2lsbCBiZSBpbnNlcnRlZCB3aGVuIHdlIGVtaXQuXG4gICAqIFRoaXMgYWxzbyByZWdpc3RlcnMgYWxpYXNlcyBmb3Igc3ltYm9scyBmcm9tIHRoZSBtb2R1bGUgdGhhdCBtYXAgdG8gdGhpcyByZXF1aXJlVHlwZS5cbiAgICpcbiAgICogQHBhcmFtIGlzRXhwbGljaXRJbXBvcnQgVHJ1ZSBpZiB0aGlzIGNvbWVzIGZyb20gYW4gdW5kZXJseWluZyAnaW1wb3J0JyBzdGF0ZW1lbnQsIGZhbHNlXG4gICAqICAgICBpZiB0aGlzIHJlZmVyZW5jZSBpcyBuZWVkZWQganVzdCBiZWNhdXNlIGEgc3ltYm9sJ3MgdHlwZSByZWxpZXMgb24gaXQuXG4gICAqIEBwYXJhbSBpc0RlZmF1bHRJbXBvcnQgVHJ1ZSBpZiB0aGUgaW1wb3J0IHN0YXRlbWVudCBpcyBhIGRlZmF1bHQgaW1wb3J0LCBlLmcuXG4gICAqICAgICBgaW1wb3J0IEZvbyBmcm9tIC4uLjtgLCB3aGljaCBtYXR0ZXJzIGZvciBhZGp1c3Rpbmcgd2hldGhlciB3ZSBlbWl0IGEgYC5kZWZhdWx0YC5cbiAgICovXG4gIHJlcXVpcmVUeXBlKFxuICAgICAgaW1wb3J0UGF0aDogc3RyaW5nLCBtb2R1bGVTeW1ib2w6IHRzLlN5bWJvbCwgaXNFeHBsaWNpdEltcG9ydDogYm9vbGVhbixcbiAgICAgIGlzRGVmYXVsdEltcG9ydCA9IGZhbHNlKSB7XG4gICAgaWYgKHRoaXMuaG9zdC51bnR5cGVkKSByZXR1cm47XG4gICAgLy8gQWxyZWFkeSBpbXBvcnRlZD8gRG8gbm90IGVtaXQgYSBkdXBsaWNhdGUgcmVxdWlyZVR5cGUuXG4gICAgaWYgKHRoaXMucmVxdWlyZVR5cGVNb2R1bGVzLmhhcyhtb2R1bGVTeW1ib2wpKSByZXR1cm47XG4gICAgaWYgKHR5cGVUcmFuc2xhdG9yLmlzQmxhY2tsaXN0ZWQodGhpcy5ob3N0LnR5cGVCbGFja0xpc3RQYXRocywgbW9kdWxlU3ltYm9sKSkge1xuICAgICAgcmV0dXJuOyAgLy8gRG8gbm90IGVtaXQgZ29vZy5yZXF1aXJlVHlwZSBmb3IgYmxhY2tsaXN0ZWQgcGF0aHMuXG4gICAgfVxuICAgIGNvbnN0IG5zSW1wb3J0ID0gZ29vZ21vZHVsZS5leHRyYWN0R29vZ05hbWVzcGFjZUltcG9ydChpbXBvcnRQYXRoKTtcbiAgICBjb25zdCByZXF1aXJlVHlwZVByZWZpeCA9IGB0c2lja2xlX2ZvcndhcmRfZGVjbGFyZV8ke3RoaXMucmVxdWlyZVR5cGVNb2R1bGVzLnNpemUgKyAxfWA7XG4gICAgY29uc3QgbW9kdWxlTmFtZXNwYWNlID0gbnNJbXBvcnQgIT09IG51bGwgP1xuICAgICAgICBuc0ltcG9ydCA6XG4gICAgICAgIHRoaXMuaG9zdC5wYXRoVG9Nb2R1bGVOYW1lKHRoaXMuc291cmNlRmlsZS5maWxlTmFtZSwgaW1wb3J0UGF0aCk7XG5cbiAgICAvLyBJbiBUeXBlU2NyaXB0LCBpbXBvcnRpbmcgYSBtb2R1bGUgZm9yIHVzZSBpbiBhIHR5cGUgYW5ub3RhdGlvbiBkb2VzIG5vdCBjYXVzZSBhIHJ1bnRpbWUgbG9hZC5cbiAgICAvLyBJbiBDbG9zdXJlIENvbXBpbGVyLCBnb29nLnJlcXVpcmUnaW5nIGEgbW9kdWxlIGNhdXNlcyBhIHJ1bnRpbWUgbG9hZCwgc28gZW1pdHRpbmcgcmVxdWlyZXNcbiAgICAvLyBoZXJlIHdvdWxkIGNhdXNlIGEgY2hhbmdlIGluIGxvYWQgb3JkZXIsIHdoaWNoIGlzIG9ic2VydmFibGUgKGFuZCBjYW4gbGVhZCB0byBlcnJvcnMpLlxuICAgIC8vIEluc3RlYWQsIGdvb2cucmVxdWlyZVR5cGUgdHlwZXMsIHdoaWNoIGFsbG93cyB1c2luZyB0aGVtIGluIHR5cGUgYW5ub3RhdGlvbnMgd2l0aG91dFxuICAgIC8vIGNhdXNpbmcgYSBsb2FkLlxuICAgIC8vICAgY29uc3QgcmVxdWlyZVR5cGVQcmVmaXggPSBnb29nLnJlcXVpcmVUeXBlKG1vZHVsZU5hbWVzcGFjZSlcbiAgICB0aGlzLmFkZGl0aW9uYWxJbXBvcnRzLnB1c2godHMuY3JlYXRlVmFyaWFibGVTdGF0ZW1lbnQoXG4gICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgdHMuY3JlYXRlVmFyaWFibGVEZWNsYXJhdGlvbkxpc3QoXG4gICAgICAgICAgICBbdHMuY3JlYXRlVmFyaWFibGVEZWNsYXJhdGlvbihcbiAgICAgICAgICAgICAgICByZXF1aXJlVHlwZVByZWZpeCwgdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRzLmNyZWF0ZUNhbGwoXG4gICAgICAgICAgICAgICAgICAgIHRzLmNyZWF0ZVByb3BlcnR5QWNjZXNzKFxuICAgICAgICAgICAgICAgICAgICAgICAgdHMuY3JlYXRlSWRlbnRpZmllcignZ29vZycpLFxuICAgICAgICAgICAgICAgICAgICAgICAgVVNFX1JFUVVJUkVfVFlQRSA/ICdyZXF1aXJlVHlwZScgOiAnZm9yd2FyZERlY2xhcmUnKSxcbiAgICAgICAgICAgICAgICAgICAgdW5kZWZpbmVkLCBbdHMuY3JlYXRlTGl0ZXJhbChtb2R1bGVOYW1lc3BhY2UpXSkpXSxcbiAgICAgICAgICAgIHRzLk5vZGVGbGFncy5Db25zdCkpKTtcbiAgICB0aGlzLnJlcXVpcmVUeXBlTW9kdWxlcy5hZGQobW9kdWxlU3ltYm9sKTtcbiAgICBjb25zdCBleHBvcnRzID0gdGhpcy50eXBlQ2hlY2tlci5nZXRFeHBvcnRzT2ZNb2R1bGUobW9kdWxlU3ltYm9sKS5tYXAoZSA9PiB7XG4gICAgICBpZiAoZS5mbGFncyAmIHRzLlN5bWJvbEZsYWdzLkFsaWFzKSB7XG4gICAgICAgIGUgPSB0aGlzLnR5cGVDaGVja2VyLmdldEFsaWFzZWRTeW1ib2woZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZTtcbiAgICB9KTtcbiAgICBpZiAoIVVTRV9SRVFVSVJFX1RZUEUpIHtcbiAgICAgIC8vIFRPRE8oZXZtYXIpOiBkZWxldGUgdGhpcyBibG9jayB3aGVuIFVTRV9SRVFVSVJFX1RZUEUgaXMgcmVtb3ZlZC5cbiAgICAgIGNvbnN0IGhhc1ZhbHVlcyA9IGV4cG9ydHMuc29tZShlID0+IHtcbiAgICAgICAgY29uc3QgaXNWYWx1ZSA9IChlLmZsYWdzICYgdHMuU3ltYm9sRmxhZ3MuVmFsdWUpICE9PSAwO1xuICAgICAgICBjb25zdCBpc0NvbnN0RW51bSA9IChlLmZsYWdzICYgdHMuU3ltYm9sRmxhZ3MuQ29uc3RFbnVtKSAhPT0gMDtcbiAgICAgICAgLy8gY29uc3QgZW51bXMgYXJlIGlubGluZWQgYnkgVHlwZVNjcmlwdCAoaWYgcHJlc2VydmVDb25zdEVudW1zPWZhbHNlKSwgc28gdGhlcmUgaXMgbmV2ZXIgYVxuICAgICAgICAvLyB2YWx1ZSBpbXBvcnQgZ2VuZXJhdGVkIGZvciB0aGVtLiBUaGF0IG1lYW5zIGZvciB0aGUgcHVycG9zZSBvZiBmb3JjZS1pbXBvcnRpbmcgbW9kdWxlcyxcbiAgICAgICAgLy8gdGhleSBkbyBub3QgY291bnQgYXMgdmFsdWVzLiBJZiBwcmVzZXJ2ZUNvbnN0RW51bXM9dHJ1ZSwgdGhpcyBzaG91bGRuJ3QgaHVydC5cbiAgICAgICAgcmV0dXJuIGlzVmFsdWUgJiYgIWlzQ29uc3RFbnVtO1xuICAgICAgfSk7XG4gICAgICBpZiAoaXNFeHBsaWNpdEltcG9ydCAmJiAhaGFzVmFsdWVzKSB7XG4gICAgICAgIC8vIENsb3N1cmUgQ29tcGlsZXIncyB0b29sY2hhaW4gd2lsbCBkcm9wIGZpbGVzIHRoYXQgYXJlIG5ldmVyIGdvb2cucmVxdWlyZSdkICpiZWZvcmUqIHR5cGVcbiAgICAgICAgLy8gY2hlY2tpbmcgKGUuZy4gd2hlbiB1c2luZyAtLWNsb3N1cmVfZW50cnlfcG9pbnQgb3Igc2ltaWxhciB0b29scykuIFRoaXMgY2F1c2VzIGVycm9yc1xuICAgICAgICAvLyBjb21wbGFpbmluZyBhYm91dCB2YWx1ZXMgbm90IG1hdGNoaW5nICdOb1Jlc29sdmVkVHlwZScsIG9yIG1vZHVsZXMgbm90IGhhdmluZyBhIGNlcnRhaW5cbiAgICAgICAgLy8gbWVtYmVyLlxuICAgICAgICAvLyBUbyBmaXgsIGV4cGxpY2l0bHkgZ29vZy5yZXF1aXJlKCkgbW9kdWxlcyB0aGF0IG9ubHkgZXhwb3J0IHR5cGVzLiBUaGlzIHNob3VsZCB1c3VhbGx5IG5vdFxuICAgICAgICAvLyBjYXVzZSBicmVha2FnZXMgZHVlIHRvIGxvYWQgb3JkZXIgKGFzIG5vIHN5bWJvbHMgYXJlIGFjY2Vzc2libGUgZnJvbSB0aGUgbW9kdWxlIC0gdGhvdWdoXG4gICAgICAgIC8vIGNvbnRyaXZlZCBjb2RlIGNvdWxkIG9ic2VydmUgY2hhbmdlcyBpbiBzaWRlIGVmZmVjdHMpLlxuICAgICAgICAvLyBUaGlzIGlzIGEgaGV1cmlzdGljIC0gaWYgdGhlIG1vZHVsZSBleHBvcnRzIHNvbWUgdmFsdWVzLCBidXQgdGhvc2UgYXJlIG5ldmVyIGltcG9ydGVkLFxuICAgICAgICAvLyB0aGUgZmlsZSB3aWxsIHN0aWxsIGVuZCB1cCBub3QgYmVpbmcgaW1wb3J0ZWQuIEhvcGVmdWxseSBtb2R1bGVzIHRoYXQgZXhwb3J0IHZhbHVlcyBhcmVcbiAgICAgICAgLy8gaW1wb3J0ZWQgZm9yIHRoZWlyIHZhbHVlIGluIHNvbWUgcGxhY2UuXG4gICAgICAgIC8vIGdvb2cucmVxdWlyZShcIiR7bW9kdWxlTmFtZXNwYWNlfVwiKTtcbiAgICAgICAgY29uc3QgaGFyZFJlcXVpcmUgPSB0cy5jcmVhdGVTdGF0ZW1lbnQodHMuY3JlYXRlQ2FsbChcbiAgICAgICAgICAgIHRzLmNyZWF0ZVByb3BlcnR5QWNjZXNzKHRzLmNyZWF0ZUlkZW50aWZpZXIoJ2dvb2cnKSwgJ3JlcXVpcmUnKSwgdW5kZWZpbmVkLFxuICAgICAgICAgICAgW2NyZWF0ZVNpbmdsZVF1b3RlU3RyaW5nTGl0ZXJhbChtb2R1bGVOYW1lc3BhY2UpXSkpO1xuICAgICAgICBjb25zdCBjb21tZW50OiB0cy5TeW50aGVzaXplZENvbW1lbnQgPSB7XG4gICAgICAgICAga2luZDogdHMuU3ludGF4S2luZC5TaW5nbGVMaW5lQ29tbWVudFRyaXZpYSxcbiAgICAgICAgICB0ZXh0OiAnIGZvcmNlIHR5cGUtb25seSBtb2R1bGUgdG8gYmUgbG9hZGVkJyxcbiAgICAgICAgICBoYXNUcmFpbGluZ05ld0xpbmU6IHRydWUsXG4gICAgICAgICAgcG9zOiAtMSxcbiAgICAgICAgICBlbmQ6IC0xLFxuICAgICAgICB9O1xuICAgICAgICB0cy5zZXRTeW50aGV0aWNUcmFpbGluZ0NvbW1lbnRzKGhhcmRSZXF1aXJlLCBbY29tbWVudF0pO1xuICAgICAgICB0aGlzLmFkZGl0aW9uYWxJbXBvcnRzLnB1c2goaGFyZFJlcXVpcmUpO1xuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGNvbnN0IHN5bSBvZiBleHBvcnRzKSB7XG4gICAgICAvLyBnb29nOiBpbXBvcnRzIGRvbid0IGFjdHVhbGx5IHVzZSB0aGUgLmRlZmF1bHQgcHJvcGVydHkgdGhhdCBUUyB0aGlua3MgdGhleSBoYXZlLlxuICAgICAgY29uc3QgcXVhbGlmaWVkTmFtZSA9XG4gICAgICAgICAgbnNJbXBvcnQgJiYgaXNEZWZhdWx0SW1wb3J0ID8gcmVxdWlyZVR5cGVQcmVmaXggOiByZXF1aXJlVHlwZVByZWZpeCArICcuJyArIHN5bS5uYW1lO1xuICAgICAgdGhpcy5zeW1ib2xzVG9BbGlhc2VkTmFtZXMuc2V0KHN5bSwgcXVhbGlmaWVkTmFtZSk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIGVuc3VyZVN5bWJvbERlY2xhcmVkKHN5bTogdHMuU3ltYm9sKSB7XG4gICAgY29uc3QgZGVjbCA9IHRoaXMuZmluZEV4cG9ydGVkRGVjbGFyYXRpb24oc3ltKTtcbiAgICBpZiAoIWRlY2wpIHJldHVybjtcbiAgICBpZiAodGhpcy5pc0ZvckV4dGVybnMpIHtcbiAgICAgIHRoaXMuZXJyb3IoZGVjbCwgYGRlY2xhcmF0aW9uIGZyb20gbW9kdWxlIHVzZWQgaW4gYW1iaWVudCB0eXBlOiAke3N5bS5uYW1lfWApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBBY3R1YWxseSBpbXBvcnQgdGhlIHN5bWJvbC5cbiAgICBjb25zdCBzb3VyY2VGaWxlID0gZGVjbC5nZXRTb3VyY2VGaWxlKCk7XG4gICAgaWYgKHNvdXJjZUZpbGUgPT09IHRzLmdldE9yaWdpbmFsTm9kZSh0aGlzLnNvdXJjZUZpbGUpKSByZXR1cm47XG4gICAgY29uc3QgbW9kdWxlU3ltYm9sID0gdGhpcy50eXBlQ2hlY2tlci5nZXRTeW1ib2xBdExvY2F0aW9uKHNvdXJjZUZpbGUpO1xuICAgIC8vIEEgc291cmNlIGZpbGUgbWlnaHQgbm90IGhhdmUgYSBzeW1ib2wgaWYgaXQncyBub3QgYSBtb2R1bGUgKG5vIEVTNiBpbS9leHBvcnRzKS5cbiAgICBpZiAoIW1vZHVsZVN5bWJvbCkgcmV0dXJuO1xuICAgIC8vIFRPRE8obWFydGlucHJvYnN0KTogdGhpcyBzaG91bGQgcG9zc2libHkgdXNlIGZpbGVOYW1lVG9Nb2R1bGVJZC5cbiAgICB0aGlzLnJlcXVpcmVUeXBlKHNvdXJjZUZpbGUuZmlsZU5hbWUsIG1vZHVsZVN5bWJvbCwgLyogaXNFeHBsaWNpdGx5SW1wb3J0ZWQ/ICovIGZhbHNlKTtcbiAgfVxuXG4gIGluc2VydEFkZGl0aW9uYWxJbXBvcnRzKHNvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGUpIHtcbiAgICBsZXQgaW5zZXJ0aW9uID0gMDtcbiAgICAvLyBTa2lwIG92ZXIgYSBsZWFkaW5nIGZpbGUgY29tbWVudCBob2xkZXIuXG4gICAgaWYgKHNvdXJjZUZpbGUuc3RhdGVtZW50cy5sZW5ndGggJiZcbiAgICAgICAgc291cmNlRmlsZS5zdGF0ZW1lbnRzWzBdLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuTm90RW1pdHRlZFN0YXRlbWVudCkge1xuICAgICAgaW5zZXJ0aW9uKys7XG4gICAgfVxuICAgIHJldHVybiB0cy51cGRhdGVTb3VyY2VGaWxlTm9kZShzb3VyY2VGaWxlLCBbXG4gICAgICAuLi5zb3VyY2VGaWxlLnN0YXRlbWVudHMuc2xpY2UoMCwgaW5zZXJ0aW9uKSxcbiAgICAgIC4uLnRoaXMuYWRkaXRpb25hbEltcG9ydHMsXG4gICAgICAuLi5zb3VyY2VGaWxlLnN0YXRlbWVudHMuc2xpY2UoaW5zZXJ0aW9uKSxcbiAgICBdKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQYXJzZXMgYW5kIHN5bnRoZXNpemVzIGNvbW1lbnRzIG9uIG5vZGUsIGFuZCByZXR1cm5zIHRoZSBKU0RvYyBmcm9tIGl0LCBpZiBhbnkuXG4gICAqIEBwYXJhbSByZXBvcnRXYXJuaW5ncyBpZiB0cnVlLCB3aWxsIHJlcG9ydCB3YXJuaW5ncyBmcm9tIHBhcnNpbmcgdGhlIEpTRG9jLiBTZXQgdG8gZmFsc2UgaWZcbiAgICogICAgIHRoaXMgaXMgbm90IHRoZSBcIm1haW5cIiBsb2NhdGlvbiBkZWFsaW5nIHdpdGggYSBub2RlIHRvIGF2b2lkIGR1cGxpY2F0ZWQgd2FybmluZ3MuXG4gICAqL1xuICBnZXRKU0RvYyhub2RlOiB0cy5Ob2RlLCByZXBvcnRXYXJuaW5nczogYm9vbGVhbik6IGpzZG9jLlRhZ1tdIHtcbiAgICBjb25zdCBbdGFncywgXSA9IHRoaXMucGFyc2VKU0RvYyhub2RlLCByZXBvcnRXYXJuaW5ncyk7XG4gICAgcmV0dXJuIHRhZ3M7XG4gIH1cblxuICBnZXRNdXRhYmxlSlNEb2Mobm9kZTogdHMuTm9kZSk6IE11dGFibGVKU0RvYyB7XG4gICAgY29uc3QgW3RhZ3MsIGNvbW1lbnRdID0gdGhpcy5wYXJzZUpTRG9jKG5vZGUsIC8qIHJlcG9ydFdhcm5pbmdzICovIHRydWUpO1xuICAgIHJldHVybiBuZXcgTXV0YWJsZUpTRG9jKG5vZGUsIGNvbW1lbnQsIHRhZ3MpO1xuICB9XG5cbiAgcHJpdmF0ZSBwYXJzZUpTRG9jKG5vZGU6IHRzLk5vZGUsIHJlcG9ydFdhcm5pbmdzOiBib29sZWFuKTpcbiAgICAgIFtqc2RvYy5UYWdbXSwgdHMuU3ludGhlc2l6ZWRDb21tZW50fG51bGxdIHtcbiAgICAvLyBzeW50aGVzaXplTGVhZGluZ0NvbW1lbnRzIGJlbG93IGNoYW5nZXMgdGV4dCBsb2NhdGlvbnMgZm9yIG5vZGUsIHNvIGV4dHJhY3QgdGhlIGxvY2F0aW9uIGhlcmVcbiAgICAvLyBpbiBjYXNlIGl0IGlzIG5lZWRlZCBsYXRlciB0byByZXBvcnQgZGlhZ25vc3RpY3MuXG4gICAgY29uc3Qgc3RhcnQgPSBub2RlLmdldEZ1bGxTdGFydCgpO1xuICAgIGNvbnN0IGxlbmd0aCA9IG5vZGUuZ2V0TGVhZGluZ1RyaXZpYVdpZHRoKHRoaXMuc291cmNlRmlsZSk7XG5cbiAgICBjb25zdCBjb21tZW50cyA9IGpzZG9jLnN5bnRoZXNpemVMZWFkaW5nQ29tbWVudHMobm9kZSk7XG4gICAgaWYgKCFjb21tZW50cyB8fCBjb21tZW50cy5sZW5ndGggPT09IDApIHJldHVybiBbW10sIG51bGxdO1xuXG4gICAgZm9yIChsZXQgaSA9IGNvbW1lbnRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICBjb25zdCBjb21tZW50ID0gY29tbWVudHNbaV07XG4gICAgICBjb25zdCBwYXJzZWQgPSBqc2RvYy5wYXJzZShjb21tZW50KTtcbiAgICAgIGlmIChwYXJzZWQpIHtcbiAgICAgICAgaWYgKHJlcG9ydFdhcm5pbmdzICYmIHBhcnNlZC53YXJuaW5ncykge1xuICAgICAgICAgIGNvbnN0IHJhbmdlID0gY29tbWVudC5vcmlnaW5hbFJhbmdlIHx8IHtwb3M6IHN0YXJ0LCBlbmQ6IHN0YXJ0ICsgbGVuZ3RofTtcbiAgICAgICAgICByZXBvcnREaWFnbm9zdGljKFxuICAgICAgICAgICAgICB0aGlzLmRpYWdub3N0aWNzLCBub2RlLCBwYXJzZWQud2FybmluZ3Muam9pbignXFxuJyksIHJhbmdlLFxuICAgICAgICAgICAgICB0cy5EaWFnbm9zdGljQ2F0ZWdvcnkuV2FybmluZyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtwYXJzZWQudGFncywgY29tbWVudF07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBbW10sIG51bGxdO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgdGhlIGpzZG9jIGZvciBtZXRob2RzLCBpbmNsdWRpbmcgb3ZlcmxvYWRzLlxuICAgKiBJZiBvdmVybG9hZGVkLCBtZXJnZXMgdGhlIHNpZ25hdHVyZXMgaW4gdGhlIGxpc3Qgb2YgU2lnbmF0dXJlRGVjbGFyYXRpb25zIGludG8gYSBzaW5nbGUganNkb2MuXG4gICAqIC0gVG90YWwgbnVtYmVyIG9mIHBhcmFtZXRlcnMgd2lsbCBiZSB0aGUgbWF4aW11bSBjb3VudCBmb3VuZCBhY3Jvc3MgYWxsIHZhcmlhbnRzLlxuICAgKiAtIERpZmZlcmVudCBuYW1lcyBhdCB0aGUgc2FtZSBwYXJhbWV0ZXIgaW5kZXggd2lsbCBiZSBqb2luZWQgd2l0aCBcIl9vcl9cIlxuICAgKiAtIFZhcmlhYmxlIGFyZ3MgKC4uLnR5cGVbXSBpbiBUeXBlU2NyaXB0KSB3aWxsIGJlIG91dHB1dCBhcyBcIi4uLnR5cGVcIixcbiAgICogICAgZXhjZXB0IGlmIGZvdW5kIGF0IHRoZSBzYW1lIGluZGV4IGFzIGFub3RoZXIgYXJndW1lbnQuXG4gICAqIEBwYXJhbSBmbkRlY2xzIFBhc3MgPiAxIGRlY2xhcmF0aW9uIGZvciBvdmVybG9hZHMgb2Ygc2FtZSBuYW1lXG4gICAqIEByZXR1cm4gVGhlIGxpc3Qgb2YgcGFyYW1ldGVyIG5hbWVzIHRoYXQgc2hvdWxkIGJlIHVzZWQgdG8gZW1pdCB0aGUgYWN0dWFsXG4gICAqICAgIGZ1bmN0aW9uIHN0YXRlbWVudDsgZm9yIG92ZXJsb2FkcywgbmFtZSB3aWxsIGhhdmUgYmVlbiBtZXJnZWQuXG4gICAqL1xuICBnZXRGdW5jdGlvblR5cGVKU0RvYyhmbkRlY2xzOiB0cy5TaWduYXR1cmVEZWNsYXJhdGlvbltdLCBleHRyYVRhZ3M6IGpzZG9jLlRhZ1tdID0gW10pOlxuICAgICAge3RhZ3M6IGpzZG9jLlRhZ1tdLCBwYXJhbWV0ZXJOYW1lczogc3RyaW5nW10sIHRoaXNSZXR1cm5UeXBlOiB0cy5UeXBlfG51bGx9IHtcbiAgICBjb25zdCB0eXBlQ2hlY2tlciA9IHRoaXMudHlwZUNoZWNrZXI7XG5cbiAgICAvLyBEZS1kdXBsaWNhdGUgdGFncyBhbmQgZG9jcyBmb3VuZCBmb3IgdGhlIGZuRGVjbHMuXG4gICAgY29uc3QgdGFnc0J5TmFtZSA9IG5ldyBNYXA8c3RyaW5nLCBqc2RvYy5UYWc+KCk7XG4gICAgZnVuY3Rpb24gYWRkVGFnKHRhZzoganNkb2MuVGFnKSB7XG4gICAgICBjb25zdCBleGlzdGluZyA9IHRhZ3NCeU5hbWUuZ2V0KHRhZy50YWdOYW1lKTtcbiAgICAgIHRhZ3NCeU5hbWUuc2V0KHRhZy50YWdOYW1lLCBleGlzdGluZyA/IGpzZG9jLm1lcmdlKFtleGlzdGluZywgdGFnXSkgOiB0YWcpO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IGV4dHJhVGFnIG9mIGV4dHJhVGFncykgYWRkVGFnKGV4dHJhVGFnKTtcblxuICAgIGNvbnN0IGxlbnMgPSBmbkRlY2xzLm1hcChmbkRlY2wgPT4gZm5EZWNsLnBhcmFtZXRlcnMubGVuZ3RoKTtcbiAgICBjb25zdCBtaW5BcmdzQ291bnQgPSBNYXRoLm1pbiguLi5sZW5zKTtcbiAgICBjb25zdCBtYXhBcmdzQ291bnQgPSBNYXRoLm1heCguLi5sZW5zKTtcbiAgICBjb25zdCBpc0NvbnN0cnVjdG9yID0gZm5EZWNscy5maW5kKGQgPT4gZC5raW5kID09PSB0cy5TeW50YXhLaW5kLkNvbnN0cnVjdG9yKSAhPT0gdW5kZWZpbmVkO1xuICAgIC8vIEZvciBlYWNoIHBhcmFtZXRlciBpbmRleCBpLCBwYXJhbVRhZ3NbaV0gaXMgYW4gYXJyYXkgb2YgcGFyYW1ldGVyc1xuICAgIC8vIHRoYXQgY2FuIGJlIGZvdW5kIGF0IGluZGV4IGkuICBFLmcuXG4gICAgLy8gICAgZnVuY3Rpb24gZm9vKHg6IHN0cmluZylcbiAgICAvLyAgICBmdW5jdGlvbiBmb28oeTogbnVtYmVyLCB6OiBzdHJpbmcpXG4gICAgLy8gdGhlbiBwYXJhbVRhZ3NbMF0gPSBbaW5mbyBhYm91dCB4LCBpbmZvIGFib3V0IHldLlxuICAgIGNvbnN0IHBhcmFtVGFnczoganNkb2MuVGFnW11bXSA9IFtdO1xuICAgIGNvbnN0IHJldHVyblRhZ3M6IGpzZG9jLlRhZ1tdID0gW107XG4gICAgY29uc3QgdHlwZVBhcmFtZXRlck5hbWVzID0gbmV3IFNldDxzdHJpbmc+KCk7XG5cbiAgICBsZXQgdGhpc1JldHVyblR5cGU6IHRzLlR5cGV8bnVsbCA9IG51bGw7XG4gICAgZm9yIChjb25zdCBmbkRlY2wgb2YgZm5EZWNscykge1xuICAgICAgLy8gQ29uc3RydWN0IHRoZSBKU0RvYyBjb21tZW50IGJ5IHJlYWRpbmcgdGhlIGV4aXN0aW5nIEpTRG9jLCBpZlxuICAgICAgLy8gYW55LCBhbmQgbWVyZ2luZyBpdCB3aXRoIHRoZSBrbm93biB0eXBlcyBvZiB0aGUgZnVuY3Rpb25cbiAgICAgIC8vIHBhcmFtZXRlcnMgYW5kIHJldHVybiB0eXBlLlxuICAgICAgY29uc3QgdGFncyA9IHRoaXMuZ2V0SlNEb2MoZm5EZWNsLCAvKiByZXBvcnRXYXJuaW5ncyAqLyBmYWxzZSk7XG5cbiAgICAgIC8vIENvcHkgYWxsIHRoZSB0YWdzIG90aGVyIHRoYW4gQHBhcmFtL0ByZXR1cm4gaW50byB0aGUgbmV3XG4gICAgICAvLyBKU0RvYyB3aXRob3V0IGFueSBjaGFuZ2U7IEBwYXJhbS9AcmV0dXJuIGFyZSBoYW5kbGVkIHNwZWNpYWxseS5cbiAgICAgIC8vIFRPRE86IHRoZXJlIG1heSBiZSBwcm9ibGVtcyBpZiBhbiBhbm5vdGF0aW9uIGRvZXNuJ3QgYXBwbHkgdG8gYWxsIG92ZXJsb2FkcztcbiAgICAgIC8vIGlzIGl0IHdvcnRoIGNoZWNraW5nIGZvciB0aGlzIGFuZCBlcnJvcmluZz9cbiAgICAgIGZvciAoY29uc3QgdGFnIG9mIHRhZ3MpIHtcbiAgICAgICAgaWYgKHRhZy50YWdOYW1lID09PSAncGFyYW0nIHx8IHRhZy50YWdOYW1lID09PSAncmV0dXJuJykgY29udGludWU7XG4gICAgICAgIGFkZFRhZyh0YWcpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBmbGFncyA9IHRzLmdldENvbWJpbmVkTW9kaWZpZXJGbGFncyhmbkRlY2wpO1xuICAgICAgLy8gQWRkIEBhYnN0cmFjdCBvbiBcImFic3RyYWN0XCIgZGVjbGFyYXRpb25zLlxuICAgICAgaWYgKGZsYWdzICYgdHMuTW9kaWZpZXJGbGFncy5BYnN0cmFjdCkge1xuICAgICAgICBhZGRUYWcoe3RhZ05hbWU6ICdhYnN0cmFjdCd9KTtcbiAgICAgIH1cbiAgICAgIC8vIEFkZCBAcHJvdGVjdGVkL0Bwcml2YXRlIGlmIHByZXNlbnQuXG4gICAgICBpZiAoZmxhZ3MgJiB0cy5Nb2RpZmllckZsYWdzLlByb3RlY3RlZCkge1xuICAgICAgICBhZGRUYWcoe3RhZ05hbWU6ICdwcm90ZWN0ZWQnfSk7XG4gICAgICB9IGVsc2UgaWYgKGZsYWdzICYgdHMuTW9kaWZpZXJGbGFncy5Qcml2YXRlKSB7XG4gICAgICAgIGFkZFRhZyh7dGFnTmFtZTogJ3ByaXZhdGUnfSk7XG4gICAgICB9XG5cbiAgICAgIC8vIEFkZCBhbnkgQHRlbXBsYXRlIHRhZ3MuXG4gICAgICAvLyBNdWx0aXBsZSBkZWNsYXJhdGlvbnMgd2l0aCB0aGUgc2FtZSB0ZW1wbGF0ZSB2YXJpYWJsZSBuYW1lcyBzaG91bGQgd29yazpcbiAgICAgIC8vIHRoZSBkZWNsYXJhdGlvbnMgZ2V0IHR1cm5lZCBpbnRvIHVuaW9uIHR5cGVzLCBhbmQgQ2xvc3VyZSBDb21waWxlciB3aWxsIG5lZWRcbiAgICAgIC8vIHRvIGZpbmQgYSB1bmlvbiB3aGVyZSBhbGwgdHlwZSBhcmd1bWVudHMgYXJlIHNhdGlzZmllZC5cbiAgICAgIGlmIChmbkRlY2wudHlwZVBhcmFtZXRlcnMpIHtcbiAgICAgICAgZm9yIChjb25zdCB0cCBvZiBmbkRlY2wudHlwZVBhcmFtZXRlcnMpIHtcbiAgICAgICAgICB0eXBlUGFyYW1ldGVyTmFtZXMuYWRkKGdldElkZW50aWZpZXJUZXh0KHRwLm5hbWUpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gTWVyZ2UgdGhlIHBhcmFtZXRlcnMgaW50byBhIHNpbmdsZSBsaXN0IG9mIG1lcmdlZCBuYW1lcyBhbmQgbGlzdCBvZiB0eXBlc1xuICAgICAgY29uc3Qgc2lnID0gdHlwZUNoZWNrZXIuZ2V0U2lnbmF0dXJlRnJvbURlY2xhcmF0aW9uKGZuRGVjbCk7XG4gICAgICBpZiAoIXNpZyB8fCAhc2lnLmRlY2xhcmF0aW9uKSB0aHJvdyBuZXcgRXJyb3IoYGludmFsaWQgc2lnbmF0dXJlICR7Zm5EZWNsLm5hbWV9YCk7XG4gICAgICBpZiAoc2lnLmRlY2xhcmF0aW9uLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuSlNEb2NTaWduYXR1cmUpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBKU0RvYyBzaWduYXR1cmUgJHtmbkRlY2wubmFtZX1gKTtcbiAgICAgIH1cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2lnLmRlY2xhcmF0aW9uLnBhcmFtZXRlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgcGFyYW1Ob2RlID0gc2lnLmRlY2xhcmF0aW9uLnBhcmFtZXRlcnNbaV07XG5cbiAgICAgICAgY29uc3QgbmFtZSA9IGdldFBhcmFtZXRlck5hbWUocGFyYW1Ob2RlLCBpKTtcbiAgICAgICAgY29uc3QgaXNUaGlzUGFyYW0gPSBuYW1lID09PSAndGhpcyc7XG5cbiAgICAgICAgY29uc3QgbmV3VGFnOiBqc2RvYy5UYWcgPSB7XG4gICAgICAgICAgdGFnTmFtZTogaXNUaGlzUGFyYW0gPyAndGhpcycgOiAncGFyYW0nLFxuICAgICAgICAgIG9wdGlvbmFsOiBwYXJhbU5vZGUuaW5pdGlhbGl6ZXIgIT09IHVuZGVmaW5lZCB8fCBwYXJhbU5vZGUucXVlc3Rpb25Ub2tlbiAhPT0gdW5kZWZpbmVkLFxuICAgICAgICAgIHBhcmFtZXRlck5hbWU6IGlzVGhpc1BhcmFtID8gdW5kZWZpbmVkIDogbmFtZSxcbiAgICAgICAgfTtcblxuICAgICAgICBsZXQgdHlwZSA9IHR5cGVDaGVja2VyLmdldFR5cGVBdExvY2F0aW9uKHBhcmFtTm9kZSk7XG4gICAgICAgIGlmIChwYXJhbU5vZGUuZG90RG90RG90VG9rZW4gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIG5ld1RhZy5yZXN0UGFyYW0gPSB0cnVlO1xuICAgICAgICAgIC8vIEluIFR5cGVTY3JpcHQgeW91IHdyaXRlIFwiLi4ueDogbnVtYmVyW11cIiwgYnV0IGluIENsb3N1cmVcbiAgICAgICAgICAvLyB5b3UgZG9uJ3Qgd3JpdGUgdGhlIGFycmF5OiBcIkBwYXJhbSB7Li4ubnVtYmVyfSB4XCIuICBVbndyYXBcbiAgICAgICAgICAvLyB0aGUgQXJyYXk8PiB3cmFwcGVyLlxuICAgICAgICAgIGlmICgodHlwZS5mbGFncyAmIHRzLlR5cGVGbGFncy5PYmplY3QpID09PSAwICYmIHR5cGUuZmxhZ3MgJiB0cy5UeXBlRmxhZ3MuVHlwZVBhcmFtZXRlcikge1xuICAgICAgICAgICAgLy8gZnVuY3Rpb24gZjxUIGV4dGVuZHMgc3RyaW5nW10+KC4uLnRzOiBUKSBoYXMgdGhlIEFycmF5IHR5cGUgb24gdGhlIHR5cGUgcGFyYW1ldGVyXG4gICAgICAgICAgICAvLyBjb25zdHJhaW50LCBub3Qgb24gdGhlIHBhcmFtZXRlciBpdHNlbGYuIFJlc29sdmUgaXQuXG4gICAgICAgICAgICBjb25zdCBiYXNlQ29uc3RyYWludCA9IHR5cGVDaGVja2VyLmdldEJhc2VDb25zdHJhaW50T2ZUeXBlKHR5cGUpO1xuICAgICAgICAgICAgaWYgKGJhc2VDb25zdHJhaW50KSB0eXBlID0gYmFzZUNvbnN0cmFpbnQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0eXBlLmZsYWdzICYgdHMuVHlwZUZsYWdzLk9iamVjdCAmJlxuICAgICAgICAgICAgICAodHlwZSBhcyB0cy5PYmplY3RUeXBlKS5vYmplY3RGbGFncyAmIHRzLk9iamVjdEZsYWdzLlJlZmVyZW5jZSkge1xuICAgICAgICAgICAgY29uc3QgdHlwZVJlZiA9IHR5cGUgYXMgdHMuVHlwZVJlZmVyZW5jZTtcbiAgICAgICAgICAgIGlmICghdHlwZVJlZi50eXBlQXJndW1lbnRzKSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigncmVzdCBwYXJhbWV0ZXIgZG9lcyBub3QgcmVzb2x2ZSB0byBhIHJlZmVyZW5jZSB0eXBlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0eXBlID0gdHlwZVJlZi50eXBlQXJndW1lbnRzIVswXTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgbmV3VGFnLnR5cGUgPSB0aGlzLnR5cGVUb0Nsb3N1cmUoZm5EZWNsLCB0eXBlKTtcblxuICAgICAgICBmb3IgKGNvbnN0IHt0YWdOYW1lLCBwYXJhbWV0ZXJOYW1lLCB0ZXh0fSBvZiB0YWdzKSB7XG4gICAgICAgICAgaWYgKHRhZ05hbWUgPT09ICdwYXJhbScgJiYgcGFyYW1ldGVyTmFtZSA9PT0gbmV3VGFnLnBhcmFtZXRlck5hbWUpIHtcbiAgICAgICAgICAgIG5ld1RhZy50ZXh0ID0gdGV4dDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoIXBhcmFtVGFnc1tpXSkgcGFyYW1UYWdzLnB1c2goW10pO1xuICAgICAgICBwYXJhbVRhZ3NbaV0ucHVzaChuZXdUYWcpO1xuICAgICAgfVxuXG4gICAgICAvLyBSZXR1cm4gdHlwZS5cbiAgICAgIGlmICghaXNDb25zdHJ1Y3Rvcikge1xuICAgICAgICBjb25zdCByZXR1cm5UYWc6IGpzZG9jLlRhZyA9IHtcbiAgICAgICAgICB0YWdOYW1lOiAncmV0dXJuJyxcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgcmV0VHlwZSA9IHR5cGVDaGVja2VyLmdldFJldHVyblR5cGVPZlNpZ25hdHVyZShzaWcpO1xuICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tYW55IGFjY2Vzc2luZyBUUyBpbnRlcm5hbCBmaWVsZC5cbiAgICAgICAgaWYgKChyZXRUeXBlIGFzIGFueSkuaXNUaGlzVHlwZSkge1xuICAgICAgICAgIC8vIGZvbygpOiB0aGlzXG4gICAgICAgICAgdGhpc1JldHVyblR5cGUgPSByZXRUeXBlO1xuICAgICAgICAgIGFkZFRhZyh7dGFnTmFtZTogJ3RlbXBsYXRlJywgdGV4dDogJ1RISVMnfSk7XG4gICAgICAgICAgYWRkVGFnKHt0YWdOYW1lOiAndGhpcycsIHR5cGU6ICdUSElTJ30pO1xuICAgICAgICAgIHJldHVyblRhZy50eXBlID0gJ1RISVMnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVyblRhZy50eXBlID0gdGhpcy50eXBlVG9DbG9zdXJlKGZuRGVjbCwgcmV0VHlwZSk7XG4gICAgICAgICAgZm9yIChjb25zdCB7dGFnTmFtZSwgdGV4dH0gb2YgdGFncykge1xuICAgICAgICAgICAgaWYgKHRhZ05hbWUgPT09ICdyZXR1cm4nKSB7XG4gICAgICAgICAgICAgIHJldHVyblRhZy50ZXh0ID0gdGV4dDtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVyblRhZ3MucHVzaChyZXR1cm5UYWcpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0eXBlUGFyYW1ldGVyTmFtZXMuc2l6ZSA+IDApIHtcbiAgICAgIGFkZFRhZyh7dGFnTmFtZTogJ3RlbXBsYXRlJywgdGV4dDogQXJyYXkuZnJvbSh0eXBlUGFyYW1ldGVyTmFtZXMudmFsdWVzKCkpLmpvaW4oJywgJyl9KTtcbiAgICB9XG5cbiAgICBjb25zdCBuZXdEb2MgPSBBcnJheS5mcm9tKHRhZ3NCeU5hbWUudmFsdWVzKCkpO1xuXG4gICAgLy8gTWVyZ2UgdGhlIEpTRG9jIHRhZ3MgZm9yIGVhY2ggb3ZlcmxvYWRlZCBwYXJhbWV0ZXIuXG4gICAgLy8gRW5zdXJlIGVhY2ggcGFyYW1ldGVyIGhhcyBhIHVuaXF1ZSBuYW1lOyB0aGUgbWVyZ2luZyBwcm9jZXNzIGNhbiBvdGhlcndpc2VcbiAgICAvLyBhY2NpZGVudGFsbHkgZ2VuZXJhdGUgdGhlIHNhbWUgcGFyYW1ldGVyIG5hbWUgdHdpY2UuXG4gICAgY29uc3QgcGFyYW1OYW1lcyA9IG5ldyBTZXQoKTtcbiAgICBsZXQgZm91bmRPcHRpb25hbCA9IGZhbHNlO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWF4QXJnc0NvdW50OyBpKyspIHtcbiAgICAgIGNvbnN0IHBhcmFtVGFnID0ganNkb2MubWVyZ2UocGFyYW1UYWdzW2ldKTtcbiAgICAgIGlmIChwYXJhbU5hbWVzLmhhcyhwYXJhbVRhZy5wYXJhbWV0ZXJOYW1lKSkge1xuICAgICAgICBwYXJhbVRhZy5wYXJhbWV0ZXJOYW1lICs9IGkudG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICAgIHBhcmFtTmFtZXMuYWRkKHBhcmFtVGFnLnBhcmFtZXRlck5hbWUpO1xuICAgICAgLy8gSWYgdGhlIHRhZyBpcyBvcHRpb25hbCwgbWFyayBwYXJhbWV0ZXJzIGZvbGxvd2luZyBvcHRpb25hbCBhcyBvcHRpb25hbCxcbiAgICAgIC8vIGV2ZW4gaWYgdGhleSBhcmUgbm90LCBzaW5jZSBDbG9zdXJlIHJlc3RyaWN0cyB0aGlzLCBzZWVcbiAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9nb29nbGUvY2xvc3VyZS1jb21waWxlci9pc3N1ZXMvMjMxNFxuICAgICAgaWYgKCFwYXJhbVRhZy5yZXN0UGFyYW0gJiYgKHBhcmFtVGFnLm9wdGlvbmFsIHx8IGZvdW5kT3B0aW9uYWwgfHwgaSA+PSBtaW5BcmdzQ291bnQpKSB7XG4gICAgICAgIGZvdW5kT3B0aW9uYWwgPSB0cnVlO1xuICAgICAgICBwYXJhbVRhZy5vcHRpb25hbCA9IHRydWU7XG4gICAgICB9XG4gICAgICBuZXdEb2MucHVzaChwYXJhbVRhZyk7XG4gICAgICBpZiAocGFyYW1UYWcucmVzdFBhcmFtKSB7XG4gICAgICAgIC8vIENhbm5vdCBoYXZlIGFueSBwYXJhbWV0ZXJzIGFmdGVyIGEgcmVzdCBwYXJhbS5cbiAgICAgICAgLy8gSnVzdCBkdW1wIHRoZSByZW1haW5pbmcgcGFyYW1ldGVycy5cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gTWVyZ2UgdGhlIEpTRG9jIHRhZ3MgZm9yIGVhY2ggb3ZlcmxvYWRlZCByZXR1cm4uXG4gICAgaWYgKCFpc0NvbnN0cnVjdG9yKSB7XG4gICAgICBuZXdEb2MucHVzaChqc2RvYy5tZXJnZShyZXR1cm5UYWdzKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHRhZ3M6IG5ld0RvYyxcbiAgICAgIHBhcmFtZXRlck5hbWVzOiBuZXdEb2MuZmlsdGVyKHQgPT4gdC50YWdOYW1lID09PSAncGFyYW0nKS5tYXAodCA9PiB0LnBhcmFtZXRlck5hbWUhKSxcbiAgICAgIHRoaXNSZXR1cm5UeXBlLFxuICAgIH07XG4gIH1cbn1cbiJdfQ==