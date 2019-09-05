const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.goto('https://www.funk.co.nz/aminosee/');
const output = 'aminosee-homepage.png';

const image = await page.$('#selectedGenome');
await banner.screenshot({
  path: output
})

console.log(`Screenshot saved to ${output}`)

await browser.close()
