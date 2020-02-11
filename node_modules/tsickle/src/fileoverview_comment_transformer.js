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
        define("tsickle/src/fileoverview_comment_transformer", ["require", "exports", "typescript", "tsickle/src/jsdoc", "tsickle/src/transformer_util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ts = require("typescript");
    var jsdoc = require("tsickle/src/jsdoc");
    var transformer_util_1 = require("tsickle/src/transformer_util");
    /**
     * A set of JSDoc tags that mark a comment as a fileoverview comment. These are recognized by other
     * pieces of infrastructure (Closure Compiler, module system, ...).
     */
    var FILEOVERVIEW_COMMENT_MARKERS = new Set(['fileoverview', 'externs', 'modName', 'mods', 'pintomodule']);
    /**
     * Given a parsed \@fileoverview comment, ensures it has all the attributes we need.
     * This function can be called to modify an existing comment or to make a new one.
     *
     * @param tags Comment as parsed list of tags; modified in-place.
     */
    function augmentFileoverviewComments(tags) {
        // Ensure we start with a @fileoverview.
        if (!tags.find(function (t) { return t.tagName === 'fileoverview'; })) {
            tags.splice(0, 0, { tagName: 'fileoverview', text: 'added by tsickle' });
        }
        // Find or create a @suppress tag.
        // Closure compiler barfs if there's a duplicated @suppress tag in a file, so the tag must
        // only appear once and be merged.
        var suppressTag = tags.find(function (t) { return t.tagName === 'suppress'; });
        var suppressions;
        if (suppressTag) {
            suppressions = new Set((suppressTag.type || '').split(',').map(function (s) { return s.trim(); }));
        }
        else {
            suppressTag = { tagName: 'suppress', text: 'checked by tsc' };
            tags.push(suppressTag);
            suppressions = new Set();
        }
        // Ensure our suppressions are included in the @suppress tag:
        // 1) Suppress checkTypes.  We believe the code has already been type-checked by TypeScript,
        // and we cannot model all the TypeScript type decisions in Closure syntax.
        suppressions.add('checkTypes');
        // 2) Suppress extraRequire.  We remove extra requires at the TypeScript level, so any require
        // that gets to the JS level is a load-bearing require.
        suppressions.add('extraRequire');
        // 3) Suppress uselessCode.  We emit an "if (false)" around type declarations,
        // which is flagged as unused code unless we suppress it.
        suppressions.add('uselessCode');
        // 4) Suppress some checks for user errors that TS already checks.
        suppressions.add('missingReturn');
        suppressions.add('unusedPrivateMembers');
        // 5) Suppress checking for @override, because TS doesn't model it.
        suppressions.add('missingOverride');
        suppressTag.type = Array.from(suppressions.values()).sort().join(',');
        return tags;
    }
    /**
     * A transformer that ensures the emitted JS file has an \@fileoverview comment that contains an
     * \@suppress {checkTypes} annotation by either adding or updating an existing comment.
     */
    function transformFileoverviewCommentFactory(diagnostics) {
        return function () {
            function checkNoFileoverviewComments(context, comments, message) {
                var e_1, _a;
                try {
                    for (var comments_1 = __values(comments), comments_1_1 = comments_1.next(); !comments_1_1.done; comments_1_1 = comments_1.next()) {
                        var comment = comments_1_1.value;
                        var parse = jsdoc.parse(comment);
                        if (parse !== null && parse.tags.some(function (t) { return FILEOVERVIEW_COMMENT_MARKERS.has(t.tagName); })) {
                            // Report a warning; this should not break compilation in third party code.
                            transformer_util_1.reportDiagnostic(diagnostics, context, message, comment.originalRange, ts.DiagnosticCategory.Warning);
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (comments_1_1 && !comments_1_1.done && (_a = comments_1.return)) _a.call(comments_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            return function (sourceFile) {
                var text = sourceFile.getFullText();
                var fileComments = [];
                var firstStatement = sourceFile.statements.length && sourceFile.statements[0] || null;
                var originalComments = ts.getLeadingCommentRanges(text, 0) || [];
                if (!firstStatement) {
                    // In an empty source file, all comments are file-level comments.
                    fileComments = transformer_util_1.synthesizeCommentRanges(sourceFile, originalComments);
                }
                else {
                    // Search for the last comment split from the file with a \n\n. All comments before that are
                    // considered fileoverview comments, all comments after that belong to the next
                    // statement(s). If none found, comments remains empty, and the code below will insert a new
                    // fileoverview comment.
                    for (var i = originalComments.length - 1; i >= 0; i--) {
                        var end = originalComments[i].end;
                        if (!text.substring(end).startsWith('\n\n') &&
                            !text.substring(end).startsWith('\r\n\r\n')) {
                            continue;
                        }
                        // This comment is separated from the source file with a double break, marking it (and any
                        // preceding comments) as a file-level comment. Split them off and attach them onto a
                        // NotEmittedStatement, so that they do not get lost later on.
                        var synthesizedComments = jsdoc.synthesizeLeadingComments(firstStatement);
                        var notEmitted = ts.createNotEmittedStatement(sourceFile);
                        // Modify the comments on the firstStatement in place by removing the file-level comments.
                        fileComments = synthesizedComments.splice(0, i + 1);
                        // Move the fileComments onto notEmitted.
                        ts.setSyntheticLeadingComments(notEmitted, fileComments);
                        sourceFile = transformer_util_1.updateSourceFileNode(sourceFile, ts.createNodeArray(__spread([notEmitted, firstStatement], sourceFile.statements.slice(1))));
                        break;
                    }
                    // Now walk every top level statement and escape/drop any @fileoverview comments found.
                    // Closure ignores all @fileoverview comments but the last, so tsickle must make sure not to
                    // emit duplicated ones.
                    for (var i = 0; i < sourceFile.statements.length; i++) {
                        var stmt = sourceFile.statements[i];
                        // Accept the NotEmittedStatement inserted above.
                        if (i === 0 && stmt.kind === ts.SyntaxKind.NotEmittedStatement)
                            continue;
                        var comments = jsdoc.synthesizeLeadingComments(stmt);
                        checkNoFileoverviewComments(stmt, comments, "file comments must be at the top of the file, " +
                            "separated from the file body by an empty line.");
                    }
                }
                // Closure Compiler considers the *last* comment with @fileoverview (or @externs or
                // @nocompile) that has not been attached to some other tree node to be the file overview
                // comment, and only applies @suppress tags from it. Google-internal tooling considers *any*
                // comment mentioning @fileoverview.
                var fileoverviewIdx = -1;
                var tags = [];
                for (var i = fileComments.length - 1; i >= 0; i--) {
                    var parse = jsdoc.parseContents(fileComments[i].text);
                    if (parse !== null && parse.tags.some(function (t) { return FILEOVERVIEW_COMMENT_MARKERS.has(t.tagName); })) {
                        fileoverviewIdx = i;
                        tags = parse.tags;
                        break;
                    }
                }
                if (fileoverviewIdx !== -1) {
                    checkNoFileoverviewComments(firstStatement || sourceFile, fileComments.slice(0, fileoverviewIdx), "duplicate file level comment");
                }
                augmentFileoverviewComments(tags);
                var commentText = jsdoc.toStringWithoutStartEnd(tags);
                if (fileoverviewIdx < 0) {
                    // No existing comment to merge with, just emit a new one.
                    return addNewFileoverviewComment(sourceFile, commentText);
                }
                fileComments[fileoverviewIdx].text = commentText;
                // sf does not need to be updated, synthesized comments are mutable.
                return sourceFile;
            };
        };
    }
    exports.transformFileoverviewCommentFactory = transformFileoverviewCommentFactory;
    function addNewFileoverviewComment(sf, commentText) {
        var syntheticFirstStatement = transformer_util_1.createNotEmittedStatement(sf);
        syntheticFirstStatement = ts.addSyntheticTrailingComment(syntheticFirstStatement, ts.SyntaxKind.MultiLineCommentTrivia, commentText, true);
        return transformer_util_1.updateSourceFileNode(sf, ts.createNodeArray(__spread([syntheticFirstStatement], sf.statements)));
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZW92ZXJ2aWV3X2NvbW1lbnRfdHJhbnNmb3JtZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvZmlsZW92ZXJ2aWV3X2NvbW1lbnRfdHJhbnNmb3JtZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFFSCwrQkFBaUM7SUFFakMseUNBQWlDO0lBQ2pDLGlFQUE4SDtJQUU5SDs7O09BR0c7SUFDSCxJQUFNLDRCQUE0QixHQUM5QixJQUFJLEdBQUcsQ0FBQyxDQUFDLGNBQWMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFDO0lBRTNFOzs7OztPQUtHO0lBQ0gsU0FBUywyQkFBMkIsQ0FBQyxJQUFpQjtRQUNwRCx3Q0FBd0M7UUFDeEMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsT0FBTyxLQUFLLGNBQWMsRUFBNUIsQ0FBNEIsQ0FBQyxFQUFFO1lBQ2pELElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFDLE9BQU8sRUFBRSxjQUFjLEVBQUUsSUFBSSxFQUFFLGtCQUFrQixFQUFDLENBQUMsQ0FBQztTQUN4RTtRQUVELGtDQUFrQztRQUNsQywwRkFBMEY7UUFDMUYsa0NBQWtDO1FBQ2xDLElBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsT0FBTyxLQUFLLFVBQVUsRUFBeEIsQ0FBd0IsQ0FBQyxDQUFDO1FBQzNELElBQUksWUFBeUIsQ0FBQztRQUM5QixJQUFJLFdBQVcsRUFBRTtZQUNmLFlBQVksR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLENBQUMs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Q0FBQyxFQUFFLGVBQWUsQ0FBQyxFQUNwRSw4QkFBOEIsQ0FBQyxDQUFDO2lCQUNyQztnQkFFRCwyQkFBMkIsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDbEMsSUFBTSxXQUFXLEdBQUcsS0FBSyxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUV4RCxJQUFJLGVBQWUsR0FBRyxDQUFDLEVBQUU7b0JBQ3ZCLDBEQUEwRDtvQkFDMUQsT0FBTyx5QkFBeUIsQ0FBQyxVQUFVLEVBQUUsV0FBVyxDQUFDLENBQUM7aUJBQzNEO2dCQUVELFlBQVksQ0FBQyxlQUFlLENBQUMsQ0FBQyxJQUFJLEdBQUcsV0FBVyxDQUFDO2dCQUNqRCxvRUFBb0U7Z0JBQ3BFLE9BQU8sVUFBVSxDQUFDO1lBQ3BCLENBQUMsQ0FBQztRQUNKLENBQUMsQ0FBQztJQUNKLENBQUM7SUFwR0Qsa0ZBb0dDO0lBRUQsU0FBUyx5QkFBeUIsQ0FBQyxFQUFpQixFQUFFLFdBQW1CO1FBQ3ZFLElBQUksdUJBQXVCLEdBQUcsNENBQXlCLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDNUQsdUJBQXVCLEdBQUcsRUFBRSxDQUFDLDJCQUEyQixDQUNwRCx1QkFBdUIsRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLHNCQUFzQixFQUFFLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN0RixPQUFPLHVDQUFvQixDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsZUFBZSxXQUFFLHVCQUF1QixHQUFLLEVBQUUsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDO0lBQ25HLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuXG5pbXBvcnQgKiBhcyBqc2RvYyBmcm9tICcuL2pzZG9jJztcbmltcG9ydCB7Y3JlYXRlTm90RW1pdHRlZFN0YXRlbWVudCwgcmVwb3J0RGlhZ25vc3RpYywgc3ludGhlc2l6ZUNvbW1lbnRSYW5nZXMsIHVwZGF0ZVNvdXJjZUZpbGVOb2RlfSBmcm9tICcuL3RyYW5zZm9ybWVyX3V0aWwnO1xuXG4vKipcbiAqIEEgc2V0IG9mIEpTRG9jIHRhZ3MgdGhhdCBtYXJrIGEgY29tbWVudCBhcyBhIGZpbGVvdmVydmlldyBjb21tZW50LiBUaGVzZSBhcmUgcmVjb2duaXplZCBieSBvdGhlclxuICogcGllY2VzIG9mIGluZnJhc3RydWN0dXJlIChDbG9zdXJlIENvbXBpbGVyLCBtb2R1bGUgc3lzdGVtLCAuLi4pLlxuICovXG5jb25zdCBGSUxFT1ZFUlZJRVdfQ09NTUVOVF9NQVJLRVJTOiBSZWFkb25seVNldDxzdHJpbmc+ID1cbiAgICBuZXcgU2V0KFsnZmlsZW92ZXJ2aWV3JywgJ2V4dGVybnMnLCAnbW9kTmFtZScsICdtb2RzJywgJ3BpbnRvbW9kdWxlJ10pO1xuXG4vKipcbiAqIEdpdmVuIGEgcGFyc2VkIFxcQGZpbGVvdmVydmlldyBjb21tZW50LCBlbnN1cmVzIGl0IGhhcyBhbGwgdGhlIGF0dHJpYnV0ZXMgd2UgbmVlZC5cbiAqIFRoaXMgZnVuY3Rpb24gY2FuIGJlIGNhbGxlZCB0byBtb2RpZnkgYW4gZXhpc3RpbmcgY29tbWVudCBvciB0byBtYWtlIGEgbmV3IG9uZS5cbiAqXG4gKiBAcGFyYW0gdGFncyBDb21tZW50IGFzIHBhcnNlZCBsaXN0IG9mIHRhZ3M7IG1vZGlmaWVkIGluLXBsYWNlLlxuICovXG5mdW5jdGlvbiBhdWdtZW50RmlsZW92ZXJ2aWV3Q29tbWVudHModGFnczoganNkb2MuVGFnW10pIHtcbiAgLy8gRW5zdXJlIHdlIHN0YXJ0IHdpdGggYSBAZmlsZW92ZXJ2aWV3LlxuICBpZiAoIXRhZ3MuZmluZCh0ID0+IHQudGFnTmFtZSA9PT0gJ2ZpbGVvdmVydmlldycpKSB7XG4gICAgdGFncy5zcGxpY2UoMCwgMCwge3RhZ05hbWU6ICdmaWxlb3ZlcnZpZXcnLCB0ZXh0OiAnYWRkZWQgYnkgdHNpY2tsZSd9KTtcbiAgfVxuXG4gIC8vIEZpbmQgb3IgY3JlYXRlIGEgQHN1cHByZXNzIHRhZy5cbiAgLy8gQ2xvc3VyZSBjb21waWxlciBiYXJmcyBpZiB0aGVyZSdzIGEgZHVwbGljYXRlZCBAc3VwcHJlc3MgdGFnIGluIGEgZmlsZSwgc28gdGhlIHRhZyBtdXN0XG4gIC8vIG9ubHkgYXBwZWFyIG9uY2UgYW5kIGJlIG1lcmdlZC5cbiAgbGV0IHN1cHByZXNzVGFnID0gdGFncy5maW5kKHQgPT4gdC50YWdOYW1lID09PSAnc3VwcHJlc3MnKTtcbiAgbGV0IHN1cHByZXNzaW9uczogU2V0PHN0cmluZz47XG4gIGlmIChzdXBwcmVzc1RhZykge1xuICAgIHN1cHByZXNzaW9ucyA9IG5ldyBTZXQoKHN1cHByZXNzVGFnLnR5cGUgfHwgJycpLnNwbGl0KCcsJykubWFwKHMgPT4gcy50cmltKCkpKTtcbiAgfSBlbHNlIHtcbiAgICBzdXBwcmVzc1RhZyA9IHt0YWdOYW1lOiAnc3VwcHJlc3MnLCB0ZXh0OiAnY2hlY2tlZCBieSB0c2MnfTtcbiAgICB0YWdzLnB1c2goc3VwcHJlc3NUYWcpO1xuICAgIHN1cHByZXNzaW9ucyA9IG5ldyBTZXQoKTtcbiAgfVxuXG4gIC8vIEVuc3VyZSBvdXIgc3VwcHJlc3Npb25zIGFyZSBpbmNsdWRlZCBpbiB0aGUgQHN1cHByZXNzIHRhZzpcbiAgLy8gMSkgU3VwcHJlc3MgY2hlY2tUeXBlcy4gIFdlIGJlbGlldmUgdGhlIGNvZGUgaGFzIGFscmVhZHkgYmVlbiB0eXBlLWNoZWNrZWQgYnkgVHlwZVNjcmlwdCxcbiAgLy8gYW5kIHdlIGNhbm5vdCBtb2RlbCBhbGwgdGhlIFR5cGVTY3JpcHQgdHlwZSBkZWNpc2lvbnMgaW4gQ2xvc3VyZSBzeW50YXguXG4gIHN1cHByZXNzaW9ucy5hZGQoJ2NoZWNrVHlwZXMnKTtcbiAgLy8gMikgU3VwcHJlc3MgZXh0cmFSZXF1aXJlLiAgV2UgcmVtb3ZlIGV4dHJhIHJlcXVpcmVzIGF0IHRoZSBUeXBlU2NyaXB0IGxldmVsLCBzbyBhbnkgcmVxdWlyZVxuICAvLyB0aGF0IGdldHMgdG8gdGhlIEpTIGxldmVsIGlzIGEgbG9hZC1iZWFyaW5nIHJlcXVpcmUuXG4gIHN1cHByZXNzaW9ucy5hZGQoJ2V4dHJhUmVxdWlyZScpO1xuICAvLyAzKSBTdXBwcmVzcyB1c2VsZXNzQ29kZS4gIFdlIGVtaXQgYW4gXCJpZiAoZmFsc2UpXCIgYXJvdW5kIHR5cGUgZGVjbGFyYXRpb25zLFxuICAvLyB3aGljaCBpcyBmbGFnZ2VkIGFzIHVudXNlZCBjb2RlIHVubGVzcyB3ZSBzdXBwcmVzcyBpdC5cbiAgc3VwcHJlc3Npb25zLmFkZCgndXNlbGVzc0NvZGUnKTtcbiAgLy8gNCkgU3VwcHJlc3Mgc29tZSBjaGVja3MgZm9yIHVzZXIgZXJyb3JzIHRoYXQgVFMgYWxyZWFkeSBjaGVja3MuXG4gIHN1cHByZXNzaW9ucy5hZGQoJ21pc3NpbmdSZXR1cm4nKTtcbiAgc3VwcHJlc3Npb25zLmFkZCgndW51c2VkUHJpdmF0ZU1lbWJlcnMnKTtcbiAgLy8gNSkgU3VwcHJlc3MgY2hlY2tpbmcgZm9yIEBvdmVycmlkZSwgYmVjYXVzZSBUUyBkb2Vzbid0IG1vZGVsIGl0LlxuICBzdXBwcmVzc2lvbnMuYWRkKCdtaXNzaW5nT3ZlcnJpZGUnKTtcbiAgc3VwcHJlc3NUYWcudHlwZSA9IEFycmF5LmZyb20oc3VwcHJlc3Npb25zLnZhbHVlcygpKS5zb3J0KCkuam9pbignLCcpO1xuXG4gIHJldHVybiB0YWdzO1xufVxuXG4vKipcbiAqIEEgdHJhbnNmb3JtZXIgdGhhdCBlbnN1cmVzIHRoZSBlbWl0dGVkIEpTIGZpbGUgaGFzIGFuIFxcQGZpbGVvdmVydmlldyBjb21tZW50IHRoYXQgY29udGFpbnMgYW5cbiAqIFxcQHN1cHByZXNzIHtjaGVja1R5cGVzfSBhbm5vdGF0aW9uIGJ5IGVpdGhlciBhZGRpbmcgb3IgdXBkYXRpbmcgYW4gZXhpc3RpbmcgY29tbWVudC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRyYW5zZm9ybUZpbGVvdmVydmlld0NvbW1lbnRGYWN0b3J5KGRpYWdub3N0aWNzOiB0cy5EaWFnbm9zdGljW10pIHtcbiAgcmV0dXJuICgpOiAoc291cmNlRmlsZTogdHMuU291cmNlRmlsZSkgPT4gdHMuU291cmNlRmlsZSA9PiB7XG4gICAgZnVuY3Rpb24gY2hlY2tOb0ZpbGVvdmVydmlld0NvbW1lbnRzKFxuICAgICAgICBjb250ZXh0OiB0cy5Ob2RlLCBjb21tZW50czoganNkb2MuU3ludGhlc2l6ZWRDb21tZW50V2l0aE9yaWdpbmFsW10sIG1lc3NhZ2U6IHN0cmluZykge1xuICAgICAgZm9yIChjb25zdCBjb21tZW50IG9mIGNvbW1lbnRzKSB7XG4gICAgICAgIGNvbnN0IHBhcnNlID0ganNkb2MucGFyc2UoY29tbWVudCk7XG4gICAgICAgIGlmIChwYXJzZSAhPT0gbnVsbCAmJiBwYXJzZS50YWdzLnNvbWUodCA9PiBGSUxFT1ZFUlZJRVdfQ09NTUVOVF9NQVJLRVJTLmhhcyh0LnRhZ05hbWUpKSkge1xuICAgICAgICAgIC8vIFJlcG9ydCBhIHdhcm5pbmc7IHRoaXMgc2hvdWxkIG5vdCBicmVhayBjb21waWxhdGlvbiBpbiB0aGlyZCBwYXJ0eSBjb2RlLlxuICAgICAgICAgIHJlcG9ydERpYWdub3N0aWMoXG4gICAgICAgICAgICAgIGRpYWdub3N0aWNzLCBjb250ZXh0LCBtZXNzYWdlLCBjb21tZW50Lm9yaWdpbmFsUmFuZ2UsIHRzLkRpYWdub3N0aWNDYXRlZ29yeS5XYXJuaW5nKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiAoc291cmNlRmlsZTogdHMuU291cmNlRmlsZSkgPT4ge1xuICAgICAgY29uc3QgdGV4dCA9IHNvdXJjZUZpbGUuZ2V0RnVsbFRleHQoKTtcblxuICAgICAgbGV0IGZpbGVDb21tZW50czogdHMuU3ludGhlc2l6ZWRDb21tZW50W10gPSBbXTtcbiAgICAgIGNvbnN0IGZpcnN0U3RhdGVtZW50ID0gc291cmNlRmlsZS5zdGF0ZW1lbnRzLmxlbmd0aCAmJiBzb3VyY2VGaWxlLnN0YXRlbWVudHNbMF0gfHwgbnVsbDtcblxuICAgICAgY29uc3Qgb3JpZ2luYWxDb21tZW50cyA9IHRzLmdldExlYWRpbmdDb21tZW50UmFuZ2VzKHRleHQsIDApIHx8IFtdO1xuICAgICAgaWYgKCFmaXJzdFN0YXRlbWVudCkge1xuICAgICAgICAvLyBJbiBhbiBlbXB0eSBzb3VyY2UgZmlsZSwgYWxsIGNvbW1lbnRzIGFyZSBmaWxlLWxldmVsIGNvbW1lbnRzLlxuICAgICAgICBmaWxlQ29tbWVudHMgPSBzeW50aGVzaXplQ29tbWVudFJhbmdlcyhzb3VyY2VGaWxlLCBvcmlnaW5hbENvbW1lbnRzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFNlYXJjaCBmb3IgdGhlIGxhc3QgY29tbWVudCBzcGxpdCBmcm9tIHRoZSBmaWxlIHdpdGggYSBcXG5cXG4uIEFsbCBjb21tZW50cyBiZWZvcmUgdGhhdCBhcmVcbiAgICAgICAgLy8gY29uc2lkZXJlZCBmaWxlb3ZlcnZpZXcgY29tbWVudHMsIGFsbCBjb21tZW50cyBhZnRlciB0aGF0IGJlbG9uZyB0byB0aGUgbmV4dFxuICAgICAgICAvLyBzdGF0ZW1lbnQocykuIElmIG5vbmUgZm91bmQsIGNvbW1lbnRzIHJlbWFpbnMgZW1wdHksIGFuZCB0aGUgY29kZSBiZWxvdyB3aWxsIGluc2VydCBhIG5ld1xuICAgICAgICAvLyBmaWxlb3ZlcnZpZXcgY29tbWVudC5cbiAgICAgICAgZm9yIChsZXQgaSA9IG9yaWdpbmFsQ29tbWVudHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICBjb25zdCBlbmQgPSBvcmlnaW5hbENvbW1lbnRzW2ldLmVuZDtcbiAgICAgICAgICBpZiAoIXRleHQuc3Vic3RyaW5nKGVuZCkuc3RhcnRzV2l0aCgnXFxuXFxuJykgJiZcbiAgICAgICAgICAgICAgIXRleHQuc3Vic3RyaW5nKGVuZCkuc3RhcnRzV2l0aCgnXFxyXFxuXFxyXFxuJykpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBUaGlzIGNvbW1lbnQgaXMgc2VwYXJhdGVkIGZyb20gdGhlIHNvdXJjZSBmaWxlIHdpdGggYSBkb3VibGUgYnJlYWssIG1hcmtpbmcgaXQgKGFuZCBhbnlcbiAgICAgICAgICAvLyBwcmVjZWRpbmcgY29tbWVudHMpIGFzIGEgZmlsZS1sZXZlbCBjb21tZW50LiBTcGxpdCB0aGVtIG9mZiBhbmQgYXR0YWNoIHRoZW0gb250byBhXG4gICAgICAgICAgLy8gTm90RW1pdHRlZFN0YXRlbWVudCwgc28gdGhhdCB0aGV5IGRvIG5vdCBnZXQgbG9zdCBsYXRlciBvbi5cbiAgICAgICAgICBjb25zdCBzeW50aGVzaXplZENvbW1lbnRzID0ganNkb2Muc3ludGhlc2l6ZUxlYWRpbmdDb21tZW50cyhmaXJzdFN0YXRlbWVudCk7XG4gICAgICAgICAgY29uc3Qgbm90RW1pdHRlZCA9IHRzLmNyZWF0ZU5vdEVtaXR0ZWRTdGF0ZW1lbnQoc291cmNlRmlsZSk7XG4gICAgICAgICAgLy8gTW9kaWZ5IHRoZSBjb21tZW50cyBvbiB0aGUgZmlyc3RTdGF0ZW1lbnQgaW4gcGxhY2UgYnkgcmVtb3ZpbmcgdGhlIGZpbGUtbGV2ZWwgY29tbWVudHMuXG4gICAgICAgICAgZmlsZUNvbW1lbnRzID0gc3ludGhlc2l6ZWRDb21tZW50cy5zcGxpY2UoMCwgaSArIDEpO1xuICAgICAgICAgIC8vIE1vdmUgdGhlIGZpbGVDb21tZW50cyBvbnRvIG5vdEVtaXR0ZWQuXG4gICAgICAgICAgdHMuc2V0U3ludGhldGljTGVhZGluZ0NvbW1lbnRzKG5vdEVtaXR0ZWQsIGZpbGVDb21tZW50cyk7XG4gICAgICAgICAgc291cmNlRmlsZSA9IHVwZGF0ZVNvdXJjZUZpbGVOb2RlKFxuICAgICAgICAgICAgICBzb3VyY2VGaWxlLFxuICAgICAgICAgICAgICB0cy5jcmVhdGVOb2RlQXJyYXkoW25vdEVtaXR0ZWQsIGZpcnN0U3RhdGVtZW50LCAuLi5zb3VyY2VGaWxlLnN0YXRlbWVudHMuc2xpY2UoMSldKSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuXG4gICAgICAgIC8vIE5vdyB3YWxrIGV2ZXJ5IHRvcCBsZXZlbCBzdGF0ZW1lbnQgYW5kIGVzY2FwZS9kcm9wIGFueSBAZmlsZW92ZXJ2aWV3IGNvbW1lbnRzIGZvdW5kLlxuICAgICAgICAvLyBDbG9zdXJlIGlnbm9yZXMgYWxsIEBmaWxlb3ZlcnZpZXcgY29tbWVudHMgYnV0IHRoZSBsYXN0LCBzbyB0c2lja2xlIG11c3QgbWFrZSBzdXJlIG5vdCB0b1xuICAgICAgICAvLyBlbWl0IGR1cGxpY2F0ZWQgb25lcy5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzb3VyY2VGaWxlLnN0YXRlbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBjb25zdCBzdG10ID0gc291cmNlRmlsZS5zdGF0ZW1lbnRzW2ldO1xuICAgICAgICAgIC8vIEFjY2VwdCB0aGUgTm90RW1pdHRlZFN0YXRlbWVudCBpbnNlcnRlZCBhYm92ZS5cbiAgICAgICAgICBpZiAoaSA9PT0gMCAmJiBzdG10LmtpbmQgPT09IHRzLlN5bnRheEtpbmQuTm90RW1pdHRlZFN0YXRlbWVudCkgY29udGludWU7XG4gICAgICAgICAgY29uc3QgY29tbWVudHMgPSBqc2RvYy5zeW50aGVzaXplTGVhZGluZ0NvbW1lbnRzKHN0bXQpO1xuICAgICAgICAgIGNoZWNrTm9GaWxlb3ZlcnZpZXdDb21tZW50cyhcbiAgICAgICAgICAgICAgc3RtdCwgY29tbWVudHMsXG4gICAgICAgICAgICAgIGBmaWxlIGNvbW1lbnRzIG11c3QgYmUgYXQgdGhlIHRvcCBvZiB0aGUgZmlsZSwgYCArXG4gICAgICAgICAgICAgICAgICBgc2VwYXJhdGVkIGZyb20gdGhlIGZpbGUgYm9keSBieSBhbiBlbXB0eSBsaW5lLmApO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIENsb3N1cmUgQ29tcGlsZXIgY29uc2lkZXJzIHRoZSAqbGFzdCogY29tbWVudCB3aXRoIEBmaWxlb3ZlcnZpZXcgKG9yIEBleHRlcm5zIG9yXG4gICAgICAvLyBAbm9jb21waWxlKSB0aGF0IGhhcyBub3QgYmVlbiBhdHRhY2hlZCB0byBzb21lIG90aGVyIHRyZWUgbm9kZSB0byBiZSB0aGUgZmlsZSBvdmVydmlld1xuICAgICAgLy8gY29tbWVudCwgYW5kIG9ubHkgYXBwbGllcyBAc3VwcHJlc3MgdGFncyBmcm9tIGl0LiBHb29nbGUtaW50ZXJuYWwgdG9vbGluZyBjb25zaWRlcnMgKmFueSpcbiAgICAgIC8vIGNvbW1lbnQgbWVudGlvbmluZyBAZmlsZW92ZXJ2aWV3LlxuICAgICAgbGV0IGZpbGVvdmVydmlld0lkeCA9IC0xO1xuICAgICAgbGV0IHRhZ3M6IGpzZG9jLlRhZ1tdID0gW107XG4gICAgICBmb3IgKGxldCBpID0gZmlsZUNvbW1lbnRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIGNvbnN0IHBhcnNlID0ganNkb2MucGFyc2VDb250ZW50cyhmaWxlQ29tbWVudHNbaV0udGV4dCk7XG4gICAgICAgIGlmIChwYXJzZSAhPT0gbnVsbCAmJiBwYXJzZS50YWdzLnNvbWUodCA9PiBGSUxFT1ZFUlZJRVdfQ09NTUVOVF9NQVJLRVJTLmhhcyh0LnRhZ05hbWUpKSkge1xuICAgICAgICAgIGZpbGVvdmVydmlld0lkeCA9IGk7XG4gICAgICAgICAgdGFncyA9IHBhcnNlLnRhZ3M7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGZpbGVvdmVydmlld0lkeCAhPT0gLTEpIHtcbiAgICAgICAgY2hlY2tOb0ZpbGVvdmVydmlld0NvbW1lbnRzKFxuICAgICAgICAgICAgZmlyc3RTdGF0ZW1lbnQgfHwgc291cmNlRmlsZSwgZmlsZUNvbW1lbnRzLnNsaWNlKDAsIGZpbGVvdmVydmlld0lkeCksXG4gICAgICAgICAgICBgZHVwbGljYXRlIGZpbGUgbGV2ZWwgY29tbWVudGApO1xuICAgICAgfVxuXG4gICAgICBhdWdtZW50RmlsZW92ZXJ2aWV3Q29tbWVudHModGFncyk7XG4gICAgICBjb25zdCBjb21tZW50VGV4dCA9IGpzZG9jLnRvU3RyaW5nV2l0aG91dFN0YXJ0RW5kKHRhZ3MpO1xuXG4gICAgICBpZiAoZmlsZW92ZXJ2aWV3SWR4IDwgMCkge1xuICAgICAgICAvLyBObyBleGlzdGluZyBjb21tZW50IHRvIG1lcmdlIHdpdGgsIGp1c3QgZW1pdCBhIG5ldyBvbmUuXG4gICAgICAgIHJldHVybiBhZGROZXdGaWxlb3ZlcnZpZXdDb21tZW50KHNvdXJjZUZpbGUsIGNvbW1lbnRUZXh0KTtcbiAgICAgIH1cblxuICAgICAgZmlsZUNvbW1lbnRzW2ZpbGVvdmVydmlld0lkeF0udGV4dCA9IGNvbW1lbnRUZXh0O1xuICAgICAgLy8gc2YgZG9lcyBub3QgbmVlZCB0byBiZSB1cGRhdGVkLCBzeW50aGVzaXplZCBjb21tZW50cyBhcmUgbXV0YWJsZS5cbiAgICAgIHJldHVybiBzb3VyY2VGaWxlO1xuICAgIH07XG4gIH07XG59XG5cbmZ1bmN0aW9uIGFkZE5ld0ZpbGVvdmVydmlld0NvbW1lbnQoc2Y6IHRzLlNvdXJjZUZpbGUsIGNvbW1lbnRUZXh0OiBzdHJpbmcpOiB0cy5Tb3VyY2VGaWxlIHtcbiAgbGV0IHN5bnRoZXRpY0ZpcnN0U3RhdGVtZW50ID0gY3JlYXRlTm90RW1pdHRlZFN0YXRlbWVudChzZik7XG4gIHN5bnRoZXRpY0ZpcnN0U3RhdGVtZW50ID0gdHMuYWRkU3ludGhldGljVHJhaWxpbmdDb21tZW50KFxuICAgICAgc3ludGhldGljRmlyc3RTdGF0ZW1lbnQsIHRzLlN5bnRheEtpbmQuTXVsdGlMaW5lQ29tbWVudFRyaXZpYSwgY29tbWVudFRleHQsIHRydWUpO1xuICByZXR1cm4gdXBkYXRlU291cmNlRmlsZU5vZGUoc2YsIHRzLmNyZWF0ZU5vZGVBcnJheShbc3ludGhldGljRmlyc3RTdGF0ZW1lbnQsIC4uLnNmLnN0YXRlbWVudHNdKSk7XG59XG4iXX0=