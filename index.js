const app = require("express")();

let chrome = {};
let puppeteer;

if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
    chrome = require("chrome-aws-lambda");
    puppeteer = require("puppeteer-core");
} else {
    puppeteer = require("puppeteer");
}

app.get("/scrape", async (req, res) => {
    const targetURL = req.query.url;

    if (!targetURL) {
        return res.status(400).send("URL parameter is required.");
    }

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
        const browser = await puppeteer.launch(options);
        const page = await browser.newPage();
        await page.goto(targetURL, { waitUntil: 'networkidle2' });

        const pageHTML = await page.content();

        await browser.close();

        res.send(pageHTML);
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred while scraping the website.");
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server started");
});

module.exports = app;
