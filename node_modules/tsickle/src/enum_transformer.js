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
        define("tsickle/src/enum_transformer", ["require", "exports", "typescript", "tsickle/src/transformer_util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @fileoverview Transforms TypeScript enum declarations to Closure enum declarations, which
     * look like:
     *
     *     /.. @enum {number} ./
     *     const Foo = {BAR: 0, BAZ: 1, ...};
     *     export {Foo};  // even if originally exported on one line.
     *
     * This declares an enum type for Closure Compiler (and Closure JS users of this TS code).
     * Splitting the enum into declaration and export is required so that local references to the
     * type resolve ("@type {Foo}").
     */
    var ts = require("typescript");
    var transformer_util_1 = require("tsickle/src/transformer_util");
    /** isInNamespace returns true if any of node's ancestors is a namespace (ModuleDeclaration). */
    function isInNamespace(node) {
        // Must use the original node because node might have already been transformed, with node.parent
        // no longer being set.
        var parent = ts.getOriginalNode(node).parent;
        while (parent) {
            if (parent.kind === ts.SyntaxKind.ModuleDeclaration) {
                return true;
            }
            parent = parent.parent;
        }
        return false;
    }
    /**
     * getEnumMemberType computes the type of an enum member by inspecting its initializer expression.
     */
    function getEnumMemberType(typeChecker, member) {
        // Enum members without initialization have type 'number'
        if (!member.initializer) {
            return 'number';
        }
        var type = typeChecker.getTypeAtLocation(member.initializer);
        // Note: checking against 'NumberLike' instead of just 'Number' means this code
        // handles both
        //   MEMBER = 3,  // TypeFlags.NumberLiteral
        // and
        //   MEMBER = someFunction(),  // TypeFlags.Number
        if (type.flags & ts.TypeFlags.NumberLike) {
            return 'number';
        }
        // If the value is not a number, it must be a string.
        // TypeScript does not allow enum members to have any other type.
        return 'string';
    }
    /**
     * getEnumType computes the Closure type of an enum, by iterating through the members and gathering
     * their types.
     */
    function getEnumType(typeChecker, enumDecl) {
        var e_1, _a;
        var hasNumber = false;
        var hasString = false;
        try {
            for (var _b = __values(enumDecl.members), _c = _b.next(); !_c.done; _c = _b.next()) {
                var member = _c.value;
                var type = getEnumMemberType(typeChecker, member);
                if (type === 'string') {
                    hasString = true;
                }
                else if (type === 'number') {
                    hasNumber = true;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (hasNumber && hasString) {
            return '?'; // Closure's new type inference doesn't support enums of unions.
        }
        else if (hasNumber) {
            return 'number';
        }
        else if (hasString) {
            return 'string';
        }
        else {
            // Perhaps an empty enum?
            return '?';
        }
    }
    exports.getEnumType = getEnumType;
    /**
     * Transformer factory for the enum transformer. See fileoverview for details.
     */
    function enumTransformer(typeChecker, diagnostics) {
        return function (context) {
            function visitor(node) {
                var e_2, _a, e_3, _b;
                if (!ts.isEnumDeclaration(node))
                    return ts.visitEachChild(node, visitor, context);
                // TODO(martinprobst): The enum transformer does not work for enums embedded in namespaces,
                // because TS does not support splitting export and declaration ("export {Foo};") in
                // namespaces. tsickle's emit for namespaces is unintelligible for Closure in any case, so
                // this is left to fix for another day.
                if (isInNamespace(node))
                    return ts.visitEachChild(node, visitor, context);
                // TypeScript does not emit any code for ambient enums, so early exit here to prevent the code
                // below from producing runtime values for an ambient structure.
                if (transformer_util_1.isAmbient(node))
                    return ts.visitEachChild(node, visitor, context);
                var name = node.name.getText();
                var isExported = transformer_util_1.hasModifierFlag(node, ts.ModifierFlags.Export);
                var enumType = getEnumType(typeChecker, node);
                var values = [];
                var enumIndex = 0;
                try {
                    for (var _c = __values(node.members), _d = _c.next(); !_d.done; _d = _c.next()) {
                        var member = _d.value;
                        var enumValue = void 0;
                        if (member.initializer) {
                            var enumConstValue = typeChecker.getConstantValue(member);
                            if (typeof enumConstValue === 'number') {
                                enumIndex = enumConstValue + 1;
                                enumValue = ts.createLiteral(enumConstValue);
                            }
                            else {
                                // Non-numeric enum value (string or an expression).
                                // Emit this initializer expression as-is.
                                // Note: if the member's initializer expression refers to another
                                // value within the enum (e.g. something like
                                //   enum Foo {
                                //     Field1,
                                //     Field2 = Field1 + something(),
                                //   }
                                // Then when we emit the initializer we produce invalid code because
                                // on the Closure side the reference to Field1 has to be namespaced,
                                // e.g. written "Foo.Field1 + something()".
                                // Hopefully this doesn't come up often -- if the enum instead has
                                // something like
                                //     Field2 = Field1 + 3,
                                // then it's still a constant expression and we inline the constant
                                // value in the above branch of this "if" statement.
                                enumValue = visitor(member.initializer);
                            }
                        }
                        else {
                            enumValue = ts.createLiteral(enumIndex);
                            enumIndex++;
                        }
                        var memberName = member.name.getText();
                        values.push(ts.setOriginalNode(ts.setTextRange(ts.createPropertyAssignment(memberName, enumValue), member), member));
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                var varDecl = ts.createVariableStatement(
                /* modifiers */ undefined, ts.createVariableDeclarationList([ts.createVariableDeclaration(name, undefined, ts.createObjectLiteral(ts.setTextRange(ts.createNodeArray(values, true), node.members), true))], 
                /* create a const var */ ts.NodeFlags.Const));
                var comment = {
                    kind: ts.SyntaxKind.MultiLineCommentTrivia,
                    text: "* @enum {" + enumType + "} ",
                    hasTrailingNewLine: true,
                    pos: -1,
                    end: -1
                };
                ts.setSyntheticLeadingComments(varDecl, [comment]);
                var resultNodes = [varDecl];
                if (isExported) {
                    // Create a separate export {...} statement, so that the enum name can be used in local
                    // type annotations within the file.
                    resultNodes.push(ts.createExportDeclaration(undefined, undefined, ts.createNamedExports([ts.createExportSpecifier(undefined, name)])));
                }
                if (transformer_util_1.hasModifierFlag(node, ts.ModifierFlags.Const)) {
                    // By TypeScript semantics, const enums disappear after TS compilation.
                    // We still need to generate the runtime value above to make Closure Compiler's type system
                    // happy and allow refering to enums from JS code, but we should at least not emit string
                    // value mappings.
                    return resultNodes;
                }
                try {
                    // Emit the reverse mapping of foo[foo.BAR] = 'BAR'; lines for number enum members
                    for (var _e = __values(node.members), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var member = _f.value;
                        var memberName = member.name;
                        var memberType = getEnumMemberType(typeChecker, member);
                        if (memberType !== 'number')
                            continue;
                        // TypeScript enum members can have Identifier names or String names.
                        // We need to emit slightly different code to support these two syntaxes:
                        var nameExpr = void 0;
                        var memberAccess = void 0;
                        if (ts.isIdentifier(memberName)) {
                            // Foo[Foo.ABC] = "ABC";
                            nameExpr = transformer_util_1.createSingleQuoteStringLiteral(memberName.text);
                            // Make sure to create a clean, new identifier, so comments do not get emitted twice.
                            var ident = ts.createIdentifier(transformer_util_1.getIdentifierText(memberName));
                            memberAccess = ts.createPropertyAccess(ts.createIdentifier(name), ident);
                        }
                        else {
                            // Foo[Foo["A B C"]] = "A B C"; or Foo[Foo[expression]] = expression;
                            nameExpr = ts.isComputedPropertyName(memberName) ? memberName.expression : memberName;
                            memberAccess = ts.createElementAccess(ts.createIdentifier(name), nameExpr);
                        }
                        resultNodes.push(ts.createStatement(ts.createAssignment(ts.createElementAccess(ts.createIdentifier(name), memberAccess), nameExpr)));
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
                return resultNodes;
            }
            return function (sf) { return visitor(sf); };
        };
    }
    exports.enumTransformer = enumTransformer;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW51bV90cmFuc2Zvcm1lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9lbnVtX3RyYW5zZm9ybWVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQUVIOzs7Ozs7Ozs7OztPQVdHO0lBRUgsK0JBQWlDO0lBRWpDLGlFQUFpSDtJQUVqSCxnR0FBZ0c7SUFDaEcsU0FBUyxhQUFhLENBQUMsSUFBYTtRQUNsQyxnR0FBZ0c7UUFDaEcsdUJBQXVCO1FBQ3ZCLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDO1FBQzdDLE9BQU8sTUFBTSxFQUFFO1lBQ2IsSUFBSSxNQUFNLENBQUMsSUFBSSxLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsaUJBQWlCLEVBQUU7Z0JBQ25ELE9BQU8sSUFBSSxDQUFDO2FBQ2I7WUFDRCxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztTQUN4QjtRQUNELE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUVEOztPQUVHO0lBQ0gsU0FBUyxpQkFBaUIsQ0FBQyxXQUEyQixFQUFFLE1BQXFCO1FBQzNFLHlEQUF5RDtRQUN6RCxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRTtZQUN2QixPQUFPLFFBQVEsQ0FBQztTQUNqQjtRQUNELElBQU0sSUFBSSxHQUFHLFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDL0QsK0VBQStFO1FBQy9FLGVBQWU7UUFDZiw0Q0FBNEM7UUFDNUMsTUFBTTtRQUNOLGtEQUFrRDtRQUNsRCxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUU7WUFDeEMsT0FBTyxRQUFRLENBQUM7U0FDakI7UUFDRCxxREFBcUQ7UUFDckQsaUVBQWlFO1FBQ2pFLE9BQU8s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Ii8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IFRyYW5zZm9ybXMgVHlwZVNjcmlwdCBlbnVtIGRlY2xhcmF0aW9ucyB0byBDbG9zdXJlIGVudW0gZGVjbGFyYXRpb25zLCB3aGljaFxuICogbG9vayBsaWtlOlxuICpcbiAqICAgICAvLi4gQGVudW0ge251bWJlcn0gLi9cbiAqICAgICBjb25zdCBGb28gPSB7QkFSOiAwLCBCQVo6IDEsIC4uLn07XG4gKiAgICAgZXhwb3J0IHtGb299OyAgLy8gZXZlbiBpZiBvcmlnaW5hbGx5IGV4cG9ydGVkIG9uIG9uZSBsaW5lLlxuICpcbiAqIFRoaXMgZGVjbGFyZXMgYW4gZW51bSB0eXBlIGZvciBDbG9zdXJlIENvbXBpbGVyIChhbmQgQ2xvc3VyZSBKUyB1c2VycyBvZiB0aGlzIFRTIGNvZGUpLlxuICogU3BsaXR0aW5nIHRoZSBlbnVtIGludG8gZGVjbGFyYXRpb24gYW5kIGV4cG9ydCBpcyByZXF1aXJlZCBzbyB0aGF0IGxvY2FsIHJlZmVyZW5jZXMgdG8gdGhlXG4gKiB0eXBlIHJlc29sdmUgKFwiQHR5cGUge0Zvb31cIikuXG4gKi9cblxuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cbmltcG9ydCB7Y3JlYXRlU2luZ2xlUXVvdGVTdHJpbmdMaXRlcmFsLCBnZXRJZGVudGlmaWVyVGV4dCwgaGFzTW9kaWZpZXJGbGFnLCBpc0FtYmllbnR9IGZyb20gJy4vdHJhbnNmb3JtZXJfdXRpbCc7XG5cbi8qKiBpc0luTmFtZXNwYWNlIHJldHVybnMgdHJ1ZSBpZiBhbnkgb2Ygbm9kZSdzIGFuY2VzdG9ycyBpcyBhIG5hbWVzcGFjZSAoTW9kdWxlRGVjbGFyYXRpb24pLiAqL1xuZnVuY3Rpb24gaXNJbk5hbWVzcGFjZShub2RlOiB0cy5Ob2RlKSB7XG4gIC8vIE11c3QgdXNlIHRoZSBvcmlnaW5hbCBub2RlIGJlY2F1c2Ugbm9kZSBtaWdodCBoYXZlIGFscmVhZHkgYmVlbiB0cmFuc2Zvcm1lZCwgd2l0aCBub2RlLnBhcmVudFxuICAvLyBubyBsb25nZXIgYmVpbmcgc2V0LlxuICBsZXQgcGFyZW50ID0gdHMuZ2V0T3JpZ2luYWxOb2RlKG5vZGUpLnBhcmVudDtcbiAgd2hpbGUgKHBhcmVudCkge1xuICAgIGlmIChwYXJlbnQua2luZCA9PT0gdHMuU3ludGF4S2luZC5Nb2R1bGVEZWNsYXJhdGlvbikge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnQ7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIGdldEVudW1NZW1iZXJUeXBlIGNvbXB1dGVzIHRoZSB0eXBlIG9mIGFuIGVudW0gbWVtYmVyIGJ5IGluc3BlY3RpbmcgaXRzIGluaXRpYWxpemVyIGV4cHJlc3Npb24uXG4gKi9cbmZ1bmN0aW9uIGdldEVudW1NZW1iZXJUeXBlKHR5cGVDaGVja2VyOiB0cy5UeXBlQ2hlY2tlciwgbWVtYmVyOiB0cy5FbnVtTWVtYmVyKTogJ251bWJlcid8J3N0cmluZycge1xuICAvLyBFbnVtIG1lbWJlcnMgd2l0aG91dCBpbml0aWFsaXphdGlvbiBoYXZlIHR5cGUgJ251bWJlcidcbiAgaWYgKCFtZW1iZXIuaW5pdGlhbGl6ZXIpIHtcbiAgICByZXR1cm4gJ251bWJlcic7XG4gIH1cbiAgY29uc3QgdHlwZSA9IHR5cGVDaGVja2VyLmdldFR5cGVBdExvY2F0aW9uKG1lbWJlci5pbml0aWFsaXplcik7XG4gIC8vIE5vdGU6IGNoZWNraW5nIGFnYWluc3QgJ051bWJlckxpa2UnIGluc3RlYWQgb2YganVzdCAnTnVtYmVyJyBtZWFucyB0aGlzIGNvZGVcbiAgLy8gaGFuZGxlcyBib3RoXG4gIC8vICAgTUVNQkVSID0gMywgIC8vIFR5cGVGbGFncy5OdW1iZXJMaXRlcmFsXG4gIC8vIGFuZFxuICAvLyAgIE1FTUJFUiA9IHNvbWVGdW5jdGlvbigpLCAgLy8gVHlwZUZsYWdzLk51bWJlclxuICBpZiAodHlwZS5mbGFncyAmIHRzLlR5cGVGbGFncy5OdW1iZXJMaWtlKSB7XG4gICAgcmV0dXJuICdudW1iZXInO1xuICB9XG4gIC8vIElmIHRoZSB2YWx1ZSBpcyBub3QgYSBudW1iZXIsIGl0IG11c3QgYmUgYSBzdHJpbmcuXG4gIC8vIFR5cGVTY3JpcHQgZG9lcyBub3QgYWxsb3cgZW51bSBtZW1iZXJzIHRvIGhhdmUgYW55IG90aGVyIHR5cGUuXG4gIHJldHVybiAnc3RyaW5nJztcbn1cblxuLyoqXG4gKiBnZXRFbnVtVHlwZSBjb21wdXRlcyB0aGUgQ2xvc3VyZSB0eXBlIG9mIGFuIGVudW0sIGJ5IGl0ZXJhdGluZyB0aHJvdWdoIHRoZSBtZW1iZXJzIGFuZCBnYXRoZXJpbmdcbiAqIHRoZWlyIHR5cGVzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RW51bVR5cGUodHlwZUNoZWNrZXI6IHRzLlR5cGVDaGVja2VyLCBlbnVtRGVjbDogdHMuRW51bURlY2xhcmF0aW9uKTogJ251bWJlcid8XG4gICAgJ3N0cmluZyd8Jz8nIHtcbiAgbGV0IGhhc051bWJlciA9IGZhbHNlO1xuICBsZXQgaGFzU3RyaW5nID0gZmFsc2U7XG4gIGZvciAoY29uc3QgbWVtYmVyIG9mIGVudW1EZWNsLm1lbWJlcnMpIHtcbiAgICBjb25zdCB0eXBlID0gZ2V0RW51bU1lbWJlclR5cGUodHlwZUNoZWNrZXIsIG1lbWJlcik7XG4gICAgaWYgKHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICBoYXNTdHJpbmcgPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ251bWJlcicpIHtcbiAgICAgIGhhc051bWJlciA9IHRydWU7XG4gICAgfVxuICB9XG4gIGlmIChoYXNOdW1iZXIgJiYgaGFzU3RyaW5nKSB7XG4gICAgcmV0dXJuICc/JzsgIC8vIENsb3N1cmUncyBuZXcgdHlwZSBpbmZlcmVuY2UgZG9lc24ndCBzdXBwb3J0IGVudW1zIG9mIHVuaW9ucy5cbiAgfSBlbHNlIGlmIChoYXNOdW1iZXIpIHtcbiAgICByZXR1cm4gJ251bWJlcic7XG4gIH0gZWxzZSBpZiAoaGFzU3RyaW5nKSB7XG4gICAgcmV0dXJuICdzdHJpbmcnO1xuICB9IGVsc2Uge1xuICAgIC8vIFBlcmhhcHMgYW4gZW1wdHkgZW51bT9cbiAgICByZXR1cm4gJz8nO1xuICB9XG59XG5cbi8qKlxuICogVHJhbnNmb3JtZXIgZmFjdG9yeSBmb3IgdGhlIGVudW0gdHJhbnNmb3JtZXIuIFNlZSBmaWxlb3ZlcnZpZXcgZm9yIGRldGFpbHMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBlbnVtVHJhbnNmb3JtZXIodHlwZUNoZWNrZXI6IHRzLlR5cGVDaGVja2VyLCBkaWFnbm9zdGljczogdHMuRGlhZ25vc3RpY1tdKTpcbiAgICAoY29udGV4dDogdHMuVHJhbnNmb3JtYXRpb25Db250ZXh0KSA9PiB0cy5UcmFuc2Zvcm1lcjx0cy5Tb3VyY2VGaWxlPiB7XG4gIHJldHVybiAoY29udGV4dDogdHMuVHJhbnNmb3JtYXRpb25Db250ZXh0KSA9PiB7XG4gICAgZnVuY3Rpb24gdmlzaXRvcjxUIGV4dGVuZHMgdHMuTm9kZT4obm9kZTogVCk6IFR8dHMuTm9kZVtdIHtcbiAgICAgIGlmICghdHMuaXNFbnVtRGVjbGFyYXRpb24obm9kZSkpIHJldHVybiB0cy52aXNpdEVhY2hDaGlsZChub2RlLCB2aXNpdG9yLCBjb250ZXh0KTtcblxuICAgICAgLy8gVE9ETyhtYXJ0aW5wcm9ic3QpOiBUaGUgZW51bSB0cmFuc2Zvcm1lciBkb2VzIG5vdCB3b3JrIGZvciBlbnVtcyBlbWJlZGRlZCBpbiBuYW1lc3BhY2VzLFxuICAgICAgLy8gYmVjYXVzZSBUUyBkb2VzIG5vdCBzdXBwb3J0IHNwbGl0dGluZyBleHBvcnQgYW5kIGRlY2xhcmF0aW9uIChcImV4cG9ydCB7Rm9vfTtcIikgaW5cbiAgICAgIC8vIG5hbWVzcGFjZXMuIHRzaWNrbGUncyBlbWl0IGZvciBuYW1lc3BhY2VzIGlzIHVuaW50ZWxsaWdpYmxlIGZvciBDbG9zdXJlIGluIGFueSBjYXNlLCBzb1xuICAgICAgLy8gdGhpcyBpcyBsZWZ0IHRvIGZpeCBmb3IgYW5vdGhlciBkYXkuXG4gICAgICBpZiAoaXNJbk5hbWVzcGFjZShub2RlKSkgcmV0dXJuIHRzLnZpc2l0RWFjaENoaWxkKG5vZGUsIHZpc2l0b3IsIGNvbnRleHQpO1xuXG4gICAgICAvLyBUeXBlU2NyaXB0IGRvZXMgbm90IGVtaXQgYW55IGNvZGUgZm9yIGFtYmllbnQgZW51bXMsIHNvIGVhcmx5IGV4aXQgaGVyZSB0byBwcmV2ZW50IHRoZSBjb2RlXG4gICAgICAvLyBiZWxvdyBmcm9tIHByb2R1Y2luZyBydW50aW1lIHZhbHVlcyBmb3IgYW4gYW1iaWVudCBzdHJ1Y3R1cmUuXG4gICAgICBpZiAoaXNBbWJpZW50KG5vZGUpKSByZXR1cm4gdHMudmlzaXRFYWNoQ2hpbGQobm9kZSwgdmlzaXRvciwgY29udGV4dCk7XG5cbiAgICAgIGNvbnN0IG5hbWUgPSBub2RlLm5hbWUuZ2V0VGV4dCgpO1xuICAgICAgY29uc3QgaXNFeHBvcnRlZCA9IGhhc01vZGlmaWVyRmxhZyhub2RlLCB0cy5Nb2RpZmllckZsYWdzLkV4cG9ydCk7XG4gICAgICBjb25zdCBlbnVtVHlwZSA9IGdldEVudW1UeXBlKHR5cGVDaGVja2VyLCBub2RlKTtcblxuICAgICAgY29uc3QgdmFsdWVzOiB0cy5Qcm9wZXJ0eUFzc2lnbm1lbnRbXSA9IFtdO1xuICAgICAgbGV0IGVudW1JbmRleCA9IDA7XG4gICAgICBmb3IgKGNvbnN0IG1lbWJlciBvZiBub2RlLm1lbWJlcnMpIHtcbiAgICAgICAgbGV0IGVudW1WYWx1ZTogdHMuRXhwcmVzc2lvbjtcbiAgICAgICAgaWYgKG1lbWJlci5pbml0aWFsaXplcikge1xuICAgICAgICAgIGNvbnN0IGVudW1Db25zdFZhbHVlID0gdHlwZUNoZWNrZXIuZ2V0Q29uc3RhbnRWYWx1ZShtZW1iZXIpO1xuICAgICAgICAgIGlmICh0eXBlb2YgZW51bUNvbnN0VmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICBlbnVtSW5kZXggPSBlbnVtQ29uc3RWYWx1ZSArIDE7XG4gICAgICAgICAgICBlbnVtVmFsdWUgPSB0cy5jcmVhdGVMaXRlcmFsKGVudW1Db25zdFZhbHVlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gTm9uLW51bWVyaWMgZW51bSB2YWx1ZSAoc3RyaW5nIG9yIGFuIGV4cHJlc3Npb24pLlxuICAgICAgICAgICAgLy8gRW1pdCB0aGlzIGluaXRpYWxpemVyIGV4cHJlc3Npb24gYXMtaXMuXG4gICAgICAgICAgICAvLyBOb3RlOiBpZiB0aGUgbWVtYmVyJ3MgaW5pdGlhbGl6ZXIgZXhwcmVzc2lvbiByZWZlcnMgdG8gYW5vdGhlclxuICAgICAgICAgICAgLy8gdmFsdWUgd2l0aGluIHRoZSBlbnVtIChlLmcuIHNvbWV0aGluZyBsaWtlXG4gICAgICAgICAgICAvLyAgIGVudW0gRm9vIHtcbiAgICAgICAgICAgIC8vICAgICBGaWVsZDEsXG4gICAgICAgICAgICAvLyAgICAgRmllbGQyID0gRmllbGQxICsgc29tZXRoaW5nKCksXG4gICAgICAgICAgICAvLyAgIH1cbiAgICAgICAgICAgIC8vIFRoZW4gd2hlbiB3ZSBlbWl0IHRoZSBpbml0aWFsaXplciB3ZSBwcm9kdWNlIGludmFsaWQgY29kZSBiZWNhdXNlXG4gICAgICAgICAgICAvLyBvbiB0aGUgQ2xvc3VyZSBzaWRlIHRoZSByZWZlcmVuY2UgdG8gRmllbGQxIGhhcyB0byBiZSBuYW1lc3BhY2VkLFxuICAgICAgICAgICAgLy8gZS5nLiB3cml0dGVuIFwiRm9vLkZpZWxkMSArIHNvbWV0aGluZygpXCIuXG4gICAgICAgICAgICAvLyBIb3BlZnVsbHkgdGhpcyBkb2Vzbid0IGNvbWUgdXAgb2Z0ZW4gLS0gaWYgdGhlIGVudW0gaW5zdGVhZCBoYXNcbiAgICAgICAgICAgIC8vIHNvbWV0aGluZyBsaWtlXG4gICAgICAgICAgICAvLyAgICAgRmllbGQyID0gRmllbGQxICsgMyxcbiAgICAgICAgICAgIC8vIHRoZW4gaXQncyBzdGlsbCBhIGNvbnN0YW50IGV4cHJlc3Npb24gYW5kIHdlIGlubGluZSB0aGUgY29uc3RhbnRcbiAgICAgICAgICAgIC8vIHZhbHVlIGluIHRoZSBhYm92ZSBicmFuY2ggb2YgdGhpcyBcImlmXCIgc3RhdGVtZW50LlxuICAgICAgICAgICAgZW51bVZhbHVlID0gdmlzaXRvcihtZW1iZXIuaW5pdGlhbGl6ZXIpIGFzIHRzLkV4cHJlc3Npb247XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVudW1WYWx1ZSA9IHRzLmNyZWF0ZUxpdGVyYWwoZW51bUluZGV4KTtcbiAgICAgICAgICBlbnVtSW5kZXgrKztcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBtZW1iZXJOYW1lID0gbWVtYmVyLm5hbWUuZ2V0VGV4dCgpO1xuICAgICAgICB2YWx1ZXMucHVzaCh0cy5zZXRPcmlnaW5hbE5vZGUoXG4gICAgICAgICAgICB0cy5zZXRUZXh0UmFuZ2UodHMuY3JlYXRlUHJvcGVydHlBc3NpZ25tZW50KG1lbWJlck5hbWUsIGVudW1WYWx1ZSksIG1lbWJlciksIG1lbWJlcikpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB2YXJEZWNsID0gdHMuY3JlYXRlVmFyaWFibGVTdGF0ZW1lbnQoXG4gICAgICAgICAgLyogbW9kaWZpZXJzICovIHVuZGVmaW5lZCxcbiAgICAgICAgICB0cy5jcmVhdGVWYXJpYWJsZURlY2xhcmF0aW9uTGlzdChcbiAgICAgICAgICAgICAgW3RzLmNyZWF0ZVZhcmlhYmxlRGVjbGFyYXRpb24oXG4gICAgICAgICAgICAgICAgICBuYW1lLCB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICB0cy5jcmVhdGVPYmplY3RMaXRlcmFsKFxuICAgICAgICAgICAgICAgICAgICAgIHRzLnNldFRleHRSYW5nZSh0cy5jcmVhdGVOb2RlQXJyYXkodmFsdWVzLCB0cnVlKSwgbm9kZS5tZW1iZXJzKSwgdHJ1ZSkpXSxcbiAgICAgICAgICAgICAgLyogY3JlYXRlIGEgY29uc3QgdmFyICovIHRzLk5vZGVGbGFncy5Db25zdCkpO1xuICAgICAgY29uc3QgY29tbWVudDogdHMuU3ludGhlc2l6ZWRDb21tZW50ID0ge1xuICAgICAgICBraW5kOiB0cy5TeW50YXhLaW5kLk11bHRpTGluZUNvbW1lbnRUcml2aWEsXG4gICAgICAgIHRleHQ6IGAqIEBlbnVtIHske2VudW1UeXBlfX0gYCxcbiAgICAgICAgaGFzVHJhaWxpbmdOZXdMaW5lOiB0cnVlLFxuICAgICAgICBwb3M6IC0xLFxuICAgICAgICBlbmQ6IC0xXG4gICAgICB9O1xuICAgICAgdHMuc2V0U3ludGhldGljTGVhZGluZ0NvbW1lbnRzKHZhckRlY2wsIFtjb21tZW50XSk7XG5cbiAgICAgIGNvbnN0IHJlc3VsdE5vZGVzOiB0cy5Ob2RlW10gPSBbdmFyRGVjbF07XG4gICAgICBpZiAoaXNFeHBvcnRlZCkge1xuICAgICAgICAvLyBDcmVhdGUgYSBzZXBhcmF0ZSBleHBvcnQgey4uLn0gc3RhdGVtZW50LCBzbyB0aGF0IHRoZSBlbnVtIG5hbWUgY2FuIGJlIHVzZWQgaW4gbG9jYWxcbiAgICAgICAgLy8gdHlwZSBhbm5vdGF0aW9ucyB3aXRoaW4gdGhlIGZpbGUuXG4gICAgICAgIHJlc3VsdE5vZGVzLnB1c2godHMuY3JlYXRlRXhwb3J0RGVjbGFyYXRpb24oXG4gICAgICAgICAgICB1bmRlZmluZWQsIHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHRzLmNyZWF0ZU5hbWVkRXhwb3J0cyhbdHMuY3JlYXRlRXhwb3J0U3BlY2lmaWVyKHVuZGVmaW5lZCwgbmFtZSldKSkpO1xuICAgICAgfVxuXG4gICAgICBpZiAoaGFzTW9kaWZpZXJGbGFnKG5vZGUsIHRzLk1vZGlmaWVyRmxhZ3MuQ29uc3QpKSB7XG4gICAgICAgIC8vIEJ5IFR5cGVTY3JpcHQgc2VtYW50aWNzLCBjb25zdCBlbnVtcyBkaXNhcHBlYXIgYWZ0ZXIgVFMgY29tcGlsYXRpb24uXG4gICAgICAgIC8vIFdlIHN0aWxsIG5lZWQgdG8gZ2VuZXJhdGUgdGhlIHJ1bnRpbWUgdmFsdWUgYWJvdmUgdG8gbWFrZSBDbG9zdXJlIENvbXBpbGVyJ3MgdHlwZSBzeXN0ZW1cbiAgICAgICAgLy8gaGFwcHkgYW5kIGFsbG93IHJlZmVyaW5nIHRvIGVudW1zIGZyb20gSlMgY29kZSwgYnV0IHdlIHNob3VsZCBhdCBsZWFzdCBub3QgZW1pdCBzdHJpbmdcbiAgICAgICAgLy8gdmFsdWUgbWFwcGluZ3MuXG4gICAgICAgIHJldHVybiByZXN1bHROb2RlcztcbiAgICAgIH1cblxuICAgICAgLy8gRW1pdCB0aGUgcmV2ZXJzZSBtYXBwaW5nIG9mIGZvb1tmb28uQkFSXSA9ICdCQVInOyBsaW5lcyBmb3IgbnVtYmVyIGVudW0gbWVtYmVyc1xuICAgICAgZm9yIChjb25zdCBtZW1iZXIgb2Ygbm9kZS5tZW1iZXJzKSB7XG4gICAgICAgIGNvbnN0IG1lbWJlck5hbWUgPSBtZW1iZXIubmFtZTtcbiAgICAgICAgY29uc3QgbWVtYmVyVHlwZSA9IGdldEVudW1NZW1iZXJUeXBlKHR5cGVDaGVja2VyLCBtZW1iZXIpO1xuICAgICAgICBpZiAobWVtYmVyVHlwZSAhPT0gJ251bWJlcicpIGNvbnRpbnVlO1xuXG4gICAgICAgIC8vIFR5cGVTY3JpcHQgZW51bSBtZW1iZXJzIGNhbiBoYXZlIElkZW50aWZpZXIgbmFtZXMgb3IgU3RyaW5nIG5hbWVzLlxuICAgICAgICAvLyBXZSBuZWVkIHRvIGVtaXQgc2xpZ2h0bHkgZGlmZmVyZW50IGNvZGUgdG8gc3VwcG9ydCB0aGVzZSB0d28gc3ludGF4ZXM6XG4gICAgICAgIGxldCBuYW1lRXhwcjogdHMuRXhwcmVzc2lvbjtcbiAgICAgICAgbGV0IG1lbWJlckFjY2VzczogdHMuRXhwcmVzc2lvbjtcbiAgICAgICAgaWYgKHRzLmlzSWRlbnRpZmllcihtZW1iZXJOYW1lKSkge1xuICAgICAgICAgIC8vIEZvb1tGb28uQUJDXSA9IFwiQUJDXCI7XG4gICAgICAgICAgbmFtZUV4cHIgPSBjcmVhdGVTaW5nbGVRdW90ZVN0cmluZ0xpdGVyYWwobWVtYmVyTmFtZS50ZXh0KTtcbiAgICAgICAgICAvLyBNYWtlIHN1cmUgdG8gY3JlYXRlIGEgY2xlYW4sIG5ldyBpZGVudGlmaWVyLCBzbyBjb21tZW50cyBkbyBub3QgZ2V0IGVtaXR0ZWQgdHdpY2UuXG4gICAgICAgICAgY29uc3QgaWRlbnQgPSB0cy5jcmVhdGVJZGVudGlmaWVyKGdldElkZW50aWZpZXJUZXh0KG1lbWJlck5hbWUpKTtcbiAgICAgICAgICBtZW1iZXJBY2Nlc3MgPSB0cy5jcmVhdGVQcm9wZXJ0eUFjY2Vzcyh0cy5jcmVhdGVJZGVudGlmaWVyKG5hbWUpLCBpZGVudCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gRm9vW0Zvb1tcIkEgQiBDXCJdXSA9IFwiQSBCIENcIjsgb3IgRm9vW0Zvb1tleHByZXNzaW9uXV0gPSBleHByZXNzaW9uO1xuICAgICAgICAgIG5hbWVFeHByID0gdHMuaXNDb21wdXRlZFByb3BlcnR5TmFtZShtZW1iZXJOYW1lKSA/IG1lbWJlck5hbWUuZXhwcmVzc2lvbiA6IG1lbWJlck5hbWU7XG4gICAgICAgICAgbWVtYmVyQWNjZXNzID0gdHMuY3JlYXRlRWxlbWVudEFjY2Vzcyh0cy5jcmVhdGVJZGVudGlmaWVyKG5hbWUpLCBuYW1lRXhwcik7XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0Tm9kZXMucHVzaCh0cy5jcmVhdGVTdGF0ZW1lbnQodHMuY3JlYXRlQXNzaWdubWVudChcbiAgICAgICAgICAgIHRzLmNyZWF0ZUVsZW1lbnRBY2Nlc3ModHMuY3JlYXRlSWRlbnRpZmllcihuYW1lKSwgbWVtYmVyQWNjZXNzKSwgbmFtZUV4cHIpKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0Tm9kZXM7XG4gICAgfVxuXG4gICAgcmV0dXJuIChzZjogdHMuU291cmNlRmlsZSkgPT4gdmlzaXRvcihzZikgYXMgdHMuU291cmNlRmlsZTtcbiAgfTtcbn1cbiJdfQ==