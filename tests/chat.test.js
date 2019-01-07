const puppeteer = require('puppeteer');
const {chat} = require('../public/chat');

//unit tests
//it('ut - should output alert ', function(){
    //expect(chat()).toBe('Enter a name and message');
//});


//end to end UI tests
test('e2e - screenshot UI test', async () => {
    /*const browser = await puppeteer.launch({
        
        headless: false, //disable headless mode - debugging
        slowMo: 80 //slow motion - debugging
    });*/
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    
    const page = await browser.newPage();
    //resolve this promise as soon as the DOM content has loaded
    await page.goto('http://127.0.0.1:5500/public/index.html', {waitUntil: 'domcontentloaded'});

    await page.screenshot({path: 'UIScreenshotTest.png'});
    await page.close();
    //await page.

    //const finalText = await page.$eval('', el => el.textContent);
    //expect(finalText).toBe('Alice : Hello);

}, 10000);

test('e2e - chat UI test', async () => {
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    
    const page = await browser.newPage();
    await page.goto('http://127.0.0.1:5500/public/index.html');

    await page.click('button#chatSection');
    await page.click('input#username');
    await page.type('input#username', 'Alice');
    await page.type('input#message', 'Hello');
    await page.click('button#sendMessage');
    await page.close();

    //const finalText = await page.$eval('', el => el.textContent);
    //expect(finalText).toBe('Alice : Hello);


}, 10000);

test('e2e - onlineUser UI test', async () => {
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    
    const page = await browser.newPage();
    await page.goto('http://127.0.0.1:5500/public/index.html');

    await page.click('button#onlineUserSection');
    await page.click('textarea#usernameFormValue');
    await page.type('textarea#usernameFormValue', 'Alice');;
    await page.click('input#usernameFormSubmit');
    await page.close();

    //const finalText = await page.$eval('', el => el.textContent);
    //expect(finalText).toBe('Alice : Hello);


}, 10000);

test('e2e - canvas client side UI test', async () => {
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    
    const page = await browser.newPage();
    await page.goto('http://127.0.0.1:5500/public/index.html', {waitUntil: 'domcontentloaded'});
    //wait until '#canvas' has loaded
    await page.waitForSelector('#canvas');
    await page.click('canvas');
    await page.close();

}, 10000);

test('e2e - chat content test', async () => {
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    
    const page = await browser.newPage();
    await page.goto('http://127.0.0.1:5500/public/index.html');
    const html = await page.content();
    await page.click('canvas');
    return html;

}, 10000);

/*
test('e2e - create .pdf of site', async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const options = {
        path: 'report.pdf',
        format: 'A4'
    };
    await page.goto('http://127.0.0.1:5500/public/index.html');
    await page.pdf(options);
    await browser.close();
});*/
