const cheerio = require("cheerio")

module.exports = (oldHtml, rawVariables, filename) => {
  if (filename.indexOf("without-environments") > -1)
    return oldHtml
  
  const $html = cheerio.load(oldHtml);
  $html('body').prepend(rawVariables);
  return $html.html()
}