const puppeteer = require('puppeteer');
//const canvas = require('../public/canvas');

test('e2e 1- canvas interaction, and resettting canvas UI test', async () => {
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    /*const browser = await puppeteer.launch({
        
        headless: false, //disable headless mode - debugging
        slowMo: 80 //slow motion - debugging
    });*/
    const page = await browser.newPage();
    await page.goto('http://127.0.0.1:5500/public/index.html', {waitUntil: 'domcontentloaded'});
    await page.click('canvas');
    await page.reload();
    await page.close();

}, 10000);