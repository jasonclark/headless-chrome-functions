//use headless chrome programmatically to take screenshot, make pdf, and scrape Google search results page

//See documentation for Puppeteer at https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md
//Inspiration from https://www.youtube.com/watch?v=XEw_n_wsk1o AND https://codeburst.io/a-guide-to-automating-scraping-the-web-with-javascript-chrome-puppeteer-node-js-b18efb9e9921

const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://jasonclark.info', {waitUntil: 'networkidle2'});
  //await page.setViewport({width: 1000, height: 500})
  await page.screenshot({path: 'example.png', fullPage: true});
  console.log('Screenshot created.');
  await browser.close();
})();

//create pdf
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://jasonclark.info', {waitUntil: 'networkidle2'});
  await page.pdf({path: 'example.pdf', format: 'letter'});
  console.log('PDF created.');
  await browser.close();
})();

//scrape Google.com results
(async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.goto('https://google.com', {waitUntil: 'networkidle2'});
  await page.type('input[name=q]', 'library');
  await page.click('input[type="submit"]');

  //wait for results
  await page.waitForSelector('h3 a');

/*
  const links = await page.$$eval('h3 a', results => {
    return a.map(a => a.textContent);
*/

  //extract the results from the page
  const links = await page.evaluate(() => {
    const anchors = Array.from(document.querySelectorAll('h3 a'));
    return anchors.map(anchor => anchor.textContent);
  });
  console.log(links.join('\n'));  
  await browser.close();
})();
