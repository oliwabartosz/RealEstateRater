const handlebarsHelpers = {
    equals: (a, b) => a === b,
    add: (a, b) => a + b,
    convertToStr: (text) => String(text),
}

module.exports = {
    handlebarsHelpers,
}