import * as cheerio from "cheerio"

export default (oldHtml: string, rawVariables: string, filename: string) => {
  const $html = cheerio.load(oldHtml);
  $html('head').append(rawVariables);
  return $html.html()
}