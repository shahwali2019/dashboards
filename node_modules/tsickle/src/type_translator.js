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
        define("tsickle/src/type_translator", ["require", "exports", "path", "typescript", "tsickle/src/annotator_host", "tsickle/src/transformer_util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var path = require("path");
    var ts = require("typescript");
    var annotator_host_1 = require("tsickle/src/annotator_host");
    var transformer_util_1 = require("tsickle/src/transformer_util");
    /**
     * TypeScript allows you to write identifiers quoted, like:
     *   interface Foo {
     *     'bar': string;
     *     'complex name': string;
     *   }
     *   Foo.bar;  // ok
     *   Foo['bar']  // ok
     *   Foo['complex name']  // ok
     *
     * In Closure-land, we want identify that the legal name 'bar' can become an
     * ordinary field, but we need to skip strings like 'complex name'.
     */
    function isValidClosurePropertyName(name) {
        // In local experimentation, it appears that reserved words like 'var' and
        // 'if' are legal JS and still accepted by Closure.
        return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name);
    }
    exports.isValidClosurePropertyName = isValidClosurePropertyName;
    /**
     * Determines if fileName refers to a builtin lib.d.ts file.
     * This is a terrible hack but it mirrors a similar thing done in Clutz.
     */
    function isBuiltinLibDTS(fileName) {
        return fileName.match(/\blib\.(?:[^/]+\.)?d\.ts$/) != null;
    }
    exports.isBuiltinLibDTS = isBuiltinLibDTS;
    /**
     * @return True if the named type is considered compatible with the Closure-defined
     *     type of the same name, e.g. "Array".  Note that we don't actually enforce
     *     that the types are actually compatible, but mostly just hope that they are due
     *     to being derived from the same HTML specs.
     */
    function isClosureProvidedType(symbol) {
        return symbol.declarations != null &&
            symbol.declarations.some(function (n) { return isBuiltinLibDTS(n.getSourceFile().fileName); });
    }
    function typeToDebugString(type) {
        var e_1, _a, e_2, _b;
        var debugString = "flags:0x" + type.flags.toString(16);
        if (type.aliasSymbol) {
            debugString += " alias:" + symbolToDebugString(type.aliasSymbol);
        }
        if (type.aliasTypeArguments) {
            debugString += " aliasArgs:<" + type.aliasTypeArguments.map(typeToDebugString).join(',') + ">";
        }
        // Just the unique flags (powers of two). Declared in src/compiler/types.ts.
        var basicTypes = [
            ts.TypeFlags.Any, ts.TypeFlags.String, ts.TypeFlags.Number,
            ts.TypeFlags.Boolean, ts.TypeFlags.Enum, ts.TypeFlags.StringLiteral,
            ts.TypeFlags.NumberLiteral, ts.TypeFlags.BooleanLiteral, ts.TypeFlags.EnumLiteral,
            ts.TypeFlags.ESSymbol, ts.TypeFlags.UniqueESSymbol, ts.TypeFlags.Void,
            ts.TypeFlags.Undefined, ts.TypeFlags.Null, ts.TypeFlags.Never,
            ts.TypeFlags.TypeParameter, ts.TypeFlags.Object, ts.TypeFlags.Union,
            ts.TypeFlags.Intersection, ts.TypeFlags.Index, ts.TypeFlags.IndexedAccess,
            ts.TypeFlags.Conditional, ts.TypeFlags.Substitution,
        ];
        try {
            for (var basicTypes_1 = __values(basicTypes), basicTypes_1_1 = basicTypes_1.next(); !basicTypes_1_1.done; basicTypes_1_1 = basicTypes_1.next()) {
                var flag = basicTypes_1_1.value;
                if ((type.flags & flag) !== 0) {
                    debugString += " " + ts.TypeFlags[flag];
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (basicTypes_1_1 && !basicTypes_1_1.done && (_a = basicTypes_1.return)) _a.call(basicTypes_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (type.flags === ts.TypeFlags.Object) {
            var objType = type;
            debugString += " objectFlags:0x" + objType.objectFlags;
            // Just the unique flags (powers of two). Declared in src/compiler/types.ts.
            var objectFlags = [
                ts.ObjectFlags.Class,
                ts.ObjectFlags.Interface,
                ts.ObjectFlags.Reference,
                ts.ObjectFlags.Tuple,
                ts.ObjectFlags.Anonymous,
                ts.ObjectFlags.Mapped,
                ts.ObjectFlags.Instantiated,
                ts.ObjectFlags.ObjectLiteral,
                ts.ObjectFlags.EvolvingArray,
                ts.ObjectFlags.ObjectLiteralPatternWithComputedProperties,
            ];
            try {
                for (var objectFlags_1 = __values(objectFlags), objectFlags_1_1 = objectFlags_1.next(); !objectFlags_1_1.done; objectFlags_1_1 = objectFlags_1.next()) {
                    var flag = objectFlags_1_1.value;
                    if ((objType.objectFlags & flag) !== 0) {
                        debugString += " object:" + ts.ObjectFlags[flag];
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (objectFlags_1_1 && !objectFlags_1_1.done && (_b = objectFlags_1.return)) _b.call(objectFlags_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
        if (type.symbol && type.symbol.name !== '__type') {
            debugString += " symbol.name:" + JSON.stringify(type.symbol.name);
        }
        if (type.pattern) {
            debugString += " destructuring:true";
        }
        return "{type " + debugString + "}";
    }
    exports.typeToDebugString = typeToDebugString;
    function symbolToDebugString(sym) {
        var e_3, _a;
        var debugString = JSON.stringify(sym.name) + " flags:0x" + sym.flags.toString(16);
        // Just the unique flags (powers of two). Declared in src/compiler/types.ts.
        var symbolFlags = [
            ts.SymbolFlags.FunctionScopedVariable,
            ts.SymbolFlags.BlockScopedVariable,
            ts.SymbolFlags.Property,
            ts.SymbolFlags.EnumMember,
            ts.SymbolFlags.Function,
            ts.SymbolFlags.Class,
            ts.SymbolFlags.Interface,
            ts.SymbolFlags.ConstEnum,
            ts.SymbolFlags.RegularEnum,
            ts.SymbolFlags.ValueModule,
            ts.SymbolFlags.NamespaceModule,
            ts.SymbolFlags.TypeLiteral,
            ts.SymbolFlags.ObjectLiteral,
            ts.SymbolFlags.Method,
            ts.SymbolFlags.Constructor,
            ts.SymbolFlags.GetAccessor,
            ts.SymbolFlags.SetAccessor,
            ts.SymbolFlags.Signature,
            ts.SymbolFlags.TypeParameter,
            ts.SymbolFlags.TypeAlias,
            ts.SymbolFlags.ExportValue,
            ts.SymbolFlags.Alias,
            ts.SymbolFlags.Prototype,
            ts.SymbolFlags.ExportStar,
            ts.SymbolFlags.Optional,
            ts.SymbolFlags.Transient,
        ];
        try {
            for (var symbolFlags_1 = __values(symbolFlags), symbolFlags_1_1 = symbolFlags_1.next(); !symbolFlags_1_1.done; symbolFlags_1_1 = symbolFlags_1.next()) {
                var flag = symbolFlags_1_1.value;
                if ((sym.flags & flag) !== 0) {
                    debugString += " " + ts.SymbolFlags[flag];
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (symbolFlags_1_1 && !symbolFlags_1_1.done && (_a = symbolFlags_1.return)) _a.call(symbolFlags_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return debugString;
    }
    exports.symbolToDebugString = symbolToDebugString;
    /**
     * Searches for an ambient module declaration in the ancestors of declarations, depth first, and
     * returns the first or null if none found.
     */
    function getContainingAmbientModuleDeclaration(declarations) {
        var e_4, _a;
        try {
            for (var declarations_1 = __values(declarations), declarations_1_1 = declarations_1.next(); !declarations_1_1.done; declarations_1_1 = declarations_1.next()) {
                var declaration = declarations_1_1.value;
                var parent_1 = declaration.parent;
                while (parent_1) {
                    if (ts.isModuleDeclaration(parent_1) && ts.isStringLiteral(parent_1.name)) {
                        return parent_1;
                    }
                    parent_1 = parent_1.parent;
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (declarations_1_1 && !declarations_1_1.done && (_a = declarations_1.return)) _a.call(declarations_1);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return null;
    }
    /** Returns true if any of declarations is a top level declaration in an external module. */
    function isTopLevelExternal(declarations) {
        var e_5, _a;
        try {
            for (var declarations_2 = __values(declarations), declarations_2_1 = declarations_2.next(); !declarations_2_1.done; declarations_2_1 = declarations_2.next()) {
                var declaration = declarations_2_1.value;
                if (declaration.parent === undefined)
                    continue;
                if (ts.isSourceFile(declaration.parent) && ts.isExternalModule(declaration.parent))
                    return true;
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (declarations_2_1 && !declarations_2_1.done && (_a = declarations_2.return)) _a.call(declarations_2);
            }
            finally { if (e_5) throw e_5.error; }
        }
        return false;
    }
    /**
     * Returns true if a and b are (or were originally before transformation) nodes of the same source
     * file.
     */
    function isDeclaredInSameFile(a, b) {
        return ts.getOriginalNode(a).getSourceFile() === ts.getOriginalNode(b).getSourceFile();
    }
    /** TypeTranslator translates TypeScript types to Closure types. */
    var TypeTranslator = /** @class */ (function () {
        /**
         * @param node is the source AST ts.Node the type comes from.  This is used
         *     in some cases (e.g. anonymous types) for looking up field names.
         * @param pathBlackList is a set of paths that should never get typed;
         *     any reference to symbols defined in these paths should by typed
         *     as {?}.
         * @param symbolsToAliasedNames a mapping from symbols (`Foo`) to a name in scope they should be
         *     emitted as (e.g. `tsickle_forward_declare_1.Foo`). Can be augmented during type
         *     translation, e.g. to blacklist a symbol.
         */
        function TypeTranslator(host, typeChecker, node, pathBlackList, symbolsToAliasedNames, ensureSymbolDeclared) {
            if (symbolsToAliasedNames === void 0) { symbolsToAliasedNames = new Map(); }
            if (ensureSymbolDeclared === void 0) { ensureSymbolDeclared = function () { }; }
            this.host = host;
            this.typeChecker = typeChecker;
            this.node = node;
            this.pathBlackList = pathBlackList;
            this.symbolsToAliasedNames = symbolsToAliasedNames;
            this.ensureSymbolDeclared = ensureSymbolDeclared;
            /**
             * A list of type literals we've encountered while emitting; used to avoid getting stuck in
             * recursive types.
             */
            this.seenAnonymousTypes = new Set();
            /**
             * Whether to write types suitable for an \@externs file. Externs types must not refer to
             * non-externs types (i.e. non ambient types) and need to use fully qualified names.
             */
            this.isForExterns = false;
            // Normalize paths to not break checks on Windows.
            if (this.pathBlackList != null) {
                this.pathBlackList =
                    new Set(Array.from(this.pathBlackList.values()).map(function (p) { return path.normalize(p); }));
            }
        }
        /**
         * Converts a ts.Symbol to a string, applying aliases and ensuring symbols are imported.
         * @return a string representation of the symbol as a valid Closure type name, or `undefined` if
         *     the type cannot be expressed (e.g. for anonymous types).
         */
        TypeTranslator.prototype.symbolToString = function (sym) {
            var _this = this;
            // TypeScript resolves e.g. union types to their members, which can include symbols not declared
            // in the current scope. Ensure that all symbols found this way are actually declared.
            // This must happen before the alias check below, it might introduce a new alias for the symbol.
            if (!this.isForExterns && (sym.flags & ts.SymbolFlags.TypeParameter) === 0) {
                this.ensureSymbolDeclared(sym);
            }
            var name = this.typeChecker.symbolToEntityName(sym, ts.SymbolFlags.Type, this.node, ts.NodeBuilderFlags.UseFullyQualifiedType);
            // name might be undefined, e.g. for anonymous classes.
            if (!name)
                return undefined;
            var str = '';
            /** Recursively visits components of entity name and writes them to `str` above. */
            var writeEntityWithSymbols = function (name) {
                var identifier;
                if (ts.isQualifiedName(name)) {
                    writeEntityWithSymbols(name.left);
                    str += '.';
                    identifier = name.right;
                }
                else {
                    identifier = name;
                }
                var symbol = identifier.symbol;
                // When writing a symbol, check if there is an alias for it in the current scope that should
                // take precedence, e.g. from a goog.requireType.
                if (symbol.flags & ts.SymbolFlags.Alias) {
                    symbol = _this.typeChecker.getAliasedSymbol(symbol);
                }
                var alias = _this.symbolsToAliasedNames.get(symbol);
                if (alias) {
                    // If so, discard the entire current text and only use the alias - otherwise if a symbol has
                    // a local alias but appears in a dotted type path (e.g. when it's imported using import *
                    // as foo), str would contain both the prefx *and* the full alias (foo.alias.name).
                    str = alias;
                    return;
                }
                var text = transformer_util_1.getIdentifierText(identifier);
                if (str.length === 0) {
                    var mangledPrefix = _this.maybeGetMangledNamePrefix(symbol);
                    text = mangledPrefix + text;
                }
                str += text;
            };
            writeEntityWithSymbols(name);
            return this.stripClutzNamespace(str);
        };
        /**
         * Returns the mangled name prefix for symbol, or an empty string if not applicable.
         *
         * Type names are emitted with a mangled prefix if they are top level symbols declared in an
         * external module (.d.ts or .ts), and are ambient declarations ("declare ..."). This is because
         * their declarations get moved to externs files (to make external names visible to Closure and
         * prevent renaming), which only use global names. This means the names must be mangled to prevent
         * collisions and allow referencing them uniquely.
         *
         * This method also handles the special case of symbols declared in an ambient external module
         * context.
         *
         * Symbols declared in a global block, e.g. "declare global { type X; }", are handled implicitly:
         * when referenced, they are written as just "X", which is not a top level declaration, so the
         * code below ignores them.
         */
        TypeTranslator.prototype.maybeGetMangledNamePrefix = function (symbol) {
            var _this = this;
            if (!symbol.declarations)
                return '';
            var declarations = symbol.declarations;
            var ambientModuleDeclaration = null;
            // If the symbol is neither a top level declaration in an external module nor in an ambient
            // block, tsickle should not emit a prefix: it's either not an external symbol, or it's an
            // external symbol nested in a module, so it will need to be qualified, and the mangling prefix
            // goes on the qualifier.
            if (!isTopLevelExternal(declarations)) {
                ambientModuleDeclaration = getContainingAmbientModuleDeclaration(declarations);
                if (!ambientModuleDeclaration)
                    return '';
            }
            // At this point, the declaration is from an external module (possibly ambient).
            // These declarations must be prefixed if either:
            // (a) tsickle is emitting an externs file, so all symbols are qualified within it
            // (b) or the declaration must be an exported ambient declaration from the local file.
            // Ambient external declarations from other files are imported, so there's a local alias for the
            // module and no mangling is needed.
            if (!this.isForExterns &&
                !declarations.every(function (d) { return isDeclaredInSameFile(_this.node, d) && transformer_util_1.isAmbient(d) &&
                    transformer_util_1.hasModifierFlag(d, ts.ModifierFlags.Export); })) {
                return '';
            }
            // If from an ambient declaration, use and resolve the name from that. Otherwise, use the file
            // name from the (arbitrary) first declaration to mangle.
            var fileName = ambientModuleDeclaration ?
                ambientModuleDeclaration.name.text :
                ts.getOriginalNode(declarations[0]).getSourceFile().fileName;
            var mangled = annotator_host_1.moduleNameAsIdentifier(this.host, fileName);
            return mangled + '.';
        };
        // Clutz (https://github.com/angular/clutz) emits global type symbols hidden in a special
        // ಠ_ಠ.clutz namespace. While most code seen by Tsickle will only ever see local aliases, Clutz
        // symbols can be written by users directly in code, and they can appear by dereferencing
        // TypeAliases. The code below simply strips the prefix, the remaining type name then matches
        // Closure's type.
        TypeTranslator.prototype.stripClutzNamespace = function (name) {
            if (name.startsWith('ಠ_ಠ.clutz.'))
                return name.substring('ಠ_ಠ.clutz.'.length);
            return name;
        };
        TypeTranslator.prototype.translate = function (type) {
            // NOTE: Though type.flags has the name "flags", it usually can only be one
            // of the enum options at a time (except for unions of literal types, e.g. unions of boolean
            // values, string values, enum values). This switch handles all the cases in the ts.TypeFlags
            // enum in the order they occur.
            var e_6, _a;
            // NOTE: Some TypeFlags are marked "internal" in the d.ts but still show up in the value of
            // type.flags. This mask limits the flag checks to the ones in the public API. "lastFlag" here
            // is the last flag handled in this switch statement, and should be kept in sync with
            // typescript.d.ts.
            // NonPrimitive occurs on its own on the lower case "object" type. Special case to "!Object".
            if (type.flags === ts.TypeFlags.NonPrimitive)
                return '!Object';
            // Avoid infinite loops on recursive type literals.
            // It would be nice to just emit the name of the recursive type here (in type.aliasSymbol
            // below), but Closure Compiler does not allow recursive type definitions.
            if (this.seenAnonymousTypes.has(type))
                return '?';
            var isAmbient = false;
            var isInNamespace = false;
            var isModule = false;
            if (type.symbol) {
                try {
                    for (var _b = __values(type.symbol.declarations || []), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var decl = _c.value;
                        if (ts.isExternalModule(decl.getSourceFile()))
                            isModule = true;
                        var current = decl;
                        while (current) {
                            if (ts.getCombinedModifierFlags(current) & ts.ModifierFlags.Ambient)
                                isAmbient = true;
                            if (current.kind === ts.SyntaxKind.ModuleDeclaration)
                                isInNamespace = true;
                            current = current.parent;
                        }
                    }
                }
                catch (e_6_1) { e_6 = { error: e_6_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_6) throw e_6.error; }
                }
            }
            // tsickle cannot generate types for non-ambient namespaces nor any symbols contained in them.
            if (isInNamespace && !isAmbient)
                return '?';
            // Types in externs cannot reference types from external modules.
            // However ambient types in modules get moved to externs, too, so type references work and we
            // can emit a precise type.
            if (this.isForExterns && isModule && !isAmbient)
                return '?';
            var lastFlag = ts.TypeFlags.Substitution;
            var mask = (lastFlag << 1) - 1;
            switch (type.flags & mask) {
                case ts.TypeFlags.Any:
                    return '?';
                case ts.TypeFlags.Unknown:
                    return '*';
                case ts.TypeFlags.String:
                case ts.TypeFlags.StringLiteral:
                    return 'string';
                case ts.TypeFlags.Number:
                case ts.TypeFlags.NumberLiteral:
                    return 'number';
                case ts.TypeFlags.Boolean:
                case ts.TypeFlags.BooleanLiteral:
                    // See the note in translateUnion about booleans.
                    return 'boolean';
                case ts.TypeFlags.Enum:
                    if (!type.symbol) {
                        this.warn("EnumType without a symbol");
                        return '?';
                    }
                    return this.symbolToString(type.symbol) || '?';
                case ts.TypeFlags.ESSymbol:
                case ts.TypeFlags.UniqueESSymbol:
                    // ESSymbol indicates something typed symbol.
                    // UniqueESSymbol indicates a specific unique symbol, used e.g. to index into an object.
                    // Closure does not have this distinction, so tsickle emits both as 'symbol'.
                    return 'symbol';
                case ts.TypeFlags.Void:
                    return 'void';
                case ts.TypeFlags.Undefined:
                    return 'undefined';
                case ts.TypeFlags.Null:
                    return 'null';
                case ts.TypeFlags.Never:
                    this.warn("should not emit a 'never' type");
                    return '?';
                case ts.TypeFlags.TypeParameter:
                    // This is e.g. the T in a type like Foo<T>.
                    if (!type.symbol) {
                        this.warn("TypeParameter without a symbol"); // should not happen (tm)
                        return '?';
                    }
                    // In Closure, type parameters ("<T>") are non-nullable by default, unlike references to
                    // classes or interfaces. However this code path can be reached by bound type parameters,
                    // where the type parameter's symbol references a plain class or interface. In this case,
                    // add `!` to avoid emitting a nullable type.
                    var prefix = '';
                    if ((type.symbol.flags & ts.SymbolFlags.TypeParameter) === 0) {
                        prefix = '!';
                    }
                    var name_1 = this.symbolToString(type.symbol);
                    if (!name_1)
                        return '?';
                    return prefix + name_1;
                case ts.TypeFlags.Object:
                    return this.translateObject(type);
                case ts.TypeFlags.Union:
                    return this.translateUnion(type);
                case ts.TypeFlags.Conditional:
                case ts.TypeFlags.Substitution:
                    this.warn("emitting ? for conditional/substitution type");
                    return '?';
                case ts.TypeFlags.Intersection:
                case ts.TypeFlags.Index:
                case ts.TypeFlags.IndexedAccess:
                    // TODO(ts2.1): handle these special types.
                    this.warn("unhandled type flags: " + ts.TypeFlags[type.flags]);
                    return '?';
                default:
                    // Handle cases where multiple flags are set.
                    // Types with literal members are represented as
                    //   ts.TypeFlags.Union | [literal member]
                    // E.g. an enum typed value is a union type with the enum's members as its members. A
                    // boolean type is a union type with 'true' and 'false' as its members.
                    // Note also that in a more complex union, e.g. boolean|number, then it's a union of three
                    // things (true|false|number) and ts.TypeFlags.Boolean doesn't show up at all.
                    if (type.flags & ts.TypeFlags.Union) {
                        return this.translateUnion(type);
                    }
                    if (type.flags & ts.TypeFlags.EnumLiteral) {
                        return this.translateEnumLiteral(type);
                    }
                    // The switch statement should have been exhaustive.
                    throw new Error("unknown type flags " + type.flags + " on " + typeToDebugString(type));
            }
        };
        TypeTranslator.prototype.translateUnion = function (type) {
            var _this = this;
            var parts = type.types.map(function (t) { return _this.translate(t); });
            // Union types that include literals (e.g. boolean, enum) can end up repeating the same Closure
            // type. For example: true | boolean will be translated to boolean | boolean.
            // Remove duplicates to produce types that read better.
            parts = parts.filter(function (el, idx) { return parts.indexOf(el) === idx; });
            return parts.length === 1 ? parts[0] : "(" + parts.join('|') + ")";
        };
        TypeTranslator.prototype.translateEnumLiteral = function (type) {
            // Suppose you had:
            //   enum EnumType { MEMBER }
            // then the type of "EnumType.MEMBER" is an enum literal (the thing passed to this function)
            // and it has type flags that include
            //   ts.TypeFlags.NumberLiteral | ts.TypeFlags.EnumLiteral
            //
            // Closure Compiler doesn't support literals in types, so this code must not emit
            // "EnumType.MEMBER", but rather "EnumType".
            var enumLiteralBaseType = this.typeChecker.getBaseTypeOfLiteralType(type);
            if (!enumLiteralBaseType.symbol) {
                this.warn("EnumLiteralType without a symbol");
                return '?';
            }
            var symbol = enumLiteralBaseType.symbol;
            if (enumLiteralBaseType === type) {
                // TypeScript's API will return the same EnumLiteral type if the enum only has a single member
                // value. See https://github.com/Microsoft/TypeScript/issues/28869.
                // In that case, take the parent symbol of the enum member, which should be the enum
                // declaration.
                // tslint:disable-next-line:no-any working around a TS API deficiency.
                var parent_2 = symbol.parent;
                if (!parent_2)
                    return '?';
                symbol = parent_2;
            }
            var name = this.symbolToString(symbol);
            if (!name)
                return '?';
            // In Closure, enum types are non-null by default, so we wouldn't need to emit the `!` here.
            // However that's confusing to users, to the point that style guides and linters require to
            // *always* specify the nullability modifier. To be consistent with that style, include it here
            // as well.
            return '!' + name;
        };
        // translateObject translates a ts.ObjectType, which is the type of all
        // object-like things in TS, such as classes and interfaces.
        TypeTranslator.prototype.translateObject = function (type) {
            var _this = this;
            if (type.symbol && this.isBlackListed(type.symbol))
                return '?';
            // NOTE: objectFlags is an enum, but a given type can have multiple flags.
            // Array<string> is both ts.ObjectFlags.Reference and ts.ObjectFlags.Interface.
            if (type.objectFlags & ts.ObjectFlags.Class) {
                if (!type.symbol) {
                    this.warn('class has no symbol');
                    return '?';
                }
                var name_2 = this.symbolToString(type.symbol);
                if (!name_2) {
                    // An anonymous type. Make sure not to emit '!?', as that is a syntax error in Closure
                    // Compiler.
                    return '?';
                }
                return '!' + name_2;
            }
            else if (type.objectFlags & ts.ObjectFlags.Interface) {
                // Note: ts.InterfaceType has a typeParameters field, but that
                // specifies the parameters that the interface type *expects*
                // when it's used, and should not be transformed to the output.
                // E.g. a type like Array<number> is a TypeReference to the
                // InterfaceType "Array", but the "number" type parameter is
                // part of the outer TypeReference, not a typeParameter on
                // the InterfaceType.
                if (!type.symbol) {
                    this.warn('interface has no symbol');
                    return '?';
                }
                if (type.symbol.flags & ts.SymbolFlags.Value) {
                    // The symbol is both a type and a value.
                    // For user-defined types in this state, we don't have a Closure name
                    // for the type.  See the type_and_value test.
                    if (!isClosureProvidedType(type.symbol)) {
                        this.warn("type/symbol conflict for " + type.symbol.name + ", using {?} for now");
                        return '?';
                    }
                }
                return '!' + this.symbolToString(type.symbol);
            }
            else if (type.objectFlags & ts.ObjectFlags.Reference) {
                // A reference to another type, e.g. Array<number> refers to Array.
                // Emit the referenced type and any type arguments.
                var referenceType = type;
                // A tuple is a ReferenceType where the target is flagged Tuple and the
                // typeArguments are the tuple arguments.  Just treat it as a mystery
                // array, because Closure doesn't understand tuples.
                if (referenceType.target.objectFlags & ts.ObjectFlags.Tuple) {
                    return '!Array<?>';
                }
                var typeStr = '';
                if (referenceType.target === referenceType) {
                    // We get into an infinite loop here if the inner reference is
                    // the same as the outer; this can occur when this function
                    // fails to translate a more specific type before getting to
                    // this point.
                    throw new Error("reference loop in " + typeToDebugString(referenceType) + " " + referenceType.flags);
                }
                typeStr += this.translate(referenceType.target);
                // Translate can return '?' for a number of situations, e.g. type/value conflicts.
                // `?<?>` is illegal syntax in Closure Compiler, so just return `?` here.
                if (typeStr === '?')
                    return '?';
                if (referenceType.typeArguments) {
                    var params = referenceType.typeArguments.map(function (t) { return _this.translate(t); });
                    typeStr += "<" + params.join(', ') + ">";
                }
                return typeStr;
            }
            else if (type.objectFlags & ts.ObjectFlags.Anonymous) {
                if (!type.symbol) {
                    // This comes up when generating code for an arrow function as passed
                    // to a generic function.  The passed-in type is tagged as anonymous
                    // and has no properties so it's hard to figure out what to generate.
                    // Just avoid it for now so we don't crash.
                    this.warn('anonymous type has no symbol');
                    return '?';
                }
                if (type.symbol.flags & ts.SymbolFlags.Function ||
                    type.symbol.flags & ts.SymbolFlags.Method) {
                    var sigs = this.typeChecker.getSignaturesOfType(type, ts.SignatureKind.Call);
                    if (sigs.length === 1) {
                        return this.signatureToClosure(sigs[0]);
                    }
                    this.warn('unhandled anonymous type with multiple call signatures');
                    return '?';
                }
                else {
                    return this.translateAnonymousType(type);
                }
            }
            /*
            TODO(ts2.1): more unhandled object type flags:
              Tuple
              Mapped
              Instantiated
              ObjectLiteral
              EvolvingArray
              ObjectLiteralPatternWithComputedProperties
            */
            this.warn("unhandled type " + typeToDebugString(type));
            return '?';
        };
        /**
         * translateAnonymousType translates a ts.TypeFlags.ObjectType that is also
         * ts.ObjectFlags.Anonymous. That is, this type's symbol does not have a name. This is the
         * anonymous type encountered in e.g.
         *     let x: {a: number};
         * But also the inferred type in:
         *     let x = {a: 1};  // type of x is {a: number}, as above
         */
        TypeTranslator.prototype.translateAnonymousType = function (type) {
            var e_7, _a;
            this.seenAnonymousTypes.add(type);
            // Gather up all the named fields and whether the object is also callable.
            var callable = false;
            var indexable = false;
            var fields = [];
            if (!type.symbol || !type.symbol.members) {
                this.warn('anonymous type has no symbol');
                return '?';
            }
            // special-case construct signatures.
            var ctors = type.getConstructSignatures();
            if (ctors.length) {
                // TODO(martinprobst): this does not support additional properties defined on constructors
                // (not expressible in Closure), nor multiple constructors (same).
                var decl = ctors[0].declaration;
                if (!decl) {
                    this.warn('unhandled anonymous type with constructor signature but no declaration');
                    return '?';
                }
                if (decl.kind === ts.SyntaxKind.JSDocSignature) {
                    this.warn('unhandled JSDoc based constructor signature');
                    return '?';
                }
                // new <T>(tee: T) is not supported by Closure, blacklist as ?.
                this.blacklistTypeParameters(this.symbolsToAliasedNames, decl.typeParameters);
                var params = this.convertParams(ctors[0], decl.parameters);
                var paramsStr = params.length ? (', ' + params.join(', ')) : '';
                var constructedType = this.translate(ctors[0].getReturnType());
                // In the specific case of the "new" in a function, it appears that
                //   function(new: !Bar)
                // fails to parse, while
                //   function(new: (!Bar))
                // parses in the way you'd expect.
                // It appears from testing that Closure ignores the ! anyway and just
                // assumes the result will be non-null in either case.  (To be pedantic,
                // it's possible to return null from a ctor it seems like a bad idea.)
                return "function(new: (" + constructedType + ")" + paramsStr + "): ?";
            }
            try {
                // members is an ES6 map, but the .d.ts defining it defined their own map
                // type, so typescript doesn't believe that .keys() is iterable
                // tslint:disable-next-line:no-any
                for (var _b = __values(type.symbol.members.keys()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var field = _c.value;
                    switch (field) {
                        case '__call':
                            callable = true;
                            break;
                        case '__index':
                            indexable = true;
                            break;
                        default:
                            if (!isValidClosurePropertyName(field)) {
                                this.warn("omitting inexpressible property name: " + field);
                                continue;
                            }
                            var member = type.symbol.members.get(field);
                            // optional members are handled by the type including |undefined in a union type.
                            var memberType = this.translate(this.typeChecker.getTypeOfSymbolAtLocation(member, this.node));
                            fields.push(field + ": " + memberType);
                            break;
                    }
                }
            }
            catch (e_7_1) { e_7 = { error: e_7_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_7) throw e_7.error; }
            }
            // Try to special-case plain key-value objects and functions.
            if (fields.length === 0) {
                if (callable && !indexable) {
                    // A function type.
                    var sigs = this.typeChecker.getSignaturesOfType(type, ts.SignatureKind.Call);
                    if (sigs.length === 1) {
                        return this.signatureToClosure(sigs[0]);
                    }
                }
                else if (indexable && !callable) {
                    // A plain key-value map type.
                    var keyType = 'string';
                    var valType = this.typeChecker.getIndexTypeOfType(type, ts.IndexKind.String);
                    if (!valType) {
                        keyType = 'number';
                        valType = this.typeChecker.getIndexTypeOfType(type, ts.IndexKind.Number);
                    }
                    if (!valType) {
                        this.warn('unknown index key type');
                        return "!Object<?,?>";
                    }
                    return "!Object<" + keyType + "," + this.translate(valType) + ">";
                }
                else if (!callable && !indexable) {
                    // The object has no members.  This is the TS type '{}',
                    // which means "any value other than null or undefined".
                    // What is this in Closure's type system?
                    //
                    // First, {!Object} is wrong because it is not a supertype of
                    // {string} or {number}.  This would mean you cannot assign a
                    // number to a variable of TS type {}.
                    //
                    // We get closer with {*}, aka the ALL type.  This one better
                    // captures the typical use of the TS {}, which users use for
                    // "I don't care".
                    //
                    // {*} unfortunately does include null/undefined, so it's a closer
                    // match for TS 3.0's 'unknown'.
                    return '*';
                }
            }
            if (!callable && !indexable) {
                // Not callable, not indexable; implies a plain object with fields in it.
                return "{" + fields.join(', ') + "}";
            }
            this.warn('unhandled anonymous type');
            return '?';
        };
        /** Converts a ts.Signature (function signature) to a Closure function type. */
        TypeTranslator.prototype.signatureToClosure = function (sig) {
            // TODO(martinprobst): Consider harmonizing some overlap with emitFunctionType in tsickle.ts.
            if (!sig.declaration) {
                this.warn('signature without declaration');
                return 'Function';
            }
            if (sig.declaration.kind === ts.SyntaxKind.JSDocSignature) {
                this.warn('signature with JSDoc declaration');
                return 'Function';
            }
            this.blacklistTypeParameters(this.symbolsToAliasedNames, sig.declaration.typeParameters);
            var typeStr = "function(";
            var paramDecls = sig.declaration.parameters || [];
            var maybeThisParam = paramDecls[0];
            // Oddly, the this type shows up in paramDecls, but not in the type's parameters.
            // Handle it here and then pass paramDecls down without its first element.
            if (maybeThisParam && maybeThisParam.name.getText() === 'this') {
                if (maybeThisParam.type) {
                    var thisType = this.typeChecker.getTypeAtLocation(maybeThisParam.type);
                    typeStr += "this: (" + this.translate(thisType) + ")";
                    if (paramDecls.length > 1)
                        typeStr += ', ';
                }
                else {
                    this.warn('this type without type');
                }
                paramDecls = paramDecls.slice(1);
            }
            var params = this.convertParams(sig, paramDecls);
            typeStr += params.join(', ') + ")";
            var retType = this.translate(this.typeChecker.getReturnTypeOfSignature(sig));
            if (retType) {
                typeStr += ": " + retType;
            }
            return typeStr;
        };
        /**
         * Converts parameters for the given signature. Takes parameter declarations as those might not
         * match the signature parameters (e.g. there might be an additional this parameter). This
         * difference is handled by the caller, as is converting the "this" parameter.
         */
        TypeTranslator.prototype.convertParams = function (sig, paramDecls) {
            var paramTypes = [];
            for (var i = 0; i < sig.parameters.length; i++) {
                var param = sig.parameters[i];
                var paramDecl = paramDecls[i];
                var optional = !!paramDecl.questionToken;
                var varArgs = !!paramDecl.dotDotDotToken;
                var paramType = this.typeChecker.getTypeOfSymbolAtLocation(param, this.node);
                if (varArgs) {
                    if ((paramType.flags & ts.TypeFlags.Object) === 0) {
                        this.warn('var args type is not an object type');
                        paramTypes.push('!Array<?>');
                        continue;
                    }
                    if ((paramType.objectFlags & ts.ObjectFlags.Reference) === 0) {
                        this.warn('unsupported var args type (not an array reference)');
                        paramTypes.push('!Array<?>');
                        continue;
                    }
                    var typeRef = paramType;
                    paramType = typeRef.typeArguments[0];
                }
                var typeStr = this.translate(paramType);
                if (varArgs)
                    typeStr = '...' + typeStr;
                if (optional)
                    typeStr = typeStr + '=';
                paramTypes.push(typeStr);
            }
            return paramTypes;
        };
        TypeTranslator.prototype.warn = function (msg) {
            // By default, warn() does nothing.  The caller will overwrite this
            // if it wants different behavior.
        };
        /** @return true if sym should always have type {?}. */
        TypeTranslator.prototype.isBlackListed = function (symbol) {
            return isBlacklisted(this.pathBlackList, symbol);
        };
        /**
         * Closure doesn not support type parameters for function types, i.e. generic function types.
         * Blacklist the symbols declared by them and emit a ? for the types.
         *
         * This mutates the given blacklist map. The map's scope is one file, and symbols are
         * unique objects, so this should neither lead to excessive memory consumption nor introduce
         * errors.
         *
         * @param blacklist a map to store the blacklisted symbols in, with a value of '?'. In practice,
         *     this is always === this.symbolsToAliasedNames, but we're passing it explicitly to make it
         *    clear that the map is mutated (in particular when used from outside the class).
         * @param decls the declarations whose symbols should be blacklisted.
         */
        TypeTranslator.prototype.blacklistTypeParameters = function (blacklist, decls) {
            var e_8, _a;
            if (!decls || !decls.length)
                return;
            try {
                for (var decls_1 = __values(decls), decls_1_1 = decls_1.next(); !decls_1_1.done; decls_1_1 = decls_1.next()) {
                    var tpd = decls_1_1.value;
                    var sym = this.typeChecker.getSymbolAtLocation(tpd.name);
                    if (!sym) {
                        this.warn("type parameter with no symbol");
                        continue;
                    }
                    blacklist.set(sym, '?');
                }
            }
            catch (e_8_1) { e_8 = { error: e_8_1 }; }
            finally {
                try {
                    if (decls_1_1 && !decls_1_1.done && (_a = decls_1.return)) _a.call(decls_1);
                }
                finally { if (e_8) throw e_8.error; }
            }
        };
        return TypeTranslator;
    }());
    exports.TypeTranslator = TypeTranslator;
    /** @return true if sym should always have type {?}. */
    function isBlacklisted(pathBlackList, symbol) {
        if (pathBlackList === undefined)
            return false;
        // Some builtin types, such as {}, get represented by a symbol that has no declarations.
        if (symbol.declarations === undefined)
            return false;
        return symbol.declarations.every(function (n) {
            var fileName = path.normalize(n.getSourceFile().fileName);
            return pathBlackList.has(fileName);
        });
    }
    exports.isBlacklisted = isBlacklisted;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZV90cmFuc2xhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3R5cGVfdHJhbnNsYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFFSCwyQkFBNkI7SUFDN0IsK0JBQWlDO0lBRWpDLDZEQUF1RTtJQUN2RSxpRUFBaUY7SUFFakY7Ozs7Ozs7Ozs7OztPQVlHO0lBQ0gsU0FBZ0IsMEJBQTBCLENBQUMsSUFBWTtRQUNyRCwwRUFBMEU7UUFDMUUsbURBQW1EO1FBQ25ELE9BQU8sMEJBQTBCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFKRCxnRUFJQztJQUVEOzs7T0FHRztJQUNILFNBQWdCLGVBQWUsQ0FBQyxRQUFnQjtRQUM5QyxPQUFPLFFBQVEsQ0FBQyxLQUFLLENBQUMsMkJBQTJCLENBQUMsSUFBSSxJQUFJLENBQUM7SUFDN0QsQ0FBQztJQUZELDBDQUVDO0lBRUQ7Ozs7O09BS0c7SUFDSCxTQUFTLHFCQUFxQixDQUFDLE1BQWlCO1FBQzlDLE9BQU8sTUFBTSxDQUFDLFlBQVksSUFBSSxJQUFJO1lBQzlCLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsZUFBZSxDQUFDLENBQUMsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBM0MsQ0FBMkMsQ0FBQyxDQUFDO0lBQ2pGLENBQUM7SUFFRCxTQUFnQixpQkFBaUIsQ0FBQyxJQUFhOztRQUM3QyxJQUFJLFdBQVcsR0FBRyxhQUFXLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBRyxDQUFDO1FBRXZELElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUNwQixXQUFXLElBQUksWUFBVSxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFHLENBQUM7U0FDbEU7UUFDRCxJQUFJLElB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OztnQkFDcEMsS0FBa0IsSUFBQSxVQUFBLFNBQUEsS0FBSyxDQUFBLDRCQUFBLCtDQUFFO29CQUFwQixJQUFNLEdBQUcsa0JBQUE7b0JBQ1osSUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxtQkFBbUIsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQzNELElBQUksQ0FBQyxHQUFHLEVBQUU7d0JBQ1IsSUFBSSxDQUFDLElBQUksQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO3dCQUMzQyxTQUFTO3FCQUNWO29CQUNELFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2lCQUN6Qjs7Ozs7Ozs7O1FBQ0gsQ0FBQztRQUNILHFCQUFDO0lBQUQsQ0FBQyxBQXBxQkQsSUFvcUJDO0lBcHFCWSx3Q0FBYztJQXNxQjNCLHVEQUF1RDtJQUN2RCxTQUFnQixhQUFhLENBQUMsYUFBb0MsRUFBRSxNQUFpQjtRQUNuRixJQUFJLGFBQWEsS0FBSyxTQUFTO1lBQUUsT0FBTyxLQUFLLENBQUM7UUFDOUMsd0ZBQXdGO1FBQ3hGLElBQUksTUFBTSxDQUFDLFlBQVksS0FBSyxTQUFTO1lBQUUsT0FBTyxLQUFLLENBQUM7UUFDcEQsT0FBTyxNQUFNLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxVQUFBLENBQUM7WUFDaEMsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsYUFBYSxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDNUQsT0FBTyxhQUFhLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3JDLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQVJELHNDQVFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cbmltcG9ydCB7QW5ub3RhdG9ySG9zdCwgbW9kdWxlTmFtZUFzSWRlbnRpZmllcn0gZnJvbSAnLi9hbm5vdGF0b3JfaG9zdCc7XG5pbXBvcnQge2dldElkZW50aWZpZXJUZXh0LCBoYXNNb2RpZmllckZsYWcsIGlzQW1iaWVudH0gZnJvbSAnLi90cmFuc2Zvcm1lcl91dGlsJztcblxuLyoqXG4gKiBUeXBlU2NyaXB0IGFsbG93cyB5b3UgdG8gd3JpdGUgaWRlbnRpZmllcnMgcXVvdGVkLCBsaWtlOlxuICogICBpbnRlcmZhY2UgRm9vIHtcbiAqICAgICAnYmFyJzogc3RyaW5nO1xuICogICAgICdjb21wbGV4IG5hbWUnOiBzdHJpbmc7XG4gKiAgIH1cbiAqICAgRm9vLmJhcjsgIC8vIG9rXG4gKiAgIEZvb1snYmFyJ10gIC8vIG9rXG4gKiAgIEZvb1snY29tcGxleCBuYW1lJ10gIC8vIG9rXG4gKlxuICogSW4gQ2xvc3VyZS1sYW5kLCB3ZSB3YW50IGlkZW50aWZ5IHRoYXQgdGhlIGxlZ2FsIG5hbWUgJ2JhcicgY2FuIGJlY29tZSBhblxuICogb3JkaW5hcnkgZmllbGQsIGJ1dCB3ZSBuZWVkIHRvIHNraXAgc3RyaW5ncyBsaWtlICdjb21wbGV4IG5hbWUnLlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNWYWxpZENsb3N1cmVQcm9wZXJ0eU5hbWUobmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gIC8vIEluIGxvY2FsIGV4cGVyaW1lbnRhdGlvbiwgaXQgYXBwZWFycyB0aGF0IHJlc2VydmVkIHdvcmRzIGxpa2UgJ3ZhcicgYW5kXG4gIC8vICdpZicgYXJlIGxlZ2FsIEpTIGFuZCBzdGlsbCBhY2NlcHRlZCBieSBDbG9zdXJlLlxuICByZXR1cm4gL15bYS16QS1aX11bYS16QS1aMC05X10qJC8udGVzdChuYW1lKTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmVzIGlmIGZpbGVOYW1lIHJlZmVycyB0byBhIGJ1aWx0aW4gbGliLmQudHMgZmlsZS5cbiAqIFRoaXMgaXMgYSB0ZXJyaWJsZSBoYWNrIGJ1dCBpdCBtaXJyb3JzIGEgc2ltaWxhciB0aGluZyBkb25lIGluIENsdXR6LlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNCdWlsdGluTGliRFRTKGZpbGVOYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIGZpbGVOYW1lLm1hdGNoKC9cXGJsaWJcXC4oPzpbXi9dK1xcLik/ZFxcLnRzJC8pICE9IG51bGw7XG59XG5cbi8qKlxuICogQHJldHVybiBUcnVlIGlmIHRoZSBuYW1lZCB0eXBlIGlzIGNvbnNpZGVyZWQgY29tcGF0aWJsZSB3aXRoIHRoZSBDbG9zdXJlLWRlZmluZWRcbiAqICAgICB0eXBlIG9mIHRoZSBzYW1lIG5hbWUsIGUuZy4gXCJBcnJheVwiLiAgTm90ZSB0aGF0IHdlIGRvbid0IGFjdHVhbGx5IGVuZm9yY2VcbiAqICAgICB0aGF0IHRoZSB0eXBlcyBhcmUgYWN0dWFsbHkgY29tcGF0aWJsZSwgYnV0IG1vc3RseSBqdXN0IGhvcGUgdGhhdCB0aGV5IGFyZSBkdWVcbiAqICAgICB0byBiZWluZyBkZXJpdmVkIGZyb20gdGhlIHNhbWUgSFRNTCBzcGVjcy5cbiAqL1xuZnVuY3Rpb24gaXNDbG9zdXJlUHJvdmlkZWRUeXBlKHN5bWJvbDogdHMuU3ltYm9sKTogYm9vbGVhbiB7XG4gIHJldHVybiBzeW1ib2wuZGVjbGFyYXRpb25zICE9IG51bGwgJiZcbiAgICAgIHN5bWJvbC5kZWNsYXJhdGlvbnMuc29tZShuID0+IGlzQnVpbHRpbkxpYkRUUyhuLmdldFNvdXJjZUZpbGUoKS5maWxlTmFtZSkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdHlwZVRvRGVidWdTdHJpbmcodHlwZTogdHMuVHlwZSk6IHN0cmluZyB7XG4gIGxldCBkZWJ1Z1N0cmluZyA9IGBmbGFnczoweCR7dHlwZS5mbGFncy50b1N0cmluZygxNil9YDtcblxuICBpZiAodHlwZS5hbGlhc1N5bWJvbCkge1xuICAgIGRlYnVnU3RyaW5nICs9IGAgYWxpYXM6JHtzeW1ib2xUb0RlYnVnU3RyaW5nKHR5cGUuYWxpYXNTeW1ib2wpfWA7XG4gIH1cbiAgaWYgKHR5cGUuYWxpYXNUeXBlQXJndW1lbnRzKSB7XG4gICAgZGVidWdTdHJpbmcgKz0gYCBhbGlhc0FyZ3M6PCR7dHlwZS5hbGlhc1R5cGVBcmd1bWVudHMubWFwKHR5cGVUb0RlYnVnU3RyaW5nKS5qb2luKCcsJyl9PmA7XG4gIH1cblxuICAvLyBKdXN0IHRoZSB1bmlxdWUgZmxhZ3MgKHBvd2VycyBvZiB0d28pLiBEZWNsYXJlZCBpbiBzcmMvY29tcGlsZXIvdHlwZXMudHMuXG4gIGNvbnN0IGJhc2ljVHlwZXM6IHRzLlR5cGVGbGFnc1tdID0gW1xuICAgIHRzLlR5cGVGbGFncy5BbnksICAgICAgICAgICB0cy5UeXBlRmxhZ3MuU3RyaW5nLCAgICAgICAgIHRzLlR5cGVGbGFncy5OdW1iZXIsXG4gICAgdHMuVHlwZUZsYWdzLkJvb2xlYW4sICAgICAgIHRzLlR5cGVGbGFncy5FbnVtLCAgICAgICAgICAgdHMuVHlwZUZsYWdzLlN0cmluZ0xpdGVyYWwsXG4gICAgdHMuVHlwZUZsYWdzLk51bWJlckxpdGVyYWwsIHRzLlR5cGVGbGFncy5Cb29sZWFuTGl0ZXJhbCwgdHMuVHlwZUZsYWdzLkVudW1MaXRlcmFsLFxuICAgIHRzLlR5cGVGbGFncy5FU1N5bWJvbCwgICAgICB0cy5UeXBlRmxhZ3MuVW5pcXVlRVNTeW1ib2wsIHRzLlR5cGVGbGFncy5Wb2lkLFxuICAgIHRzLlR5cGVGbGFncy5VbmRlZmluZWQsICAgICB0cy5UeXBlRmxhZ3MuTnVsbCwgICAgICAgICAgIHRzLlR5cGVGbGFncy5OZXZlcixcbiAgICB0cy5UeXBlRmxhZ3MuVHlwZVBhcmFtZXRlciwgdHMuVHlwZUZsYWdzLk9iamVjdCwgICAgICAgICB0cy5UeXBlRmxhZ3MuVW5pb24sXG4gICAgdHMuVHlwZUZsYWdzLkludGVyc2VjdGlvbiwgIHRzLlR5cGVGbGFncy5JbmRleCwgICAgICAgICAgdHMuVHlwZUZsYWdzLkluZGV4ZWRBY2Nlc3MsXG4gICAgdHMuVHlwZUZsYWdzLkNvbmRpdGlvbmFsLCAgIHRzLlR5cGVGbGFncy5TdWJzdGl0dXRpb24sXG4gIF07XG4gIGZvciAoY29uc3QgZmxhZyBvZiBiYXNpY1R5cGVzKSB7XG4gICAgaWYgKCh0eXBlLmZsYWdzICYgZmxhZykgIT09IDApIHtcbiAgICAgIGRlYnVnU3RyaW5nICs9IGAgJHt0cy5UeXBlRmxhZ3NbZmxhZ119YDtcbiAgICB9XG4gIH1cblxuICBpZiAodHlwZS5mbGFncyA9PT0gdHMuVHlwZUZsYWdzLk9iamVjdCkge1xuICAgIGNvbnN0IG9ialR5cGUgPSB0eXBlIGFzIHRzLk9iamVjdFR5cGU7XG4gICAgZGVidWdTdHJpbmcgKz0gYCBvYmplY3RGbGFnczoweCR7b2JqVHlwZS5vYmplY3RGbGFnc31gO1xuICAgIC8vIEp1c3QgdGhlIHVuaXF1ZSBmbGFncyAocG93ZXJzIG9mIHR3bykuIERlY2xhcmVkIGluIHNyYy9jb21waWxlci90eXBlcy50cy5cbiAgICBjb25zdCBvYmplY3RGbGFnczogdHMuT2JqZWN0RmxhZ3NbXSA9IFtcbiAgICAgIHRzLk9iamVjdEZsYWdzLkNsYXNzLFxuICAgICAgdHMuT2JqZWN0RmxhZ3MuSW50ZXJmYWNlLFxuICAgICAgdHMuT2JqZWN0RmxhZ3MuUmVmZXJlbmNlLFxuICAgICAgdHMuT2JqZWN0RmxhZ3MuVHVwbGUsXG4gICAgICB0cy5PYmplY3RGbGFncy5Bbm9ueW1vdXMsXG4gICAgICB0cy5PYmplY3RGbGFncy5NYXBwZWQsXG4gICAgICB0cy5PYmplY3RGbGFncy5JbnN0YW50aWF0ZWQsXG4gICAgICB0cy5PYmplY3RGbGFncy5PYmplY3RMaXRlcmFsLFxuICAgICAgdHMuT2JqZWN0RmxhZ3MuRXZvbHZpbmdBcnJheSxcbiAgICAgIHRzLk9iamVjdEZsYWdzLk9iamVjdExpdGVyYWxQYXR0ZXJuV2l0aENvbXB1dGVkUHJvcGVydGllcyxcbiAgICBdO1xuICAgIGZvciAoY29uc3QgZmxhZyBvZiBvYmplY3RGbGFncykge1xuICAgICAgaWYgKChvYmpUeXBlLm9iamVjdEZsYWdzICYgZmxhZykgIT09IDApIHtcbiAgICAgICAgZGVidWdTdHJpbmcgKz0gYCBvYmplY3Q6JHt0cy5PYmplY3RGbGFnc1tmbGFnXX1gO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmICh0eXBlLnN5bWJvbCAmJiB0eXBlLnN5bWJvbC5uYW1lICE9PSAnX190eXBlJykge1xuICAgIGRlYnVnU3RyaW5nICs9IGAgc3ltYm9sLm5hbWU6JHtKU09OLnN0cmluZ2lmeSh0eXBlLnN5bWJvbC5uYW1lKX1gO1xuICB9XG5cbiAgaWYgKHR5cGUucGF0dGVybikge1xuICAgIGRlYnVnU3RyaW5nICs9IGAgZGVzdHJ1Y3R1cmluZzp0cnVlYDtcbiAgfVxuXG4gIHJldHVybiBge3R5cGUgJHtkZWJ1Z1N0cmluZ319YDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN5bWJvbFRvRGVidWdTdHJpbmcoc3ltOiB0cy5TeW1ib2wpOiBzdHJpbmcge1xuICBsZXQgZGVidWdTdHJpbmcgPSBgJHtKU09OLnN0cmluZ2lmeShzeW0ubmFtZSl9IGZsYWdzOjB4JHtzeW0uZmxhZ3MudG9TdHJpbmcoMTYpfWA7XG5cbiAgLy8gSnVzdCB0aGUgdW5pcXVlIGZsYWdzIChwb3dlcnMgb2YgdHdvKS4gRGVjbGFyZWQgaW4gc3JjL2NvbXBpbGVyL3R5cGVzLnRzLlxuICBjb25zdCBzeW1ib2xGbGFncyA9IFtcbiAgICB0cy5TeW1ib2xGbGFncy5GdW5jdGlvblNjb3BlZFZhcmlhYmxlLFxuICAgIHRzLlN5bWJvbEZsYWdzLkJsb2NrU2NvcGVkVmFyaWFibGUsXG4gICAgdHMuU3ltYm9sRmxhZ3MuUHJvcGVydHksXG4gICAgdHMuU3ltYm9sRmxhZ3MuRW51bU1lbWJlcixcbiAgICB0cy5TeW1ib2xGbGFncy5GdW5jdGlvbixcbiAgICB0cy5TeW1ib2xGbGFncy5DbGFzcyxcbiAgICB0cy5TeW1ib2xGbGFncy5JbnRlcmZhY2UsXG4gICAgdHMuU3ltYm9sRmxhZ3MuQ29uc3RFbnVtLFxuICAgIHRzLlN5bWJvbEZsYWdzLlJlZ3VsYXJFbnVtLFxuICAgIHRzLlN5bWJvbEZsYWdzLlZhbHVlTW9kdWxlLFxuICAgIHRzLlN5bWJvbEZsYWdzLk5hbWVzcGFjZU1vZHVsZSxcbiAgICB0cy5TeW1ib2xGbGFncy5UeXBlTGl0ZXJhbCxcbiAgICB0cy5TeW1ib2xGbGFncy5PYmplY3RMaXRlcmFsLFxuICAgIHRzLlN5bWJvbEZsYWdzLk1ldGhvZCxcbiAgICB0cy5TeW1ib2xGbGFncy5Db25zdHJ1Y3RvcixcbiAgICB0cy5TeW1ib2xGbGFncy5HZXRBY2Nlc3NvcixcbiAgICB0cy5TeW1ib2xGbGFncy5TZXRBY2Nlc3NvcixcbiAgICB0cy5TeW1ib2xGbGFncy5TaWduYXR1cmUsXG4gICAgdHMuU3ltYm9sRmxhZ3MuVHlwZVBhcmFtZXRlcixcbiAgICB0cy5TeW1ib2xGbGFncy5UeXBlQWxpYXMsXG4gICAgdHMuU3ltYm9sRmxhZ3MuRXhwb3J0VmFsdWUsXG4gICAgdHMuU3ltYm9sRmxhZ3MuQWxpYXMsXG4gICAgdHMuU3ltYm9sRmxhZ3MuUHJvdG90eXBlLFxuICAgIHRzLlN5bWJvbEZsYWdzLkV4cG9ydFN0YXIsXG4gICAgdHMuU3ltYm9sRmxhZ3MuT3B0aW9uYWwsXG4gICAgdHMuU3ltYm9sRmxhZ3MuVHJhbnNpZW50LFxuICBdO1xuICBmb3IgKGNvbnN0IGZsYWcgb2Ygc3ltYm9sRmxhZ3MpIHtcbiAgICBpZiAoKHN5bS5mbGFncyAmIGZsYWcpICE9PSAwKSB7XG4gICAgICBkZWJ1Z1N0cmluZyArPSBgICR7dHMuU3ltYm9sRmxhZ3NbZmxhZ119YDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZGVidWdTdHJpbmc7XG59XG5cbi8qKiBBIG1vZHVsZSBkZWNsYXJlZCBhcyBcImRlY2xhcmUgbW9kdWxlICdleHRlcm5hbF9uYW1lJyB7Li4ufVwiIChub3RlIHRoZSBxdW90ZXMpLiAqL1xudHlwZSBBbWJpZW50TW9kdWxlRGVjbGFyYXRpb24gPSB0cy5Nb2R1bGVEZWNsYXJhdGlvbiZ7bmFtZTogdHMuU3RyaW5nTGl0ZXJhbH07XG5cbi8qKlxuICogU2VhcmNoZXMgZm9yIGFuIGFtYmllbnQgbW9kdWxlIGRlY2xhcmF0aW9uIGluIHRoZSBhbmNlc3RvcnMgb2YgZGVjbGFyYXRpb25zLCBkZXB0aCBmaXJzdCwgYW5kXG4gKiByZXR1cm5zIHRoZSBmaXJzdCBvciBudWxsIGlmIG5vbmUgZm91bmQuXG4gKi9cbmZ1bmN0aW9uIGdldENvbnRhaW5pbmdBbWJpZW50TW9kdWxlRGVjbGFyYXRpb24oZGVjbGFyYXRpb25zOiB0cy5EZWNsYXJhdGlvbltdKTpcbiAgICBBbWJpZW50TW9kdWxlRGVjbGFyYXRpb258bnVsbCB7XG4gIGZvciAoY29uc3QgZGVjbGFyYXRpb24gb2YgZGVjbGFyYXRpb25zKSB7XG4gICAgbGV0IHBhcmVudCA9IGRlY2xhcmF0aW9uLnBhcmVudDtcbiAgICB3aGlsZSAocGFyZW50KSB7XG4gICAgICBpZiAodHMuaXNNb2R1bGVEZWNsYXJhdGlvbihwYXJlbnQpICYmIHRzLmlzU3RyaW5nTGl0ZXJhbChwYXJlbnQubmFtZSkpIHtcbiAgICAgICAgcmV0dXJuIHBhcmVudCBhcyBBbWJpZW50TW9kdWxlRGVjbGFyYXRpb247XG4gICAgICB9XG4gICAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50O1xuICAgIH1cbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuLyoqIFJldHVybnMgdHJ1ZSBpZiBhbnkgb2YgZGVjbGFyYXRpb25zIGlzIGEgdG9wIGxldmVsIGRlY2xhcmF0aW9uIGluIGFuIGV4dGVybmFsIG1vZHVsZS4gKi9cbmZ1bmN0aW9uIGlzVG9wTGV2ZWxFeHRlcm5hbChkZWNsYXJhdGlvbnM6IHRzLkRlY2xhcmF0aW9uW10pIHtcbiAgZm9yIChjb25zdCBkZWNsYXJhdGlvbiBvZiBkZWNsYXJhdGlvbnMpIHtcbiAgICBpZiAoZGVjbGFyYXRpb24ucGFyZW50ID09PSB1bmRlZmluZWQpIGNvbnRpbnVlO1xuICAgIGlmICh0cy5pc1NvdXJjZUZpbGUoZGVjbGFyYXRpb24ucGFyZW50KSAmJiB0cy5pc0V4dGVybmFsTW9kdWxlKGRlY2xhcmF0aW9uLnBhcmVudCkpIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgYSBhbmQgYiBhcmUgKG9yIHdlcmUgb3JpZ2luYWxseSBiZWZvcmUgdHJhbnNmb3JtYXRpb24pIG5vZGVzIG9mIHRoZSBzYW1lIHNvdXJjZVxuICogZmlsZS5cbiAqL1xuZnVuY3Rpb24gaXNEZWNsYXJlZEluU2FtZUZpbGUoYTogdHMuTm9kZSwgYjogdHMuTm9kZSkge1xuICByZXR1cm4gdHMuZ2V0T3JpZ2luYWxOb2RlKGEpLmdldFNvdXJjZUZpbGUoKSA9PT0gdHMuZ2V0T3JpZ2luYWxOb2RlKGIpLmdldFNvdXJjZUZpbGUoKTtcbn1cblxuLyoqIFR5cGVUcmFuc2xhdG9yIHRyYW5zbGF0ZXMgVHlwZVNjcmlwdCB0eXBlcyB0byBDbG9zdXJlIHR5cGVzLiAqL1xuZXhwb3J0IGNsYXNzIFR5cGVUcmFuc2xhdG9yIHtcbiAgLyoqXG4gICAqIEEgbGlzdCBvZiB0eXBlIGxpdGVyYWxzIHdlJ3ZlIGVuY291bnRlcmVkIHdoaWxlIGVtaXR0aW5nOyB1c2VkIHRvIGF2b2lkIGdldHRpbmcgc3R1Y2sgaW5cbiAgICogcmVjdXJzaXZlIHR5cGVzLlxuICAgKi9cbiAgcHJpdmF0ZSByZWFkb25seSBzZWVuQW5vbnltb3VzVHlwZXMgPSBuZXcgU2V0PHRzLlR5cGU+KCk7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gd3JpdGUgdHlwZXMgc3VpdGFibGUgZm9yIGFuIFxcQGV4dGVybnMgZmlsZS4gRXh0ZXJucyB0eXBlcyBtdXN0IG5vdCByZWZlciB0b1xuICAgKiBub24tZXh0ZXJucyB0eXBlcyAoaS5lLiBub24gYW1iaWVudCB0eXBlcykgYW5kIG5lZWQgdG8gdXNlIGZ1bGx5IHF1YWxpZmllZCBuYW1lcy5cbiAgICovXG4gIGlzRm9yRXh0ZXJucyA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBAcGFyYW0gbm9kZSBpcyB0aGUgc291cmNlIEFTVCB0cy5Ob2RlIHRoZSB0eXBlIGNvbWVzIGZyb20uICBUaGlzIGlzIHVzZWRcbiAgICogICAgIGluIHNvbWUgY2FzZXMgKGUuZy4gYW5vbnltb3VzIHR5cGVzKSBmb3IgbG9va2luZyB1cCBmaWVsZCBuYW1lcy5cbiAgICogQHBhcmFtIHBhdGhCbGFja0xpc3QgaXMgYSBzZXQgb2YgcGF0aHMgdGhhdCBzaG91bGQgbmV2ZXIgZ2V0IHR5cGVkO1xuICAgKiAgICAgYW55IHJlZmVyZW5jZSB0byBzeW1ib2xzIGRlZmluZWQgaW4gdGhlc2UgcGF0aHMgc2hvdWxkIGJ5IHR5cGVkXG4gICAqICAgICBhcyB7P30uXG4gICAqIEBwYXJhbSBzeW1ib2xzVG9BbGlhc2VkTmFtZXMgYSBtYXBwaW5nIGZyb20gc3ltYm9scyAoYEZvb2ApIHRvIGEgbmFtZSBpbiBzY29wZSB0aGV5IHNob3VsZCBiZVxuICAgKiAgICAgZW1pdHRlZCBhcyAoZS5nLiBgdHNpY2tsZV9mb3J3YXJkX2RlY2xhcmVfMS5Gb29gKS4gQ2FuIGJlIGF1Z21lbnRlZCBkdXJpbmcgdHlwZVxuICAgKiAgICAgdHJhbnNsYXRpb24sIGUuZy4gdG8gYmxhY2tsaXN0IGEgc3ltYm9sLlxuICAgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIHJlYWRvbmx5IGhvc3Q6IEFubm90YXRvckhvc3QsIHByaXZhdGUgcmVhZG9ubHkgdHlwZUNoZWNrZXI6IHRzLlR5cGVDaGVja2VyLFxuICAgICAgcHJpdmF0ZSByZWFkb25seSBub2RlOiB0cy5Ob2RlLCBwcml2YXRlIHJlYWRvbmx5IHBhdGhCbGFja0xpc3Q/OiBTZXQ8c3RyaW5nPixcbiAgICAgIHByaXZhdGUgcmVhZG9ubHkgc3ltYm9sc1RvQWxpYXNlZE5hbWVzID0gbmV3IE1hcDx0cy5TeW1ib2wsIHN0cmluZz4oKSxcbiAgICAgIHByaXZhdGUgcmVhZG9ubHkgZW5zdXJlU3ltYm9sRGVjbGFyZWQ6IChzeW06IHRzLlN5bWJvbCkgPT4gdm9pZCA9ICgpID0+IHt9KSB7XG4gICAgLy8gTm9ybWFsaXplIHBhdGhzIHRvIG5vdCBicmVhayBjaGVja3Mgb24gV2luZG93cy5cbiAgICBpZiAodGhpcy5wYXRoQmxhY2tMaXN0ICE9IG51bGwpIHtcbiAgICAgIHRoaXMucGF0aEJsYWNrTGlzdCA9XG4gICAgICAgICAgbmV3IFNldDxzdHJpbmc+KEFycmF5LmZyb20odGhpcy5wYXRoQmxhY2tMaXN0LnZhbHVlcygpKS5tYXAocCA9PiBwYXRoLm5vcm1hbGl6ZShwKSkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0cyBhIHRzLlN5bWJvbCB0byBhIHN0cmluZywgYXBwbHlpbmcgYWxpYXNlcyBhbmQgZW5zdXJpbmcgc3ltYm9scyBhcmUgaW1wb3J0ZWQuXG4gICAqIEByZXR1cm4gYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIHN5bWJvbCBhcyBhIHZhbGlkIENsb3N1cmUgdHlwZSBuYW1lLCBvciBgdW5kZWZpbmVkYCBpZlxuICAgKiAgICAgdGhlIHR5cGUgY2Fubm90IGJlIGV4cHJlc3NlZCAoZS5nLiBmb3IgYW5vbnltb3VzIHR5cGVzKS5cbiAgICovXG4gIHN5bWJvbFRvU3RyaW5nKHN5bTogdHMuU3ltYm9sKTogc3RyaW5nfHVuZGVmaW5lZCB7XG4gICAgLy8gVHlwZVNjcmlwdCByZXNvbHZlcyBlLmcuIHVuaW9uIHR5cGVzIHRvIHRoZWlyIG1lbWJlcnMsIHdoaWNoIGNhbiBpbmNsdWRlIHN5bWJvbHMgbm90IGRlY2xhcmVkXG4gICAgLy8gaW4gdGhlIGN1cnJlbnQgc2NvcGUuIEVuc3VyZSB0aGF0IGFsbCBzeW1ib2xzIGZvdW5kIHRoaXMgd2F5IGFyZSBhY3R1YWxseSBkZWNsYXJlZC5cbiAgICAvLyBUaGlzIG11c3QgaGFwcGVuIGJlZm9yZSB0aGUgYWxpYXMgY2hlY2sgYmVsb3csIGl0IG1pZ2h0IGludHJvZHVjZSBhIG5ldyBhbGlhcyBmb3IgdGhlIHN5bWJvbC5cbiAgICBpZiAoIXRoaXMuaXNGb3JFeHRlcm5zICYmIChzeW0uZmxhZ3MgJiB0cy5TeW1ib2xGbGFncy5UeXBlUGFyYW1ldGVyKSA9PT0gMCkge1xuICAgICAgdGhpcy5lbnN1cmVTeW1ib2xEZWNsYXJlZChzeW0pO1xuICAgIH1cblxuICAgIGNvbnN0IG5hbWUgPSB0aGlzLnR5cGVDaGVja2VyLnN5bWJvbFRvRW50aXR5TmFtZShcbiAgICAgICAgc3ltLCB0cy5TeW1ib2xGbGFncy5UeXBlLCB0aGlzLm5vZGUsIHRzLk5vZGVCdWlsZGVyRmxhZ3MuVXNlRnVsbHlRdWFsaWZpZWRUeXBlKTtcbiAgICAvLyBuYW1lIG1pZ2h0IGJlIHVuZGVmaW5lZCwgZS5nLiBmb3IgYW5vbnltb3VzIGNsYXNzZXMuXG4gICAgaWYgKCFuYW1lKSByZXR1cm4gdW5kZWZpbmVkO1xuXG4gICAgLy8gVHlwZVNjcmlwdCdzIHN5bWJvbFRvRW50aXR5TmFtZSByZXR1cm5zIGEgdHJlZSBvZiBJZGVudGlmaWVyIG9iamVjdHMuIHRzaWNrbGUgbmVlZHMgdG9cbiAgICAvLyBpZGVudGlmeSBhbmQgYWxpYXMgc3BlY2lmaXkgc3ltYm9scyBvbiBpdC4gVGhlIGNvZGUgYmVsb3cgYWNjZXNzZXMgdGhlIFR5cGVTY3JpcHQgQGludGVybmFsXG4gICAgLy8gc3ltYm9sIGZpZWxkIG9uIElkZW50aWZpZXIgdG8gZG8gc28uXG4gICAgdHlwZSBJZGVudGlmaWVyV2l0aFN5bWJvbCA9IHRzLklkZW50aWZpZXIme3N5bWJvbDogdHMuU3ltYm9sfTtcbiAgICBsZXQgc3RyID0gJyc7XG4gICAgLyoqIFJlY3Vyc2l2ZWx5IHZpc2l0cyBjb21wb25lbnRzIG9mIGVudGl0eSBuYW1lIGFuZCB3cml0ZXMgdGhlbSB0byBgc3RyYCBhYm92ZS4gKi9cbiAgICBjb25zdCB3cml0ZUVudGl0eVdpdGhTeW1ib2xzID0gKG5hbWU6IHRzLkVudGl0eU5hbWUpID0+IHtcbiAgICAgIGxldCBpZGVudGlmaWVyOiBJZGVudGlmaWVyV2l0aFN5bWJvbDtcbiAgICAgIGlmICh0cy5pc1F1YWxpZmllZE5hbWUobmFtZSkpIHtcbiAgICAgICAgd3JpdGVFbnRpdHlXaXRoU3ltYm9scyhuYW1lLmxlZnQpO1xuICAgICAgICBzdHIgKz0gJy4nO1xuICAgICAgICBpZGVudGlmaWVyID0gbmFtZS5yaWdodCBhcyBJZGVudGlmaWVyV2l0aFN5bWJvbDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlkZW50aWZpZXIgPSBuYW1lIGFzIElkZW50aWZpZXJXaXRoU3ltYm9sO1xuICAgICAgfVxuICAgICAgbGV0IHN5bWJvbCA9IGlkZW50aWZpZXIuc3ltYm9sO1xuICAgICAgLy8gV2hlbiB3cml0aW5nIGEgc3ltYm9sLCBjaGVjayBpZiB0aGVyZSBpcyBhbiBhbGlhcyBmb3IgaXQgaW4gdGhlIGN1cnJlbnQgc2NvcGUgdGhhdCBzaG91bGRcbiAgICAgIC8vIHRha2UgcHJlY2VkZW5jZSwgZS5nLiBmcm9tIGEgZ29vZy5yZXF1aXJlVHlwZS5cbiAgICAgIGlmIChzeW1ib2wuZmxhZ3MgJiB0cy5TeW1ib2xGbGFncy5BbGlhcykge1xuICAgICAgICBzeW1ib2wgPSB0aGlzLnR5cGVDaGVja2VyLmdldEFsaWFzZWRTeW1ib2woc3ltYm9sKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGFsaWFzID0gdGhpcy5zeW1ib2xzVG9BbGlhc2VkTmFtZXMuZ2V0KHN5bWJvbCk7XG4gICAgICBpZiAoYWxpYXMpIHtcbiAgICAgICAgLy8gSWYgc28sIGRpc2NhcmQgdGhlIGVudGlyZSBjdXJyZW50IHRleHQgYW5kIG9ubHkgdXNlIHRoZSBhbGlhcyAtIG90aGVyd2lzZSBpZiBhIHN5bWJvbCBoYXNcbiAgICAgICAgLy8gYSBsb2NhbCBhbGlhcyBidXQgYXBwZWFycyBpbiBhIGRvdHRlZCB0eXBlIHBhdGggKGUuZy4gd2hlbiBpdCdzIGltcG9ydGVkIHVzaW5nIGltcG9ydCAqXG4gICAgICAgIC8vIGFzIGZvbyksIHN0ciB3b3VsZCBjb250YWluIGJvdGggdGhlIHByZWZ4ICphbmQqIHRoZSBmdWxsIGFsaWFzIChmb28uYWxpYXMubmFtZSkuXG4gICAgICAgIHN0ciA9IGFsaWFzO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGxldCB0ZXh0ID0gZ2V0SWRlbnRpZmllclRleHQoaWRlbnRpZmllcik7XG4gICAgICBpZiAoc3RyLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBjb25zdCBtYW5nbGVkUHJlZml4ID0gdGhpcy5tYXliZUdldE1hbmdsZWROYW1lUHJlZml4KHN5bWJvbCk7XG4gICAgICAgIHRleHQgPSBtYW5nbGVkUHJlZml4ICsgdGV4dDtcbiAgICAgIH1cbiAgICAgIHN0ciArPSB0ZXh0O1xuICAgIH07XG4gICAgd3JpdGVFbnRpdHlXaXRoU3ltYm9scyhuYW1lKTtcbiAgICByZXR1cm4gdGhpcy5zdHJpcENsdXR6TmFtZXNwYWNlKHN0cik7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbWFuZ2xlZCBuYW1lIHByZWZpeCBmb3Igc3ltYm9sLCBvciBhbiBlbXB0eSBzdHJpbmcgaWYgbm90IGFwcGxpY2FibGUuXG4gICAqXG4gICAqIFR5cGUgbmFtZXMgYXJlIGVtaXR0ZWQgd2l0aCBhIG1hbmdsZWQgcHJlZml4IGlmIHRoZXkgYXJlIHRvcCBsZXZlbCBzeW1ib2xzIGRlY2xhcmVkIGluIGFuXG4gICAqIGV4dGVybmFsIG1vZHVsZSAoLmQudHMgb3IgLnRzKSwgYW5kIGFyZSBhbWJpZW50IGRlY2xhcmF0aW9ucyAoXCJkZWNsYXJlIC4uLlwiKS4gVGhpcyBpcyBiZWNhdXNlXG4gICAqIHRoZWlyIGRlY2xhcmF0aW9ucyBnZXQgbW92ZWQgdG8gZXh0ZXJucyBmaWxlcyAodG8gbWFrZSBleHRlcm5hbCBuYW1lcyB2aXNpYmxlIHRvIENsb3N1cmUgYW5kXG4gICAqIHByZXZlbnQgcmVuYW1pbmcpLCB3aGljaCBvbmx5IHVzZSBnbG9iYWwgbmFtZXMuIFRoaXMgbWVhbnMgdGhlIG5hbWVzIG11c3QgYmUgbWFuZ2xlZCB0byBwcmV2ZW50XG4gICAqIGNvbGxpc2lvbnMgYW5kIGFsbG93IHJlZmVyZW5jaW5nIHRoZW0gdW5pcXVlbHkuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIGFsc28gaGFuZGxlcyB0aGUgc3BlY2lhbCBjYXNlIG9mIHN5bWJvbHMgZGVjbGFyZWQgaW4gYW4gYW1iaWVudCBleHRlcm5hbCBtb2R1bGVcbiAgICogY29udGV4dC5cbiAgICpcbiAgICogU3ltYm9scyBkZWNsYXJlZCBpbiBhIGdsb2JhbCBibG9jaywgZS5nLiBcImRlY2xhcmUgZ2xvYmFsIHsgdHlwZSBYOyB9XCIsIGFyZSBoYW5kbGVkIGltcGxpY2l0bHk6XG4gICAqIHdoZW4gcmVmZXJlbmNlZCwgdGhleSBhcmUgd3JpdHRlbiBhcyBqdXN0IFwiWFwiLCB3aGljaCBpcyBub3QgYSB0b3AgbGV2ZWwgZGVjbGFyYXRpb24sIHNvIHRoZVxuICAgKiBjb2RlIGJlbG93IGlnbm9yZXMgdGhlbS5cbiAgICovXG4gIG1heWJlR2V0TWFuZ2xlZE5hbWVQcmVmaXgoc3ltYm9sOiB0cy5TeW1ib2wpOiBzdHJpbmd8Jycge1xuICAgIGlmICghc3ltYm9sLmRlY2xhcmF0aW9ucykgcmV0dXJuICcnO1xuICAgIGNvbnN0IGRlY2xhcmF0aW9ucyA9IHN5bWJvbC5kZWNsYXJhdGlvbnM7XG4gICAgbGV0IGFtYmllbnRNb2R1bGVEZWNsYXJhdGlvbjogQW1iaWVudE1vZHVsZURlY2xhcmF0aW9ufG51bGwgPSBudWxsO1xuICAgIC8vIElmIHRoZSBzeW1ib2wgaXMgbmVpdGhlciBhIHRvcCBsZXZlbCBkZWNsYXJhdGlvbiBpbiBhbiBleHRlcm5hbCBtb2R1bGUgbm9yIGluIGFuIGFtYmllbnRcbiAgICAvLyBibG9jaywgdHNpY2tsZSBzaG91bGQgbm90IGVtaXQgYSBwcmVmaXg6IGl0J3MgZWl0aGVyIG5vdCBhbiBleHRlcm5hbCBzeW1ib2wsIG9yIGl0J3MgYW5cbiAgICAvLyBleHRlcm5hbCBzeW1ib2wgbmVzdGVkIGluIGEgbW9kdWxlLCBzbyBpdCB3aWxsIG5lZWQgdG8gYmUgcXVhbGlmaWVkLCBhbmQgdGhlIG1hbmdsaW5nIHByZWZpeFxuICAgIC8vIGdvZXMgb24gdGhlIHF1YWxpZmllci5cbiAgICBpZiAoIWlzVG9wTGV2ZWxFeHRlcm5hbChkZWNsYXJhdGlvbnMpKSB7XG4gICAgICBhbWJpZW50TW9kdWxlRGVjbGFyYXRpb24gPSBnZXRDb250YWluaW5nQW1iaWVudE1vZHVsZURlY2xhcmF0aW9uKGRlY2xhcmF0aW9ucyk7XG4gICAgICBpZiAoIWFtYmllbnRNb2R1bGVEZWNsYXJhdGlvbikgcmV0dXJuICcnO1xuICAgIH1cbiAgICAvLyBBdCB0aGlzIHBvaW50LCB0aGUgZGVjbGFyYXRpb24gaXMgZnJvbSBhbiBleHRlcm5hbCBtb2R1bGUgKHBvc3NpYmx5IGFtYmllbnQpLlxuICAgIC8vIFRoZXNlIGRlY2xhcmF0aW9ucyBtdXN0IGJlIHByZWZpeGVkIGlmIGVpdGhlcjpcbiAgICAvLyAoYSkgdHNpY2tsZSBpcyBlbWl0dGluZyBhbiBleHRlcm5zIGZpbGUsIHNvIGFsbCBzeW1ib2xzIGFyZSBxdWFsaWZpZWQgd2l0aGluIGl0XG4gICAgLy8gKGIpIG9yIHRoZSBkZWNsYXJhdGlvbiBtdXN0IGJlIGFuIGV4cG9ydGVkIGFtYmllbnQgZGVjbGFyYXRpb24gZnJvbSB0aGUgbG9jYWwgZmlsZS5cbiAgICAvLyBBbWJpZW50IGV4dGVybmFsIGRlY2xhcmF0aW9ucyBmcm9tIG90aGVyIGZpbGVzIGFyZSBpbXBvcnRlZCwgc28gdGhlcmUncyBhIGxvY2FsIGFsaWFzIGZvciB0aGVcbiAgICAvLyBtb2R1bGUgYW5kIG5vIG1hbmdsaW5nIGlzIG5lZWRlZC5cbiAgICBpZiAoIXRoaXMuaXNGb3JFeHRlcm5zICYmXG4gICAgICAgICFkZWNsYXJhdGlvbnMuZXZlcnkoXG4gICAgICAgICAgICBkID0+IGlzRGVjbGFyZWRJblNhbWVGaWxlKHRoaXMubm9kZSwgZCkgJiYgaXNBbWJpZW50KGQpICYmXG4gICAgICAgICAgICAgICAgaGFzTW9kaWZpZXJGbGFnKGQsIHRzLk1vZGlmaWVyRmxhZ3MuRXhwb3J0KSkpIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgLy8gSWYgZnJvbSBhbiBhbWJpZW50IGRlY2xhcmF0aW9uLCB1c2UgYW5kIHJlc29sdmUgdGhlIG5hbWUgZnJvbSB0aGF0LiBPdGhlcndpc2UsIHVzZSB0aGUgZmlsZVxuICAgIC8vIG5hbWUgZnJvbSB0aGUgKGFyYml0cmFyeSkgZmlyc3QgZGVjbGFyYXRpb24gdG8gbWFuZ2xlLlxuICAgIGNvbnN0IGZpbGVOYW1lID0gYW1iaWVudE1vZHVsZURlY2xhcmF0aW9uID9cbiAgICAgICAgYW1iaWVudE1vZHVsZURlY2xhcmF0aW9uLm5hbWUudGV4dCA6XG4gICAgICAgIHRzLmdldE9yaWdpbmFsTm9kZShkZWNsYXJhdGlvbnNbMF0pLmdldFNvdXJjZUZpbGUoKS5maWxlTmFtZTtcbiAgICBjb25zdCBtYW5nbGVkID0gbW9kdWxlTmFtZUFzSWRlbnRpZmllcih0aGlzLmhvc3QsIGZpbGVOYW1lKTtcbiAgICByZXR1cm4gbWFuZ2xlZCArICcuJztcbiAgfVxuXG4gIC8vIENsdXR6IChodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jbHV0eikgZW1pdHMgZ2xvYmFsIHR5cGUgc3ltYm9scyBoaWRkZW4gaW4gYSBzcGVjaWFsXG4gIC8vIOCyoF/gsqAuY2x1dHogbmFtZXNwYWNlLiBXaGlsZSBtb3N0IGNvZGUgc2VlbiBieSBUc2lja2xlIHdpbGwgb25seSBldmVyIHNlZSBsb2NhbCBhbGlhc2VzLCBDbHV0elxuICAvLyBzeW1ib2xzIGNhbiBiZSB3cml0dGVuIGJ5IHVzZXJzIGRpcmVjdGx5IGluIGNvZGUsIGFuZCB0aGV5IGNhbiBhcHBlYXIgYnkgZGVyZWZlcmVuY2luZ1xuICAvLyBUeXBlQWxpYXNlcy4gVGhlIGNvZGUgYmVsb3cgc2ltcGx5IHN0cmlwcyB0aGUgcHJlZml4LCB0aGUgcmVtYWluaW5nIHR5cGUgbmFtZSB0aGVuIG1hdGNoZXNcbiAgLy8gQ2xvc3VyZSdzIHR5cGUuXG4gIHByaXZhdGUgc3RyaXBDbHV0ek5hbWVzcGFjZShuYW1lOiBzdHJpbmcpIHtcbiAgICBpZiAobmFtZS5zdGFydHNXaXRoKCfgsqBf4LKgLmNsdXR6LicpKSByZXR1cm4gbmFtZS5zdWJzdHJpbmcoJ+CyoF/gsqAuY2x1dHouJy5sZW5ndGgpO1xuICAgIHJldHVybiBuYW1lO1xuICB9XG5cbiAgdHJhbnNsYXRlKHR5cGU6IHRzLlR5cGUpOiBzdHJpbmcge1xuICAgIC8vIE5PVEU6IFRob3VnaCB0eXBlLmZsYWdzIGhhcyB0aGUgbmFtZSBcImZsYWdzXCIsIGl0IHVzdWFsbHkgY2FuIG9ubHkgYmUgb25lXG4gICAgLy8gb2YgdGhlIGVudW0gb3B0aW9ucyBhdCBhIHRpbWUgKGV4Y2VwdCBmb3IgdW5pb25zIG9mIGxpdGVyYWwgdHlwZXMsIGUuZy4gdW5pb25zIG9mIGJvb2xlYW5cbiAgICAvLyB2YWx1ZXMsIHN0cmluZyB2YWx1ZXMsIGVudW0gdmFsdWVzKS4gVGhpcyBzd2l0Y2ggaGFuZGxlcyBhbGwgdGhlIGNhc2VzIGluIHRoZSB0cy5UeXBlRmxhZ3NcbiAgICAvLyBlbnVtIGluIHRoZSBvcmRlciB0aGV5IG9jY3VyLlxuXG4gICAgLy8gTk9URTogU29tZSBUeXBlRmxhZ3MgYXJlIG1hcmtlZCBcImludGVybmFsXCIgaW4gdGhlIGQudHMgYnV0IHN0aWxsIHNob3cgdXAgaW4gdGhlIHZhbHVlIG9mXG4gICAgLy8gdHlwZS5mbGFncy4gVGhpcyBtYXNrIGxpbWl0cyB0aGUgZmxhZyBjaGVja3MgdG8gdGhlIG9uZXMgaW4gdGhlIHB1YmxpYyBBUEkuIFwibGFzdEZsYWdcIiBoZXJlXG4gICAgLy8gaXMgdGhlIGxhc3QgZmxhZyBoYW5kbGVkIGluIHRoaXMgc3dpdGNoIHN0YXRlbWVudCwgYW5kIHNob3VsZCBiZSBrZXB0IGluIHN5bmMgd2l0aFxuICAgIC8vIHR5cGVzY3JpcHQuZC50cy5cblxuICAgIC8vIE5vblByaW1pdGl2ZSBvY2N1cnMgb24gaXRzIG93biBvbiB0aGUgbG93ZXIgY2FzZSBcIm9iamVjdFwiIHR5cGUuIFNwZWNpYWwgY2FzZSB0byBcIiFPYmplY3RcIi5cbiAgICBpZiAodHlwZS5mbGFncyA9PT0gdHMuVHlwZUZsYWdzLk5vblByaW1pdGl2ZSkgcmV0dXJuICchT2JqZWN0JztcblxuICAgIC8vIEF2b2lkIGluZmluaXRlIGxvb3BzIG9uIHJlY3Vyc2l2ZSB0eXBlIGxpdGVyYWxzLlxuICAgIC8vIEl0IHdvdWxkIGJlIG5pY2UgdG8ganVzdCBlbWl0IHRoZSBuYW1lIG9mIHRoZSByZWN1cnNpdmUgdHlwZSBoZXJlIChpbiB0eXBlLmFsaWFzU3ltYm9sXG4gICAgLy8gYmVsb3cpLCBidXQgQ2xvc3VyZSBDb21waWxlciBkb2VzIG5vdCBhbGxvdyByZWN1cnNpdmUgdHlwZSBkZWZpbml0aW9ucy5cbiAgICBpZiAodGhpcy5zZWVuQW5vbnltb3VzVHlwZXMuaGFzKHR5cGUpKSByZXR1cm4gJz8nO1xuXG4gICAgbGV0IGlzQW1iaWVudCA9IGZhbHNlO1xuICAgIGxldCBpc0luTmFtZXNwYWNlID0gZmFsc2U7XG4gICAgbGV0IGlzTW9kdWxlID0gZmFsc2U7XG4gICAgaWYgKHR5cGUuc3ltYm9sKSB7XG4gICAgICBmb3IgKGNvbnN0IGRlY2wgb2YgdHlwZS5zeW1ib2wuZGVjbGFyYXRpb25zIHx8IFtdKSB7XG4gICAgICAgIGlmICh0cy5pc0V4dGVybmFsTW9kdWxlKGRlY2wuZ2V0U291cmNlRmlsZSgpKSkgaXNNb2R1bGUgPSB0cnVlO1xuICAgICAgICBsZXQgY3VycmVudDogdHMuRGVjbGFyYXRpb258dW5kZWZpbmVkID0gZGVjbDtcbiAgICAgICAgd2hpbGUgKGN1cnJlbnQpIHtcbiAgICAgICAgICBpZiAodHMuZ2V0Q29tYmluZWRNb2RpZmllckZsYWdzKGN1cnJlbnQpICYgdHMuTW9kaWZpZXJGbGFncy5BbWJpZW50KSBpc0FtYmllbnQgPSB0cnVlO1xuICAgICAgICAgIGlmIChjdXJyZW50LmtpbmQgPT09IHRzLlN5bnRheEtpbmQuTW9kdWxlRGVjbGFyYXRpb24pIGlzSW5OYW1lc3BhY2UgPSB0cnVlO1xuICAgICAgICAgIGN1cnJlbnQgPSBjdXJyZW50LnBhcmVudCBhcyB0cy5EZWNsYXJhdGlvbiB8IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHRzaWNrbGUgY2Fubm90IGdlbmVyYXRlIHR5cGVzIGZvciBub24tYW1iaWVudCBuYW1lc3BhY2VzIG5vciBhbnkgc3ltYm9scyBjb250YWluZWQgaW4gdGhlbS5cbiAgICBpZiAoaXNJbk5hbWVzcGFjZSAmJiAhaXNBbWJpZW50KSByZXR1cm4gJz8nO1xuXG4gICAgLy8gVHlwZXMgaW4gZXh0ZXJucyBjYW5ub3QgcmVmZXJlbmNlIHR5cGVzIGZyb20gZXh0ZXJuYWwgbW9kdWxlcy5cbiAgICAvLyBIb3dldmVyIGFtYmllbnQgdHlwZXMgaW4gbW9kdWxlcyBnZXQgbW92ZWQgdG8gZXh0ZXJucywgdG9vLCBzbyB0eXBlIHJlZmVyZW5jZXMgd29yayBhbmQgd2VcbiAgICAvLyBjYW4gZW1pdCBhIHByZWNpc2UgdHlwZS5cbiAgICBpZiAodGhpcy5pc0ZvckV4dGVybnMgJiYgaXNNb2R1bGUgJiYgIWlzQW1iaWVudCkgcmV0dXJuICc/JztcblxuICAgIGNvbnN0IGxhc3RGbGFnID0gdHMuVHlwZUZsYWdzLlN1YnN0aXR1dGlvbjtcbiAgICBjb25zdCBtYXNrID0gKGxhc3RGbGFnIDw8IDEpIC0gMTtcbiAgICBzd2l0Y2ggKHR5cGUuZmxhZ3MgJiBtYXNrKSB7XG4gICAgICBjYXNlIHRzLlR5cGVGbGFncy5Bbnk6XG4gICAgICAgIHJldHVybiAnPyc7XG4gICAgICBjYXNlIHRzLlR5cGVGbGFncy5Vbmtub3duOlxuICAgICAgICByZXR1cm4gJyonO1xuICAgICAgY2FzZSB0cy5UeXBlRmxhZ3MuU3RyaW5nOlxuICAgICAgY2FzZSB0cy5UeXBlRmxhZ3MuU3RyaW5nTGl0ZXJhbDpcbiAgICAgICAgcmV0dXJuICdzdHJpbmcnO1xuICAgICAgY2FzZSB0cy5UeXBlRmxhZ3MuTnVtYmVyOlxuICAgICAgY2FzZSB0cy5UeXBlRmxhZ3MuTnVtYmVyTGl0ZXJhbDpcbiAgICAgICAgcmV0dXJuICdudW1iZXInO1xuICAgICAgY2FzZSB0cy5UeXBlRmxhZ3MuQm9vbGVhbjpcbiAgICAgIGNhc2UgdHMuVHlwZUZsYWdzLkJvb2xlYW5MaXRlcmFsOlxuICAgICAgICAvLyBTZWUgdGhlIG5vdGUgaW4gdHJhbnNsYXRlVW5pb24gYWJvdXQgYm9vbGVhbnMuXG4gICAgICAgIHJldHVybiAnYm9vbGVhbic7XG4gICAgICBjYXNlIHRzLlR5cGVGbGFncy5FbnVtOlxuICAgICAgICBpZiAoIXR5cGUuc3ltYm9sKSB7XG4gICAgICAgICAgdGhpcy53YXJuKGBFbnVtVHlwZSB3aXRob3V0IGEgc3ltYm9sYCk7XG4gICAgICAgICAgcmV0dXJuICc/JztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5zeW1ib2xUb1N0cmluZyh0eXBlLnN5bWJvbCkgfHwgJz8nO1xuICAgICAgY2FzZSB0cy5UeXBlRmxhZ3MuRVNTeW1ib2w6XG4gICAgICBjYXNlIHRzLlR5cGVGbGFncy5VbmlxdWVFU1N5bWJvbDpcbiAgICAgICAgLy8gRVNTeW1ib2wgaW5kaWNhdGVzIHNvbWV0aGluZyB0eXBlZCBzeW1ib2wuXG4gICAgICAgIC8vIFVuaXF1ZUVTU3ltYm9sIGluZGljYXRlcyBhIHNwZWNpZmljIHVuaXF1ZSBzeW1ib2wsIHVzZWQgZS5nLiB0byBpbmRleCBpbnRvIGFuIG9iamVjdC5cbiAgICAgICAgLy8gQ2xvc3VyZSBkb2VzIG5vdCBoYXZlIHRoaXMgZGlzdGluY3Rpb24sIHNvIHRzaWNrbGUgZW1pdHMgYm90aCBhcyAnc3ltYm9sJy5cbiAgICAgICAgcmV0dXJuICdzeW1ib2wnO1xuICAgICAgY2FzZSB0cy5UeXBlRmxhZ3MuVm9pZDpcbiAgICAgICAgcmV0dXJuICd2b2lkJztcbiAgICAgIGNhc2UgdHMuVHlwZUZsYWdzLlVuZGVmaW5lZDpcbiAgICAgICAgcmV0dXJuICd1bmRlZmluZWQnO1xuICAgICAgY2FzZSB0cy5UeXBlRmxhZ3MuTnVsbDpcbiAgICAgICAgcmV0dXJuICdudWxsJztcbiAgICAgIGNhc2UgdHMuVHlwZUZsYWdzLk5ldmVyOlxuICAgICAgICB0aGlzLndhcm4oYHNob3VsZCBub3QgZW1pdCBhICduZXZlcicgdHlwZWApO1xuICAgICAgICByZXR1cm4gJz8nO1xuICAgICAgY2FzZSB0cy5UeXBlRmxhZ3MuVHlwZVBhcmFtZXRlcjpcbiAgICAgICAgLy8gVGhpcyBpcyBlLmcuIHRoZSBUIGluIGEgdHlwZSBsaWtlIEZvbzxUPi5cbiAgICAgICAgaWYgKCF0eXBlLnN5bWJvbCkge1xuICAgICAgICAgIHRoaXMud2FybihgVHlwZVBhcmFtZXRlciB3aXRob3V0IGEgc3ltYm9sYCk7ICAvLyBzaG91bGQgbm90IGhhcHBlbiAodG0pXG4gICAgICAgICAgcmV0dXJuICc/JztcbiAgICAgICAgfVxuICAgICAgICAvLyBJbiBDbG9zdXJlLCB0eXBlIHBhcmFtZXRlcnMgKFwiPFQ+XCIpIGFyZSBub24tbnVsbGFibGUgYnkgZGVmYXVsdCwgdW5saWtlIHJlZmVyZW5jZXMgdG9cbiAgICAgICAgLy8gY2xhc3NlcyBvciBpbnRlcmZhY2VzLiBIb3dldmVyIHRoaXMgY29kZSBwYXRoIGNhbiBiZSByZWFjaGVkIGJ5IGJvdW5kIHR5cGUgcGFyYW1ldGVycyxcbiAgICAgICAgLy8gd2hlcmUgdGhlIHR5cGUgcGFyYW1ldGVyJ3Mgc3ltYm9sIHJlZmVyZW5jZXMgYSBwbGFpbiBjbGFzcyBvciBpbnRlcmZhY2UuIEluIHRoaXMgY2FzZSxcbiAgICAgICAgLy8gYWRkIGAhYCB0byBhdm9pZCBlbWl0dGluZyBhIG51bGxhYmxlIHR5cGUuXG4gICAgICAgIGxldCBwcmVmaXggPSAnJztcbiAgICAgICAgaWYgKCh0eXBlLnN5bWJvbC5mbGFncyAmIHRzLlN5bWJvbEZsYWdzLlR5cGVQYXJhbWV0ZXIpID09PSAwKSB7XG4gICAgICAgICAgcHJlZml4ID0gJyEnO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG5hbWUgPSB0aGlzLnN5bWJvbFRvU3RyaW5nKHR5cGUuc3ltYm9sKTtcbiAgICAgICAgaWYgKCFuYW1lKSByZXR1cm4gJz8nO1xuICAgICAgICByZXR1cm4gcHJlZml4ICsgbmFtZTtcbiAgICAgIGNhc2UgdHMuVHlwZUZsYWdzLk9iamVjdDpcbiAgICAgICAgcmV0dXJuIHRoaXMudHJhbnNsYXRlT2JqZWN0KHR5cGUgYXMgdHMuT2JqZWN0VHlwZSk7XG4gICAgICBjYXNlIHRzLlR5cGVGbGFncy5VbmlvbjpcbiAgICAgICAgcmV0dXJuIHRoaXMudHJhbnNsYXRlVW5pb24odHlwZSBhcyB0cy5VbmlvblR5cGUpO1xuICAgICAgY2FzZSB0cy5UeXBlRmxhZ3MuQ29uZGl0aW9uYWw6XG4gICAgICBjYXNlIHRzLlR5cGVGbGFncy5TdWJzdGl0dXRpb246XG4gICAgICAgIHRoaXMud2FybihgZW1pdHRpbmcgPyBmb3IgY29uZGl0aW9uYWwvc3Vic3RpdHV0aW9uIHR5cGVgKTtcbiAgICAgICAgcmV0dXJuICc/JztcbiAgICAgIGNhc2UgdHMuVHlwZUZsYWdzLkludGVyc2VjdGlvbjpcbiAgICAgIGNhc2UgdHMuVHlwZUZsYWdzLkluZGV4OlxuICAgICAgY2FzZSB0cy5UeXBlRmxhZ3MuSW5kZXhlZEFjY2VzczpcbiAgICAgICAgLy8gVE9ETyh0czIuMSk6IGhhbmRsZSB0aGVzZSBzcGVjaWFsIHR5cGVzLlxuICAgICAgICB0aGlzLndhcm4oYHVuaGFuZGxlZCB0eXBlIGZsYWdzOiAke3RzLlR5cGVGbGFnc1t0eXBlLmZsYWdzXX1gKTtcbiAgICAgICAgcmV0dXJuICc/JztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIC8vIEhhbmRsZSBjYXNlcyB3aGVyZSBtdWx0aXBsZSBmbGFncyBhcmUgc2V0LlxuXG4gICAgICAgIC8vIFR5cGVzIHdpdGggbGl0ZXJhbCBtZW1iZXJzIGFyZSByZXByZXNlbnRlZCBhc1xuICAgICAgICAvLyAgIHRzLlR5cGVGbGFncy5VbmlvbiB8IFtsaXRlcmFsIG1lbWJlcl1cbiAgICAgICAgLy8gRS5nLiBhbiBlbnVtIHR5cGVkIHZhbHVlIGlzIGEgdW5pb24gdHlwZSB3aXRoIHRoZSBlbnVtJ3MgbWVtYmVycyBhcyBpdHMgbWVtYmVycy4gQVxuICAgICAgICAvLyBib29sZWFuIHR5cGUgaXMgYSB1bmlvbiB0eXBlIHdpdGggJ3RydWUnIGFuZCAnZmFsc2UnIGFzIGl0cyBtZW1iZXJzLlxuICAgICAgICAvLyBOb3RlIGFsc28gdGhhdCBpbiBhIG1vcmUgY29tcGxleCB1bmlvbiwgZS5nLiBib29sZWFufG51bWJlciwgdGhlbiBpdCdzIGEgdW5pb24gb2YgdGhyZWVcbiAgICAgICAgLy8gdGhpbmdzICh0cnVlfGZhbHNlfG51bWJlcikgYW5kIHRzLlR5cGVGbGFncy5Cb29sZWFuIGRvZXNuJ3Qgc2hvdyB1cCBhdCBhbGwuXG4gICAgICAgIGlmICh0eXBlLmZsYWdzICYgdHMuVHlwZUZsYWdzLlVuaW9uKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMudHJhbnNsYXRlVW5pb24odHlwZSBhcyB0cy5VbmlvblR5cGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGUuZmxhZ3MgJiB0cy5UeXBlRmxhZ3MuRW51bUxpdGVyYWwpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy50cmFuc2xhdGVFbnVtTGl0ZXJhbCh0eXBlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRoZSBzd2l0Y2ggc3RhdGVtZW50IHNob3VsZCBoYXZlIGJlZW4gZXhoYXVzdGl2ZS5cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGB1bmtub3duIHR5cGUgZmxhZ3MgJHt0eXBlLmZsYWdzfSBvbiAke3R5cGVUb0RlYnVnU3RyaW5nKHR5cGUpfWApO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdHJhbnNsYXRlVW5pb24odHlwZTogdHMuVW5pb25UeXBlKTogc3RyaW5nIHtcbiAgICBsZXQgcGFydHMgPSB0eXBlLnR5cGVzLm1hcCh0ID0+IHRoaXMudHJhbnNsYXRlKHQpKTtcbiAgICAvLyBVbmlvbiB0eXBlcyB0aGF0IGluY2x1ZGUgbGl0ZXJhbHMgKGUuZy4gYm9vbGVhbiwgZW51bSkgY2FuIGVuZCB1cCByZXBlYXRpbmcgdGhlIHNhbWUgQ2xvc3VyZVxuICAgIC8vIHR5cGUuIEZvciBleGFtcGxlOiB0cnVlIHwgYm9vbGVhbiB3aWxsIGJlIHRyYW5zbGF0ZWQgdG8gYm9vbGVhbiB8IGJvb2xlYW4uXG4gICAgLy8gUmVtb3ZlIGR1cGxpY2F0ZXMgdG8gcHJvZHVjZSB0eXBlcyB0aGF0IHJlYWQgYmV0dGVyLlxuICAgIHBhcnRzID0gcGFydHMuZmlsdGVyKChlbCwgaWR4KSA9PiBwYXJ0cy5pbmRleE9mKGVsKSA9PT0gaWR4KTtcbiAgICByZXR1cm4gcGFydHMubGVuZ3RoID09PSAxID8gcGFydHNbMF0gOiBgKCR7cGFydHMuam9pbignfCcpfSlgO1xuICB9XG5cbiAgcHJpdmF0ZSB0cmFuc2xhdGVFbnVtTGl0ZXJhbCh0eXBlOiB0cy5UeXBlKTogc3RyaW5nIHtcbiAgICAvLyBTdXBwb3NlIHlvdSBoYWQ6XG4gICAgLy8gICBlbnVtIEVudW1UeXBlIHsgTUVNQkVSIH1cbiAgICAvLyB0aGVuIHRoZSB0eXBlIG9mIFwiRW51bVR5cGUuTUVNQkVSXCIgaXMgYW4gZW51bSBsaXRlcmFsICh0aGUgdGhpbmcgcGFzc2VkIHRvIHRoaXMgZnVuY3Rpb24pXG4gICAgLy8gYW5kIGl0IGhhcyB0eXBlIGZsYWdzIHRoYXQgaW5jbHVkZVxuICAgIC8vICAgdHMuVHlwZUZsYWdzLk51bWJlckxpdGVyYWwgfCB0cy5UeXBlRmxhZ3MuRW51bUxpdGVyYWxcbiAgICAvL1xuICAgIC8vIENsb3N1cmUgQ29tcGlsZXIgZG9lc24ndCBzdXBwb3J0IGxpdGVyYWxzIGluIHR5cGVzLCBzbyB0aGlzIGNvZGUgbXVzdCBub3QgZW1pdFxuICAgIC8vIFwiRW51bVR5cGUuTUVNQkVSXCIsIGJ1dCByYXRoZXIgXCJFbnVtVHlwZVwiLlxuXG4gICAgY29uc3QgZW51bUxpdGVyYWxCYXNlVHlwZSA9IHRoaXMudHlwZUNoZWNrZXIuZ2V0QmFzZVR5cGVPZkxpdGVyYWxUeXBlKHR5cGUpO1xuICAgIGlmICghZW51bUxpdGVyYWxCYXNlVHlwZS5zeW1ib2wpIHtcbiAgICAgIHRoaXMud2FybihgRW51bUxpdGVyYWxUeXBlIHdpdGhvdXQgYSBzeW1ib2xgKTtcbiAgICAgIHJldHVybiAnPyc7XG4gICAgfVxuICAgIGxldCBzeW1ib2wgPSBlbnVtTGl0ZXJhbEJhc2VUeXBlLnN5bWJvbDtcbiAgICBpZiAoZW51bUxpdGVyYWxCYXNlVHlwZSA9PT0gdHlwZSkge1xuICAgICAgLy8gVHlwZVNjcmlwdCdzIEFQSSB3aWxsIHJldHVybiB0aGUgc2FtZSBFbnVtTGl0ZXJhbCB0eXBlIGlmIHRoZSBlbnVtIG9ubHkgaGFzIGEgc2luZ2xlIG1lbWJlclxuICAgICAgLy8gdmFsdWUuIFNlZSBodHRwczovL2dpdGh1Yi5jb20vTWljcm9zb2Z0L1R5cGVTY3JpcHQvaXNzdWVzLzI4ODY5LlxuICAgICAgLy8gSW4gdGhhdCBjYXNlLCB0YWtlIHRoZSBwYXJlbnQgc3ltYm9sIG9mIHRoZSBlbnVtIG1lbWJlciwgd2hpY2ggc2hvdWxkIGJlIHRoZSBlbnVtXG4gICAgICAvLyBkZWNsYXJhdGlvbi5cbiAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1hbnkgd29ya2luZyBhcm91bmQgYSBUUyBBUEkgZGVmaWNpZW5jeS5cbiAgICAgIGNvbnN0IHBhcmVudDogdHMuU3ltYm9sfHVuZGVmaW5lZCA9IChzeW1ib2wgYXMgYW55KS5wYXJlbnQ7XG4gICAgICBpZiAoIXBhcmVudCkgcmV0dXJuICc/JztcbiAgICAgIHN5bWJvbCA9IHBhcmVudDtcbiAgICB9XG4gICAgY29uc3QgbmFtZSA9IHRoaXMuc3ltYm9sVG9TdHJpbmcoc3ltYm9sKTtcbiAgICBpZiAoIW5hbWUpIHJldHVybiAnPyc7XG4gICAgLy8gSW4gQ2xvc3VyZSwgZW51bSB0eXBlcyBhcmUgbm9uLW51bGwgYnkgZGVmYXVsdCwgc28gd2Ugd291bGRuJ3QgbmVlZCB0byBlbWl0IHRoZSBgIWAgaGVyZS5cbiAgICAvLyBIb3dldmVyIHRoYXQncyBjb25mdXNpbmcgdG8gdXNlcnMsIHRvIHRoZSBwb2ludCB0aGF0IHN0eWxlIGd1aWRlcyBhbmQgbGludGVycyByZXF1aXJlIHRvXG4gICAgLy8gKmFsd2F5cyogc3BlY2lmeSB0aGUgbnVsbGFiaWxpdHkgbW9kaWZpZXIuIFRvIGJlIGNvbnNpc3RlbnQgd2l0aCB0aGF0IHN0eWxlLCBpbmNsdWRlIGl0IGhlcmVcbiAgICAvLyBhcyB3ZWxsLlxuICAgIHJldHVybiAnIScgKyBuYW1lO1xuICB9XG5cbiAgLy8gdHJhbnNsYXRlT2JqZWN0IHRyYW5zbGF0ZXMgYSB0cy5PYmplY3RUeXBlLCB3aGljaCBpcyB0aGUgdHlwZSBvZiBhbGxcbiAgLy8gb2JqZWN0LWxpa2UgdGhpbmdzIGluIFRTLCBzdWNoIGFzIGNsYXNzZXMgYW5kIGludGVyZmFjZXMuXG4gIHByaXZhdGUgdHJhbnNsYXRlT2JqZWN0KHR5cGU6IHRzLk9iamVjdFR5cGUpOiBzdHJpbmcge1xuICAgIGlmICh0eXBlLnN5bWJvbCAmJiB0aGlzLmlzQmxhY2tMaXN0ZWQodHlwZS5zeW1ib2wpKSByZXR1cm4gJz8nO1xuXG4gICAgLy8gTk9URTogb2JqZWN0RmxhZ3MgaXMgYW4gZW51bSwgYnV0IGEgZ2l2ZW4gdHlwZSBjYW4gaGF2ZSBtdWx0aXBsZSBmbGFncy5cbiAgICAvLyBBcnJheTxzdHJpbmc+IGlzIGJvdGggdHMuT2JqZWN0RmxhZ3MuUmVmZXJlbmNlIGFuZCB0cy5PYmplY3RGbGFncy5JbnRlcmZhY2UuXG5cbiAgICBpZiAodHlwZS5vYmplY3RGbGFncyAmIHRzLk9iamVjdEZsYWdzLkNsYXNzKSB7XG4gICAgICBpZiAoIXR5cGUuc3ltYm9sKSB7XG4gICAgICAgIHRoaXMud2FybignY2xhc3MgaGFzIG5vIHN5bWJvbCcpO1xuICAgICAgICByZXR1cm4gJz8nO1xuICAgICAgfVxuICAgICAgY29uc3QgbmFtZSA9IHRoaXMuc3ltYm9sVG9TdHJpbmcodHlwZS5zeW1ib2wpO1xuICAgICAgaWYgKCFuYW1lKSB7XG4gICAgICAgIC8vIEFuIGFub255bW91cyB0eXBlLiBNYWtlIHN1cmUgbm90IHRvIGVtaXQgJyE/JywgYXMgdGhhdCBpcyBhIHN5bnRheCBlcnJvciBpbiBDbG9zdXJlXG4gICAgICAgIC8vIENvbXBpbGVyLlxuICAgICAgICByZXR1cm4gJz8nO1xuICAgICAgfVxuICAgICAgcmV0dXJuICchJyArIG5hbWU7XG4gICAgfSBlbHNlIGlmICh0eXBlLm9iamVjdEZsYWdzICYgdHMuT2JqZWN0RmxhZ3MuSW50ZXJmYWNlKSB7XG4gICAgICAvLyBOb3RlOiB0cy5JbnRlcmZhY2VUeXBlIGhhcyBhIHR5cGVQYXJhbWV0ZXJzIGZpZWxkLCBidXQgdGhhdFxuICAgICAgLy8gc3BlY2lmaWVzIHRoZSBwYXJhbWV0ZXJzIHRoYXQgdGhlIGludGVyZmFjZSB0eXBlICpleHBlY3RzKlxuICAgICAgLy8gd2hlbiBpdCdzIHVzZWQsIGFuZCBzaG91bGQgbm90IGJlIHRyYW5zZm9ybWVkIHRvIHRoZSBvdXRwdXQuXG4gICAgICAvLyBFLmcuIGEgdHlwZSBsaWtlIEFycmF5PG51bWJlcj4gaXMgYSBUeXBlUmVmZXJlbmNlIHRvIHRoZVxuICAgICAgLy8gSW50ZXJmYWNlVHlwZSBcIkFycmF5XCIsIGJ1dCB0aGUgXCJudW1iZXJcIiB0eXBlIHBhcmFtZXRlciBpc1xuICAgICAgLy8gcGFydCBvZiB0aGUgb3V0ZXIgVHlwZVJlZmVyZW5jZSwgbm90IGEgdHlwZVBhcmFtZXRlciBvblxuICAgICAgLy8gdGhlIEludGVyZmFjZVR5cGUuXG4gICAgICBpZiAoIXR5cGUuc3ltYm9sKSB7XG4gICAgICAgIHRoaXMud2FybignaW50ZXJmYWNlIGhhcyBubyBzeW1ib2wnKTtcbiAgICAgICAgcmV0dXJuICc/JztcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlLnN5bWJvbC5mbGFncyAmIHRzLlN5bWJvbEZsYWdzLlZhbHVlKSB7XG4gICAgICAgIC8vIFRoZSBzeW1ib2wgaXMgYm90aCBhIHR5cGUgYW5kIGEgdmFsdWUuXG4gICAgICAgIC8vIEZvciB1c2VyLWRlZmluZWQgdHlwZXMgaW4gdGhpcyBzdGF0ZSwgd2UgZG9uJ3QgaGF2ZSBhIENsb3N1cmUgbmFtZVxuICAgICAgICAvLyBmb3IgdGhlIHR5cGUuICBTZWUgdGhlIHR5cGVfYW5kX3ZhbHVlIHRlc3QuXG4gICAgICAgIGlmICghaXNDbG9zdXJlUHJvdmlkZWRUeXBlKHR5cGUuc3ltYm9sKSkge1xuICAgICAgICAgIHRoaXMud2FybihgdHlwZS9zeW1ib2wgY29uZmxpY3QgZm9yICR7dHlwZS5zeW1ib2wubmFtZX0sIHVzaW5nIHs/fSBmb3Igbm93YCk7XG4gICAgICAgICAgcmV0dXJuICc/JztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuICchJyArIHRoaXMuc3ltYm9sVG9TdHJpbmcodHlwZS5zeW1ib2wpO1xuICAgIH0gZWxzZSBpZiAodHlwZS5vYmplY3RGbGFncyAmIHRzLk9iamVjdEZsYWdzLlJlZmVyZW5jZSkge1xuICAgICAgLy8gQSByZWZlcmVuY2UgdG8gYW5vdGhlciB0eXBlLCBlLmcuIEFycmF5PG51bWJlcj4gcmVmZXJzIHRvIEFycmF5LlxuICAgICAgLy8gRW1pdCB0aGUgcmVmZXJlbmNlZCB0eXBlIGFuZCBhbnkgdHlwZSBhcmd1bWVudHMuXG4gICAgICBjb25zdCByZWZlcmVuY2VUeXBlID0gdHlwZSBhcyB0cy5UeXBlUmVmZXJlbmNlO1xuXG4gICAgICAvLyBBIHR1cGxlIGlzIGEgUmVmZXJlbmNlVHlwZSB3aGVyZSB0aGUgdGFyZ2V0IGlzIGZsYWdnZWQgVHVwbGUgYW5kIHRoZVxuICAgICAgLy8gdHlwZUFyZ3VtZW50cyBhcmUgdGhlIHR1cGxlIGFyZ3VtZW50cy4gIEp1c3QgdHJlYXQgaXQgYXMgYSBteXN0ZXJ5XG4gICAgICAvLyBhcnJheSwgYmVjYXVzZSBDbG9zdXJlIGRvZXNuJ3QgdW5kZXJzdGFuZCB0dXBsZXMuXG4gICAgICBpZiAocmVmZXJlbmNlVHlwZS50YXJnZXQub2JqZWN0RmxhZ3MgJiB0cy5PYmplY3RGbGFncy5UdXBsZSkge1xuICAgICAgICByZXR1cm4gJyFBcnJheTw/Pic7XG4gICAgICB9XG5cbiAgICAgIGxldCB0eXBlU3RyID0gJyc7XG4gICAgICBpZiAocmVmZXJlbmNlVHlwZS50YXJnZXQgPT09IHJlZmVyZW5jZVR5cGUpIHtcbiAgICAgICAgLy8gV2UgZ2V0IGludG8gYW4gaW5maW5pdGUgbG9vcCBoZXJlIGlmIHRoZSBpbm5lciByZWZlcmVuY2UgaXNcbiAgICAgICAgLy8gdGhlIHNhbWUgYXMgdGhlIG91dGVyOyB0aGlzIGNhbiBvY2N1ciB3aGVuIHRoaXMgZnVuY3Rpb25cbiAgICAgICAgLy8gZmFpbHMgdG8gdHJhbnNsYXRlIGEgbW9yZSBzcGVjaWZpYyB0eXBlIGJlZm9yZSBnZXR0aW5nIHRvXG4gICAgICAgIC8vIHRoaXMgcG9pbnQuXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgIGByZWZlcmVuY2UgbG9vcCBpbiAke3R5cGVUb0RlYnVnU3RyaW5nKHJlZmVyZW5jZVR5cGUpfSAke3JlZmVyZW5jZVR5cGUuZmxhZ3N9YCk7XG4gICAgICB9XG4gICAgICB0eXBlU3RyICs9IHRoaXMudHJhbnNsYXRlKHJlZmVyZW5jZVR5cGUudGFyZ2V0KTtcbiAgICAgIC8vIFRyYW5zbGF0ZSBjYW4gcmV0dXJuICc/JyBmb3IgYSBudW1iZXIgb2Ygc2l0dWF0aW9ucywgZS5nLiB0eXBlL3ZhbHVlIGNvbmZsaWN0cy5cbiAgICAgIC8vIGA/PD8+YCBpcyBpbGxlZ2FsIHN5bnRheCBpbiBDbG9zdXJlIENvbXBpbGVyLCBzbyBqdXN0IHJldHVybiBgP2AgaGVyZS5cbiAgICAgIGlmICh0eXBlU3RyID09PSAnPycpIHJldHVybiAnPyc7XG4gICAgICBpZiAocmVmZXJlbmNlVHlwZS50eXBlQXJndW1lbnRzKSB7XG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IHJlZmVyZW5jZVR5cGUudHlwZUFyZ3VtZW50cy5tYXAodCA9PiB0aGlzLnRyYW5zbGF0ZSh0KSk7XG4gICAgICAgIHR5cGVTdHIgKz0gYDwke3BhcmFtcy5qb2luKCcsICcpfT5gO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHR5cGVTdHI7XG4gICAgfSBlbHNlIGlmICh0eXBlLm9iamVjdEZsYWdzICYgdHMuT2JqZWN0RmxhZ3MuQW5vbnltb3VzKSB7XG4gICAgICBpZiAoIXR5cGUuc3ltYm9sKSB7XG4gICAgICAgIC8vIFRoaXMgY29tZXMgdXAgd2hlbiBnZW5lcmF0aW5nIGNvZGUgZm9yIGFuIGFycm93IGZ1bmN0aW9uIGFzIHBhc3NlZFxuICAgICAgICAvLyB0byBhIGdlbmVyaWMgZnVuY3Rpb24uICBUaGUgcGFzc2VkLWluIHR5cGUgaXMgdGFnZ2VkIGFzIGFub255bW91c1xuICAgICAgICAvLyBhbmQgaGFzIG5vIHByb3BlcnRpZXMgc28gaXQncyBoYXJkIHRvIGZpZ3VyZSBvdXQgd2hhdCB0byBnZW5lcmF0ZS5cbiAgICAgICAgLy8gSnVzdCBhdm9pZCBpdCBmb3Igbm93IHNvIHdlIGRvbid0IGNyYXNoLlxuICAgICAgICB0aGlzLndhcm4oJ2Fub255bW91cyB0eXBlIGhhcyBubyBzeW1ib2wnKTtcbiAgICAgICAgcmV0dXJuICc/JztcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGUuc3ltYm9sLmZsYWdzICYgdHMuU3ltYm9sRmxhZ3MuRnVuY3Rpb24gfHxcbiAgICAgICAgICB0eXBlLnN5bWJvbC5mbGFncyAmIHRzLlN5bWJvbEZsYWdzLk1ldGhvZCkge1xuICAgICAgICBjb25zdCBzaWdzID0gdGhpcy50eXBlQ2hlY2tlci5nZXRTaWduYXR1cmVzT2ZUeXBlKHR5cGUsIHRzLlNpZ25hdHVyZUtpbmQuQ2FsbCk7XG4gICAgICAgIGlmIChzaWdzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgIHJldHVybiB0aGlzLnNpZ25hdHVyZVRvQ2xvc3VyZShzaWdzWzBdKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLndhcm4oJ3VuaGFuZGxlZCBhbm9ueW1vdXMgdHlwZSB3aXRoIG11bHRpcGxlIGNhbGwgc2lnbmF0dXJlcycpO1xuICAgICAgICByZXR1cm4gJz8nO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHJhbnNsYXRlQW5vbnltb3VzVHlwZSh0eXBlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKlxuICAgIFRPRE8odHMyLjEpOiBtb3JlIHVuaGFuZGxlZCBvYmplY3QgdHlwZSBmbGFnczpcbiAgICAgIFR1cGxlXG4gICAgICBNYXBwZWRcbiAgICAgIEluc3RhbnRpYXRlZFxuICAgICAgT2JqZWN0TGl0ZXJhbFxuICAgICAgRXZvbHZpbmdBcnJheVxuICAgICAgT2JqZWN0TGl0ZXJhbFBhdHRlcm5XaXRoQ29tcHV0ZWRQcm9wZXJ0aWVzXG4gICAgKi9cbiAgICB0aGlzLndhcm4oYHVuaGFuZGxlZCB0eXBlICR7dHlwZVRvRGVidWdTdHJpbmcodHlwZSl9YCk7XG4gICAgcmV0dXJuICc/JztcbiAgfVxuXG4gIC8qKlxuICAgKiB0cmFuc2xhdGVBbm9ueW1vdXNUeXBlIHRyYW5zbGF0ZXMgYSB0cy5UeXBlRmxhZ3MuT2JqZWN0VHlwZSB0aGF0IGlzIGFsc29cbiAgICogdHMuT2JqZWN0RmxhZ3MuQW5vbnltb3VzLiBUaGF0IGlzLCB0aGlzIHR5cGUncyBzeW1ib2wgZG9lcyBub3QgaGF2ZSBhIG5hbWUuIFRoaXMgaXMgdGhlXG4gICAqIGFub255bW91cyB0eXBlIGVuY291bnRlcmVkIGluIGUuZy5cbiAgICogICAgIGxldCB4OiB7YTogbnVtYmVyfTtcbiAgICogQnV0IGFsc28gdGhlIGluZmVycmVkIHR5cGUgaW46XG4gICAqICAgICBsZXQgeCA9IHthOiAxfTsgIC8vIHR5cGUgb2YgeCBpcyB7YTogbnVtYmVyfSwgYXMgYWJvdmVcbiAgICovXG4gIHByaXZhdGUgdHJhbnNsYXRlQW5vbnltb3VzVHlwZSh0eXBlOiB0cy5UeXBlKTogc3RyaW5nIHtcbiAgICB0aGlzLnNlZW5Bbm9ueW1vdXNUeXBlcy5hZGQodHlwZSk7XG4gICAgLy8gR2F0aGVyIHVwIGFsbCB0aGUgbmFtZWQgZmllbGRzIGFuZCB3aGV0aGVyIHRoZSBvYmplY3QgaXMgYWxzbyBjYWxsYWJsZS5cbiAgICBsZXQgY2FsbGFibGUgPSBmYWxzZTtcbiAgICBsZXQgaW5kZXhhYmxlID0gZmFsc2U7XG4gICAgY29uc3QgZmllbGRzOiBzdHJpbmdbXSA9IFtdO1xuICAgIGlmICghdHlwZS5zeW1ib2wgfHwgIXR5cGUuc3ltYm9sLm1lbWJlcnMpIHtcbiAgICAgIHRoaXMud2FybignYW5vbnltb3VzIHR5cGUgaGFzIG5vIHN5bWJvbCcpO1xuICAgICAgcmV0dXJuICc/JztcbiAgICB9XG5cbiAgICAvLyBzcGVjaWFsLWNhc2UgY29uc3RydWN0IHNpZ25hdHVyZXMuXG4gICAgY29uc3QgY3RvcnMgPSB0eXBlLmdldENvbnN0cnVjdFNpZ25hdHVyZXMoKTtcbiAgICBpZiAoY3RvcnMubGVuZ3RoKSB7XG4gICAgICAvLyBUT0RPKG1hcnRpbnByb2JzdCk6IHRoaXMgZG9lcyBub3Qgc3VwcG9ydCBhZGRpdGlvbmFsIHByb3BlcnRpZXMgZGVmaW5lZCBvbiBjb25zdHJ1Y3RvcnNcbiAgICAgIC8vIChub3QgZXhwcmVzc2libGUgaW4gQ2xvc3VyZSksIG5vciBtdWx0aXBsZSBjb25zdHJ1Y3RvcnMgKHNhbWUpLlxuICAgICAgY29uc3QgZGVjbCA9IGN0b3JzWzBdLmRlY2xhcmF0aW9uO1xuICAgICAgaWYgKCFkZWNsKSB7XG4gICAgICAgIHRoaXMud2FybigndW5oYW5kbGVkIGFub255bW91cyB0eXBlIHdpdGggY29uc3RydWN0b3Igc2lnbmF0dXJlIGJ1dCBubyBkZWNsYXJhdGlvbicpO1xuICAgICAgICByZXR1cm4gJz8nO1xuICAgICAgfVxuICAgICAgaWYgKGRlY2wua2luZCA9PT0gdHMuU3ludGF4S2luZC5KU0RvY1NpZ25hdHVyZSkge1xuICAgICAgICB0aGlzLndhcm4oJ3VuaGFuZGxlZCBKU0RvYyBiYXNlZCBjb25zdHJ1Y3RvciBzaWduYXR1cmUnKTtcbiAgICAgICAgcmV0dXJuICc/JztcbiAgICAgIH1cblxuICAgICAgLy8gbmV3IDxUPih0ZWU6IFQpIGlzIG5vdCBzdXBwb3J0ZWQgYnkgQ2xvc3VyZSwgYmxhY2tsaXN0IGFzID8uXG4gICAgICB0aGlzLmJsYWNrbGlzdFR5cGVQYXJhbWV0ZXJzKHRoaXMuc3ltYm9sc1RvQWxpYXNlZE5hbWVzLCBkZWNsLnR5cGVQYXJhbWV0ZXJzKTtcblxuICAgICAgY29uc3QgcGFyYW1zID0gdGhpcy5jb252ZXJ0UGFyYW1zKGN0b3JzWzBdLCBkZWNsLnBhcmFtZXRlcnMpO1xuICAgICAgY29uc3QgcGFyYW1zU3RyID0gcGFyYW1zLmxlbmd0aCA/ICgnLCAnICsgcGFyYW1zLmpvaW4oJywgJykpIDogJyc7XG4gICAgICBjb25zdCBjb25zdHJ1Y3RlZFR5cGUgPSB0aGlzLnRyYW5zbGF0ZShjdG9yc1swXS5nZXRSZXR1cm5UeXBlKCkpO1xuICAgICAgLy8gSW4gdGhlIHNwZWNpZmljIGNhc2Ugb2YgdGhlIFwibmV3XCIgaW4gYSBmdW5jdGlvbiwgaXQgYXBwZWFycyB0aGF0XG4gICAgICAvLyAgIGZ1bmN0aW9uKG5ldzogIUJhcilcbiAgICAgIC8vIGZhaWxzIHRvIHBhcnNlLCB3aGlsZVxuICAgICAgLy8gICBmdW5jdGlvbihuZXc6ICghQmFyKSlcbiAgICAgIC8vIHBhcnNlcyBpbiB0aGUgd2F5IHlvdSdkIGV4cGVjdC5cbiAgICAgIC8vIEl0IGFwcGVhcnMgZnJvbSB0ZXN0aW5nIHRoYXQgQ2xvc3VyZSBpZ25vcmVzIHRoZSAhIGFueXdheSBhbmQganVzdFxuICAgICAgLy8gYXNzdW1lcyB0aGUgcmVzdWx0IHdpbGwgYmUgbm9uLW51bGwgaW4gZWl0aGVyIGNhc2UuICAoVG8gYmUgcGVkYW50aWMsXG4gICAgICAvLyBpdCdzIHBvc3NpYmxlIHRvIHJldHVybiBudWxsIGZyb20gYSBjdG9yIGl0IHNlZW1zIGxpa2UgYSBiYWQgaWRlYS4pXG4gICAgICByZXR1cm4gYGZ1bmN0aW9uKG5ldzogKCR7Y29uc3RydWN0ZWRUeXBlfSkke3BhcmFtc1N0cn0pOiA/YDtcbiAgICB9XG5cbiAgICAvLyBtZW1iZXJzIGlzIGFuIEVTNiBtYXAsIGJ1dCB0aGUgLmQudHMgZGVmaW5pbmcgaXQgZGVmaW5lZCB0aGVpciBvd24gbWFwXG4gICAgLy8gdHlwZSwgc28gdHlwZXNjcmlwdCBkb2Vzbid0IGJlbGlldmUgdGhhdCAua2V5cygpIGlzIGl0ZXJhYmxlXG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWFueVxuICAgIGZvciAoY29uc3QgZmllbGQgb2YgKHR5cGUuc3ltYm9sLm1lbWJlcnMua2V5cygpIGFzIGFueSkpIHtcbiAgICAgIHN3aXRjaCAoZmllbGQpIHtcbiAgICAgICAgY2FzZSAnX19jYWxsJzpcbiAgICAgICAgICBjYWxsYWJsZSA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ19faW5kZXgnOlxuICAgICAgICAgIGluZGV4YWJsZSA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgaWYgKCFpc1ZhbGlkQ2xvc3VyZVByb3BlcnR5TmFtZShmaWVsZCkpIHtcbiAgICAgICAgICAgIHRoaXMud2Fybihgb21pdHRpbmcgaW5leHByZXNzaWJsZSBwcm9wZXJ0eSBuYW1lOiAke2ZpZWxkfWApO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnN0IG1lbWJlciA9IHR5cGUuc3ltYm9sLm1lbWJlcnMuZ2V0KGZpZWxkKSE7XG4gICAgICAgICAgLy8gb3B0aW9uYWwgbWVtYmVycyBhcmUgaGFuZGxlZCBieSB0aGUgdHlwZSBpbmNsdWRpbmcgfHVuZGVmaW5lZCBpbiBhIHVuaW9uIHR5cGUuXG4gICAgICAgICAgY29uc3QgbWVtYmVyVHlwZSA9XG4gICAgICAgICAgICAgIHRoaXMudHJhbnNsYXRlKHRoaXMudHlwZUNoZWNrZXIuZ2V0VHlwZU9mU3ltYm9sQXRMb2NhdGlvbihtZW1iZXIsIHRoaXMubm9kZSkpO1xuICAgICAgICAgIGZpZWxkcy5wdXNoKGAke2ZpZWxkfTogJHttZW1iZXJUeXBlfWApO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFRyeSB0byBzcGVjaWFsLWNhc2UgcGxhaW4ga2V5LXZhbHVlIG9iamVjdHMgYW5kIGZ1bmN0aW9ucy5cbiAgICBpZiAoZmllbGRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgaWYgKGNhbGxhYmxlICYmICFpbmRleGFibGUpIHtcbiAgICAgICAgLy8gQSBmdW5jdGlvbiB0eXBlLlxuICAgICAgICBjb25zdCBzaWdzID0gdGhpcy50eXBlQ2hlY2tlci5nZXRTaWduYXR1cmVzT2ZUeXBlKHR5cGUsIHRzLlNpZ25hdHVyZUtpbmQuQ2FsbCk7XG4gICAgICAgIGlmIChzaWdzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgIHJldHVybiB0aGlzLnNpZ25hdHVyZVRvQ2xvc3VyZShzaWdzWzBdKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChpbmRleGFibGUgJiYgIWNhbGxhYmxlKSB7XG4gICAgICAgIC8vIEEgcGxhaW4ga2V5LXZhbHVlIG1hcCB0eXBlLlxuICAgICAgICBsZXQga2V5VHlwZSA9ICdzdHJpbmcnO1xuICAgICAgICBsZXQgdmFsVHlwZSA9IHRoaXMudHlwZUNoZWNrZXIuZ2V0SW5kZXhUeXBlT2ZUeXBlKHR5cGUsIHRzLkluZGV4S2luZC5TdHJpbmcpO1xuICAgICAgICBpZiAoIXZhbFR5cGUpIHtcbiAgICAgICAgICBrZXlUeXBlID0gJ251bWJlcic7XG4gICAgICAgICAgdmFsVHlwZSA9IHRoaXMudHlwZUNoZWNrZXIuZ2V0SW5kZXhUeXBlT2ZUeXBlKHR5cGUsIHRzLkluZGV4S2luZC5OdW1iZXIpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdmFsVHlwZSkge1xuICAgICAgICAgIHRoaXMud2FybigndW5rbm93biBpbmRleCBrZXkgdHlwZScpO1xuICAgICAgICAgIHJldHVybiBgIU9iamVjdDw/LD8+YDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYCFPYmplY3Q8JHtrZXlUeXBlfSwke3RoaXMudHJhbnNsYXRlKHZhbFR5cGUpfT5gO1xuICAgICAgfSBlbHNlIGlmICghY2FsbGFibGUgJiYgIWluZGV4YWJsZSkge1xuICAgICAgICAvLyBUaGUgb2JqZWN0IGhhcyBubyBtZW1iZXJzLiAgVGhpcyBpcyB0aGUgVFMgdHlwZSAne30nLFxuICAgICAgICAvLyB3aGljaCBtZWFucyBcImFueSB2YWx1ZSBvdGhlciB0aGFuIG51bGwgb3IgdW5kZWZpbmVkXCIuXG4gICAgICAgIC8vIFdoYXQgaXMgdGhpcyBpbiBDbG9zdXJlJ3MgdHlwZSBzeXN0ZW0/XG4gICAgICAgIC8vXG4gICAgICAgIC8vIEZpcnN0LCB7IU9iamVjdH0gaXMgd3JvbmcgYmVjYXVzZSBpdCBpcyBub3QgYSBzdXBlcnR5cGUgb2ZcbiAgICAgICAgLy8ge3N0cmluZ30gb3Ige251bWJlcn0uICBUaGlzIHdvdWxkIG1lYW4geW91IGNhbm5vdCBhc3NpZ24gYVxuICAgICAgICAvLyBudW1iZXIgdG8gYSB2YXJpYWJsZSBvZiBUUyB0eXBlIHt9LlxuICAgICAgICAvL1xuICAgICAgICAvLyBXZSBnZXQgY2xvc2VyIHdpdGggeyp9LCBha2EgdGhlIEFMTCB0eXBlLiAgVGhpcyBvbmUgYmV0dGVyXG4gICAgICAgIC8vIGNhcHR1cmVzIHRoZSB0eXBpY2FsIHVzZSBvZiB0aGUgVFMge30sIHdoaWNoIHVzZXJzIHVzZSBmb3JcbiAgICAgICAgLy8gXCJJIGRvbid0IGNhcmVcIi5cbiAgICAgICAgLy9cbiAgICAgICAgLy8geyp9IHVuZm9ydHVuYXRlbHkgZG9lcyBpbmNsdWRlIG51bGwvdW5kZWZpbmVkLCBzbyBpdCdzIGEgY2xvc2VyXG4gICAgICAgIC8vIG1hdGNoIGZvciBUUyAzLjAncyAndW5rbm93bicuXG4gICAgICAgIHJldHVybiAnKic7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFjYWxsYWJsZSAmJiAhaW5kZXhhYmxlKSB7XG4gICAgICAvLyBOb3QgY2FsbGFibGUsIG5vdCBpbmRleGFibGU7IGltcGxpZXMgYSBwbGFpbiBvYmplY3Qgd2l0aCBmaWVsZHMgaW4gaXQuXG4gICAgICByZXR1cm4gYHske2ZpZWxkcy5qb2luKCcsICcpfX1gO1xuICAgIH1cblxuICAgIHRoaXMud2FybigndW5oYW5kbGVkIGFub255bW91cyB0eXBlJyk7XG4gICAgcmV0dXJuICc/JztcbiAgfVxuXG4gIC8qKiBDb252ZXJ0cyBhIHRzLlNpZ25hdHVyZSAoZnVuY3Rpb24gc2lnbmF0dXJlKSB0byBhIENsb3N1cmUgZnVuY3Rpb24gdHlwZS4gKi9cbiAgcHJpdmF0ZSBzaWduYXR1cmVUb0Nsb3N1cmUoc2lnOiB0cy5TaWduYXR1cmUpOiBzdHJpbmcge1xuICAgIC8vIFRPRE8obWFydGlucHJvYnN0KTogQ29uc2lkZXIgaGFybW9uaXppbmcgc29tZSBvdmVybGFwIHdpdGggZW1pdEZ1bmN0aW9uVHlwZSBpbiB0c2lja2xlLnRzLlxuICAgIGlmICghc2lnLmRlY2xhcmF0aW9uKSB7XG4gICAgICB0aGlzLndhcm4oJ3NpZ25hdHVyZSB3aXRob3V0IGRlY2xhcmF0aW9uJyk7XG4gICAgICByZXR1cm4gJ0Z1bmN0aW9uJztcbiAgICB9XG4gICAgaWYgKHNpZy5kZWNsYXJhdGlvbi5raW5kID09PSB0cy5TeW50YXhLaW5kLkpTRG9jU2lnbmF0dXJlKSB7XG4gICAgICB0aGlzLndhcm4oJ3NpZ25hdHVyZSB3aXRoIEpTRG9jIGRlY2xhcmF0aW9uJyk7XG4gICAgICByZXR1cm4gJ0Z1bmN0aW9uJztcbiAgICB9XG4gICAgdGhpcy5ibGFja2xpc3RUeXBlUGFyYW1ldGVycyh0aGlzLnN5bWJvbHNUb0FsaWFzZWROYW1lcywgc2lnLmRlY2xhcmF0aW9uLnR5cGVQYXJhbWV0ZXJzKTtcblxuICAgIGxldCB0eXBlU3RyID0gYGZ1bmN0aW9uKGA7XG4gICAgbGV0IHBhcmFtRGVjbHM6IFJlYWRvbmx5QXJyYXk8dHMuUGFyYW1ldGVyRGVjbGFyYXRpb24+ID0gc2lnLmRlY2xhcmF0aW9uLnBhcmFtZXRlcnMgfHwgW107XG4gICAgY29uc3QgbWF5YmVUaGlzUGFyYW0gPSBwYXJhbURlY2xzWzBdO1xuICAgIC8vIE9kZGx5LCB0aGUgdGhpcyB0eXBlIHNob3dzIHVwIGluIHBhcmFtRGVjbHMsIGJ1dCBub3QgaW4gdGhlIHR5cGUncyBwYXJhbWV0ZXJzLlxuICAgIC8vIEhhbmRsZSBpdCBoZXJlIGFuZCB0aGVuIHBhc3MgcGFyYW1EZWNscyBkb3duIHdpdGhvdXQgaXRzIGZpcnN0IGVsZW1lbnQuXG4gICAgaWYgKG1heWJlVGhpc1BhcmFtICYmIG1heWJlVGhpc1BhcmFtLm5hbWUuZ2V0VGV4dCgpID09PSAndGhpcycpIHtcbiAgICAgIGlmIChtYXliZVRoaXNQYXJhbS50eXBlKSB7XG4gICAgICAgIGNvbnN0IHRoaXNUeXBlID0gdGhpcy50eXBlQ2hlY2tlci5nZXRUeXBlQXRMb2NhdGlvbihtYXliZVRoaXNQYXJhbS50eXBlKTtcbiAgICAgICAgdHlwZVN0ciArPSBgdGhpczogKCR7dGhpcy50cmFuc2xhdGUodGhpc1R5cGUpfSlgO1xuICAgICAgICBpZiAocGFyYW1EZWNscy5sZW5ndGggPiAxKSB0eXBlU3RyICs9ICcsICc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLndhcm4oJ3RoaXMgdHlwZSB3aXRob3V0IHR5cGUnKTtcbiAgICAgIH1cbiAgICAgIHBhcmFtRGVjbHMgPSBwYXJhbURlY2xzLnNsaWNlKDEpO1xuICAgIH1cblxuICAgIGNvbnN0IHBhcmFtcyA9IHRoaXMuY29udmVydFBhcmFtcyhzaWcsIHBhcmFtRGVjbHMpO1xuICAgIHR5cGVTdHIgKz0gYCR7cGFyYW1zLmpvaW4oJywgJyl9KWA7XG5cbiAgICBjb25zdCByZXRUeXBlID0gdGhpcy50cmFuc2xhdGUodGhpcy50eXBlQ2hlY2tlci5nZXRSZXR1cm5UeXBlT2ZTaWduYXR1cmUoc2lnKSk7XG4gICAgaWYgKHJldFR5cGUpIHtcbiAgICAgIHR5cGVTdHIgKz0gYDogJHtyZXRUeXBlfWA7XG4gICAgfVxuXG4gICAgcmV0dXJuIHR5cGVTdHI7XG4gIH1cblxuICAvKipcbiAgICogQ29udmVydHMgcGFyYW1ldGVycyBmb3IgdGhlIGdpdmVuIHNpZ25hdHVyZS4gVGFrZXMgcGFyYW1ldGVyIGRlY2xhcmF0aW9ucyBhcyB0aG9zZSBtaWdodCBub3RcbiAgICogbWF0Y2ggdGhlIHNpZ25hdHVyZSBwYXJhbWV0ZXJzIChlLmcuIHRoZXJlIG1pZ2h0IGJlIGFuIGFkZGl0aW9uYWwgdGhpcyBwYXJhbWV0ZXIpLiBUaGlzXG4gICAqIGRpZmZlcmVuY2UgaXMgaGFuZGxlZCBieSB0aGUgY2FsbGVyLCBhcyBpcyBjb252ZXJ0aW5nIHRoZSBcInRoaXNcIiBwYXJhbWV0ZXIuXG4gICAqL1xuICBwcml2YXRlIGNvbnZlcnRQYXJhbXMoc2lnOiB0cy5TaWduYXR1cmUsIHBhcmFtRGVjbHM6IFJlYWRvbmx5QXJyYXk8dHMuUGFyYW1ldGVyRGVjbGFyYXRpb24+KTpcbiAgICAgIHN0cmluZ1tdIHtcbiAgICBjb25zdCBwYXJhbVR5cGVzOiBzdHJpbmdbXSA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2lnLnBhcmFtZXRlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHBhcmFtID0gc2lnLnBhcmFtZXRlcnNbaV07XG5cbiAgICAgIGNvbnN0IHBhcmFtRGVjbCA9IHBhcmFtRGVjbHNbaV07XG4gICAgICBjb25zdCBvcHRpb25hbCA9ICEhcGFyYW1EZWNsLnF1ZXN0aW9uVG9rZW47XG4gICAgICBjb25zdCB2YXJBcmdzID0gISFwYXJhbURlY2wuZG90RG90RG90VG9rZW47XG4gICAgICBsZXQgcGFyYW1UeXBlID0gdGhpcy50eXBlQ2hlY2tlci5nZXRUeXBlT2ZTeW1ib2xBdExvY2F0aW9uKHBhcmFtLCB0aGlzLm5vZGUpO1xuICAgICAgaWYgKHZhckFyZ3MpIHtcbiAgICAgICAgaWYgKChwYXJhbVR5cGUuZmxhZ3MgJiB0cy5UeXBlRmxhZ3MuT2JqZWN0KSA9PT0gMCkge1xuICAgICAgICAgIHRoaXMud2FybigndmFyIGFyZ3MgdHlwZSBpcyBub3QgYW4gb2JqZWN0IHR5cGUnKTtcbiAgICAgICAgICBwYXJhbVR5cGVzLnB1c2goJyFBcnJheTw/PicpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmICgoKHBhcmFtVHlwZSBhcyB0cy5PYmplY3RUeXBlKS5vYmplY3RGbGFncyAmIHRzLk9iamVjdEZsYWdzLlJlZmVyZW5jZSkgPT09IDApIHtcbiAgICAgICAgICB0aGlzLndhcm4oJ3Vuc3VwcG9ydGVkIHZhciBhcmdzIHR5cGUgKG5vdCBhbiBhcnJheSByZWZlcmVuY2UpJyk7XG4gICAgICAgICAgcGFyYW1UeXBlcy5wdXNoKCchQXJyYXk8Pz4nKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB0eXBlUmVmID0gcGFyYW1UeXBlIGFzIHRzLlR5cGVSZWZlcmVuY2U7XG4gICAgICAgIHBhcmFtVHlwZSA9IHR5cGVSZWYudHlwZUFyZ3VtZW50cyFbMF07XG4gICAgICB9XG4gICAgICBsZXQgdHlwZVN0ciA9IHRoaXMudHJhbnNsYXRlKHBhcmFtVHlwZSk7XG4gICAgICBpZiAodmFyQXJncykgdHlwZVN0ciA9ICcuLi4nICsgdHlwZVN0cjtcbiAgICAgIGlmIChvcHRpb25hbCkgdHlwZVN0ciA9IHR5cGVTdHIgKyAnPSc7XG4gICAgICBwYXJhbVR5cGVzLnB1c2godHlwZVN0cik7XG4gICAgfVxuICAgIHJldHVybiBwYXJhbVR5cGVzO1xuICB9XG5cbiAgd2Fybihtc2c6IHN0cmluZykge1xuICAgIC8vIEJ5IGRlZmF1bHQsIHdhcm4oKSBkb2VzIG5vdGhpbmcuICBUaGUgY2FsbGVyIHdpbGwgb3ZlcndyaXRlIHRoaXNcbiAgICAvLyBpZiBpdCB3YW50cyBkaWZmZXJlbnQgYmVoYXZpb3IuXG4gIH1cblxuICAvKiogQHJldHVybiB0cnVlIGlmIHN5bSBzaG91bGQgYWx3YXlzIGhhdmUgdHlwZSB7P30uICovXG4gIGlzQmxhY2tMaXN0ZWQoc3ltYm9sOiB0cy5TeW1ib2wpOiBib29sZWFuIHtcbiAgICByZXR1cm4gaXNCbGFja2xpc3RlZCh0aGlzLnBhdGhCbGFja0xpc3QsIHN5bWJvbCk7XG4gIH1cblxuICAvKipcbiAgICogQ2xvc3VyZSBkb2VzbiBub3Qgc3VwcG9ydCB0eXBlIHBhcmFtZXRlcnMgZm9yIGZ1bmN0aW9uIHR5cGVzLCBpLmUuIGdlbmVyaWMgZnVuY3Rpb24gdHlwZXMuXG4gICAqIEJsYWNrbGlzdCB0aGUgc3ltYm9scyBkZWNsYXJlZCBieSB0aGVtIGFuZCBlbWl0IGEgPyBmb3IgdGhlIHR5cGVzLlxuICAgKlxuICAgKiBUaGlzIG11dGF0ZXMgdGhlIGdpdmVuIGJsYWNrbGlzdCBtYXAuIFRoZSBtYXAncyBzY29wZSBpcyBvbmUgZmlsZSwgYW5kIHN5bWJvbHMgYXJlXG4gICAqIHVuaXF1ZSBvYmplY3RzLCBzbyB0aGlzIHNob3VsZCBuZWl0aGVyIGxlYWQgdG8gZXhjZXNzaXZlIG1lbW9yeSBjb25zdW1wdGlvbiBub3IgaW50cm9kdWNlXG4gICAqIGVycm9ycy5cbiAgICpcbiAgICogQHBhcmFtIGJsYWNrbGlzdCBhIG1hcCB0byBzdG9yZSB0aGUgYmxhY2tsaXN0ZWQgc3ltYm9scyBpbiwgd2l0aCBhIHZhbHVlIG9mICc/Jy4gSW4gcHJhY3RpY2UsXG4gICAqICAgICB0aGlzIGlzIGFsd2F5cyA9PT0gdGhpcy5zeW1ib2xzVG9BbGlhc2VkTmFtZXMsIGJ1dCB3ZSdyZSBwYXNzaW5nIGl0IGV4cGxpY2l0bHkgdG8gbWFrZSBpdFxuICAgKiAgICBjbGVhciB0aGF0IHRoZSBtYXAgaXMgbXV0YXRlZCAoaW4gcGFydGljdWxhciB3aGVuIHVzZWQgZnJvbSBvdXRzaWRlIHRoZSBjbGFzcykuXG4gICAqIEBwYXJhbSBkZWNscyB0aGUgZGVjbGFyYXRpb25zIHdob3NlIHN5bWJvbHMgc2hvdWxkIGJlIGJsYWNrbGlzdGVkLlxuICAgKi9cbiAgYmxhY2tsaXN0VHlwZVBhcmFtZXRlcnMoXG4gICAgICBibGFja2xpc3Q6IE1hcDx0cy5TeW1ib2wsIHN0cmluZz4sXG4gICAgICBkZWNsczogUmVhZG9ubHlBcnJheTx0cy5UeXBlUGFyYW1ldGVyRGVjbGFyYXRpb24+fHVuZGVmaW5lZCkge1xuICAgIGlmICghZGVjbHMgfHwgIWRlY2xzLmxlbmd0aCkgcmV0dXJuO1xuICAgIGZvciAoY29uc3QgdHBkIG9mIGRlY2xzKSB7XG4gICAgICBjb25zdCBzeW0gPSB0aGlzLnR5cGVDaGVja2VyLmdldFN5bWJvbEF0TG9jYXRpb24odHBkLm5hbWUpO1xuICAgICAgaWYgKCFzeW0pIHtcbiAgICAgICAgdGhpcy53YXJuKGB0eXBlIHBhcmFtZXRlciB3aXRoIG5vIHN5bWJvbGApO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGJsYWNrbGlzdC5zZXQoc3ltLCAnPycpO1xuICAgIH1cbiAgfVxufVxuXG4vKiogQHJldHVybiB0cnVlIGlmIHN5bSBzaG91bGQgYWx3YXlzIGhhdmUgdHlwZSB7P30uICovXG5leHBvcnQgZnVuY3Rpb24gaXNCbGFja2xpc3RlZChwYXRoQmxhY2tMaXN0OiBTZXQ8c3RyaW5nPnx1bmRlZmluZWQsIHN5bWJvbDogdHMuU3ltYm9sKSB7XG4gIGlmIChwYXRoQmxhY2tMaXN0ID09PSB1bmRlZmluZWQpIHJldHVybiBmYWxzZTtcbiAgLy8gU29tZSBidWlsdGluIHR5cGVzLCBzdWNoIGFzIHt9LCBnZXQgcmVwcmVzZW50ZWQgYnkgYSBzeW1ib2wgdGhhdCBoYXMgbm8gZGVjbGFyYXRpb25zLlxuICBpZiAoc3ltYm9sLmRlY2xhcmF0aW9ucyA9PT0gdW5kZWZpbmVkKSByZXR1cm4gZmFsc2U7XG4gIHJldHVybiBzeW1ib2wuZGVjbGFyYXRpb25zLmV2ZXJ5KG4gPT4ge1xuICAgIGNvbnN0IGZpbGVOYW1lID0gcGF0aC5ub3JtYWxpemUobi5nZXRTb3VyY2VGaWxlKCkuZmlsZU5hbWUpO1xuICAgIHJldHVybiBwYXRoQmxhY2tMaXN0LmhhcyhmaWxlTmFtZSk7XG4gIH0pO1xufVxuIl19