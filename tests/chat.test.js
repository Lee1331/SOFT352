const puppeteer = require('puppeteer');
const {chat} = require('../public/chat');

//it('ut - should output alert ', function(){
    //expect(chat()).toBe('Enter a name and message');
//});


//end to end UI tests
test('e2e 1- screenshot UI test', async () => {
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


}, 10000);

test('e2e 2- chat UI test', async () => {
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    const page = await browser.newPage();
    await page.goto('http://127.0.0.1:5500/public/index.html');

    await page.click('button#chatSection');
    await page.click('input#username');
    await page.type('input#username', 'Alice');
    await page.type('input#message', 'Hello');
    await page.click('button#sendMessage');

    //const finalText = await page.$eval('', el => el.textContent);
    //expect(finalText).toBe('Alice : Hello');
    await page.close();


}, 10000);

test('e2e 3- onlineUser UI test', async () => {
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    
    const page = await browser.newPage();
    await page.goto('http://127.0.0.1:5500/public/index.html');

    await page.click('button#onlineUserSection');
    await page.click('textarea#usernameFormValue');
    await page.type('textarea#usernameFormValue', 'Alice');;
    await page.click('input#usernameFormSubmit');
    await page.close();

}, 10000);

test('e2e 4- chat content test', async () => {
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    
    const page = await browser.newPage();
    await page.goto('http://127.0.0.1:5500/public/index.html');
    const html = await page.content();
    await page.click('canvas');
    return html;

}, 10000);

/* fun but not that useful
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
