/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("tsickle/src/jsdoc", ["require", "exports", "typescript"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ts = require("typescript");
    /**
     * A list of all JSDoc tags allowed by the Closure compiler.
     * The public Closure docs don't list all the tags it allows; this list comes
     * from the compiler source itself.
     * https://github.com/google/closure-compiler/blob/master/src/com/google/javascript/jscomp/parsing/Annotation.java
     * https://github.com/google/closure-compiler/blob/master/src/com/google/javascript/jscomp/parsing/ParserConfig.properties
     */
    var JSDOC_TAGS_WHITELIST = new Set([
        'abstract',
        'argument',
        'author',
        'consistentIdGenerator',
        'const',
        'constant',
        'constructor',
        'copyright',
        'define',
        'deprecated',
        'desc',
        'dict',
        'disposes',
        'enhance',
        'enhanceable',
        'enum',
        'export',
        'expose',
        'extends',
        'externs',
        'fileoverview',
        'final',
        'hassoydelcall',
        'hassoydeltemplate',
        'hidden',
        'id',
        'idGenerator',
        'ignore',
        'implements',
        'implicitCast',
        'inheritDoc',
        'interface',
        'jaggerInject',
        'jaggerModule',
        'jaggerProvide',
        'jaggerProvidePromise',
        'lends',
        'license',
        'link',
        'meaning',
        'modifies',
        'modName',
        'mods',
        'ngInject',
        'noalias',
        'nocollapse',
        'nocompile',
        'nosideeffects',
        'override',
        'owner',
        'package',
        'param',
        'pintomodule',
        'polymer',
        'polymerBehavior',
        'preserve',
        'preserveTry',
        'private',
        'protected',
        'public',
        'record',
        'requirecss',
        'requires',
        'return',
        'returns',
        'see',
        'stableIdGenerator',
        'struct',
        'suppress',
        'template',
        'this',
        'throws',
        'type',
        'typedef',
        'unrestricted',
        'version',
        'wizaction',
        'wizmodule',
    ]);
    /**
     * A list of JSDoc @tags that are never allowed in TypeScript source. These are Closure tags that
     * can be expressed in the TypeScript surface syntax. As tsickle's emit will mangle type names,
     * these will cause Closure Compiler issues and should not be used.
     */
    var JSDOC_TAGS_BLACKLIST = new Set([
        'augments', 'class', 'constructs', 'constructor', 'enum', 'extends', 'field',
        'function', 'implements', 'interface', 'lends', 'namespace', 'private', 'public',
        'record', 'static', 'template', 'this', 'type', 'typedef',
    ]);
    /**
     * A list of JSDoc @tags that might include a {type} after them. Only banned when a type is passed.
     * Note that this does not include tags that carry a non-type system type, e.g. \@suppress.
     */
    var JSDOC_TAGS_WITH_TYPES = new Set([
        'const',
        'export',
        'param',
        'return',
    ]);
    /**
     * parse parses JSDoc out of a comment string.
     * Returns null if comment is not JSDoc.
     */
    // TODO(martinprobst): representing JSDoc as a list of tags is too simplistic. We need functionality
    // such as merging (below), de-duplicating certain tags (@deprecated), and special treatment for
    // others (e.g. @suppress). We should introduce a proper model class with a more suitable data
    // strucure (e.g. a Map<TagName, Values[]>).
    function parse(comment) {
        // TODO(evanm): this is a pile of hacky regexes for now, because we
        // would rather use the better TypeScript implementation of JSDoc
        // parsing.  https://github.com/Microsoft/TypeScript/issues/7393
        if (comment.kind !== ts.SyntaxKind.MultiLineCommentTrivia)
            return null;
        // comment.text does not include /* and */, so must start with '*' for JSDoc.
        if (comment.text[0] !== '*')
            return null;
        var text = comment.text.substring(1).trim();
        return parseContents(text);
    }
    exports.parse = parse;
    /**
     * Returns the input string with line endings normalized to '\n'.
     */
    function normalizeLineEndings(input) {
        return input.replace(/\r\n/g, '\n');
    }
    exports.normalizeLineEndings = normalizeLineEndings;
    /**
     * parseContents parses JSDoc out of a comment text.
     * Returns null if comment is not JSDoc.
     *
     * @param commentText a comment's text content, i.e. the comment w/o /* and * /.
     */
    function parseContents(commentText) {
        var e_1, _a, _b, _c;
        // Make sure we have proper line endings before parsing on Windows.
        commentText = normalizeLineEndings(commentText);
        // Strip all the " * " bits from the front of each line.
        commentText = commentText.replace(/^\s*\*? ?/gm, '');
        var lines = commentText.split('\n');
        var tags = [];
        var warnings = [];
        try {
            for (var lines_1 = __values(lines), lines_1_1 = lines_1.next(); !lines_1_1.done; lines_1_1 = lines_1.next()) {
                var line = lines_1_1.value;
                var match = line.match(/^\s*@(\S+) *(.*)/);
                if (match) {
                    var _d = __read(match, 3), _ = _d[0], tagName = _d[1], text = _d[2];
                    if (tagName === 'returns') {
                        // A synonym for 'return'.
                        tagName = 'return';
                    }
                    var type = void 0;
                    if (JSDOC_TAGS_BLACKLIST.has(tagName)) {
                        warnings.push("@" + tagName + " annotations are redundant with TypeScript equivalents");
                        continue; // Drop the tag so Closure won't process it.
                    }
                    else if (JSDOC_TAGS_WITH_TYPES.has(tagName) && text[0] === '{') {
                        warnings.push("the type annotation on @" + tagName + " is redundant with its TypeScript type, " +
                            "remove the {...} part");
                        continue;
                    }
                    else if (tagName === 'suppress') {
                        var suppressMatch = text.match(/^\{(.*)\}(.*)$/);
                        if (!suppressMatch) {
                            warnings.push("malformed @suppress tag: \"" + text + "\"");
                        }
                        else {
                            _b = __read(suppressMatch, 3), type = _b[1], text = _b[2];
                        }
                    }
                    else if (tagName === 'dict') {
                        warnings.push('use index signatures (`[k: string]: type`) instead of @dict');
                        continue;
                    }
                    // Grab the parameter name from @param tags.
                    var parameterName = void 0;
                    if (tagName === 'param') {
                        match = text.match(/^(\S+) ?(.*)/);
                        if (match)
                            _c = __read(match, 3), _ = _c[0], parameterName = _c[1], text = _c[2];
                    }
                    var tag = { tagName: tagName };
                    if (parameterName)
                        tag.parameterName = parameterName;
                    if (text)
                        tag.text = text;
                    if (type)
                        tag.type = type;
                    tags.push(tag);
                }
                else {
                    // Text without a preceding @tag on it is either the plain text
                    // documentation or a continuation of a previous tag.
                    if (tags.length === 0) {
                        tags.push({ tagName: '', text: line });
                    }
                    else {
                        var lastTag = tags[tags.length - 1];
                        lastTag.text = (lastTag.text || '') + '\n' + line;
                    }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (lines_1_1 && !lines_1_1.done && (_a = lines_1.return)) _a.call(lines_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (warnings.length > 0) {
            return { tags: tags, warnings: warnings };
        }
        return { tags: tags };
    }
    exports.parseContents = parseContents;
    /**
     * Serializes a Tag into a string usable in a comment.
     * Returns a string like " @foo {bar} baz" (note the whitespace).
     */
    function tagToString(tag, escapeExtraTags) {
        if (escapeExtraTags === void 0) { escapeExtraTags = new Set(); }
        var out = '';
        if (tag.tagName) {
            if (!JSDOC_TAGS_WHITELIST.has(tag.tagName) || escapeExtraTags.has(tag.tagName)) {
                // Escape tags we don't understand.  This is a subtle
                // compromise between multiple issues.
                // 1) If we pass through these non-Closure tags, the user will
                //    get a warning from Closure, and the point of tsickle is
                //    to insulate the user from Closure.
                // 2) The output of tsickle is for Closure but also may be read
                //    by humans, for example non-TypeScript users of Angular.
                // 3) Finally, we don't want to warn because users should be
                //    free to add whichever JSDoc they feel like.  If the user
                //    wants help ensuring they didn't typo a tag, that is the
                //    responsibility of a linter.
                out += " \\@" + tag.tagName;
            }
            else {
                out += " @" + tag.tagName;
            }
        }
        if (tag.type) {
            out += ' {';
            if (tag.restParam) {
                out += '...';
            }
            out += tag.type;
            if (tag.optional) {
                out += '=';
            }
            out += '}';
        }
        if (tag.parameterName) {
            out += ' ' + tag.parameterName;
        }
        if (tag.text) {
            out += ' ' + tag.text.replace(/@/g, '\\@');
        }
        return out;
    }
    /** Tags that must only occur onces in a comment (filtered below). */
    var SINGLETON_TAGS = new Set(['deprecated']);
    /** Tags that conflict with \@type in Closure Compiler (e.g. \@param). */
    exports.TAGS_CONFLICTING_WITH_TYPE = new Set(['param', 'return']);
    /**
     * synthesizeLeadingComments parses the leading comments of node, converts them
     * to synthetic comments, and makes sure the original text comments do not get
     * emitted by TypeScript.
     */
    function synthesizeLeadingComments(node) {
        var existing = ts.getSyntheticLeadingComments(node);
        if (existing)
            return existing;
        var text = node.getFullText();
        var synthComments = getLeadingCommentRangesSynthesized(text, node.getFullStart());
        if (synthComments.length) {
            ts.setSyntheticLeadingComments(node, synthComments);
            suppressLeadingCommentsRecursively(node);
        }
        return synthComments;
    }
    exports.synthesizeLeadingComments = synthesizeLeadingComments;
    /**
     * parseLeadingCommentRangesSynthesized parses the leading comment ranges out of the given text and
     * converts them to SynthesizedComments.
     * @param offset the offset of text in the source file, e.g. node.getFullStart().
     */
    // VisibleForTesting
    function getLeadingCommentRangesSynthesized(text, offset) {
        if (offset === void 0) { offset = 0; }
        var comments = ts.getLeadingCommentRanges(text, 0) || [];
        return comments.map(function (cr) {
            // Confusingly, CommentRange in TypeScript includes start and end markers, but
            // SynthesizedComments do not.
            var commentText = cr.kind === ts.SyntaxKind.SingleLineCommentTrivia ?
                text.substring(cr.pos + 2, cr.end) :
                text.substring(cr.pos + 2, cr.end - 2);
            return __assign({}, cr, { text: commentText, pos: -1, end: -1, originalRange: { pos: cr.pos + offset, end: cr.end + offset } });
        });
    }
    exports.getLeadingCommentRangesSynthesized = getLeadingCommentRangesSynthesized;
    /**
     * suppressCommentsRecursively prevents emit of leading comments on node, and any recursive nodes
     * underneath it that start at the same offset.
     */
    function suppressLeadingCommentsRecursively(node) {
        // TypeScript emits leading comments on a node, unless:
        // - the comment was emitted by the parent node
        // - the node has the NoLeadingComments emit flag.
        // However, transformation steps sometimes copy nodes without keeping their emit flags, so just
        // setting NoLeadingComments recursively is not enough, we must also set the text range to avoid
        // the copied node to have comments emitted.
        var originalStart = node.getFullStart();
        var actualStart = node.getStart();
        function suppressCommentsInternal(node) {
            ts.setEmitFlags(node, ts.EmitFlags.NoLeadingComments);
            return !!ts.forEachChild(node, function (child) {
                if (child.pos !== originalStart)
                    return true;
                return suppressCommentsInternal(child);
            });
        }
        suppressCommentsInternal(node);
    }
    exports.suppressLeadingCommentsRecursively = suppressLeadingCommentsRecursively;
    function toSynthesizedComment(tags, escapeExtraTags) {
        return {
            kind: ts.SyntaxKind.MultiLineCommentTrivia,
            text: toStringWithoutStartEnd(tags, escapeExtraTags),
            pos: -1,
            end: -1,
            hasTrailingNewLine: true,
        };
    }
    exports.toSynthesizedComment = toSynthesizedComment;
    /** Serializes a Comment out to a string, but does not include the start and end comment tokens. */
    function toStringWithoutStartEnd(tags, escapeExtraTags) {
        if (escapeExtraTags === void 0) { escapeExtraTags = new Set(); }
        return serialize(tags, false, escapeExtraTags);
    }
    exports.toStringWithoutStartEnd = toStringWithoutStartEnd;
    /** Serializes a Comment out to a string usable in source code. */
    function toString(tags, escapeExtraTags) {
        if (escapeExtraTags === void 0) { escapeExtraTags = new Set(); }
        return serialize(tags, true, escapeExtraTags);
    }
    exports.toString = toString;
    function serialize(tags, includeStartEnd, escapeExtraTags) {
        if (escapeExtraTags === void 0) { escapeExtraTags = new Set(); }
        var e_2, _a;
        if (tags.length === 0)
            return '';
        if (tags.length === 1) {
            var tag = tags[0];
            if ((tag.tagName === 'type' || tag.tagName === 'typedef' || tag.tagName === 'nocollapse') &&
                (!tag.text || !tag.text.match('\n'))) {
                // Special-case one-liner "type" and "nocollapse" tags to fit on one line, e.g.
                //   /** @type {foo} */
                var text = tagToString(tag, escapeExtraTags);
                return includeStartEnd ? "/**" + text + " */" : "*" + text + " ";
            }
            // Otherwise, fall through to the multi-line output.
        }
        var out = includeStartEnd ? '/**\n' : '*\n';
        var emitted = new Set();
        try {
            for (var tags_1 = __values(tags), tags_1_1 = tags_1.next(); !tags_1_1.done; tags_1_1 = tags_1.next()) {
                var tag = tags_1_1.value;
                if (emitted.has(tag.tagName) && SINGLETON_TAGS.has(tag.tagName)) {
                    continue;
                }
                emitted.add(tag.tagName);
                out += ' *';
                // If the tagToString is multi-line, insert " * " prefixes on subsequent lines.
                out += tagToString(tag, escapeExtraTags).split('\n').join('\n * ');
                out += '\n';
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (tags_1_1 && !tags_1_1.done && (_a = tags_1.return)) _a.call(tags_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        out += includeStartEnd ? ' */\n' : ' ';
        return out;
    }
    /** Merges multiple tags (of the same tagName type) into a single unified tag. */
    function merge(tags) {
        var e_3, _a;
        var tagNames = new Set();
        var parameterNames = new Set();
        var types = new Set();
        var texts = new Set();
        // If any of the tags are optional/rest, then the merged output is optional/rest.
        var optional = false;
        var restParam = false;
        try {
            for (var tags_2 = __values(tags), tags_2_1 = tags_2.next(); !tags_2_1.done; tags_2_1 = tags_2.next()) {
                var tag_1 = tags_2_1.value;
                tagNames.add(tag_1.tagName);
                if (tag_1.parameterName !== undefined)
                    parameterNames.add(tag_1.parameterName);
                if (tag_1.type !== undefined)
                    types.add(tag_1.type);
                if (tag_1.text !== undefined)
                    texts.add(tag_1.text);
                if (tag_1.optional)
                    optional = true;
                if (tag_1.restParam)
                    restParam = true;
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (tags_2_1 && !tags_2_1.done && (_a = tags_2.return)) _a.call(tags_2);
            }
            finally { if (e_3) throw e_3.error; }
        }
        if (tagNames.size !== 1) {
            throw new Error("cannot merge differing tags: " + JSON.stringify(tags));
        }
        var tagName = tagNames.values().next().value;
        var parameterName = parameterNames.size > 0 ? Array.from(parameterNames).join('_or_') : undefined;
        var type = types.size > 0 ? Array.from(types).join('|') : undefined;
        // @template uses text (not type!) to declare its type parameters, with ','-separated text.
        var isTemplateTag = tagName === 'template';
        var text = texts.size > 0 ? Array.from(texts).join(isTemplateTag ? ',' : ' / ') : undefined;
        var tag = { tagName: tagName, parameterName: parameterName, type: type, text: text };
        // Note: a param can either be optional or a rest param; if we merged an
        // optional and rest param together, prefer marking it as a rest param.
        if (restParam) {
            tag.restParam = true;
        }
        else if (optional) {
            tag.optional = true;
        }
        return tag;
    }
    exports.merge = merge;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNkb2MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvanNkb2MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBRUgsK0JBQWlDO0lBc0NqQzs7Ozs7O09BTUc7SUFDSCxJQUFNLG9CQUFvQixHQUFHLElBQUksR0FBRyxDQUFDO1FBQ25DLFVBQVU7UUFDVixVQUFVO1FBQ1YsUUFBUTtRQUNSLHVCQUF1QjtRQUN2QixPQUFPO1FBQ1AsVUFBVTtRQUNWLGFBQWE7UUFDYixXQUFXO1FBQ1gsUUFBUTtRQUNSLFlBQVk7UUFDWixNQUFNO1FBQ04sTUFBTTtRQUNOLFVBQVU7UUFDVixTQUFTO1FBQ1QsYUFBYTtRQUNiLE1BQU07UUFDTixRQUFRO1FBQ1IsUUFBUTtRQUNSLFNBQVM7UUFDVCxTQUFTO1FBQ1QsY0FBYztRQUNkLE9BQU87UUFDUCxlQUFlO1FBQ2YsbUJBQW1CO1FBQ25CLFFBQVE7UUFDUixJQUFJO1FBQ0osYUFBYTtRQUNiLFFBQVE7UUFDUixZQUFZO1FBQ1osY0FBYztRQUNkLFlBQVk7UUFDWixXQUFXO1FBQ1gsY0FBYztRQUNkLGNBQWM7UUFDZCxlQUFlO1FBQ2Ysc0JBQXNCO1FBQ3RCLE9BQU87UUFDUCxTQUFTO1FBQ1QsTUFBTTtRQUNOLFNBQVM7UUFDVCxVQUFVO1FBQ1YsU0FBUztRQUNULE1BQU07UUFDTixVQUFVO1FBQ1YsU0FBUztRQUNULFlBQVk7UUFDWixXQUFXO1FBQ1gsZUFBZTtRQUNmLFVBQVU7UUFDVixPQUFPO1FBQ1AsU0FBUztRQUNULE9BQU87UUFDUCxhQUFhO1FBQ2IsU0FBUztRQUNULGlCQUFpQjtRQUNqQixVQUFVO1FBQ1YsYUFBYTtRQUNiLFNBQVM7UUFDVCxXQUFXO1FBQ1gsUUFBUTtRQUNSLFFBQVE7UUFDUixZQUFZO1FBQ1osVUFBVTtRQUNWLFFBQVE7UUFDUixTQUFT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LElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1FBQ2xGLElBQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1FBQ3RFLDJGQUEyRjtRQUMzRixJQUFNLGFBQWEsR0FBRyxPQUFPLEtBQUssVUFBVSxDQUFDO1FBQzdDLElBQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztRQUM5RixJQUFNLEdBQUcsR0FBUSxFQUFDLE9BQU8sU0FBQSxFQUFFLGFBQWEsZUFBQSxFQUFFLElBQUksTUFBQSxFQUFFLElBQUksTUFBQSxFQUFDLENBQUM7UUFDdEQsd0VBQXdFO1FBQ3hFLHVFQUF1RTtRQUN2RSxJQUFJLFNBQVMsRUFBRTtZQUNiLEdBQUcsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1NBQ3RCO2FBQU0sSUFBSSxRQUFRLEVBQUU7WUFDbkIsR0FBRyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7U0FDckI7UUFDRCxPQUFPLEdBQUcsQ0FBQztJQUNiLENBQUM7SUFwQ0Qsc0JBb0NDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcblxuLyoqXG4gKiBUeXBlU2NyaXB0IGhhcyBhbiBBUEkgZm9yIEpTRG9jIGFscmVhZHksIGJ1dCBpdCdzIG5vdCBleHBvc2VkLlxuICogaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC9UeXBlU2NyaXB0L2lzc3Vlcy83MzkzXG4gKiBGb3Igbm93IHdlIGNyZWF0ZSB0eXBlcyB0aGF0IGFyZSBzaW1pbGFyIHRvIHRoZWlycyBzbyB0aGF0IG1pZ3JhdGluZ1xuICogdG8gdGhlaXIgQVBJIHdpbGwgYmUgZWFzaWVyLiAgU2VlIGUuZy4gdHMuSlNEb2NUYWcgYW5kIHRzLkpTRG9jQ29tbWVudC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBUYWcge1xuICAvKipcbiAgICogdGFnTmFtZSBpcyBlLmcuIFwicGFyYW1cIiBpbiBhbiBAcGFyYW0gZGVjbGFyYXRpb24uICBJdCBpcyB0aGUgZW1wdHkgc3RyaW5nXG4gICAqIGZvciB0aGUgcGxhaW4gdGV4dCBkb2N1bWVudGF0aW9uIHRoYXQgb2NjdXJzIGJlZm9yZSBhbnkgQGZvbyBsaW5lcy5cbiAgICovXG4gIHRhZ05hbWU6IHN0cmluZztcbiAgLyoqXG4gICAqIHBhcmFtZXRlck5hbWUgaXMgdGhlIHRoZSBuYW1lIG9mIHRoZSBmdW5jdGlvbiBwYXJhbWV0ZXIsIGUuZy4gXCJmb29cIlxuICAgKiBpbiBgXFxAcGFyYW0gZm9vIFRoZSBmb28gcGFyYW1gXG4gICAqL1xuICBwYXJhbWV0ZXJOYW1lPzogc3RyaW5nO1xuICAvKipcbiAgICogVGhlIHR5cGUgb2YgYSBKU0RvYyBcXEBwYXJhbSwgXFxAdHlwZSBldGMgdGFnLCByZW5kZXJlZCBpbiBjdXJseSBicmFjZXMuXG4gICAqIENhbiBhbHNvIGhvbGQgdGhlIHR5cGUgb2YgYW4gXFxAc3VwcHJlc3MuXG4gICAqL1xuICB0eXBlPzogc3RyaW5nO1xuICAvKiogb3B0aW9uYWwgaXMgdHJ1ZSBmb3Igb3B0aW9uYWwgZnVuY3Rpb24gcGFyYW1ldGVycy4gKi9cbiAgb3B0aW9uYWw/OiBib29sZWFuO1xuICAvKiogcmVzdFBhcmFtIGlzIHRydWUgZm9yIFwiLi4ueDogZm9vW11cIiBmdW5jdGlvbiBwYXJhbWV0ZXJzLiAqL1xuICByZXN0UGFyYW0/OiBib29sZWFuO1xuICAvKipcbiAgICogZGVzdHJ1Y3R1cmluZyBpcyB0cnVlIGZvciBkZXN0cnVjdHVyaW5nIGJpbmQgcGFyYW1ldGVycywgd2hpY2ggcmVxdWlyZVxuICAgKiBub24tbnVsbCBhcmd1bWVudHMgb24gdGhlIENsb3N1cmUgc2lkZS4gIENhbiBsaWtlbHkgcmVtb3ZlIHRoaXNcbiAgICogb25jZSBUeXBlU2NyaXB0IG51bGxhYmxlIHR5cGVzIGFyZSBhdmFpbGFibGUuXG4gICAqL1xuICBkZXN0cnVjdHVyaW5nPzogYm9vbGVhbjtcbiAgLyoqIEFueSByZW1haW5pbmcgdGV4dCBvbiB0aGUgdGFnLCBlLmcuIHRoZSBkZXNjcmlwdGlvbi4gKi9cbiAgdGV4dD86IHN0cmluZztcbn1cblxuLyoqXG4gKiBBIGxpc3Qgb2YgYWxsIEpTRG9jIHRhZ3MgYWxsb3dlZCBieSB0aGUgQ2xvc3VyZSBjb21waWxlci5cbiAqIFRoZSBwdWJsaWMgQ2xvc3VyZSBkb2NzIGRvbid0IGxpc3QgYWxsIHRoZSB0YWdzIGl0IGFsbG93czsgdGhpcyBsaXN0IGNvbWVzXG4gKiBmcm9tIHRoZSBjb21waWxlciBzb3VyY2UgaXRzZWxmLlxuICogaHR0cHM6Ly9naXRodWIuY29tL2dvb2dsZS9jbG9zdXJlLWNvbXBpbGVyL2Jsb2IvbWFzdGVyL3NyYy9jb20vZ29vZ2xlL2phdmFzY3JpcHQvanNjb21wL3BhcnNpbmcvQW5ub3RhdGlvbi5qYXZhXG4gKiBodHRwczovL2dpdGh1Yi5jb20vZ29vZ2xlL2Nsb3N1cmUtY29tcGlsZXIvYmxvYi9tYXN0ZXIvc3JjL2NvbS9nb29nbGUvamF2YXNjcmlwdC9qc2NvbXAvcGFyc2luZy9QYXJzZXJDb25maWcucHJvcGVydGllc1xuICovXG5jb25zdCBKU0RPQ19UQUdTX1dISVRFTElTVCA9IG5ldyBTZXQoW1xuICAnYWJzdHJhY3QnLFxuICAnYXJndW1lbnQnLFxuICAnYXV0aG9yJyxcbiAgJ2NvbnNpc3RlbnRJZEdlbmVyYXRvcicsXG4gICdjb25zdCcsXG4gICdjb25zdGFudCcsXG4gICdjb25zdHJ1Y3RvcicsXG4gICdjb3B5cmlnaHQnLFxuICAnZGVmaW5lJyxcbiAgJ2RlcHJlY2F0ZWQnLFxuICAnZGVzYycsXG4gICdkaWN0JyxcbiAgJ2Rpc3Bvc2VzJyxcbiAgJ2VuaGFuY2UnLFxuICAnZW5oYW5jZWFibGUnLFxuICAnZW51bScsXG4gICdleHBvcnQnLFxuICAnZXhwb3NlJyxcbiAgJ2V4dGVuZHMnLFxuICAnZXh0ZXJucycsXG4gICdmaWxlb3ZlcnZpZXcnLFxuICAnZmluYWwnLFxuICAnaGFzc295ZGVsY2FsbCcsXG4gICdoYXNzb3lkZWx0ZW1wbGF0ZScsXG4gICdoaWRkZW4nLFxuICAnaWQnLFxuICAnaWRHZW5lcmF0b3InLFxuICAnaWdub3JlJyxcbiAgJ2ltcGxlbWVudHMnLFxuICAnaW1wbGljaXRDYXN0JyxcbiAgJ2luaGVyaXREb2MnLFxuICAnaW50ZXJmYWNlJyxcbiAgJ2phZ2dlckluamVjdCcsXG4gICdqYWdnZXJNb2R1bGUnLFxuICAnamFnZ2VyUHJvdmlkZScsXG4gICdqYWdnZXJQcm92aWRlUHJvbWlzZScsXG4gICdsZW5kcycsXG4gICdsaWNlbnNlJyxcbiAgJ2xpbmsnLFxuICAnbWVhbmluZycsXG4gICdtb2RpZmllcycsXG4gICdtb2ROYW1lJyxcbiAgJ21vZHMnLFxuICAnbmdJbmplY3QnLFxuICAnbm9hbGlhcycsXG4gICdub2NvbGxhcHNlJyxcbiAgJ25vY29tcGlsZScsXG4gICdub3NpZGVlZmZlY3RzJyxcbiAgJ292ZXJyaWRlJyxcbiAgJ293bmVyJyxcbiAgJ3BhY2thZ2UnLFxuICAncGFyYW0nLFxuICAncGludG9tb2R1bGUnLFxuICAncG9seW1lcicsXG4gICdwb2x5bWVyQmVoYXZpb3InLFxuICAncHJlc2VydmUnLFxuICAncHJlc2VydmVUcnknLFxuICAncHJpdmF0ZScsXG4gICdwcm90ZWN0ZWQnLFxuICAncHVibGljJyxcbiAgJ3JlY29yZCcsXG4gICdyZXF1aXJlY3NzJyxcbiAgJ3JlcXVpcmVzJyxcbiAgJ3JldHVybicsXG4gICdyZXR1cm5zJyxcbiAgJ3NlZScsXG4gICdzdGFibGVJZEdlbmVyYXRvcicsXG4gICdzdHJ1Y3QnLFxuICAnc3VwcHJlc3MnLFxuICAndGVtcGxhdGUnLFxuICAndGhpcycsXG4gICd0aHJvd3MnLFxuICAndHlwZScsXG4gICd0eXBlZGVmJyxcbiAgJ3VucmVzdHJpY3RlZCcsXG4gICd2ZXJzaW9uJyxcbiAgJ3dpemFjdGlvbicsXG4gICd3aXptb2R1bGUnLFxuXSk7XG5cbi8qKlxuICogQSBsaXN0IG9mIEpTRG9jIEB0YWdzIHRoYXQgYXJlIG5ldmVyIGFsbG93ZWQgaW4gVHlwZVNjcmlwdCBzb3VyY2UuIFRoZXNlIGFyZSBDbG9zdXJlIHRhZ3MgdGhhdFxuICogY2FuIGJlIGV4cHJlc3NlZCBpbiB0aGUgVHlwZVNjcmlwdCBzdXJmYWNlIHN5bnRheC4gQXMgdHNpY2tsZSdzIGVtaXQgd2lsbCBtYW5nbGUgdHlwZSBuYW1lcyxcbiAqIHRoZXNlIHdpbGwgY2F1c2UgQ2xvc3VyZSBDb21waWxlciBpc3N1ZXMgYW5kIHNob3VsZCBub3QgYmUgdXNlZC5cbiAqL1xuY29uc3QgSlNET0NfVEFHU19CTEFDS0xJU1QgPSBuZXcgU2V0KFtcbiAgJ2F1Z21lbnRzJywgJ2NsYXNzJywgICAgICAnY29uc3RydWN0cycsICdjb25zdHJ1Y3RvcicsICdlbnVtJywgICAgICAnZXh0ZW5kcycsICdmaWVsZCcsXG4gICdmdW5jdGlvbicsICdpbXBsZW1lbnRzJywgJ2ludGVyZmFjZScsICAnbGVuZHMnLCAgICAgICAnbmFtZXNwYWNlJywgJ3ByaXZhdGUnLCAncHVibGljJyxcbiAgJ3JlY29yZCcsICAgJ3N0YXRpYycsICAgICAndGVtcGxhdGUnLCAgICd0aGlzJywgICAgICAgICd0eXBlJywgICAgICAndHlwZWRlZicsXG5dKTtcblxuLyoqXG4gKiBBIGxpc3Qgb2YgSlNEb2MgQHRhZ3MgdGhhdCBtaWdodCBpbmNsdWRlIGEge3R5cGV9IGFmdGVyIHRoZW0uIE9ubHkgYmFubmVkIHdoZW4gYSB0eXBlIGlzIHBhc3NlZC5cbiAqIE5vdGUgdGhhdCB0aGlzIGRvZXMgbm90IGluY2x1ZGUgdGFncyB0aGF0IGNhcnJ5IGEgbm9uLXR5cGUgc3lzdGVtIHR5cGUsIGUuZy4gXFxAc3VwcHJlc3MuXG4gKi9cbmNvbnN0IEpTRE9DX1RBR1NfV0lUSF9UWVBFUyA9IG5ldyBTZXQoW1xuICAnY29uc3QnLFxuICAnZXhwb3J0JyxcbiAgJ3BhcmFtJyxcbiAgJ3JldHVybicsXG5dKTtcblxuLyoqXG4gKiBSZXN1bHQgb2YgcGFyc2luZyBhIEpTRG9jIGNvbW1lbnQuIFN1Y2ggY29tbWVudHMgZXNzZW50aWFsbHkgYXJlIGJ1aWx0IG9mIGEgbGlzdCBvZiB0YWdzLlxuICogSW4gYWRkaXRpb24gdG8gdGhlIHRhZ3MsIHRoaXMgbWlnaHQgYWxzbyBjb250YWluIHdhcm5pbmdzIHRvIGluZGljYXRlIG5vbi1mYXRhbCBwcm9ibGVtc1xuICogd2hpbGUgZmluZGluZyB0aGUgdGFncy5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBQYXJzZWRKU0RvY0NvbW1lbnQge1xuICB0YWdzOiBUYWdbXTtcbiAgd2FybmluZ3M/OiBzdHJpbmdbXTtcbn1cblxuLyoqXG4gKiBwYXJzZSBwYXJzZXMgSlNEb2Mgb3V0IG9mIGEgY29tbWVudCBzdHJpbmcuXG4gKiBSZXR1cm5zIG51bGwgaWYgY29tbWVudCBpcyBub3QgSlNEb2MuXG4gKi9cbi8vIFRPRE8obWFydGlucHJvYnN0KTogcmVwcmVzZW50aW5nIEpTRG9jIGFzIGEgbGlzdCBvZiB0YWdzIGlzIHRvbyBzaW1wbGlzdGljLiBXZSBuZWVkIGZ1bmN0aW9uYWxpdHlcbi8vIHN1Y2ggYXMgbWVyZ2luZyAoYmVsb3cpLCBkZS1kdXBsaWNhdGluZyBjZXJ0YWluIHRhZ3MgKEBkZXByZWNhdGVkKSwgYW5kIHNwZWNpYWwgdHJlYXRtZW50IGZvclxuLy8gb3RoZXJzIChlLmcuIEBzdXBwcmVzcykuIFdlIHNob3VsZCBpbnRyb2R1Y2UgYSBwcm9wZXIgbW9kZWwgY2xhc3Mgd2l0aCBhIG1vcmUgc3VpdGFibGUgZGF0YVxuLy8gc3RydWN1cmUgKGUuZy4gYSBNYXA8VGFnTmFtZSwgVmFsdWVzW10+KS5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZShjb21tZW50OiB0cy5TeW50aGVzaXplZENvbW1lbnQpOiBQYXJzZWRKU0RvY0NvbW1lbnR8bnVsbCB7XG4gIC8vIFRPRE8oZXZhbm0pOiB0aGlzIGlzIGEgcGlsZSBvZiBoYWNreSByZWdleGVzIGZvciBub3csIGJlY2F1c2Ugd2VcbiAgLy8gd291bGQgcmF0aGVyIHVzZSB0aGUgYmV0dGVyIFR5cGVTY3JpcHQgaW1wbGVtZW50YXRpb24gb2YgSlNEb2NcbiAgLy8gcGFyc2luZy4gIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvVHlwZVNjcmlwdC9pc3N1ZXMvNzM5M1xuICBpZiAoY29tbWVudC5raW5kICE9PSB0cy5TeW50YXhLaW5kLk11bHRpTGluZUNvbW1lbnRUcml2aWEpIHJldHVybiBudWxsO1xuICAvLyBjb21tZW50LnRleHQgZG9lcyBub3QgaW5jbHVkZSAvKiBhbmQgKi8sIHNvIG11c3Qgc3RhcnQgd2l0aCAnKicgZm9yIEpTRG9jLlxuICBpZiAoY29tbWVudC50ZXh0WzBdICE9PSAnKicpIHJldHVybiBudWxsO1xuICBjb25zdCB0ZXh0ID0gY29tbWVudC50ZXh0LnN1YnN0cmluZygxKS50cmltKCk7XG4gIHJldHVybiBwYXJzZUNvbnRlbnRzKHRleHQpO1xufVxuXG4vKipcbiAqIFJldHVybnMgdGhlIGlucHV0IHN0cmluZyB3aXRoIGxpbmUgZW5kaW5ncyBub3JtYWxpemVkIHRvICdcXG4nLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbm9ybWFsaXplTGluZUVuZGluZ3MoaW5wdXQ6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBpbnB1dC5yZXBsYWNlKC9cXHJcXG4vZywgJ1xcbicpO1xufVxuXG4vKipcbiAqIHBhcnNlQ29udGVudHMgcGFyc2VzIEpTRG9jIG91dCBvZiBhIGNvbW1lbnQgdGV4dC5cbiAqIFJldHVybnMgbnVsbCBpZiBjb21tZW50IGlzIG5vdCBKU0RvYy5cbiAqXG4gKiBAcGFyYW0gY29tbWVudFRleHQgYSBjb21tZW50J3MgdGV4dCBjb250ZW50LCBpLmUuIHRoZSBjb21tZW50IHcvbyAvKiBhbmQgKiAvLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VDb250ZW50cyhjb21tZW50VGV4dDogc3RyaW5nKTogUGFyc2VkSlNEb2NDb21tZW50fG51bGwge1xuICAvLyBNYWtlIHN1cmUgd2UgaGF2ZSBwcm9wZXIgbGluZSBlbmRpbmdzIGJlZm9yZSBwYXJzaW5nIG9uIFdpbmRvd3MuXG4gIGNvbW1lbnRUZXh0ID0gbm9ybWFsaXplTGluZUVuZGluZ3MoY29tbWVudFRleHQpO1xuICAvLyBTdHJpcCBhbGwgdGhlIFwiICogXCIgYml0cyBmcm9tIHRoZSBmcm9udCBvZiBlYWNoIGxpbmUuXG4gIGNvbW1lbnRUZXh0ID0gY29tbWVudFRleHQucmVwbGFjZSgvXlxccypcXCo/ID8vZ20sICcnKTtcbiAgY29uc3QgbGluZXMgPSBjb21tZW50VGV4dC5zcGxpdCgnXFxuJyk7XG4gIGNvbnN0IHRhZ3M6IFRhZ1tdID0gW107XG4gIGNvbnN0IHdhcm5pbmdzOiBzdHJpbmdbXSA9IFtdO1xuICBmb3IgKGNvbnN0IGxpbmUgb2YgbGluZXMpIHtcbiAgICBsZXQgbWF0Y2ggPSBsaW5lLm1hdGNoKC9eXFxzKkAoXFxTKykgKiguKikvKTtcbiAgICBpZiAobWF0Y2gpIHtcbiAgICAgIGxldCBbXywgdGFnTmFtZSwgdGV4dF0gPSBtYXRjaDtcbiAgICAgIGlmICh0YWdOYW1lID09PSAncmV0dXJucycpIHtcbiAgICAgICAgLy8gQSBzeW5vbnltIGZvciAncmV0dXJuJy5cbiAgICAgICAgdGFnTmFtZSA9ICdyZXR1cm4nO1xuICAgICAgfVxuICAgICAgbGV0IHR5cGU6IHN0cmluZ3x1bmRlZmluZWQ7XG4gICAgICBpZiAoSlNET0NfVEFHU19CTEFDS0xJU1QuaGFzKHRhZ05hbWUpKSB7XG4gICAgICAgIHdhcm5pbmdzLnB1c2goYEAke3RhZ05hbWV9IGFubm90YXRpb25zIGFyZSByZWR1bmRhbnQgd2l0aCBUeXBlU2NyaXB0IGVxdWl2YWxlbnRzYCk7XG4gICAgICAgIGNvbnRpbnVlOyAgLy8gRHJvcCB0aGUgdGFnIHNvIENsb3N1cmUgd29uJ3QgcHJvY2VzcyBpdC5cbiAgICAgIH0gZWxzZSBpZiAoSlNET0NfVEFHU19XSVRIX1RZUEVTLmhhcyh0YWdOYW1lKSAmJiB0ZXh0WzBdID09PSAneycpIHtcbiAgICAgICAgd2FybmluZ3MucHVzaChcbiAgICAgICAgICAgIGB0aGUgdHlwZSBhbm5vdGF0aW9uIG9uIEAke3RhZ05hbWV9IGlzIHJlZHVuZGFudCB3aXRoIGl0cyBUeXBlU2NyaXB0IHR5cGUsIGAgK1xuICAgICAgICAgICAgYHJlbW92ZSB0aGUgey4uLn0gcGFydGApO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH0gZWxzZSBpZiAodGFnTmFtZSA9PT0gJ3N1cHByZXNzJykge1xuICAgICAgICBjb25zdCBzdXBwcmVzc01hdGNoID0gdGV4dC5tYXRjaCgvXlxceyguKilcXH0oLiopJC8pO1xuICAgICAgICBpZiAoIXN1cHByZXNzTWF0Y2gpIHtcbiAgICAgICAgICB3YXJuaW5ncy5wdXNoKGBtYWxmb3JtZWQgQHN1cHByZXNzIHRhZzogXCIke3RleHR9XCJgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBbLCB0eXBlLCB0ZXh0XSA9IHN1cHByZXNzTWF0Y2g7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodGFnTmFtZSA9PT0gJ2RpY3QnKSB7XG4gICAgICAgIHdhcm5pbmdzLnB1c2goJ3VzZSBpbmRleCBzaWduYXR1cmVzIChgW2s6IHN0cmluZ106IHR5cGVgKSBpbnN0ZWFkIG9mIEBkaWN0Jyk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBHcmFiIHRoZSBwYXJhbWV0ZXIgbmFtZSBmcm9tIEBwYXJhbSB0YWdzLlxuICAgICAgbGV0IHBhcmFtZXRlck5hbWU6IHN0cmluZ3x1bmRlZmluZWQ7XG4gICAgICBpZiAodGFnTmFtZSA9PT0gJ3BhcmFtJykge1xuICAgICAgICBtYXRjaCA9IHRleHQubWF0Y2goL14oXFxTKykgPyguKikvKTtcbiAgICAgICAgaWYgKG1hdGNoKSBbXywgcGFyYW1ldGVyTmFtZSwgdGV4dF0gPSBtYXRjaDtcbiAgICAgIH1cblxuICAgICAgY29uc3QgdGFnOiBUYWcgPSB7dGFnTmFtZX07XG4gICAgICBpZiAocGFyYW1ldGVyTmFtZSkgdGFnLnBhcmFtZXRlck5hbWUgPSBwYXJhbWV0ZXJOYW1lO1xuICAgICAgaWYgKHRleHQpIHRhZy50ZXh0ID0gdGV4dDtcbiAgICAgIGlmICh0eXBlKSB0YWcudHlwZSA9IHR5cGU7XG4gICAgICB0YWdzLnB1c2godGFnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVGV4dCB3aXRob3V0IGEgcHJlY2VkaW5nIEB0YWcgb24gaXQgaXMgZWl0aGVyIHRoZSBwbGFpbiB0ZXh0XG4gICAgICAvLyBkb2N1bWVudGF0aW9uIG9yIGEgY29udGludWF0aW9uIG9mIGEgcHJldmlvdXMgdGFnLlxuICAgICAgaWYgKHRhZ3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHRhZ3MucHVzaCh7dGFnTmFtZTogJycsIHRleHQ6IGxpbmV9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGxhc3RUYWcgPSB0YWdzW3RhZ3MubGVuZ3RoIC0gMV07XG4gICAgICAgIGxhc3RUYWcudGV4dCA9IChsYXN0VGFnLnRleHQgfHwgJycpICsgJ1xcbicgKyBsaW5lO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBpZiAod2FybmluZ3MubGVuZ3RoID4gMCkge1xuICAgIHJldHVybiB7dGFncywgd2FybmluZ3N9O1xuICB9XG4gIHJldHVybiB7dGFnc307XG59XG5cbi8qKlxuICogU2VyaWFsaXplcyBhIFRhZyBpbnRvIGEgc3RyaW5nIHVzYWJsZSBpbiBhIGNvbW1lbnQuXG4gKiBSZXR1cm5zIGEgc3RyaW5nIGxpa2UgXCIgQGZvbyB7YmFyfSBiYXpcIiAobm90ZSB0aGUgd2hpdGVzcGFjZSkuXG4gKi9cbmZ1bmN0aW9uIHRhZ1RvU3RyaW5nKHRhZzogVGFnLCBlc2NhcGVFeHRyYVRhZ3MgPSBuZXcgU2V0PHN0cmluZz4oKSk6IHN0cmluZyB7XG4gIGxldCBvdXQgPSAnJztcbiAgaWYgKHRhZy50YWdOYW1lKSB7XG4gICAgaWYgKCFKU0RPQ19UQUdTX1dISVRFTElTVC5oYXModGFnLnRhZ05hbWUpIHx8IGVzY2FwZUV4dHJhVGFncy5oYXModGFnLnRhZ05hbWUpKSB7XG4gICAgICAvLyBFc2NhcGUgdGFncyB3ZSBkb24ndCB1bmRlcnN0YW5kLiAgVGhpcyBpcyBhIHN1YnRsZVxuICAgICAgLy8gY29tcHJvbWlzZSBiZXR3ZWVuIG11bHRpcGxlIGlzc3Vlcy5cbiAgICAgIC8vIDEpIElmIHdlIHBhc3MgdGhyb3VnaCB0aGVzZSBub24tQ2xvc3VyZSB0YWdzLCB0aGUgdXNlciB3aWxsXG4gICAgICAvLyAgICBnZXQgYSB3YXJuaW5nIGZyb20gQ2xvc3VyZSwgYW5kIHRoZSBwb2ludCBvZiB0c2lja2xlIGlzXG4gICAgICAvLyAgICB0byBpbnN1bGF0ZSB0aGUgdXNlciBmcm9tIENsb3N1cmUuXG4gICAgICAvLyAyKSBUaGUgb3V0cHV0IG9mIHRzaWNrbGUgaXMgZm9yIENsb3N1cmUgYnV0IGFsc28gbWF5IGJlIHJlYWRcbiAgICAgIC8vICAgIGJ5IGh1bWFucywgZm9yIGV4YW1wbGUgbm9uLVR5cGVTY3JpcHQgdXNlcnMgb2YgQW5ndWxhci5cbiAgICAgIC8vIDMpIEZpbmFsbHksIHdlIGRvbid0IHdhbnQgdG8gd2FybiBiZWNhdXNlIHVzZXJzIHNob3VsZCBiZVxuICAgICAgLy8gICAgZnJlZSB0byBhZGQgd2hpY2hldmVyIEpTRG9jIHRoZXkgZmVlbCBsaWtlLiAgSWYgdGhlIHVzZXJcbiAgICAgIC8vICAgIHdhbnRzIGhlbHAgZW5zdXJpbmcgdGhleSBkaWRuJ3QgdHlwbyBhIHRhZywgdGhhdCBpcyB0aGVcbiAgICAgIC8vICAgIHJlc3BvbnNpYmlsaXR5IG9mIGEgbGludGVyLlxuICAgICAgb3V0ICs9IGAgXFxcXEAke3RhZy50YWdOYW1lfWA7XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dCArPSBgIEAke3RhZy50YWdOYW1lfWA7XG4gICAgfVxuICB9XG4gIGlmICh0YWcudHlwZSkge1xuICAgIG91dCArPSAnIHsnO1xuICAgIGlmICh0YWcucmVzdFBhcmFtKSB7XG4gICAgICBvdXQgKz0gJy4uLic7XG4gICAgfVxuICAgIG91dCArPSB0YWcudHlwZTtcbiAgICBpZiAodGFnLm9wdGlvbmFsKSB7XG4gICAgICBvdXQgKz0gJz0nO1xuICAgIH1cbiAgICBvdXQgKz0gJ30nO1xuICB9XG4gIGlmICh0YWcucGFyYW1ldGVyTmFtZSkge1xuICAgIG91dCArPSAnICcgKyB0YWcucGFyYW1ldGVyTmFtZTtcbiAgfVxuICBpZiAodGFnLnRleHQpIHtcbiAgICBvdXQgKz0gJyAnICsgdGFnLnRleHQucmVwbGFjZSgvQC9nLCAnXFxcXEAnKTtcbiAgfVxuICByZXR1cm4gb3V0O1xufVxuXG4vKiogVGFncyB0aGF0IG11c3Qgb25seSBvY2N1ciBvbmNlcyBpbiBhIGNvbW1lbnQgKGZpbHRlcmVkIGJlbG93KS4gKi9cbmNvbnN0IFNJTkdMRVRPTl9UQUdTID0gbmV3IFNldChbJ2RlcHJlY2F0ZWQnXSk7XG5cbi8qKiBUYWdzIHRoYXQgY29uZmxpY3Qgd2l0aCBcXEB0eXBlIGluIENsb3N1cmUgQ29tcGlsZXIgKGUuZy4gXFxAcGFyYW0pLiAqL1xuZXhwb3J0IGNvbnN0IFRBR1NfQ09ORkxJQ1RJTkdfV0lUSF9UWVBFID0gbmV3IFNldChbJ3BhcmFtJywgJ3JldHVybiddKTtcblxuLyoqXG4gKiBBIHN5bnRoZXNpemVkIGNvbW1lbnQgdGhhdCAocG9zc2libHkpIGluY2x1ZGVzIHRoZSBvcmlnaW5hbCBjb21tZW50IHJhbmdlIGl0IHdhcyBjcmVhdGVkIGZyb20uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU3ludGhlc2l6ZWRDb21tZW50V2l0aE9yaWdpbmFsIGV4dGVuZHMgdHMuU3ludGhlc2l6ZWRDb21tZW50IHtcbiAgLyoqXG4gICAqIFRoZSBvcmlnaW5hbCB0ZXh0IHJhbmdlIG9mIHRoZSBjb21tZW50IChyZWxhdGl2ZSB0byB0aGUgc291cmNlIGZpbGUncyBmdWxsIHRleHQpLlxuICAgKi9cbiAgb3JpZ2luYWxSYW5nZT86IHRzLlRleHRSYW5nZTtcbn1cblxuLyoqXG4gKiBzeW50aGVzaXplTGVhZGluZ0NvbW1lbnRzIHBhcnNlcyB0aGUgbGVhZGluZyBjb21tZW50cyBvZiBub2RlLCBjb252ZXJ0cyB0aGVtXG4gKiB0byBzeW50aGV0aWMgY29tbWVudHMsIGFuZCBtYWtlcyBzdXJlIHRoZSBvcmlnaW5hbCB0ZXh0IGNvbW1lbnRzIGRvIG5vdCBnZXRcbiAqIGVtaXR0ZWQgYnkgVHlwZVNjcmlwdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHN5bnRoZXNpemVMZWFkaW5nQ29tbWVudHMobm9kZTogdHMuTm9kZSk6IFN5bnRoZXNpemVkQ29tbWVudFdpdGhPcmlnaW5hbFtdIHtcbiAgY29uc3QgZXhpc3RpbmcgPSB0cy5nZXRTeW50aGV0aWNMZWFkaW5nQ29tbWVudHMobm9kZSk7XG4gIGlmIChleGlzdGluZykgcmV0dXJuIGV4aXN0aW5nO1xuICBjb25zdCB0ZXh0ID0gbm9kZS5nZXRGdWxsVGV4dCgpO1xuICBjb25zdCBzeW50aENvbW1lbnRzID0gZ2V0TGVhZGluZ0NvbW1lbnRSYW5nZXNTeW50aGVzaXplZCh0ZXh0LCBub2RlLmdldEZ1bGxTdGFydCgpKTtcbiAgaWYgKHN5bnRoQ29tbWVudHMubGVuZ3RoKSB7XG4gICAgdHMuc2V0U3ludGhldGljTGVhZGluZ0NvbW1lbnRzKG5vZGUsIHN5bnRoQ29tbWVudHMpO1xuICAgIHN1cHByZXNzTGVhZGluZ0NvbW1lbnRzUmVjdXJzaXZlbHkobm9kZSk7XG4gIH1cbiAgcmV0dXJuIHN5bnRoQ29tbWVudHM7XG59XG5cbi8qKlxuICogcGFyc2VMZWFkaW5nQ29tbWVudFJhbmdlc1N5bnRoZXNpemVkIHBhcnNlcyB0aGUgbGVhZGluZyBjb21tZW50IHJhbmdlcyBvdXQgb2YgdGhlIGdpdmVuIHRleHQgYW5kXG4gKiBjb252ZXJ0cyB0aGVtIHRvIFN5bnRoZXNpemVkQ29tbWVudHMuXG4gKiBAcGFyYW0gb2Zmc2V0IHRoZSBvZmZzZXQgb2YgdGV4dCBpbiB0aGUgc291cmNlIGZpbGUsIGUuZy4gbm9kZS5nZXRGdWxsU3RhcnQoKS5cbiAqL1xuLy8gVmlzaWJsZUZvclRlc3RpbmdcbmV4cG9ydCBmdW5jdGlvbiBnZXRMZWFkaW5nQ29tbWVudFJhbmdlc1N5bnRoZXNpemVkKFxuICAgIHRleHQ6IHN0cmluZywgb2Zmc2V0ID0gMCk6IFN5bnRoZXNpemVkQ29tbWVudFdpdGhPcmlnaW5hbFtdIHtcbiAgY29uc3QgY29tbWVudHMgPSB0cy5nZXRMZWFkaW5nQ29tbWVudFJhbmdlcyh0ZXh0LCAwKSB8fCBbXTtcbiAgcmV0dXJuIGNvbW1lbnRzLm1hcCgoY3IpOiBTeW50aGVzaXplZENvbW1lbnRXaXRoT3JpZ2luYWwgPT4ge1xuICAgIC8vIENvbmZ1c2luZ2x5LCBDb21tZW50UmFuZ2UgaW4gVHlwZVNjcmlwdCBpbmNsdWRlcyBzdGFydCBhbmQgZW5kIG1hcmtlcnMsIGJ1dFxuICAgIC8vIFN5bnRoZXNpemVkQ29tbWVudHMgZG8gbm90LlxuICAgIGNvbnN0IGNvbW1lbnRUZXh0ID0gY3Iua2luZCA9PT0gdHMuU3ludGF4S2luZC5TaW5nbGVMaW5lQ29tbWVudFRyaXZpYSA/XG4gICAgICAgIHRleHQuc3Vic3RyaW5nKGNyLnBvcyArIDIsIGNyLmVuZCkgOlxuICAgICAgICB0ZXh0LnN1YnN0cmluZyhjci5wb3MgKyAyLCBjci5lbmQgLSAyKTtcbiAgICByZXR1cm4ge1xuICAgICAgLi4uY3IsXG4gICAgICB0ZXh0OiBjb21tZW50VGV4dCxcbiAgICAgIHBvczogLTEsXG4gICAgICBlbmQ6IC0xLFxuICAgICAgb3JpZ2luYWxSYW5nZToge3BvczogY3IucG9zICsgb2Zmc2V0LCBlbmQ6IGNyLmVuZCArIG9mZnNldH1cbiAgICB9O1xuICB9KTtcbn1cblxuLyoqXG4gKiBzdXBwcmVzc0NvbW1lbnRzUmVjdXJzaXZlbHkgcHJldmVudHMgZW1pdCBvZiBsZWFkaW5nIGNvbW1lbnRzIG9uIG5vZGUsIGFuZCBhbnkgcmVjdXJzaXZlIG5vZGVzXG4gKiB1bmRlcm5lYXRoIGl0IHRoYXQgc3RhcnQgYXQgdGhlIHNhbWUgb2Zmc2V0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gc3VwcHJlc3NMZWFkaW5nQ29tbWVudHNSZWN1cnNpdmVseShub2RlOiB0cy5Ob2RlKSB7XG4gIC8vIFR5cGVTY3JpcHQgZW1pdHMgbGVhZGluZyBjb21tZW50cyBvbiBhIG5vZGUsIHVubGVzczpcbiAgLy8gLSB0aGUgY29tbWVudCB3YXMgZW1pdHRlZCBieSB0aGUgcGFyZW50IG5vZGVcbiAgLy8gLSB0aGUgbm9kZSBoYXMgdGhlIE5vTGVhZGluZ0NvbW1lbnRzIGVtaXQgZmxhZy5cbiAgLy8gSG93ZXZlciwgdHJhbnNmb3JtYXRpb24gc3RlcHMgc29tZXRpbWVzIGNvcHkgbm9kZXMgd2l0aG91dCBrZWVwaW5nIHRoZWlyIGVtaXQgZmxhZ3MsIHNvIGp1c3RcbiAgLy8gc2V0dGluZyBOb0xlYWRpbmdDb21tZW50cyByZWN1cnNpdmVseSBpcyBub3QgZW5vdWdoLCB3ZSBtdXN0IGFsc28gc2V0IHRoZSB0ZXh0IHJhbmdlIHRvIGF2b2lkXG4gIC8vIHRoZSBjb3BpZWQgbm9kZSB0byBoYXZlIGNvbW1lbnRzIGVtaXR0ZWQuXG4gIGNvbnN0IG9yaWdpbmFsU3RhcnQgPSBub2RlLmdldEZ1bGxTdGFydCgpO1xuICBjb25zdCBhY3R1YWxTdGFydCA9IG5vZGUuZ2V0U3RhcnQoKTtcbiAgZnVuY3Rpb24gc3VwcHJlc3NDb21tZW50c0ludGVybmFsKG5vZGU6IHRzLk5vZGUpOiBib29sZWFuIHtcbiAgICB0cy5zZXRFbWl0RmxhZ3Mobm9kZSwgdHMuRW1pdEZsYWdzLk5vTGVhZGluZ0NvbW1lbnRzKTtcbiAgICByZXR1cm4gISF0cy5mb3JFYWNoQ2hpbGQobm9kZSwgKGNoaWxkKSA9PiB7XG4gICAgICBpZiAoY2hpbGQucG9zICE9PSBvcmlnaW5hbFN0YXJ0KSByZXR1cm4gdHJ1ZTtcbiAgICAgIHJldHVybiBzdXBwcmVzc0NvbW1lbnRzSW50ZXJuYWwoY2hpbGQpO1xuICAgIH0pO1xuICB9XG4gIHN1cHByZXNzQ29tbWVudHNJbnRlcm5hbChub2RlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvU3ludGhlc2l6ZWRDb21tZW50KFxuICAgIHRhZ3M6IFRhZ1tdLCBlc2NhcGVFeHRyYVRhZ3M/OiBTZXQ8c3RyaW5nPik6IHRzLlN5bnRoZXNpemVkQ29tbWVudCB7XG4gIHJldHVybiB7XG4gICAga2luZDogdHMuU3ludGF4S2luZC5NdWx0aUxpbmVDb21tZW50VHJpdmlhLFxuICAgIHRleHQ6IHRvU3RyaW5nV2l0aG91dFN0YXJ0RW5kKHRhZ3MsIGVzY2FwZUV4dHJhVGFncyksXG4gICAgcG9zOiAtMSxcbiAgICBlbmQ6IC0xLFxuICAgIGhhc1RyYWlsaW5nTmV3TGluZTogdHJ1ZSxcbiAgfTtcbn1cblxuLyoqIFNlcmlhbGl6ZXMgYSBDb21tZW50IG91dCB0byBhIHN0cmluZywgYnV0IGRvZXMgbm90IGluY2x1ZGUgdGhlIHN0YXJ0IGFuZCBlbmQgY29tbWVudCB0b2tlbnMuICovXG5leHBvcnQgZnVuY3Rpb24gdG9TdHJpbmdXaXRob3V0U3RhcnRFbmQodGFnczogVGFnW10sIGVzY2FwZUV4dHJhVGFncyA9IG5ldyBTZXQ8c3RyaW5nPigpKTogc3RyaW5nIHtcbiAgcmV0dXJuIHNlcmlhbGl6ZSh0YWdzLCBmYWxzZSwgZXNjYXBlRXh0cmFUYWdzKTtcbn1cblxuLyoqIFNlcmlhbGl6ZXMgYSBDb21tZW50IG91dCB0byBhIHN0cmluZyB1c2FibGUgaW4gc291cmNlIGNvZGUuICovXG5leHBvcnQgZnVuY3Rpb24gdG9TdHJpbmcodGFnczogVGFnW10sIGVzY2FwZUV4dHJhVGFncyA9IG5ldyBTZXQ8c3RyaW5nPigpKTogc3RyaW5nIHtcbiAgcmV0dXJuIHNlcmlhbGl6ZSh0YWdzLCB0cnVlLCBlc2NhcGVFeHRyYVRhZ3MpO1xufVxuXG5mdW5jdGlvbiBzZXJpYWxpemUoXG4gICAgdGFnczogVGFnW10sIGluY2x1ZGVTdGFydEVuZDogYm9vbGVhbiwgZXNjYXBlRXh0cmFUYWdzID0gbmV3IFNldDxzdHJpbmc+KCkpOiBzdHJpbmcge1xuICBpZiAodGFncy5sZW5ndGggPT09IDApIHJldHVybiAnJztcbiAgaWYgKHRhZ3MubGVuZ3RoID09PSAxKSB7XG4gICAgY29uc3QgdGFnID0gdGFnc1swXTtcbiAgICBpZiAoKHRhZy50YWdOYW1lID09PSAndHlwZScgfHwgdGFnLnRhZ05hbWUgPT09ICd0eXBlZGVmJyB8fCB0YWcudGFnTmFtZSA9PT0gJ25vY29sbGFwc2UnKSAmJlxuICAgICAgICAoIXRhZy50ZXh0IHx8ICF0YWcudGV4dC5tYXRjaCgnXFxuJykpKSB7XG4gICAgICAvLyBTcGVjaWFsLWNhc2Ugb25lLWxpbmVyIFwidHlwZVwiIGFuZCBcIm5vY29sbGFwc2VcIiB0YWdzIHRvIGZpdCBvbiBvbmUgbGluZSwgZS5nLlxuICAgICAgLy8gICAvKiogQHR5cGUge2Zvb30gKi9cbiAgICAgIGNvbnN0IHRleHQgPSB0YWdUb1N0cmluZyh0YWcsIGVzY2FwZUV4dHJhVGFncyk7XG4gICAgICByZXR1cm4gaW5jbHVkZVN0YXJ0RW5kID8gYC8qKiR7dGV4dH0gKi9gIDogYCoke3RleHR9IGA7XG4gICAgfVxuICAgIC8vIE90aGVyd2lzZSwgZmFsbCB0aHJvdWdoIHRvIHRoZSBtdWx0aS1saW5lIG91dHB1dC5cbiAgfVxuXG4gIGxldCBvdXQgPSBpbmNsdWRlU3RhcnRFbmQgPyAnLyoqXFxuJyA6ICcqXFxuJztcbiAgY29uc3QgZW1pdHRlZCA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICBmb3IgKGNvbnN0IHRhZyBvZiB0YWdzKSB7XG4gICAgaWYgKGVtaXR0ZWQuaGFzKHRhZy50YWdOYW1lKSAmJiBTSU5HTEVUT05fVEFHUy5oYXModGFnLnRhZ05hbWUpKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgZW1pdHRlZC5hZGQodGFnLnRhZ05hbWUpO1xuICAgIG91dCArPSAnIConO1xuICAgIC8vIElmIHRoZSB0YWdUb1N0cmluZyBpcyBtdWx0aS1saW5lLCBpbnNlcnQgXCIgKiBcIiBwcmVmaXhlcyBvbiBzdWJzZXF1ZW50IGxpbmVzLlxuICAgIG91dCArPSB0YWdUb1N0cmluZyh0YWcsIGVzY2FwZUV4dHJhVGFncykuc3BsaXQoJ1xcbicpLmpvaW4oJ1xcbiAqICcpO1xuICAgIG91dCArPSAnXFxuJztcbiAgfVxuICBvdXQgKz0gaW5jbHVkZVN0YXJ0RW5kID8gJyAqL1xcbicgOiAnICc7XG4gIHJldHVybiBvdXQ7XG59XG5cbi8qKiBNZXJnZXMgbXVsdGlwbGUgdGFncyAob2YgdGhlIHNhbWUgdGFnTmFtZSB0eXBlKSBpbnRvIGEgc2luZ2xlIHVuaWZpZWQgdGFnLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlKHRhZ3M6IFRhZ1tdKTogVGFnIHtcbiAgY29uc3QgdGFnTmFtZXMgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgY29uc3QgcGFyYW1ldGVyTmFtZXMgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgY29uc3QgdHlwZXMgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgY29uc3QgdGV4dHMgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgLy8gSWYgYW55IG9mIHRoZSB0YWdzIGFyZSBvcHRpb25hbC9yZXN0LCB0aGVuIHRoZSBtZXJnZWQgb3V0cHV0IGlzIG9wdGlvbmFsL3Jlc3QuXG4gIGxldCBvcHRpb25hbCA9IGZhbHNlO1xuICBsZXQgcmVzdFBhcmFtID0gZmFsc2U7XG4gIGZvciAoY29uc3QgdGFnIG9mIHRhZ3MpIHtcbiAgICB0YWdOYW1lcy5hZGQodGFnLnRhZ05hbWUpO1xuICAgIGlmICh0YWcucGFyYW1ldGVyTmFtZSAhPT0gdW5kZWZpbmVkKSBwYXJhbWV0ZXJOYW1lcy5hZGQodGFnLnBhcmFtZXRlck5hbWUpO1xuICAgIGlmICh0YWcudHlwZSAhPT0gdW5kZWZpbmVkKSB0eXBlcy5hZGQodGFnLnR5cGUpO1xuICAgIGlmICh0YWcudGV4dCAhPT0gdW5kZWZpbmVkKSB0ZXh0cy5hZGQodGFnLnRleHQpO1xuICAgIGlmICh0YWcub3B0aW9uYWwpIG9wdGlvbmFsID0gdHJ1ZTtcbiAgICBpZiAodGFnLnJlc3RQYXJhbSkgcmVzdFBhcmFtID0gdHJ1ZTtcbiAgfVxuXG4gIGlmICh0YWdOYW1lcy5zaXplICE9PSAxKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBjYW5ub3QgbWVyZ2UgZGlmZmVyaW5nIHRhZ3M6ICR7SlNPTi5zdHJpbmdpZnkodGFncyl9YCk7XG4gIH1cbiAgY29uc3QgdGFnTmFtZSA9IHRhZ05hbWVzLnZhbHVlcygpLm5leHQoKS52YWx1ZTtcbiAgY29uc3QgcGFyYW1ldGVyTmFtZSA9XG4gICAgICBwYXJhbWV0ZXJOYW1lcy5zaXplID4gMCA/IEFycmF5LmZyb20ocGFyYW1ldGVyTmFtZXMpLmpvaW4oJ19vcl8nKSA6IHVuZGVmaW5lZDtcbiAgY29uc3QgdHlwZSA9IHR5cGVzLnNpemUgPiAwID8gQXJyYXkuZnJvbSh0eXBlcykuam9pbignfCcpIDogdW5kZWZpbmVkO1xuICAvLyBAdGVtcGxhdGUgdXNlcyB0ZXh0IChub3QgdHlwZSEpIHRvIGRlY2xhcmUgaXRzIHR5cGUgcGFyYW1ldGVycywgd2l0aCAnLCctc2VwYXJhdGVkIHRleHQuXG4gIGNvbnN0IGlzVGVtcGxhdGVUYWcgPSB0YWdOYW1lID09PSAndGVtcGxhdGUnO1xuICBjb25zdCB0ZXh0ID0gdGV4dHMuc2l6ZSA+IDAgPyBBcnJheS5mcm9tKHRleHRzKS5qb2luKGlzVGVtcGxhdGVUYWcgPyAnLCcgOiAnIC8gJykgOiB1bmRlZmluZWQ7XG4gIGNvbnN0IHRhZzogVGFnID0ge3RhZ05hbWUsIHBhcmFtZXRlck5hbWUsIHR5cGUsIHRleHR9O1xuICAvLyBOb3RlOiBhIHBhcmFtIGNhbiBlaXRoZXIgYmUgb3B0aW9uYWwgb3IgYSByZXN0IHBhcmFtOyBpZiB3ZSBtZXJnZWQgYW5cbiAgLy8gb3B0aW9uYWwgYW5kIHJlc3QgcGFyYW0gdG9nZXRoZXIsIHByZWZlciBtYXJraW5nIGl0IGFzIGEgcmVzdCBwYXJhbS5cbiAgaWYgKHJlc3RQYXJhbSkge1xuICAgIHRhZy5yZXN0UGFyYW0gPSB0cnVlO1xuICB9IGVsc2UgaWYgKG9wdGlvbmFsKSB7XG4gICAgdGFnLm9wdGlvbmFsID0gdHJ1ZTtcbiAgfVxuICByZXR1cm4gdGFnO1xufVxuIl19