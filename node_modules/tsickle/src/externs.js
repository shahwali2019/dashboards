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
        define("tsickle/src/externs", ["require", "exports", "path", "typescript", "tsickle/src/annotator_host", "tsickle/src/enum_transformer", "tsickle/src/googmodule", "tsickle/src/jsdoc", "tsickle/src/jsdoc_transformer", "tsickle/src/module_type_translator", "tsickle/src/transformer_util", "tsickle/src/type_translator"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @fileoverview Externs creates Closure Compiler \@externs definitions from the
     * ambient declarations in a TypeScript file.
     *
     * For example, a declare interface Foo { bar: string; } Would generate a /..
     *   \@externs ./ /.. \@record ./ var Foo = function() {}; /.. \@type {string}
     *   ./ Foo.prototype.bar;
     *
     * The generated externs indicate to Closure Compiler that symbols are external
     * to the optimization process, i.e. they are provided by outside code. That
     * most importantly means they must not be renamed or removed.
     *
     * A major difficulty here is that TypeScript supports module-scoped external
     * symbols; `.d.ts` files can contain `export`s and `import` other files.
     * Closure Compiler does not have such a concept, so tsickle must emulate the
     * behaviour. It does so by following this scheme:
     *
     * 1. non-module .d.ts produces global symbols
     * 2. module .d.ts produce symbols namespaced to the module, by creating a
     *    mangled name matching the current file's path. tsickle expects outside
     *    code (e.g. build system integration or manually written code) to contain a
     *    goog.module/provide that references the mangled path.
     * 3. declarations in `.ts` files produce types that can be separately emitted
     *    in e.g. an `externs.js`, using `getGeneratedExterns` below.
     *    1. non-exported symbols produce global types, because that's what users
     *       expect and it matches TypeScripts emit, which just references `Foo` for
     *       a locally declared symbol `Foo` in a module. Arguably these should be
     *       wrapped in `declare global { ... }`.
     *    2. exported symbols are scoped to the `.ts` file by prefixing them with a
     *       mangled name. Exported types are re-exported from the JavaScript
     *       `goog.module`, allowing downstream code to reference them. This has the
     *       same problem regarding ambient values as above, it is unclear where the
     *       value symbol would be defined, so for the time being this is
     *       unsupported.
     *
     * The effect of this is that:
     * - symbols in a module (i.e. not globals) are generally scoped to the local
     *   module using a mangled name, preventing symbol collisions on the Closure
     *   side.
     * - importing code can unconditionally refer to and import any symbol defined
     *   in a module `X` as `path.to.module.X`, regardless of whether the defining
     *   location is a `.d.ts` file or a `.ts` file, and regardless whether the
     *   symbol is ambient (assuming there's an appropriate shim).
     * - if there is a shim present, tsickle avoids emitting the Closure namespace
     *   itself, expecting the shim to provide the namespace and initialize it to a
     *   symbol that provides the right value at runtime (i.e. the implementation of
     *   whatever third party library the .d.ts describes).
     */
    var path = require("path");
    var ts = require("typescript");
    var annotator_host_1 = require("tsickle/src/annotator_host");
    var enum_transformer_1 = require("tsickle/src/enum_transformer");
    var googmodule_1 = require("tsickle/src/googmodule");
    var jsdoc = require("tsickle/src/jsdoc");
    var jsdoc_transformer_1 = require("tsickle/src/jsdoc_transformer");
    var module_type_translator_1 = require("tsickle/src/module_type_translator");
    var transformer_util_1 = require("tsickle/src/transformer_util");
    var type_translator_1 = require("tsickle/src/type_translator");
    /**
     * Symbols that are already declared as externs in Closure, that should
     * be avoided by tsickle's "declare ..." => externs.js conversion.
     */
    var CLOSURE_EXTERNS_BLACKLIST = [
        'exports',
        'global',
        'module',
        // ErrorConstructor is the interface of the Error object itself.
        // tsickle detects that this is part of the TypeScript standard library
        // and assumes it's part of the Closure standard library, but this
        // assumption is wrong for ErrorConstructor.  To properly handle this
        // we'd somehow need to map methods defined on the ErrorConstructor
        // interface into properties on Closure's Error object, but for now it's
        // simpler to just blacklist it.
        'ErrorConstructor',
        'Symbol',
        'WorkerGlobalScope',
    ];
    /**
     * The header to be used in generated externs.  This is not included in the output of
     * generateExterns() because generateExterns() works one file at a time, and typically you create
     * one externs file from the entire compilation unit.
     *
     * Suppressions:
     * - duplicate: because externs might duplicate re-opened definitions from other JS files.
     * - checkTypes: Closure's type system does not match TS'.
     * - undefinedNames: code below tries to be careful not to overwrite previously emitted definitions,
     *   but on the flip side might accidentally miss definitions.
     */
    var EXTERNS_HEADER = "/**\n * @externs\n * @suppress {duplicate,checkTypes}\n */\n// NOTE: generated by tsickle, do not edit.\n";
    /**
     * Concatenate all generated externs definitions together into a string, including a file comment
     * header.
     *
     * @param rootDir Project root.  Emitted comments will reference paths relative to this root.
     *    This param is effectively required, but made optional here until Angular is fixed.
     */
    function getGeneratedExterns(externs, rootDir) {
        if (rootDir === void 0) { rootDir = ''; }
        var e_1, _a;
        var allExterns = EXTERNS_HEADER;
        try {
            for (var _b = __values(Object.keys(externs)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var fileName = _c.value;
                allExterns += "// externs from " + path.relative(rootDir, fileName) + ":\n";
                allExterns += externs[fileName];
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return allExterns;
    }
    exports.getGeneratedExterns = getGeneratedExterns;
    /**
     * isInGlobalAugmentation returns true if declaration is the immediate child of a 'declare global'
     * block.
     */
    function isInGlobalAugmentation(declaration) {
        // declare global { ... } creates a ModuleDeclaration containing a ModuleBlock containing the
        // declaration, with the ModuleDeclaration having the GlobalAugmentation flag set.
        if (!declaration.parent || !declaration.parent.parent)
            return false;
        return (declaration.parent.parent.flags & ts.NodeFlags.GlobalAugmentation) !== 0;
    }
    /**
     * generateExterns generates extern definitions for all ambient declarations in the given source
     * file. It returns a string representation of the Closure JavaScript, not including the initial
     * comment with \@fileoverview and \@externs (see above for that).
     */
    function generateExterns(typeChecker, sourceFile, host, moduleResolutionHost, options) {
        var e_2, _a, e_3, _b;
        var output = '';
        var diagnostics = [];
        var isDts = transformer_util_1.isDtsFileName(sourceFile.fileName);
        var isExternalModule = ts.isExternalModule(sourceFile);
        var mtt = new module_type_translator_1.ModuleTypeTranslator(sourceFile, typeChecker, host, diagnostics, /*isForExterns*/ true);
        var rootNamespace = '';
        if (isExternalModule) {
            // .d.ts files that are modules do not declare global symbols - their symbols must be explicitly
            // imported to be used. However Closure Compiler has no concept of externs that are modules and
            // require imports. This code mangles the symbol names by wrapping them in a top level variable
            // that's unique to this file. That allows emitting them for Closure as global symbols while
            // avoiding collisions. This is necessary as symbols local to this module can (and will very
            // commonly) conflict with the namespace used in "export as namespace", e.g. "angular", and also
            // to avoid users accidentally using these symbols in .js files (and more collisions). The
            // symbols that are "hidden" like that can be made accessible through an "export as namespace"
            // declaration (see below).
            rootNamespace = annotator_host_1.moduleNameAsIdentifier(host, sourceFile.fileName);
        }
        try {
            for (var _c = __values(sourceFile.statements), _d = _c.next(); !_d.done; _d = _c.next()) {
                var stmt = _d.value;
                if (!isDts && !transformer_util_1.hasModifierFlag(stmt, ts.ModifierFlags.Ambient)) {
                    continue;
                }
                visitor(stmt, []);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_2) throw e_2.error; }
        }
        if (output && isExternalModule) {
            // If tsickle generated any externs and this is an external module, prepend the namespace
            // declaration for it.
            output = "/** @const */\nvar " + rootNamespace + " = {};\n" + output;
            // There can only be one export =.
            var exportAssignment = sourceFile.statements.find(ts.isExportAssignment);
            var exportedNamespace = rootNamespace;
            if (exportAssignment && exportAssignment.isExportEquals) {
                if (ts.isIdentifier(exportAssignment.expression) ||
                    ts.isQualifiedName(exportAssignment.expression)) {
                    // E.g. export = someName;
                    // If someName is "declare global { namespace someName {...} }", tsickle must not qualify
                    // access to it with module namespace as it is emitted in the global namespace.
                    var symbol = typeChecker.getSymbolAtLocation(exportAssignment.expression);
                    var isGlobalSymbol = symbol && symbol.declarations &&
                        symbol.declarations.some(function (d) { return isInGlobalAugmentation(d); });
                    var entityName = transformer_util_1.getEntityNameText(exportAssignment.expression);
                    if (isGlobalSymbol) {
                        exportedNamespace = entityName;
                    }
                    else {
                        exportedNamespace = rootNamespace + '.' + entityName;
                    }
                }
                else {
                    transformer_util_1.reportDiagnostic(diagnostics, exportAssignment.expression, "export = expression must be a qualified name, got " + ts.SyntaxKind[exportAssignment.expression.kind] + ".");
                }
            }
            if (isDts && host.provideExternalModuleDtsNamespace) {
                try {
                    // In a non-shimmed module, create a global namespace. This exists purely for backwards
                    // compatiblity, in the medium term all code using tsickle should always use `goog.module`s,
                    // so global names should not be neccessary.
                    for (var _e = __values(sourceFile.statements.filter(ts.isNamespaceExportDeclaration)), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var nsExport = _f.value;
                        var namespaceName = transformer_util_1.getIdentifierText(nsExport.name);
                        emit("// export as namespace " + namespaceName + "\n");
                        writeVariableStatement(namespaceName, [], exportedNamespace);
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
            }
        }
        return { output: output, diagnostics: diagnostics };
        function emit(str) {
            output += str;
        }
        /**
         * isFirstDeclaration returns true if decl is the first declaration
         * of its symbol.  E.g. imagine
         *   interface Foo { x: number; }
         *   interface Foo { y: number; }
         * we only want to emit the "\@record" for Foo on the first one.
         *
         * The exception are variable declarations, which - in externs - do not assign a value:
         *   /.. \@type {...} ./
         *   var someVariable;
         *   /.. \@type {...} ./
         *   someNamespace.someVariable;
         * If a later declaration wants to add additional properties on someVariable, tsickle must still
         * emit an assignment into the object, as it's otherwise absent.
         */
        function isFirstValueDeclaration(decl) {
            if (!decl.name)
                return true;
            var sym = typeChecker.getSymbolAtLocation(decl.name);
            if (!sym.declarations || sym.declarations.length < 2)
                return true;
            var earlierDecls = sym.declarations.slice(0, sym.declarations.indexOf(decl));
            // Either there are no earlier declarations, or all of them are variables (see above). tsickle
            // emits a value for all other declaration kinds (function for functions, classes, interfaces,
            // {} object for namespaces).
            return earlierDecls.length === 0 || earlierDecls.every(ts.isVariableDeclaration);
        }
        /** Writes the actual variable statement of a Closure variable declaration. */
        function writeVariableStatement(name, namespace, value) {
            var qualifiedName = namespace.concat([name]).join('.');
            if (namespace.length === 0)
                emit("var ");
            emit(qualifiedName);
            if (value)
                emit(" = " + value);
            emit(';\n');
        }
        /**
         * Writes a Closure variable declaration, i.e. the variable statement with a leading JSDoc
         * comment making it a declaration.
         */
        function writeVariableDeclaration(decl, namespace) {
            if (decl.name.kind === ts.SyntaxKind.Identifier) {
                var name_1 = transformer_util_1.getIdentifierText(decl.name);
                if (CLOSURE_EXTERNS_BLACKLIST.indexOf(name_1) >= 0)
                    return;
                emit(jsdoc.toString([{ tagName: 'type', type: mtt.typeToClosure(decl) }]));
                emit('\n');
                writeVariableStatement(name_1, namespace);
            }
            else {
                errorUnimplementedKind(decl.name, 'externs for variable');
            }
        }
        /**
         * Emits a JSDoc declaration that merges the signatures of the given function declaration (for
         * overloads), and returns the parameter names chosen.
         */
        function emitFunctionType(decls, extraTags) {
            if (extraTags === void 0) { extraTags = []; }
            var _a = mtt.getFunctionTypeJSDoc(decls, extraTags), tags = _a.tags, parameterNames = _a.parameterNames;
            emit('\n');
            emit(jsdoc.toString(tags));
            return parameterNames;
        }
        function writeFunction(name, params, namespace) {
            var paramsStr = params.join(', ');
            if (namespace.length > 0) {
                var fqn = namespace.join('.');
                if (name.kind === ts.SyntaxKind.Identifier) {
                    fqn += '.'; // computed names include [ ] in their getText() representation.
                }
                fqn += name.getText();
                emit(fqn + " = function(" + paramsStr + ") {};\n");
            }
            else {
                if (name.kind !== ts.SyntaxKind.Identifier) {
                    transformer_util_1.reportDiagnostic(diagnostics, name, 'Non-namespaced computed name in externs');
                }
                emit("function " + name.getText() + "(" + paramsStr + ") {}\n");
            }
        }
        function writeEnum(decl, namespace) {
            var e_4, _a;
            // E.g. /** @enum {number} */ var COUNTRY = {US: 1, CA: 1};
            var name = transformer_util_1.getIdentifierText(decl.name);
            var members = '';
            var enumType = enum_transformer_1.getEnumType(typeChecker, decl);
            // Closure enums members must have a value of the correct type, but the actual value does not
            // matter in externs.
            var initializer = enumType === 'string' ? "''" : 1;
            try {
                for (var _b = __values(decl.members), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var member = _c.value;
                    var memberName = void 0;
                    switch (member.name.kind) {
                        case ts.SyntaxKind.Identifier:
                            memberName = transformer_util_1.getIdentifierText(member.name);
                            break;
                        case ts.SyntaxKind.StringLiteral:
                            var text = member.name.text;
                            if (type_translator_1.isValidClosurePropertyName(text))
                                memberName = text;
                            break;
                        default:
                            break;
                    }
                    if (!memberName) {
                        members += "  /* TODO: " + ts.SyntaxKind[member.name.kind] + ": " + jsdoc_transformer_1.escapeForComment(member.name.getText()) + " */\n";
                        continue;
                    }
                    members += "  " + memberName + ": " + initializer + ",\n";
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_4) throw e_4.error; }
            }
            emit("\n/** @enum {" + enumType + "} */\n");
            writeVariableStatement(name, namespace, "{\n" + members + "}");
        }
        function writeTypeAlias(decl, namespace) {
            var typeStr = mtt.typeToClosure(decl, undefined);
            emit("\n/** @typedef {" + typeStr + "} */\n");
            writeVariableStatement(transformer_util_1.getIdentifierText(decl.name), namespace);
        }
        function writeType(decl, namespace) {
            var e_5, _a, e_6, _b;
            var name = decl.name;
            if (!name) {
                transformer_util_1.reportDiagnostic(diagnostics, decl, 'anonymous type in externs');
                return;
            }
            var typeName = namespace.concat([name.getText()]).join('.');
            if (CLOSURE_EXTERNS_BLACKLIST.indexOf(typeName) >= 0)
                return;
            if (isFirstValueDeclaration(decl)) {
                // Emit the 'function' that is actually the declaration of the interface
                // itself.  If it's a class, this function also must include the type
                // annotations of the constructor.
                var paramNames = [];
                var jsdocTags = [];
                var wroteJsDoc = false;
                jsdoc_transformer_1.maybeAddHeritageClauses(jsdocTags, mtt, decl);
                jsdoc_transformer_1.maybeAddTemplateClause(jsdocTags, decl);
                if (decl.kind === ts.SyntaxKind.ClassDeclaration) {
                    // TODO: it appears you can just write 'class Foo { ...' in externs.
                    // This code instead tries to translate it to a function.
                    jsdocTags.push({ tagName: 'constructor' }, { tagName: 'struct' });
                    var ctors = decl
                        .members.filter(function (m) { return m.kind === ts.SyntaxKind.Constructor; });
                    if (ctors.length) {
                        var firstCtor = ctors[0];
                        if (ctors.length > 1) {
                            paramNames = emitFunctionType(ctors, jsdocTags);
                        }
                        else {
                            paramNames = emitFunctionType([firstCtor], jsdocTags);
                        }
                        wroteJsDoc = true;
                    }
                }
                else {
                    // Otherwise it's an interface; tag it as structurally typed.
                    jsdocTags.push({ tagName: 'record' }, { tagName: 'struct' });
                }
                if (!wroteJsDoc)
                    emit(jsdoc.toString(jsdocTags));
                writeFunction(name, paramNames, namespace);
            }
            // Process everything except (MethodSignature|MethodDeclaration|Constructor)
            var methods = new Map();
            try {
                for (var _c = __values(decl.members), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var member = _d.value;
                    switch (member.kind) {
                        case ts.SyntaxKind.PropertySignature:
                        case ts.SyntaxKind.PropertyDeclaration:
                            var prop = member;
                            if (prop.name.kind === ts.SyntaxKind.Identifier) {
                                var type = mtt.typeToClosure(prop);
                                if (prop.questionToken && type === '?') {
                                    // An optional 'any' type translates to '?|undefined' in Closure.
                                    type = '?|undefined';
                                }
                                emit(jsdoc.toString([{ tagName: 'type', type: type }]));
                                if (transformer_util_1.hasModifierFlag(prop, ts.ModifierFlags.Static)) {
                                    emit("\n" + typeName + "." + prop.name.getText() + ";\n");
                                }
                                else {
                                    emit("\n" + typeName + ".prototype." + prop.name.getText() + ";\n");
                                }
                                continue;
                            }
                            // TODO: For now property names other than Identifiers are not handled; e.g.
                            //    interface Foo { "123bar": number }
                            break;
                        case ts.SyntaxKind.MethodSignature:
                        case ts.SyntaxKind.MethodDeclaration:
                            var method = member;
                            var isStatic = transformer_util_1.hasModifierFlag(method, ts.ModifierFlags.Static);
                            var methodSignature = method.name.getText() + "$$$" + (isStatic ? 'static' : 'instance');
                            if (methods.has(methodSignature)) {
                                methods.get(methodSignature).push(method);
                            }
                            else {
                                methods.set(methodSignature, [method]);
                            }
                            continue;
                        case ts.SyntaxKind.Constructor:
                            continue; // Handled above.
                        default:
                            // Members can include things like index signatures, for e.g.
                            //   interface Foo { [key: string]: number; }
                            // For now, just skip it.
                            break;
                    }
                    // If we get here, the member wasn't handled in the switch statement.
                    var memberName = namespace;
                    if (member.name) {
                        memberName = memberName.concat([member.name.getText()]);
                    }
                    emit("\n/* TODO: " + ts.SyntaxKind[member.kind] + ": " + memberName.join('.') + " */\n");
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_5) throw e_5.error; }
            }
            try {
                // Handle method declarations/signatures separately, since we need to deal with overloads.
                for (var _e = __values(Array.from(methods.values())), _f = _e.next(); !_f.done; _f = _e.next()) {
                    var methodVariants = _f.value;
                    var firstMethodVariant = methodVariants[0];
                    var parameterNames = void 0;
                    if (methodVariants.length > 1) {
                        parameterNames = emitFunctionType(methodVariants);
                    }
                    else {
                        parameterNames = emitFunctionType([firstMethodVariant]);
                    }
                    var methodNamespace = namespace.concat([name.getText()]);
                    // If the method is static, don't add the prototype.
                    if (!transformer_util_1.hasModifierFlag(firstMethodVariant, ts.ModifierFlags.Static)) {
                        methodNamespace.push('prototype');
                    }
                    writeFunction(firstMethodVariant.name, parameterNames, methodNamespace);
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                }
                finally { if (e_6) throw e_6.error; }
            }
        }
        function writeExportDeclaration(exportDeclaration, namespace) {
            var e_7, _a;
            if (!exportDeclaration.exportClause) {
                emit("\n// TODO(tsickle): export * declaration in " + debugLocationStr(exportDeclaration, namespace) + "\n");
                return;
            }
            try {
                for (var _b = __values(exportDeclaration.exportClause.elements), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var exportSpecifier = _c.value;
                    // No need to do anything for properties exported under their original name.
                    if (!exportSpecifier.propertyName)
                        continue;
                    emit('/** @const */\n');
                    writeVariableStatement(exportSpecifier.name.text, namespace, namespace.join('.') + '.' + exportSpecifier.propertyName.text);
                }
            }
            catch (e_7_1) { e_7 = { error: e_7_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_7) throw e_7.error; }
            }
        }
        /**
         * Adds aliases for the symbols imported in the given declaration, so that their types get
         * printed as the fully qualified name, and not just as a reference to the local import alias.
         *
         * tsickle generates .js files that (at most) contain a `goog.provide`, but are not
         * `goog.module`s. These files cannot express an aliased import. However Closure Compiler allows
         * referencing types using fully qualified names in such files, so tsickle can resolve the
         * imported module URI and produce `path.to.module.Symbol` as an alias, and use that when
         * referencing the type.
         */
        function addImportAliases(decl) {
            var e_8, _a;
            var moduleUri;
            if (ts.isImportDeclaration(decl)) {
                moduleUri = decl.moduleSpecifier.text;
            }
            else if (ts.isExternalModuleReference(decl.moduleReference)) {
                // import foo = require('./bar');
                moduleUri = decl.moduleReference.expression.text;
            }
            else {
                // import foo = bar.baz.bam;
                // unsupported.
                return;
            }
            var googNamespace = googmodule_1.extractGoogNamespaceImport(moduleUri);
            var moduleName = googNamespace ||
                host.pathToModuleName(sourceFile.fileName, googmodule_1.resolveModuleName(host, sourceFile.fileName, moduleUri));
            if (ts.isImportEqualsDeclaration(decl)) {
                // import foo = require('./bar');
                addImportAlias(decl.name, moduleName, undefined);
                return;
            }
            // Side effect import 'path'; declares no local aliases.
            if (!decl.importClause)
                return;
            if (decl.importClause.name) {
                // import name from ... -> map to .default on the module.name.
                if (googNamespace) {
                    addImportAlias(decl.importClause.name, googNamespace, undefined);
                }
                else {
                    addImportAlias(decl.importClause.name, moduleName, 'default');
                }
            }
            var namedBindings = decl.importClause.namedBindings;
            if (!namedBindings)
                return;
            if (ts.isNamespaceImport(namedBindings)) {
                // import * as name -> map directly to the module.name.
                addImportAlias(namedBindings.name, moduleName, undefined);
            }
            if (ts.isNamedImports(namedBindings)) {
                try {
                    // import {A as B}, map to module.name.A
                    for (var _b = __values(namedBindings.elements), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var namedBinding = _c.value;
                        addImportAlias(namedBinding.name, moduleName, namedBinding.name);
                    }
                }
                catch (e_8_1) { e_8 = { error: e_8_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_8) throw e_8.error; }
                }
            }
        }
        /**
         * Adds an import alias for the symbol defined at the given node. Creates an alias name based on
         * the given moduleName and (optionally) the name.
         */
        function addImportAlias(node, moduleName, name) {
            var symbol = typeChecker.getSymbolAtLocation(node);
            if (!symbol) {
                transformer_util_1.reportDiagnostic(diagnostics, node, "named import has no symbol");
                return;
            }
            var aliasName = moduleName;
            if (typeof name === 'string') {
                aliasName += '.' + name;
            }
            else if (name) {
                aliasName += '.' + transformer_util_1.getIdentifierText(name);
            }
            if (symbol.flags & ts.SymbolFlags.Alias) {
                symbol = typeChecker.getAliasedSymbol(symbol);
            }
            mtt.symbolsToAliasedNames.set(symbol, aliasName);
        }
        /**
         * Produces a compiler error that references the Node's kind. This is useful for the "else"
         * branch of code that is attempting to handle all possible input Node types, to ensure all cases
         * covered.
         */
        function errorUnimplementedKind(node, where) {
            transformer_util_1.reportDiagnostic(diagnostics, node, ts.SyntaxKind[node.kind] + " not implemented in " + where);
        }
        /**
         * getNamespaceForLocalDeclaration returns the namespace that should be used for the given
         * declaration, deciding whether to namespace the symbol to the file or whether to create a
         * global name.
         *
         * The function covers these cases:
         * 1) a declaration in a .d.ts
         * 1a) where the .d.ts is an external module     --> namespace
         * 1b) where the .d.ts is not an external module --> global
         * 2) a declaration in a .ts file (all are treated as modules)
         * 2a) that is exported                          --> namespace
         * 2b) that is unexported                        --> global
         *
         * For 1), all symbols in .d.ts should generally be namespaced to the file to avoid collisions.
         * However .d.ts files that are not external modules do declare global names (1b).
         *
         * For 2), ambient declarations in .ts files must be namespaced, for the same collision reasons.
         * The exception is 2b), where in TypeScript, an unexported local "declare const x: string;"
         * creates a symbol that, when used locally, is emitted as just "x". That is, it behaves
         * like a variable declared in a 'declare global' block. Closure Compiler would fail the build if
         * there is no declaration for "x", so tsickle must generate a global external symbol, i.e.
         * without the namespace wrapper.
         */
        function getNamespaceForTopLevelDeclaration(declaration, namespace) {
            // Only use rootNamespace for top level symbols, any other namespacing (global names, nested
            // namespaces) is always kept.
            if (namespace.length !== 0)
                return namespace;
            // All names in a module (external) .d.ts file can only be accessed locally, so they always get
            // namespace prefixed.
            if (isDts && isExternalModule)
                return [rootNamespace];
            // Same for exported declarations in regular .ts files.
            if (transformer_util_1.hasModifierFlag(declaration, ts.ModifierFlags.Export))
                return [rootNamespace];
            // But local declarations in .ts files or .d.ts files (1b, 2b) are global, too.
            return [];
        }
        /**
         * Returns a string representation for the location: either the namespace, or, if empty, the
         * current source file name. This is intended to be included in the emit for warnings, so that
         * users can more easily find where a problematic definition is from.
         *
         * The code below does not use diagnostics to avoid breaking the build for harmless unhandled
         * cases.
         */
        function debugLocationStr(node, namespace) {
            return namespace.join('.') || path.basename(node.getSourceFile().fileName);
        }
        function visitor(node, namespace) {
            var e_9, _a, e_10, _b;
            if (node.parent === sourceFile) {
                namespace = getNamespaceForTopLevelDeclaration(node, namespace);
            }
            switch (node.kind) {
                case ts.SyntaxKind.ModuleDeclaration:
                    var decl = node;
                    switch (decl.name.kind) {
                        case ts.SyntaxKind.Identifier:
                            if (decl.flags & ts.NodeFlags.GlobalAugmentation) {
                                // E.g. "declare global { ... }".  Reset to the outer namespace.
                                namespace = [];
                            }
                            else {
                                // E.g. "declare namespace foo {"
                                var name_2 = transformer_util_1.getIdentifierText(decl.name);
                                if (isFirstValueDeclaration(decl)) {
                                    emit('/** @const */\n');
                                    writeVariableStatement(name_2, namespace, '{}');
                                }
                                namespace = namespace.concat(name_2);
                            }
                            if (decl.body)
                                visitor(decl.body, namespace);
                            break;
                        case ts.SyntaxKind.StringLiteral:
                            // E.g. "declare module 'foo' {" (note the quotes).
                            // We still want to emit externs for this module, but Closure doesn't provide a
                            // mechanism for module-scoped externs. Instead, we emit in a mangled namespace.
                            // The mangled namespace (after resolving files) matches the emit for an original module
                            // file, so effectively this augments any existing module.
                            var importName = decl.name.text;
                            var importedModuleName = googmodule_1.resolveModuleName({ moduleResolutionHost: moduleResolutionHost, options: options }, sourceFile.fileName, importName);
                            var mangled = annotator_host_1.moduleNameAsIdentifier(host, importedModuleName);
                            emit("// Derived from: declare module \"" + importName + "\"\n");
                            namespace = [mangled];
                            // Declare "mangled$name" if it's not declared already elsewhere.
                            if (isFirstValueDeclaration(decl)) {
                                emit('/** @const */\n');
                                writeVariableStatement(mangled, [], '{}');
                            }
                            // Declare the contents inside the "mangled$name".
                            if (decl.body)
                                visitor(decl.body, [mangled]);
                            break;
                        default:
                            errorUnimplementedKind(decl.name, 'externs generation of namespace');
                            break;
                    }
                    break;
                case ts.SyntaxKind.ModuleBlock:
                    var block = node;
                    try {
                        for (var _c = __values(block.statements), _d = _c.next(); !_d.done; _d = _c.next()) {
                            var stmt = _d.value;
                            visitor(stmt, namespace);
                        }
                    }
                    catch (e_9_1) { e_9 = { error: e_9_1 }; }
                    finally {
                        try {
                            if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                        }
                        finally { if (e_9) throw e_9.error; }
                    }
                    break;
                case ts.SyntaxKind.ImportEqualsDeclaration:
                    var importEquals = node;
                    var localName = transformer_util_1.getIdentifierText(importEquals.name);
                    if (localName === 'ng') {
                        emit("\n/* Skipping problematic import ng = ...; */\n");
                        break;
                    }
                    if (importEquals.moduleReference.kind === ts.SyntaxKind.ExternalModuleReference) {
                        addImportAliases(importEquals);
                        break;
                    }
                    var qn = transformer_util_1.getEntityNameText(importEquals.moduleReference);
                    // @const so that Closure Compiler understands this is an alias.
                    if (namespace.length === 0)
                        emit('/** @const */\n');
                    writeVariableStatement(localName, namespace, qn);
                    break;
                case ts.SyntaxKind.ClassDeclaration:
                case ts.SyntaxKind.InterfaceDeclaration:
                    writeType(node, namespace);
                    break;
                case ts.SyntaxKind.FunctionDeclaration:
                    var fnDecl = node;
                    var name_3 = fnDecl.name;
                    if (!name_3) {
                        transformer_util_1.reportDiagnostic(diagnostics, fnDecl, 'anonymous function in externs');
                        break;
                    }
                    // Gather up all overloads of this function.
                    var sym = typeChecker.getSymbolAtLocation(name_3);
                    var decls = sym.declarations.filter(ts.isFunctionDeclaration);
                    // Only emit the first declaration of each overloaded function.
                    if (fnDecl !== decls[0])
                        break;
                    var params = emitFunctionType(decls);
                    writeFunction(name_3, params, namespace);
                    break;
                case ts.SyntaxKind.VariableStatement:
                    try {
                        for (var _e = __values(node.declarationList.declarations), _f = _e.next(); !_f.done; _f = _e.next()) {
                            var decl_1 = _f.value;
                            writeVariableDeclaration(decl_1, namespace);
                        }
                    }
                    catch (e_10_1) { e_10 = { error: e_10_1 }; }
                    finally {
                        try {
                            if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                        }
                        finally { if (e_10) throw e_10.error; }
                    }
                    break;
                case ts.SyntaxKind.EnumDeclaration:
                    writeEnum(node, namespace);
                    break;
                case ts.SyntaxKind.TypeAliasDeclaration:
                    writeTypeAlias(node, namespace);
                    break;
                case ts.SyntaxKind.ImportDeclaration:
                    addImportAliases(node);
                    break;
                case ts.SyntaxKind.NamespaceExportDeclaration:
                case ts.SyntaxKind.ExportAssignment:
                    // Handled on the file level.
                    break;
                case ts.SyntaxKind.ExportDeclaration:
                    var exportDeclaration = node;
                    writeExportDeclaration(exportDeclaration, namespace);
                    break;
                default:
                    emit("\n// TODO(tsickle): " + ts.SyntaxKind[node.kind] + " in " + debugLocationStr(node, namespace) + "\n");
                    break;
            }
        }
    }
    exports.generateExterns = generateExterns;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0ZXJucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9leHRlcm5zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQUVIOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQStDRztJQUVILDJCQUE2QjtJQUM3QiwrQkFBaUM7SUFFakMsNkRBQXVFO0lBQ3ZFLGlFQUErQztJQUMvQyxxREFBMkU7SUFDM0UseUNBQWlDO0lBQ2pDLG1FQUFzRztJQUN0Ryw2RUFBOEQ7SUFDOUQsaUVBQTBIO0lBQzFILCtEQUE2RDtJQUU3RDs7O09BR0c7SUFDSCxJQUFNLHlCQUF5QixHQUEwQjtRQUN2RCxTQUFTO1FBQ1QsUUFBUTtRQUNSLFFBQVE7UUFDUixnRUFBZ0U7UUFDaEUsdUVBQXVFO1FBQ3ZFLGtFQUFrRTtRQUNsRSxxRUFBcUU7UUFDckUsbUVBQW1FO1FBQ25FLHdFQUF3RTtRQUN4RSxnQ0FBZ0M7UUFDaEMsa0JBQWtCO1FBQ2xCLFFBQVE7UUFDUixtQkFBbUI7S0FDcEIsQ0FBQztJQUdGOzs7Ozs7Ozs7O09BVUc7SUFDSCxJQUFNLGNBQWMsR0FBRywyR0FLdEIsQ0FBQztJQUVGOzs7Ozs7T0FNRztJQUNILFNBQWdCLG1CQUFtQixDQUFDLE9BQXFDLEVBQUUsT0FBWTtRQUFaLHdCQUFBLEVBQUEsWUFBWTs7UUFDckYsSUFBSSxVQUFVLEdBQUcsY0FBYyxDQUFDOztZQUNoQyxLQUF1QixJQUFBLEtBQUEsU0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBLGdCQUFBLDRCQUFFO2dCQUF4QyxJQUFNLFFBQVEsV0FBQTtnQkFDakIsVUFBVSxJQUFJLHFCQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsUUFBSyxDQUFDO2dCQUN2RSxVQUFVLElBQUksT0FBTyxDQUFDLFFBQVEs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QzdCLE1BQU07Z0JBQ1IsS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLGlCQUFpQjtvQkFDbEMsSUFBTSxpQkFBaUIsR0FBRyxJQUE0QixDQUFDO29CQUN2RCxzQkFBc0IsQ0FBQyxpQkFBaUIsRUFBRSxTQUFTLENBQUMsQ0FBQztvQkFDckQsTUFBTTtnQkFDUjtvQkFDRSxJQUFJLENBQUMseUJBQXVCLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUNoRCxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLE9BQUksQ0FBQyxDQUFDO29CQUMzQyxNQUFNO2FBQ1Q7UUFDSCxDQUFDO0lBQ0gsQ0FBQztJQS9rQkQsMENBK2tCQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IEV4dGVybnMgY3JlYXRlcyBDbG9zdXJlIENvbXBpbGVyIFxcQGV4dGVybnMgZGVmaW5pdGlvbnMgZnJvbSB0aGVcbiAqIGFtYmllbnQgZGVjbGFyYXRpb25zIGluIGEgVHlwZVNjcmlwdCBmaWxlLlxuICpcbiAqIEZvciBleGFtcGxlLCBhIGRlY2xhcmUgaW50ZXJmYWNlIEZvbyB7IGJhcjogc3RyaW5nOyB9IFdvdWxkIGdlbmVyYXRlIGEgLy4uXG4gKiAgIFxcQGV4dGVybnMgLi8gLy4uIFxcQHJlY29yZCAuLyB2YXIgRm9vID0gZnVuY3Rpb24oKSB7fTsgLy4uIFxcQHR5cGUge3N0cmluZ31cbiAqICAgLi8gRm9vLnByb3RvdHlwZS5iYXI7XG4gKlxuICogVGhlIGdlbmVyYXRlZCBleHRlcm5zIGluZGljYXRlIHRvIENsb3N1cmUgQ29tcGlsZXIgdGhhdCBzeW1ib2xzIGFyZSBleHRlcm5hbFxuICogdG8gdGhlIG9wdGltaXphdGlvbiBwcm9jZXNzLCBpLmUuIHRoZXkgYXJlIHByb3ZpZGVkIGJ5IG91dHNpZGUgY29kZS4gVGhhdFxuICogbW9zdCBpbXBvcnRhbnRseSBtZWFucyB0aGV5IG11c3Qgbm90IGJlIHJlbmFtZWQgb3IgcmVtb3ZlZC5cbiAqXG4gKiBBIG1ham9yIGRpZmZpY3VsdHkgaGVyZSBpcyB0aGF0IFR5cGVTY3JpcHQgc3VwcG9ydHMgbW9kdWxlLXNjb3BlZCBleHRlcm5hbFxuICogc3ltYm9sczsgYC5kLnRzYCBmaWxlcyBjYW4gY29udGFpbiBgZXhwb3J0YHMgYW5kIGBpbXBvcnRgIG90aGVyIGZpbGVzLlxuICogQ2xvc3VyZSBDb21waWxlciBkb2VzIG5vdCBoYXZlIHN1Y2ggYSBjb25jZXB0LCBzbyB0c2lja2xlIG11c3QgZW11bGF0ZSB0aGVcbiAqIGJlaGF2aW91ci4gSXQgZG9lcyBzbyBieSBmb2xsb3dpbmcgdGhpcyBzY2hlbWU6XG4gKlxuICogMS4gbm9uLW1vZHVsZSAuZC50cyBwcm9kdWNlcyBnbG9iYWwgc3ltYm9sc1xuICogMi4gbW9kdWxlIC5kLnRzIHByb2R1Y2Ugc3ltYm9scyBuYW1lc3BhY2VkIHRvIHRoZSBtb2R1bGUsIGJ5IGNyZWF0aW5nIGFcbiAqICAgIG1hbmdsZWQgbmFtZSBtYXRjaGluZyB0aGUgY3VycmVudCBmaWxlJ3MgcGF0aC4gdHNpY2tsZSBleHBlY3RzIG91dHNpZGVcbiAqICAgIGNvZGUgKGUuZy4gYnVpbGQgc3lzdGVtIGludGVncmF0aW9uIG9yIG1hbnVhbGx5IHdyaXR0ZW4gY29kZSkgdG8gY29udGFpbiBhXG4gKiAgICBnb29nLm1vZHVsZS9wcm92aWRlIHRoYXQgcmVmZXJlbmNlcyB0aGUgbWFuZ2xlZCBwYXRoLlxuICogMy4gZGVjbGFyYXRpb25zIGluIGAudHNgIGZpbGVzIHByb2R1Y2UgdHlwZXMgdGhhdCBjYW4gYmUgc2VwYXJhdGVseSBlbWl0dGVkXG4gKiAgICBpbiBlLmcuIGFuIGBleHRlcm5zLmpzYCwgdXNpbmcgYGdldEdlbmVyYXRlZEV4dGVybnNgIGJlbG93LlxuICogICAgMS4gbm9uLWV4cG9ydGVkIHN5bWJvbHMgcHJvZHVjZSBnbG9iYWwgdHlwZXMsIGJlY2F1c2UgdGhhdCdzIHdoYXQgdXNlcnNcbiAqICAgICAgIGV4cGVjdCBhbmQgaXQgbWF0Y2hlcyBUeXBlU2NyaXB0cyBlbWl0LCB3aGljaCBqdXN0IHJlZmVyZW5jZXMgYEZvb2AgZm9yXG4gKiAgICAgICBhIGxvY2FsbHkgZGVjbGFyZWQgc3ltYm9sIGBGb29gIGluIGEgbW9kdWxlLiBBcmd1YWJseSB0aGVzZSBzaG91bGQgYmVcbiAqICAgICAgIHdyYXBwZWQgaW4gYGRlY2xhcmUgZ2xvYmFsIHsgLi4uIH1gLlxuICogICAgMi4gZXhwb3J0ZWQgc3ltYm9scyBhcmUgc2NvcGVkIHRvIHRoZSBgLnRzYCBmaWxlIGJ5IHByZWZpeGluZyB0aGVtIHdpdGggYVxuICogICAgICAgbWFuZ2xlZCBuYW1lLiBFeHBvcnRlZCB0eXBlcyBhcmUgcmUtZXhwb3J0ZWQgZnJvbSB0aGUgSmF2YVNjcmlwdFxuICogICAgICAgYGdvb2cubW9kdWxlYCwgYWxsb3dpbmcgZG93bnN0cmVhbSBjb2RlIHRvIHJlZmVyZW5jZSB0aGVtLiBUaGlzIGhhcyB0aGVcbiAqICAgICAgIHNhbWUgcHJvYmxlbSByZWdhcmRpbmcgYW1iaWVudCB2YWx1ZXMgYXMgYWJvdmUsIGl0IGlzIHVuY2xlYXIgd2hlcmUgdGhlXG4gKiAgICAgICB2YWx1ZSBzeW1ib2wgd291bGQgYmUgZGVmaW5lZCwgc28gZm9yIHRoZSB0aW1lIGJlaW5nIHRoaXMgaXNcbiAqICAgICAgIHVuc3VwcG9ydGVkLlxuICpcbiAqIFRoZSBlZmZlY3Qgb2YgdGhpcyBpcyB0aGF0OlxuICogLSBzeW1ib2xzIGluIGEgbW9kdWxlIChpLmUuIG5vdCBnbG9iYWxzKSBhcmUgZ2VuZXJhbGx5IHNjb3BlZCB0byB0aGUgbG9jYWxcbiAqICAgbW9kdWxlIHVzaW5nIGEgbWFuZ2xlZCBuYW1lLCBwcmV2ZW50aW5nIHN5bWJvbCBjb2xsaXNpb25zIG9uIHRoZSBDbG9zdXJlXG4gKiAgIHNpZGUuXG4gKiAtIGltcG9ydGluZyBjb2RlIGNhbiB1bmNvbmRpdGlvbmFsbHkgcmVmZXIgdG8gYW5kIGltcG9ydCBhbnkgc3ltYm9sIGRlZmluZWRcbiAqICAgaW4gYSBtb2R1bGUgYFhgIGFzIGBwYXRoLnRvLm1vZHVsZS5YYCwgcmVnYXJkbGVzcyBvZiB3aGV0aGVyIHRoZSBkZWZpbmluZ1xuICogICBsb2NhdGlvbiBpcyBhIGAuZC50c2AgZmlsZSBvciBhIGAudHNgIGZpbGUsIGFuZCByZWdhcmRsZXNzIHdoZXRoZXIgdGhlXG4gKiAgIHN5bWJvbCBpcyBhbWJpZW50IChhc3N1bWluZyB0aGVyZSdzIGFuIGFwcHJvcHJpYXRlIHNoaW0pLlxuICogLSBpZiB0aGVyZSBpcyBhIHNoaW0gcHJlc2VudCwgdHNpY2tsZSBhdm9pZHMgZW1pdHRpbmcgdGhlIENsb3N1cmUgbmFtZXNwYWNlXG4gKiAgIGl0c2VsZiwgZXhwZWN0aW5nIHRoZSBzaGltIHRvIHByb3ZpZGUgdGhlIG5hbWVzcGFjZSBhbmQgaW5pdGlhbGl6ZSBpdCB0byBhXG4gKiAgIHN5bWJvbCB0aGF0IHByb3ZpZGVzIHRoZSByaWdodCB2YWx1ZSBhdCBydW50aW1lIChpLmUuIHRoZSBpbXBsZW1lbnRhdGlvbiBvZlxuICogICB3aGF0ZXZlciB0aGlyZCBwYXJ0eSBsaWJyYXJ5IHRoZSAuZC50cyBkZXNjcmliZXMpLlxuICovXG5cbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcblxuaW1wb3J0IHtBbm5vdGF0b3JIb3N0LCBtb2R1bGVOYW1lQXNJZGVudGlmaWVyfSBmcm9tICcuL2Fubm90YXRvcl9ob3N0JztcbmltcG9ydCB7Z2V0RW51bVR5cGV9IGZyb20gJy4vZW51bV90cmFuc2Zvcm1lcic7XG5pbXBvcnQge2V4dHJhY3RHb29nTmFtZXNwYWNlSW1wb3J0LCByZXNvbHZlTW9kdWxlTmFtZX0gZnJvbSAnLi9nb29nbW9kdWxlJztcbmltcG9ydCAqIGFzIGpzZG9jIGZyb20gJy4vanNkb2MnO1xuaW1wb3J0IHtlc2NhcGVGb3JDb21tZW50LCBtYXliZUFkZEhlcml0YWdlQ2xhdXNlcywgbWF5YmVBZGRUZW1wbGF0ZUNsYXVzZX0gZnJvbSAnLi9qc2RvY190cmFuc2Zvcm1lcic7XG5pbXBvcnQge01vZHVsZVR5cGVUcmFuc2xhdG9yfSBmcm9tICcuL21vZHVsZV90eXBlX3RyYW5zbGF0b3InO1xuaW1wb3J0IHtnZXRFbnRpdHlOYW1lVGV4dCwgZ2V0SWRlbnRpZmllclRleHQsIGhhc01vZGlmaWVyRmxhZywgaXNEdHNGaWxlTmFtZSwgcmVwb3J0RGlhZ25vc3RpY30gZnJvbSAnLi90cmFuc2Zvcm1lcl91dGlsJztcbmltcG9ydCB7aXNWYWxpZENsb3N1cmVQcm9wZXJ0eU5hbWV9IGZyb20gJy4vdHlwZV90cmFuc2xhdG9yJztcblxuLyoqXG4gKiBTeW1ib2xzIHRoYXQgYXJlIGFscmVhZHkgZGVjbGFyZWQgYXMgZXh0ZXJucyBpbiBDbG9zdXJlLCB0aGF0IHNob3VsZFxuICogYmUgYXZvaWRlZCBieSB0c2lja2xlJ3MgXCJkZWNsYXJlIC4uLlwiID0+IGV4dGVybnMuanMgY29udmVyc2lvbi5cbiAqL1xuY29uc3QgQ0xPU1VSRV9FWFRFUk5TX0JMQUNLTElTVDogUmVhZG9ubHlBcnJheTxzdHJpbmc+ID0gW1xuICAnZXhwb3J0cycsXG4gICdnbG9iYWwnLFxuICAnbW9kdWxlJyxcbiAgLy8gRXJyb3JDb25zdHJ1Y3RvciBpcyB0aGUgaW50ZXJmYWNlIG9mIHRoZSBFcnJvciBvYmplY3QgaXRzZWxmLlxuICAvLyB0c2lja2xlIGRldGVjdHMgdGhhdCB0aGlzIGlzIHBhcnQgb2YgdGhlIFR5cGVTY3JpcHQgc3RhbmRhcmQgbGlicmFyeVxuICAvLyBhbmQgYXNzdW1lcyBpdCdzIHBhcnQgb2YgdGhlIENsb3N1cmUgc3RhbmRhcmQgbGlicmFyeSwgYnV0IHRoaXNcbiAgLy8gYXNzdW1wdGlvbiBpcyB3cm9uZyBmb3IgRXJyb3JDb25zdHJ1Y3Rvci4gIFRvIHByb3Blcmx5IGhhbmRsZSB0aGlzXG4gIC8vIHdlJ2Qgc29tZWhvdyBuZWVkIHRvIG1hcCBtZXRob2RzIGRlZmluZWQgb24gdGhlIEVycm9yQ29uc3RydWN0b3JcbiAgLy8gaW50ZXJmYWNlIGludG8gcHJvcGVydGllcyBvbiBDbG9zdXJlJ3MgRXJyb3Igb2JqZWN0LCBidXQgZm9yIG5vdyBpdCdzXG4gIC8vIHNpbXBsZXIgdG8ganVzdCBibGFja2xpc3QgaXQuXG4gICdFcnJvckNvbnN0cnVjdG9yJyxcbiAgJ1N5bWJvbCcsXG4gICdXb3JrZXJHbG9iYWxTY29wZScsXG5dO1xuXG5cbi8qKlxuICogVGhlIGhlYWRlciB0byBiZSB1c2VkIGluIGdlbmVyYXRlZCBleHRlcm5zLiAgVGhpcyBpcyBub3QgaW5jbHVkZWQgaW4gdGhlIG91dHB1dCBvZlxuICogZ2VuZXJhdGVFeHRlcm5zKCkgYmVjYXVzZSBnZW5lcmF0ZUV4dGVybnMoKSB3b3JrcyBvbmUgZmlsZSBhdCBhIHRpbWUsIGFuZCB0eXBpY2FsbHkgeW91IGNyZWF0ZVxuICogb25lIGV4dGVybnMgZmlsZSBmcm9tIHRoZSBlbnRpcmUgY29tcGlsYXRpb24gdW5pdC5cbiAqXG4gKiBTdXBwcmVzc2lvbnM6XG4gKiAtIGR1cGxpY2F0ZTogYmVjYXVzZSBleHRlcm5zIG1pZ2h0IGR1cGxpY2F0ZSByZS1vcGVuZWQgZGVmaW5pdGlvbnMgZnJvbSBvdGhlciBKUyBmaWxlcy5cbiAqIC0gY2hlY2tUeXBlczogQ2xvc3VyZSdzIHR5cGUgc3lzdGVtIGRvZXMgbm90IG1hdGNoIFRTJy5cbiAqIC0gdW5kZWZpbmVkTmFtZXM6IGNvZGUgYmVsb3cgdHJpZXMgdG8gYmUgY2FyZWZ1bCBub3QgdG8gb3ZlcndyaXRlIHByZXZpb3VzbHkgZW1pdHRlZCBkZWZpbml0aW9ucyxcbiAqICAgYnV0IG9uIHRoZSBmbGlwIHNpZGUgbWlnaHQgYWNjaWRlbnRhbGx5IG1pc3MgZGVmaW5pdGlvbnMuXG4gKi9cbmNvbnN0IEVYVEVSTlNfSEVBREVSID0gYC8qKlxuICogQGV4dGVybnNcbiAqIEBzdXBwcmVzcyB7ZHVwbGljYXRlLGNoZWNrVHlwZXN9XG4gKi9cbi8vIE5PVEU6IGdlbmVyYXRlZCBieSB0c2lja2xlLCBkbyBub3QgZWRpdC5cbmA7XG5cbi8qKlxuICogQ29uY2F0ZW5hdGUgYWxsIGdlbmVyYXRlZCBleHRlcm5zIGRlZmluaXRpb25zIHRvZ2V0aGVyIGludG8gYSBzdHJpbmcsIGluY2x1ZGluZyBhIGZpbGUgY29tbWVudFxuICogaGVhZGVyLlxuICpcbiAqIEBwYXJhbSByb290RGlyIFByb2plY3Qgcm9vdC4gIEVtaXR0ZWQgY29tbWVudHMgd2lsbCByZWZlcmVuY2UgcGF0aHMgcmVsYXRpdmUgdG8gdGhpcyByb290LlxuICogICAgVGhpcyBwYXJhbSBpcyBlZmZlY3RpdmVseSByZXF1aXJlZCwgYnV0IG1hZGUgb3B0aW9uYWwgaGVyZSB1bnRpbCBBbmd1bGFyIGlzIGZpeGVkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0R2VuZXJhdGVkRXh0ZXJucyhleHRlcm5zOiB7W2ZpbGVOYW1lOiBzdHJpbmddOiBzdHJpbmd9LCByb290RGlyID0gJycpOiBzdHJpbmcge1xuICBsZXQgYWxsRXh0ZXJucyA9IEVYVEVSTlNfSEVBREVSO1xuICBmb3IgKGNvbnN0IGZpbGVOYW1lIG9mIE9iamVjdC5rZXlzKGV4dGVybnMpKSB7XG4gICAgYWxsRXh0ZXJucyArPSBgLy8gZXh0ZXJucyBmcm9tICR7cGF0aC5yZWxhdGl2ZShyb290RGlyLCBmaWxlTmFtZSl9OlxcbmA7XG4gICAgYWxsRXh0ZXJucyArPSBleHRlcm5zW2ZpbGVOYW1lXTtcbiAgfVxuICByZXR1cm4gYWxsRXh0ZXJucztcbn1cblxuLyoqXG4gKiBpc0luR2xvYmFsQXVnbWVudGF0aW9uIHJldHVybnMgdHJ1ZSBpZiBkZWNsYXJhdGlvbiBpcyB0aGUgaW1tZWRpYXRlIGNoaWxkIG9mIGEgJ2RlY2xhcmUgZ2xvYmFsJ1xuICogYmxvY2suXG4gKi9cbmZ1bmN0aW9uIGlzSW5HbG9iYWxBdWdtZW50YXRpb24oZGVjbGFyYXRpb246IHRzLkRlY2xhcmF0aW9uKTogYm9vbGVhbiB7XG4gIC8vIGRlY2xhcmUgZ2xvYmFsIHsgLi4uIH0gY3JlYXRlcyBhIE1vZHVsZURlY2xhcmF0aW9uIGNvbnRhaW5pbmcgYSBNb2R1bGVCbG9jayBjb250YWluaW5nIHRoZVxuICAvLyBkZWNsYXJhdGlvbiwgd2l0aCB0aGUgTW9kdWxlRGVjbGFyYXRpb24gaGF2aW5nIHRoZSBHbG9iYWxBdWdtZW50YXRpb24gZmxhZyBzZXQuXG4gIGlmICghZGVjbGFyYXRpb24ucGFyZW50IHx8ICFkZWNsYXJhdGlvbi5wYXJlbnQucGFyZW50KSByZXR1cm4gZmFsc2U7XG4gIHJldHVybiAoZGVjbGFyYXRpb24ucGFyZW50LnBhcmVudC5mbGFncyAmIHRzLk5vZGVGbGFncy5HbG9iYWxBdWdtZW50YXRpb24pICE9PSAwO1xufVxuXG4vKipcbiAqIGdlbmVyYXRlRXh0ZXJucyBnZW5lcmF0ZXMgZXh0ZXJuIGRlZmluaXRpb25zIGZvciBhbGwgYW1iaWVudCBkZWNsYXJhdGlvbnMgaW4gdGhlIGdpdmVuIHNvdXJjZVxuICogZmlsZS4gSXQgcmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgQ2xvc3VyZSBKYXZhU2NyaXB0LCBub3QgaW5jbHVkaW5nIHRoZSBpbml0aWFsXG4gKiBjb21tZW50IHdpdGggXFxAZmlsZW92ZXJ2aWV3IGFuZCBcXEBleHRlcm5zIChzZWUgYWJvdmUgZm9yIHRoYXQpLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2VuZXJhdGVFeHRlcm5zKFxuICAgIHR5cGVDaGVja2VyOiB0cy5UeXBlQ2hlY2tlciwgc291cmNlRmlsZTogdHMuU291cmNlRmlsZSwgaG9zdDogQW5ub3RhdG9ySG9zdCxcbiAgICBtb2R1bGVSZXNvbHV0aW9uSG9zdDogdHMuTW9kdWxlUmVzb2x1dGlvbkhvc3QsXG4gICAgb3B0aW9uczogdHMuQ29tcGlsZXJPcHRpb25zKToge291dHB1dDogc3RyaW5nLCBkaWFnbm9zdGljczogdHMuRGlhZ25vc3RpY1tdfSB7XG4gIGxldCBvdXRwdXQgPSAnJztcbiAgY29uc3QgZGlhZ25vc3RpY3M6IHRzLkRpYWdub3N0aWNbXSA9IFtdO1xuICBjb25zdCBpc0R0cyA9IGlzRHRzRmlsZU5hbWUoc291cmNlRmlsZS5maWxlTmFtZSk7XG4gIGNvbnN0IGlzRXh0ZXJuYWxNb2R1bGUgPSB0cy5pc0V4dGVybmFsTW9kdWxlKHNvdXJjZUZpbGUpO1xuXG4gIGNvbnN0IG10dCA9XG4gICAgICBuZXcgTW9kdWxlVHlwZVRyYW5zbGF0b3Ioc291cmNlRmlsZSwgdHlwZUNoZWNrZXIsIGhvc3QsIGRpYWdub3N0aWNzLCAvKmlzRm9yRXh0ZXJucyovIHRydWUpO1xuXG4gIGxldCByb290TmFtZXNwYWNlID0gJyc7XG4gIGlmIChpc0V4dGVybmFsTW9kdWxlKSB7XG4gICAgLy8gLmQudHMgZmlsZXMgdGhhdCBhcmUgbW9kdWxlcyBkbyBub3QgZGVjbGFyZSBnbG9iYWwgc3ltYm9scyAtIHRoZWlyIHN5bWJvbHMgbXVzdCBiZSBleHBsaWNpdGx5XG4gICAgLy8gaW1wb3J0ZWQgdG8gYmUgdXNlZC4gSG93ZXZlciBDbG9zdXJlIENvbXBpbGVyIGhhcyBubyBjb25jZXB0IG9mIGV4dGVybnMgdGhhdCBhcmUgbW9kdWxlcyBhbmRcbiAgICAvLyByZXF1aXJlIGltcG9ydHMuIFRoaXMgY29kZSBtYW5nbGVzIHRoZSBzeW1ib2wgbmFtZXMgYnkgd3JhcHBpbmcgdGhlbSBpbiBhIHRvcCBsZXZlbCB2YXJpYWJsZVxuICAgIC8vIHRoYXQncyB1bmlxdWUgdG8gdGhpcyBmaWxlLiBUaGF0IGFsbG93cyBlbWl0dGluZyB0aGVtIGZvciBDbG9zdXJlIGFzIGdsb2JhbCBzeW1ib2xzIHdoaWxlXG4gICAgLy8gYXZvaWRpbmcgY29sbGlzaW9ucy4gVGhpcyBpcyBuZWNlc3NhcnkgYXMgc3ltYm9scyBsb2NhbCB0byB0aGlzIG1vZHVsZSBjYW4gKGFuZCB3aWxsIHZlcnlcbiAgICAvLyBjb21tb25seSkgY29uZmxpY3Qgd2l0aCB0aGUgbmFtZXNwYWNlIHVzZWQgaW4gXCJleHBvcnQgYXMgbmFtZXNwYWNlXCIsIGUuZy4gXCJhbmd1bGFyXCIsIGFuZCBhbHNvXG4gICAgLy8gdG8gYXZvaWQgdXNlcnMgYWNjaWRlbnRhbGx5IHVzaW5nIHRoZXNlIHN5bWJvbHMgaW4gLmpzIGZpbGVzIChhbmQgbW9yZSBjb2xsaXNpb25zKS4gVGhlXG4gICAgLy8gc3ltYm9scyB0aGF0IGFyZSBcImhpZGRlblwiIGxpa2UgdGhhdCBjYW4gYmUgbWFkZSBhY2Nlc3NpYmxlIHRocm91Z2ggYW4gXCJleHBvcnQgYXMgbmFtZXNwYWNlXCJcbiAgICAvLyBkZWNsYXJhdGlvbiAoc2VlIGJlbG93KS5cbiAgICByb290TmFtZXNwYWNlID0gbW9kdWxlTmFtZUFzSWRlbnRpZmllcihob3N0LCBzb3VyY2VGaWxlLmZpbGVOYW1lKTtcbiAgfVxuXG4gIGZvciAoY29uc3Qgc3RtdCBvZiBzb3VyY2VGaWxlLnN0YXRlbWVudHMpIHtcbiAgICBpZiAoIWlzRHRzICYmICFoYXNNb2RpZmllckZsYWcoc3RtdCBhcyB0cy5EZWNsYXJhdGlvblN0YXRlbWVudCwgdHMuTW9kaWZpZXJGbGFncy5BbWJpZW50KSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIHZpc2l0b3Ioc3RtdCwgW10pO1xuICB9XG5cbiAgaWYgKG91dHB1dCAmJiBpc0V4dGVybmFsTW9kdWxlKSB7XG4gICAgLy8gSWYgdHNpY2tsZSBnZW5lcmF0ZWQgYW55IGV4dGVybnMgYW5kIHRoaXMgaXMgYW4gZXh0ZXJuYWwgbW9kdWxlLCBwcmVwZW5kIHRoZSBuYW1lc3BhY2VcbiAgICAvLyBkZWNsYXJhdGlvbiBmb3IgaXQuXG4gICAgb3V0cHV0ID0gYC8qKiBAY29uc3QgKi9cXG52YXIgJHtyb290TmFtZXNwYWNlfSA9IHt9O1xcbmAgKyBvdXRwdXQ7XG5cbiAgICAvLyBUaGVyZSBjYW4gb25seSBiZSBvbmUgZXhwb3J0ID0uXG4gICAgY29uc3QgZXhwb3J0QXNzaWdubWVudCA9IHNvdXJjZUZpbGUuc3RhdGVtZW50cy5maW5kKHRzLmlzRXhwb3J0QXNzaWdubWVudCk7XG4gICAgbGV0IGV4cG9ydGVkTmFtZXNwYWNlID0gcm9vdE5hbWVzcGFjZTtcbiAgICBpZiAoZXhwb3J0QXNzaWdubWVudCAmJiBleHBvcnRBc3NpZ25tZW50LmlzRXhwb3J0RXF1YWxzKSB7XG4gICAgICBpZiAodHMuaXNJZGVudGlmaWVyKGV4cG9ydEFzc2lnbm1lbnQuZXhwcmVzc2lvbikgfHxcbiAgICAgICAgICB0cy5pc1F1YWxpZmllZE5hbWUoZXhwb3J0QXNzaWdubWVudC5leHByZXNzaW9uKSkge1xuICAgICAgICAvLyBFLmcuIGV4cG9ydCA9IHNvbWVOYW1lO1xuICAgICAgICAvLyBJZiBzb21lTmFtZSBpcyBcImRlY2xhcmUgZ2xvYmFsIHsgbmFtZXNwYWNlIHNvbWVOYW1lIHsuLi59IH1cIiwgdHNpY2tsZSBtdXN0IG5vdCBxdWFsaWZ5XG4gICAgICAgIC8vIGFjY2VzcyB0byBpdCB3aXRoIG1vZHVsZSBuYW1lc3BhY2UgYXMgaXQgaXMgZW1pdHRlZCBpbiB0aGUgZ2xvYmFsIG5hbWVzcGFjZS5cbiAgICAgICAgY29uc3Qgc3ltYm9sID0gdHlwZUNoZWNrZXIuZ2V0U3ltYm9sQXRMb2NhdGlvbihleHBvcnRBc3NpZ25tZW50LmV4cHJlc3Npb24pO1xuICAgICAgICBjb25zdCBpc0dsb2JhbFN5bWJvbCA9IHN5bWJvbCAmJiBzeW1ib2wuZGVjbGFyYXRpb25zICYmXG4gICAgICAgICAgICBzeW1ib2wuZGVjbGFyYXRpb25zLnNvbWUoZCA9PiBpc0luR2xvYmFsQXVnbWVudGF0aW9uKGQpKTtcbiAgICAgICAgY29uc3QgZW50aXR5TmFtZSA9IGdldEVudGl0eU5hbWVUZXh0KGV4cG9ydEFzc2lnbm1lbnQuZXhwcmVzc2lvbik7XG4gICAgICAgIGlmIChpc0dsb2JhbFN5bWJvbCkge1xuICAgICAgICAgIGV4cG9ydGVkTmFtZXNwYWNlID0gZW50aXR5TmFtZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBleHBvcnRlZE5hbWVzcGFjZSA9IHJvb3ROYW1lc3BhY2UgKyAnLicgKyBlbnRpdHlOYW1lO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXBvcnREaWFnbm9zdGljKFxuICAgICAgICAgICAgZGlhZ25vc3RpY3MsIGV4cG9ydEFzc2lnbm1lbnQuZXhwcmVzc2lvbixcbiAgICAgICAgICAgIGBleHBvcnQgPSBleHByZXNzaW9uIG11c3QgYmUgYSBxdWFsaWZpZWQgbmFtZSwgZ290ICR7XG4gICAgICAgICAgICAgICAgdHMuU3ludGF4S2luZFtleHBvcnRBc3NpZ25tZW50LmV4cHJlc3Npb24ua2luZF19LmApO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChpc0R0cyAmJiBob3N0LnByb3ZpZGVFeHRlcm5hbE1vZHVsZUR0c05hbWVzcGFjZSkge1xuICAgICAgLy8gSW4gYSBub24tc2hpbW1lZCBtb2R1bGUsIGNyZWF0ZSBhIGdsb2JhbCBuYW1lc3BhY2UuIFRoaXMgZXhpc3RzIHB1cmVseSBmb3IgYmFja3dhcmRzXG4gICAgICAvLyBjb21wYXRpYmxpdHksIGluIHRoZSBtZWRpdW0gdGVybSBhbGwgY29kZSB1c2luZyB0c2lja2xlIHNob3VsZCBhbHdheXMgdXNlIGBnb29nLm1vZHVsZWBzLFxuICAgICAgLy8gc28gZ2xvYmFsIG5hbWVzIHNob3VsZCBub3QgYmUgbmVjY2Vzc2FyeS5cbiAgICAgIGZvciAoY29uc3QgbnNFeHBvcnQgb2Ygc291cmNlRmlsZS5zdGF0ZW1lbnRzLmZpbHRlcih0cy5pc05hbWVzcGFjZUV4cG9ydERlY2xhcmF0aW9uKSkge1xuICAgICAgICBjb25zdCBuYW1lc3BhY2VOYW1lID0gZ2V0SWRlbnRpZmllclRleHQobnNFeHBvcnQubmFtZSk7XG4gICAgICAgIGVtaXQoYC8vIGV4cG9ydCBhcyBuYW1lc3BhY2UgJHtuYW1lc3BhY2VOYW1lfVxcbmApO1xuICAgICAgICB3cml0ZVZhcmlhYmxlU3RhdGVtZW50KG5hbWVzcGFjZU5hbWUsIFtdLCBleHBvcnRlZE5hbWVzcGFjZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtvdXRwdXQsIGRpYWdub3N0aWNzfTtcblxuICBmdW5jdGlvbiBlbWl0KHN0cjogc3RyaW5nKSB7XG4gICAgb3V0cHV0ICs9IHN0cjtcbiAgfVxuXG4gIC8qKlxuICAgKiBpc0ZpcnN0RGVjbGFyYXRpb24gcmV0dXJucyB0cnVlIGlmIGRlY2wgaXMgdGhlIGZpcnN0IGRlY2xhcmF0aW9uXG4gICAqIG9mIGl0cyBzeW1ib2wuICBFLmcuIGltYWdpbmVcbiAgICogICBpbnRlcmZhY2UgRm9vIHsgeDogbnVtYmVyOyB9XG4gICAqICAgaW50ZXJmYWNlIEZvbyB7IHk6IG51bWJlcjsgfVxuICAgKiB3ZSBvbmx5IHdhbnQgdG8gZW1pdCB0aGUgXCJcXEByZWNvcmRcIiBmb3IgRm9vIG9uIHRoZSBmaXJzdCBvbmUuXG4gICAqXG4gICAqIFRoZSBleGNlcHRpb24gYXJlIHZhcmlhYmxlIGRlY2xhcmF0aW9ucywgd2hpY2ggLSBpbiBleHRlcm5zIC0gZG8gbm90IGFzc2lnbiBhIHZhbHVlOlxuICAgKiAgIC8uLiBcXEB0eXBlIHsuLi59IC4vXG4gICAqICAgdmFyIHNvbWVWYXJpYWJsZTtcbiAgICogICAvLi4gXFxAdHlwZSB7Li4ufSAuL1xuICAgKiAgIHNvbWVOYW1lc3BhY2Uuc29tZVZhcmlhYmxlO1xuICAgKiBJZiBhIGxhdGVyIGRlY2xhcmF0aW9uIHdhbnRzIHRvIGFkZCBhZGRpdGlvbmFsIHByb3BlcnRpZXMgb24gc29tZVZhcmlhYmxlLCB0c2lja2xlIG11c3Qgc3RpbGxcbiAgICogZW1pdCBhbiBhc3NpZ25tZW50IGludG8gdGhlIG9iamVjdCwgYXMgaXQncyBvdGhlcndpc2UgYWJzZW50LlxuICAgKi9cbiAgZnVuY3Rpb24gaXNGaXJzdFZhbHVlRGVjbGFyYXRpb24oZGVjbDogdHMuRGVjbGFyYXRpb25TdGF0ZW1lbnQpOiBib29sZWFuIHtcbiAgICBpZiAoIWRlY2wubmFtZSkgcmV0dXJuIHRydWU7XG4gICAgY29uc3Qgc3ltID0gdHlwZUNoZWNrZXIuZ2V0U3ltYm9sQXRMb2NhdGlvbihkZWNsLm5hbWUpITtcbiAgICBpZiAoIXN5bS5kZWNsYXJhdGlvbnMgfHwgc3ltLmRlY2xhcmF0aW9ucy5sZW5ndGggPCAyKSByZXR1cm4gdHJ1ZTtcbiAgICBjb25zdCBlYXJsaWVyRGVjbHMgPSBzeW0uZGVjbGFyYXRpb25zLnNsaWNlKDAsIHN5bS5kZWNsYXJhdGlvbnMuaW5kZXhPZihkZWNsKSk7XG4gICAgLy8gRWl0aGVyIHRoZXJlIGFyZSBubyBlYXJsaWVyIGRlY2xhcmF0aW9ucywgb3IgYWxsIG9mIHRoZW0gYXJlIHZhcmlhYmxlcyAoc2VlIGFib3ZlKS4gdHNpY2tsZVxuICAgIC8vIGVtaXRzIGEgdmFsdWUgZm9yIGFsbCBvdGhlciBkZWNsYXJhdGlvbiBraW5kcyAoZnVuY3Rpb24gZm9yIGZ1bmN0aW9ucywgY2xhc3NlcywgaW50ZXJmYWNlcyxcbiAgICAvLyB7fSBvYmplY3QgZm9yIG5hbWVzcGFjZXMpLlxuICAgIHJldHVybiBlYXJsaWVyRGVjbHMubGVuZ3RoID09PSAwIHx8IGVhcmxpZXJEZWNscy5ldmVyeSh0cy5pc1ZhcmlhYmxlRGVjbGFyYXRpb24pO1xuICB9XG5cbiAgLyoqIFdyaXRlcyB0aGUgYWN0dWFsIHZhcmlhYmxlIHN0YXRlbWVudCBvZiBhIENsb3N1cmUgdmFyaWFibGUgZGVjbGFyYXRpb24uICovXG4gIGZ1bmN0aW9uIHdyaXRlVmFyaWFibGVTdGF0ZW1lbnQobmFtZTogc3RyaW5nLCBuYW1lc3BhY2U6IFJlYWRvbmx5QXJyYXk8c3RyaW5nPiwgdmFsdWU/OiBzdHJpbmcpIHtcbiAgICBjb25zdCBxdWFsaWZpZWROYW1lID0gbmFtZXNwYWNlLmNvbmNhdChbbmFtZV0pLmpvaW4oJy4nKTtcbiAgICBpZiAobmFtZXNwYWNlLmxlbmd0aCA9PT0gMCkgZW1pdChgdmFyIGApO1xuICAgIGVtaXQocXVhbGlmaWVkTmFtZSk7XG4gICAgaWYgKHZhbHVlKSBlbWl0KGAgPSAke3ZhbHVlfWApO1xuICAgIGVtaXQoJztcXG4nKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXcml0ZXMgYSBDbG9zdXJlIHZhcmlhYmxlIGRlY2xhcmF0aW9uLCBpLmUuIHRoZSB2YXJpYWJsZSBzdGF0ZW1lbnQgd2l0aCBhIGxlYWRpbmcgSlNEb2NcbiAgICogY29tbWVudCBtYWtpbmcgaXQgYSBkZWNsYXJhdGlvbi5cbiAgICovXG4gIGZ1bmN0aW9uIHdyaXRlVmFyaWFibGVEZWNsYXJhdGlvbihcbiAgICAgIGRlY2w6IHRzLlZhcmlhYmxlRGVjbGFyYXRpb24sIG5hbWVzcGFjZTogUmVhZG9ubHlBcnJheTxzdHJpbmc+KSB7XG4gICAgaWYgKGRlY2wubmFtZS5raW5kID09PSB0cy5TeW50YXhLaW5kLklkZW50aWZpZXIpIHtcbiAgICAgIGNvbnN0IG5hbWUgPSBnZXRJZGVudGlmaWVyVGV4dChkZWNsLm5hbWUgYXMgdHMuSWRlbnRpZmllcik7XG4gICAgICBpZiAoQ0xPU1VSRV9FWFRFUk5TX0JMQUNLTElTVC5pbmRleE9mKG5hbWUpID49IDApIHJldHVybjtcbiAgICAgIGVtaXQoanNkb2MudG9TdHJpbmcoW3t0YWdOYW1lOiAndHlwZScsIHR5cGU6IG10dC50eXBlVG9DbG9zdXJlKGRlY2wpfV0pKTtcbiAgICAgIGVtaXQoJ1xcbicpO1xuICAgICAgd3JpdGVWYXJpYWJsZVN0YXRlbWVudChuYW1lLCBuYW1lc3BhY2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICBlcnJvclVuaW1wbGVtZW50ZWRLaW5kKGRlY2wubmFtZSwgJ2V4dGVybnMgZm9yIHZhcmlhYmxlJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEVtaXRzIGEgSlNEb2MgZGVjbGFyYXRpb24gdGhhdCBtZXJnZXMgdGhlIHNpZ25hdHVyZXMgb2YgdGhlIGdpdmVuIGZ1bmN0aW9uIGRlY2xhcmF0aW9uIChmb3JcbiAgICogb3ZlcmxvYWRzKSwgYW5kIHJldHVybnMgdGhlIHBhcmFtZXRlciBuYW1lcyBjaG9zZW4uXG4gICAqL1xuICBmdW5jdGlvbiBlbWl0RnVuY3Rpb25UeXBlKGRlY2xzOiB0cy5GdW5jdGlvbkxpa2VEZWNsYXJhdGlvbltdLCBleHRyYVRhZ3M6IGpzZG9jLlRhZ1tdID0gW10pIHtcbiAgICBjb25zdCB7dGFncywgcGFyYW1ldGVyTmFtZXN9ID0gbXR0LmdldEZ1bmN0aW9uVHlwZUpTRG9jKGRlY2xzLCBleHRyYVRhZ3MpO1xuICAgIGVtaXQoJ1xcbicpO1xuICAgIGVtaXQoanNkb2MudG9TdHJpbmcodGFncykpO1xuICAgIHJldHVybiBwYXJhbWV0ZXJOYW1lcztcbiAgfVxuXG4gIGZ1bmN0aW9uIHdyaXRlRnVuY3Rpb24obmFtZTogdHMuTm9kZSwgcGFyYW1zOiBzdHJpbmdbXSwgbmFtZXNwYWNlOiBSZWFkb25seUFycmF5PHN0cmluZz4pIHtcbiAgICBjb25zdCBwYXJhbXNTdHIgPSBwYXJhbXMuam9pbignLCAnKTtcbiAgICBpZiAobmFtZXNwYWNlLmxlbmd0aCA+IDApIHtcbiAgICAgIGxldCBmcW4gPSBuYW1lc3BhY2Uuam9pbignLicpO1xuICAgICAgaWYgKG5hbWUua2luZCA9PT0gdHMuU3ludGF4S2luZC5JZGVudGlmaWVyKSB7XG4gICAgICAgIGZxbiArPSAnLic7ICAvLyBjb21wdXRlZCBuYW1lcyBpbmNsdWRlIFsgXSBpbiB0aGVpciBnZXRUZXh0KCkgcmVwcmVzZW50YXRpb24uXG4gICAgICB9XG4gICAgICBmcW4gKz0gbmFtZS5nZXRUZXh0KCk7XG4gICAgICBlbWl0KGAke2Zxbn0gPSBmdW5jdGlvbigke3BhcmFtc1N0cn0pIHt9O1xcbmApO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAobmFtZS5raW5kICE9PSB0cy5TeW50YXhLaW5kLklkZW50aWZpZXIpIHtcbiAgICAgICAgcmVwb3J0RGlhZ25vc3RpYyhkaWFnbm9zdGljcywgbmFtZSwgJ05vbi1uYW1lc3BhY2VkIGNvbXB1dGVkIG5hbWUgaW4gZXh0ZXJucycpO1xuICAgICAgfVxuICAgICAgZW1pdChgZnVuY3Rpb24gJHtuYW1lLmdldFRleHQoKX0oJHtwYXJhbXNTdHJ9KSB7fVxcbmApO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHdyaXRlRW51bShkZWNsOiB0cy5FbnVtRGVjbGFyYXRpb24sIG5hbWVzcGFjZTogUmVhZG9ubHlBcnJheTxzdHJpbmc+KSB7XG4gICAgLy8gRS5nLiAvKiogQGVudW0ge251bWJlcn0gKi8gdmFyIENPVU5UUlkgPSB7VVM6IDEsIENBOiAxfTtcbiAgICBjb25zdCBuYW1lID0gZ2V0SWRlbnRpZmllclRleHQoZGVjbC5uYW1lKTtcbiAgICBsZXQgbWVtYmVycyA9ICcnO1xuICAgIGNvbnN0IGVudW1UeXBlID0gZ2V0RW51bVR5cGUodHlwZUNoZWNrZXIsIGRlY2wpO1xuICAgIC8vIENsb3N1cmUgZW51bXMgbWVtYmVycyBtdXN0IGhhdmUgYSB2YWx1ZSBvZiB0aGUgY29ycmVjdCB0eXBlLCBidXQgdGhlIGFjdHVhbCB2YWx1ZSBkb2VzIG5vdFxuICAgIC8vIG1hdHRlciBpbiBleHRlcm5zLlxuICAgIGNvbnN0IGluaXRpYWxpemVyID0gZW51bVR5cGUgPT09ICdzdHJpbmcnID8gYCcnYCA6IDE7XG4gICAgZm9yIChjb25zdCBtZW1iZXIgb2YgZGVjbC5tZW1iZXJzKSB7XG4gICAgICBsZXQgbWVtYmVyTmFtZTogc3RyaW5nfHVuZGVmaW5lZDtcbiAgICAgIHN3aXRjaCAobWVtYmVyLm5hbWUua2luZCkge1xuICAgICAgICBjYXNlIHRzLlN5bnRheEtpbmQuSWRlbnRpZmllcjpcbiAgICAgICAgICBtZW1iZXJOYW1lID0gZ2V0SWRlbnRpZmllclRleHQobWVtYmVyLm5hbWUgYXMgdHMuSWRlbnRpZmllcik7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgdHMuU3ludGF4S2luZC5TdHJpbmdMaXRlcmFsOlxuICAgICAgICAgIGNvbnN0IHRleHQgPSAobWVtYmVyLm5hbWUgYXMgdHMuU3RyaW5nTGl0ZXJhbCkudGV4dDtcbiAgICAgICAgICBpZiAoaXNWYWxpZENsb3N1cmVQcm9wZXJ0eU5hbWUodGV4dCkpIG1lbWJlck5hbWUgPSB0ZXh0O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgaWYgKCFtZW1iZXJOYW1lKSB7XG4gICAgICAgIG1lbWJlcnMgKz0gYCAgLyogVE9ETzogJHt0cy5TeW50YXhLaW5kW21lbWJlci5uYW1lLmtpbmRdfTogJHtcbiAgICAgICAgICAgIGVzY2FwZUZvckNvbW1lbnQobWVtYmVyLm5hbWUuZ2V0VGV4dCgpKX0gKi9cXG5gO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIG1lbWJlcnMgKz0gYCAgJHttZW1iZXJOYW1lfTogJHtpbml0aWFsaXplcn0sXFxuYDtcbiAgICB9XG5cbiAgICBlbWl0KGBcXG4vKiogQGVudW0geyR7ZW51bVR5cGV9fSAqL1xcbmApO1xuICAgIHdyaXRlVmFyaWFibGVTdGF0ZW1lbnQobmFtZSwgbmFtZXNwYWNlLCBge1xcbiR7bWVtYmVyc319YCk7XG4gIH1cblxuICBmdW5jdGlvbiB3cml0ZVR5cGVBbGlhcyhkZWNsOiB0cy5UeXBlQWxpYXNEZWNsYXJhdGlvbiwgbmFtZXNwYWNlOiBSZWFkb25seUFycmF5PHN0cmluZz4pIHtcbiAgICBjb25zdCB0eXBlU3RyID0gbXR0LnR5cGVUb0Nsb3N1cmUoZGVjbCwgdW5kZWZpbmVkKTtcbiAgICBlbWl0KGBcXG4vKiogQHR5cGVkZWYgeyR7dHlwZVN0cn19ICovXFxuYCk7XG4gICAgd3JpdGVWYXJpYWJsZVN0YXRlbWVudChnZXRJZGVudGlmaWVyVGV4dChkZWNsLm5hbWUpLCBuYW1lc3BhY2UpO1xuICB9XG5cbiAgZnVuY3Rpb24gd3JpdGVUeXBlKFxuICAgICAgZGVjbDogdHMuSW50ZXJmYWNlRGVjbGFyYXRpb258dHMuQ2xhc3NEZWNsYXJhdGlvbiwgbmFtZXNwYWNlOiBSZWFkb25seUFycmF5PHN0cmluZz4pIHtcbiAgICBjb25zdCBuYW1lID0gZGVjbC5uYW1lO1xuICAgIGlmICghbmFtZSkge1xuICAgICAgcmVwb3J0RGlhZ25vc3RpYyhkaWFnbm9zdGljcywgZGVjbCwgJ2Fub255bW91cyB0eXBlIGluIGV4dGVybnMnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgdHlwZU5hbWUgPSBuYW1lc3BhY2UuY29uY2F0KFtuYW1lLmdldFRleHQoKV0pLmpvaW4oJy4nKTtcbiAgICBpZiAoQ0xPU1VSRV9FWFRFUk5TX0JMQUNLTElTVC5pbmRleE9mKHR5cGVOYW1lKSA+PSAwKSByZXR1cm47XG5cbiAgICBpZiAoaXNGaXJzdFZhbHVlRGVjbGFyYXRpb24oZGVjbCkpIHtcbiAgICAgIC8vIEVtaXQgdGhlICdmdW5jdGlvbicgdGhhdCBpcyBhY3R1YWxseSB0aGUgZGVjbGFyYXRpb24gb2YgdGhlIGludGVyZmFjZVxuICAgICAgLy8gaXRzZWxmLiAgSWYgaXQncyBhIGNsYXNzLCB0aGlzIGZ1bmN0aW9uIGFsc28gbXVzdCBpbmNsdWRlIHRoZSB0eXBlXG4gICAgICAvLyBhbm5vdGF0aW9ucyBvZiB0aGUgY29uc3RydWN0b3IuXG4gICAgICBsZXQgcGFyYW1OYW1lczogc3RyaW5nW10gPSBbXTtcbiAgICAgIGNvbnN0IGpzZG9jVGFnczoganNkb2MuVGFnW10gPSBbXTtcbiAgICAgIGxldCB3cm90ZUpzRG9jID0gZmFsc2U7XG4gICAgICBtYXliZUFkZEhlcml0YWdlQ2xhdXNlcyhqc2RvY1RhZ3MsIG10dCwgZGVjbCk7XG4gICAgICBtYXliZUFkZFRlbXBsYXRlQ2xhdXNlKGpzZG9jVGFncywgZGVjbCk7XG4gICAgICBpZiAoZGVjbC5raW5kID09PSB0cy5TeW50YXhLaW5kLkNsYXNzRGVjbGFyYXRpb24pIHtcbiAgICAgICAgLy8gVE9ETzogaXQgYXBwZWFycyB5b3UgY2FuIGp1c3Qgd3JpdGUgJ2NsYXNzIEZvbyB7IC4uLicgaW4gZXh0ZXJucy5cbiAgICAgICAgLy8gVGhpcyBjb2RlIGluc3RlYWQgdHJpZXMgdG8gdHJhbnNsYXRlIGl0IHRvIGEgZnVuY3Rpb24uXG4gICAgICAgIGpzZG9jVGFncy5wdXNoKHt0YWdOYW1lOiAnY29uc3RydWN0b3InfSwge3RhZ05hbWU6ICdzdHJ1Y3QnfSk7XG4gICAgICAgIGNvbnN0IGN0b3JzID0gKGRlY2wgYXMgdHMuQ2xhc3NEZWNsYXJhdGlvbilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLm1lbWJlcnMuZmlsdGVyKChtKSA9PiBtLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuQ29uc3RydWN0b3IpO1xuICAgICAgICBpZiAoY3RvcnMubGVuZ3RoKSB7XG4gICAgICAgICAgY29uc3QgZmlyc3RDdG9yOiB0cy5Db25zdHJ1Y3RvckRlY2xhcmF0aW9uID0gY3RvcnNbMF0gYXMgdHMuQ29uc3RydWN0b3JEZWNsYXJhdGlvbjtcbiAgICAgICAgICBpZiAoY3RvcnMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgcGFyYW1OYW1lcyA9IGVtaXRGdW5jdGlvblR5cGUoY3RvcnMgYXMgdHMuQ29uc3RydWN0b3JEZWNsYXJhdGlvbltdLCBqc2RvY1RhZ3MpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwYXJhbU5hbWVzID0gZW1pdEZ1bmN0aW9uVHlwZShbZmlyc3RDdG9yXSwganNkb2NUYWdzKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgd3JvdGVKc0RvYyA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIE90aGVyd2lzZSBpdCdzIGFuIGludGVyZmFjZTsgdGFnIGl0IGFzIHN0cnVjdHVyYWxseSB0eXBlZC5cbiAgICAgICAganNkb2NUYWdzLnB1c2goe3RhZ05hbWU6ICdyZWNvcmQnfSwge3RhZ05hbWU6ICdzdHJ1Y3QnfSk7XG4gICAgICB9XG4gICAgICBpZiAoIXdyb3RlSnNEb2MpIGVtaXQoanNkb2MudG9TdHJpbmcoanNkb2NUYWdzKSk7XG4gICAgICB3cml0ZUZ1bmN0aW9uKG5hbWUsIHBhcmFtTmFtZXMsIG5hbWVzcGFjZSk7XG4gICAgfVxuXG4gICAgLy8gUHJvY2VzcyBldmVyeXRoaW5nIGV4Y2VwdCAoTWV0aG9kU2lnbmF0dXJlfE1ldGhvZERlY2xhcmF0aW9ufENvbnN0cnVjdG9yKVxuICAgIGNvbnN0IG1ldGhvZHMgPSBuZXcgTWFwPHN0cmluZywgdHMuTWV0aG9kRGVjbGFyYXRpb25bXT4oKTtcbiAgICBmb3IgKGNvbnN0IG1lbWJlciBvZiBkZWNsLm1lbWJlcnMpIHtcbiAgICAgIHN3aXRjaCAobWVtYmVyLmtpbmQpIHtcbiAgICAgICAgY2FzZSB0cy5TeW50YXhLaW5kLlByb3BlcnR5U2lnbmF0dXJlOlxuICAgICAgICBjYXNlIHRzLlN5bnRheEtpbmQuUHJvcGVydHlEZWNsYXJhdGlvbjpcbiAgICAgICAgICBjb25zdCBwcm9wID0gbWVtYmVyIGFzIHRzLlByb3BlcnR5U2lnbmF0dXJlO1xuICAgICAgICAgIGlmIChwcm9wLm5hbWUua2luZCA9PT0gdHMuU3ludGF4S2luZC5JZGVudGlmaWVyKSB7XG4gICAgICAgICAgICBsZXQgdHlwZSA9IG10dC50eXBlVG9DbG9zdXJlKHByb3ApO1xuICAgICAgICAgICAgaWYgKHByb3AucXVlc3Rpb25Ub2tlbiAmJiB0eXBlID09PSAnPycpIHtcbiAgICAgICAgICAgICAgLy8gQW4gb3B0aW9uYWwgJ2FueScgdHlwZSB0cmFuc2xhdGVzIHRvICc/fHVuZGVmaW5lZCcgaW4gQ2xvc3VyZS5cbiAgICAgICAgICAgICAgdHlwZSA9ICc/fHVuZGVmaW5lZCc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbWl0KGpzZG9jLnRvU3RyaW5nKFt7dGFnTmFtZTogJ3R5cGUnLCB0eXBlfV0pKTtcbiAgICAgICAgICAgIGlmIChoYXNNb2RpZmllckZsYWcocHJvcCwgdHMuTW9kaWZpZXJGbGFncy5TdGF0aWMpKSB7XG4gICAgICAgICAgICAgIGVtaXQoYFxcbiR7dHlwZU5hbWV9LiR7cHJvcC5uYW1lLmdldFRleHQoKX07XFxuYCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBlbWl0KGBcXG4ke3R5cGVOYW1lfS5wcm90b3R5cGUuJHtwcm9wLm5hbWUuZ2V0VGV4dCgpfTtcXG5gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBUT0RPOiBGb3Igbm93IHByb3BlcnR5IG5hbWVzIG90aGVyIHRoYW4gSWRlbnRpZmllcnMgYXJlIG5vdCBoYW5kbGVkOyBlLmcuXG4gICAgICAgICAgLy8gICAgaW50ZXJmYWNlIEZvbyB7IFwiMTIzYmFyXCI6IG51bWJlciB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgdHMuU3ludGF4S2luZC5NZXRob2RTaWduYXR1cmU6XG4gICAgICAgIGNhc2UgdHMuU3ludGF4S2luZC5NZXRob2REZWNsYXJhdGlvbjpcbiAgICAgICAgICBjb25zdCBtZXRob2QgPSBtZW1iZXIgYXMgdHMuTWV0aG9kRGVjbGFyYXRpb247XG4gICAgICAgICAgY29uc3QgaXNTdGF0aWMgPSBoYXNNb2RpZmllckZsYWcobWV0aG9kLCB0cy5Nb2RpZmllckZsYWdzLlN0YXRpYyk7XG4gICAgICAgICAgY29uc3QgbWV0aG9kU2lnbmF0dXJlID0gYCR7bWV0aG9kLm5hbWUuZ2V0VGV4dCgpfSQkJCR7aXNTdGF0aWMgPyAnc3RhdGljJyA6ICdpbnN0YW5jZSd9YDtcblxuICAgICAgICAgIGlmIChtZXRob2RzLmhhcyhtZXRob2RTaWduYXR1cmUpKSB7XG4gICAgICAgICAgICBtZXRob2RzLmdldChtZXRob2RTaWduYXR1cmUpIS5wdXNoKG1ldGhvZCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1ldGhvZHMuc2V0KG1ldGhvZFNpZ25hdHVyZSwgW21ldGhvZF0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgY2FzZSB0cy5TeW50YXhLaW5kLkNvbnN0cnVjdG9yOlxuICAgICAgICAgIGNvbnRpbnVlOyAgLy8gSGFuZGxlZCBhYm92ZS5cbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAvLyBNZW1iZXJzIGNhbiBpbmNsdWRlIHRoaW5ncyBsaWtlIGluZGV4IHNpZ25hdHVyZXMsIGZvciBlLmcuXG4gICAgICAgICAgLy8gICBpbnRlcmZhY2UgRm9vIHsgW2tleTogc3RyaW5nXTogbnVtYmVyOyB9XG4gICAgICAgICAgLy8gRm9yIG5vdywganVzdCBza2lwIGl0LlxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgLy8gSWYgd2UgZ2V0IGhlcmUsIHRoZSBtZW1iZXIgd2Fzbid0IGhhbmRsZWQgaW4gdGhlIHN3aXRjaCBzdGF0ZW1lbnQuXG4gICAgICBsZXQgbWVtYmVyTmFtZSA9IG5hbWVzcGFjZTtcbiAgICAgIGlmIChtZW1iZXIubmFtZSkge1xuICAgICAgICBtZW1iZXJOYW1lID0gbWVtYmVyTmFtZS5jb25jYXQoW21lbWJlci5uYW1lLmdldFRleHQoKV0pO1xuICAgICAgfVxuICAgICAgZW1pdChgXFxuLyogVE9ETzogJHt0cy5TeW50YXhLaW5kW21lbWJlci5raW5kXX06ICR7bWVtYmVyTmFtZS5qb2luKCcuJyl9ICovXFxuYCk7XG4gICAgfVxuXG4gICAgLy8gSGFuZGxlIG1ldGhvZCBkZWNsYXJhdGlvbnMvc2lnbmF0dXJlcyBzZXBhcmF0ZWx5LCBzaW5jZSB3ZSBuZWVkIHRvIGRlYWwgd2l0aCBvdmVybG9hZHMuXG4gICAgZm9yIChjb25zdCBtZXRob2RWYXJpYW50cyBvZiBBcnJheS5mcm9tKG1ldGhvZHMudmFsdWVzKCkpKSB7XG4gICAgICBjb25zdCBmaXJzdE1ldGhvZFZhcmlhbnQgPSBtZXRob2RWYXJpYW50c1swXTtcbiAgICAgIGxldCBwYXJhbWV0ZXJOYW1lczogc3RyaW5nW107XG4gICAgICBpZiAobWV0aG9kVmFyaWFudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBwYXJhbWV0ZXJOYW1lcyA9IGVtaXRGdW5jdGlvblR5cGUobWV0aG9kVmFyaWFudHMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGFyYW1ldGVyTmFtZXMgPSBlbWl0RnVuY3Rpb25UeXBlKFtmaXJzdE1ldGhvZFZhcmlhbnRdKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IG1ldGhvZE5hbWVzcGFjZSA9IG5hbWVzcGFjZS5jb25jYXQoW25hbWUuZ2V0VGV4dCgpXSk7XG4gICAgICAvLyBJZiB0aGUgbWV0aG9kIGlzIHN0YXRpYywgZG9uJ3QgYWRkIHRoZSBwcm90b3R5cGUuXG4gICAgICBpZiAoIWhhc01vZGlmaWVyRmxhZyhmaXJzdE1ldGhvZFZhcmlhbnQsIHRzLk1vZGlmaWVyRmxhZ3MuU3RhdGljKSkge1xuICAgICAgICBtZXRob2ROYW1lc3BhY2UucHVzaCgncHJvdG90eXBlJyk7XG4gICAgICB9XG4gICAgICB3cml0ZUZ1bmN0aW9uKGZpcnN0TWV0aG9kVmFyaWFudC5uYW1lLCBwYXJhbWV0ZXJOYW1lcywgbWV0aG9kTmFtZXNwYWNlKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiB3cml0ZUV4cG9ydERlY2xhcmF0aW9uKFxuICAgICAgZXhwb3J0RGVjbGFyYXRpb246IHRzLkV4cG9ydERlY2xhcmF0aW9uLCBuYW1lc3BhY2U6IFJlYWRvbmx5QXJyYXk8c3RyaW5nPikge1xuICAgIGlmICghZXhwb3J0RGVjbGFyYXRpb24uZXhwb3J0Q2xhdXNlKSB7XG4gICAgICBlbWl0KGBcXG4vLyBUT0RPKHRzaWNrbGUpOiBleHBvcnQgKiBkZWNsYXJhdGlvbiBpbiAke1xuICAgICAgICAgIGRlYnVnTG9jYXRpb25TdHIoZXhwb3J0RGVjbGFyYXRpb24sIG5hbWVzcGFjZSl9XFxuYCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGZvciAoY29uc3QgZXhwb3J0U3BlY2lmaWVyIG9mIGV4cG9ydERlY2xhcmF0aW9uLmV4cG9ydENsYXVzZS5lbGVtZW50cykge1xuICAgICAgLy8gTm8gbmVlZCB0byBkbyBhbnl0aGluZyBmb3IgcHJvcGVydGllcyBleHBvcnRlZCB1bmRlciB0aGVpciBvcmlnaW5hbCBuYW1lLlxuICAgICAgaWYgKCFleHBvcnRTcGVjaWZpZXIucHJvcGVydHlOYW1lKSBjb250aW51ZTtcbiAgICAgIGVtaXQoJy8qKiBAY29uc3QgKi9cXG4nKTtcbiAgICAgIHdyaXRlVmFyaWFibGVTdGF0ZW1lbnQoXG4gICAgICAgICAgZXhwb3J0U3BlY2lmaWVyLm5hbWUudGV4dCwgbmFtZXNwYWNlLFxuICAgICAgICAgIG5hbWVzcGFjZS5qb2luKCcuJykgKyAnLicgKyBleHBvcnRTcGVjaWZpZXIucHJvcGVydHlOYW1lLnRleHQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGFsaWFzZXMgZm9yIHRoZSBzeW1ib2xzIGltcG9ydGVkIGluIHRoZSBnaXZlbiBkZWNsYXJhdGlvbiwgc28gdGhhdCB0aGVpciB0eXBlcyBnZXRcbiAgICogcHJpbnRlZCBhcyB0aGUgZnVsbHkgcXVhbGlmaWVkIG5hbWUsIGFuZCBub3QganVzdCBhcyBhIHJlZmVyZW5jZSB0byB0aGUgbG9jYWwgaW1wb3J0IGFsaWFzLlxuICAgKlxuICAgKiB0c2lja2xlIGdlbmVyYXRlcyAuanMgZmlsZXMgdGhhdCAoYXQgbW9zdCkgY29udGFpbiBhIGBnb29nLnByb3ZpZGVgLCBidXQgYXJlIG5vdFxuICAgKiBgZ29vZy5tb2R1bGVgcy4gVGhlc2UgZmlsZXMgY2Fubm90IGV4cHJlc3MgYW4gYWxpYXNlZCBpbXBvcnQuIEhvd2V2ZXIgQ2xvc3VyZSBDb21waWxlciBhbGxvd3NcbiAgICogcmVmZXJlbmNpbmcgdHlwZXMgdXNpbmcgZnVsbHkgcXVhbGlmaWVkIG5hbWVzIGluIHN1Y2ggZmlsZXMsIHNvIHRzaWNrbGUgY2FuIHJlc29sdmUgdGhlXG4gICAqIGltcG9ydGVkIG1vZHVsZSBVUkkgYW5kIHByb2R1Y2UgYHBhdGgudG8ubW9kdWxlLlN5bWJvbGAgYXMgYW4gYWxpYXMsIGFuZCB1c2UgdGhhdCB3aGVuXG4gICAqIHJlZmVyZW5jaW5nIHRoZSB0eXBlLlxuICAgKi9cbiAgZnVuY3Rpb24gYWRkSW1wb3J0QWxpYXNlcyhkZWNsOiB0cy5JbXBvcnREZWNsYXJhdGlvbnx0cy5JbXBvcnRFcXVhbHNEZWNsYXJhdGlvbikge1xuICAgIGxldCBtb2R1bGVVcmk6IHN0cmluZztcbiAgICBpZiAodHMuaXNJbXBvcnREZWNsYXJhdGlvbihkZWNsKSkge1xuICAgICAgbW9kdWxlVXJpID0gKGRlY2wubW9kdWxlU3BlY2lmaWVyIGFzIHRzLlN0cmluZ0xpdGVyYWwpLnRleHQ7XG4gICAgfSBlbHNlIGlmICh0cy5pc0V4dGVybmFsTW9kdWxlUmVmZXJlbmNlKGRlY2wubW9kdWxlUmVmZXJlbmNlKSkge1xuICAgICAgLy8gaW1wb3J0IGZvbyA9IHJlcXVpcmUoJy4vYmFyJyk7XG4gICAgICBtb2R1bGVVcmkgPSAoZGVjbC5tb2R1bGVSZWZlcmVuY2UuZXhwcmVzc2lvbiBhcyB0cy5TdHJpbmdMaXRlcmFsKS50ZXh0O1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBpbXBvcnQgZm9vID0gYmFyLmJhei5iYW07XG4gICAgICAvLyB1bnN1cHBvcnRlZC5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBnb29nTmFtZXNwYWNlID0gZXh0cmFjdEdvb2dOYW1lc3BhY2VJbXBvcnQobW9kdWxlVXJpKTtcbiAgICBjb25zdCBtb2R1bGVOYW1lID0gZ29vZ05hbWVzcGFjZSB8fFxuICAgICAgICBob3N0LnBhdGhUb01vZHVsZU5hbWUoXG4gICAgICAgICAgICBzb3VyY2VGaWxlLmZpbGVOYW1lLCByZXNvbHZlTW9kdWxlTmFtZShob3N0LCBzb3VyY2VGaWxlLmZpbGVOYW1lLCBtb2R1bGVVcmkpKTtcblxuICAgIGlmICh0cy5pc0ltcG9ydEVxdWFsc0RlY2xhcmF0aW9uKGRlY2wpKSB7XG4gICAgICAvLyBpbXBvcnQgZm9vID0gcmVxdWlyZSgnLi9iYXInKTtcbiAgICAgIGFkZEltcG9ydEFsaWFzKGRlY2wubmFtZSwgbW9kdWxlTmFtZSwgdW5kZWZpbmVkKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBTaWRlIGVmZmVjdCBpbXBvcnQgJ3BhdGgnOyBkZWNsYXJlcyBubyBsb2NhbCBhbGlhc2VzLlxuICAgIGlmICghZGVjbC5pbXBvcnRDbGF1c2UpIHJldHVybjtcblxuICAgIGlmIChkZWNsLmltcG9ydENsYXVzZS5uYW1lKSB7XG4gICAgICAvLyBpbXBvcnQgbmFtZSBmcm9tIC4uLiAtPiBtYXAgdG8gLmRlZmF1bHQgb24gdGhlIG1vZHVsZS5uYW1lLlxuICAgICAgaWYgKGdvb2dOYW1lc3BhY2UpIHtcbiAgICAgICAgYWRkSW1wb3J0QWxpYXMoZGVjbC5pbXBvcnRDbGF1c2UubmFtZSwgZ29vZ05hbWVzcGFjZSwgdW5kZWZpbmVkKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFkZEltcG9ydEFsaWFzKGRlY2wuaW1wb3J0Q2xhdXNlLm5hbWUsIG1vZHVsZU5hbWUsICdkZWZhdWx0Jyk7XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IG5hbWVkQmluZGluZ3MgPSBkZWNsLmltcG9ydENsYXVzZS5uYW1lZEJpbmRpbmdzO1xuICAgIGlmICghbmFtZWRCaW5kaW5ncykgcmV0dXJuO1xuXG4gICAgaWYgKHRzLmlzTmFtZXNwYWNlSW1wb3J0KG5hbWVkQmluZGluZ3MpKSB7XG4gICAgICAvLyBpbXBvcnQgKiBhcyBuYW1lIC0+IG1hcCBkaXJlY3RseSB0byB0aGUgbW9kdWxlLm5hbWUuXG4gICAgICBhZGRJbXBvcnRBbGlhcyhuYW1lZEJpbmRpbmdzLm5hbWUsIG1vZHVsZU5hbWUsIHVuZGVmaW5lZCk7XG4gICAgfVxuXG4gICAgaWYgKHRzLmlzTmFtZWRJbXBvcnRzKG5hbWVkQmluZGluZ3MpKSB7XG4gICAgICAvLyBpbXBvcnQge0EgYXMgQn0sIG1hcCB0byBtb2R1bGUubmFtZS5BXG4gICAgICBmb3IgKGNvbnN0IG5hbWVkQmluZGluZyBvZiBuYW1lZEJpbmRpbmdzLmVsZW1lbnRzKSB7XG4gICAgICAgIGFkZEltcG9ydEFsaWFzKG5hbWVkQmluZGluZy5uYW1lLCBtb2R1bGVOYW1lLCBuYW1lZEJpbmRpbmcubmFtZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYW4gaW1wb3J0IGFsaWFzIGZvciB0aGUgc3ltYm9sIGRlZmluZWQgYXQgdGhlIGdpdmVuIG5vZGUuIENyZWF0ZXMgYW4gYWxpYXMgbmFtZSBiYXNlZCBvblxuICAgKiB0aGUgZ2l2ZW4gbW9kdWxlTmFtZSBhbmQgKG9wdGlvbmFsbHkpIHRoZSBuYW1lLlxuICAgKi9cbiAgZnVuY3Rpb24gYWRkSW1wb3J0QWxpYXMobm9kZTogdHMuTm9kZSwgbW9kdWxlTmFtZTogc3RyaW5nLCBuYW1lOiB0cy5JZGVudGlmaWVyfHN0cmluZ3x1bmRlZmluZWQpIHtcbiAgICBsZXQgc3ltYm9sID0gdHlwZUNoZWNrZXIuZ2V0U3ltYm9sQXRMb2NhdGlvbihub2RlKTtcbiAgICBpZiAoIXN5bWJvbCkge1xuICAgICAgcmVwb3J0RGlhZ25vc3RpYyhkaWFnbm9zdGljcywgbm9kZSwgYG5hbWVkIGltcG9ydCBoYXMgbm8gc3ltYm9sYCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGxldCBhbGlhc05hbWUgPSBtb2R1bGVOYW1lO1xuICAgIGlmICh0eXBlb2YgbmFtZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGFsaWFzTmFtZSArPSAnLicgKyBuYW1lO1xuICAgIH0gZWxzZSBpZiAobmFtZSkge1xuICAgICAgYWxpYXNOYW1lICs9ICcuJyArIGdldElkZW50aWZpZXJUZXh0KG5hbWUpO1xuICAgIH1cbiAgICBpZiAoc3ltYm9sLmZsYWdzICYgdHMuU3ltYm9sRmxhZ3MuQWxpYXMpIHtcbiAgICAgIHN5bWJvbCA9IHR5cGVDaGVja2VyLmdldEFsaWFzZWRTeW1ib2woc3ltYm9sKTtcbiAgICB9XG4gICAgbXR0LnN5bWJvbHNUb0FsaWFzZWROYW1lcy5zZXQoc3ltYm9sLCBhbGlhc05hbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFByb2R1Y2VzIGEgY29tcGlsZXIgZXJyb3IgdGhhdCByZWZlcmVuY2VzIHRoZSBOb2RlJ3Mga2luZC4gVGhpcyBpcyB1c2VmdWwgZm9yIHRoZSBcImVsc2VcIlxuICAgKiBicmFuY2ggb2YgY29kZSB0aGF0IGlzIGF0dGVtcHRpbmcgdG8gaGFuZGxlIGFsbCBwb3NzaWJsZSBpbnB1dCBOb2RlIHR5cGVzLCB0byBlbnN1cmUgYWxsIGNhc2VzXG4gICAqIGNvdmVyZWQuXG4gICAqL1xuICBmdW5jdGlvbiBlcnJvclVuaW1wbGVtZW50ZWRLaW5kKG5vZGU6IHRzLk5vZGUsIHdoZXJlOiBzdHJpbmcpIHtcbiAgICByZXBvcnREaWFnbm9zdGljKGRpYWdub3N0aWNzLCBub2RlLCBgJHt0cy5TeW50YXhLaW5kW25vZGUua2luZF19IG5vdCBpbXBsZW1lbnRlZCBpbiAke3doZXJlfWApO1xuICB9XG5cbiAgLyoqXG4gICAqIGdldE5hbWVzcGFjZUZvckxvY2FsRGVjbGFyYXRpb24gcmV0dXJucyB0aGUgbmFtZXNwYWNlIHRoYXQgc2hvdWxkIGJlIHVzZWQgZm9yIHRoZSBnaXZlblxuICAgKiBkZWNsYXJhdGlvbiwgZGVjaWRpbmcgd2hldGhlciB0byBuYW1lc3BhY2UgdGhlIHN5bWJvbCB0byB0aGUgZmlsZSBvciB3aGV0aGVyIHRvIGNyZWF0ZSBhXG4gICAqIGdsb2JhbCBuYW1lLlxuICAgKlxuICAgKiBUaGUgZnVuY3Rpb24gY292ZXJzIHRoZXNlIGNhc2VzOlxuICAgKiAxKSBhIGRlY2xhcmF0aW9uIGluIGEgLmQudHNcbiAgICogMWEpIHdoZXJlIHRoZSAuZC50cyBpcyBhbiBleHRlcm5hbCBtb2R1bGUgICAgIC0tPiBuYW1lc3BhY2VcbiAgICogMWIpIHdoZXJlIHRoZSAuZC50cyBpcyBub3QgYW4gZXh0ZXJuYWwgbW9kdWxlIC0tPiBnbG9iYWxcbiAgICogMikgYSBkZWNsYXJhdGlvbiBpbiBhIC50cyBmaWxlIChhbGwgYXJlIHRyZWF0ZWQgYXMgbW9kdWxlcylcbiAgICogMmEpIHRoYXQgaXMgZXhwb3J0ZWQgICAgICAgICAgICAgICAgICAgICAgICAgIC0tPiBuYW1lc3BhY2VcbiAgICogMmIpIHRoYXQgaXMgdW5leHBvcnRlZCAgICAgICAgICAgICAgICAgICAgICAgIC0tPiBnbG9iYWxcbiAgICpcbiAgICogRm9yIDEpLCBhbGwgc3ltYm9scyBpbiAuZC50cyBzaG91bGQgZ2VuZXJhbGx5IGJlIG5hbWVzcGFjZWQgdG8gdGhlIGZpbGUgdG8gYXZvaWQgY29sbGlzaW9ucy5cbiAgICogSG93ZXZlciAuZC50cyBmaWxlcyB0aGF0IGFyZSBub3QgZXh0ZXJuYWwgbW9kdWxlcyBkbyBkZWNsYXJlIGdsb2JhbCBuYW1lcyAoMWIpLlxuICAgKlxuICAgKiBGb3IgMiksIGFtYmllbnQgZGVjbGFyYXRpb25zIGluIC50cyBmaWxlcyBtdXN0IGJlIG5hbWVzcGFjZWQsIGZvciB0aGUgc2FtZSBjb2xsaXNpb24gcmVhc29ucy5cbiAgICogVGhlIGV4Y2VwdGlvbiBpcyAyYiksIHdoZXJlIGluIFR5cGVTY3JpcHQsIGFuIHVuZXhwb3J0ZWQgbG9jYWwgXCJkZWNsYXJlIGNvbnN0IHg6IHN0cmluZztcIlxuICAgKiBjcmVhdGVzIGEgc3ltYm9sIHRoYXQsIHdoZW4gdXNlZCBsb2NhbGx5LCBpcyBlbWl0dGVkIGFzIGp1c3QgXCJ4XCIuIFRoYXQgaXMsIGl0IGJlaGF2ZXNcbiAgICogbGlrZSBhIHZhcmlhYmxlIGRlY2xhcmVkIGluIGEgJ2RlY2xhcmUgZ2xvYmFsJyBibG9jay4gQ2xvc3VyZSBDb21waWxlciB3b3VsZCBmYWlsIHRoZSBidWlsZCBpZlxuICAgKiB0aGVyZSBpcyBubyBkZWNsYXJhdGlvbiBmb3IgXCJ4XCIsIHNvIHRzaWNrbGUgbXVzdCBnZW5lcmF0ZSBhIGdsb2JhbCBleHRlcm5hbCBzeW1ib2wsIGkuZS5cbiAgICogd2l0aG91dCB0aGUgbmFtZXNwYWNlIHdyYXBwZXIuXG4gICAqL1xuICBmdW5jdGlvbiBnZXROYW1lc3BhY2VGb3JUb3BMZXZlbERlY2xhcmF0aW9uKFxuICAgICAgZGVjbGFyYXRpb246IHRzLkRlY2xhcmF0aW9uLCBuYW1lc3BhY2U6IFJlYWRvbmx5QXJyYXk8c3RyaW5nPik6IFJlYWRvbmx5QXJyYXk8c3RyaW5nPiB7XG4gICAgLy8gT25seSB1c2Ugcm9vdE5hbWVzcGFjZSBmb3IgdG9wIGxldmVsIHN5bWJvbHMsIGFueSBvdGhlciBuYW1lc3BhY2luZyAoZ2xvYmFsIG5hbWVzLCBuZXN0ZWRcbiAgICAvLyBuYW1lc3BhY2VzKSBpcyBhbHdheXMga2VwdC5cbiAgICBpZiAobmFtZXNwYWNlLmxlbmd0aCAhPT0gMCkgcmV0dXJuIG5hbWVzcGFjZTtcbiAgICAvLyBBbGwgbmFtZXMgaW4gYSBtb2R1bGUgKGV4dGVybmFsKSAuZC50cyBmaWxlIGNhbiBvbmx5IGJlIGFjY2Vzc2VkIGxvY2FsbHksIHNvIHRoZXkgYWx3YXlzIGdldFxuICAgIC8vIG5hbWVzcGFjZSBwcmVmaXhlZC5cbiAgICBpZiAoaXNEdHMgJiYgaXNFeHRlcm5hbE1vZHVsZSkgcmV0dXJuIFtyb290TmFtZXNwYWNlXTtcbiAgICAvLyBTYW1lIGZvciBleHBvcnRlZCBkZWNsYXJhdGlvbnMgaW4gcmVndWxhciAudHMgZmlsZXMuXG4gICAgaWYgKGhhc01vZGlmaWVyRmxhZyhkZWNsYXJhdGlvbiwgdHMuTW9kaWZpZXJGbGFncy5FeHBvcnQpKSByZXR1cm4gW3Jvb3ROYW1lc3BhY2VdO1xuICAgIC8vIEJ1dCBsb2NhbCBkZWNsYXJhdGlvbnMgaW4gLnRzIGZpbGVzIG9yIC5kLnRzIGZpbGVzICgxYiwgMmIpIGFyZSBnbG9iYWwsIHRvby5cbiAgICByZXR1cm4gW107XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBmb3IgdGhlIGxvY2F0aW9uOiBlaXRoZXIgdGhlIG5hbWVzcGFjZSwgb3IsIGlmIGVtcHR5LCB0aGVcbiAgICogY3VycmVudCBzb3VyY2UgZmlsZSBuYW1lLiBUaGlzIGlzIGludGVuZGVkIHRvIGJlIGluY2x1ZGVkIGluIHRoZSBlbWl0IGZvciB3YXJuaW5ncywgc28gdGhhdFxuICAgKiB1c2VycyBjYW4gbW9yZSBlYXNpbHkgZmluZCB3aGVyZSBhIHByb2JsZW1hdGljIGRlZmluaXRpb24gaXMgZnJvbS5cbiAgICpcbiAgICogVGhlIGNvZGUgYmVsb3cgZG9lcyBub3QgdXNlIGRpYWdub3N0aWNzIHRvIGF2b2lkIGJyZWFraW5nIHRoZSBidWlsZCBmb3IgaGFybWxlc3MgdW5oYW5kbGVkXG4gICAqIGNhc2VzLlxuICAgKi9cbiAgZnVuY3Rpb24gZGVidWdMb2NhdGlvblN0cihub2RlOiB0cy5Ob2RlLCBuYW1lc3BhY2U6IFJlYWRvbmx5QXJyYXk8c3RyaW5nPikge1xuICAgIHJldHVybiBuYW1lc3BhY2Uuam9pbignLicpIHx8IHBhdGguYmFzZW5hbWUobm9kZS5nZXRTb3VyY2VGaWxlKCkuZmlsZU5hbWUpO1xuICB9XG5cbiAgZnVuY3Rpb24gdmlzaXRvcihub2RlOiB0cy5Ob2RlLCBuYW1lc3BhY2U6IFJlYWRvbmx5QXJyYXk8c3RyaW5nPikge1xuICAgIGlmIChub2RlLnBhcmVudCA9PT0gc291cmNlRmlsZSkge1xuICAgICAgbmFtZXNwYWNlID0gZ2V0TmFtZXNwYWNlRm9yVG9wTGV2ZWxEZWNsYXJhdGlvbihub2RlIGFzIHRzLkRlY2xhcmF0aW9uU3RhdGVtZW50LCBuYW1lc3BhY2UpO1xuICAgIH1cblxuICAgIHN3aXRjaCAobm9kZS5raW5kKSB7XG4gICAgICBjYXNlIHRzLlN5bnRheEtpbmQuTW9kdWxlRGVjbGFyYXRpb246XG4gICAgICAgIGNvbnN0IGRlY2wgPSBub2RlIGFzIHRzLk1vZHVsZURlY2xhcmF0aW9uO1xuICAgICAgICBzd2l0Y2ggKGRlY2wubmFtZS5raW5kKSB7XG4gICAgICAgICAgY2FzZSB0cy5TeW50YXhLaW5kLklkZW50aWZpZXI6XG4gICAgICAgICAgICBpZiAoZGVjbC5mbGFncyAmIHRzLk5vZGVGbGFncy5HbG9iYWxBdWdtZW50YXRpb24pIHtcbiAgICAgICAgICAgICAgLy8gRS5nLiBcImRlY2xhcmUgZ2xvYmFsIHsgLi4uIH1cIi4gIFJlc2V0IHRvIHRoZSBvdXRlciBuYW1lc3BhY2UuXG4gICAgICAgICAgICAgIG5hbWVzcGFjZSA9IFtdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgLy8gRS5nLiBcImRlY2xhcmUgbmFtZXNwYWNlIGZvbyB7XCJcbiAgICAgICAgICAgICAgY29uc3QgbmFtZSA9IGdldElkZW50aWZpZXJUZXh0KGRlY2wubmFtZSBhcyB0cy5JZGVudGlmaWVyKTtcbiAgICAgICAgICAgICAgaWYgKGlzRmlyc3RWYWx1ZURlY2xhcmF0aW9uKGRlY2wpKSB7XG4gICAgICAgICAgICAgICAgZW1pdCgnLyoqIEBjb25zdCAqL1xcbicpO1xuICAgICAgICAgICAgICAgIHdyaXRlVmFyaWFibGVTdGF0ZW1lbnQobmFtZSwgbmFtZXNwYWNlLCAne30nKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBuYW1lc3BhY2UgPSBuYW1lc3BhY2UuY29uY2F0KG5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGRlY2wuYm9keSkgdmlzaXRvcihkZWNsLmJvZHksIG5hbWVzcGFjZSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIHRzLlN5bnRheEtpbmQuU3RyaW5nTGl0ZXJhbDpcbiAgICAgICAgICAgIC8vIEUuZy4gXCJkZWNsYXJlIG1vZHVsZSAnZm9vJyB7XCIgKG5vdGUgdGhlIHF1b3RlcykuXG4gICAgICAgICAgICAvLyBXZSBzdGlsbCB3YW50IHRvIGVtaXQgZXh0ZXJucyBmb3IgdGhpcyBtb2R1bGUsIGJ1dCBDbG9zdXJlIGRvZXNuJ3QgcHJvdmlkZSBhXG4gICAgICAgICAgICAvLyBtZWNoYW5pc20gZm9yIG1vZHVsZS1zY29wZWQgZXh0ZXJucy4gSW5zdGVhZCwgd2UgZW1pdCBpbiBhIG1hbmdsZWQgbmFtZXNwYWNlLlxuICAgICAgICAgICAgLy8gVGhlIG1hbmdsZWQgbmFtZXNwYWNlIChhZnRlciByZXNvbHZpbmcgZmlsZXMpIG1hdGNoZXMgdGhlIGVtaXQgZm9yIGFuIG9yaWdpbmFsIG1vZHVsZVxuICAgICAgICAgICAgLy8gZmlsZSwgc28gZWZmZWN0aXZlbHkgdGhpcyBhdWdtZW50cyBhbnkgZXhpc3RpbmcgbW9kdWxlLlxuXG4gICAgICAgICAgICBjb25zdCBpbXBvcnROYW1lID0gKGRlY2wubmFtZSBhcyB0cy5TdHJpbmdMaXRlcmFsKS50ZXh0O1xuICAgICAgICAgICAgY29uc3QgaW1wb3J0ZWRNb2R1bGVOYW1lID1cbiAgICAgICAgICAgICAgICByZXNvbHZlTW9kdWxlTmFtZSh7bW9kdWxlUmVzb2x1dGlvbkhvc3QsIG9wdGlvbnN9LCBzb3VyY2VGaWxlLmZpbGVOYW1lLCBpbXBvcnROYW1lKTtcbiAgICAgICAgICAgIGNvbnN0IG1hbmdsZWQgPSBtb2R1bGVOYW1lQXNJZGVudGlmaWVyKGhvc3QsIGltcG9ydGVkTW9kdWxlTmFtZSk7XG4gICAgICAgICAgICBlbWl0KGAvLyBEZXJpdmVkIGZyb206IGRlY2xhcmUgbW9kdWxlIFwiJHtpbXBvcnROYW1lfVwiXFxuYCk7XG4gICAgICAgICAgICBuYW1lc3BhY2UgPSBbbWFuZ2xlZF07XG5cbiAgICAgICAgICAgIC8vIERlY2xhcmUgXCJtYW5nbGVkJG5hbWVcIiBpZiBpdCdzIG5vdCBkZWNsYXJlZCBhbHJlYWR5IGVsc2V3aGVyZS5cbiAgICAgICAgICAgIGlmIChpc0ZpcnN0VmFsdWVEZWNsYXJhdGlvbihkZWNsKSkge1xuICAgICAgICAgICAgICBlbWl0KCcvKiogQGNvbnN0ICovXFxuJyk7XG4gICAgICAgICAgICAgIHdyaXRlVmFyaWFibGVTdGF0ZW1lbnQobWFuZ2xlZCwgW10sICd7fScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gRGVjbGFyZSB0aGUgY29udGVudHMgaW5zaWRlIHRoZSBcIm1hbmdsZWQkbmFtZVwiLlxuICAgICAgICAgICAgaWYgKGRlY2wuYm9keSkgdmlzaXRvcihkZWNsLmJvZHksIFttYW5nbGVkXSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgZXJyb3JVbmltcGxlbWVudGVkS2luZChkZWNsLm5hbWUsICdleHRlcm5zIGdlbmVyYXRpb24gb2YgbmFtZXNwYWNlJyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgdHMuU3ludGF4S2luZC5Nb2R1bGVCbG9jazpcbiAgICAgICAgY29uc3QgYmxvY2sgPSBub2RlIGFzIHRzLk1vZHVsZUJsb2NrO1xuICAgICAgICBmb3IgKGNvbnN0IHN0bXQgb2YgYmxvY2suc3RhdGVtZW50cykge1xuICAgICAgICAgIHZpc2l0b3Ioc3RtdCwgbmFtZXNwYWNlKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgdHMuU3ludGF4S2luZC5JbXBvcnRFcXVhbHNEZWNsYXJhdGlvbjpcbiAgICAgICAgY29uc3QgaW1wb3J0RXF1YWxzID0gbm9kZSBhcyB0cy5JbXBvcnRFcXVhbHNEZWNsYXJhdGlvbjtcbiAgICAgICAgY29uc3QgbG9jYWxOYW1lID0gZ2V0SWRlbnRpZmllclRleHQoaW1wb3J0RXF1YWxzLm5hbWUpO1xuICAgICAgICBpZiAobG9jYWxOYW1lID09PSAnbmcnKSB7XG4gICAgICAgICAgZW1pdChgXFxuLyogU2tpcHBpbmcgcHJvYmxlbWF0aWMgaW1wb3J0IG5nID0gLi4uOyAqL1xcbmApO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpbXBvcnRFcXVhbHMubW9kdWxlUmVmZXJlbmNlLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuRXh0ZXJuYWxNb2R1bGVSZWZlcmVuY2UpIHtcbiAgICAgICAgICBhZGRJbXBvcnRBbGlhc2VzKGltcG9ydEVxdWFscyk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcW4gPSBnZXRFbnRpdHlOYW1lVGV4dChpbXBvcnRFcXVhbHMubW9kdWxlUmVmZXJlbmNlKTtcbiAgICAgICAgLy8gQGNvbnN0IHNvIHRoYXQgQ2xvc3VyZSBDb21waWxlciB1bmRlcnN0YW5kcyB0aGlzIGlzIGFuIGFsaWFzLlxuICAgICAgICBpZiAobmFtZXNwYWNlLmxlbmd0aCA9PT0gMCkgZW1pdCgnLyoqIEBjb25zdCAqL1xcbicpO1xuICAgICAgICB3cml0ZVZhcmlhYmxlU3RhdGVtZW50KGxvY2FsTmFtZSwgbmFtZXNwYWNlLCBxbik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSB0cy5TeW50YXhLaW5kLkNsYXNzRGVjbGFyYXRpb246XG4gICAgICBjYXNlIHRzLlN5bnRheEtpbmQuSW50ZXJmYWNlRGVjbGFyYXRpb246XG4gICAgICAgIHdyaXRlVHlwZShub2RlIGFzIHRzLkludGVyZmFjZURlY2xhcmF0aW9uIHwgdHMuQ2xhc3NEZWNsYXJhdGlvbiwgbmFtZXNwYWNlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIHRzLlN5bnRheEtpbmQuRnVuY3Rpb25EZWNsYXJhdGlvbjpcbiAgICAgICAgY29uc3QgZm5EZWNsID0gbm9kZSBhcyB0cy5GdW5jdGlvbkRlY2xhcmF0aW9uO1xuICAgICAgICBjb25zdCBuYW1lID0gZm5EZWNsLm5hbWU7XG4gICAgICAgIGlmICghbmFtZSkge1xuICAgICAgICAgIHJlcG9ydERpYWdub3N0aWMoZGlhZ25vc3RpY3MsIGZuRGVjbCwgJ2Fub255bW91cyBmdW5jdGlvbiBpbiBleHRlcm5zJyk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgLy8gR2F0aGVyIHVwIGFsbCBvdmVybG9hZHMgb2YgdGhpcyBmdW5jdGlvbi5cbiAgICAgICAgY29uc3Qgc3ltID0gdHlwZUNoZWNrZXIuZ2V0U3ltYm9sQXRMb2NhdGlvbihuYW1lKSE7XG4gICAgICAgIGNvbnN0IGRlY2xzID0gc3ltLmRlY2xhcmF0aW9ucyEuZmlsdGVyKHRzLmlzRnVuY3Rpb25EZWNsYXJhdGlvbik7XG4gICAgICAgIC8vIE9ubHkgZW1pdCB0aGUgZmlyc3QgZGVjbGFyYXRpb24gb2YgZWFjaCBvdmVybG9hZGVkIGZ1bmN0aW9uLlxuICAgICAgICBpZiAoZm5EZWNsICE9PSBkZWNsc1swXSkgYnJlYWs7XG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IGVtaXRGdW5jdGlvblR5cGUoZGVjbHMpO1xuICAgICAgICB3cml0ZUZ1bmN0aW9uKG5hbWUsIHBhcmFtcywgbmFtZXNwYWNlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIHRzLlN5bnRheEtpbmQuVmFyaWFibGVTdGF0ZW1lbnQ6XG4gICAgICAgIGZvciAoY29uc3QgZGVjbCBvZiAobm9kZSBhcyB0cy5WYXJpYWJsZVN0YXRlbWVudCkuZGVjbGFyYXRpb25MaXN0LmRlY2xhcmF0aW9ucykge1xuICAgICAgICAgIHdyaXRlVmFyaWFibGVEZWNsYXJhdGlvbihkZWNsLCBuYW1lc3BhY2UpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSB0cy5TeW50YXhLaW5kLkVudW1EZWNsYXJhdGlvbjpcbiAgICAgICAgd3JpdGVFbnVtKG5vZGUgYXMgdHMuRW51bURlY2xhcmF0aW9uLCBuYW1lc3BhY2UpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgdHMuU3ludGF4S2luZC5UeXBlQWxpYXNEZWNsYXJhdGlvbjpcbiAgICAgICAgd3JpdGVUeXBlQWxpYXMobm9kZSBhcyB0cy5UeXBlQWxpYXNEZWNsYXJhdGlvbiwgbmFtZXNwYWNlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIHRzLlN5bnRheEtpbmQuSW1wb3J0RGVjbGFyYXRpb246XG4gICAgICAgIGFkZEltcG9ydEFsaWFzZXMobm9kZSBhcyB0cy5JbXBvcnREZWNsYXJhdGlvbik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSB0cy5TeW50YXhLaW5kLk5hbWVzcGFjZUV4cG9ydERlY2xhcmF0aW9uOlxuICAgICAgY2FzZSB0cy5TeW50YXhLaW5kLkV4cG9ydEFzc2lnbm1lbnQ6XG4gICAgICAgIC8vIEhhbmRsZWQgb24gdGhlIGZpbGUgbGV2ZWwuXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSB0cy5TeW50YXhLaW5kLkV4cG9ydERlY2xhcmF0aW9uOlxuICAgICAgICBjb25zdCBleHBvcnREZWNsYXJhdGlvbiA9IG5vZGUgYXMgdHMuRXhwb3J0RGVjbGFyYXRpb247XG4gICAgICAgIHdyaXRlRXhwb3J0RGVjbGFyYXRpb24oZXhwb3J0RGVjbGFyYXRpb24sIG5hbWVzcGFjZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgZW1pdChgXFxuLy8gVE9ETyh0c2lja2xlKTogJHt0cy5TeW50YXhLaW5kW25vZGUua2luZF19IGluICR7XG4gICAgICAgICAgICBkZWJ1Z0xvY2F0aW9uU3RyKG5vZGUsIG5hbWVzcGFjZSl9XFxuYCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxufVxuIl19