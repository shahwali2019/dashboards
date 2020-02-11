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
        define("tsickle/src/decorator_downlevel_transformer", ["require", "exports", "typescript", "tsickle/src/decorators", "tsickle/src/transformer_util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @fileoverview Decorator downleveling support. tsickle can optionally convert decorator calls
     * into annotations. For example, a decorator application on a method:
     *   class X {
     *     @Foo(1, 2)
     *     bar() { ... }
     *   }
     * Will get converted to:
     *   class X {
     *     bar() { ... }
     *     static propDecorators = {
     *       bar: {type: Foo, args: [1, 2]}
     *     }
     *   }
     * Similarly for decorators on the class (property 'decorators') and decorators on the constructor
     * (property 'ctorParameters', including the types of all arguments of the constructor).
     *
     * This is used by, among other software, Angular in its "non-AoT" mode to inspect decorator
     * invocations.
     */
    var ts = require("typescript");
    var decorators_1 = require("tsickle/src/decorators");
    var transformer_util_1 = require("tsickle/src/transformer_util");
    /**
     * Returns true if the given decorator should be downleveled.
     *
     * Decorators that have JSDoc on them including the `@Annotation` tag are downleveled and converted
     * into properties on the class by this pass.
     */
    function shouldLower(decorator, typeChecker) {
        var e_1, _a, e_2, _b;
        try {
            for (var _c = __values(decorators_1.getDecoratorDeclarations(decorator, typeChecker)), _d = _c.next(); !_d.done; _d = _c.next()) {
                var d = _d.value;
                // TODO(lucassloan):
                // Switch to the TS JSDoc parser in the future to avoid false positives here.
                // For example using '@Annotation' in a true comment.
                // However, a new TS API would be needed, track at
                // https://github.com/Microsoft/TypeScript/issues/7393.
                var commentNode = d;
                // Not handling PropertyAccess expressions here, because they are
                // filtered earlier.
                if (commentNode.kind === ts.SyntaxKind.VariableDeclaration) {
                    if (!commentNode.parent)
                        continue;
                    commentNode = commentNode.parent;
                }
                // Go up one more level to VariableDeclarationStatement, where usually
                // the comment lives. If the declaration has an 'export', the
                // VDList.getFullText will not contain the comment.
                if (commentNode.kind === ts.SyntaxKind.VariableDeclarationList) {
                    if (!commentNode.parent)
                        continue;
                    commentNode = commentNode.parent;
                }
                var range = transformer_util_1.getAllLeadingComments(commentNode);
                if (!range)
                    continue;
                try {
                    for (var range_1 = __values(range), range_1_1 = range_1.next(); !range_1_1.done; range_1_1 = range_1.next()) {
                        var text = range_1_1.value.text;
                        if (text.includes('@Annotation'))
                            return true;
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (range_1_1 && !range_1_1.done && (_b = range_1.return)) _b.call(range_1);
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
        return false;
    }
    exports.shouldLower = shouldLower;
    /**
     * Creates the AST for the decorator field type annotation, which has the form
     *     { type: Function, args?: any[] }[]
     */
    function createDecoratorInvocationType() {
        var typeElements = [];
        typeElements.push(ts.createPropertySignature(undefined, 'type', undefined, ts.createTypeReferenceNode(ts.createIdentifier('Function'), undefined), undefined));
        typeElements.push(ts.createPropertySignature(undefined, 'args', ts.createToken(ts.SyntaxKind.QuestionToken), ts.createArrayTypeNode(ts.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword)), undefined));
        return ts.createArrayTypeNode(ts.createTypeLiteralNode(typeElements));
    }
    /**
     * Extracts the type of the decorator (the function or expression invoked), as well as all the
     * arguments passed to the decorator. Returns an AST with the form:
     *
     *     // For @decorator(arg1, arg2)
     *     { type: decorator, args: [arg1, arg2] }
     */
    function extractMetadataFromSingleDecorator(decorator, diagnostics) {
        var e_3, _a;
        var metadataProperties = [];
        var expr = decorator.expression;
        switch (expr.kind) {
            case ts.SyntaxKind.Identifier:
                // The decorator was a plain @Foo.
                metadataProperties.push(ts.createPropertyAssignment('type', expr));
                break;
            case ts.SyntaxKind.CallExpression:
                // The decorator was a call, like @Foo(bar).
                var call = expr;
                metadataProperties.push(ts.createPropertyAssignment('type', call.expression));
                if (call.arguments.length) {
                    var args = [];
                    try {
                        for (var _b = __values(call.arguments), _c = _b.next(); !_c.done; _c = _b.next()) {
                            var arg = _c.value;
                            args.push(arg);
                        }
                    }
                    catch (e_3_1) { e_3 = { error: e_3_1 }; }
                    finally {
                        try {
                            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                        }
                        finally { if (e_3) throw e_3.error; }
                    }
                    var argsArrayLiteral = ts.createArrayLiteral(args);
                    argsArrayLiteral.elements.hasTrailingComma = true;
                    metadataProperties.push(ts.createPropertyAssignment('args', argsArrayLiteral));
                }
                break;
            default:
                diagnostics.push({
                    file: decorator.getSourceFile(),
                    start: decorator.getStart(),
                    length: decorator.getEnd() - decorator.getStart(),
                    messageText: ts.SyntaxKind[decorator.kind] + " not implemented in gathering decorator metadata",
                    category: ts.DiagnosticCategory.Error,
                    code: 0,
                });
                break;
        }
        return ts.createObjectLiteral(metadataProperties);
    }
    /**
     * Takes a list of decorator metadata object ASTs and produces an AST for a
     * static class property of an array of those metadata objects.
     */
    function createDecoratorClassProperty(decoratorList) {
        var modifier = ts.createToken(ts.SyntaxKind.StaticKeyword);
        var type = createDecoratorInvocationType();
        var initializer = ts.createArrayLiteral(decoratorList, true);
        initializer.elements.hasTrailingComma = true;
        var prop = ts.createProperty(undefined, [modifier], 'decorators', undefined, type, initializer);
        // NB: the .decorators property does not get a @nocollapse property. There is
        // no good reason why - it means .decorators is not runtime accessible if you
        // compile with collapse properties, whereas propDecorators is, which doesn't
        // follow any stringent logic. However this has been the case previously, and
        // adding it back in leads to substantial code size increases as Closure fails
        // to tree shake these props without @nocollapse.
        return prop;
    }
    /**
     * Creates the AST for the 'ctorParameters' field type annotation:
     *   () => ({ type: any, decorators?: {type: Function, args?: any[]}[] }|null)[]
     */
    function createCtorParametersClassPropertyType() {
        // Sorry about this. Try reading just the string literals below.
        var typeElements = [];
        typeElements.push(ts.createPropertySignature(undefined, 'type', undefined, ts.createTypeReferenceNode(ts.createIdentifier('any'), undefined), undefined));
        typeElements.push(ts.createPropertySignature(undefined, 'decorators', ts.createToken(ts.SyntaxKind.QuestionToken), ts.createArrayTypeNode(ts.createTypeLiteralNode([
            ts.createPropertySignature(undefined, 'type', undefined, ts.createTypeReferenceNode(ts.createIdentifier('Function'), undefined), undefined),
            ts.createPropertySignature(undefined, 'args', ts.createToken(ts.SyntaxKind.QuestionToken), ts.createArrayTypeNode(ts.createTypeReferenceNode(ts.createIdentifier('any'), undefined)), undefined),
        ])), undefined));
        return ts.createFunctionTypeNode(undefined, [], ts.createArrayTypeNode(ts.createUnionTypeNode([ts.createTypeLiteralNode(typeElements), ts.createNull()])));
    }
    /**
     * Sets a Closure \@nocollapse synthetic comment on the given node. This prevents Closure Compiler
     * from collapsing the apparently static property, which would make it impossible to find for code
     * trying to detect it at runtime.
     */
    function addNoCollapseComment(n) {
        ts.setSyntheticLeadingComments(n, [{
                kind: ts.SyntaxKind.MultiLineCommentTrivia,
                text: '* @nocollapse ',
                pos: -1,
                end: -1,
                hasTrailingNewLine: true
            }]);
    }
    /**
     * createCtorParametersClassProperty creates a static 'ctorParameters' property containing
     * downleveled decorator information.
     *
     * The property contains an arrow function that returns an array of object literals of the shape:
     *     static ctorParameters = () => [{
     *       type: SomeClass|undefined,  // the type of the param that's decorated, if it's a value.
     *       decorators: [{
     *         type: DecoratorFn,  // the type of the decorator that's invoked.
     *         args: [ARGS],       // the arguments passed to the decorator.
     *       }]
     *     }];
     */
    function createCtorParametersClassProperty(diagnostics, entityNameToExpression, ctorParameters) {
        var e_4, _a, e_5, _b;
        var params = [];
        try {
            for (var ctorParameters_1 = __values(ctorParameters), ctorParameters_1_1 = ctorParameters_1.next(); !ctorParameters_1_1.done; ctorParameters_1_1 = ctorParameters_1.next()) {
                var ctorParam = ctorParameters_1_1.value;
                if (!ctorParam.type && ctorParam.decorators.length === 0) {
                    params.push(ts.createNull());
                    continue;
                }
                var paramType = ctorParam.type ?
                    typeReferenceToExpression(entityNameToExpression, ctorParam.type) :
                    undefined;
                var members = [ts.createPropertyAssignment('type', paramType || ts.createIdentifier('undefined'))];
                var decorators = [];
                try {
                    for (var _c = __values(ctorParam.decorators), _d = _c.next(); !_d.done; _d = _c.next()) {
                        var deco = _d.value;
                        decorators.push(extractMetadataFromSingleDecorator(deco, diagnostics));
                    }
                }
                catch (e_5_1) { e_5 = { error: e_5_1 }; }
                finally {
                    try {
                        if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
                    }
                    finally { if (e_5) throw e_5.error; }
                }
                if (decorators.length) {
                    members.push(ts.createPropertyAssignment('decorators', ts.createArrayLiteral(decorators)));
                }
                params.push(ts.createObjectLiteral(members));
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (ctorParameters_1_1 && !ctorParameters_1_1.done && (_a = ctorParameters_1.return)) _a.call(ctorParameters_1);
            }
            finally { if (e_4) throw e_4.error; }
        }
        var initializer = ts.createArrowFunction(undefined, undefined, [], undefined, ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken), ts.createArrayLiteral(params, true));
        var type = createCtorParametersClassPropertyType();
        var ctorProp = ts.createProperty(undefined, [ts.createToken(ts.SyntaxKind.StaticKeyword)], 'ctorParameters', undefined, type, initializer);
        addNoCollapseComment(ctorProp);
        return ctorProp;
    }
    /**
     * createPropDecoratorsClassProperty creates a static 'propDecorators' property containing type
     * information for every property that has a decorator applied.
     *
     *     static propDecorators: {[key: string]: {type: Function, args?: any[]}[]} = {
     *       propA: [{type: MyDecorator, args: [1, 2]}, ...],
     *       ...
     *     };
     */
    function createPropDecoratorsClassProperty(diagnostics, properties) {
        var e_6, _a;
        //  `static propDecorators: {[key: string]: ` + {type: Function, args?: any[]}[] + `} = {\n`);
        var entries = [];
        try {
            for (var _b = __values(properties.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), name_1 = _d[0], decorators = _d[1];
                entries.push(ts.createPropertyAssignment(name_1, ts.createArrayLiteral(decorators.map(function (deco) { return extractMetadataFromSingleDecorator(deco, diagnostics); }))));
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_6) throw e_6.error; }
        }
        var initializer = ts.createObjectLiteral(entries, true);
        var type = ts.createTypeLiteralNode([ts.createIndexSignature(undefined, undefined, [ts.createParameter(undefined, undefined, undefined, 'key', undefined, ts.createTypeReferenceNode('string', undefined), undefined)], createDecoratorInvocationType())]);
        return ts.createProperty(undefined, [ts.createToken(ts.SyntaxKind.StaticKeyword)], 'propDecorators', undefined, type, initializer);
    }
    function isNameEqual(classMember, name) {
        if (classMember.name === undefined) {
            return false;
        }
        var id = classMember.name;
        return id.text === name;
    }
    /**
     * Returns an expression representing the (potentially) value part for the given node.
     *
     * This is a partial re-implementation of TypeScript's serializeTypeReferenceNode. This is a
     * workaround for https://github.com/Microsoft/TypeScript/issues/17516 (serializeTypeReferenceNode
     * not being exposed). In practice this implementation is sufficient for Angular's use of type
     * metadata.
     */
    function typeReferenceToExpression(entityNameToExpression, node) {
        var kind = node.kind;
        if (ts.isLiteralTypeNode(node)) {
            // Treat literal types like their base type (boolean, string, number).
            kind = node.literal.kind;
        }
        switch (kind) {
            case ts.SyntaxKind.FunctionType:
            case ts.SyntaxKind.ConstructorType:
                return ts.createIdentifier('Function');
            case ts.SyntaxKind.ArrayType:
            case ts.SyntaxKind.TupleType:
                return ts.createIdentifier('Array');
            case ts.SyntaxKind.TypePredicate:
            case ts.SyntaxKind.TrueKeyword:
            case ts.SyntaxKind.FalseKeyword:
            case ts.SyntaxKind.BooleanKeyword:
                return ts.createIdentifier('Boolean');
            case ts.SyntaxKind.StringLiteral:
            case ts.SyntaxKind.StringKeyword:
                return ts.createIdentifier('String');
            case ts.SyntaxKind.ObjectKeyword:
                return ts.createIdentifier('Object');
            case ts.SyntaxKind.NumberKeyword:
            case ts.SyntaxKind.NumericLiteral:
                return ts.createIdentifier('Number');
            case ts.SyntaxKind.TypeReference:
                var typeRef = node;
                // Ignore any generic types, just return the base type.
                return entityNameToExpression(typeRef.typeName);
            default:
                return undefined;
        }
    }
    /**
     * Transformer factory for the decorator downlevel transformer. See fileoverview for details.
     */
    function decoratorDownlevelTransformer(typeChecker, diagnostics) {
        return function (context) {
            /** A map from symbols to the identifier of an import, reset per SourceFile. */
            var importNamesBySymbol = new Map();
            /**
             * Converts an EntityName (from a type annotation) to an expression (accessing a value).
             *
             * For a given ts.EntityName, this walks depth first to find the leftmost ts.Identifier, then
             * converts the path into property accesses.
             *
             * This generally works, but TypeScript's emit pipeline does not serialize identifiers that are
             * only used in a type location (such as identifiers in a TypeNode), even if the identifier
             * itself points to a value (e.g. a class). To avoid that problem, this method finds the symbol
             * representing the identifier (using typeChecker), then looks up where it was imported (using
             * importNamesBySymbol), and then uses the imported name instead of the identifier from the type
             * expression, if any. Otherwise it'll use the identifier unchanged. This makes sure the
             * identifier is not marked as stemming from a "type only" expression, causing it to be emitted
             * and causing the import to be retained.
             */
            function entityNameToExpression(name) {
                var sym = typeChecker.getSymbolAtLocation(name);
                if (!sym)
                    return undefined;
                // Check if the entity name references a symbol that is an actual value. If it is not, it
                // cannot be referenced by an expression, so return undefined.
                var symToCheck = sym;
                if (symToCheck.flags & ts.SymbolFlags.Alias) {
                    symToCheck = typeChecker.getAliasedSymbol(symToCheck);
                }
                if (!(symToCheck.flags & ts.SymbolFlags.Value))
                    return undefined;
                if (ts.isIdentifier(name)) {
                    // If there's a known import name for this symbol, use it so that the import will be
                    // retained and the value can be referenced.
                    if (importNamesBySymbol.has(sym))
                        return importNamesBySymbol.get(sym);
                    // Otherwise this will be a locally declared name, just return that.
                    return name;
                }
                var ref = entityNameToExpression(name.left);
                if (!ref)
                    return undefined;
                return ts.createPropertyAccess(ref, name.right);
            }
            /**
             * Transforms a class element. Returns a three tuple of name, transformed element, and
             * decorators found. Returns an undefined name if there are no decorators to lower on the
             * element, or the element has an exotic name.
             */
            function transformClassElement(element) {
                var e_7, _a;
                element = ts.visitEachChild(element, visitor, context);
                var decoratorsToKeep = [];
                var toLower = [];
                try {
                    for (var _b = __values(element.decorators || []), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var decorator = _c.value;
                        if (!shouldLower(decorator, typeChecker)) {
                            decoratorsToKeep.push(decorator);
                            continue;
                        }
                        toLower.push(decorator);
                    }
                }
                catch (e_7_1) { e_7 = { error: e_7_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_7) throw e_7.error; }
                }
                if (!toLower.length)
                    return [undefined, element, []];
                if (!element.name || element.name.kind !== ts.SyntaxKind.Identifier) {
                    // Method has a weird name, e.g.
                    //   [Symbol.foo]() {...}
                    diagnostics.push({
                        file: element.getSourceFile(),
                        start: element.getStart(),
                        length: element.getEnd() - element.getStart(),
                        messageText: "cannot process decorators on strangely named method",
                        category: ts.DiagnosticCategory.Error,
                        code: 0,
                    });
                    return [undefined, element, []];
                }
                var name = element.name.text;
                var mutable = ts.getMutableClone(element);
                mutable.decorators = decoratorsToKeep.length ?
                    ts.setTextRange(ts.createNodeArray(decoratorsToKeep), mutable.decorators) :
                    undefined;
                return [name, mutable, toLower];
            }
            /**
             * Transforms a constructor. Returns the transformed constructor and the list of parameter
             * information collected, consisting of decorators and optional type.
             */
            function transformConstructor(ctor) {
                var e_8, _a, e_9, _b;
                ctor = ts.visitEachChild(ctor, visitor, context);
                var newParameters = [];
                var oldParameters = ts.visitParameterList(ctor.parameters, visitor, context);
                var parametersInfo = [];
                try {
                    for (var oldParameters_1 = __values(oldParameters), oldParameters_1_1 = oldParameters_1.next(); !oldParameters_1_1.done; oldParameters_1_1 = oldParameters_1.next()) {
                        var param = oldParameters_1_1.value;
                        var decoratorsToKeep = [];
                        var paramInfo = { decorators: [], type: null };
                        try {
                            for (var _c = __values(param.decorators || []), _d = _c.next(); !_d.done; _d = _c.next()) {
                                var decorator = _d.value;
                                if (!shouldLower(decorator, typeChecker)) {
                                    decoratorsToKeep.push(decorator);
                                    continue;
                                }
                                paramInfo.decorators.push(decorator);
                            }
                        }
                        catch (e_9_1) { e_9 = { error: e_9_1 }; }
                        finally {
                            try {
                                if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
                            }
                            finally { if (e_9) throw e_9.error; }
                        }
                        if (param.type) {
                            // param has a type provided, e.g. "foo: Bar".
                            // The type will be emitted as a value expression in entityNameToExpression, which takes
                            // care not to emit anything for types that cannot be expressed as a value (e.g.
                            // interfaces).
                            paramInfo.type = param.type;
                        }
                        parametersInfo.push(paramInfo);
                        var newParam = ts.updateParameter(param, 
                        // Must pass 'undefined' to avoid emitting decorator metadata.
                        decoratorsToKeep.length ? decoratorsToKeep : undefined, param.modifiers, param.dotDotDotToken, param.name, param.questionToken, param.type, param.initializer);
                        newParameters.push(newParam);
                    }
                }
                catch (e_8_1) { e_8 = { error: e_8_1 }; }
                finally {
                    try {
                        if (oldParameters_1_1 && !oldParameters_1_1.done && (_a = oldParameters_1.return)) _a.call(oldParameters_1);
                    }
                    finally { if (e_8) throw e_8.error; }
                }
                var updated = ts.updateConstructor(ctor, ctor.decorators, ctor.modifiers, newParameters, ts.visitFunctionBody(ctor.body, visitor, context));
                return [updated, parametersInfo];
            }
            /**
             * Transforms a single class declaration:
             * - dispatches to strip decorators on members
             * - converts decorators on the class to annotations
             * - creates a ctorParameters property
             * - creates a propDecorators property
             */
            function transformClassDeclaration(classDecl) {
                var e_10, _a, e_11, _b;
                classDecl = ts.getMutableClone(classDecl);
                var newMembers = [];
                var decoratedProperties = new Map();
                var classParameters = null;
                try {
                    for (var _c = __values(classDecl.members), _d = _c.next(); !_d.done; _d = _c.next()) {
                        var member = _d.value;
                        switch (member.kind) {
                            case ts.SyntaxKind.PropertyDeclaration:
                            case ts.SyntaxKind.GetAccessor:
                            case ts.SyntaxKind.SetAccessor:
                            case ts.SyntaxKind.MethodDeclaration: {
                                var _e = __read(transformClassElement(member), 3), name_2 = _e[0], newMember = _e[1], decorators_3 = _e[2];
                                newMembers.push(newMember);
                                if (name_2)
                                    decoratedProperties.set(name_2, decorators_3);
                                continue;
                            }
                            case ts.SyntaxKind.Constructor: {
                                var ctor = member;
                                if (!ctor.body)
                                    break;
                                var _f = __read(transformConstructor(member), 2), newMember = _f[0], parametersInfo = _f[1];
                                classParameters = parametersInfo;
                                newMembers.push(newMember);
                                continue;
                            }
                            default:
                                break;
                        }
                        newMembers.push(ts.visitEachChild(member, visitor, context));
                    }
                }
                catch (e_10_1) { e_10 = { error: e_10_1 }; }
                finally {
                    try {
                        if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                    }
                    finally { if (e_10) throw e_10.error; }
                }
                var decorators = classDecl.decorators || [];
                var decoratorsToLower = [];
                var decoratorsToKeep = [];
                try {
                    for (var decorators_2 = __values(decorators), decorators_2_1 = decorators_2.next(); !decorators_2_1.done; decorators_2_1 = decorators_2.next()) {
                        var decorator = decorators_2_1.value;
                        if (shouldLower(decorator, typeChecker)) {
                            decoratorsToLower.push(extractMetadataFromSingleDecorator(decorator, diagnostics));
                        }
                        else {
                            decoratorsToKeep.push(decorator);
                        }
                    }
                }
                catch (e_11_1) { e_11 = { error: e_11_1 }; }
                finally {
                    try {
                        if (decorators_2_1 && !decorators_2_1.done && (_b = decorators_2.return)) _b.call(decorators_2);
                    }
                    finally { if (e_11) throw e_11.error; }
                }
                var newClassDeclaration = ts.getMutableClone(classDecl);
                if (decoratorsToLower.length) {
                    newMembers.push(createDecoratorClassProperty(decoratorsToLower));
                }
                if (classParameters) {
                    if ((decoratorsToLower.length) || classParameters.some(function (p) { return !!p.decorators.length; })) {
                        // emit ctorParameters if the class was decoratored at all, or if any of its ctors
                        // were classParameters
                        newMembers.push(createCtorParametersClassProperty(diagnostics, entityNameToExpression, classParameters));
                    }
                }
                if (decoratedProperties.size) {
                    newMembers.push(createPropDecoratorsClassProperty(diagnostics, decoratedProperties));
                }
                newClassDeclaration.members = ts.setTextRange(ts.createNodeArray(newMembers, newClassDeclaration.members.hasTrailingComma), classDecl.members);
                newClassDeclaration.decorators =
                    decoratorsToKeep.length ? ts.createNodeArray(decoratorsToKeep) : undefined;
                return newClassDeclaration;
            }
            function visitor(node) {
                var e_12, _a;
                switch (node.kind) {
                    case ts.SyntaxKind.SourceFile: {
                        importNamesBySymbol = new Map();
                        return ts.visitEachChild(node, visitor, context);
                    }
                    case ts.SyntaxKind.ImportDeclaration: {
                        var impDecl = node;
                        if (impDecl.importClause) {
                            var importClause = impDecl.importClause;
                            var names = [];
                            if (importClause.name) {
                                names.push(importClause.name);
                            }
                            if (importClause.namedBindings &&
                                importClause.namedBindings.kind === ts.SyntaxKind.NamedImports) {
                                var namedImports = importClause.namedBindings;
                                names.push.apply(names, __spread(namedImports.elements.map(function (e) { return e.name; })));
                            }
                            try {
                                for (var names_1 = __values(names), names_1_1 = names_1.next(); !names_1_1.done; names_1_1 = names_1.next()) {
                                    var name_3 = names_1_1.value;
                                    var sym = typeChecker.getSymbolAtLocation(name_3);
                                    importNamesBySymbol.set(sym, name_3);
                                }
                            }
                            catch (e_12_1) { e_12 = { error: e_12_1 }; }
                            finally {
                                try {
                                    if (names_1_1 && !names_1_1.done && (_a = names_1.return)) _a.call(names_1);
                                }
                                finally { if (e_12) throw e_12.error; }
                            }
                        }
                        return ts.visitEachChild(node, visitor, context);
                    }
                    case ts.SyntaxKind.ClassDeclaration: {
                        return transformClassDeclaration(node);
                    }
                    default:
                        return transformer_util_1.visitEachChild(node, visitor, context);
                }
            }
            return function (sf) { return visitor(sf); };
        };
    }
    exports.decoratorDownlevelTransformer = decoratorDownlevelTransformer;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVjb3JhdG9yX2Rvd25sZXZlbF90cmFuc2Zvcm1lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9kZWNvcmF0b3JfZG93bmxldmVsX3RyYW5zZm9ybWVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBRUg7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0FtQkc7SUFFSCwrQkFBaUM7SUFFakMscURBQXNEO0lBQ3RELGlFQUF5RTtJQUV6RTs7Ozs7T0FLRztJQUNILFNBQWdCLFdBQVcsQ0FBQyxTQUF1QixFQUFFLFdBQTJCOzs7WUFDOUUsS0FBZ0IsSUFBQSxLQUFBLFNBQUEscUNBQXdCLENBQUMsU0FBUyxFQUFFLFdBQVcsQ0FBQyxDQUFBLGdCQUFBLDRCQUFFO2dCQUE3RCxJQUFNLENBQUMsV0FBQTtnQkFDVixvQkFBb0I7Z0JBQ3BCLDZFQUE2RTtnQkFDN0UscURBQXFEO2dCQUNyRCxrREFBa0Q7Z0JBQ2xELHVEQUF1RDtnQkFDdkQsSUFBSSxXQUFXLEdBQVksQ0FBQyxDQUFDO2dCQUM3QixpRUFBaUU7Z0JBQ2pFLG9CQUFvQjtnQkFDcEIsSUFBSSxXQUFXLENBQUMsSUFBSSxLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsbUJBQW1CLEVBQUU7b0JBQzFELElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTTt3QkFBRSxTQUFTO29CQUNsQyxXQUFXLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQztpQkFDbEM7Z0JBQ0Qsc0VBQXNFO2dCQUN0RSw2REFBNkQ7Z0JBQzdELG1EQUFtRDtnQkFDbkQsSUFBSSxXQUFXLENBQUMsSUFBSSxLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsdUJBQXVCLEVBQUU7b0JBQzlELElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTTt3QkFBRSxTQUFTO29CQUNsQyxXQUFXLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FB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QSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsSUFBSSxFQUFOLENBQU0sQ0FBQyxHQUFFOzZCQUN2RDs7Z0NBQ0QsS0FBbUIsSUFBQSxVQUFBLFNBQUEsS0FBSyxDQUFBLDRCQUFBLCtDQUFFO29DQUFyQixJQUFNLE1BQUksa0JBQUE7b0NBQ2IsSUFBTSxHQUFHLEdBQUcsV0FBVyxDQUFDLG1CQUFtQixDQUFDLE1BQUksQ0FBRSxDQUFDO29DQUNuRCxtQkFBbUIsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLE1BQUksQ0FBQyxDQUFDO2lDQUNwQzs7Ozs7Ozs7O3lCQUNGO3dCQUNELE9BQU8sRUFBRSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO3FCQUNsRDtvQkFDRCxLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsQ0FBQzt3QkFDbkMsT0FBTyx5QkFBeUIsQ0FBQyxJQUEyQixDQUFDLENBQUM7cUJBQy9EO29CQUNEO3dCQUNFLE9BQU8saUNBQWMsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2lCQUNqRDtZQUNILENBQUM7WUFFRCxPQUFPLFVBQUMsRUFBaUIsSUFBSyxPQUFBLE9BQU8sQ0FBQyxFQUFFLENBQWtCLEVBQTVCLENBQTRCLENBQUM7UUFDN0QsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQWhQRCxzRUFnUEMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8qKlxuICogQGZpbGVvdmVydmlldyBEZWNvcmF0b3IgZG93bmxldmVsaW5nIHN1cHBvcnQuIHRzaWNrbGUgY2FuIG9wdGlvbmFsbHkgY29udmVydCBkZWNvcmF0b3IgY2FsbHNcbiAqIGludG8gYW5ub3RhdGlvbnMuIEZvciBleGFtcGxlLCBhIGRlY29yYXRvciBhcHBsaWNhdGlvbiBvbiBhIG1ldGhvZDpcbiAqICAgY2xhc3MgWCB7XG4gKiAgICAgQEZvbygxLCAyKVxuICogICAgIGJhcigpIHsgLi4uIH1cbiAqICAgfVxuICogV2lsbCBnZXQgY29udmVydGVkIHRvOlxuICogICBjbGFzcyBYIHtcbiAqICAgICBiYXIoKSB7IC4uLiB9XG4gKiAgICAgc3RhdGljIHByb3BEZWNvcmF0b3JzID0ge1xuICogICAgICAgYmFyOiB7dHlwZTogRm9vLCBhcmdzOiBbMSwgMl19XG4gKiAgICAgfVxuICogICB9XG4gKiBTaW1pbGFybHkgZm9yIGRlY29yYXRvcnMgb24gdGhlIGNsYXNzIChwcm9wZXJ0eSAnZGVjb3JhdG9ycycpIGFuZCBkZWNvcmF0b3JzIG9uIHRoZSBjb25zdHJ1Y3RvclxuICogKHByb3BlcnR5ICdjdG9yUGFyYW1ldGVycycsIGluY2x1ZGluZyB0aGUgdHlwZXMgb2YgYWxsIGFyZ3VtZW50cyBvZiB0aGUgY29uc3RydWN0b3IpLlxuICpcbiAqIFRoaXMgaXMgdXNlZCBieSwgYW1vbmcgb3RoZXIgc29mdHdhcmUsIEFuZ3VsYXIgaW4gaXRzIFwibm9uLUFvVFwiIG1vZGUgdG8gaW5zcGVjdCBkZWNvcmF0b3JcbiAqIGludm9jYXRpb25zLlxuICovXG5cbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuXG5pbXBvcnQge2dldERlY29yYXRvckRlY2xhcmF0aW9uc30gZnJvbSAnLi9kZWNvcmF0b3JzJztcbmltcG9ydCB7Z2V0QWxsTGVhZGluZ0NvbW1lbnRzLCB2aXNpdEVhY2hDaGlsZH0gZnJvbSAnLi90cmFuc2Zvcm1lcl91dGlsJztcblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgdGhlIGdpdmVuIGRlY29yYXRvciBzaG91bGQgYmUgZG93bmxldmVsZWQuXG4gKlxuICogRGVjb3JhdG9ycyB0aGF0IGhhdmUgSlNEb2Mgb24gdGhlbSBpbmNsdWRpbmcgdGhlIGBAQW5ub3RhdGlvbmAgdGFnIGFyZSBkb3dubGV2ZWxlZCBhbmQgY29udmVydGVkXG4gKiBpbnRvIHByb3BlcnRpZXMgb24gdGhlIGNsYXNzIGJ5IHRoaXMgcGFzcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNob3VsZExvd2VyKGRlY29yYXRvcjogdHMuRGVjb3JhdG9yLCB0eXBlQ2hlY2tlcjogdHMuVHlwZUNoZWNrZXIpIHtcbiAgZm9yIChjb25zdCBkIG9mIGdldERlY29yYXRvckRlY2xhcmF0aW9ucyhkZWNvcmF0b3IsIHR5cGVDaGVja2VyKSkge1xuICAgIC8vIFRPRE8obHVjYXNzbG9hbik6XG4gICAgLy8gU3dpdGNoIHRvIHRoZSBUUyBKU0RvYyBwYXJzZXIgaW4gdGhlIGZ1dHVyZSB0byBhdm9pZCBmYWxzZSBwb3NpdGl2ZXMgaGVyZS5cbiAgICAvLyBGb3IgZXhhbXBsZSB1c2luZyAnQEFubm90YXRpb24nIGluIGEgdHJ1ZSBjb21tZW50LlxuICAgIC8vIEhvd2V2ZXIsIGEgbmV3IFRTIEFQSSB3b3VsZCBiZSBuZWVkZWQsIHRyYWNrIGF0XG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC9UeXBlU2NyaXB0L2lzc3Vlcy83MzkzLlxuICAgIGxldCBjb21tZW50Tm9kZTogdHMuTm9kZSA9IGQ7XG4gICAgLy8gTm90IGhhbmRsaW5nIFByb3BlcnR5QWNjZXNzIGV4cHJlc3Npb25zIGhlcmUsIGJlY2F1c2UgdGhleSBhcmVcbiAgICAvLyBmaWx0ZXJlZCBlYXJsaWVyLlxuICAgIGlmIChjb21tZW50Tm9kZS5raW5kID09PSB0cy5TeW50YXhLaW5kLlZhcmlhYmxlRGVjbGFyYXRpb24pIHtcbiAgICAgIGlmICghY29tbWVudE5vZGUucGFyZW50KSBjb250aW51ZTtcbiAgICAgIGNvbW1lbnROb2RlID0gY29tbWVudE5vZGUucGFyZW50O1xuICAgIH1cbiAgICAvLyBHbyB1cCBvbmUgbW9yZSBsZXZlbCB0byBWYXJpYWJsZURlY2xhcmF0aW9uU3RhdGVtZW50LCB3aGVyZSB1c3VhbGx5XG4gICAgLy8gdGhlIGNvbW1lbnQgbGl2ZXMuIElmIHRoZSBkZWNsYXJhdGlvbiBoYXMgYW4gJ2V4cG9ydCcsIHRoZVxuICAgIC8vIFZETGlzdC5nZXRGdWxsVGV4dCB3aWxsIG5vdCBjb250YWluIHRoZSBjb21tZW50LlxuICAgIGlmIChjb21tZW50Tm9kZS5raW5kID09PSB0cy5TeW50YXhLaW5kLlZhcmlhYmxlRGVjbGFyYXRpb25MaXN0KSB7XG4gICAgICBpZiAoIWNvbW1lbnROb2RlLnBhcmVudCkgY29udGludWU7XG4gICAgICBjb21tZW50Tm9kZSA9IGNvbW1lbnROb2RlLnBhcmVudDtcbiAgICB9XG4gICAgY29uc3QgcmFuZ2UgPSBnZXRBbGxMZWFkaW5nQ29tbWVudHMoY29tbWVudE5vZGUpO1xuICAgIGlmICghcmFuZ2UpIGNvbnRpbnVlO1xuICAgIGZvciAoY29uc3Qge3RleHR9IG9mIHJhbmdlKSB7XG4gICAgICBpZiAodGV4dC5pbmNsdWRlcygnQEFubm90YXRpb24nKSkgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIHRoZSBBU1QgZm9yIHRoZSBkZWNvcmF0b3IgZmllbGQgdHlwZSBhbm5vdGF0aW9uLCB3aGljaCBoYXMgdGhlIGZvcm1cbiAqICAgICB7IHR5cGU6IEZ1bmN0aW9uLCBhcmdzPzogYW55W10gfVtdXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZURlY29yYXRvckludm9jYXRpb25UeXBlKCk6IHRzLlR5cGVOb2RlIHtcbiAgY29uc3QgdHlwZUVsZW1lbnRzOiB0cy5UeXBlRWxlbWVudFtdID0gW107XG4gIHR5cGVFbGVtZW50cy5wdXNoKHRzLmNyZWF0ZVByb3BlcnR5U2lnbmF0dXJlKFxuICAgICAgdW5kZWZpbmVkLCAndHlwZScsIHVuZGVmaW5lZCxcbiAgICAgIHRzLmNyZWF0ZVR5cGVSZWZlcmVuY2VOb2RlKHRzLmNyZWF0ZUlkZW50aWZpZXIoJ0Z1bmN0aW9uJyksIHVuZGVmaW5lZCksIHVuZGVmaW5lZCkpO1xuICB0eXBlRWxlbWVudHMucHVzaCh0cy5jcmVhdGVQcm9wZXJ0eVNpZ25hdHVyZShcbiAgICAgIHVuZGVmaW5lZCwgJ2FyZ3MnLCB0cy5jcmVhdGVUb2tlbih0cy5TeW50YXhLaW5kLlF1ZXN0aW9uVG9rZW4pLFxuICAgICAgdHMuY3JlYXRlQXJyYXlUeXBlTm9kZSh0cy5jcmVhdGVLZXl3b3JkVHlwZU5vZGUodHMuU3ludGF4S2luZC5BbnlLZXl3b3JkKSksIHVuZGVmaW5lZCkpO1xuICByZXR1cm4gdHMuY3JlYXRlQXJyYXlUeXBlTm9kZSh0cy5jcmVhdGVUeXBlTGl0ZXJhbE5vZGUodHlwZUVsZW1lbnRzKSk7XG59XG5cbi8qKlxuICogRXh0cmFjdHMgdGhlIHR5cGUgb2YgdGhlIGRlY29yYXRvciAodGhlIGZ1bmN0aW9uIG9yIGV4cHJlc3Npb24gaW52b2tlZCksIGFzIHdlbGwgYXMgYWxsIHRoZVxuICogYXJndW1lbnRzIHBhc3NlZCB0byB0aGUgZGVjb3JhdG9yLiBSZXR1cm5zIGFuIEFTVCB3aXRoIHRoZSBmb3JtOlxuICpcbiAqICAgICAvLyBGb3IgQGRlY29yYXRvcihhcmcxLCBhcmcyKVxuICogICAgIHsgdHlwZTogZGVjb3JhdG9yLCBhcmdzOiBbYXJnMSwgYXJnMl0gfVxuICovXG5mdW5jdGlvbiBleHRyYWN0TWV0YWRhdGFGcm9tU2luZ2xlRGVjb3JhdG9yKFxuICAgIGRlY29yYXRvcjogdHMuRGVjb3JhdG9yLCBkaWFnbm9zdGljczogdHMuRGlhZ25vc3RpY1tdKTogdHMuT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb24ge1xuICBjb25zdCBtZXRhZGF0YVByb3BlcnRpZXM6IHRzLk9iamVjdExpdGVyYWxFbGVtZW50TGlrZVtdID0gW107XG4gIGNvbnN0IGV4cHIgPSBkZWNvcmF0b3IuZXhwcmVzc2lvbjtcbiAgc3dpdGNoIChleHByLmtpbmQpIHtcbiAgICBjYXNlIHRzLlN5bnRheEtpbmQuSWRlbnRpZmllcjpcbiAgICAgIC8vIFRoZSBkZWNvcmF0b3Igd2FzIGEgcGxhaW4gQEZvby5cbiAgICAgIG1ldGFkYXRhUHJvcGVydGllcy5wdXNoKHRzLmNyZWF0ZVByb3BlcnR5QXNzaWdubWVudCgndHlwZScsIGV4cHIpKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgdHMuU3ludGF4S2luZC5DYWxsRXhwcmVzc2lvbjpcbiAgICAgIC8vIFRoZSBkZWNvcmF0b3Igd2FzIGEgY2FsbCwgbGlrZSBARm9vKGJhcikuXG4gICAgICBjb25zdCBjYWxsID0gZXhwciBhcyB0cy5DYWxsRXhwcmVzc2lvbjtcbiAgICAgIG1ldGFkYXRhUHJvcGVydGllcy5wdXNoKHRzLmNyZWF0ZVByb3BlcnR5QXNzaWdubWVudCgndHlwZScsIGNhbGwuZXhwcmVzc2lvbikpO1xuICAgICAgaWYgKGNhbGwuYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgICBjb25zdCBhcmdzOiB0cy5FeHByZXNzaW9uW10gPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBhcmcgb2YgY2FsbC5hcmd1bWVudHMpIHtcbiAgICAgICAgICBhcmdzLnB1c2goYXJnKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBhcmdzQXJyYXlMaXRlcmFsID0gdHMuY3JlYXRlQXJyYXlMaXRlcmFsKGFyZ3MpO1xuICAgICAgICBhcmdzQXJyYXlMaXRlcmFsLmVsZW1lbnRzLmhhc1RyYWlsaW5nQ29tbWEgPSB0cnVlO1xuICAgICAgICBtZXRhZGF0YVByb3BlcnRpZXMucHVzaCh0cy5jcmVhdGVQcm9wZXJ0eUFzc2lnbm1lbnQoJ2FyZ3MnLCBhcmdzQXJyYXlMaXRlcmFsKSk7XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgZGlhZ25vc3RpY3MucHVzaCh7XG4gICAgICAgIGZpbGU6IGRlY29yYXRvci5nZXRTb3VyY2VGaWxlKCksXG4gICAgICAgIHN0YXJ0OiBkZWNvcmF0b3IuZ2V0U3RhcnQoKSxcbiAgICAgICAgbGVuZ3RoOiBkZWNvcmF0b3IuZ2V0RW5kKCkgLSBkZWNvcmF0b3IuZ2V0U3RhcnQoKSxcbiAgICAgICAgbWVzc2FnZVRleHQ6XG4gICAgICAgICAgICBgJHt0cy5TeW50YXhLaW5kW2RlY29yYXRvci5raW5kXX0gbm90IGltcGxlbWVudGVkIGluIGdhdGhlcmluZyBkZWNvcmF0b3IgbWV0YWRhdGFgLFxuICAgICAgICBjYXRlZ29yeTogdHMuRGlhZ25vc3RpY0NhdGVnb3J5LkVycm9yLFxuICAgICAgICBjb2RlOiAwLFxuICAgICAgfSk7XG4gICAgICBicmVhaztcbiAgfVxuICByZXR1cm4gdHMuY3JlYXRlT2JqZWN0TGl0ZXJhbChtZXRhZGF0YVByb3BlcnRpZXMpO1xufVxuXG4vKipcbiAqIFRha2VzIGEgbGlzdCBvZiBkZWNvcmF0b3IgbWV0YWRhdGEgb2JqZWN0IEFTVHMgYW5kIHByb2R1Y2VzIGFuIEFTVCBmb3IgYVxuICogc3RhdGljIGNsYXNzIHByb3BlcnR5IG9mIGFuIGFycmF5IG9mIHRob3NlIG1ldGFkYXRhIG9iamVjdHMuXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZURlY29yYXRvckNsYXNzUHJvcGVydHkoZGVjb3JhdG9yTGlzdDogdHMuT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb25bXSkge1xuICBjb25zdCBtb2RpZmllciA9IHRzLmNyZWF0ZVRva2VuKHRzLlN5bnRheEtpbmQuU3RhdGljS2V5d29yZCk7XG4gIGNvbnN0IHR5cGUgPSBjcmVhdGVEZWNvcmF0b3JJbnZvY2F0aW9uVHlwZSgpO1xuICBjb25zdCBpbml0aWFsaXplciA9IHRzLmNyZWF0ZUFycmF5TGl0ZXJhbChkZWNvcmF0b3JMaXN0LCB0cnVlKTtcbiAgaW5pdGlhbGl6ZXIuZWxlbWVudHMuaGFzVHJhaWxpbmdDb21tYSA9IHRydWU7XG4gIGNvbnN0IHByb3AgPSB0cy5jcmVhdGVQcm9wZXJ0eSh1bmRlZmluZWQsIFttb2RpZmllcl0sICdkZWNvcmF0b3JzJywgdW5kZWZpbmVkLCB0eXBlLCBpbml0aWFsaXplcik7XG4gIC8vIE5COiB0aGUgLmRlY29yYXRvcnMgcHJvcGVydHkgZG9lcyBub3QgZ2V0IGEgQG5vY29sbGFwc2UgcHJvcGVydHkuIFRoZXJlIGlzXG4gIC8vIG5vIGdvb2QgcmVhc29uIHdoeSAtIGl0IG1lYW5zIC5kZWNvcmF0b3JzIGlzIG5vdCBydW50aW1lIGFjY2Vzc2libGUgaWYgeW91XG4gIC8vIGNvbXBpbGUgd2l0aCBjb2xsYXBzZSBwcm9wZXJ0aWVzLCB3aGVyZWFzIHByb3BEZWNvcmF0b3JzIGlzLCB3aGljaCBkb2Vzbid0XG4gIC8vIGZvbGxvdyBhbnkgc3RyaW5nZW50IGxvZ2ljLiBIb3dldmVyIHRoaXMgaGFzIGJlZW4gdGhlIGNhc2UgcHJldmlvdXNseSwgYW5kXG4gIC8vIGFkZGluZyBpdCBiYWNrIGluIGxlYWRzIHRvIHN1YnN0YW50aWFsIGNvZGUgc2l6ZSBpbmNyZWFzZXMgYXMgQ2xvc3VyZSBmYWlsc1xuICAvLyB0byB0cmVlIHNoYWtlIHRoZXNlIHByb3BzIHdpdGhvdXQgQG5vY29sbGFwc2UuXG4gIHJldHVybiBwcm9wO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgdGhlIEFTVCBmb3IgdGhlICdjdG9yUGFyYW1ldGVycycgZmllbGQgdHlwZSBhbm5vdGF0aW9uOlxuICogICAoKSA9PiAoeyB0eXBlOiBhbnksIGRlY29yYXRvcnM/OiB7dHlwZTogRnVuY3Rpb24sIGFyZ3M/OiBhbnlbXX1bXSB9fG51bGwpW11cbiAqL1xuZnVuY3Rpb24gY3JlYXRlQ3RvclBhcmFtZXRlcnNDbGFzc1Byb3BlcnR5VHlwZSgpOiB0cy5UeXBlTm9kZSB7XG4gIC8vIFNvcnJ5IGFib3V0IHRoaXMuIFRyeSByZWFkaW5nIGp1c3QgdGhlIHN0cmluZyBsaXRlcmFscyBiZWxvdy5cbiAgY29uc3QgdHlwZUVsZW1lbnRzOiB0cy5UeXBlRWxlbWVudFtdID0gW107XG4gIHR5cGVFbGVtZW50cy5wdXNoKHRzLmNyZWF0ZVByb3BlcnR5U2lnbmF0dXJlKFxuICAgICAgdW5kZWZpbmVkLCAndHlwZScsIHVuZGVmaW5lZCxcbiAgICAgIHRzLmNyZWF0ZVR5cGVSZWZlcmVuY2VOb2RlKHRzLmNyZWF0ZUlkZW50aWZpZXIoJ2FueScpLCB1bmRlZmluZWQpLCB1bmRlZmluZWQpKTtcbiAgdHlwZUVsZW1lbnRzLnB1c2godHMuY3JlYXRlUHJvcGVydHlTaWduYXR1cmUoXG4gICAgICB1bmRlZmluZWQsICdkZWNvcmF0b3JzJywgdHMuY3JlYXRlVG9rZW4odHMuU3ludGF4S2luZC5RdWVzdGlvblRva2VuKSxcbiAgICAgIHRzLmNyZWF0ZUFycmF5VHlwZU5vZGUodHMuY3JlYXRlVHlwZUxpdGVyYWxOb2RlKFtcbiAgICAgICAgdHMuY3JlYXRlUHJvcGVydHlTaWduYXR1cmUoXG4gICAgICAgICAgICB1bmRlZmluZWQsICd0eXBlJywgdW5kZWZpbmVkLFxuICAgICAgICAgICAgdHMuY3JlYXRlVHlwZVJlZmVyZW5jZU5vZGUodHMuY3JlYXRlSWRlbnRpZmllcignRnVuY3Rpb24nKSwgdW5kZWZpbmVkKSwgdW5kZWZpbmVkKSxcbiAgICAgICAgdHMuY3JlYXRlUHJvcGVydHlTaWduYXR1cmUoXG4gICAgICAgICAgICB1bmRlZmluZWQsICdhcmdzJywgdHMuY3JlYXRlVG9rZW4odHMuU3ludGF4S2luZC5RdWVzdGlvblRva2VuKSxcbiAgICAgICAgICAgIHRzLmNyZWF0ZUFycmF5VHlwZU5vZGUoXG4gICAgICAgICAgICAgICAgdHMuY3JlYXRlVHlwZVJlZmVyZW5jZU5vZGUodHMuY3JlYXRlSWRlbnRpZmllcignYW55JyksIHVuZGVmaW5lZCkpLFxuICAgICAgICAgICAgdW5kZWZpbmVkKSxcbiAgICAgIF0pKSxcbiAgICAgIHVuZGVmaW5lZCkpO1xuICByZXR1cm4gdHMuY3JlYXRlRnVuY3Rpb25UeXBlTm9kZShcbiAgICAgIHVuZGVmaW5lZCwgW10sXG4gICAgICB0cy5jcmVhdGVBcnJheVR5cGVOb2RlKFxuICAgICAgICAgIHRzLmNyZWF0ZVVuaW9uVHlwZU5vZGUoW3RzLmNyZWF0ZVR5cGVMaXRlcmFsTm9kZSh0eXBlRWxlbWVudHMpLCB0cy5jcmVhdGVOdWxsKCldKSkpO1xufVxuXG4vKipcbiAqIFNldHMgYSBDbG9zdXJlIFxcQG5vY29sbGFwc2Ugc3ludGhldGljIGNvbW1lbnQgb24gdGhlIGdpdmVuIG5vZGUuIFRoaXMgcHJldmVudHMgQ2xvc3VyZSBDb21waWxlclxuICogZnJvbSBjb2xsYXBzaW5nIHRoZSBhcHBhcmVudGx5IHN0YXRpYyBwcm9wZXJ0eSwgd2hpY2ggd291bGQgbWFrZSBpdCBpbXBvc3NpYmxlIHRvIGZpbmQgZm9yIGNvZGVcbiAqIHRyeWluZyB0byBkZXRlY3QgaXQgYXQgcnVudGltZS5cbiAqL1xuZnVuY3Rpb24gYWRkTm9Db2xsYXBzZUNvbW1lbnQobjogdHMuTm9kZSkge1xuICB0cy5zZXRTeW50aGV0aWNMZWFkaW5nQ29tbWVudHMobiwgW3tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2luZDogdHMuU3ludGF4S2luZC5NdWx0aUxpbmVDb21tZW50VHJpdmlhLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnKiBAbm9jb2xsYXBzZSAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3M6IC0xLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmQ6IC0xLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYXNUcmFpbGluZ05ld0xpbmU6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1dKTtcbn1cblxuLyoqXG4gKiBjcmVhdGVDdG9yUGFyYW1ldGVyc0NsYXNzUHJvcGVydHkgY3JlYXRlcyBhIHN0YXRpYyAnY3RvclBhcmFtZXRlcnMnIHByb3BlcnR5IGNvbnRhaW5pbmdcbiAqIGRvd25sZXZlbGVkIGRlY29yYXRvciBpbmZvcm1hdGlvbi5cbiAqXG4gKiBUaGUgcHJvcGVydHkgY29udGFpbnMgYW4gYXJyb3cgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGFuIGFycmF5IG9mIG9iamVjdCBsaXRlcmFscyBvZiB0aGUgc2hhcGU6XG4gKiAgICAgc3RhdGljIGN0b3JQYXJhbWV0ZXJzID0gKCkgPT4gW3tcbiAqICAgICAgIHR5cGU6IFNvbWVDbGFzc3x1bmRlZmluZWQsICAvLyB0aGUgdHlwZSBvZiB0aGUgcGFyYW0gdGhhdCdzIGRlY29yYXRlZCwgaWYgaXQncyBhIHZhbHVlLlxuICogICAgICAgZGVjb3JhdG9yczogW3tcbiAqICAgICAgICAgdHlwZTogRGVjb3JhdG9yRm4sICAvLyB0aGUgdHlwZSBvZiB0aGUgZGVjb3JhdG9yIHRoYXQncyBpbnZva2VkLlxuICogICAgICAgICBhcmdzOiBbQVJHU10sICAgICAgIC8vIHRoZSBhcmd1bWVudHMgcGFzc2VkIHRvIHRoZSBkZWNvcmF0b3IuXG4gKiAgICAgICB9XVxuICogICAgIH1dO1xuICovXG5mdW5jdGlvbiBjcmVhdGVDdG9yUGFyYW1ldGVyc0NsYXNzUHJvcGVydHkoXG4gICAgZGlhZ25vc3RpY3M6IHRzLkRpYWdub3N0aWNbXSxcbiAgICBlbnRpdHlOYW1lVG9FeHByZXNzaW9uOiAobjogdHMuRW50aXR5TmFtZSkgPT4gdHMuRXhwcmVzc2lvbiB8IHVuZGVmaW5lZCxcblxuICAgIGN0b3JQYXJhbWV0ZXJzOiBQYXJhbWV0ZXJEZWNvcmF0aW9uSW5mb1tdKTogdHMuUHJvcGVydHlEZWNsYXJhdGlvbiB7XG4gIGNvbnN0IHBhcmFtczogdHMuRXhwcmVzc2lvbltdID0gW107XG5cbiAgZm9yIChjb25zdCBjdG9yUGFyYW0gb2YgY3RvclBhcmFtZXRlcnMpIHtcbiAgICBpZiAoIWN0b3JQYXJhbS50eXBlICYmIGN0b3JQYXJhbS5kZWNvcmF0b3JzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcGFyYW1zLnB1c2godHMuY3JlYXRlTnVsbCgpKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGNvbnN0IHBhcmFtVHlwZSA9IGN0b3JQYXJhbS50eXBlID9cbiAgICAgICAgdHlwZVJlZmVyZW5jZVRvRXhwcmVzc2lvbihlbnRpdHlOYW1lVG9FeHByZXNzaW9uLCBjdG9yUGFyYW0udHlwZSkgOlxuICAgICAgICB1bmRlZmluZWQ7XG4gICAgY29uc3QgbWVtYmVycyA9XG4gICAgICAgIFt0cy5jcmVhdGVQcm9wZXJ0eUFzc2lnbm1lbnQoJ3R5cGUnLCBwYXJhbVR5cGUgfHwgdHMuY3JlYXRlSWRlbnRpZmllcigndW5kZWZpbmVkJykpXTtcblxuICAgIGNvbnN0IGRlY29yYXRvcnM6IHRzLk9iamVjdExpdGVyYWxFeHByZXNzaW9uW10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IGRlY28gb2YgY3RvclBhcmFtLmRlY29yYXRvcnMpIHtcbiAgICAgIGRlY29yYXRvcnMucHVzaChleHRyYWN0TWV0YWRhdGFGcm9tU2luZ2xlRGVjb3JhdG9yKGRlY28sIGRpYWdub3N0aWNzKSk7XG4gICAgfVxuICAgIGlmIChkZWNvcmF0b3JzLmxlbmd0aCkge1xuICAgICAgbWVtYmVycy5wdXNoKHRzLmNyZWF0ZVByb3BlcnR5QXNzaWdubWVudCgnZGVjb3JhdG9ycycsIHRzLmNyZWF0ZUFycmF5TGl0ZXJhbChkZWNvcmF0b3JzKSkpO1xuICAgIH1cbiAgICBwYXJhbXMucHVzaCh0cy5jcmVhdGVPYmplY3RMaXRlcmFsKG1lbWJlcnMpKTtcbiAgfVxuXG4gIGNvbnN0IGluaXRpYWxpemVyID0gdHMuY3JlYXRlQXJyb3dGdW5jdGlvbihcbiAgICAgIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBbXSwgdW5kZWZpbmVkLCB0cy5jcmVhdGVUb2tlbih0cy5TeW50YXhLaW5kLkVxdWFsc0dyZWF0ZXJUaGFuVG9rZW4pLFxuICAgICAgdHMuY3JlYXRlQXJyYXlMaXRlcmFsKHBhcmFtcywgdHJ1ZSkpO1xuICBjb25zdCB0eXBlID0gY3JlYXRlQ3RvclBhcmFtZXRlcnNDbGFzc1Byb3BlcnR5VHlwZSgpO1xuICBjb25zdCBjdG9yUHJvcCA9IHRzLmNyZWF0ZVByb3BlcnR5KFxuICAgICAgdW5kZWZpbmVkLCBbdHMuY3JlYXRlVG9rZW4odHMuU3ludGF4S2luZC5TdGF0aWNLZXl3b3JkKV0sICdjdG9yUGFyYW1ldGVycycsIHVuZGVmaW5lZCwgdHlwZSxcbiAgICAgIGluaXRpYWxpemVyKTtcbiAgYWRkTm9Db2xsYXBzZUNvbW1lbnQoY3RvclByb3ApO1xuICByZXR1cm4gY3RvclByb3A7XG59XG5cbi8qKlxuICogY3JlYXRlUHJvcERlY29yYXRvcnNDbGFzc1Byb3BlcnR5IGNyZWF0ZXMgYSBzdGF0aWMgJ3Byb3BEZWNvcmF0b3JzJyBwcm9wZXJ0eSBjb250YWluaW5nIHR5cGVcbiAqIGluZm9ybWF0aW9uIGZvciBldmVyeSBwcm9wZXJ0eSB0aGF0IGhhcyBhIGRlY29yYXRvciBhcHBsaWVkLlxuICpcbiAqICAgICBzdGF0aWMgcHJvcERlY29yYXRvcnM6IHtba2V5OiBzdHJpbmddOiB7dHlwZTogRnVuY3Rpb24sIGFyZ3M/OiBhbnlbXX1bXX0gPSB7XG4gKiAgICAgICBwcm9wQTogW3t0eXBlOiBNeURlY29yYXRvciwgYXJnczogWzEsIDJdfSwgLi4uXSxcbiAqICAgICAgIC4uLlxuICogICAgIH07XG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZVByb3BEZWNvcmF0b3JzQ2xhc3NQcm9wZXJ0eShcbiAgICBkaWFnbm9zdGljczogdHMuRGlhZ25vc3RpY1tdLCBwcm9wZXJ0aWVzOiBNYXA8c3RyaW5nLCB0cy5EZWNvcmF0b3JbXT4pOiB0cy5Qcm9wZXJ0eURlY2xhcmF0aW9uIHtcbiAgLy8gIGBzdGF0aWMgcHJvcERlY29yYXRvcnM6IHtba2V5OiBzdHJpbmddOiBgICsge3R5cGU6IEZ1bmN0aW9uLCBhcmdzPzogYW55W119W10gKyBgfSA9IHtcXG5gKTtcbiAgY29uc3QgZW50cmllczogdHMuT2JqZWN0TGl0ZXJhbEVsZW1lbnRMaWtlW10gPSBbXTtcbiAgZm9yIChjb25zdCBbbmFtZSwgZGVjb3JhdG9yc10gb2YgcHJvcGVydGllcy5lbnRyaWVzKCkpIHtcbiAgICBlbnRyaWVzLnB1c2godHMuY3JlYXRlUHJvcGVydHlBc3NpZ25tZW50KFxuICAgICAgICBuYW1lLFxuICAgICAgICB0cy5jcmVhdGVBcnJheUxpdGVyYWwoXG4gICAgICAgICAgICBkZWNvcmF0b3JzLm1hcChkZWNvID0+IGV4dHJhY3RNZXRhZGF0YUZyb21TaW5nbGVEZWNvcmF0b3IoZGVjbywgZGlhZ25vc3RpY3MpKSkpKTtcbiAgfVxuICBjb25zdCBpbml0aWFsaXplciA9IHRzLmNyZWF0ZU9iamVjdExpdGVyYWwoZW50cmllcywgdHJ1ZSk7XG4gIGNvbnN0IHR5cGUgPSB0cy5jcmVhdGVUeXBlTGl0ZXJhbE5vZGUoW3RzLmNyZWF0ZUluZGV4U2lnbmF0dXJlKFxuICAgICAgdW5kZWZpbmVkLCB1bmRlZmluZWQsIFt0cy5jcmVhdGVQYXJhbWV0ZXIoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsICdrZXknLCB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRzLmNyZWF0ZVR5cGVSZWZlcmVuY2VOb2RlKCdzdHJpbmcnLCB1bmRlZmluZWQpLCB1bmRlZmluZWQpXSxcbiAgICAgIGNyZWF0ZURlY29yYXRvckludm9jYXRpb25UeXBlKCkpXSk7XG4gIHJldHVybiB0cy5jcmVhdGVQcm9wZXJ0eShcbiAgICAgIHVuZGVmaW5lZCwgW3RzLmNyZWF0ZVRva2VuKHRzLlN5bnRheEtpbmQuU3RhdGljS2V5d29yZCldLCAncHJvcERlY29yYXRvcnMnLCB1bmRlZmluZWQsIHR5cGUsXG4gICAgICBpbml0aWFsaXplcik7XG59XG5cbmZ1bmN0aW9uIGlzTmFtZUVxdWFsKGNsYXNzTWVtYmVyOiB0cy5DbGFzc0VsZW1lbnQsIG5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICBpZiAoY2xhc3NNZW1iZXIubmFtZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGNvbnN0IGlkID0gY2xhc3NNZW1iZXIubmFtZSBhcyB0cy5JZGVudGlmaWVyO1xuICByZXR1cm4gaWQudGV4dCA9PT0gbmFtZTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGFuIGV4cHJlc3Npb24gcmVwcmVzZW50aW5nIHRoZSAocG90ZW50aWFsbHkpIHZhbHVlIHBhcnQgZm9yIHRoZSBnaXZlbiBub2RlLlxuICpcbiAqIFRoaXMgaXMgYSBwYXJ0aWFsIHJlLWltcGxlbWVudGF0aW9uIG9mIFR5cGVTY3JpcHQncyBzZXJpYWxpemVUeXBlUmVmZXJlbmNlTm9kZS4gVGhpcyBpcyBhXG4gKiB3b3JrYXJvdW5kIGZvciBodHRwczovL2dpdGh1Yi5jb20vTWljcm9zb2Z0L1R5cGVTY3JpcHQvaXNzdWVzLzE3NTE2IChzZXJpYWxpemVUeXBlUmVmZXJlbmNlTm9kZVxuICogbm90IGJlaW5nIGV4cG9zZWQpLiBJbiBwcmFjdGljZSB0aGlzIGltcGxlbWVudGF0aW9uIGlzIHN1ZmZpY2llbnQgZm9yIEFuZ3VsYXIncyB1c2Ugb2YgdHlwZVxuICogbWV0YWRhdGEuXG4gKi9cbmZ1bmN0aW9uIHR5cGVSZWZlcmVuY2VUb0V4cHJlc3Npb24oXG4gICAgZW50aXR5TmFtZVRvRXhwcmVzc2lvbjogKG46IHRzLkVudGl0eU5hbWUpID0+IHRzLkV4cHJlc3Npb24gfCB1bmRlZmluZWQsXG4gICAgbm9kZTogdHMuVHlwZU5vZGUpOiB0cy5FeHByZXNzaW9ufHVuZGVmaW5lZCB7XG4gIGxldCBraW5kID0gbm9kZS5raW5kO1xuICBpZiAodHMuaXNMaXRlcmFsVHlwZU5vZGUobm9kZSkpIHtcbiAgICAvLyBUcmVhdCBsaXRlcmFsIHR5cGVzIGxpa2UgdGhlaXIgYmFzZSB0eXBlIChib29sZWFuLCBzdHJpbmcsIG51bWJlcikuXG4gICAga2luZCA9IG5vZGUubGl0ZXJhbC5raW5kO1xuICB9XG4gIHN3aXRjaCAoa2luZCkge1xuICAgIGNhc2UgdHMuU3ludGF4S2luZC5GdW5jdGlvblR5cGU6XG4gICAgY2FzZSB0cy5TeW50YXhLaW5kLkNvbnN0cnVjdG9yVHlwZTpcbiAgICAgIHJldHVybiB0cy5jcmVhdGVJZGVudGlmaWVyKCdGdW5jdGlvbicpO1xuICAgIGNhc2UgdHMuU3ludGF4S2luZC5BcnJheVR5cGU6XG4gICAgY2FzZSB0cy5TeW50YXhLaW5kLlR1cGxlVHlwZTpcbiAgICAgIHJldHVybiB0cy5jcmVhdGVJZGVudGlmaWVyKCdBcnJheScpO1xuICAgIGNhc2UgdHMuU3ludGF4S2luZC5UeXBlUHJlZGljYXRlOlxuICAgIGNhc2UgdHMuU3ludGF4S2luZC5UcnVlS2V5d29yZDpcbiAgICBjYXNlIHRzLlN5bnRheEtpbmQuRmFsc2VLZXl3b3JkOlxuICAgIGNhc2UgdHMuU3ludGF4S2luZC5Cb29sZWFuS2V5d29yZDpcbiAgICAgIHJldHVybiB0cy5jcmVhdGVJZGVudGlmaWVyKCdCb29sZWFuJyk7XG4gICAgY2FzZSB0cy5TeW50YXhLaW5kLlN0cmluZ0xpdGVyYWw6XG4gICAgY2FzZSB0cy5TeW50YXhLaW5kLlN0cmluZ0tleXdvcmQ6XG4gICAgICByZXR1cm4gdHMuY3JlYXRlSWRlbnRpZmllcignU3RyaW5nJyk7XG4gICAgY2FzZSB0cy5TeW50YXhLaW5kLk9iamVjdEtleXdvcmQ6XG4gICAgICByZXR1cm4gdHMuY3JlYXRlSWRlbnRpZmllcignT2JqZWN0Jyk7XG4gICAgY2FzZSB0cy5TeW50YXhLaW5kLk51bWJlcktleXdvcmQ6XG4gICAgY2FzZSB0cy5TeW50YXhLaW5kLk51bWVyaWNMaXRlcmFsOlxuICAgICAgcmV0dXJuIHRzLmNyZWF0ZUlkZW50aWZpZXIoJ051bWJlcicpO1xuICAgIGNhc2UgdHMuU3ludGF4S2luZC5UeXBlUmVmZXJlbmNlOlxuICAgICAgY29uc3QgdHlwZVJlZiA9IG5vZGUgYXMgdHMuVHlwZVJlZmVyZW5jZU5vZGU7XG4gICAgICAvLyBJZ25vcmUgYW55IGdlbmVyaWMgdHlwZXMsIGp1c3QgcmV0dXJuIHRoZSBiYXNlIHR5cGUuXG4gICAgICByZXR1cm4gZW50aXR5TmFtZVRvRXhwcmVzc2lvbih0eXBlUmVmLnR5cGVOYW1lKTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxufVxuXG4vKiogUGFyYW1ldGVyRGVjb3JhdGlvbkluZm8gZGVzY3JpYmVzIHRoZSBpbmZvcm1hdGlvbiBmb3IgYSBzaW5nbGUgY29uc3RydWN0b3IgcGFyYW1ldGVyLiAqL1xuaW50ZXJmYWNlIFBhcmFtZXRlckRlY29yYXRpb25JbmZvIHtcbiAgLyoqXG4gICAqIFRoZSB0eXBlIGRlY2xhcmF0aW9uIGZvciB0aGUgcGFyYW1ldGVyLiBPbmx5IHNldCBpZiB0aGUgdHlwZSBpcyBhIHZhbHVlIChlLmcuIGEgY2xhc3MsIG5vdCBhblxuICAgKiBpbnRlcmZhY2UpLlxuICAgKi9cbiAgdHlwZTogdHMuVHlwZU5vZGV8bnVsbDtcbiAgLyoqIFRoZSBsaXN0IG9mIGRlY29yYXRvcnMgZm91bmQgb24gdGhlIHBhcmFtZXRlciwgbnVsbCBpZiBub25lLiAqL1xuICBkZWNvcmF0b3JzOiB0cy5EZWNvcmF0b3JbXTtcbn1cblxuLyoqXG4gKiBUcmFuc2Zvcm1lciBmYWN0b3J5IGZvciB0aGUgZGVjb3JhdG9yIGRvd25sZXZlbCB0cmFuc2Zvcm1lci4gU2VlIGZpbGVvdmVydmlldyBmb3IgZGV0YWlscy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlY29yYXRvckRvd25sZXZlbFRyYW5zZm9ybWVyKFxuICAgIHR5cGVDaGVja2VyOiB0cy5UeXBlQ2hlY2tlciwgZGlhZ25vc3RpY3M6IHRzLkRpYWdub3N0aWNbXSk6XG4gICAgKGNvbnRleHQ6IHRzLlRyYW5zZm9ybWF0aW9uQ29udGV4dCkgPT4gdHMuVHJhbnNmb3JtZXI8dHMuU291cmNlRmlsZT4ge1xuICByZXR1cm4gKGNvbnRleHQ6IHRzLlRyYW5zZm9ybWF0aW9uQ29udGV4dCkgPT4ge1xuICAgIC8qKiBBIG1hcCBmcm9tIHN5bWJvbHMgdG8gdGhlIGlkZW50aWZpZXIgb2YgYW4gaW1wb3J0LCByZXNldCBwZXIgU291cmNlRmlsZS4gKi9cbiAgICBsZXQgaW1wb3J0TmFtZXNCeVN5bWJvbCA9IG5ldyBNYXA8dHMuU3ltYm9sLCB0cy5JZGVudGlmaWVyPigpO1xuXG4gICAgLyoqXG4gICAgICogQ29udmVydHMgYW4gRW50aXR5TmFtZSAoZnJvbSBhIHR5cGUgYW5ub3RhdGlvbikgdG8gYW4gZXhwcmVzc2lvbiAoYWNjZXNzaW5nIGEgdmFsdWUpLlxuICAgICAqXG4gICAgICogRm9yIGEgZ2l2ZW4gdHMuRW50aXR5TmFtZSwgdGhpcyB3YWxrcyBkZXB0aCBmaXJzdCB0byBmaW5kIHRoZSBsZWZ0bW9zdCB0cy5JZGVudGlmaWVyLCB0aGVuXG4gICAgICogY29udmVydHMgdGhlIHBhdGggaW50byBwcm9wZXJ0eSBhY2Nlc3Nlcy5cbiAgICAgKlxuICAgICAqIFRoaXMgZ2VuZXJhbGx5IHdvcmtzLCBidXQgVHlwZVNjcmlwdCdzIGVtaXQgcGlwZWxpbmUgZG9lcyBub3Qgc2VyaWFsaXplIGlkZW50aWZpZXJzIHRoYXQgYXJlXG4gICAgICogb25seSB1c2VkIGluIGEgdHlwZSBsb2NhdGlvbiAoc3VjaCBhcyBpZGVudGlmaWVycyBpbiBhIFR5cGVOb2RlKSwgZXZlbiBpZiB0aGUgaWRlbnRpZmllclxuICAgICAqIGl0c2VsZiBwb2ludHMgdG8gYSB2YWx1ZSAoZS5nLiBhIGNsYXNzKS4gVG8gYXZvaWQgdGhhdCBwcm9ibGVtLCB0aGlzIG1ldGhvZCBmaW5kcyB0aGUgc3ltYm9sXG4gICAgICogcmVwcmVzZW50aW5nIHRoZSBpZGVudGlmaWVyICh1c2luZyB0eXBlQ2hlY2tlciksIHRoZW4gbG9va3MgdXAgd2hlcmUgaXQgd2FzIGltcG9ydGVkICh1c2luZ1xuICAgICAqIGltcG9ydE5hbWVzQnlTeW1ib2wpLCBhbmQgdGhlbiB1c2VzIHRoZSBpbXBvcnRlZCBuYW1lIGluc3RlYWQgb2YgdGhlIGlkZW50aWZpZXIgZnJvbSB0aGUgdHlwZVxuICAgICAqIGV4cHJlc3Npb24sIGlmIGFueS4gT3RoZXJ3aXNlIGl0J2xsIHVzZSB0aGUgaWRlbnRpZmllciB1bmNoYW5nZWQuIFRoaXMgbWFrZXMgc3VyZSB0aGVcbiAgICAgKiBpZGVudGlmaWVyIGlzIG5vdCBtYXJrZWQgYXMgc3RlbW1pbmcgZnJvbSBhIFwidHlwZSBvbmx5XCIgZXhwcmVzc2lvbiwgY2F1c2luZyBpdCB0byBiZSBlbWl0dGVkXG4gICAgICogYW5kIGNhdXNpbmcgdGhlIGltcG9ydCB0byBiZSByZXRhaW5lZC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBlbnRpdHlOYW1lVG9FeHByZXNzaW9uKG5hbWU6IHRzLkVudGl0eU5hbWUpOiB0cy5FeHByZXNzaW9ufHVuZGVmaW5lZCB7XG4gICAgICBjb25zdCBzeW0gPSB0eXBlQ2hlY2tlci5nZXRTeW1ib2xBdExvY2F0aW9uKG5hbWUpO1xuICAgICAgaWYgKCFzeW0pIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAvLyBDaGVjayBpZiB0aGUgZW50aXR5IG5hbWUgcmVmZXJlbmNlcyBhIHN5bWJvbCB0aGF0IGlzIGFuIGFjdHVhbCB2YWx1ZS4gSWYgaXQgaXMgbm90LCBpdFxuICAgICAgLy8gY2Fubm90IGJlIHJlZmVyZW5jZWQgYnkgYW4gZXhwcmVzc2lvbiwgc28gcmV0dXJuIHVuZGVmaW5lZC5cbiAgICAgIGxldCBzeW1Ub0NoZWNrID0gc3ltO1xuICAgICAgaWYgKHN5bVRvQ2hlY2suZmxhZ3MgJiB0cy5TeW1ib2xGbGFncy5BbGlhcykge1xuICAgICAgICBzeW1Ub0NoZWNrID0gdHlwZUNoZWNrZXIuZ2V0QWxpYXNlZFN5bWJvbChzeW1Ub0NoZWNrKTtcbiAgICAgIH1cbiAgICAgIGlmICghKHN5bVRvQ2hlY2suZmxhZ3MgJiB0cy5TeW1ib2xGbGFncy5WYWx1ZSkpIHJldHVybiB1bmRlZmluZWQ7XG5cbiAgICAgIGlmICh0cy5pc0lkZW50aWZpZXIobmFtZSkpIHtcbiAgICAgICAgLy8gSWYgdGhlcmUncyBhIGtub3duIGltcG9ydCBuYW1lIGZvciB0aGlzIHN5bWJvbCwgdXNlIGl0IHNvIHRoYXQgdGhlIGltcG9ydCB3aWxsIGJlXG4gICAgICAgIC8vIHJldGFpbmVkIGFuZCB0aGUgdmFsdWUgY2FuIGJlIHJlZmVyZW5jZWQuXG4gICAgICAgIGlmIChpbXBvcnROYW1lc0J5U3ltYm9sLmhhcyhzeW0pKSByZXR1cm4gaW1wb3J0TmFtZXNCeVN5bWJvbC5nZXQoc3ltKSE7XG4gICAgICAgIC8vIE90aGVyd2lzZSB0aGlzIHdpbGwgYmUgYSBsb2NhbGx5IGRlY2xhcmVkIG5hbWUsIGp1c3QgcmV0dXJuIHRoYXQuXG4gICAgICAgIHJldHVybiBuYW1lO1xuICAgICAgfVxuICAgICAgY29uc3QgcmVmID0gZW50aXR5TmFtZVRvRXhwcmVzc2lvbihuYW1lLmxlZnQpO1xuICAgICAgaWYgKCFyZWYpIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICByZXR1cm4gdHMuY3JlYXRlUHJvcGVydHlBY2Nlc3MocmVmLCBuYW1lLnJpZ2h0KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUcmFuc2Zvcm1zIGEgY2xhc3MgZWxlbWVudC4gUmV0dXJucyBhIHRocmVlIHR1cGxlIG9mIG5hbWUsIHRyYW5zZm9ybWVkIGVsZW1lbnQsIGFuZFxuICAgICAqIGRlY29yYXRvcnMgZm91bmQuIFJldHVybnMgYW4gdW5kZWZpbmVkIG5hbWUgaWYgdGhlcmUgYXJlIG5vIGRlY29yYXRvcnMgdG8gbG93ZXIgb24gdGhlXG4gICAgICogZWxlbWVudCwgb3IgdGhlIGVsZW1lbnQgaGFzIGFuIGV4b3RpYyBuYW1lLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHRyYW5zZm9ybUNsYXNzRWxlbWVudChlbGVtZW50OiB0cy5DbGFzc0VsZW1lbnQpOlxuICAgICAgICBbc3RyaW5nfHVuZGVmaW5lZCwgdHMuQ2xhc3NFbGVtZW50LCB0cy5EZWNvcmF0b3JbXV0ge1xuICAgICAgZWxlbWVudCA9IHRzLnZpc2l0RWFjaENoaWxkKGVsZW1lbnQsIHZpc2l0b3IsIGNvbnRleHQpO1xuICAgICAgY29uc3QgZGVjb3JhdG9yc1RvS2VlcDogdHMuRGVjb3JhdG9yW10gPSBbXTtcbiAgICAgIGNvbnN0IHRvTG93ZXI6IHRzLkRlY29yYXRvcltdID0gW107XG4gICAgICBmb3IgKGNvbnN0IGRlY29yYXRvciBvZiBlbGVtZW50LmRlY29yYXRvcnMgfHwgW10pIHtcbiAgICAgICAgaWYgKCFzaG91bGRMb3dlcihkZWNvcmF0b3IsIHR5cGVDaGVja2VyKSkge1xuICAgICAgICAgIGRlY29yYXRvcnNUb0tlZXAucHVzaChkZWNvcmF0b3IpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIHRvTG93ZXIucHVzaChkZWNvcmF0b3IpO1xuICAgICAgfVxuICAgICAgaWYgKCF0b0xvd2VyLmxlbmd0aCkgcmV0dXJuIFt1bmRlZmluZWQsIGVsZW1lbnQsIFtdXTtcblxuICAgICAgaWYgKCFlbGVtZW50Lm5hbWUgfHwgZWxlbWVudC5uYW1lLmtpbmQgIT09IHRzLlN5bnRheEtpbmQuSWRlbnRpZmllcikge1xuICAgICAgICAvLyBNZXRob2QgaGFzIGEgd2VpcmQgbmFtZSwgZS5nLlxuICAgICAgICAvLyAgIFtTeW1ib2wuZm9vXSgpIHsuLi59XG4gICAgICAgIGRpYWdub3N0aWNzLnB1c2goe1xuICAgICAgICAgIGZpbGU6IGVsZW1lbnQuZ2V0U291cmNlRmlsZSgpLFxuICAgICAgICAgIHN0YXJ0OiBlbGVtZW50LmdldFN0YXJ0KCksXG4gICAgICAgICAgbGVuZ3RoOiBlbGVtZW50LmdldEVuZCgpIC0gZWxlbWVudC5nZXRTdGFydCgpLFxuICAgICAgICAgIG1lc3NhZ2VUZXh0OiBgY2Fubm90IHByb2Nlc3MgZGVjb3JhdG9ycyBvbiBzdHJhbmdlbHkgbmFtZWQgbWV0aG9kYCxcbiAgICAgICAgICBjYXRlZ29yeTogdHMuRGlhZ25vc3RpY0NhdGVnb3J5LkVycm9yLFxuICAgICAgICAgIGNvZGU6IDAsXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gW3VuZGVmaW5lZCwgZWxlbWVudCwgW11dO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBuYW1lID0gKGVsZW1lbnQubmFtZSBhcyB0cy5JZGVudGlmaWVyKS50ZXh0O1xuICAgICAgY29uc3QgbXV0YWJsZSA9IHRzLmdldE11dGFibGVDbG9uZShlbGVtZW50KTtcbiAgICAgIG11dGFibGUuZGVjb3JhdG9ycyA9IGRlY29yYXRvcnNUb0tlZXAubGVuZ3RoID9cbiAgICAgICAgICB0cy5zZXRUZXh0UmFuZ2UodHMuY3JlYXRlTm9kZUFycmF5KGRlY29yYXRvcnNUb0tlZXApLCBtdXRhYmxlLmRlY29yYXRvcnMpIDpcbiAgICAgICAgICB1bmRlZmluZWQ7XG4gICAgICByZXR1cm4gW25hbWUsIG11dGFibGUsIHRvTG93ZXJdO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRyYW5zZm9ybXMgYSBjb25zdHJ1Y3Rvci4gUmV0dXJucyB0aGUgdHJhbnNmb3JtZWQgY29uc3RydWN0b3IgYW5kIHRoZSBsaXN0IG9mIHBhcmFtZXRlclxuICAgICAqIGluZm9ybWF0aW9uIGNvbGxlY3RlZCwgY29uc2lzdGluZyBvZiBkZWNvcmF0b3JzIGFuZCBvcHRpb25hbCB0eXBlLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHRyYW5zZm9ybUNvbnN0cnVjdG9yKGN0b3I6IHRzLkNvbnN0cnVjdG9yRGVjbGFyYXRpb24pOlxuICAgICAgICBbdHMuQ29uc3RydWN0b3JEZWNsYXJhdGlvbiwgUGFyYW1ldGVyRGVjb3JhdGlvbkluZm9bXV0ge1xuICAgICAgY3RvciA9IHRzLnZpc2l0RWFjaENoaWxkKGN0b3IsIHZpc2l0b3IsIGNvbnRleHQpO1xuXG4gICAgICBjb25zdCBuZXdQYXJhbWV0ZXJzOiB0cy5QYXJhbWV0ZXJEZWNsYXJhdGlvbltdID0gW107XG4gICAgICBjb25zdCBvbGRQYXJhbWV0ZXJzID0gdHMudmlzaXRQYXJhbWV0ZXJMaXN0KGN0b3IucGFyYW1ldGVycywgdmlzaXRvciwgY29udGV4dCk7XG4gICAgICBjb25zdCBwYXJhbWV0ZXJzSW5mbzogUGFyYW1ldGVyRGVjb3JhdGlvbkluZm9bXSA9IFtdO1xuICAgICAgZm9yIChjb25zdCBwYXJhbSBvZiBvbGRQYXJhbWV0ZXJzKSB7XG4gICAgICAgIGNvbnN0IGRlY29yYXRvcnNUb0tlZXA6IHRzLkRlY29yYXRvcltdID0gW107XG4gICAgICAgIGNvbnN0IHBhcmFtSW5mbzogUGFyYW1ldGVyRGVjb3JhdGlvbkluZm8gPSB7ZGVjb3JhdG9yczogW10sIHR5cGU6IG51bGx9O1xuXG4gICAgICAgIGZvciAoY29uc3QgZGVjb3JhdG9yIG9mIHBhcmFtLmRlY29yYXRvcnMgfHwgW10pIHtcbiAgICAgICAgICBpZiAoIXNob3VsZExvd2VyKGRlY29yYXRvciwgdHlwZUNoZWNrZXIpKSB7XG4gICAgICAgICAgICBkZWNvcmF0b3JzVG9LZWVwLnB1c2goZGVjb3JhdG9yKTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBwYXJhbUluZm8hLmRlY29yYXRvcnMucHVzaChkZWNvcmF0b3IpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwYXJhbS50eXBlKSB7XG4gICAgICAgICAgLy8gcGFyYW0gaGFzIGEgdHlwZSBwcm92aWRlZCwgZS5nLiBcImZvbzogQmFyXCIuXG4gICAgICAgICAgLy8gVGhlIHR5cGUgd2lsbCBiZSBlbWl0dGVkIGFzIGEgdmFsdWUgZXhwcmVzc2lvbiBpbiBlbnRpdHlOYW1lVG9FeHByZXNzaW9uLCB3aGljaCB0YWtlc1xuICAgICAgICAgIC8vIGNhcmUgbm90IHRvIGVtaXQgYW55dGhpbmcgZm9yIHR5cGVzIHRoYXQgY2Fubm90IGJlIGV4cHJlc3NlZCBhcyBhIHZhbHVlIChlLmcuXG4gICAgICAgICAgLy8gaW50ZXJmYWNlcykuXG4gICAgICAgICAgcGFyYW1JbmZvIS50eXBlID0gcGFyYW0udHlwZTtcbiAgICAgICAgfVxuICAgICAgICBwYXJhbWV0ZXJzSW5mby5wdXNoKHBhcmFtSW5mbyk7XG4gICAgICAgIGNvbnN0IG5ld1BhcmFtID0gdHMudXBkYXRlUGFyYW1ldGVyKFxuICAgICAgICAgICAgcGFyYW0sXG4gICAgICAgICAgICAvLyBNdXN0IHBhc3MgJ3VuZGVmaW5lZCcgdG8gYXZvaWQgZW1pdHRpbmcgZGVjb3JhdG9yIG1ldGFkYXRhLlxuICAgICAgICAgICAgZGVjb3JhdG9yc1RvS2VlcC5sZW5ndGggPyBkZWNvcmF0b3JzVG9LZWVwIDogdW5kZWZpbmVkLCBwYXJhbS5tb2RpZmllcnMsXG4gICAgICAgICAgICBwYXJhbS5kb3REb3REb3RUb2tlbiwgcGFyYW0ubmFtZSwgcGFyYW0ucXVlc3Rpb25Ub2tlbiwgcGFyYW0udHlwZSwgcGFyYW0uaW5pdGlhbGl6ZXIpO1xuICAgICAgICBuZXdQYXJhbWV0ZXJzLnB1c2gobmV3UGFyYW0pO1xuICAgICAgfVxuICAgICAgY29uc3QgdXBkYXRlZCA9IHRzLnVwZGF0ZUNvbnN0cnVjdG9yKFxuICAgICAgICAgIGN0b3IsIGN0b3IuZGVjb3JhdG9ycywgY3Rvci5tb2RpZmllcnMsIG5ld1BhcmFtZXRlcnMsXG4gICAgICAgICAgdHMudmlzaXRGdW5jdGlvbkJvZHkoY3Rvci5ib2R5LCB2aXNpdG9yLCBjb250ZXh0KSk7XG4gICAgICByZXR1cm4gW3VwZGF0ZWQsIHBhcmFtZXRlcnNJbmZvXTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUcmFuc2Zvcm1zIGEgc2luZ2xlIGNsYXNzIGRlY2xhcmF0aW9uOlxuICAgICAqIC0gZGlzcGF0Y2hlcyB0byBzdHJpcCBkZWNvcmF0b3JzIG9uIG1lbWJlcnNcbiAgICAgKiAtIGNvbnZlcnRzIGRlY29yYXRvcnMgb24gdGhlIGNsYXNzIHRvIGFubm90YXRpb25zXG4gICAgICogLSBjcmVhdGVzIGEgY3RvclBhcmFtZXRlcnMgcHJvcGVydHlcbiAgICAgKiAtIGNyZWF0ZXMgYSBwcm9wRGVjb3JhdG9ycyBwcm9wZXJ0eVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHRyYW5zZm9ybUNsYXNzRGVjbGFyYXRpb24oY2xhc3NEZWNsOiB0cy5DbGFzc0RlY2xhcmF0aW9uKTogdHMuQ2xhc3NEZWNsYXJhdGlvbiB7XG4gICAgICBjbGFzc0RlY2wgPSB0cy5nZXRNdXRhYmxlQ2xvbmUoY2xhc3NEZWNsKTtcblxuICAgICAgY29uc3QgbmV3TWVtYmVyczogdHMuQ2xhc3NFbGVtZW50W10gPSBbXTtcbiAgICAgIGNvbnN0IGRlY29yYXRlZFByb3BlcnRpZXMgPSBuZXcgTWFwPHN0cmluZywgdHMuRGVjb3JhdG9yW10+KCk7XG4gICAgICBsZXQgY2xhc3NQYXJhbWV0ZXJzOiBQYXJhbWV0ZXJEZWNvcmF0aW9uSW5mb1tdfG51bGwgPSBudWxsO1xuXG4gICAgICBmb3IgKGNvbnN0IG1lbWJlciBvZiBjbGFzc0RlY2wubWVtYmVycykge1xuICAgICAgICBzd2l0Y2ggKG1lbWJlci5raW5kKSB7XG4gICAgICAgICAgY2FzZSB0cy5TeW50YXhLaW5kLlByb3BlcnR5RGVjbGFyYXRpb246XG4gICAgICAgICAgY2FzZSB0cy5TeW50YXhLaW5kLkdldEFjY2Vzc29yOlxuICAgICAgICAgIGNhc2UgdHMuU3ludGF4S2luZC5TZXRBY2Nlc3NvcjpcbiAgICAgICAgICBjYXNlIHRzLlN5bnRheEtpbmQuTWV0aG9kRGVjbGFyYXRpb246IHtcbiAgICAgICAgICAgIGNvbnN0IFtuYW1lLCBuZXdNZW1iZXIsIGRlY29yYXRvcnNdID0gdHJhbnNmb3JtQ2xhc3NFbGVtZW50KG1lbWJlcik7XG4gICAgICAgICAgICBuZXdNZW1iZXJzLnB1c2gobmV3TWVtYmVyKTtcbiAgICAgICAgICAgIGlmIChuYW1lKSBkZWNvcmF0ZWRQcm9wZXJ0aWVzLnNldChuYW1lLCBkZWNvcmF0b3JzKTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjYXNlIHRzLlN5bnRheEtpbmQuQ29uc3RydWN0b3I6IHtcbiAgICAgICAgICAgIGNvbnN0IGN0b3IgPSBtZW1iZXIgYXMgdHMuQ29uc3RydWN0b3JEZWNsYXJhdGlvbjtcbiAgICAgICAgICAgIGlmICghY3Rvci5ib2R5KSBicmVhaztcbiAgICAgICAgICAgIGNvbnN0IFtuZXdNZW1iZXIsIHBhcmFtZXRlcnNJbmZvXSA9XG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtQ29uc3RydWN0b3IobWVtYmVyIGFzIHRzLkNvbnN0cnVjdG9yRGVjbGFyYXRpb24pO1xuICAgICAgICAgICAgY2xhc3NQYXJhbWV0ZXJzID0gcGFyYW1ldGVyc0luZm87XG4gICAgICAgICAgICBuZXdNZW1iZXJzLnB1c2gobmV3TWVtYmVyKTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgbmV3TWVtYmVycy5wdXNoKHRzLnZpc2l0RWFjaENoaWxkKG1lbWJlciwgdmlzaXRvciwgY29udGV4dCkpO1xuICAgICAgfVxuICAgICAgY29uc3QgZGVjb3JhdG9ycyA9IGNsYXNzRGVjbC5kZWNvcmF0b3JzIHx8IFtdO1xuXG4gICAgICBjb25zdCBkZWNvcmF0b3JzVG9Mb3dlciA9IFtdO1xuICAgICAgY29uc3QgZGVjb3JhdG9yc1RvS2VlcDogdHMuRGVjb3JhdG9yW10gPSBbXTtcbiAgICAgIGZvciAoY29uc3QgZGVjb3JhdG9yIG9mIGRlY29yYXRvcnMpIHtcbiAgICAgICAgaWYgKHNob3VsZExvd2VyKGRlY29yYXRvciwgdHlwZUNoZWNrZXIpKSB7XG4gICAgICAgICAgZGVjb3JhdG9yc1RvTG93ZXIucHVzaChleHRyYWN0TWV0YWRhdGFGcm9tU2luZ2xlRGVjb3JhdG9yKGRlY29yYXRvciwgZGlhZ25vc3RpY3MpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkZWNvcmF0b3JzVG9LZWVwLnB1c2goZGVjb3JhdG9yKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCBuZXdDbGFzc0RlY2xhcmF0aW9uID0gdHMuZ2V0TXV0YWJsZUNsb25lKGNsYXNzRGVjbCk7XG5cbiAgICAgIGlmIChkZWNvcmF0b3JzVG9Mb3dlci5sZW5ndGgpIHtcbiAgICAgICAgbmV3TWVtYmVycy5wdXNoKGNyZWF0ZURlY29yYXRvckNsYXNzUHJvcGVydHkoZGVjb3JhdG9yc1RvTG93ZXIpKTtcbiAgICAgIH1cbiAgICAgIGlmIChjbGFzc1BhcmFtZXRlcnMpIHtcbiAgICAgICAgaWYgKChkZWNvcmF0b3JzVG9Mb3dlci5sZW5ndGgpIHx8IGNsYXNzUGFyYW1ldGVycy5zb21lKHAgPT4gISFwLmRlY29yYXRvcnMubGVuZ3RoKSkge1xuICAgICAgICAgIC8vIGVtaXQgY3RvclBhcmFtZXRlcnMgaWYgdGhlIGNsYXNzIHdhcyBkZWNvcmF0b3JlZCBhdCBhbGwsIG9yIGlmIGFueSBvZiBpdHMgY3RvcnNcbiAgICAgICAgICAvLyB3ZXJlIGNsYXNzUGFyYW1ldGVyc1xuICAgICAgICAgIG5ld01lbWJlcnMucHVzaChjcmVhdGVDdG9yUGFyYW1ldGVyc0NsYXNzUHJvcGVydHkoXG4gICAgICAgICAgICAgIGRpYWdub3N0aWNzLCBlbnRpdHlOYW1lVG9FeHByZXNzaW9uLCBjbGFzc1BhcmFtZXRlcnMpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGRlY29yYXRlZFByb3BlcnRpZXMuc2l6ZSkge1xuICAgICAgICBuZXdNZW1iZXJzLnB1c2goY3JlYXRlUHJvcERlY29yYXRvcnNDbGFzc1Byb3BlcnR5KGRpYWdub3N0aWNzLCBkZWNvcmF0ZWRQcm9wZXJ0aWVzKSk7XG4gICAgICB9XG4gICAgICBuZXdDbGFzc0RlY2xhcmF0aW9uLm1lbWJlcnMgPSB0cy5zZXRUZXh0UmFuZ2UoXG4gICAgICAgICAgdHMuY3JlYXRlTm9kZUFycmF5KG5ld01lbWJlcnMsIG5ld0NsYXNzRGVjbGFyYXRpb24ubWVtYmVycy5oYXNUcmFpbGluZ0NvbW1hKSxcbiAgICAgICAgICBjbGFzc0RlY2wubWVtYmVycyk7XG4gICAgICBuZXdDbGFzc0RlY2xhcmF0aW9uLmRlY29yYXRvcnMgPVxuICAgICAgICAgIGRlY29yYXRvcnNUb0tlZXAubGVuZ3RoID8gdHMuY3JlYXRlTm9kZUFycmF5KGRlY29yYXRvcnNUb0tlZXApIDogdW5kZWZpbmVkO1xuICAgICAgcmV0dXJuIG5ld0NsYXNzRGVjbGFyYXRpb247XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdmlzaXRvcihub2RlOiB0cy5Ob2RlKTogdHMuTm9kZSB7XG4gICAgICBzd2l0Y2ggKG5vZGUua2luZCkge1xuICAgICAgICBjYXNlIHRzLlN5bnRheEtpbmQuU291cmNlRmlsZToge1xuICAgICAgICAgIGltcG9ydE5hbWVzQnlTeW1ib2wgPSBuZXcgTWFwPHRzLlN5bWJvbCwgdHMuSWRlbnRpZmllcj4oKTtcbiAgICAgICAgICByZXR1cm4gdHMudmlzaXRFYWNoQ2hpbGQobm9kZSwgdmlzaXRvciwgY29udGV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgY2FzZSB0cy5TeW50YXhLaW5kLkltcG9ydERlY2xhcmF0aW9uOiB7XG4gICAgICAgICAgY29uc3QgaW1wRGVjbCA9IG5vZGUgYXMgdHMuSW1wb3J0RGVjbGFyYXRpb247XG4gICAgICAgICAgaWYgKGltcERlY2wuaW1wb3J0Q2xhdXNlKSB7XG4gICAgICAgICAgICBjb25zdCBpbXBvcnRDbGF1c2UgPSBpbXBEZWNsLmltcG9ydENsYXVzZTtcbiAgICAgICAgICAgIGNvbnN0IG5hbWVzID0gW107XG4gICAgICAgICAgICBpZiAoaW1wb3J0Q2xhdXNlLm5hbWUpIHtcbiAgICAgICAgICAgICAgbmFtZXMucHVzaChpbXBvcnRDbGF1c2UubmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaW1wb3J0Q2xhdXNlLm5hbWVkQmluZGluZ3MgJiZcbiAgICAgICAgICAgICAgICBpbXBvcnRDbGF1c2UubmFtZWRCaW5kaW5ncy5raW5kID09PSB0cy5TeW50YXhLaW5kLk5hbWVkSW1wb3J0cykge1xuICAgICAgICAgICAgICBjb25zdCBuYW1lZEltcG9ydHMgPSBpbXBvcnRDbGF1c2UubmFtZWRCaW5kaW5ncyBhcyB0cy5OYW1lZEltcG9ydHM7XG4gICAgICAgICAgICAgIG5hbWVzLnB1c2goLi4ubmFtZWRJbXBvcnRzLmVsZW1lbnRzLm1hcChlID0+IGUubmFtZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChjb25zdCBuYW1lIG9mIG5hbWVzKSB7XG4gICAgICAgICAgICAgIGNvbnN0IHN5bSA9IHR5cGVDaGVja2VyLmdldFN5bWJvbEF0TG9jYXRpb24obmFtZSkhO1xuICAgICAgICAgICAgICBpbXBvcnROYW1lc0J5U3ltYm9sLnNldChzeW0sIG5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdHMudmlzaXRFYWNoQ2hpbGQobm9kZSwgdmlzaXRvciwgY29udGV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgY2FzZSB0cy5TeW50YXhLaW5kLkNsYXNzRGVjbGFyYXRpb246IHtcbiAgICAgICAgICByZXR1cm4gdHJhbnNmb3JtQ2xhc3NEZWNsYXJhdGlvbihub2RlIGFzIHRzLkNsYXNzRGVjbGFyYXRpb24pO1xuICAgICAgICB9XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgcmV0dXJuIHZpc2l0RWFjaENoaWxkKG5vZGUsIHZpc2l0b3IsIGNvbnRleHQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiAoc2Y6IHRzLlNvdXJjZUZpbGUpID0+IHZpc2l0b3Ioc2YpIGFzIHRzLlNvdXJjZUZpbGU7XG4gIH07XG59XG4iXX0=