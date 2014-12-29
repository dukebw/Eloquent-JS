// Replace single quotes in dialogue with double quotes, while preserving the
// single quotes in contractions like "aren't."
var text = "'I'm the cook,' he said, 'it's my job.'";
var quoteRegex = /(^|\W)'|'(\W|$)/g;
var quoteString = '$1"$2';
console.log(text.replace(quoteRegex, quoteString));
