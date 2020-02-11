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
        define("tsickle/src/jsdoc_transformer", ["require", "exports", "typescript", "tsickle/src/annotator_host", "tsickle/src/decorators", "tsickle/src/googmodule", "tsickle/src/jsdoc", "tsickle/src/module_type_translator", "tsickle/src/transformer_util", "tsickle/src/type_translator"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @fileoverview jsdoc_transformer contains the logic to add JSDoc comments to TypeScript code.
     *
     * One of tsickle's features is to add Closure Compiler compatible JSDoc comments containing type
     * annotations, inheritance information, etc., onto TypeScript code. This allows Closure Compiler to
     * make better optimization decisions compared to an untyped code base.
     *
     * The entry point to the annotation operation is jsdocTransformer below. It adds synthetic comments
     * to existing TypeScript constructs, for example:
     *     const x: number = 1;
     * Might get transformed to:
     *     /.. \@type {number} ./
     *     const x: number = 1;
     * Later TypeScript phases then remove the type annotation, and the final emit is JavaScript that
     * only contains the JSDoc comment.
     *
     * To handle certain constructs, this transformer also performs AST transformations, e.g. by adding
     * CommonJS-style exports for type constructs, expanding `export *`, parenthesizing casts, etc.
     */
    var ts = require("typescript");
    var annotator_host_1 = require("tsickle/src/annotator_host");
    var decorators_1 = require("tsickle/src/decorators");
    var googmodule = require("tsickle/src/googmodule");
    var jsdoc = require("tsickle/src/jsdoc");
    var module_type_translator_1 = require("tsickle/src/module_type_translator");
    var transformerUtil = require("tsickle/src/transformer_util");
    var type_translator_1 = require("tsickle/src/type_translator");
    function addCommentOn(node, tags, escapeExtraTags) {
        var comment = jsdoc.toSynthesizedComment(tags, escapeExtraTags);
        var comments = ts.getSyntheticLeadingComments(node) || [];
        comments.push(comment);
        ts.setSyntheticLeadingComments(node, comments);
        return comment;
    }
    /** Adds an \@template clause to docTags if decl has type parameters. */
    function maybeAddTemplateClause(docTags, decl) {
        if (!decl.typeParameters)
            return;
        // Closure does not support template constraints (T extends X), these are ignored below.
        docTags.push({
            tagName: 'template',
            text: decl.typeParameters.map(function (tp) { return transformerUtil.getIdentifierText(tp.name); }).join(', ')
        });
    }
    exports.maybeAddTemplateClause = maybeAddTemplateClause;
    /**
     * Adds heritage clauses (\@extends, \@implements) to the given docTags for decl. Used by
     * jsdoc_transformer and externs generation.
     */
    function maybeAddHeritageClauses(docTags, mtt, decl) {
        var e_1, _a, e_2, _b;
        if (!decl.heritageClauses)
            return;
        var isClass = decl.kind === ts.SyntaxKind.ClassDeclaration;
        var hasExtends = decl.heritageClauses.some(function (c) { return c.token === ts.SyntaxKind.ExtendsKeyword; });
        try {
            for (var _c = __values(decl.heritageClauses), _d = _c.next(); !_d.done; _d = _c.next()) {
                var heritage = _d.value;
                var isExtends = heritage.token === ts.SyntaxKind.ExtendsKeyword;
                if (isClass && isExtends) {
                    // If a class has an "extends", that is preserved in the ES6 output
                    // and we don't need to emit any additional jsdoc.
                    //
                    // However for ambient declarations, we only emit externs, and in those we do need to
                    // add "@extends {Foo}" as they use ES5 syntax.
                    if (!transformerUtil.isAmbient(decl))
                        continue;
                }
                try {
                    // Otherwise, if we get here, we need to emit some jsdoc.
                    for (var _e = __values(heritage.types), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var expr = _f.value;
                        var heritage_1 = heritageName(isExtends, hasExtends, expr);
                        // heritageName may return null, indicating that the clause is something inexpressible
                        // in Closure, e.g. "class Foo implements Partial<Bar>".
                        if (heritage_1) {
                            docTags.push({
                                tagName: heritage_1.tagName,
                                type: heritage_1.parentName,
                            });
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
        /**
         * Computes the Closure name of an expression occurring in a heritage clause,
         * e.g. "implements FooBar".  Will return null if the expression is inexpressible
         * in Closure semantics.  Note that we don't need to consider all possible
         * combinations of types/values and extends/implements because our input is
         * already verified to be valid TypeScript.  See test_files/class/ for the full
         * cartesian product of test cases.
         * @param isExtends True if we're in an 'extends', false in an 'implements'.
         * @param hasExtends True if there are any 'extends' clauses present at all.
         */
        function heritageName(isExtends, hasExtends, expr) {
            var tagName = isExtends ? 'extends' : 'implements';
            var sym = mtt.typeChecker.getSymbolAtLocation(expr.expression);
            if (!sym) {
                // It's possible for a class declaration to extend an expression that
                // does not have have a symbol, for example when a mixin function is
                // used to build a base class, as in `declare MyClass extends
                // MyMixin(MyBaseClass)`.
                //
                // Handling this correctly is tricky. Closure throws on this
                // `extends <expression>` syntax (see
                // https://github.com/google/closure-compiler/issues/2182). We would
                // probably need to generate an intermediate class declaration and
                // extend that.
                mtt.debugWarn(decl, "could not resolve supertype: " + expr.getText());
                return null;
            }
            // Resolve any aliases to the underlying type.
            if (sym.flags & ts.SymbolFlags.TypeAlias) {
                // It's implementing a type alias.  Follow the type alias back
                // to the original symbol to check whether it's a type or a value.
                var type = mtt.typeChecker.getDeclaredTypeOfSymbol(sym);
                if (!type.symbol) {
                    // It's not clear when this can happen.
                    mtt.debugWarn(decl, "could not get type of symbol: " + expr.getText());
                    return null;
                }
                sym = type.symbol;
            }
            if (sym.flags & ts.SymbolFlags.Alias) {
                sym = mtt.typeChecker.getAliasedSymbol(sym);
            }
            var typeTranslator = mtt.newTypeTranslator(expr.expression);
            if (typeTranslator.isBlackListed(sym)) {
                // Don't emit references to blacklisted types.
                return null;
            }
            if (sym.flags & ts.SymbolFlags.Class) {
                if (!isClass) {
                    // Closure interfaces cannot extend or implements classes.
                    mtt.debugWarn(decl, "omitting interface deriving from class: " + expr.getText());
                    return null;
                }
                if (!isExtends) {
                    if (!hasExtends) {
                        // A special case: for a class that has no existing 'extends' clause but does
                        // have an 'implements' clause that refers to another class, we change it to
                        // instead be an 'extends'.  This was a poorly-thought-out hack that may
                        // actually cause compiler bugs:
                        //   https://github.com/google/closure-compiler/issues/3126
                        // but we have code that now relies on it, ugh.
                        tagName = 'extends';
                    }
                    else {
                        // Closure can only @implements an interface, not a class.
                        mtt.debugWarn(decl, "omitting @implements of a class: " + expr.getText());
                        return null;
                    }
                }
            }
            else if (sym.flags & ts.SymbolFlags.Value) {
                // If it's something other than a class in the value namespace, then it will
                // not be a type in the Closure output (because Closure collapses
                // the type and value namespaces).
                mtt.debugWarn(decl, "omitting heritage reference to a type/value conflict: " + expr.getText());
                return null;
            }
            else if (sym.flags & ts.SymbolFlags.TypeLiteral) {
                // A type literal is a type like `{foo: string}`.
                // These can come up as the output of a mapped type.
                mtt.debugWarn(decl, "omitting heritage reference to a type literal: " + expr.getText());
                return null;
            }
            // typeToClosure includes nullability modifiers, so call symbolToString directly here.
            var parentName = typeTranslator.symbolToString(sym);
            if (!parentName)
                return null;
            return { tagName: tagName, parentName: parentName };
        }
    }
    exports.maybeAddHeritageClauses = maybeAddHeritageClauses;
    /**
     * createMemberTypeDeclaration emits the type annotations for members of a class. It's necessary in
     * the case where TypeScript syntax specifies there are additional properties on the class, because
     * to declare these in Closure you must declare these separately from the class.
     *
     * createMemberTypeDeclaration produces an if (false) statement containing property declarations, or
     * null if no declarations could or needed to be generated (e.g. no members, or an unnamed type).
     * The if statement is used to make sure the code is not executed, otherwise property accesses could
     * trigger getters on a superclass. See test_files/fields/fields.ts:BaseThatThrows.
     */
    function createMemberTypeDeclaration(mtt, typeDecl) {
        var e_3, _a, e_4, _b;
        // Gather parameter properties from the constructor, if it exists.
        var ctors = [];
        var paramProps = [];
        var nonStaticProps = [];
        var staticProps = [];
        var unhandled = [];
        var abstractMethods = [];
        try {
            for (var _c = __values(typeDecl.members), _d = _c.next(); !_d.done; _d = _c.next()) {
                var member = _d.value;
                if (member.kind === ts.SyntaxKind.Constructor) {
                    ctors.push(member);
                }
                else if (ts.isPropertyDeclaration(member) || ts.isPropertySignature(member)) {
                    var isStatic = transformerUtil.hasModifierFlag(member, ts.ModifierFlags.Static);
                    if (isStatic) {
                        staticProps.push(member);
                    }
                    else {
                        nonStaticProps.push(member);
                    }
                }
                else if (member.kind === ts.SyntaxKind.MethodDeclaration ||
                    member.kind === ts.SyntaxKind.MethodSignature ||
                    member.kind === ts.SyntaxKind.GetAccessor || member.kind === ts.SyntaxKind.SetAccessor) {
                    if (transformerUtil.hasModifierFlag(member, ts.ModifierFlags.Abstract) ||
                        ts.isInterfaceDeclaration(typeDecl)) {
                        abstractMethods.push(member);
                    }
                    // Non-abstract methods only exist on classes, and are handled in regular emit.
                }
                else {
                    unhandled.push(member);
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_3) throw e_3.error; }
        }
        if (ctors.length > 0) {
            // Only the actual constructor implementation, which must be last in a potential sequence of
            // overloaded constructors, may contain parameter properties.
            var ctor = ctors[ctors.length - 1];
            paramProps = ctor.parameters.filter(function (p) { return transformerUtil.hasModifierFlag(p, ts.ModifierFlags.ParameterPropertyModifier); });
        }
        if (nonStaticProps.length === 0 && paramProps.length === 0 && staticProps.length === 0 &&
            abstractMethods.length === 0) {
            // There are no members so we don't need to emit any type
            // annotations helper.
            return null;
        }
        if (!typeDecl.name) {
            mtt.debugWarn(typeDecl, 'cannot add types on unnamed declarations');
            return null;
        }
        var className = transformerUtil.getIdentifierText(typeDecl.name);
        var staticPropAccess = ts.createIdentifier(className);
        var instancePropAccess = ts.createPropertyAccess(staticPropAccess, 'prototype');
        // Closure Compiler will report conformance errors about this being unknown type when emitting
        // class properties as {?|undefined}, instead of just {?}. So make sure to only emit {?|undefined}
        // on interfaces.
        var isInterface = ts.isInterfaceDeclaration(typeDecl);
        var propertyDecls = staticProps.map(function (p) { return createClosurePropertyDeclaration(mtt, staticPropAccess, p, isInterface && !!p.questionToken); });
        propertyDecls.push.apply(propertyDecls, __spread(__spread(nonStaticProps, paramProps).map(function (p) { return createClosurePropertyDeclaration(mtt, instancePropAccess, p, isInterface && !!p.questionToken); })));
        propertyDecls.push.apply(propertyDecls, __spread(unhandled.map(function (p) { return transformerUtil.createMultiLineComment(p, "Skipping unhandled member: " + escapeForComment(p.getText())); })));
        try {
            for (var abstractMethods_1 = __values(abstractMethods), abstractMethods_1_1 = abstractMethods_1.next(); !abstractMethods_1_1.done; abstractMethods_1_1 = abstractMethods_1.next()) {
                var fnDecl = abstractMethods_1_1.value;
                var name_1 = propertyName(fnDecl);
                if (!name_1) {
                    mtt.error(fnDecl, 'anonymous abstract function');
                    continue;
                }
                var _e = mtt.getFunctionTypeJSDoc([fnDecl], []), tags = _e.tags, parameterNames = _e.parameterNames;
                if (decorators_1.hasExportingDecorator(fnDecl, mtt.typeChecker))
                    tags.push({ tagName: 'export' });
                // memberNamespace because abstract methods cannot be static in TypeScript.
                var abstractFnDecl = ts.createStatement(ts.createAssignment(ts.createPropertyAccess(instancePropAccess, name_1), ts.createFunctionExpression(
                /* modifiers */ undefined, 
                /* asterisk */ undefined, 
                /* name */ undefined, 
                /* typeParameters */ undefined, parameterNames.map(function (n) { return ts.createParameter(
                /* decorators */ undefined, /* modifiers */ undefined, 
                /* dotDotDot */ undefined, n); }), undefined, ts.createBlock([]))));
                ts.setSyntheticLeadingComments(abstractFnDecl, [jsdoc.toSynthesizedComment(tags)]);
                propertyDecls.push(ts.setSourceMapRange(abstractFnDecl, fnDecl));
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (abstractMethods_1_1 && !abstractMethods_1_1.done && (_b = abstractMethods_1.return)) _b.call(abstractMethods_1);
            }
            finally { if (e_4) throw e_4.error; }
        }
        // See test_files/fields/fields.ts:BaseThatThrows for a note on this wrapper.
        return ts.createIf(ts.createLiteral(false), ts.createBlock(propertyDecls, true));
    }
    function propertyName(prop) {
        if (!prop.name)
            return null;
        switch (prop.name.kind) {
            case ts.SyntaxKind.Identifier:
                return transformerUtil.getIdentifierText(prop.name);
            case ts.SyntaxKind.StringLiteral:
                // E.g. interface Foo { 'bar': number; }
                // If 'bar' is a name that is not valid in Closure then there's nothing we can do.
                var text = prop.name.text;
                if (!type_translator_1.isValidClosurePropertyName(text))
                    return null;
                return text;
            default:
                return null;
        }
    }
    /** Removes comment metacharacters from a string, to make it safe to embed in a comment. */
    function escapeForComment(str) {
        return str.replace(/\/\*/g, '__').replace(/\*\//g, '__');
    }
    exports.escapeForComment = escapeForComment;
    function createClosurePropertyDeclaration(mtt, expr, prop, optional) {
        var name = propertyName(prop);
        if (!name) {
            mtt.debugWarn(prop, "handle unnamed member:\n" + escapeForComment(prop.getText()));
            return transformerUtil.createMultiLineComment(prop, "Skipping unnamed member:\n" + escapeForComment(prop.getText()));
        }
        var type = mtt.typeToClosure(prop);
        // When a property is optional, e.g.
        //   foo?: string;
        // Then the TypeScript type of the property is string|undefined, the
        // typeToClosure translation handles it correctly, and string|undefined is
        // how you write an optional property in Closure.
        //
        // But in the special case of an optional property with type any:
        //   foo?: any;
        // The TypeScript type of the property is just "any" (because any includes
        // undefined as well) so our default translation of the type is just "?".
        // To mark the property as optional in Closure it must have "|undefined",
        // so the Closure type must be ?|undefined.
        if (optional && type === '?')
            type += '|undefined';
        var tags = mtt.getJSDoc(prop, /* reportWarnings */ true);
        tags.push({ tagName: 'type', type: type });
        var flags = ts.getCombinedModifierFlags(prop);
        if (flags & ts.ModifierFlags.Protected) {
            tags.push({ tagName: 'protected' });
        }
        else if (flags & ts.ModifierFlags.Private) {
            tags.push({ tagName: 'private' });
        }
        if (decorators_1.hasExportingDecorator(prop, mtt.typeChecker)) {
            tags.push({ tagName: 'export' });
        }
        var declStmt = ts.setSourceMapRange(ts.createStatement(ts.createPropertyAccess(expr, name)), prop);
        // Avoid printing annotations that can conflict with @type
        // This avoids Closure's error "type annotation incompatible with other annotations"
        addCommentOn(declStmt, tags, jsdoc.TAGS_CONFLICTING_WITH_TYPE);
        return declStmt;
    }
    /**
     * Removes any type assertions and non-null expressions from the AST before TypeScript processing.
     *
     * Ideally, the code in jsdoc_transformer below should just remove the cast expression and
     * replace it with the Closure equivalent. However Angular's compiler is fragile to AST
     * nodes being removed or changing type, so the code must retain the type assertion
     * expression, see: https://github.com/angular/angular/issues/24895.
     *
     * tsickle also cannot just generate and keep a `(/.. @type {SomeType} ./ (expr as SomeType))`
     * because TypeScript removes the parenthesized expressions in that syntax, (reasonably) believing
     * they were only added for the TS cast.
     *
     * The final workaround is then to keep the TypeScript type assertions, and have a post-Angular
     * processing step that removes the assertions before TypeScript sees them.
     *
     * TODO(martinprobst): remove once the Angular issue is fixed.
     */
    function removeTypeAssertions() {
        return function (context) {
            return function (sourceFile) {
                function visitor(node) {
                    switch (node.kind) {
                        case ts.SyntaxKind.TypeAssertionExpression:
                        case ts.SyntaxKind.AsExpression:
                            return ts.visitNode(node.expression, visitor);
                        case ts.SyntaxKind.NonNullExpression:
                            return ts.visitNode(node.expression, visitor);
                        default:
                            break;
                    }
                    return ts.visitEachChild(node, visitor, context);
                }
                return visitor(sourceFile);
            };
        };
    }
    exports.removeTypeAssertions = removeTypeAssertions;
    /**
     * jsdocTransformer returns a transformer factory that converts TypeScript types into the equivalent
     * JSDoc annotations.
     */
    function jsdocTransformer(host, tsOptions, moduleResolutionHost, typeChecker, diagnostics) {
        return function (context) {
            return function (sourceFile) {
                var moduleTypeTranslator = new module_type_translator_1.ModuleTypeTranslator(sourceFile, typeChecker, host, diagnostics, /*isForExterns*/ false);
                /**
                 * The set of all names exported from an export * in the current module. Used to prevent
                 * emitting duplicated exports. The first export * takes precedence in ES6.
                 */
                var expandedStarImports = new Set();
                /**
                 * While Closure compiler supports parameterized types, including parameterized `this` on
                 * methods, it does not support constraints on them. That means that an `\@template`d type is
                 * always considered to be `unknown` within the method, including `THIS`.
                 *
                 * To help Closure Compiler, we keep track of any templated this return type, and substitute
                 * explicit casts to the templated type.
                 *
                 * This is an incomplete solution and works around a specific problem with warnings on unknown
                 * this accesses. More generally, Closure also cannot infer constraints for any other
                 * templated types, but that might require a more general solution in Closure Compiler.
                 */
                var contextThisType = null;
                function visitClassDeclaration(classDecl) {
                    var contextThisTypeBackup = contextThisType;
                    var mjsdoc = moduleTypeTranslator.getMutableJSDoc(classDecl);
                    if (transformerUtil.hasModifierFlag(classDecl, ts.ModifierFlags.Abstract)) {
                        mjsdoc.tags.push({ tagName: 'abstract' });
                    }
                    maybeAddTemplateClause(mjsdoc.tags, classDecl);
                    if (!host.untyped) {
                        maybeAddHeritageClauses(mjsdoc.tags, moduleTypeTranslator, classDecl);
                    }
                    mjsdoc.updateComment();
                    var decls = [];
                    var memberDecl = createMemberTypeDeclaration(moduleTypeTranslator, classDecl);
                    // WARNING: order is significant; we must create the member decl before transforming away
                    // parameter property comments when visiting the constructor.
                    decls.push(ts.visitEachChild(classDecl, visitor, context));
                    if (memberDecl)
                        decls.push(memberDecl);
                    contextThisType = contextThisTypeBackup;
                    return decls;
                }
                /**
                 * visitHeritageClause works around a Closure Compiler issue, where the expression in an
                 * "extends" clause must be a simple identifier, and in particular must not be a parenthesized
                 * expression.
                 *
                 * This is triggered when TS code writes "class X extends (Foo as Bar) { ... }", commonly done
                 * to support mixins. For extends clauses in classes, the code below drops the cast and any
                 * parentheticals, leaving just the original expression.
                 *
                 * This is an incomplete workaround, as Closure will still bail on other super expressions,
                 * but retains compatibility with the previous emit that (accidentally) dropped the cast
                 * expression.
                 *
                 * TODO(martinprobst): remove this once the Closure side issue has been resolved.
                 */
                function visitHeritageClause(heritageClause) {
                    if (heritageClause.token !== ts.SyntaxKind.ExtendsKeyword || !heritageClause.parent ||
                        heritageClause.parent.kind === ts.SyntaxKind.InterfaceDeclaration) {
                        return ts.visitEachChild(heritageClause, visitor, context);
                    }
                    if (heritageClause.types.length !== 1) {
                        moduleTypeTranslator.error(heritageClause, "expected exactly one type in class extension clause");
                    }
                    var type = heritageClause.types[0];
                    var expr = type.expression;
                    while (ts.isParenthesizedExpression(expr) || ts.isNonNullExpression(expr) ||
                        ts.isAssertionExpression(expr)) {
                        expr = expr.expression;
                    }
                    return ts.updateHeritageClause(heritageClause, [ts.updateExpressionWithTypeArguments(type, type.typeArguments || [], expr)]);
                }
                function visitInterfaceDeclaration(iface) {
                    var sym = typeChecker.getSymbolAtLocation(iface.name);
                    if (!sym) {
                        moduleTypeTranslator.error(iface, 'interface with no symbol');
                        return [];
                    }
                    // If this symbol is both a type and a value, we cannot emit both into Closure's
                    // single namespace.
                    if (sym.flags & ts.SymbolFlags.Value) {
                        moduleTypeTranslator.debugWarn(iface, "type/symbol conflict for " + sym.name + ", using {?} for now");
                        return [transformerUtil.createSingleLineComment(iface, 'WARNING: interface has both a type and a value, skipping emit')];
                    }
                    var tags = moduleTypeTranslator.getJSDoc(iface, /* reportWarnings */ true) || [];
                    tags.push({ tagName: 'record' });
                    maybeAddTemplateClause(tags, iface);
                    if (!host.untyped) {
                        maybeAddHeritageClauses(tags, moduleTypeTranslator, iface);
                    }
                    var name = transformerUtil.getIdentifierText(iface.name);
                    var modifiers = transformerUtil.hasModifierFlag(iface, ts.ModifierFlags.Export) ?
                        [ts.createToken(ts.SyntaxKind.ExportKeyword)] :
                        undefined;
                    var decl = ts.setSourceMapRange(ts.createFunctionDeclaration(
                    /* decorators */ undefined, modifiers, 
                    /* asterisk */ undefined, name, 
                    /* typeParameters */ undefined, 
                    /* parameters */ [], 
                    /* type */ undefined, 
                    /* body */ ts.createBlock([])), iface);
                    addCommentOn(decl, tags);
                    var memberDecl = createMemberTypeDeclaration(moduleTypeTranslator, iface);
                    return memberDecl ? [decl, memberDecl] : [decl];
                }
                /** Function declarations are emitted as they are, with only JSDoc added. */
                function visitFunctionLikeDeclaration(fnDecl) {
                    if (!fnDecl.body) {
                        // Two cases: abstract methods and overloaded methods/functions.
                        // Abstract methods are handled in emitTypeAnnotationsHandler.
                        // Overloads are union-ized into the shared type in FunctionType.
                        return ts.visitEachChild(fnDecl, visitor, context);
                    }
                    var extraTags = [];
                    if (decorators_1.hasExportingDecorator(fnDecl, typeChecker))
                        extraTags.push({ tagName: 'export' });
                    var _a = moduleTypeTranslator.getFunctionTypeJSDoc([fnDecl], extraTags), tags = _a.tags, thisReturnType = _a.thisReturnType;
                    var mjsdoc = moduleTypeTranslator.getMutableJSDoc(fnDecl);
                    mjsdoc.tags = tags;
                    mjsdoc.updateComment();
                    var contextThisTypeBackup = contextThisType;
                    // Arrow functions retain their context `this` type. All others reset the this type to
                    // either none (if not specified) or the type given in a fn(this: T, ...) declaration.
                    if (!ts.isArrowFunction(fnDecl))
                        contextThisType = thisReturnType;
                    var result = ts.visitEachChild(fnDecl, visitor, context);
                    contextThisType = contextThisTypeBackup;
                    return result;
                }
                /**
                 * In methods with a templated this type, adds explicit casts to accesses on this.
                 *
                 * @see contextThisType
                 */
                function visitThisExpression(node) {
                    if (!contextThisType)
                        return ts.visitEachChild(node, visitor, context);
                    return createClosureCast(node, node, contextThisType);
                }
                /**
                 * visitVariableStatement flattens variable declaration lists (`var a, b;` to `var a; var
                 * b;`), and attaches JSDoc comments to each variable. JSDoc comments preceding the
                 * original variable are attached to the first newly created one.
                 */
                function visitVariableStatement(varStmt) {
                    var e_5, _a;
                    var stmts = [];
                    // "const", "let", etc are stored in node flags on the declarationList.
                    var flags = ts.getCombinedNodeFlags(varStmt.declarationList);
                    var tags = moduleTypeTranslator.getJSDoc(varStmt, /* reportWarnings */ true);
                    var leading = ts.getSyntheticLeadingComments(varStmt);
                    if (leading) {
                        // Attach non-JSDoc comments to a not emitted statement.
                        var commentHolder = ts.createNotEmittedStatement(varStmt);
                        ts.setSyntheticLeadingComments(commentHolder, leading.filter(function (c) { return c.text[0] !== '*'; }));
                        stmts.push(commentHolder);
                    }
                    var declList = ts.visitNode(varStmt.declarationList, visitor);
                    try {
                        for (var _b = __values(declList.declarations), _c = _b.next(); !_c.done; _c = _b.next()) {
                            var decl = _c.value;
                            var localTags = [];
                            if (tags) {
                                // Add any tags and docs preceding the entire statement to the first variable.
                                localTags.push.apply(localTags, __spread(tags));
                                tags = null;
                            }
                            // Add an @type for plain identifiers, but not for bindings patterns (i.e. object or array
                            // destructuring) - those do not have a syntax in Closure.
                            if (ts.isIdentifier(decl.name)) {
                                // For variables that are initialized and use a blacklisted type, do not emit a type at
                                // all. Closure Compiler might be able to infer a better type from the initializer than
                                // the `?` the code below would emit.
                                // TODO(martinprobst): consider doing this for all types that get emitted as ?, not just
                                // for blacklisted ones.
                                var blackListedInitialized = !!decl.initializer && moduleTypeTranslator.isBlackListed(decl);
                                if (!blackListedInitialized) {
                                    // getOriginalNode(decl) is required because the type checker cannot type check
                                    // synthesized nodes.
                                    var typeStr = moduleTypeTranslator.typeToClosure(ts.getOriginalNode(decl));
                                    localTags.push({ tagName: 'type', type: typeStr });
                                }
                            }
                            var newStmt = ts.createVariableStatement(varStmt.modifiers, ts.createVariableDeclarationList([decl], flags));
                            if (localTags.length)
                                addCommentOn(newStmt, localTags, jsdoc.TAGS_CONFLICTING_WITH_TYPE);
                            stmts.push(newStmt);
                        }
                    }
                    catch (e_5_1) { e_5 = { error: e_5_1 }; }
                    finally {
                        try {
                            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                        }
                        finally { if (e_5) throw e_5.error; }
                    }
                    return stmts;
                }
                /**
                 * shouldEmitExportsAssignments returns true if tsickle should emit `exports.Foo = ...` style
                 * export statements.
                 *
                 * TypeScript modules can export types. Because types are pure design-time constructs in
                 * TypeScript, it does not emit any actual exported symbols for these. But tsickle has to emit
                 * an export, so that downstream Closure code (including tsickle-converted Closure code) can
                 * import upstream types. tsickle has to pick a module format for that, because the pure ES6
                 * export would get stripped by TypeScript.
                 *
                 * tsickle uses CommonJS to emit googmodule, and code not using googmodule doesn't care about
                 * the Closure annotations anyway, so tsickle skips emitting exports if the module target
                 * isn't commonjs.
                 */
                function shouldEmitExportsAssignments() {
                    return tsOptions.module === ts.ModuleKind.CommonJS;
                }
                function visitTypeAliasDeclaration(typeAlias) {
                    // If the type is also defined as a value, skip emitting it. Closure collapses type & value
                    // namespaces, the two emits would conflict if tsickle emitted both.
                    var sym = moduleTypeTranslator.mustGetSymbolAtLocation(typeAlias.name);
                    if (sym.flags & ts.SymbolFlags.Value)
                        return [];
                    // Type aliases are always emitted as the resolved underlying type, so there is no need to
                    // emit anything, except for exported types.
                    if (!transformerUtil.hasModifierFlag(typeAlias, ts.ModifierFlags.Export))
                        return [];
                    if (!shouldEmitExportsAssignments())
                        return [];
                    var typeName = typeAlias.name.getText();
                    // Blacklist any type parameters, Closure does not support type aliases with type
                    // parameters.
                    moduleTypeTranslator.newTypeTranslator(typeAlias).blacklistTypeParameters(moduleTypeTranslator.symbolsToAliasedNames, typeAlias.typeParameters);
                    var typeStr = host.untyped ? '?' : moduleTypeTranslator.typeToClosure(typeAlias, undefined);
                    // In the case of an export, we cannot emit a `export var foo;` because TypeScript drops
                    // exports that are never assigned values, and Closure requires us to not assign values to
                    // typedef exports. Introducing a new local variable and exporting it can cause bugs due to
                    // name shadowing and confusing TypeScript's logic on what symbols and types vs values are
                    // exported. Mangling the name to avoid the conflicts would be reasonably clean, but would
                    // require a two pass emit to first find all type alias names, mangle them, and emit the use
                    // sites only later. With that, the fix here is to never emit type aliases, but always
                    // resolve the alias and emit the underlying type (fixing references in the local module,
                    // and also across modules). For downstream JavaScript code that imports the typedef, we
                    // emit an "export.Foo;" that declares and exports the type, and for TypeScript has no
                    // impact.
                    var tags = moduleTypeTranslator.getJSDoc(typeAlias, /* reportWarnings */ true);
                    tags.push({ tagName: 'typedef', type: typeStr });
                    var decl = ts.setSourceMapRange(ts.createStatement(ts.createPropertyAccess(ts.createIdentifier('exports'), ts.createIdentifier(typeName))), typeAlias);
                    addCommentOn(decl, tags, jsdoc.TAGS_CONFLICTING_WITH_TYPE);
                    return [decl];
                }
                /** Emits a parenthesized Closure cast: `(/** \@type ... * / (expr))`. */
                function createClosureCast(context, expression, type) {
                    var inner = ts.createParen(expression);
                    var comment = addCommentOn(inner, [{ tagName: 'type', type: moduleTypeTranslator.typeToClosure(context, type) }]);
                    comment.hasTrailingNewLine = false;
                    return ts.setSourceMapRange(ts.createParen(inner), context);
                }
                /** Converts a TypeScript type assertion into a Closure Cast. */
                function visitAssertionExpression(assertion) {
                    var type = typeChecker.getTypeAtLocation(assertion.type);
                    return createClosureCast(assertion, ts.visitEachChild(assertion, visitor, context), type);
                }
                /**
                 * Converts a TypeScript non-null assertion into a Closure Cast, by stripping |null and
                 * |undefined from a union type.
                 */
                function visitNonNullExpression(nonNull) {
                    var type = typeChecker.getTypeAtLocation(nonNull.expression);
                    var nonNullType = typeChecker.getNonNullableType(type);
                    return createClosureCast(nonNull, ts.visitEachChild(nonNull, visitor, context), nonNullType);
                }
                function visitImportDeclaration(importDecl) {
                    // For each import, insert a goog.requireType for the module, so that if TypeScript does not
                    // emit the module because it's only used in type positions, the JSDoc comments still
                    // reference a valid Closure level symbol.
                    // No need to requireType side effect imports.
                    if (!importDecl.importClause)
                        return importDecl;
                    var sym = typeChecker.getSymbolAtLocation(importDecl.moduleSpecifier);
                    // Scripts do not have a symbol, and neither do unused modules. Scripts can still be
                    // imported, either as side effect imports or with an empty import set ("{}"). TypeScript
                    // does not emit a runtime load for an import with an empty list of symbols, but the import
                    // forces any global declarations from the library to be visible, which is what users use
                    // this for. No symbols from the script need requireType, so just return.
                    // TODO(evmar): revisit this.  If TS needs to see the module import, it's likely Closure
                    // does too.
                    if (!sym)
                        return importDecl;
                    var importPath = googmodule.resolveModuleName({ options: tsOptions, moduleResolutionHost: moduleResolutionHost }, sourceFile.fileName, importDecl.moduleSpecifier.text);
                    moduleTypeTranslator.requireType(importPath, sym, /* isExplicitlyImported? */ true, 
                    /* default import? */ !!importDecl.importClause.name);
                    return importDecl;
                }
                /**
                 * Closure Compiler will fail when it finds incorrect JSDoc tags on nodes. This function
                 * parses and then re-serializes JSDoc comments, escaping or removing illegal tags.
                 */
                function escapeIllegalJSDoc(node) {
                    var mjsdoc = moduleTypeTranslator.getMutableJSDoc(node);
                    mjsdoc.updateComment();
                }
                /** Returns true if a value export should be emitted for the given symbol in export *. */
                function shouldEmitValueExportForSymbol(sym) {
                    if (sym.flags & ts.SymbolFlags.Alias) {
                        sym = typeChecker.getAliasedSymbol(sym);
                    }
                    if ((sym.flags & ts.SymbolFlags.Value) === 0) {
                        // Note: We create explicit exports of type symbols for closure in visitExportDeclaration.
                        return false;
                    }
                    if (!tsOptions.preserveConstEnums && sym.flags & ts.SymbolFlags.ConstEnum) {
                        return false;
                    }
                    return true;
                }
                /**
                 * visitExportDeclaration requireTypes exported modules and emits explicit exports for
                 * types (which normally do not get emitted by TypeScript).
                 */
                function visitExportDeclaration(exportDecl) {
                    var e_6, _a, e_7, _b, e_8, _c;
                    var importedModuleSymbol = exportDecl.moduleSpecifier &&
                        typeChecker.getSymbolAtLocation(exportDecl.moduleSpecifier);
                    if (importedModuleSymbol) {
                        // requireType all explicitly imported modules, so that symbols can be referenced and
                        // type only modules are usable from type declarations.
                        moduleTypeTranslator.requireType(exportDecl.moduleSpecifier.text, importedModuleSymbol, 
                        /* isExplicitlyImported? */ true, /* default import? */ false);
                    }
                    var typesToExport = [];
                    if (!exportDecl.exportClause) {
                        // export * from '...'
                        // Resolve the * into all value symbols exported, and update the export declaration.
                        // Explicitly spelled out exports (i.e. the exports of the current module) take precedence
                        // over implicit ones from export *. Use the current module's exports to filter.
                        var currentModuleSymbol = typeChecker.getSymbolAtLocation(sourceFile);
                        var currentModuleExports = currentModuleSymbol && currentModuleSymbol.exports;
                        if (!importedModuleSymbol) {
                            moduleTypeTranslator.error(exportDecl, "export * without module symbol");
                            return exportDecl;
                        }
                        var exportedSymbols = typeChecker.getExportsOfModule(importedModuleSymbol);
                        var exportSpecifiers = [];
                        try {
                            for (var exportedSymbols_1 = __values(exportedSymbols), exportedSymbols_1_1 = exportedSymbols_1.next(); !exportedSymbols_1_1.done; exportedSymbols_1_1 = exportedSymbols_1.next()) {
                                var sym = exportedSymbols_1_1.value;
                                if (currentModuleExports && currentModuleExports.has(sym.escapedName))
                                    continue;
                                // We might have already generated an export for the given symbol.
                                if (expandedStarImports.has(sym.name))
                                    continue;
                                expandedStarImports.add(sym.name);
                                // Only create an export specifier for values that are exported. For types, the code
                                // below creates specific export statements that match Closure's expectations.
                                if (shouldEmitValueExportForSymbol(sym)) {
                                    exportSpecifiers.push(ts.createExportSpecifier(undefined, sym.name));
                                }
                                else {
                                    typesToExport.push([sym.name, sym]);
                                }
                            }
                        }
                        catch (e_6_1) { e_6 = { error: e_6_1 }; }
                        finally {
                            try {
                                if (exportedSymbols_1_1 && !exportedSymbols_1_1.done && (_a = exportedSymbols_1.return)) _a.call(exportedSymbols_1);
                            }
                            finally { if (e_6) throw e_6.error; }
                        }
                        exportDecl = ts.updateExportDeclaration(exportDecl, exportDecl.decorators, exportDecl.modifiers, ts.createNamedExports(exportSpecifiers), exportDecl.moduleSpecifier);
                    }
                    else {
                        try {
                            for (var _d = __values(exportDecl.exportClause.elements), _e = _d.next(); !_e.done; _e = _d.next()) {
                                var exp = _e.value;
                                var exportedName = transformerUtil.getIdentifierText(exp.name);
                                typesToExport.push([exportedName, moduleTypeTranslator.mustGetSymbolAtLocation(exp.name)]);
                            }
                        }
                        catch (e_7_1) { e_7 = { error: e_7_1 }; }
                        finally {
                            try {
                                if (_e && !_e.done && (_b = _d.return)) _b.call(_d);
                            }
                            finally { if (e_7) throw e_7.error; }
                        }
                    }
                    // Do not emit typedef re-exports in untyped mode.
                    if (host.untyped)
                        return exportDecl;
                    var result = [exportDecl];
                    try {
                        for (var typesToExport_1 = __values(typesToExport), typesToExport_1_1 = typesToExport_1.next(); !typesToExport_1_1.done; typesToExport_1_1 = typesToExport_1.next()) {
                            var _f = __read(typesToExport_1_1.value, 2), exportedName = _f[0], sym = _f[1];
                            var aliasedSymbol = sym;
                            if (sym.flags & ts.SymbolFlags.Alias) {
                                aliasedSymbol = typeChecker.getAliasedSymbol(sym);
                            }
                            var isTypeAlias = (aliasedSymbol.flags & ts.SymbolFlags.Value) === 0 &&
                                (aliasedSymbol.flags & (ts.SymbolFlags.TypeAlias | ts.SymbolFlags.Interface)) !== 0;
                            if (!isTypeAlias)
                                continue;
                            var typeName = moduleTypeTranslator.symbolsToAliasedNames.get(aliasedSymbol) || aliasedSymbol.name;
                            var stmt = ts.createStatement(ts.createPropertyAccess(ts.createIdentifier('exports'), exportedName));
                            addCommentOn(stmt, [{ tagName: 'typedef', type: '!' + typeName }]);
                            ts.addSyntheticTrailingComment(stmt, ts.SyntaxKind.SingleLineCommentTrivia, ' re-export typedef', true);
                            result.push(stmt);
                        }
                    }
                    catch (e_8_1) { e_8 = { error: e_8_1 }; }
                    finally {
                        try {
                            if (typesToExport_1_1 && !typesToExport_1_1.done && (_c = typesToExport_1.return)) _c.call(typesToExport_1);
                        }
                        finally { if (e_8) throw e_8.error; }
                    }
                    return result;
                }
                /**
                 * Returns the identifiers exported in a single exported statement - typically just one
                 * identifier (e.g. for `export function foo()`), but multiple for `export declare var a, b`.
                 */
                function getExportDeclarationNames(node) {
                    switch (node.kind) {
                        case ts.SyntaxKind.VariableStatement:
                            var varDecl = node;
                            return varDecl.declarationList.declarations.map(function (d) { return getExportDeclarationNames(d)[0]; });
                        case ts.SyntaxKind.VariableDeclaration:
                        case ts.SyntaxKind.FunctionDeclaration:
                        case ts.SyntaxKind.InterfaceDeclaration:
                        case ts.SyntaxKind.ClassDeclaration:
                        case ts.SyntaxKind.ModuleDeclaration:
                        case ts.SyntaxKind.EnumDeclaration:
                            var decl = node;
                            if (!decl.name || decl.name.kind !== ts.SyntaxKind.Identifier) {
                                break;
                            }
                            return [decl.name];
                        case ts.SyntaxKind.TypeAliasDeclaration:
                            var typeAlias = node;
                            return [typeAlias.name];
                        default:
                            break;
                    }
                    moduleTypeTranslator.error(node, "unsupported export declaration " + ts.SyntaxKind[node.kind] + ": " + node.getText());
                    return [];
                }
                /**
                 * Ambient declarations declare types for TypeScript's benefit, and will be removede by
                 * TypeScript during its emit phase. Downstream Closure code however might be importing
                 * symbols from this module, so tsickle must emit a Closure-compatible exports declaration.
                 */
                function visitExportedAmbient(node) {
                    var e_9, _a;
                    if (host.untyped || !shouldEmitExportsAssignments())
                        return [node];
                    var declNames = getExportDeclarationNames(node);
                    var result = [node];
                    try {
                        for (var declNames_1 = __values(declNames), declNames_1_1 = declNames_1.next(); !declNames_1_1.done; declNames_1_1 = declNames_1.next()) {
                            var decl = declNames_1_1.value;
                            var sym = typeChecker.getSymbolAtLocation(decl);
                            var isValue = sym.flags & ts.SymbolFlags.Value;
                            // Non-value objects do not exist at runtime, so we cannot access the symbol (it only
                            // exists in externs). Export them as a typedef, which forwards to the type in externs.
                            // Note: TypeScript emits odd code for exported ambients (exports.x for variables, just x
                            // for everything else). That seems buggy, and in either case this code should not attempt
                            // to fix it.
                            // See also https://github.com/Microsoft/TypeScript/issues/8015.
                            if (!isValue) {
                                // Do not emit re-exports for ModuleDeclarations.
                                // Ambient ModuleDeclarations are always referenced as global symbols, so they don't
                                // need to be exported.
                                if (node.kind === ts.SyntaxKind.ModuleDeclaration)
                                    continue;
                                var mangledName = annotator_host_1.moduleNameAsIdentifier(host, sourceFile.fileName);
                                var declName = transformerUtil.getIdentifierText(decl);
                                var stmt = ts.createStatement(ts.createPropertyAccess(ts.createIdentifier('exports'), declName));
                                addCommentOn(stmt, [{ tagName: 'typedef', type: "!" + mangledName + "." + declName }]);
                                result.push(stmt);
                            }
                        }
                    }
                    catch (e_9_1) { e_9 = { error: e_9_1 }; }
                    finally {
                        try {
                            if (declNames_1_1 && !declNames_1_1.done && (_a = declNames_1.return)) _a.call(declNames_1);
                        }
                        finally { if (e_9) throw e_9.error; }
                    }
                    return result;
                }
                function visitor(node) {
                    if (transformerUtil.isAmbient(node)) {
                        if (!transformerUtil.hasModifierFlag(node, ts.ModifierFlags.Export)) {
                            return node;
                        }
                        return visitExportedAmbient(node);
                    }
                    switch (node.kind) {
                        case ts.SyntaxKind.ImportDeclaration:
                            return visitImportDeclaration(node);
                        case ts.SyntaxKind.ExportDeclaration:
                            return visitExportDeclaration(node);
                        case ts.SyntaxKind.ClassDeclaration:
                            return visitClassDeclaration(node);
                        case ts.SyntaxKind.InterfaceDeclaration:
                            return visitInterfaceDeclaration(node);
                        case ts.SyntaxKind.HeritageClause:
                            return visitHeritageClause(node);
                        case ts.SyntaxKind.ArrowFunction:
                        case ts.SyntaxKind.FunctionExpression:
                            // Inserting a comment before an expression can trigger automatic semicolon insertion,
                            // e.g. if the function below is the expression in a `return` statement. Parenthesizing
                            // prevents ASI, as long as the opening paren remains on the same line (which it does).
                            return ts.createParen(visitFunctionLikeDeclaration(node));
                        case ts.SyntaxKind.Constructor:
                        case ts.SyntaxKind.FunctionDeclaration:
                        case ts.SyntaxKind.MethodDeclaration:
                        case ts.SyntaxKind.GetAccessor:
                        case ts.SyntaxKind.SetAccessor:
                            return visitFunctionLikeDeclaration(node);
                        case ts.SyntaxKind.ThisKeyword:
                            return visitThisExpression(node);
                        case ts.SyntaxKind.VariableStatement:
                            return visitVariableStatement(node);
                        case ts.SyntaxKind.PropertyDeclaration:
                        case ts.SyntaxKind.PropertyAssignment:
                            escapeIllegalJSDoc(node);
                            break;
                        case ts.SyntaxKind.Parameter:
                            // Parameter properties (e.g. `constructor(/** docs */ private foo: string)`) might have
                            // JSDoc comments, including JSDoc tags recognized by Closure Compiler. Prevent emitting
                            // any comments on them, so that Closure doesn't error on them.
                            // See test_files/parameter_properties.ts.
                            var paramDecl = node;
                            if (transformerUtil.hasModifierFlag(paramDecl, ts.ModifierFlags.ParameterPropertyModifier)) {
                                ts.setSyntheticLeadingComments(paramDecl, []);
                                jsdoc.suppressLeadingCommentsRecursively(paramDecl);
                            }
                            break;
                        case ts.SyntaxKind.TypeAliasDeclaration:
                            return visitTypeAliasDeclaration(node);
                        case ts.SyntaxKind.AsExpression:
                        case ts.SyntaxKind.TypeAssertionExpression:
                            return visitAssertionExpression(node);
                        case ts.SyntaxKind.NonNullExpression:
                            return visitNonNullExpression(node);
                        default:
                            break;
                    }
                    return ts.visitEachChild(node, visitor, context);
                }
                sourceFile = ts.visitEachChild(sourceFile, visitor, context);
                return moduleTypeTranslator.insertAdditionalImports(sourceFile);
            };
        };
    }
    exports.jsdocTransformer = jsdocTransformer;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNkb2NfdHJhbnNmb3JtZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvanNkb2NfdHJhbnNmb3JtZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFFSDs7Ozs7Ozs7Ozs7Ozs7Ozs7O09Ba0JHO0lBRUgsK0JBQWlDO0lBRWpDLDZEQUF1RTtJQUN2RSxxREFBbUQ7SUFDbkQsbURBQTJDO0lBQzNDLHlDQUFpQztJQUNqQyw2RUFBOEQ7SUFDOUQsOERBQXNEO0lBQ3RELCtEQUE2RDtJQUU3RCxTQUFTLFlBQVksQ0FBQyxJQUFhLEVBQUUsSUFBaUIsRUFBRSxlQUE2QjtRQUNuRixJQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsb0JBQW9CLENBQUMsSUFBSSxFQUFFLGVBQWUsQ0FBQyxDQUFDO1FBQ2xFLElBQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQywyQkFBMkIsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDNUQsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN2QixFQUFFLENBQUMsMkJBQTJCLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQy9DLE9BQU8sT0FBTyxDQUFDO0lBQ2pCLENBQUM7SUFLRCx3RUFBd0U7SUFDeEUsU0FBZ0Isc0JBQXNCLENBQUMsT0FBb0IsRUFBRSxJQUF1QjtRQUNsRixJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWM7WUFBRSxPQUFPO1FBQ2pDLHdGQUF3RjtRQUN4RixPQUFPLENBQUMsSUFBSSxDQUFDO1lBQ1gsT0FBTyxFQUFFLFVBQVU7WUFDbkIsSUFBSSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLFVBQUEsRUFBRSxJQUFJLE9BQUEsZUFBZSxDQUFDLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBMUMsQ0FB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LENBQUMsb0JBQW9COzRCQUNyQyxPQUFPLHlCQUF5QixDQUFDLElBQStCLENBQUMsQ0FBQzt3QkFDcEUsS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQzt3QkFDaEMsS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLHVCQUF1Qjs0QkFDeEMsT0FBTyx3QkFBd0IsQ0FBQyxJQUF3QixDQUFDLENBQUM7d0JBQzVELEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxpQkFBaUI7NEJBQ2xDLE9BQU8sc0JBQXNCLENBQUMsSUFBNEIsQ0FBQyxDQUFDO3dCQUM5RDs0QkFDRSxNQUFNO3FCQUNUO29CQUNELE9BQU8sRUFBRSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUNuRCxDQUFDO2dCQUVELFVBQVUsR0FBRyxFQUFFLENBQUMsY0FBYyxDQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7Z0JBRTdELE9BQU8sb0JBQW9CLENBQUMsdUJBQXVCLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDbEUsQ0FBQyxDQUFDO1FBQ0osQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQXZqQkQsNENBdWpCQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IGpzZG9jX3RyYW5zZm9ybWVyIGNvbnRhaW5zIHRoZSBsb2dpYyB0byBhZGQgSlNEb2MgY29tbWVudHMgdG8gVHlwZVNjcmlwdCBjb2RlLlxuICpcbiAqIE9uZSBvZiB0c2lja2xlJ3MgZmVhdHVyZXMgaXMgdG8gYWRkIENsb3N1cmUgQ29tcGlsZXIgY29tcGF0aWJsZSBKU0RvYyBjb21tZW50cyBjb250YWluaW5nIHR5cGVcbiAqIGFubm90YXRpb25zLCBpbmhlcml0YW5jZSBpbmZvcm1hdGlvbiwgZXRjLiwgb250byBUeXBlU2NyaXB0IGNvZGUuIFRoaXMgYWxsb3dzIENsb3N1cmUgQ29tcGlsZXIgdG9cbiAqIG1ha2UgYmV0dGVyIG9wdGltaXphdGlvbiBkZWNpc2lvbnMgY29tcGFyZWQgdG8gYW4gdW50eXBlZCBjb2RlIGJhc2UuXG4gKlxuICogVGhlIGVudHJ5IHBvaW50IHRvIHRoZSBhbm5vdGF0aW9uIG9wZXJhdGlvbiBpcyBqc2RvY1RyYW5zZm9ybWVyIGJlbG93LiBJdCBhZGRzIHN5bnRoZXRpYyBjb21tZW50c1xuICogdG8gZXhpc3RpbmcgVHlwZVNjcmlwdCBjb25zdHJ1Y3RzLCBmb3IgZXhhbXBsZTpcbiAqICAgICBjb25zdCB4OiBudW1iZXIgPSAxO1xuICogTWlnaHQgZ2V0IHRyYW5zZm9ybWVkIHRvOlxuICogICAgIC8uLiBcXEB0eXBlIHtudW1iZXJ9IC4vXG4gKiAgICAgY29uc3QgeDogbnVtYmVyID0gMTtcbiAqIExhdGVyIFR5cGVTY3JpcHQgcGhhc2VzIHRoZW4gcmVtb3ZlIHRoZSB0eXBlIGFubm90YXRpb24sIGFuZCB0aGUgZmluYWwgZW1pdCBpcyBKYXZhU2NyaXB0IHRoYXRcbiAqIG9ubHkgY29udGFpbnMgdGhlIEpTRG9jIGNvbW1lbnQuXG4gKlxuICogVG8gaGFuZGxlIGNlcnRhaW4gY29uc3RydWN0cywgdGhpcyB0cmFuc2Zvcm1lciBhbHNvIHBlcmZvcm1zIEFTVCB0cmFuc2Zvcm1hdGlvbnMsIGUuZy4gYnkgYWRkaW5nXG4gKiBDb21tb25KUy1zdHlsZSBleHBvcnRzIGZvciB0eXBlIGNvbnN0cnVjdHMsIGV4cGFuZGluZyBgZXhwb3J0ICpgLCBwYXJlbnRoZXNpemluZyBjYXN0cywgZXRjLlxuICovXG5cbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuXG5pbXBvcnQge0Fubm90YXRvckhvc3QsIG1vZHVsZU5hbWVBc0lkZW50aWZpZXJ9IGZyb20gJy4vYW5ub3RhdG9yX2hvc3QnO1xuaW1wb3J0IHtoYXNFeHBvcnRpbmdEZWNvcmF0b3J9IGZyb20gJy4vZGVjb3JhdG9ycyc7XG5pbXBvcnQgKiBhcyBnb29nbW9kdWxlIGZyb20gJy4vZ29vZ21vZHVsZSc7XG5pbXBvcnQgKiBhcyBqc2RvYyBmcm9tICcuL2pzZG9jJztcbmltcG9ydCB7TW9kdWxlVHlwZVRyYW5zbGF0b3J9IGZyb20gJy4vbW9kdWxlX3R5cGVfdHJhbnNsYXRvcic7XG5pbXBvcnQgKiBhcyB0cmFuc2Zvcm1lclV0aWwgZnJvbSAnLi90cmFuc2Zvcm1lcl91dGlsJztcbmltcG9ydCB7aXNWYWxpZENsb3N1cmVQcm9wZXJ0eU5hbWV9IGZyb20gJy4vdHlwZV90cmFuc2xhdG9yJztcblxuZnVuY3Rpb24gYWRkQ29tbWVudE9uKG5vZGU6IHRzLk5vZGUsIHRhZ3M6IGpzZG9jLlRhZ1tdLCBlc2NhcGVFeHRyYVRhZ3M/OiBTZXQ8c3RyaW5nPikge1xuICBjb25zdCBjb21tZW50ID0ganNkb2MudG9TeW50aGVzaXplZENvbW1lbnQodGFncywgZXNjYXBlRXh0cmFUYWdzKTtcbiAgY29uc3QgY29tbWVudHMgPSB0cy5nZXRTeW50aGV0aWNMZWFkaW5nQ29tbWVudHMobm9kZSkgfHwgW107XG4gIGNvbW1lbnRzLnB1c2goY29tbWVudCk7XG4gIHRzLnNldFN5bnRoZXRpY0xlYWRpbmdDb21tZW50cyhub2RlLCBjb21tZW50cyk7XG4gIHJldHVybiBjb21tZW50O1xufVxuXG50eXBlIEhhc1R5cGVQYXJhbWV0ZXJzID1cbiAgICB0cy5JbnRlcmZhY2VEZWNsYXJhdGlvbnx0cy5DbGFzc0xpa2VEZWNsYXJhdGlvbnx0cy5UeXBlQWxpYXNEZWNsYXJhdGlvbnx0cy5TaWduYXR1cmVEZWNsYXJhdGlvbjtcblxuLyoqIEFkZHMgYW4gXFxAdGVtcGxhdGUgY2xhdXNlIHRvIGRvY1RhZ3MgaWYgZGVjbCBoYXMgdHlwZSBwYXJhbWV0ZXJzLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1heWJlQWRkVGVtcGxhdGVDbGF1c2UoZG9jVGFnczoganNkb2MuVGFnW10sIGRlY2w6IEhhc1R5cGVQYXJhbWV0ZXJzKSB7XG4gIGlmICghZGVjbC50eXBlUGFyYW1ldGVycykgcmV0dXJuO1xuICAvLyBDbG9zdXJlIGRvZXMgbm90IHN1cHBvcnQgdGVtcGxhdGUgY29uc3RyYWludHMgKFQgZXh0ZW5kcyBYKSwgdGhlc2UgYXJlIGlnbm9yZWQgYmVsb3cuXG4gIGRvY1RhZ3MucHVzaCh7XG4gICAgdGFnTmFtZTogJ3RlbXBsYXRlJyxcbiAgICB0ZXh0OiBkZWNsLnR5cGVQYXJhbWV0ZXJzLm1hcCh0cCA9PiB0cmFuc2Zvcm1lclV0aWwuZ2V0SWRlbnRpZmllclRleHQodHAubmFtZSkpLmpvaW4oJywgJylcbiAgfSk7XG59XG5cbi8qKlxuICogQWRkcyBoZXJpdGFnZSBjbGF1c2VzIChcXEBleHRlbmRzLCBcXEBpbXBsZW1lbnRzKSB0byB0aGUgZ2l2ZW4gZG9jVGFncyBmb3IgZGVjbC4gVXNlZCBieVxuICoganNkb2NfdHJhbnNmb3JtZXIgYW5kIGV4dGVybnMgZ2VuZXJhdGlvbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1heWJlQWRkSGVyaXRhZ2VDbGF1c2VzKFxuICAgIGRvY1RhZ3M6IGpzZG9jLlRhZ1tdLCBtdHQ6IE1vZHVsZVR5cGVUcmFuc2xhdG9yLFxuICAgIGRlY2w6IHRzLkNsYXNzTGlrZURlY2xhcmF0aW9ufHRzLkludGVyZmFjZURlY2xhcmF0aW9uKSB7XG4gIGlmICghZGVjbC5oZXJpdGFnZUNsYXVzZXMpIHJldHVybjtcbiAgY29uc3QgaXNDbGFzcyA9IGRlY2wua2luZCA9PT0gdHMuU3ludGF4S2luZC5DbGFzc0RlY2xhcmF0aW9uO1xuICBjb25zdCBoYXNFeHRlbmRzID0gZGVjbC5oZXJpdGFnZUNsYXVzZXMuc29tZShjID0+IGMudG9rZW4gPT09IHRzLlN5bnRheEtpbmQuRXh0ZW5kc0tleXdvcmQpO1xuICBmb3IgKGNvbnN0IGhlcml0YWdlIG9mIGRlY2wuaGVyaXRhZ2VDbGF1c2VzKSB7XG4gICAgY29uc3QgaXNFeHRlbmRzID0gaGVyaXRhZ2UudG9rZW4gPT09IHRzLlN5bnRheEtpbmQuRXh0ZW5kc0tleXdvcmQ7XG4gICAgaWYgKGlzQ2xhc3MgJiYgaXNFeHRlbmRzKSB7XG4gICAgICAvLyBJZiBhIGNsYXNzIGhhcyBhbiBcImV4dGVuZHNcIiwgdGhhdCBpcyBwcmVzZXJ2ZWQgaW4gdGhlIEVTNiBvdXRwdXRcbiAgICAgIC8vIGFuZCB3ZSBkb24ndCBuZWVkIHRvIGVtaXQgYW55IGFkZGl0aW9uYWwganNkb2MuXG4gICAgICAvL1xuICAgICAgLy8gSG93ZXZlciBmb3IgYW1iaWVudCBkZWNsYXJhdGlvbnMsIHdlIG9ubHkgZW1pdCBleHRlcm5zLCBhbmQgaW4gdGhvc2Ugd2UgZG8gbmVlZCB0b1xuICAgICAgLy8gYWRkIFwiQGV4dGVuZHMge0Zvb31cIiBhcyB0aGV5IHVzZSBFUzUgc3ludGF4LlxuICAgICAgaWYgKCF0cmFuc2Zvcm1lclV0aWwuaXNBbWJpZW50KGRlY2wpKSBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyBPdGhlcndpc2UsIGlmIHdlIGdldCBoZXJlLCB3ZSBuZWVkIHRvIGVtaXQgc29tZSBqc2RvYy5cbiAgICBmb3IgKGNvbnN0IGV4cHIgb2YgaGVyaXRhZ2UudHlwZXMpIHtcbiAgICAgIGNvbnN0IGhlcml0YWdlID0gaGVyaXRhZ2VOYW1lKGlzRXh0ZW5kcywgaGFzRXh0ZW5kcywgZXhwcik7XG4gICAgICAvLyBoZXJpdGFnZU5hbWUgbWF5IHJldHVybiBudWxsLCBpbmRpY2F0aW5nIHRoYXQgdGhlIGNsYXVzZSBpcyBzb21ldGhpbmcgaW5leHByZXNzaWJsZVxuICAgICAgLy8gaW4gQ2xvc3VyZSwgZS5nLiBcImNsYXNzIEZvbyBpbXBsZW1lbnRzIFBhcnRpYWw8QmFyPlwiLlxuICAgICAgaWYgKGhlcml0YWdlKSB7XG4gICAgICAgIGRvY1RhZ3MucHVzaCh7XG4gICAgICAgICAgdGFnTmFtZTogaGVyaXRhZ2UudGFnTmFtZSxcbiAgICAgICAgICB0eXBlOiBoZXJpdGFnZS5wYXJlbnROYW1lLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ29tcHV0ZXMgdGhlIENsb3N1cmUgbmFtZSBvZiBhbiBleHByZXNzaW9uIG9jY3VycmluZyBpbiBhIGhlcml0YWdlIGNsYXVzZSxcbiAgICogZS5nLiBcImltcGxlbWVudHMgRm9vQmFyXCIuICBXaWxsIHJldHVybiBudWxsIGlmIHRoZSBleHByZXNzaW9uIGlzIGluZXhwcmVzc2libGVcbiAgICogaW4gQ2xvc3VyZSBzZW1hbnRpY3MuICBOb3RlIHRoYXQgd2UgZG9uJ3QgbmVlZCB0byBjb25zaWRlciBhbGwgcG9zc2libGVcbiAgICogY29tYmluYXRpb25zIG9mIHR5cGVzL3ZhbHVlcyBhbmQgZXh0ZW5kcy9pbXBsZW1lbnRzIGJlY2F1c2Ugb3VyIGlucHV0IGlzXG4gICAqIGFscmVhZHkgdmVyaWZpZWQgdG8gYmUgdmFsaWQgVHlwZVNjcmlwdC4gIFNlZSB0ZXN0X2ZpbGVzL2NsYXNzLyBmb3IgdGhlIGZ1bGxcbiAgICogY2FydGVzaWFuIHByb2R1Y3Qgb2YgdGVzdCBjYXNlcy5cbiAgICogQHBhcmFtIGlzRXh0ZW5kcyBUcnVlIGlmIHdlJ3JlIGluIGFuICdleHRlbmRzJywgZmFsc2UgaW4gYW4gJ2ltcGxlbWVudHMnLlxuICAgKiBAcGFyYW0gaGFzRXh0ZW5kcyBUcnVlIGlmIHRoZXJlIGFyZSBhbnkgJ2V4dGVuZHMnIGNsYXVzZXMgcHJlc2VudCBhdCBhbGwuXG4gICAqL1xuICBmdW5jdGlvbiBoZXJpdGFnZU5hbWUoXG4gICAgICBpc0V4dGVuZHM6IGJvb2xlYW4sIGhhc0V4dGVuZHM6IGJvb2xlYW4sXG4gICAgICBleHByOiB0cy5FeHByZXNzaW9uV2l0aFR5cGVBcmd1bWVudHMpOiB7dGFnTmFtZTogc3RyaW5nLCBwYXJlbnROYW1lOiBzdHJpbmd9fG51bGwge1xuICAgIGxldCB0YWdOYW1lID0gaXNFeHRlbmRzID8gJ2V4dGVuZHMnIDogJ2ltcGxlbWVudHMnO1xuICAgIGxldCBzeW0gPSBtdHQudHlwZUNoZWNrZXIuZ2V0U3ltYm9sQXRMb2NhdGlvbihleHByLmV4cHJlc3Npb24pO1xuICAgIGlmICghc3ltKSB7XG4gICAgICAvLyBJdCdzIHBvc3NpYmxlIGZvciBhIGNsYXNzIGRlY2xhcmF0aW9uIHRvIGV4dGVuZCBhbiBleHByZXNzaW9uIHRoYXRcbiAgICAgIC8vIGRvZXMgbm90IGhhdmUgaGF2ZSBhIHN5bWJvbCwgZm9yIGV4YW1wbGUgd2hlbiBhIG1peGluIGZ1bmN0aW9uIGlzXG4gICAgICAvLyB1c2VkIHRvIGJ1aWxkIGEgYmFzZSBjbGFzcywgYXMgaW4gYGRlY2xhcmUgTXlDbGFzcyBleHRlbmRzXG4gICAgICAvLyBNeU1peGluKE15QmFzZUNsYXNzKWAuXG4gICAgICAvL1xuICAgICAgLy8gSGFuZGxpbmcgdGhpcyBjb3JyZWN0bHkgaXMgdHJpY2t5LiBDbG9zdXJlIHRocm93cyBvbiB0aGlzXG4gICAgICAvLyBgZXh0ZW5kcyA8ZXhwcmVzc2lvbj5gIHN5bnRheCAoc2VlXG4gICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vZ29vZ2xlL2Nsb3N1cmUtY29tcGlsZXIvaXNzdWVzLzIxODIpLiBXZSB3b3VsZFxuICAgICAgLy8gcHJvYmFibHkgbmVlZCB0byBnZW5lcmF0ZSBhbiBpbnRlcm1lZGlhdGUgY2xhc3MgZGVjbGFyYXRpb24gYW5kXG4gICAgICAvLyBleHRlbmQgdGhhdC5cbiAgICAgIG10dC5kZWJ1Z1dhcm4oZGVjbCwgYGNvdWxkIG5vdCByZXNvbHZlIHN1cGVydHlwZTogJHtleHByLmdldFRleHQoKX1gKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8vIFJlc29sdmUgYW55IGFsaWFzZXMgdG8gdGhlIHVuZGVybHlpbmcgdHlwZS5cbiAgICBpZiAoc3ltLmZsYWdzICYgdHMuU3ltYm9sRmxhZ3MuVHlwZUFsaWFzKSB7XG4gICAgICAvLyBJdCdzIGltcGxlbWVudGluZyBhIHR5cGUgYWxpYXMuICBGb2xsb3cgdGhlIHR5cGUgYWxpYXMgYmFja1xuICAgICAgLy8gdG8gdGhlIG9yaWdpbmFsIHN5bWJvbCB0byBjaGVjayB3aGV0aGVyIGl0J3MgYSB0eXBlIG9yIGEgdmFsdWUuXG4gICAgICBjb25zdCB0eXBlID0gbXR0LnR5cGVDaGVja2VyLmdldERlY2xhcmVkVHlwZU9mU3ltYm9sKHN5bSk7XG4gICAgICBpZiAoIXR5cGUuc3ltYm9sKSB7XG4gICAgICAgIC8vIEl0J3Mgbm90IGNsZWFyIHdoZW4gdGhpcyBjYW4gaGFwcGVuLlxuICAgICAgICBtdHQuZGVidWdXYXJuKGRlY2wsIGBjb3VsZCBub3QgZ2V0IHR5cGUgb2Ygc3ltYm9sOiAke2V4cHIuZ2V0VGV4dCgpfWApO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICAgIHN5bSA9IHR5cGUuc3ltYm9sO1xuICAgIH1cbiAgICBpZiAoc3ltLmZsYWdzICYgdHMuU3ltYm9sRmxhZ3MuQWxpYXMpIHtcbiAgICAgIHN5bSA9IG10dC50eXBlQ2hlY2tlci5nZXRBbGlhc2VkU3ltYm9sKHN5bSk7XG4gICAgfVxuXG4gICAgY29uc3QgdHlwZVRyYW5zbGF0b3IgPSBtdHQubmV3VHlwZVRyYW5zbGF0b3IoZXhwci5leHByZXNzaW9uKTtcbiAgICBpZiAodHlwZVRyYW5zbGF0b3IuaXNCbGFja0xpc3RlZChzeW0pKSB7XG4gICAgICAvLyBEb24ndCBlbWl0IHJlZmVyZW5jZXMgdG8gYmxhY2tsaXN0ZWQgdHlwZXMuXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAoc3ltLmZsYWdzICYgdHMuU3ltYm9sRmxhZ3MuQ2xhc3MpIHtcbiAgICAgIGlmICghaXNDbGFzcykge1xuICAgICAgICAvLyBDbG9zdXJlIGludGVyZmFjZXMgY2Fubm90IGV4dGVuZCBvciBpbXBsZW1lbnRzIGNsYXNzZXMuXG4gICAgICAgIG10dC5kZWJ1Z1dhcm4oZGVjbCwgYG9taXR0aW5nIGludGVyZmFjZSBkZXJpdmluZyBmcm9tIGNsYXNzOiAke2V4cHIuZ2V0VGV4dCgpfWApO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICAgIGlmICghaXNFeHRlbmRzKSB7XG4gICAgICAgIGlmICghaGFzRXh0ZW5kcykge1xuICAgICAgICAgIC8vIEEgc3BlY2lhbCBjYXNlOiBmb3IgYSBjbGFzcyB0aGF0IGhhcyBubyBleGlzdGluZyAnZXh0ZW5kcycgY2xhdXNlIGJ1dCBkb2VzXG4gICAgICAgICAgLy8gaGF2ZSBhbiAnaW1wbGVtZW50cycgY2xhdXNlIHRoYXQgcmVmZXJzIHRvIGFub3RoZXIgY2xhc3MsIHdlIGNoYW5nZSBpdCB0b1xuICAgICAgICAgIC8vIGluc3RlYWQgYmUgYW4gJ2V4dGVuZHMnLiAgVGhpcyB3YXMgYSBwb29ybHktdGhvdWdodC1vdXQgaGFjayB0aGF0IG1heVxuICAgICAgICAgIC8vIGFjdHVhbGx5IGNhdXNlIGNvbXBpbGVyIGJ1Z3M6XG4gICAgICAgICAgLy8gICBodHRwczovL2dpdGh1Yi5jb20vZ29vZ2xlL2Nsb3N1cmUtY29tcGlsZXIvaXNzdWVzLzMxMjZcbiAgICAgICAgICAvLyBidXQgd2UgaGF2ZSBjb2RlIHRoYXQgbm93IHJlbGllcyBvbiBpdCwgdWdoLlxuICAgICAgICAgIHRhZ05hbWUgPSAnZXh0ZW5kcyc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gQ2xvc3VyZSBjYW4gb25seSBAaW1wbGVtZW50cyBhbiBpbnRlcmZhY2UsIG5vdCBhIGNsYXNzLlxuICAgICAgICAgIG10dC5kZWJ1Z1dhcm4oZGVjbCwgYG9taXR0aW5nIEBpbXBsZW1lbnRzIG9mIGEgY2xhc3M6ICR7ZXhwci5nZXRUZXh0KCl9YCk7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHN5bS5mbGFncyAmIHRzLlN5bWJvbEZsYWdzLlZhbHVlKSB7XG4gICAgICAvLyBJZiBpdCdzIHNvbWV0aGluZyBvdGhlciB0aGFuIGEgY2xhc3MgaW4gdGhlIHZhbHVlIG5hbWVzcGFjZSwgdGhlbiBpdCB3aWxsXG4gICAgICAvLyBub3QgYmUgYSB0eXBlIGluIHRoZSBDbG9zdXJlIG91dHB1dCAoYmVjYXVzZSBDbG9zdXJlIGNvbGxhcHNlc1xuICAgICAgLy8gdGhlIHR5cGUgYW5kIHZhbHVlIG5hbWVzcGFjZXMpLlxuICAgICAgbXR0LmRlYnVnV2FybihcbiAgICAgICAgICBkZWNsLCBgb21pdHRpbmcgaGVyaXRhZ2UgcmVmZXJlbmNlIHRvIGEgdHlwZS92YWx1ZSBjb25mbGljdDogJHtleHByLmdldFRleHQoKX1gKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0gZWxzZSBpZiAoc3ltLmZsYWdzICYgdHMuU3ltYm9sRmxhZ3MuVHlwZUxpdGVyYWwpIHtcbiAgICAgIC8vIEEgdHlwZSBsaXRlcmFsIGlzIGEgdHlwZSBsaWtlIGB7Zm9vOiBzdHJpbmd9YC5cbiAgICAgIC8vIFRoZXNlIGNhbiBjb21lIHVwIGFzIHRoZSBvdXRwdXQgb2YgYSBtYXBwZWQgdHlwZS5cbiAgICAgIG10dC5kZWJ1Z1dhcm4oZGVjbCwgYG9taXR0aW5nIGhlcml0YWdlIHJlZmVyZW5jZSB0byBhIHR5cGUgbGl0ZXJhbDogJHtleHByLmdldFRleHQoKX1gKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8vIHR5cGVUb0Nsb3N1cmUgaW5jbHVkZXMgbnVsbGFiaWxpdHkgbW9kaWZpZXJzLCBzbyBjYWxsIHN5bWJvbFRvU3RyaW5nIGRpcmVjdGx5IGhlcmUuXG4gICAgY29uc3QgcGFyZW50TmFtZSA9IHR5cGVUcmFuc2xhdG9yLnN5bWJvbFRvU3RyaW5nKHN5bSk7XG4gICAgaWYgKCFwYXJlbnROYW1lKSByZXR1cm4gbnVsbDtcbiAgICByZXR1cm4ge3RhZ05hbWUsIHBhcmVudE5hbWV9O1xuICB9XG59XG5cbi8qKlxuICogY3JlYXRlTWVtYmVyVHlwZURlY2xhcmF0aW9uIGVtaXRzIHRoZSB0eXBlIGFubm90YXRpb25zIGZvciBtZW1iZXJzIG9mIGEgY2xhc3MuIEl0J3MgbmVjZXNzYXJ5IGluXG4gKiB0aGUgY2FzZSB3aGVyZSBUeXBlU2NyaXB0IHN5bnRheCBzcGVjaWZpZXMgdGhlcmUgYXJlIGFkZGl0aW9uYWwgcHJvcGVydGllcyBvbiB0aGUgY2xhc3MsIGJlY2F1c2VcbiAqIHRvIGRlY2xhcmUgdGhlc2UgaW4gQ2xvc3VyZSB5b3UgbXVzdCBkZWNsYXJlIHRoZXNlIHNlcGFyYXRlbHkgZnJvbSB0aGUgY2xhc3MuXG4gKlxuICogY3JlYXRlTWVtYmVyVHlwZURlY2xhcmF0aW9uIHByb2R1Y2VzIGFuIGlmIChmYWxzZSkgc3RhdGVtZW50IGNvbnRhaW5pbmcgcHJvcGVydHkgZGVjbGFyYXRpb25zLCBvclxuICogbnVsbCBpZiBubyBkZWNsYXJhdGlvbnMgY291bGQgb3IgbmVlZGVkIHRvIGJlIGdlbmVyYXRlZCAoZS5nLiBubyBtZW1iZXJzLCBvciBhbiB1bm5hbWVkIHR5cGUpLlxuICogVGhlIGlmIHN0YXRlbWVudCBpcyB1c2VkIHRvIG1ha2Ugc3VyZSB0aGUgY29kZSBpcyBub3QgZXhlY3V0ZWQsIG90aGVyd2lzZSBwcm9wZXJ0eSBhY2Nlc3NlcyBjb3VsZFxuICogdHJpZ2dlciBnZXR0ZXJzIG9uIGEgc3VwZXJjbGFzcy4gU2VlIHRlc3RfZmlsZXMvZmllbGRzL2ZpZWxkcy50czpCYXNlVGhhdFRocm93cy5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlTWVtYmVyVHlwZURlY2xhcmF0aW9uKFxuICAgIG10dDogTW9kdWxlVHlwZVRyYW5zbGF0b3IsXG4gICAgdHlwZURlY2w6IHRzLkNsYXNzRGVjbGFyYXRpb258dHMuSW50ZXJmYWNlRGVjbGFyYXRpb24pOiB0cy5JZlN0YXRlbWVudHxudWxsIHtcbiAgLy8gR2F0aGVyIHBhcmFtZXRlciBwcm9wZXJ0aWVzIGZyb20gdGhlIGNvbnN0cnVjdG9yLCBpZiBpdCBleGlzdHMuXG4gIGNvbnN0IGN0b3JzOiB0cy5Db25zdHJ1Y3RvckRlY2xhcmF0aW9uW10gPSBbXTtcbiAgbGV0IHBhcmFtUHJvcHM6IHRzLlBhcmFtZXRlckRlY2xhcmF0aW9uW10gPSBbXTtcbiAgY29uc3Qgbm9uU3RhdGljUHJvcHM6IEFycmF5PHRzLlByb3BlcnR5RGVjbGFyYXRpb258dHMuUHJvcGVydHlTaWduYXR1cmU+ID0gW107XG4gIGNvbnN0IHN0YXRpY1Byb3BzOiBBcnJheTx0cy5Qcm9wZXJ0eURlY2xhcmF0aW9ufHRzLlByb3BlcnR5U2lnbmF0dXJlPiA9IFtdO1xuICBjb25zdCB1bmhhbmRsZWQ6IHRzLk5hbWVkRGVjbGFyYXRpb25bXSA9IFtdO1xuICBjb25zdCBhYnN0cmFjdE1ldGhvZHM6IHRzLkZ1bmN0aW9uTGlrZURlY2xhcmF0aW9uW10gPSBbXTtcbiAgZm9yIChjb25zdCBtZW1iZXIgb2YgdHlwZURlY2wubWVtYmVycykge1xuICAgIGlmIChtZW1iZXIua2luZCA9PT0gdHMuU3ludGF4S2luZC5Db25zdHJ1Y3Rvcikge1xuICAgICAgY3RvcnMucHVzaChtZW1iZXIgYXMgdHMuQ29uc3RydWN0b3JEZWNsYXJhdGlvbik7XG4gICAgfSBlbHNlIGlmICh0cy5pc1Byb3BlcnR5RGVjbGFyYXRpb24obWVtYmVyKSB8fCB0cy5pc1Byb3BlcnR5U2lnbmF0dXJlKG1lbWJlcikpIHtcbiAgICAgIGNvbnN0IGlzU3RhdGljID0gdHJhbnNmb3JtZXJVdGlsLmhhc01vZGlmaWVyRmxhZyhtZW1iZXIsIHRzLk1vZGlmaWVyRmxhZ3MuU3RhdGljKTtcbiAgICAgIGlmIChpc1N0YXRpYykge1xuICAgICAgICBzdGF0aWNQcm9wcy5wdXNoKG1lbWJlcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBub25TdGF0aWNQcm9wcy5wdXNoKG1lbWJlcik7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChcbiAgICAgICAgbWVtYmVyLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuTWV0aG9kRGVjbGFyYXRpb24gfHxcbiAgICAgICAgbWVtYmVyLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuTWV0aG9kU2lnbmF0dXJlIHx8XG4gICAgICAgIG1lbWJlci5raW5kID09PSB0cy5TeW50YXhLaW5kLkdldEFjY2Vzc29yIHx8IG1lbWJlci5raW5kID09PSB0cy5TeW50YXhLaW5kLlNldEFjY2Vzc29yKSB7XG4gICAgICBpZiAodHJhbnNmb3JtZXJVdGlsLmhhc01vZGlmaWVyRmxhZyhtZW1iZXIsIHRzLk1vZGlmaWVyRmxhZ3MuQWJzdHJhY3QpIHx8XG4gICAgICAgICAgdHMuaXNJbnRlcmZhY2VEZWNsYXJhdGlvbih0eXBlRGVjbCkpIHtcbiAgICAgICAgYWJzdHJhY3RNZXRob2RzLnB1c2goXG4gICAgICAgICAgICBtZW1iZXIgYXMgdHMuTWV0aG9kRGVjbGFyYXRpb24gfCB0cy5HZXRBY2Nlc3NvckRlY2xhcmF0aW9uIHwgdHMuU2V0QWNjZXNzb3JEZWNsYXJhdGlvbik7XG4gICAgICB9XG4gICAgICAvLyBOb24tYWJzdHJhY3QgbWV0aG9kcyBvbmx5IGV4aXN0IG9uIGNsYXNzZXMsIGFuZCBhcmUgaGFuZGxlZCBpbiByZWd1bGFyIGVtaXQuXG4gICAgfSBlbHNlIHtcbiAgICAgIHVuaGFuZGxlZC5wdXNoKG1lbWJlcik7XG4gICAgfVxuICB9XG5cbiAgaWYgKGN0b3JzLmxlbmd0aCA+IDApIHtcbiAgICAvLyBPbmx5IHRoZSBhY3R1YWwgY29uc3RydWN0b3IgaW1wbGVtZW50YXRpb24sIHdoaWNoIG11c3QgYmUgbGFzdCBpbiBhIHBvdGVudGlhbCBzZXF1ZW5jZSBvZlxuICAgIC8vIG92ZXJsb2FkZWQgY29uc3RydWN0b3JzLCBtYXkgY29udGFpbiBwYXJhbWV0ZXIgcHJvcGVydGllcy5cbiAgICBjb25zdCBjdG9yID0gY3RvcnNbY3RvcnMubGVuZ3RoIC0gMV07XG4gICAgcGFyYW1Qcm9wcyA9IGN0b3IucGFyYW1ldGVycy5maWx0ZXIoXG4gICAgICAgIHAgPT4gdHJhbnNmb3JtZXJVdGlsLmhhc01vZGlmaWVyRmxhZyhwLCB0cy5Nb2RpZmllckZsYWdzLlBhcmFtZXRlclByb3BlcnR5TW9kaWZpZXIpKTtcbiAgfVxuXG4gIGlmIChub25TdGF0aWNQcm9wcy5sZW5ndGggPT09IDAgJiYgcGFyYW1Qcm9wcy5sZW5ndGggPT09IDAgJiYgc3RhdGljUHJvcHMubGVuZ3RoID09PSAwICYmXG4gICAgICBhYnN0cmFjdE1ldGhvZHMubGVuZ3RoID09PSAwKSB7XG4gICAgLy8gVGhlcmUgYXJlIG5vIG1lbWJlcnMgc28gd2UgZG9uJ3QgbmVlZCB0byBlbWl0IGFueSB0eXBlXG4gICAgLy8gYW5ub3RhdGlvbnMgaGVscGVyLlxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgaWYgKCF0eXBlRGVjbC5uYW1lKSB7XG4gICAgbXR0LmRlYnVnV2Fybih0eXBlRGVjbCwgJ2Nhbm5vdCBhZGQgdHlwZXMgb24gdW5uYW1lZCBkZWNsYXJhdGlvbnMnKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGNvbnN0IGNsYXNzTmFtZSA9IHRyYW5zZm9ybWVyVXRpbC5nZXRJZGVudGlmaWVyVGV4dCh0eXBlRGVjbC5uYW1lKTtcbiAgY29uc3Qgc3RhdGljUHJvcEFjY2VzcyA9IHRzLmNyZWF0ZUlkZW50aWZpZXIoY2xhc3NOYW1lKTtcbiAgY29uc3QgaW5zdGFuY2VQcm9wQWNjZXNzID0gdHMuY3JlYXRlUHJvcGVydHlBY2Nlc3Moc3RhdGljUHJvcEFjY2VzcywgJ3Byb3RvdHlwZScpO1xuICAvLyBDbG9zdXJlIENvbXBpbGVyIHdpbGwgcmVwb3J0IGNvbmZvcm1hbmNlIGVycm9ycyBhYm91dCB0aGlzIGJlaW5nIHVua25vd24gdHlwZSB3aGVuIGVtaXR0aW5nXG4gIC8vIGNsYXNzIHByb3BlcnRpZXMgYXMgez98dW5kZWZpbmVkfSwgaW5zdGVhZCBvZiBqdXN0IHs/fS4gU28gbWFrZSBzdXJlIHRvIG9ubHkgZW1pdCB7P3x1bmRlZmluZWR9XG4gIC8vIG9uIGludGVyZmFjZXMuXG4gIGNvbnN0IGlzSW50ZXJmYWNlID0gdHMuaXNJbnRlcmZhY2VEZWNsYXJhdGlvbih0eXBlRGVjbCk7XG4gIGNvbnN0IHByb3BlcnR5RGVjbHMgPSBzdGF0aWNQcm9wcy5tYXAoXG4gICAgICBwID0+IGNyZWF0ZUNsb3N1cmVQcm9wZXJ0eURlY2xhcmF0aW9uKFxuICAgICAgICAgIG10dCwgc3RhdGljUHJvcEFjY2VzcywgcCwgaXNJbnRlcmZhY2UgJiYgISFwLnF1ZXN0aW9uVG9rZW4pKTtcbiAgcHJvcGVydHlEZWNscy5wdXNoKC4uLlsuLi5ub25TdGF0aWNQcm9wcywgLi4ucGFyYW1Qcm9wc10ubWFwKFxuICAgICAgcCA9PiBjcmVhdGVDbG9zdXJlUHJvcGVydHlEZWNsYXJhdGlvbihcbiAgICAgICAgICBtdHQsIGluc3RhbmNlUHJvcEFjY2VzcywgcCwgaXNJbnRlcmZhY2UgJiYgISFwLnF1ZXN0aW9uVG9rZW4pKSk7XG4gIHByb3BlcnR5RGVjbHMucHVzaCguLi51bmhhbmRsZWQubWFwKFxuICAgICAgcCA9PiB0cmFuc2Zvcm1lclV0aWwuY3JlYXRlTXVsdGlMaW5lQ29tbWVudChcbiAgICAgICAgICBwLCBgU2tpcHBpbmcgdW5oYW5kbGVkIG1lbWJlcjogJHtlc2NhcGVGb3JDb21tZW50KHAuZ2V0VGV4dCgpKX1gKSkpO1xuXG4gIGZvciAoY29uc3QgZm5EZWNsIG9mIGFic3RyYWN0TWV0aG9kcykge1xuICAgIGNvbnN0IG5hbWUgPSBwcm9wZXJ0eU5hbWUoZm5EZWNsKTtcbiAgICBpZiAoIW5hbWUpIHtcbiAgICAgIG10dC5lcnJvcihmbkRlY2wsICdhbm9ueW1vdXMgYWJzdHJhY3QgZnVuY3Rpb24nKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBjb25zdCB7dGFncywgcGFyYW1ldGVyTmFtZXN9ID0gbXR0LmdldEZ1bmN0aW9uVHlwZUpTRG9jKFtmbkRlY2xdLCBbXSk7XG4gICAgaWYgKGhhc0V4cG9ydGluZ0RlY29yYXRvcihmbkRlY2wsIG10dC50eXBlQ2hlY2tlcikpIHRhZ3MucHVzaCh7dGFnTmFtZTogJ2V4cG9ydCd9KTtcbiAgICAvLyBtZW1iZXJOYW1lc3BhY2UgYmVjYXVzZSBhYnN0cmFjdCBtZXRob2RzIGNhbm5vdCBiZSBzdGF0aWMgaW4gVHlwZVNjcmlwdC5cbiAgICBjb25zdCBhYnN0cmFjdEZuRGVjbCA9IHRzLmNyZWF0ZVN0YXRlbWVudCh0cy5jcmVhdGVBc3NpZ25tZW50KFxuICAgICAgICB0cy5jcmVhdGVQcm9wZXJ0eUFjY2VzcyhpbnN0YW5jZVByb3BBY2Nlc3MsIG5hbWUpLFxuICAgICAgICB0cy5jcmVhdGVGdW5jdGlvbkV4cHJlc3Npb24oXG4gICAgICAgICAgICAvKiBtb2RpZmllcnMgKi8gdW5kZWZpbmVkLFxuICAgICAgICAgICAgLyogYXN0ZXJpc2sgKi8gdW5kZWZpbmVkLFxuICAgICAgICAgICAgLyogbmFtZSAqLyB1bmRlZmluZWQsXG4gICAgICAgICAgICAvKiB0eXBlUGFyYW1ldGVycyAqLyB1bmRlZmluZWQsXG4gICAgICAgICAgICBwYXJhbWV0ZXJOYW1lcy5tYXAoXG4gICAgICAgICAgICAgICAgbiA9PiB0cy5jcmVhdGVQYXJhbWV0ZXIoXG4gICAgICAgICAgICAgICAgICAgIC8qIGRlY29yYXRvcnMgKi8gdW5kZWZpbmVkLCAvKiBtb2RpZmllcnMgKi8gdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICAvKiBkb3REb3REb3QgKi8gdW5kZWZpbmVkLCBuKSksXG4gICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICB0cy5jcmVhdGVCbG9jayhbXSksXG4gICAgICAgICAgICApKSk7XG4gICAgdHMuc2V0U3ludGhldGljTGVhZGluZ0NvbW1lbnRzKGFic3RyYWN0Rm5EZWNsLCBbanNkb2MudG9TeW50aGVzaXplZENvbW1lbnQodGFncyldKTtcbiAgICBwcm9wZXJ0eURlY2xzLnB1c2godHMuc2V0U291cmNlTWFwUmFuZ2UoYWJzdHJhY3RGbkRlY2wsIGZuRGVjbCkpO1xuICB9XG5cbiAgLy8gU2VlIHRlc3RfZmlsZXMvZmllbGRzL2ZpZWxkcy50czpCYXNlVGhhdFRocm93cyBmb3IgYSBub3RlIG9uIHRoaXMgd3JhcHBlci5cbiAgcmV0dXJuIHRzLmNyZWF0ZUlmKHRzLmNyZWF0ZUxpdGVyYWwoZmFsc2UpLCB0cy5jcmVhdGVCbG9jayhwcm9wZXJ0eURlY2xzLCB0cnVlKSk7XG59XG5cbmZ1bmN0aW9uIHByb3BlcnR5TmFtZShwcm9wOiB0cy5OYW1lZERlY2xhcmF0aW9uKTogc3RyaW5nfG51bGwge1xuICBpZiAoIXByb3AubmFtZSkgcmV0dXJuIG51bGw7XG5cbiAgc3dpdGNoIChwcm9wLm5hbWUua2luZCkge1xuICAgIGNhc2UgdHMuU3ludGF4S2luZC5JZGVudGlmaWVyOlxuICAgICAgcmV0dXJuIHRyYW5zZm9ybWVyVXRpbC5nZXRJZGVudGlmaWVyVGV4dChwcm9wLm5hbWUgYXMgdHMuSWRlbnRpZmllcik7XG4gICAgY2FzZSB0cy5TeW50YXhLaW5kLlN0cmluZ0xpdGVyYWw6XG4gICAgICAvLyBFLmcuIGludGVyZmFjZSBGb28geyAnYmFyJzogbnVtYmVyOyB9XG4gICAgICAvLyBJZiAnYmFyJyBpcyBhIG5hbWUgdGhhdCBpcyBub3QgdmFsaWQgaW4gQ2xvc3VyZSB0aGVuIHRoZXJlJ3Mgbm90aGluZyB3ZSBjYW4gZG8uXG4gICAgICBjb25zdCB0ZXh0ID0gKHByb3AubmFtZSBhcyB0cy5TdHJpbmdMaXRlcmFsKS50ZXh0O1xuICAgICAgaWYgKCFpc1ZhbGlkQ2xvc3VyZVByb3BlcnR5TmFtZSh0ZXh0KSkgcmV0dXJuIG51bGw7XG4gICAgICByZXR1cm4gdGV4dDtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuLyoqIFJlbW92ZXMgY29tbWVudCBtZXRhY2hhcmFjdGVycyBmcm9tIGEgc3RyaW5nLCB0byBtYWtlIGl0IHNhZmUgdG8gZW1iZWQgaW4gYSBjb21tZW50LiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGVzY2FwZUZvckNvbW1lbnQoc3RyOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoL1xcL1xcKi9nLCAnX18nKS5yZXBsYWNlKC9cXCpcXC8vZywgJ19fJyk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUNsb3N1cmVQcm9wZXJ0eURlY2xhcmF0aW9uKFxuICAgIG10dDogTW9kdWxlVHlwZVRyYW5zbGF0b3IsIGV4cHI6IHRzLkV4cHJlc3Npb24sXG4gICAgcHJvcDogdHMuUHJvcGVydHlEZWNsYXJhdGlvbnx0cy5Qcm9wZXJ0eVNpZ25hdHVyZXx0cy5QYXJhbWV0ZXJEZWNsYXJhdGlvbixcbiAgICBvcHRpb25hbDogYm9vbGVhbik6IHRzLlN0YXRlbWVudCB7XG4gIGNvbnN0IG5hbWUgPSBwcm9wZXJ0eU5hbWUocHJvcCk7XG4gIGlmICghbmFtZSkge1xuICAgIG10dC5kZWJ1Z1dhcm4ocHJvcCwgYGhhbmRsZSB1bm5hbWVkIG1lbWJlcjpcXG4ke2VzY2FwZUZvckNvbW1lbnQocHJvcC5nZXRUZXh0KCkpfWApO1xuICAgIHJldHVybiB0cmFuc2Zvcm1lclV0aWwuY3JlYXRlTXVsdGlMaW5lQ29tbWVudChcbiAgICAgICAgcHJvcCwgYFNraXBwaW5nIHVubmFtZWQgbWVtYmVyOlxcbiR7ZXNjYXBlRm9yQ29tbWVudChwcm9wLmdldFRleHQoKSl9YCk7XG4gIH1cblxuICBsZXQgdHlwZSA9IG10dC50eXBlVG9DbG9zdXJlKHByb3ApO1xuICAvLyBXaGVuIGEgcHJvcGVydHkgaXMgb3B0aW9uYWwsIGUuZy5cbiAgLy8gICBmb28/OiBzdHJpbmc7XG4gIC8vIFRoZW4gdGhlIFR5cGVTY3JpcHQgdHlwZSBvZiB0aGUgcHJvcGVydHkgaXMgc3RyaW5nfHVuZGVmaW5lZCwgdGhlXG4gIC8vIHR5cGVUb0Nsb3N1cmUgdHJhbnNsYXRpb24gaGFuZGxlcyBpdCBjb3JyZWN0bHksIGFuZCBzdHJpbmd8dW5kZWZpbmVkIGlzXG4gIC8vIGhvdyB5b3Ugd3JpdGUgYW4gb3B0aW9uYWwgcHJvcGVydHkgaW4gQ2xvc3VyZS5cbiAgLy9cbiAgLy8gQnV0IGluIHRoZSBzcGVjaWFsIGNhc2Ugb2YgYW4gb3B0aW9uYWwgcHJvcGVydHkgd2l0aCB0eXBlIGFueTpcbiAgLy8gICBmb28/OiBhbnk7XG4gIC8vIFRoZSBUeXBlU2NyaXB0IHR5cGUgb2YgdGhlIHByb3BlcnR5IGlzIGp1c3QgXCJhbnlcIiAoYmVjYXVzZSBhbnkgaW5jbHVkZXNcbiAgLy8gdW5kZWZpbmVkIGFzIHdlbGwpIHNvIG91ciBkZWZhdWx0IHRyYW5zbGF0aW9uIG9mIHRoZSB0eXBlIGlzIGp1c3QgXCI/XCIuXG4gIC8vIFRvIG1hcmsgdGhlIHByb3BlcnR5IGFzIG9wdGlvbmFsIGluIENsb3N1cmUgaXQgbXVzdCBoYXZlIFwifHVuZGVmaW5lZFwiLFxuICAvLyBzbyB0aGUgQ2xvc3VyZSB0eXBlIG11c3QgYmUgP3x1bmRlZmluZWQuXG4gIGlmIChvcHRpb25hbCAmJiB0eXBlID09PSAnPycpIHR5cGUgKz0gJ3x1bmRlZmluZWQnO1xuXG4gIGNvbnN0IHRhZ3MgPSBtdHQuZ2V0SlNEb2MocHJvcCwgLyogcmVwb3J0V2FybmluZ3MgKi8gdHJ1ZSk7XG4gIHRhZ3MucHVzaCh7dGFnTmFtZTogJ3R5cGUnLCB0eXBlfSk7XG4gIGNvbnN0IGZsYWdzID0gdHMuZ2V0Q29tYmluZWRNb2RpZmllckZsYWdzKHByb3ApO1xuICBpZiAoZmxhZ3MgJiB0cy5Nb2RpZmllckZsYWdzLlByb3RlY3RlZCkge1xuICAgIHRhZ3MucHVzaCh7dGFnTmFtZTogJ3Byb3RlY3RlZCd9KTtcbiAgfSBlbHNlIGlmIChmbGFncyAmIHRzLk1vZGlmaWVyRmxhZ3MuUHJpdmF0ZSkge1xuICAgIHRhZ3MucHVzaCh7dGFnTmFtZTogJ3ByaXZhdGUnfSk7XG4gIH1cbiAgaWYgKGhhc0V4cG9ydGluZ0RlY29yYXRvcihwcm9wLCBtdHQudHlwZUNoZWNrZXIpKSB7XG4gICAgdGFncy5wdXNoKHt0YWdOYW1lOiAnZXhwb3J0J30pO1xuICB9XG4gIGNvbnN0IGRlY2xTdG10ID1cbiAgICAgIHRzLnNldFNvdXJjZU1hcFJhbmdlKHRzLmNyZWF0ZVN0YXRlbWVudCh0cy5jcmVhdGVQcm9wZXJ0eUFjY2VzcyhleHByLCBuYW1lKSksIHByb3ApO1xuICAvLyBBdm9pZCBwcmludGluZyBhbm5vdGF0aW9ucyB0aGF0IGNhbiBjb25mbGljdCB3aXRoIEB0eXBlXG4gIC8vIFRoaXMgYXZvaWRzIENsb3N1cmUncyBlcnJvciBcInR5cGUgYW5ub3RhdGlvbiBpbmNvbXBhdGlibGUgd2l0aCBvdGhlciBhbm5vdGF0aW9uc1wiXG4gIGFkZENvbW1lbnRPbihkZWNsU3RtdCwgdGFncywganNkb2MuVEFHU19DT05GTElDVElOR19XSVRIX1RZUEUpO1xuICByZXR1cm4gZGVjbFN0bXQ7XG59XG5cbi8qKlxuICogUmVtb3ZlcyBhbnkgdHlwZSBhc3NlcnRpb25zIGFuZCBub24tbnVsbCBleHByZXNzaW9ucyBmcm9tIHRoZSBBU1QgYmVmb3JlIFR5cGVTY3JpcHQgcHJvY2Vzc2luZy5cbiAqXG4gKiBJZGVhbGx5LCB0aGUgY29kZSBpbiBqc2RvY190cmFuc2Zvcm1lciBiZWxvdyBzaG91bGQganVzdCByZW1vdmUgdGhlIGNhc3QgZXhwcmVzc2lvbiBhbmRcbiAqIHJlcGxhY2UgaXQgd2l0aCB0aGUgQ2xvc3VyZSBlcXVpdmFsZW50LiBIb3dldmVyIEFuZ3VsYXIncyBjb21waWxlciBpcyBmcmFnaWxlIHRvIEFTVFxuICogbm9kZXMgYmVpbmcgcmVtb3ZlZCBvciBjaGFuZ2luZyB0eXBlLCBzbyB0aGUgY29kZSBtdXN0IHJldGFpbiB0aGUgdHlwZSBhc3NlcnRpb25cbiAqIGV4cHJlc3Npb24sIHNlZTogaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9pc3N1ZXMvMjQ4OTUuXG4gKlxuICogdHNpY2tsZSBhbHNvIGNhbm5vdCBqdXN0IGdlbmVyYXRlIGFuZCBrZWVwIGEgYCgvLi4gQHR5cGUge1NvbWVUeXBlfSAuLyAoZXhwciBhcyBTb21lVHlwZSkpYFxuICogYmVjYXVzZSBUeXBlU2NyaXB0IHJlbW92ZXMgdGhlIHBhcmVudGhlc2l6ZWQgZXhwcmVzc2lvbnMgaW4gdGhhdCBzeW50YXgsIChyZWFzb25hYmx5KSBiZWxpZXZpbmdcbiAqIHRoZXkgd2VyZSBvbmx5IGFkZGVkIGZvciB0aGUgVFMgY2FzdC5cbiAqXG4gKiBUaGUgZmluYWwgd29ya2Fyb3VuZCBpcyB0aGVuIHRvIGtlZXAgdGhlIFR5cGVTY3JpcHQgdHlwZSBhc3NlcnRpb25zLCBhbmQgaGF2ZSBhIHBvc3QtQW5ndWxhclxuICogcHJvY2Vzc2luZyBzdGVwIHRoYXQgcmVtb3ZlcyB0aGUgYXNzZXJ0aW9ucyBiZWZvcmUgVHlwZVNjcmlwdCBzZWVzIHRoZW0uXG4gKlxuICogVE9ETyhtYXJ0aW5wcm9ic3QpOiByZW1vdmUgb25jZSB0aGUgQW5ndWxhciBpc3N1ZSBpcyBmaXhlZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZVR5cGVBc3NlcnRpb25zKCk6IHRzLlRyYW5zZm9ybWVyRmFjdG9yeTx0cy5Tb3VyY2VGaWxlPiB7XG4gIHJldHVybiAoY29udGV4dDogdHMuVHJhbnNmb3JtYXRpb25Db250ZXh0KSA9PiB7XG4gICAgcmV0dXJuIChzb3VyY2VGaWxlOiB0cy5Tb3VyY2VGaWxlKSA9PiB7XG4gICAgICBmdW5jdGlvbiB2aXNpdG9yKG5vZGU6IHRzLk5vZGUpOiB0cy5Ob2RlIHtcbiAgICAgICAgc3dpdGNoIChub2RlLmtpbmQpIHtcbiAgICAgICAgICBjYXNlIHRzLlN5bnRheEtpbmQuVHlwZUFzc2VydGlvbkV4cHJlc3Npb246XG4gICAgICAgICAgY2FzZSB0cy5TeW50YXhLaW5kLkFzRXhwcmVzc2lvbjpcbiAgICAgICAgICAgIHJldHVybiB0cy52aXNpdE5vZGUoKG5vZGUgYXMgdHMuQXNzZXJ0aW9uRXhwcmVzc2lvbikuZXhwcmVzc2lvbiwgdmlzaXRvcik7XG4gICAgICAgICAgY2FzZSB0cy5TeW50YXhLaW5kLk5vbk51bGxFeHByZXNzaW9uOlxuICAgICAgICAgICAgcmV0dXJuIHRzLnZpc2l0Tm9kZSgobm9kZSBhcyB0cy5Ob25OdWxsRXhwcmVzc2lvbikuZXhwcmVzc2lvbiwgdmlzaXRvcik7XG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cy52aXNpdEVhY2hDaGlsZChub2RlLCB2aXNpdG9yLCBjb250ZXh0KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHZpc2l0b3Ioc291cmNlRmlsZSkgYXMgdHMuU291cmNlRmlsZTtcbiAgICB9O1xuICB9O1xufVxuXG4vKipcbiAqIGpzZG9jVHJhbnNmb3JtZXIgcmV0dXJucyBhIHRyYW5zZm9ybWVyIGZhY3RvcnkgdGhhdCBjb252ZXJ0cyBUeXBlU2NyaXB0IHR5cGVzIGludG8gdGhlIGVxdWl2YWxlbnRcbiAqIEpTRG9jIGFubm90YXRpb25zLlxuICovXG5leHBvcnQgZnVuY3Rpb24ganNkb2NUcmFuc2Zvcm1lcihcbiAgICBob3N0OiBBbm5vdGF0b3JIb3N0LCB0c09wdGlvbnM6IHRzLkNvbXBpbGVyT3B0aW9ucyxcbiAgICBtb2R1bGVSZXNvbHV0aW9uSG9zdDogdHMuTW9kdWxlUmVzb2x1dGlvbkhvc3QsIHR5cGVDaGVja2VyOiB0cy5UeXBlQ2hlY2tlcixcbiAgICBkaWFnbm9zdGljczogdHMuRGlhZ25vc3RpY1tdKTogKGNvbnRleHQ6IHRzLlRyYW5zZm9ybWF0aW9uQ29udGV4dCkgPT5cbiAgICB0cy5UcmFuc2Zvcm1lcjx0cy5Tb3VyY2VGaWxlPiB7XG4gIHJldHVybiAoY29udGV4dDogdHMuVHJhbnNmb3JtYXRpb25Db250ZXh0KTogdHMuVHJhbnNmb3JtZXI8dHMuU291cmNlRmlsZT4gPT4ge1xuICAgIHJldHVybiAoc291cmNlRmlsZTogdHMuU291cmNlRmlsZSkgPT4ge1xuICAgICAgY29uc3QgbW9kdWxlVHlwZVRyYW5zbGF0b3IgPSBuZXcgTW9kdWxlVHlwZVRyYW5zbGF0b3IoXG4gICAgICAgICAgc291cmNlRmlsZSwgdHlwZUNoZWNrZXIsIGhvc3QsIGRpYWdub3N0aWNzLCAvKmlzRm9yRXh0ZXJucyovIGZhbHNlKTtcbiAgICAgIC8qKlxuICAgICAgICogVGhlIHNldCBvZiBhbGwgbmFtZXMgZXhwb3J0ZWQgZnJvbSBhbiBleHBvcnQgKiBpbiB0aGUgY3VycmVudCBtb2R1bGUuIFVzZWQgdG8gcHJldmVudFxuICAgICAgICogZW1pdHRpbmcgZHVwbGljYXRlZCBleHBvcnRzLiBUaGUgZmlyc3QgZXhwb3J0ICogdGFrZXMgcHJlY2VkZW5jZSBpbiBFUzYuXG4gICAgICAgKi9cbiAgICAgIGNvbnN0IGV4cGFuZGVkU3RhckltcG9ydHMgPSBuZXcgU2V0PHN0cmluZz4oKTtcblxuICAgICAgLyoqXG4gICAgICAgKiBXaGlsZSBDbG9zdXJlIGNvbXBpbGVyIHN1cHBvcnRzIHBhcmFtZXRlcml6ZWQgdHlwZXMsIGluY2x1ZGluZyBwYXJhbWV0ZXJpemVkIGB0aGlzYCBvblxuICAgICAgICogbWV0aG9kcywgaXQgZG9lcyBub3Qgc3VwcG9ydCBjb25zdHJhaW50cyBvbiB0aGVtLiBUaGF0IG1lYW5zIHRoYXQgYW4gYFxcQHRlbXBsYXRlYGQgdHlwZSBpc1xuICAgICAgICogYWx3YXlzIGNvbnNpZGVyZWQgdG8gYmUgYHVua25vd25gIHdpdGhpbiB0aGUgbWV0aG9kLCBpbmNsdWRpbmcgYFRISVNgLlxuICAgICAgICpcbiAgICAgICAqIFRvIGhlbHAgQ2xvc3VyZSBDb21waWxlciwgd2Uga2VlcCB0cmFjayBvZiBhbnkgdGVtcGxhdGVkIHRoaXMgcmV0dXJuIHR5cGUsIGFuZCBzdWJzdGl0dXRlXG4gICAgICAgKiBleHBsaWNpdCBjYXN0cyB0byB0aGUgdGVtcGxhdGVkIHR5cGUuXG4gICAgICAgKlxuICAgICAgICogVGhpcyBpcyBhbiBpbmNvbXBsZXRlIHNvbHV0aW9uIGFuZCB3b3JrcyBhcm91bmQgYSBzcGVjaWZpYyBwcm9ibGVtIHdpdGggd2FybmluZ3Mgb24gdW5rbm93blxuICAgICAgICogdGhpcyBhY2Nlc3Nlcy4gTW9yZSBnZW5lcmFsbHksIENsb3N1cmUgYWxzbyBjYW5ub3QgaW5mZXIgY29uc3RyYWludHMgZm9yIGFueSBvdGhlclxuICAgICAgICogdGVtcGxhdGVkIHR5cGVzLCBidXQgdGhhdCBtaWdodCByZXF1aXJlIGEgbW9yZSBnZW5lcmFsIHNvbHV0aW9uIGluIENsb3N1cmUgQ29tcGlsZXIuXG4gICAgICAgKi9cbiAgICAgIGxldCBjb250ZXh0VGhpc1R5cGU6IHRzLlR5cGV8bnVsbCA9IG51bGw7XG5cbiAgICAgIGZ1bmN0aW9uIHZpc2l0Q2xhc3NEZWNsYXJhdGlvbihjbGFzc0RlY2w6IHRzLkNsYXNzRGVjbGFyYXRpb24pOiB0cy5TdGF0ZW1lbnRbXSB7XG4gICAgICAgIGNvbnN0IGNvbnRleHRUaGlzVHlwZUJhY2t1cCA9IGNvbnRleHRUaGlzVHlwZTtcblxuICAgICAgICBjb25zdCBtanNkb2MgPSBtb2R1bGVUeXBlVHJhbnNsYXRvci5nZXRNdXRhYmxlSlNEb2MoY2xhc3NEZWNsKTtcbiAgICAgICAgaWYgKHRyYW5zZm9ybWVyVXRpbC5oYXNNb2RpZmllckZsYWcoY2xhc3NEZWNsLCB0cy5Nb2RpZmllckZsYWdzLkFic3RyYWN0KSkge1xuICAgICAgICAgIG1qc2RvYy50YWdzLnB1c2goe3RhZ05hbWU6ICdhYnN0cmFjdCd9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIG1heWJlQWRkVGVtcGxhdGVDbGF1c2UobWpzZG9jLnRhZ3MsIGNsYXNzRGVjbCk7XG4gICAgICAgIGlmICghaG9zdC51bnR5cGVkKSB7XG4gICAgICAgICAgbWF5YmVBZGRIZXJpdGFnZUNsYXVzZXMobWpzZG9jLnRhZ3MsIG1vZHVsZVR5cGVUcmFuc2xhdG9yLCBjbGFzc0RlY2wpO1xuICAgICAgICB9XG4gICAgICAgIG1qc2RvYy51cGRhdGVDb21tZW50KCk7XG4gICAgICAgIGNvbnN0IGRlY2xzOiB0cy5TdGF0ZW1lbnRbXSA9IFtdO1xuICAgICAgICBjb25zdCBtZW1iZXJEZWNsID0gY3JlYXRlTWVtYmVyVHlwZURlY2xhcmF0aW9uKG1vZHVsZVR5cGVUcmFuc2xhdG9yLCBjbGFzc0RlY2wpO1xuICAgICAgICAvLyBXQVJOSU5HOiBvcmRlciBpcyBzaWduaWZpY2FudDsgd2UgbXVzdCBjcmVhdGUgdGhlIG1lbWJlciBkZWNsIGJlZm9yZSB0cmFuc2Zvcm1pbmcgYXdheVxuICAgICAgICAvLyBwYXJhbWV0ZXIgcHJvcGVydHkgY29tbWVudHMgd2hlbiB2aXNpdGluZyB0aGUgY29uc3RydWN0b3IuXG4gICAgICAgIGRlY2xzLnB1c2godHMudmlzaXRFYWNoQ2hpbGQoY2xhc3NEZWNsLCB2aXNpdG9yLCBjb250ZXh0KSk7XG4gICAgICAgIGlmIChtZW1iZXJEZWNsKSBkZWNscy5wdXNoKG1lbWJlckRlY2wpO1xuICAgICAgICBjb250ZXh0VGhpc1R5cGUgPSBjb250ZXh0VGhpc1R5cGVCYWNrdXA7XG4gICAgICAgIHJldHVybiBkZWNscztcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiB2aXNpdEhlcml0YWdlQ2xhdXNlIHdvcmtzIGFyb3VuZCBhIENsb3N1cmUgQ29tcGlsZXIgaXNzdWUsIHdoZXJlIHRoZSBleHByZXNzaW9uIGluIGFuXG4gICAgICAgKiBcImV4dGVuZHNcIiBjbGF1c2UgbXVzdCBiZSBhIHNpbXBsZSBpZGVudGlmaWVyLCBhbmQgaW4gcGFydGljdWxhciBtdXN0IG5vdCBiZSBhIHBhcmVudGhlc2l6ZWRcbiAgICAgICAqIGV4cHJlc3Npb24uXG4gICAgICAgKlxuICAgICAgICogVGhpcyBpcyB0cmlnZ2VyZWQgd2hlbiBUUyBjb2RlIHdyaXRlcyBcImNsYXNzIFggZXh0ZW5kcyAoRm9vIGFzIEJhcikgeyAuLi4gfVwiLCBjb21tb25seSBkb25lXG4gICAgICAgKiB0byBzdXBwb3J0IG1peGlucy4gRm9yIGV4dGVuZHMgY2xhdXNlcyBpbiBjbGFzc2VzLCB0aGUgY29kZSBiZWxvdyBkcm9wcyB0aGUgY2FzdCBhbmQgYW55XG4gICAgICAgKiBwYXJlbnRoZXRpY2FscywgbGVhdmluZyBqdXN0IHRoZSBvcmlnaW5hbCBleHByZXNzaW9uLlxuICAgICAgICpcbiAgICAgICAqIFRoaXMgaXMgYW4gaW5jb21wbGV0ZSB3b3JrYXJvdW5kLCBhcyBDbG9zdXJlIHdpbGwgc3RpbGwgYmFpbCBvbiBvdGhlciBzdXBlciBleHByZXNzaW9ucyxcbiAgICAgICAqIGJ1dCByZXRhaW5zIGNvbXBhdGliaWxpdHkgd2l0aCB0aGUgcHJldmlvdXMgZW1pdCB0aGF0IChhY2NpZGVudGFsbHkpIGRyb3BwZWQgdGhlIGNhc3RcbiAgICAgICAqIGV4cHJlc3Npb24uXG4gICAgICAgKlxuICAgICAgICogVE9ETyhtYXJ0aW5wcm9ic3QpOiByZW1vdmUgdGhpcyBvbmNlIHRoZSBDbG9zdXJlIHNpZGUgaXNzdWUgaGFzIGJlZW4gcmVzb2x2ZWQuXG4gICAgICAgKi9cbiAgICAgIGZ1bmN0aW9uIHZpc2l0SGVyaXRhZ2VDbGF1c2UoaGVyaXRhZ2VDbGF1c2U6IHRzLkhlcml0YWdlQ2xhdXNlKSB7XG4gICAgICAgIGlmIChoZXJpdGFnZUNsYXVzZS50b2tlbiAhPT0gdHMuU3ludGF4S2luZC5FeHRlbmRzS2V5d29yZCB8fCAhaGVyaXRhZ2VDbGF1c2UucGFyZW50IHx8XG4gICAgICAgICAgICBoZXJpdGFnZUNsYXVzZS5wYXJlbnQua2luZCA9PT0gdHMuU3ludGF4S2luZC5JbnRlcmZhY2VEZWNsYXJhdGlvbikge1xuICAgICAgICAgIHJldHVybiB0cy52aXNpdEVhY2hDaGlsZChoZXJpdGFnZUNsYXVzZSwgdmlzaXRvciwgY29udGV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGhlcml0YWdlQ2xhdXNlLnR5cGVzLmxlbmd0aCAhPT0gMSkge1xuICAgICAgICAgIG1vZHVsZVR5cGVUcmFuc2xhdG9yLmVycm9yKFxuICAgICAgICAgICAgICBoZXJpdGFnZUNsYXVzZSwgYGV4cGVjdGVkIGV4YWN0bHkgb25lIHR5cGUgaW4gY2xhc3MgZXh0ZW5zaW9uIGNsYXVzZWApO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHR5cGUgPSBoZXJpdGFnZUNsYXVzZS50eXBlc1swXTtcbiAgICAgICAgbGV0IGV4cHI6IHRzLkV4cHJlc3Npb24gPSB0eXBlLmV4cHJlc3Npb247XG4gICAgICAgIHdoaWxlICh0cy5pc1BhcmVudGhlc2l6ZWRFeHByZXNzaW9uKGV4cHIpIHx8IHRzLmlzTm9uTnVsbEV4cHJlc3Npb24oZXhwcikgfHxcbiAgICAgICAgICAgICAgIHRzLmlzQXNzZXJ0aW9uRXhwcmVzc2lvbihleHByKSkge1xuICAgICAgICAgIGV4cHIgPSBleHByLmV4cHJlc3Npb247XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRzLnVwZGF0ZUhlcml0YWdlQ2xhdXNlKGhlcml0YWdlQ2xhdXNlLCBbdHMudXBkYXRlRXhwcmVzc2lvbldpdGhUeXBlQXJndW1lbnRzKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlLCB0eXBlLnR5cGVBcmd1bWVudHMgfHwgW10sIGV4cHIpXSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHZpc2l0SW50ZXJmYWNlRGVjbGFyYXRpb24oaWZhY2U6IHRzLkludGVyZmFjZURlY2xhcmF0aW9uKTogdHMuU3RhdGVtZW50W10ge1xuICAgICAgICBjb25zdCBzeW0gPSB0eXBlQ2hlY2tlci5nZXRTeW1ib2xBdExvY2F0aW9uKGlmYWNlLm5hbWUpO1xuICAgICAgICBpZiAoIXN5bSkge1xuICAgICAgICAgIG1vZHVsZVR5cGVUcmFuc2xhdG9yLmVycm9yKGlmYWNlLCAnaW50ZXJmYWNlIHdpdGggbm8gc3ltYm9sJyk7XG4gICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgICAgIC8vIElmIHRoaXMgc3ltYm9sIGlzIGJvdGggYSB0eXBlIGFuZCBhIHZhbHVlLCB3ZSBjYW5ub3QgZW1pdCBib3RoIGludG8gQ2xvc3VyZSdzXG4gICAgICAgIC8vIHNpbmdsZSBuYW1lc3BhY2UuXG4gICAgICAgIGlmIChzeW0uZmxhZ3MgJiB0cy5TeW1ib2xGbGFncy5WYWx1ZSkge1xuICAgICAgICAgIG1vZHVsZVR5cGVUcmFuc2xhdG9yLmRlYnVnV2FybihcbiAgICAgICAgICAgICAgaWZhY2UsIGB0eXBlL3N5bWJvbCBjb25mbGljdCBmb3IgJHtzeW0ubmFtZX0sIHVzaW5nIHs/fSBmb3Igbm93YCk7XG4gICAgICAgICAgcmV0dXJuIFt0cmFuc2Zvcm1lclV0aWwuY3JlYXRlU2luZ2xlTGluZUNvbW1lbnQoXG4gICAgICAgICAgICAgIGlmYWNlLCAnV0FSTklORzogaW50ZXJmYWNlIGhhcyBib3RoIGEgdHlwZSBhbmQgYSB2YWx1ZSwgc2tpcHBpbmcgZW1pdCcpXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHRhZ3MgPSBtb2R1bGVUeXBlVHJhbnNsYXRvci5nZXRKU0RvYyhpZmFjZSwgLyogcmVwb3J0V2FybmluZ3MgKi8gdHJ1ZSkgfHwgW107XG4gICAgICAgIHRhZ3MucHVzaCh7dGFnTmFtZTogJ3JlY29yZCd9KTtcbiAgICAgICAgbWF5YmVBZGRUZW1wbGF0ZUNsYXVzZSh0YWdzLCBpZmFjZSk7XG4gICAgICAgIGlmICghaG9zdC51bnR5cGVkKSB7XG4gICAgICAgICAgbWF5YmVBZGRIZXJpdGFnZUNsYXVzZXModGFncywgbW9kdWxlVHlwZVRyYW5zbGF0b3IsIGlmYWNlKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBuYW1lID0gdHJhbnNmb3JtZXJVdGlsLmdldElkZW50aWZpZXJUZXh0KGlmYWNlLm5hbWUpO1xuICAgICAgICBjb25zdCBtb2RpZmllcnMgPSB0cmFuc2Zvcm1lclV0aWwuaGFzTW9kaWZpZXJGbGFnKGlmYWNlLCB0cy5Nb2RpZmllckZsYWdzLkV4cG9ydCkgP1xuICAgICAgICAgICAgW3RzLmNyZWF0ZVRva2VuKHRzLlN5bnRheEtpbmQuRXhwb3J0S2V5d29yZCldIDpcbiAgICAgICAgICAgIHVuZGVmaW5lZDtcbiAgICAgICAgY29uc3QgZGVjbCA9IHRzLnNldFNvdXJjZU1hcFJhbmdlKFxuICAgICAgICAgICAgdHMuY3JlYXRlRnVuY3Rpb25EZWNsYXJhdGlvbihcbiAgICAgICAgICAgICAgICAvKiBkZWNvcmF0b3JzICovIHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtb2RpZmllcnMsXG4gICAgICAgICAgICAgICAgLyogYXN0ZXJpc2sgKi8gdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG5hbWUsXG4gICAgICAgICAgICAgICAgLyogdHlwZVBhcmFtZXRlcnMgKi8gdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIC8qIHBhcmFtZXRlcnMgKi9bXSxcbiAgICAgICAgICAgICAgICAvKiB0eXBlICovIHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAvKiBib2R5ICovIHRzLmNyZWF0ZUJsb2NrKFtdKSxcbiAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgaWZhY2UpO1xuICAgICAgICBhZGRDb21tZW50T24oZGVjbCwgdGFncyk7XG4gICAgICAgIGNvbnN0IG1lbWJlckRlY2wgPSBjcmVhdGVNZW1iZXJUeXBlRGVjbGFyYXRpb24obW9kdWxlVHlwZVRyYW5zbGF0b3IsIGlmYWNlKTtcbiAgICAgICAgcmV0dXJuIG1lbWJlckRlY2wgPyBbZGVjbCwgbWVtYmVyRGVjbF0gOiBbZGVjbF07XG4gICAgICB9XG5cbiAgICAgIC8qKiBGdW5jdGlvbiBkZWNsYXJhdGlvbnMgYXJlIGVtaXR0ZWQgYXMgdGhleSBhcmUsIHdpdGggb25seSBKU0RvYyBhZGRlZC4gKi9cbiAgICAgIGZ1bmN0aW9uIHZpc2l0RnVuY3Rpb25MaWtlRGVjbGFyYXRpb248VCBleHRlbmRzIHRzLkZ1bmN0aW9uTGlrZURlY2xhcmF0aW9uPihmbkRlY2w6IFQpOiBUIHtcbiAgICAgICAgaWYgKCFmbkRlY2wuYm9keSkge1xuICAgICAgICAgIC8vIFR3byBjYXNlczogYWJzdHJhY3QgbWV0aG9kcyBhbmQgb3ZlcmxvYWRlZCBtZXRob2RzL2Z1bmN0aW9ucy5cbiAgICAgICAgICAvLyBBYnN0cmFjdCBtZXRob2RzIGFyZSBoYW5kbGVkIGluIGVtaXRUeXBlQW5ub3RhdGlvbnNIYW5kbGVyLlxuICAgICAgICAgIC8vIE92ZXJsb2FkcyBhcmUgdW5pb24taXplZCBpbnRvIHRoZSBzaGFyZWQgdHlwZSBpbiBGdW5jdGlvblR5cGUuXG4gICAgICAgICAgcmV0dXJuIHRzLnZpc2l0RWFjaENoaWxkKGZuRGVjbCwgdmlzaXRvciwgY29udGV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZXh0cmFUYWdzID0gW107XG4gICAgICAgIGlmIChoYXNFeHBvcnRpbmdEZWNvcmF0b3IoZm5EZWNsLCB0eXBlQ2hlY2tlcikpIGV4dHJhVGFncy5wdXNoKHt0YWdOYW1lOiAnZXhwb3J0J30pO1xuXG4gICAgICAgIGNvbnN0IHt0YWdzLCB0aGlzUmV0dXJuVHlwZX0gPVxuICAgICAgICAgICAgbW9kdWxlVHlwZVRyYW5zbGF0b3IuZ2V0RnVuY3Rpb25UeXBlSlNEb2MoW2ZuRGVjbF0sIGV4dHJhVGFncyk7XG4gICAgICAgIGNvbnN0IG1qc2RvYyA9IG1vZHVsZVR5cGVUcmFuc2xhdG9yLmdldE11dGFibGVKU0RvYyhmbkRlY2wpO1xuICAgICAgICBtanNkb2MudGFncyA9IHRhZ3M7XG4gICAgICAgIG1qc2RvYy51cGRhdGVDb21tZW50KCk7XG5cbiAgICAgICAgY29uc3QgY29udGV4dFRoaXNUeXBlQmFja3VwID0gY29udGV4dFRoaXNUeXBlO1xuICAgICAgICAvLyBBcnJvdyBmdW5jdGlvbnMgcmV0YWluIHRoZWlyIGNvbnRleHQgYHRoaXNgIHR5cGUuIEFsbCBvdGhlcnMgcmVzZXQgdGhlIHRoaXMgdHlwZSB0b1xuICAgICAgICAvLyBlaXRoZXIgbm9uZSAoaWYgbm90IHNwZWNpZmllZCkgb3IgdGhlIHR5cGUgZ2l2ZW4gaW4gYSBmbih0aGlzOiBULCAuLi4pIGRlY2xhcmF0aW9uLlxuICAgICAgICBpZiAoIXRzLmlzQXJyb3dGdW5jdGlvbihmbkRlY2wpKSBjb250ZXh0VGhpc1R5cGUgPSB0aGlzUmV0dXJuVHlwZTtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gdHMudmlzaXRFYWNoQ2hpbGQoZm5EZWNsLCB2aXNpdG9yLCBjb250ZXh0KTtcbiAgICAgICAgY29udGV4dFRoaXNUeXBlID0gY29udGV4dFRoaXNUeXBlQmFja3VwO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIEluIG1ldGhvZHMgd2l0aCBhIHRlbXBsYXRlZCB0aGlzIHR5cGUsIGFkZHMgZXhwbGljaXQgY2FzdHMgdG8gYWNjZXNzZXMgb24gdGhpcy5cbiAgICAgICAqXG4gICAgICAgKiBAc2VlIGNvbnRleHRUaGlzVHlwZVxuICAgICAgICovXG4gICAgICBmdW5jdGlvbiB2aXNpdFRoaXNFeHByZXNzaW9uKG5vZGU6IHRzLlRoaXNFeHByZXNzaW9uKSB7XG4gICAgICAgIGlmICghY29udGV4dFRoaXNUeXBlKSByZXR1cm4gdHMudmlzaXRFYWNoQ2hpbGQobm9kZSwgdmlzaXRvciwgY29udGV4dCk7XG4gICAgICAgIHJldHVybiBjcmVhdGVDbG9zdXJlQ2FzdChub2RlLCBub2RlLCBjb250ZXh0VGhpc1R5cGUpO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIHZpc2l0VmFyaWFibGVTdGF0ZW1lbnQgZmxhdHRlbnMgdmFyaWFibGUgZGVjbGFyYXRpb24gbGlzdHMgKGB2YXIgYSwgYjtgIHRvIGB2YXIgYTsgdmFyXG4gICAgICAgKiBiO2ApLCBhbmQgYXR0YWNoZXMgSlNEb2MgY29tbWVudHMgdG8gZWFjaCB2YXJpYWJsZS4gSlNEb2MgY29tbWVudHMgcHJlY2VkaW5nIHRoZVxuICAgICAgICogb3JpZ2luYWwgdmFyaWFibGUgYXJlIGF0dGFjaGVkIHRvIHRoZSBmaXJzdCBuZXdseSBjcmVhdGVkIG9uZS5cbiAgICAgICAqL1xuICAgICAgZnVuY3Rpb24gdmlzaXRWYXJpYWJsZVN0YXRlbWVudCh2YXJTdG10OiB0cy5WYXJpYWJsZVN0YXRlbWVudCk6IHRzLlN0YXRlbWVudFtdIHtcbiAgICAgICAgY29uc3Qgc3RtdHM6IHRzLlN0YXRlbWVudFtdID0gW107XG5cbiAgICAgICAgLy8gXCJjb25zdFwiLCBcImxldFwiLCBldGMgYXJlIHN0b3JlZCBpbiBub2RlIGZsYWdzIG9uIHRoZSBkZWNsYXJhdGlvbkxpc3QuXG4gICAgICAgIGNvbnN0IGZsYWdzID0gdHMuZ2V0Q29tYmluZWROb2RlRmxhZ3ModmFyU3RtdC5kZWNsYXJhdGlvbkxpc3QpO1xuXG4gICAgICAgIGxldCB0YWdzOiBqc2RvYy5UYWdbXXxudWxsID1cbiAgICAgICAgICAgIG1vZHVsZVR5cGVUcmFuc2xhdG9yLmdldEpTRG9jKHZhclN0bXQsIC8qIHJlcG9ydFdhcm5pbmdzICovIHRydWUpO1xuICAgICAgICBjb25zdCBsZWFkaW5nID0gdHMuZ2V0U3ludGhldGljTGVhZGluZ0NvbW1lbnRzKHZhclN0bXQpO1xuICAgICAgICBpZiAobGVhZGluZykge1xuICAgICAgICAgIC8vIEF0dGFjaCBub24tSlNEb2MgY29tbWVudHMgdG8gYSBub3QgZW1pdHRlZCBzdGF0ZW1lbnQuXG4gICAgICAgICAgY29uc3QgY29tbWVudEhvbGRlciA9IHRzLmNyZWF0ZU5vdEVtaXR0ZWRTdGF0ZW1lbnQodmFyU3RtdCk7XG4gICAgICAgICAgdHMuc2V0U3ludGhldGljTGVhZGluZ0NvbW1lbnRzKGNvbW1lbnRIb2xkZXIsIGxlYWRpbmcuZmlsdGVyKGMgPT4gYy50ZXh0WzBdICE9PSAnKicpKTtcbiAgICAgICAgICBzdG10cy5wdXNoKGNvbW1lbnRIb2xkZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZGVjbExpc3QgPSB0cy52aXNpdE5vZGUodmFyU3RtdC5kZWNsYXJhdGlvbkxpc3QsIHZpc2l0b3IpO1xuICAgICAgICBmb3IgKGNvbnN0IGRlY2wgb2YgZGVjbExpc3QuZGVjbGFyYXRpb25zKSB7XG4gICAgICAgICAgY29uc3QgbG9jYWxUYWdzOiBqc2RvYy5UYWdbXSA9IFtdO1xuICAgICAgICAgIGlmICh0YWdzKSB7XG4gICAgICAgICAgICAvLyBBZGQgYW55IHRhZ3MgYW5kIGRvY3MgcHJlY2VkaW5nIHRoZSBlbnRpcmUgc3RhdGVtZW50IHRvIHRoZSBmaXJzdCB2YXJpYWJsZS5cbiAgICAgICAgICAgIGxvY2FsVGFncy5wdXNoKC4uLnRhZ3MpO1xuICAgICAgICAgICAgdGFncyA9IG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIEFkZCBhbiBAdHlwZSBmb3IgcGxhaW4gaWRlbnRpZmllcnMsIGJ1dCBub3QgZm9yIGJpbmRpbmdzIHBhdHRlcm5zIChpLmUuIG9iamVjdCBvciBhcnJheVxuICAgICAgICAgIC8vIGRlc3RydWN0dXJpbmcpIC0gdGhvc2UgZG8gbm90IGhhdmUgYSBzeW50YXggaW4gQ2xvc3VyZS5cbiAgICAgICAgICBpZiAodHMuaXNJZGVudGlmaWVyKGRlY2wubmFtZSkpIHtcbiAgICAgICAgICAgIC8vIEZvciB2YXJpYWJsZXMgdGhhdCBhcmUgaW5pdGlhbGl6ZWQgYW5kIHVzZSBhIGJsYWNrbGlzdGVkIHR5cGUsIGRvIG5vdCBlbWl0IGEgdHlwZSBhdFxuICAgICAgICAgICAgLy8gYWxsLiBDbG9zdXJlIENvbXBpbGVyIG1pZ2h0IGJlIGFibGUgdG8gaW5mZXIgYSBiZXR0ZXIgdHlwZSBmcm9tIHRoZSBpbml0aWFsaXplciB0aGFuXG4gICAgICAgICAgICAvLyB0aGUgYD9gIHRoZSBjb2RlIGJlbG93IHdvdWxkIGVtaXQuXG4gICAgICAgICAgICAvLyBUT0RPKG1hcnRpbnByb2JzdCk6IGNvbnNpZGVyIGRvaW5nIHRoaXMgZm9yIGFsbCB0eXBlcyB0aGF0IGdldCBlbWl0dGVkIGFzID8sIG5vdCBqdXN0XG4gICAgICAgICAgICAvLyBmb3IgYmxhY2tsaXN0ZWQgb25lcy5cbiAgICAgICAgICAgIGNvbnN0IGJsYWNrTGlzdGVkSW5pdGlhbGl6ZWQgPVxuICAgICAgICAgICAgICAgICEhZGVjbC5pbml0aWFsaXplciAmJiBtb2R1bGVUeXBlVHJhbnNsYXRvci5pc0JsYWNrTGlzdGVkKGRlY2wpO1xuICAgICAgICAgICAgaWYgKCFibGFja0xpc3RlZEluaXRpYWxpemVkKSB7XG4gICAgICAgICAgICAgIC8vIGdldE9yaWdpbmFsTm9kZShkZWNsKSBpcyByZXF1aXJlZCBiZWNhdXNlIHRoZSB0eXBlIGNoZWNrZXIgY2Fubm90IHR5cGUgY2hlY2tcbiAgICAgICAgICAgICAgLy8gc3ludGhlc2l6ZWQgbm9kZXMuXG4gICAgICAgICAgICAgIGNvbnN0IHR5cGVTdHIgPSBtb2R1bGVUeXBlVHJhbnNsYXRvci50eXBlVG9DbG9zdXJlKHRzLmdldE9yaWdpbmFsTm9kZShkZWNsKSk7XG4gICAgICAgICAgICAgIGxvY2FsVGFncy5wdXNoKHt0YWdOYW1lOiAndHlwZScsIHR5cGU6IHR5cGVTdHJ9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgbmV3U3RtdCA9IHRzLmNyZWF0ZVZhcmlhYmxlU3RhdGVtZW50KFxuICAgICAgICAgICAgICB2YXJTdG10Lm1vZGlmaWVycywgdHMuY3JlYXRlVmFyaWFibGVEZWNsYXJhdGlvbkxpc3QoW2RlY2xdLCBmbGFncykpO1xuICAgICAgICAgIGlmIChsb2NhbFRhZ3MubGVuZ3RoKSBhZGRDb21tZW50T24obmV3U3RtdCwgbG9jYWxUYWdzLCBqc2RvYy5UQUdTX0NPTkZMSUNUSU5HX1dJVEhfVFlQRSk7XG4gICAgICAgICAgc3RtdHMucHVzaChuZXdTdG10KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzdG10cztcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBzaG91bGRFbWl0RXhwb3J0c0Fzc2lnbm1lbnRzIHJldHVybnMgdHJ1ZSBpZiB0c2lja2xlIHNob3VsZCBlbWl0IGBleHBvcnRzLkZvbyA9IC4uLmAgc3R5bGVcbiAgICAgICAqIGV4cG9ydCBzdGF0ZW1lbnRzLlxuICAgICAgICpcbiAgICAgICAqIFR5cGVTY3JpcHQgbW9kdWxlcyBjYW4gZXhwb3J0IHR5cGVzLiBCZWNhdXNlIHR5cGVzIGFyZSBwdXJlIGRlc2lnbi10aW1lIGNvbnN0cnVjdHMgaW5cbiAgICAgICAqIFR5cGVTY3JpcHQsIGl0IGRvZXMgbm90IGVtaXQgYW55IGFjdHVhbCBleHBvcnRlZCBzeW1ib2xzIGZvciB0aGVzZS4gQnV0IHRzaWNrbGUgaGFzIHRvIGVtaXRcbiAgICAgICAqIGFuIGV4cG9ydCwgc28gdGhhdCBkb3duc3RyZWFtIENsb3N1cmUgY29kZSAoaW5jbHVkaW5nIHRzaWNrbGUtY29udmVydGVkIENsb3N1cmUgY29kZSkgY2FuXG4gICAgICAgKiBpbXBvcnQgdXBzdHJlYW0gdHlwZXMuIHRzaWNrbGUgaGFzIHRvIHBpY2sgYSBtb2R1bGUgZm9ybWF0IGZvciB0aGF0LCBiZWNhdXNlIHRoZSBwdXJlIEVTNlxuICAgICAgICogZXhwb3J0IHdvdWxkIGdldCBzdHJpcHBlZCBieSBUeXBlU2NyaXB0LlxuICAgICAgICpcbiAgICAgICAqIHRzaWNrbGUgdXNlcyBDb21tb25KUyB0byBlbWl0IGdvb2dtb2R1bGUsIGFuZCBjb2RlIG5vdCB1c2luZyBnb29nbW9kdWxlIGRvZXNuJ3QgY2FyZSBhYm91dFxuICAgICAgICogdGhlIENsb3N1cmUgYW5ub3RhdGlvbnMgYW55d2F5LCBzbyB0c2lja2xlIHNraXBzIGVtaXR0aW5nIGV4cG9ydHMgaWYgdGhlIG1vZHVsZSB0YXJnZXRcbiAgICAgICAqIGlzbid0IGNvbW1vbmpzLlxuICAgICAgICovXG4gICAgICBmdW5jdGlvbiBzaG91bGRFbWl0RXhwb3J0c0Fzc2lnbm1lbnRzKCkge1xuICAgICAgICByZXR1cm4gdHNPcHRpb25zLm1vZHVsZSA9PT0gdHMuTW9kdWxlS2luZC5Db21tb25KUztcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gdmlzaXRUeXBlQWxpYXNEZWNsYXJhdGlvbih0eXBlQWxpYXM6IHRzLlR5cGVBbGlhc0RlY2xhcmF0aW9uKTogdHMuU3RhdGVtZW50W10ge1xuICAgICAgICAvLyBJZiB0aGUgdHlwZSBpcyBhbHNvIGRlZmluZWQgYXMgYSB2YWx1ZSwgc2tpcCBlbWl0dGluZyBpdC4gQ2xvc3VyZSBjb2xsYXBzZXMgdHlwZSAmIHZhbHVlXG4gICAgICAgIC8vIG5hbWVzcGFjZXMsIHRoZSB0d28gZW1pdHMgd291bGQgY29uZmxpY3QgaWYgdHNpY2tsZSBlbWl0dGVkIGJvdGguXG4gICAgICAgIGNvbnN0IHN5bSA9IG1vZHVsZVR5cGVUcmFuc2xhdG9yLm11c3RHZXRTeW1ib2xBdExvY2F0aW9uKHR5cGVBbGlhcy5uYW1lKTtcbiAgICAgICAgaWYgKHN5bS5mbGFncyAmIHRzLlN5bWJvbEZsYWdzLlZhbHVlKSByZXR1cm4gW107XG4gICAgICAgIC8vIFR5cGUgYWxpYXNlcyBhcmUgYWx3YXlzIGVtaXR0ZWQgYXMgdGhlIHJlc29sdmVkIHVuZGVybHlpbmcgdHlwZSwgc28gdGhlcmUgaXMgbm8gbmVlZCB0b1xuICAgICAgICAvLyBlbWl0IGFueXRoaW5nLCBleGNlcHQgZm9yIGV4cG9ydGVkIHR5cGVzLlxuICAgICAgICBpZiAoIXRyYW5zZm9ybWVyVXRpbC5oYXNNb2RpZmllckZsYWcodHlwZUFsaWFzLCB0cy5Nb2RpZmllckZsYWdzLkV4cG9ydCkpIHJldHVybiBbXTtcbiAgICAgICAgaWYgKCFzaG91bGRFbWl0RXhwb3J0c0Fzc2lnbm1lbnRzKCkpIHJldHVybiBbXTtcblxuICAgICAgICBjb25zdCB0eXBlTmFtZSA9IHR5cGVBbGlhcy5uYW1lLmdldFRleHQoKTtcblxuICAgICAgICAvLyBCbGFja2xpc3QgYW55IHR5cGUgcGFyYW1ldGVycywgQ2xvc3VyZSBkb2VzIG5vdCBzdXBwb3J0IHR5cGUgYWxpYXNlcyB3aXRoIHR5cGVcbiAgICAgICAgLy8gcGFyYW1ldGVycy5cbiAgICAgICAgbW9kdWxlVHlwZVRyYW5zbGF0b3IubmV3VHlwZVRyYW5zbGF0b3IodHlwZUFsaWFzKS5ibGFja2xpc3RUeXBlUGFyYW1ldGVycyhcbiAgICAgICAgICAgIG1vZHVsZVR5cGVUcmFuc2xhdG9yLnN5bWJvbHNUb0FsaWFzZWROYW1lcywgdHlwZUFsaWFzLnR5cGVQYXJhbWV0ZXJzKTtcbiAgICAgICAgY29uc3QgdHlwZVN0ciA9XG4gICAgICAgICAgICBob3N0LnVudHlwZWQgPyAnPycgOiBtb2R1bGVUeXBlVHJhbnNsYXRvci50eXBlVG9DbG9zdXJlKHR5cGVBbGlhcywgdW5kZWZpbmVkKTtcbiAgICAgICAgLy8gSW4gdGhlIGNhc2Ugb2YgYW4gZXhwb3J0LCB3ZSBjYW5ub3QgZW1pdCBhIGBleHBvcnQgdmFyIGZvbztgIGJlY2F1c2UgVHlwZVNjcmlwdCBkcm9wc1xuICAgICAgICAvLyBleHBvcnRzIHRoYXQgYXJlIG5ldmVyIGFzc2lnbmVkIHZhbHVlcywgYW5kIENsb3N1cmUgcmVxdWlyZXMgdXMgdG8gbm90IGFzc2lnbiB2YWx1ZXMgdG9cbiAgICAgICAgLy8gdHlwZWRlZiBleHBvcnRzLiBJbnRyb2R1Y2luZyBhIG5ldyBsb2NhbCB2YXJpYWJsZSBhbmQgZXhwb3J0aW5nIGl0IGNhbiBjYXVzZSBidWdzIGR1ZSB0b1xuICAgICAgICAvLyBuYW1lIHNoYWRvd2luZyBhbmQgY29uZnVzaW5nIFR5cGVTY3JpcHQncyBsb2dpYyBvbiB3aGF0IHN5bWJvbHMgYW5kIHR5cGVzIHZzIHZhbHVlcyBhcmVcbiAgICAgICAgLy8gZXhwb3J0ZWQuIE1hbmdsaW5nIHRoZSBuYW1lIHRvIGF2b2lkIHRoZSBjb25mbGljdHMgd291bGQgYmUgcmVhc29uYWJseSBjbGVhbiwgYnV0IHdvdWxkXG4gICAgICAgIC8vIHJlcXVpcmUgYSB0d28gcGFzcyBlbWl0IHRvIGZpcnN0IGZpbmQgYWxsIHR5cGUgYWxpYXMgbmFtZXMsIG1hbmdsZSB0aGVtLCBhbmQgZW1pdCB0aGUgdXNlXG4gICAgICAgIC8vIHNpdGVzIG9ubHkgbGF0ZXIuIFdpdGggdGhhdCwgdGhlIGZpeCBoZXJlIGlzIHRvIG5ldmVyIGVtaXQgdHlwZSBhbGlhc2VzLCBidXQgYWx3YXlzXG4gICAgICAgIC8vIHJlc29sdmUgdGhlIGFsaWFzIGFuZCBlbWl0IHRoZSB1bmRlcmx5aW5nIHR5cGUgKGZpeGluZyByZWZlcmVuY2VzIGluIHRoZSBsb2NhbCBtb2R1bGUsXG4gICAgICAgIC8vIGFuZCBhbHNvIGFjcm9zcyBtb2R1bGVzKS4gRm9yIGRvd25zdHJlYW0gSmF2YVNjcmlwdCBjb2RlIHRoYXQgaW1wb3J0cyB0aGUgdHlwZWRlZiwgd2VcbiAgICAgICAgLy8gZW1pdCBhbiBcImV4cG9ydC5Gb287XCIgdGhhdCBkZWNsYXJlcyBhbmQgZXhwb3J0cyB0aGUgdHlwZSwgYW5kIGZvciBUeXBlU2NyaXB0IGhhcyBub1xuICAgICAgICAvLyBpbXBhY3QuXG4gICAgICAgIGNvbnN0IHRhZ3MgPSBtb2R1bGVUeXBlVHJhbnNsYXRvci5nZXRKU0RvYyh0eXBlQWxpYXMsIC8qIHJlcG9ydFdhcm5pbmdzICovIHRydWUpO1xuICAgICAgICB0YWdzLnB1c2goe3RhZ05hbWU6ICd0eXBlZGVmJywgdHlwZTogdHlwZVN0cn0pO1xuICAgICAgICBjb25zdCBkZWNsID0gdHMuc2V0U291cmNlTWFwUmFuZ2UoXG4gICAgICAgICAgICB0cy5jcmVhdGVTdGF0ZW1lbnQodHMuY3JlYXRlUHJvcGVydHlBY2Nlc3MoXG4gICAgICAgICAgICAgICAgdHMuY3JlYXRlSWRlbnRpZmllcignZXhwb3J0cycpLCB0cy5jcmVhdGVJZGVudGlmaWVyKHR5cGVOYW1lKSkpLFxuICAgICAgICAgICAgdHlwZUFsaWFzKTtcbiAgICAgICAgYWRkQ29tbWVudE9uKGRlY2wsIHRhZ3MsIGpzZG9jLlRBR1NfQ09ORkxJQ1RJTkdfV0lUSF9UWVBFKTtcbiAgICAgICAgcmV0dXJuIFtkZWNsXTtcbiAgICAgIH1cblxuICAgICAgLyoqIEVtaXRzIGEgcGFyZW50aGVzaXplZCBDbG9zdXJlIGNhc3Q6IGAoLyoqIFxcQHR5cGUgLi4uICogLyAoZXhwcikpYC4gKi9cbiAgICAgIGZ1bmN0aW9uIGNyZWF0ZUNsb3N1cmVDYXN0KGNvbnRleHQ6IHRzLk5vZGUsIGV4cHJlc3Npb246IHRzLkV4cHJlc3Npb24sIHR5cGU6IHRzLlR5cGUpIHtcbiAgICAgICAgY29uc3QgaW5uZXIgPSB0cy5jcmVhdGVQYXJlbihleHByZXNzaW9uKTtcbiAgICAgICAgY29uc3QgY29tbWVudCA9IGFkZENvbW1lbnRPbihcbiAgICAgICAgICAgIGlubmVyLCBbe3RhZ05hbWU6ICd0eXBlJywgdHlwZTogbW9kdWxlVHlwZVRyYW5zbGF0b3IudHlwZVRvQ2xvc3VyZShjb250ZXh0LCB0eXBlKX1dKTtcbiAgICAgICAgY29tbWVudC5oYXNUcmFpbGluZ05ld0xpbmUgPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuIHRzLnNldFNvdXJjZU1hcFJhbmdlKHRzLmNyZWF0ZVBhcmVuKGlubmVyKSwgY29udGV4dCk7XG4gICAgICB9XG5cbiAgICAgIC8qKiBDb252ZXJ0cyBhIFR5cGVTY3JpcHQgdHlwZSBhc3NlcnRpb24gaW50byBhIENsb3N1cmUgQ2FzdC4gKi9cbiAgICAgIGZ1bmN0aW9uIHZpc2l0QXNzZXJ0aW9uRXhwcmVzc2lvbihhc3NlcnRpb246IHRzLkFzc2VydGlvbkV4cHJlc3Npb24pIHtcbiAgICAgICAgY29uc3QgdHlwZSA9IHR5cGVDaGVja2VyLmdldFR5cGVBdExvY2F0aW9uKGFzc2VydGlvbi50eXBlKTtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUNsb3N1cmVDYXN0KGFzc2VydGlvbiwgdHMudmlzaXRFYWNoQ2hpbGQoYXNzZXJ0aW9uLCB2aXNpdG9yLCBjb250ZXh0KSwgdHlwZSk7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogQ29udmVydHMgYSBUeXBlU2NyaXB0IG5vbi1udWxsIGFzc2VydGlvbiBpbnRvIGEgQ2xvc3VyZSBDYXN0LCBieSBzdHJpcHBpbmcgfG51bGwgYW5kXG4gICAgICAgKiB8dW5kZWZpbmVkIGZyb20gYSB1bmlvbiB0eXBlLlxuICAgICAgICovXG4gICAgICBmdW5jdGlvbiB2aXNpdE5vbk51bGxFeHByZXNzaW9uKG5vbk51bGw6IHRzLk5vbk51bGxFeHByZXNzaW9uKSB7XG4gICAgICAgIGNvbnN0IHR5cGUgPSB0eXBlQ2hlY2tlci5nZXRUeXBlQXRMb2NhdGlvbihub25OdWxsLmV4cHJlc3Npb24pO1xuICAgICAgICBjb25zdCBub25OdWxsVHlwZSA9IHR5cGVDaGVja2VyLmdldE5vbk51bGxhYmxlVHlwZSh0eXBlKTtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUNsb3N1cmVDYXN0KFxuICAgICAgICAgICAgbm9uTnVsbCwgdHMudmlzaXRFYWNoQ2hpbGQobm9uTnVsbCwgdmlzaXRvciwgY29udGV4dCksIG5vbk51bGxUeXBlKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gdmlzaXRJbXBvcnREZWNsYXJhdGlvbihpbXBvcnREZWNsOiB0cy5JbXBvcnREZWNsYXJhdGlvbikge1xuICAgICAgICAvLyBGb3IgZWFjaCBpbXBvcnQsIGluc2VydCBhIGdvb2cucmVxdWlyZVR5cGUgZm9yIHRoZSBtb2R1bGUsIHNvIHRoYXQgaWYgVHlwZVNjcmlwdCBkb2VzIG5vdFxuICAgICAgICAvLyBlbWl0IHRoZSBtb2R1bGUgYmVjYXVzZSBpdCdzIG9ubHkgdXNlZCBpbiB0eXBlIHBvc2l0aW9ucywgdGhlIEpTRG9jIGNvbW1lbnRzIHN0aWxsXG4gICAgICAgIC8vIHJlZmVyZW5jZSBhIHZhbGlkIENsb3N1cmUgbGV2ZWwgc3ltYm9sLlxuXG4gICAgICAgIC8vIE5vIG5lZWQgdG8gcmVxdWlyZVR5cGUgc2lkZSBlZmZlY3QgaW1wb3J0cy5cbiAgICAgICAgaWYgKCFpbXBvcnREZWNsLmltcG9ydENsYXVzZSkgcmV0dXJuIGltcG9ydERlY2w7XG5cbiAgICAgICAgY29uc3Qgc3ltID0gdHlwZUNoZWNrZXIuZ2V0U3ltYm9sQXRMb2NhdGlvbihpbXBvcnREZWNsLm1vZHVsZVNwZWNpZmllcik7XG4gICAgICAgIC8vIFNjcmlwdHMgZG8gbm90IGhhdmUgYSBzeW1ib2wsIGFuZCBuZWl0aGVyIGRvIHVudXNlZCBtb2R1bGVzLiBTY3JpcHRzIGNhbiBzdGlsbCBiZVxuICAgICAgICAvLyBpbXBvcnRlZCwgZWl0aGVyIGFzIHNpZGUgZWZmZWN0IGltcG9ydHMgb3Igd2l0aCBhbiBlbXB0eSBpbXBvcnQgc2V0IChcInt9XCIpLiBUeXBlU2NyaXB0XG4gICAgICAgIC8vIGRvZXMgbm90IGVtaXQgYSBydW50aW1lIGxvYWQgZm9yIGFuIGltcG9ydCB3aXRoIGFuIGVtcHR5IGxpc3Qgb2Ygc3ltYm9scywgYnV0IHRoZSBpbXBvcnRcbiAgICAgICAgLy8gZm9yY2VzIGFueSBnbG9iYWwgZGVjbGFyYXRpb25zIGZyb20gdGhlIGxpYnJhcnkgdG8gYmUgdmlzaWJsZSwgd2hpY2ggaXMgd2hhdCB1c2VycyB1c2VcbiAgICAgICAgLy8gdGhpcyBmb3IuIE5vIHN5bWJvbHMgZnJvbSB0aGUgc2NyaXB0IG5lZWQgcmVxdWlyZVR5cGUsIHNvIGp1c3QgcmV0dXJuLlxuICAgICAgICAvLyBUT0RPKGV2bWFyKTogcmV2aXNpdCB0aGlzLiAgSWYgVFMgbmVlZHMgdG8gc2VlIHRoZSBtb2R1bGUgaW1wb3J0LCBpdCdzIGxpa2VseSBDbG9zdXJlXG4gICAgICAgIC8vIGRvZXMgdG9vLlxuICAgICAgICBpZiAoIXN5bSkgcmV0dXJuIGltcG9ydERlY2w7XG5cbiAgICAgICAgY29uc3QgaW1wb3J0UGF0aCA9IGdvb2dtb2R1bGUucmVzb2x2ZU1vZHVsZU5hbWUoXG4gICAgICAgICAgICB7b3B0aW9uczogdHNPcHRpb25zLCBtb2R1bGVSZXNvbHV0aW9uSG9zdH0sIHNvdXJjZUZpbGUuZmlsZU5hbWUsXG4gICAgICAgICAgICAoaW1wb3J0RGVjbC5tb2R1bGVTcGVjaWZpZXIgYXMgdHMuU3RyaW5nTGl0ZXJhbCkudGV4dCk7XG5cbiAgICAgICAgbW9kdWxlVHlwZVRyYW5zbGF0b3IucmVxdWlyZVR5cGUoXG4gICAgICAgICAgICBpbXBvcnRQYXRoLCBzeW0sIC8qIGlzRXhwbGljaXRseUltcG9ydGVkPyAqLyB0cnVlLFxuICAgICAgICAgICAgLyogZGVmYXVsdCBpbXBvcnQ/ICovICEhaW1wb3J0RGVjbC5pbXBvcnRDbGF1c2UubmFtZSk7XG4gICAgICAgIHJldHVybiBpbXBvcnREZWNsO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIENsb3N1cmUgQ29tcGlsZXIgd2lsbCBmYWlsIHdoZW4gaXQgZmluZHMgaW5jb3JyZWN0IEpTRG9jIHRhZ3Mgb24gbm9kZXMuIFRoaXMgZnVuY3Rpb25cbiAgICAgICAqIHBhcnNlcyBhbmQgdGhlbiByZS1zZXJpYWxpemVzIEpTRG9jIGNvbW1lbnRzLCBlc2NhcGluZyBvciByZW1vdmluZyBpbGxlZ2FsIHRhZ3MuXG4gICAgICAgKi9cbiAgICAgIGZ1bmN0aW9uIGVzY2FwZUlsbGVnYWxKU0RvYyhub2RlOiB0cy5Ob2RlKSB7XG4gICAgICAgIGNvbnN0IG1qc2RvYyA9IG1vZHVsZVR5cGVUcmFuc2xhdG9yLmdldE11dGFibGVKU0RvYyhub2RlKTtcbiAgICAgICAgbWpzZG9jLnVwZGF0ZUNvbW1lbnQoKTtcbiAgICAgIH1cblxuICAgICAgLyoqIFJldHVybnMgdHJ1ZSBpZiBhIHZhbHVlIGV4cG9ydCBzaG91bGQgYmUgZW1pdHRlZCBmb3IgdGhlIGdpdmVuIHN5bWJvbCBpbiBleHBvcnQgKi4gKi9cbiAgICAgIGZ1bmN0aW9uIHNob3VsZEVtaXRWYWx1ZUV4cG9ydEZvclN5bWJvbChzeW06IHRzLlN5bWJvbCk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAoc3ltLmZsYWdzICYgdHMuU3ltYm9sRmxhZ3MuQWxpYXMpIHtcbiAgICAgICAgICBzeW0gPSB0eXBlQ2hlY2tlci5nZXRBbGlhc2VkU3ltYm9sKHN5bSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKChzeW0uZmxhZ3MgJiB0cy5TeW1ib2xGbGFncy5WYWx1ZSkgPT09IDApIHtcbiAgICAgICAgICAvLyBOb3RlOiBXZSBjcmVhdGUgZXhwbGljaXQgZXhwb3J0cyBvZiB0eXBlIHN5bWJvbHMgZm9yIGNsb3N1cmUgaW4gdmlzaXRFeHBvcnREZWNsYXJhdGlvbi5cbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0c09wdGlvbnMucHJlc2VydmVDb25zdEVudW1zICYmIHN5bS5mbGFncyAmIHRzLlN5bWJvbEZsYWdzLkNvbnN0RW51bSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiB2aXNpdEV4cG9ydERlY2xhcmF0aW9uIHJlcXVpcmVUeXBlcyBleHBvcnRlZCBtb2R1bGVzIGFuZCBlbWl0cyBleHBsaWNpdCBleHBvcnRzIGZvclxuICAgICAgICogdHlwZXMgKHdoaWNoIG5vcm1hbGx5IGRvIG5vdCBnZXQgZW1pdHRlZCBieSBUeXBlU2NyaXB0KS5cbiAgICAgICAqL1xuICAgICAgZnVuY3Rpb24gdmlzaXRFeHBvcnREZWNsYXJhdGlvbihleHBvcnREZWNsOiB0cy5FeHBvcnREZWNsYXJhdGlvbik6IHRzLk5vZGV8dHMuTm9kZVtdIHtcbiAgICAgICAgY29uc3QgaW1wb3J0ZWRNb2R1bGVTeW1ib2wgPSBleHBvcnREZWNsLm1vZHVsZVNwZWNpZmllciAmJlxuICAgICAgICAgICAgdHlwZUNoZWNrZXIuZ2V0U3ltYm9sQXRMb2NhdGlvbihleHBvcnREZWNsLm1vZHVsZVNwZWNpZmllcikhO1xuICAgICAgICBpZiAoaW1wb3J0ZWRNb2R1bGVTeW1ib2wpIHtcbiAgICAgICAgICAvLyByZXF1aXJlVHlwZSBhbGwgZXhwbGljaXRseSBpbXBvcnRlZCBtb2R1bGVzLCBzbyB0aGF0IHN5bWJvbHMgY2FuIGJlIHJlZmVyZW5jZWQgYW5kXG4gICAgICAgICAgLy8gdHlwZSBvbmx5IG1vZHVsZXMgYXJlIHVzYWJsZSBmcm9tIHR5cGUgZGVjbGFyYXRpb25zLlxuICAgICAgICAgIG1vZHVsZVR5cGVUcmFuc2xhdG9yLnJlcXVpcmVUeXBlKFxuICAgICAgICAgICAgICAoZXhwb3J0RGVjbC5tb2R1bGVTcGVjaWZpZXIgYXMgdHMuU3RyaW5nTGl0ZXJhbCkudGV4dCwgaW1wb3J0ZWRNb2R1bGVTeW1ib2wsXG4gICAgICAgICAgICAgIC8qIGlzRXhwbGljaXRseUltcG9ydGVkPyAqLyB0cnVlLCAvKiBkZWZhdWx0IGltcG9ydD8gKi8gZmFsc2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdHlwZXNUb0V4cG9ydDogQXJyYXk8W3N0cmluZywgdHMuU3ltYm9sXT4gPSBbXTtcbiAgICAgICAgaWYgKCFleHBvcnREZWNsLmV4cG9ydENsYXVzZSkge1xuICAgICAgICAgIC8vIGV4cG9ydCAqIGZyb20gJy4uLidcbiAgICAgICAgICAvLyBSZXNvbHZlIHRoZSAqIGludG8gYWxsIHZhbHVlIHN5bWJvbHMgZXhwb3J0ZWQsIGFuZCB1cGRhdGUgdGhlIGV4cG9ydCBkZWNsYXJhdGlvbi5cblxuICAgICAgICAgIC8vIEV4cGxpY2l0bHkgc3BlbGxlZCBvdXQgZXhwb3J0cyAoaS5lLiB0aGUgZXhwb3J0cyBvZiB0aGUgY3VycmVudCBtb2R1bGUpIHRha2UgcHJlY2VkZW5jZVxuICAgICAgICAgIC8vIG92ZXIgaW1wbGljaXQgb25lcyBmcm9tIGV4cG9ydCAqLiBVc2UgdGhlIGN1cnJlbnQgbW9kdWxlJ3MgZXhwb3J0cyB0byBmaWx0ZXIuXG4gICAgICAgICAgY29uc3QgY3VycmVudE1vZHVsZVN5bWJvbCA9IHR5cGVDaGVja2VyLmdldFN5bWJvbEF0TG9jYXRpb24oc291cmNlRmlsZSk7XG4gICAgICAgICAgY29uc3QgY3VycmVudE1vZHVsZUV4cG9ydHMgPSBjdXJyZW50TW9kdWxlU3ltYm9sICYmIGN1cnJlbnRNb2R1bGVTeW1ib2wuZXhwb3J0cztcblxuICAgICAgICAgIGlmICghaW1wb3J0ZWRNb2R1bGVTeW1ib2wpIHtcbiAgICAgICAgICAgIG1vZHVsZVR5cGVUcmFuc2xhdG9yLmVycm9yKGV4cG9ydERlY2wsIGBleHBvcnQgKiB3aXRob3V0IG1vZHVsZSBzeW1ib2xgKTtcbiAgICAgICAgICAgIHJldHVybiBleHBvcnREZWNsO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zdCBleHBvcnRlZFN5bWJvbHMgPSB0eXBlQ2hlY2tlci5nZXRFeHBvcnRzT2ZNb2R1bGUoaW1wb3J0ZWRNb2R1bGVTeW1ib2wpO1xuICAgICAgICAgIGNvbnN0IGV4cG9ydFNwZWNpZmllcnM6IHRzLkV4cG9ydFNwZWNpZmllcltdID0gW107XG4gICAgICAgICAgZm9yIChjb25zdCBzeW0gb2YgZXhwb3J0ZWRTeW1ib2xzKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudE1vZHVsZUV4cG9ydHMgJiYgY3VycmVudE1vZHVsZUV4cG9ydHMuaGFzKHN5bS5lc2NhcGVkTmFtZSkpIGNvbnRpbnVlO1xuICAgICAgICAgICAgLy8gV2UgbWlnaHQgaGF2ZSBhbHJlYWR5IGdlbmVyYXRlZCBhbiBleHBvcnQgZm9yIHRoZSBnaXZlbiBzeW1ib2wuXG4gICAgICAgICAgICBpZiAoZXhwYW5kZWRTdGFySW1wb3J0cy5oYXMoc3ltLm5hbWUpKSBjb250aW51ZTtcbiAgICAgICAgICAgIGV4cGFuZGVkU3RhckltcG9ydHMuYWRkKHN5bS5uYW1lKTtcbiAgICAgICAgICAgIC8vIE9ubHkgY3JlYXRlIGFuIGV4cG9ydCBzcGVjaWZpZXIgZm9yIHZhbHVlcyB0aGF0IGFyZSBleHBvcnRlZC4gRm9yIHR5cGVzLCB0aGUgY29kZVxuICAgICAgICAgICAgLy8gYmVsb3cgY3JlYXRlcyBzcGVjaWZpYyBleHBvcnQgc3RhdGVtZW50cyB0aGF0IG1hdGNoIENsb3N1cmUncyBleHBlY3RhdGlvbnMuXG4gICAgICAgICAgICBpZiAoc2hvdWxkRW1pdFZhbHVlRXhwb3J0Rm9yU3ltYm9sKHN5bSkpIHtcbiAgICAgICAgICAgICAgZXhwb3J0U3BlY2lmaWVycy5wdXNoKHRzLmNyZWF0ZUV4cG9ydFNwZWNpZmllcih1bmRlZmluZWQsIHN5bS5uYW1lKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0eXBlc1RvRXhwb3J0LnB1c2goW3N5bS5uYW1lLCBzeW1dKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgZXhwb3J0RGVjbCA9IHRzLnVwZGF0ZUV4cG9ydERlY2xhcmF0aW9uKFxuICAgICAgICAgICAgICBleHBvcnREZWNsLCBleHBvcnREZWNsLmRlY29yYXRvcnMsIGV4cG9ydERlY2wubW9kaWZpZXJzLFxuICAgICAgICAgICAgICB0cy5jcmVhdGVOYW1lZEV4cG9ydHMoZXhwb3J0U3BlY2lmaWVycyksIGV4cG9ydERlY2wubW9kdWxlU3BlY2lmaWVyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmb3IgKGNvbnN0IGV4cCBvZiBleHBvcnREZWNsLmV4cG9ydENsYXVzZS5lbGVtZW50cykge1xuICAgICAgICAgICAgY29uc3QgZXhwb3J0ZWROYW1lID0gdHJhbnNmb3JtZXJVdGlsLmdldElkZW50aWZpZXJUZXh0KGV4cC5uYW1lKTtcbiAgICAgICAgICAgIHR5cGVzVG9FeHBvcnQucHVzaChcbiAgICAgICAgICAgICAgICBbZXhwb3J0ZWROYW1lLCBtb2R1bGVUeXBlVHJhbnNsYXRvci5tdXN0R2V0U3ltYm9sQXRMb2NhdGlvbihleHAubmFtZSldKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gRG8gbm90IGVtaXQgdHlwZWRlZiByZS1leHBvcnRzIGluIHVudHlwZWQgbW9kZS5cbiAgICAgICAgaWYgKGhvc3QudW50eXBlZCkgcmV0dXJuIGV4cG9ydERlY2w7XG5cbiAgICAgICAgY29uc3QgcmVzdWx0OiB0cy5Ob2RlW10gPSBbZXhwb3J0RGVjbF07XG4gICAgICAgIGZvciAoY29uc3QgW2V4cG9ydGVkTmFtZSwgc3ltXSBvZiB0eXBlc1RvRXhwb3J0KSB7XG4gICAgICAgICAgbGV0IGFsaWFzZWRTeW1ib2wgPSBzeW07XG4gICAgICAgICAgaWYgKHN5bS5mbGFncyAmIHRzLlN5bWJvbEZsYWdzLkFsaWFzKSB7XG4gICAgICAgICAgICBhbGlhc2VkU3ltYm9sID0gdHlwZUNoZWNrZXIuZ2V0QWxpYXNlZFN5bWJvbChzeW0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zdCBpc1R5cGVBbGlhcyA9IChhbGlhc2VkU3ltYm9sLmZsYWdzICYgdHMuU3ltYm9sRmxhZ3MuVmFsdWUpID09PSAwICYmXG4gICAgICAgICAgICAgIChhbGlhc2VkU3ltYm9sLmZsYWdzICYgKHRzLlN5bWJvbEZsYWdzLlR5cGVBbGlhcyB8IHRzLlN5bWJvbEZsYWdzLkludGVyZmFjZSkpICE9PSAwO1xuICAgICAgICAgIGlmICghaXNUeXBlQWxpYXMpIGNvbnRpbnVlO1xuICAgICAgICAgIGNvbnN0IHR5cGVOYW1lID1cbiAgICAgICAgICAgICAgbW9kdWxlVHlwZVRyYW5zbGF0b3Iuc3ltYm9sc1RvQWxpYXNlZE5hbWVzLmdldChhbGlhc2VkU3ltYm9sKSB8fCBhbGlhc2VkU3ltYm9sLm5hbWU7XG4gICAgICAgICAgY29uc3Qgc3RtdCA9IHRzLmNyZWF0ZVN0YXRlbWVudChcbiAgICAgICAgICAgICAgdHMuY3JlYXRlUHJvcGVydHlBY2Nlc3ModHMuY3JlYXRlSWRlbnRpZmllcignZXhwb3J0cycpLCBleHBvcnRlZE5hbWUpKTtcbiAgICAgICAgICBhZGRDb21tZW50T24oc3RtdCwgW3t0YWdOYW1lOiAndHlwZWRlZicsIHR5cGU6ICchJyArIHR5cGVOYW1lfV0pO1xuICAgICAgICAgIHRzLmFkZFN5bnRoZXRpY1RyYWlsaW5nQ29tbWVudChcbiAgICAgICAgICAgICAgc3RtdCwgdHMuU3ludGF4S2luZC5TaW5nbGVMaW5lQ29tbWVudFRyaXZpYSwgJyByZS1leHBvcnQgdHlwZWRlZicsIHRydWUpO1xuICAgICAgICAgIHJlc3VsdC5wdXNoKHN0bXQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogUmV0dXJucyB0aGUgaWRlbnRpZmllcnMgZXhwb3J0ZWQgaW4gYSBzaW5nbGUgZXhwb3J0ZWQgc3RhdGVtZW50IC0gdHlwaWNhbGx5IGp1c3Qgb25lXG4gICAgICAgKiBpZGVudGlmaWVyIChlLmcuIGZvciBgZXhwb3J0IGZ1bmN0aW9uIGZvbygpYCksIGJ1dCBtdWx0aXBsZSBmb3IgYGV4cG9ydCBkZWNsYXJlIHZhciBhLCBiYC5cbiAgICAgICAqL1xuICAgICAgZnVuY3Rpb24gZ2V0RXhwb3J0RGVjbGFyYXRpb25OYW1lcyhub2RlOiB0cy5Ob2RlKTogdHMuSWRlbnRpZmllcltdIHtcbiAgICAgICAgc3dpdGNoIChub2RlLmtpbmQpIHtcbiAgICAgICAgICBjYXNlIHRzLlN5bnRheEtpbmQuVmFyaWFibGVTdGF0ZW1lbnQ6XG4gICAgICAgICAgICBjb25zdCB2YXJEZWNsID0gbm9kZSBhcyB0cy5WYXJpYWJsZVN0YXRlbWVudDtcbiAgICAgICAgICAgIHJldHVybiB2YXJEZWNsLmRlY2xhcmF0aW9uTGlzdC5kZWNsYXJhdGlvbnMubWFwKChkKSA9PiBnZXRFeHBvcnREZWNsYXJhdGlvbk5hbWVzKGQpWzBdKTtcbiAgICAgICAgICBjYXNlIHRzLlN5bnRheEtpbmQuVmFyaWFibGVEZWNsYXJhdGlvbjpcbiAgICAgICAgICBjYXNlIHRzLlN5bnRheEtpbmQuRnVuY3Rpb25EZWNsYXJhdGlvbjpcbiAgICAgICAgICBjYXNlIHRzLlN5bnRheEtpbmQuSW50ZXJmYWNlRGVjbGFyYXRpb246XG4gICAgICAgICAgY2FzZSB0cy5TeW50YXhLaW5kLkNsYXNzRGVjbGFyYXRpb246XG4gICAgICAgICAgY2FzZSB0cy5TeW50YXhLaW5kLk1vZHVsZURlY2xhcmF0aW9uOlxuICAgICAgICAgIGNhc2UgdHMuU3ludGF4S2luZC5FbnVtRGVjbGFyYXRpb246XG4gICAgICAgICAgICBjb25zdCBkZWNsID0gbm9kZSBhcyB0cy5OYW1lZERlY2xhcmF0aW9uO1xuICAgICAgICAgICAgaWYgKCFkZWNsLm5hbWUgfHwgZGVjbC5uYW1lLmtpbmQgIT09IHRzLlN5bnRheEtpbmQuSWRlbnRpZmllcikge1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBbZGVjbC5uYW1lXTtcbiAgICAgICAgICBjYXNlIHRzLlN5bnRheEtpbmQuVHlwZUFsaWFzRGVjbGFyYXRpb246XG4gICAgICAgICAgICBjb25zdCB0eXBlQWxpYXMgPSBub2RlIGFzIHRzLlR5cGVBbGlhc0RlY2xhcmF0aW9uO1xuICAgICAgICAgICAgcmV0dXJuIFt0eXBlQWxpYXMubmFtZV07XG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIG1vZHVsZVR5cGVUcmFuc2xhdG9yLmVycm9yKFxuICAgICAgICAgICAgbm9kZSwgYHVuc3VwcG9ydGVkIGV4cG9ydCBkZWNsYXJhdGlvbiAke3RzLlN5bnRheEtpbmRbbm9kZS5raW5kXX06ICR7bm9kZS5nZXRUZXh0KCl9YCk7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBBbWJpZW50IGRlY2xhcmF0aW9ucyBkZWNsYXJlIHR5cGVzIGZvciBUeXBlU2NyaXB0J3MgYmVuZWZpdCwgYW5kIHdpbGwgYmUgcmVtb3ZlZGUgYnlcbiAgICAgICAqIFR5cGVTY3JpcHQgZHVyaW5nIGl0cyBlbWl0IHBoYXNlLiBEb3duc3RyZWFtIENsb3N1cmUgY29kZSBob3dldmVyIG1pZ2h0IGJlIGltcG9ydGluZ1xuICAgICAgICogc3ltYm9scyBmcm9tIHRoaXMgbW9kdWxlLCBzbyB0c2lja2xlIG11c3QgZW1pdCBhIENsb3N1cmUtY29tcGF0aWJsZSBleHBvcnRzIGRlY2xhcmF0aW9uLlxuICAgICAgICovXG4gICAgICBmdW5jdGlvbiB2aXNpdEV4cG9ydGVkQW1iaWVudChub2RlOiB0cy5Ob2RlKTogdHMuTm9kZVtdIHtcbiAgICAgICAgaWYgKGhvc3QudW50eXBlZCB8fCAhc2hvdWxkRW1pdEV4cG9ydHNBc3NpZ25tZW50cygpKSByZXR1cm4gW25vZGVdO1xuXG4gICAgICAgIGNvbnN0IGRlY2xOYW1lcyA9IGdldEV4cG9ydERlY2xhcmF0aW9uTmFtZXMobm9kZSk7XG4gICAgICAgIGNvbnN0IHJlc3VsdDogdHMuTm9kZVtdID0gW25vZGVdO1xuICAgICAgICBmb3IgKGNvbnN0IGRlY2wgb2YgZGVjbE5hbWVzKSB7XG4gICAgICAgICAgY29uc3Qgc3ltID0gdHlwZUNoZWNrZXIuZ2V0U3ltYm9sQXRMb2NhdGlvbihkZWNsKSE7XG4gICAgICAgICAgY29uc3QgaXNWYWx1ZSA9IHN5bS5mbGFncyAmIHRzLlN5bWJvbEZsYWdzLlZhbHVlO1xuICAgICAgICAgIC8vIE5vbi12YWx1ZSBvYmplY3RzIGRvIG5vdCBleGlzdCBhdCBydW50aW1lLCBzbyB3ZSBjYW5ub3QgYWNjZXNzIHRoZSBzeW1ib2wgKGl0IG9ubHlcbiAgICAgICAgICAvLyBleGlzdHMgaW4gZXh0ZXJucykuIEV4cG9ydCB0aGVtIGFzIGEgdHlwZWRlZiwgd2hpY2ggZm9yd2FyZHMgdG8gdGhlIHR5cGUgaW4gZXh0ZXJucy5cbiAgICAgICAgICAvLyBOb3RlOiBUeXBlU2NyaXB0IGVtaXRzIG9kZCBjb2RlIGZvciBleHBvcnRlZCBhbWJpZW50cyAoZXhwb3J0cy54IGZvciB2YXJpYWJsZXMsIGp1c3QgeFxuICAgICAgICAgIC8vIGZvciBldmVyeXRoaW5nIGVsc2UpLiBUaGF0IHNlZW1zIGJ1Z2d5LCBhbmQgaW4gZWl0aGVyIGNhc2UgdGhpcyBjb2RlIHNob3VsZCBub3QgYXR0ZW1wdFxuICAgICAgICAgIC8vIHRvIGZpeCBpdC5cbiAgICAgICAgICAvLyBTZWUgYWxzbyBodHRwczovL2dpdGh1Yi5jb20vTWljcm9zb2Z0L1R5cGVTY3JpcHQvaXNzdWVzLzgwMTUuXG4gICAgICAgICAgaWYgKCFpc1ZhbHVlKSB7XG4gICAgICAgICAgICAvLyBEbyBub3QgZW1pdCByZS1leHBvcnRzIGZvciBNb2R1bGVEZWNsYXJhdGlvbnMuXG4gICAgICAgICAgICAvLyBBbWJpZW50IE1vZHVsZURlY2xhcmF0aW9ucyBhcmUgYWx3YXlzIHJlZmVyZW5jZWQgYXMgZ2xvYmFsIHN5bWJvbHMsIHNvIHRoZXkgZG9uJ3RcbiAgICAgICAgICAgIC8vIG5lZWQgdG8gYmUgZXhwb3J0ZWQuXG4gICAgICAgICAgICBpZiAobm9kZS5raW5kID09PSB0cy5TeW50YXhLaW5kLk1vZHVsZURlY2xhcmF0aW9uKSBjb250aW51ZTtcbiAgICAgICAgICAgIGNvbnN0IG1hbmdsZWROYW1lID0gbW9kdWxlTmFtZUFzSWRlbnRpZmllcihob3N0LCBzb3VyY2VGaWxlLmZpbGVOYW1lKTtcbiAgICAgICAgICAgIGNvbnN0IGRlY2xOYW1lID0gdHJhbnNmb3JtZXJVdGlsLmdldElkZW50aWZpZXJUZXh0KGRlY2wpO1xuICAgICAgICAgICAgY29uc3Qgc3RtdCA9IHRzLmNyZWF0ZVN0YXRlbWVudChcbiAgICAgICAgICAgICAgICB0cy5jcmVhdGVQcm9wZXJ0eUFjY2Vzcyh0cy5jcmVhdGVJZGVudGlmaWVyKCdleHBvcnRzJyksIGRlY2xOYW1lKSk7XG4gICAgICAgICAgICBhZGRDb21tZW50T24oc3RtdCwgW3t0YWdOYW1lOiAndHlwZWRlZicsIHR5cGU6IGAhJHttYW5nbGVkTmFtZX0uJHtkZWNsTmFtZX1gfV0pO1xuICAgICAgICAgICAgcmVzdWx0LnB1c2goc3RtdCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHZpc2l0b3Iobm9kZTogdHMuTm9kZSk6IHRzLk5vZGV8dHMuTm9kZVtdIHtcbiAgICAgICAgaWYgKHRyYW5zZm9ybWVyVXRpbC5pc0FtYmllbnQobm9kZSkpIHtcbiAgICAgICAgICBpZiAoIXRyYW5zZm9ybWVyVXRpbC5oYXNNb2RpZmllckZsYWcobm9kZSBhcyB0cy5EZWNsYXJhdGlvbiwgdHMuTW9kaWZpZXJGbGFncy5FeHBvcnQpKSB7XG4gICAgICAgICAgICByZXR1cm4gbm9kZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHZpc2l0RXhwb3J0ZWRBbWJpZW50KG5vZGUpO1xuICAgICAgICB9XG4gICAgICAgIHN3aXRjaCAobm9kZS5raW5kKSB7XG4gICAgICAgICAgY2FzZSB0cy5TeW50YXhLaW5kLkltcG9ydERlY2xhcmF0aW9uOlxuICAgICAgICAgICAgcmV0dXJuIHZpc2l0SW1wb3J0RGVjbGFyYXRpb24obm9kZSBhcyB0cy5JbXBvcnREZWNsYXJhdGlvbik7XG4gICAgICAgICAgY2FzZSB0cy5TeW50YXhLaW5kLkV4cG9ydERlY2xhcmF0aW9uOlxuICAgICAgICAgICAgcmV0dXJuIHZpc2l0RXhwb3J0RGVjbGFyYXRpb24obm9kZSBhcyB0cy5FeHBvcnREZWNsYXJhdGlvbik7XG4gICAgICAgICAgY2FzZSB0cy5TeW50YXhLaW5kLkNsYXNzRGVjbGFyYXRpb246XG4gICAgICAgICAgICByZXR1cm4gdmlzaXRDbGFzc0RlY2xhcmF0aW9uKG5vZGUgYXMgdHMuQ2xhc3NEZWNsYXJhdGlvbik7XG4gICAgICAgICAgY2FzZSB0cy5TeW50YXhLaW5kLkludGVyZmFjZURlY2xhcmF0aW9uOlxuICAgICAgICAgICAgcmV0dXJuIHZpc2l0SW50ZXJmYWNlRGVjbGFyYXRpb24obm9kZSBhcyB0cy5JbnRlcmZhY2VEZWNsYXJhdGlvbik7XG4gICAgICAgICAgY2FzZSB0cy5TeW50YXhLaW5kLkhlcml0YWdlQ2xhdXNlOlxuICAgICAgICAgICAgcmV0dXJuIHZpc2l0SGVyaXRhZ2VDbGF1c2Uobm9kZSBhcyB0cy5IZXJpdGFnZUNsYXVzZSk7XG4gICAgICAgICAgY2FzZSB0cy5TeW50YXhLaW5kLkFycm93RnVuY3Rpb246XG4gICAgICAgICAgY2FzZSB0cy5TeW50YXhLaW5kLkZ1bmN0aW9uRXhwcmVzc2lvbjpcbiAgICAgICAgICAgIC8vIEluc2VydGluZyBhIGNvbW1lbnQgYmVmb3JlIGFuIGV4cHJlc3Npb24gY2FuIHRyaWdnZXIgYXV0b21hdGljIHNlbWljb2xvbiBpbnNlcnRpb24sXG4gICAgICAgICAgICAvLyBlLmcuIGlmIHRoZSBmdW5jdGlvbiBiZWxvdyBpcyB0aGUgZXhwcmVzc2lvbiBpbiBhIGByZXR1cm5gIHN0YXRlbWVudC4gUGFyZW50aGVzaXppbmdcbiAgICAgICAgICAgIC8vIHByZXZlbnRzIEFTSSwgYXMgbG9uZyBhcyB0aGUgb3BlbmluZyBwYXJlbiByZW1haW5zIG9uIHRoZSBzYW1lIGxpbmUgKHdoaWNoIGl0IGRvZXMpLlxuICAgICAgICAgICAgcmV0dXJuIHRzLmNyZWF0ZVBhcmVuKFxuICAgICAgICAgICAgICAgIHZpc2l0RnVuY3Rpb25MaWtlRGVjbGFyYXRpb24obm9kZSBhcyB0cy5BcnJvd0Z1bmN0aW9uIHwgdHMuRnVuY3Rpb25FeHByZXNzaW9uKSk7XG4gICAgICAgICAgY2FzZSB0cy5TeW50YXhLaW5kLkNvbnN0cnVjdG9yOlxuICAgICAgICAgIGNhc2UgdHMuU3ludGF4S2luZC5GdW5jdGlvbkRlY2xhcmF0aW9uOlxuICAgICAgICAgIGNhc2UgdHMuU3ludGF4S2luZC5NZXRob2REZWNsYXJhdGlvbjpcbiAgICAgICAgICBjYXNlIHRzLlN5bnRheEtpbmQuR2V0QWNjZXNzb3I6XG4gICAgICAgICAgY2FzZSB0cy5TeW50YXhLaW5kLlNldEFjY2Vzc29yOlxuICAgICAgICAgICAgcmV0dXJuIHZpc2l0RnVuY3Rpb25MaWtlRGVjbGFyYXRpb24obm9kZSBhcyB0cy5GdW5jdGlvbkxpa2VEZWNsYXJhdGlvbik7XG4gICAgICAgICAgY2FzZSB0cy5TeW50YXhLaW5kLlRoaXNLZXl3b3JkOlxuICAgICAgICAgICAgcmV0dXJuIHZpc2l0VGhpc0V4cHJlc3Npb24obm9kZSBhcyB0cy5UaGlzRXhwcmVzc2lvbik7XG4gICAgICAgICAgY2FzZSB0cy5TeW50YXhLaW5kLlZhcmlhYmxlU3RhdGVtZW50OlxuICAgICAgICAgICAgcmV0dXJuIHZpc2l0VmFyaWFibGVTdGF0ZW1lbnQobm9kZSBhcyB0cy5WYXJpYWJsZVN0YXRlbWVudCk7XG4gICAgICAgICAgY2FzZSB0cy5TeW50YXhLaW5kLlByb3BlcnR5RGVjbGFyYXRpb246XG4gICAgICAgICAgY2FzZSB0cy5TeW50YXhLaW5kLlByb3BlcnR5QXNzaWdubWVudDpcbiAgICAgICAgICAgIGVzY2FwZUlsbGVnYWxKU0RvYyhub2RlKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgdHMuU3ludGF4S2luZC5QYXJhbWV0ZXI6XG4gICAgICAgICAgICAvLyBQYXJhbWV0ZXIgcHJvcGVydGllcyAoZS5nLiBgY29uc3RydWN0b3IoLyoqIGRvY3MgKi8gcHJpdmF0ZSBmb286IHN0cmluZylgKSBtaWdodCBoYXZlXG4gICAgICAgICAgICAvLyBKU0RvYyBjb21tZW50cywgaW5jbHVkaW5nIEpTRG9jIHRhZ3MgcmVjb2duaXplZCBieSBDbG9zdXJlIENvbXBpbGVyLiBQcmV2ZW50IGVtaXR0aW5nXG4gICAgICAgICAgICAvLyBhbnkgY29tbWVudHMgb24gdGhlbSwgc28gdGhhdCBDbG9zdXJlIGRvZXNuJ3QgZXJyb3Igb24gdGhlbS5cbiAgICAgICAgICAgIC8vIFNlZSB0ZXN0X2ZpbGVzL3BhcmFtZXRlcl9wcm9wZXJ0aWVzLnRzLlxuICAgICAgICAgICAgY29uc3QgcGFyYW1EZWNsID0gbm9kZSBhcyB0cy5QYXJhbWV0ZXJEZWNsYXJhdGlvbjtcbiAgICAgICAgICAgIGlmICh0cmFuc2Zvcm1lclV0aWwuaGFzTW9kaWZpZXJGbGFnKFxuICAgICAgICAgICAgICAgICAgICBwYXJhbURlY2wsIHRzLk1vZGlmaWVyRmxhZ3MuUGFyYW1ldGVyUHJvcGVydHlNb2RpZmllcikpIHtcbiAgICAgICAgICAgICAgdHMuc2V0U3ludGhldGljTGVhZGluZ0NvbW1lbnRzKHBhcmFtRGVjbCwgW10pO1xuICAgICAgICAgICAgICBqc2RvYy5zdXBwcmVzc0xlYWRpbmdDb21tZW50c1JlY3Vyc2l2ZWx5KHBhcmFtRGVjbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIHRzLlN5bnRheEtpbmQuVHlwZUFsaWFzRGVjbGFyYXRpb246XG4gICAgICAgICAgICByZXR1cm4gdmlzaXRUeXBlQWxpYXNEZWNsYXJhdGlvbihub2RlIGFzIHRzLlR5cGVBbGlhc0RlY2xhcmF0aW9uKTtcbiAgICAgICAgICBjYXNlIHRzLlN5bnRheEtpbmQuQXNFeHByZXNzaW9uOlxuICAgICAgICAgIGNhc2UgdHMuU3ludGF4S2luZC5UeXBlQXNzZXJ0aW9uRXhwcmVzc2lvbjpcbiAgICAgICAgICAgIHJldHVybiB2aXNpdEFzc2VydGlvbkV4cHJlc3Npb24obm9kZSBhcyB0cy5UeXBlQXNzZXJ0aW9uKTtcbiAgICAgICAgICBjYXNlIHRzLlN5bnRheEtpbmQuTm9uTnVsbEV4cHJlc3Npb246XG4gICAgICAgICAgICByZXR1cm4gdmlzaXROb25OdWxsRXhwcmVzc2lvbihub2RlIGFzIHRzLk5vbk51bGxFeHByZXNzaW9uKTtcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRzLnZpc2l0RWFjaENoaWxkKG5vZGUsIHZpc2l0b3IsIGNvbnRleHQpO1xuICAgICAgfVxuXG4gICAgICBzb3VyY2VGaWxlID0gdHMudmlzaXRFYWNoQ2hpbGQoc291cmNlRmlsZSwgdmlzaXRvciwgY29udGV4dCk7XG5cbiAgICAgIHJldHVybiBtb2R1bGVUeXBlVHJhbnNsYXRvci5pbnNlcnRBZGRpdGlvbmFsSW1wb3J0cyhzb3VyY2VGaWxlKTtcbiAgICB9O1xuICB9O1xufVxuIl19