const app = require("express")();

let chrome = {};
let puppeteer;

if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
  chrome = require("chrome-aws-lambda");
  puppeteer = require("puppeteer-core");
} else {
  puppeteer = require("puppeteer");
}

app.get("/", async (req, res) => {
  let options = {};

  if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
    options = {
      args: [...chrome.args, "--hide-scrollbars", "--disable-web-security"],
      defaultViewport: chrome.defaultViewport,
      executablePath: await chrome.executablePath,
      headless: true,
      ignoreHTTPSErrors: true,
    };
  }

  try {
    let browser = await puppeteer.launch(options);

    let page = await browser.newPage();
    // await page.goto("https://www.google.com");
    // await page.goto("https://www.goldtraders.or.th/default.aspx");
    // await page.goto("https://77-house.com");
    await page.goto("https://ทองคําราคา.com");
    // const URL = "https://www.goldtraders.or.th/default.aspx";

    //Assign Value
    // barSell = await page.waitForSelector(".em.bg-em.g-u")[0]
    // barSell = await page.waitForSelector("#rightCol table .em:nth-child(4)")
    barSell = await page.waitForSelector("#rightCol .trline:nth-child(2) .em")
    barSellPrice = await page.evaluate((barSell) => barSell.textContent, barSell)
    // console.log(barSellPrice)
    // res.send(barSellPrice);

    // res.send(await page.title());
    // red.send(await page.evaluate((barSell) => barSell.textContent, barSell))
    res.send(await barSellPrice);
  } catch (err) {
    console.error(err);
    return null;
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started");
});

module.exports = app;
