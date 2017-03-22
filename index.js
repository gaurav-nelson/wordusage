/**
 * @author Gaurav Nelson
 * @copyright 2017 Gaurav Nelson
 * @license MIT
 * @module wordusage
 * @fileoverview
 *   Word usage advice pertinent to technical writing
 */

'use strict';

/* Dependencies. */
var VFile = require('vfile');
var unified = require('unified');
var markdown = require('remark-parse');
var english = require('retext-english');
var rtwordusage = require('retext-wordusage');
var remark2retext = require('remark-retext');
var sort = require('vfile-sort');
var filter = require('./filter');

/* Expose. */
module.exports = wordusage;
wordusage.text = noMarkdown;
wordusage.markdown = wordusage;

/* Processor. */
var text = unified().use(english).use(rtwordusage);

/**
 * wordusage core.
 *
 * @param {string|VFile} value - Content.
 * @param {Processor} processor - retext or remark.
 * @return {VFile} - Result.
 */
function core(value, processor) {
    var file = new VFile(value);
    var tree = processor.parse(file);

    processor.run(tree, file);

    sort(file);

    return file;
}

/**
 * wordusage.
 *
 * Read markdown as input, converts to natural language,
 * then detect violations.
 *
 * @example
 *   wordusage('We’ve confirmed his identity.').messages;
 *   // [ { [1:17-1:20: `his` may be insensitive, use `their`, `theirs` instead]
 *   //   name: '1:17-1:20',
 *   //   file: '',
 *   //   reason: '`his` may be insensitive, use `their`, `theirs` instead',
 *   //   line: 1,
 *   //   column: 17,
 *   //   fatal: false } ]
 *
 * @param {string|VFile} value - Content.
 * @param {Array.<string>?} allow - Allowed rules.
 * @return {VFile} - Result.
 */
function wordusage(value, allow) {
    return core(value, unified()
        .use(markdown)
        .use(remark2retext, text)
        .use(filter, { allow: allow })
    );
}

/**
 * wordusage, without the markdown.
 *
 * @param {string|VFile} value - Content.
 * @return {VFile} - Result.
 */
function noMarkdown(value) {
    return core(value, text);
}