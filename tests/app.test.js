const puppeteer = require('puppeteer')

let browser
let page
let baseURL = 'http://localhost:8000'
const width = 1920
const height = 1080

const isDebugging = () => {
  const debuggingMode = {
    headless: false,
    slowMo: 250,
    devtools: true
  }
  return process.env.NODE_ENV === 'debug' ? debuggingMode : {}
}

beforeAll(async () => {
  browser = await puppeteer.launch(isDebugging())
  page = await browser.newPage()
  await page.goto(baseURL)
  page.setViewport({ width: width, height: height })
})

describe('Homepage loads', () => {
  test('Main heading displays correctly', async() => {
    await page.waitForSelector('.hero-title')
    const html = await page.$eval('.hero-title', e => e.innerHTML)
    expect(html).toBe('Build with uPort')
  })
})

describe('Crawl for broken links ', () => {
  test('Checking Nav, ToC and Content', async () => {
    await page.goto(baseURL, {waitUntil: 'networkidle2'})
    let navLinks = await page.evaluate(() => Array.from(document.body.querySelectorAll('#topNav a[href]'), ({ href }) => href))
    for (const navLink of navLinks) {
      expect(await checkLink(navLink)).toBe(true)
      if (navLink.indexOf(baseURL) >= 0) {
        await page.goto(navLink, {waitUntil: 'networkidle2'})
        let tocLinks = await page.evaluate(() => Array.from(document.body.querySelectorAll('#toc a[href]'), ({ href }) => href))
        for (const tocLink of tocLinks) {
          expect(await checkLink(tocLink)).toBe(true)
          await page.goto(tocLink, {waitUntil: 'networkidle2'})
          let contentLinks = await page.evaluate(() => Array.from(document.body.querySelectorAll('.docSearch-content a[href]'), ({ href }) => href))
          for (const contentLink of contentLinks) {
            expect(await checkLink(contentLink)).toBe(true)
          }
        }
      }
    }
  }, 50000)

  test('Checking footer', async () => {
    await page.goto(baseURL, {waitUntil: 'networkidle2'})
    let footerLinks = await page.evaluate(() => Array.from(document.body.querySelectorAll('footer a[href]'), ({ href }) => href))
    for (const footerLink of footerLinks) {
      expect(await checkLink(footerLink)).toBe(true)
    }
  }, 60000)

  test('Checking homepage content', async () => {
    await page.goto(baseURL, {waitUntil: 'networkidle2'})
    let homepageLinks = await page.evaluate(() => Array.from(document.body.querySelectorAll('.body-container a[href], .home-hero a[href]'), ({ href }) => href))
    for (const homepageLink of homepageLinks) {
      expect(await checkLink(homepageLink)).toBe(true)
    }
  }, 60000)
})

const checkLink = async (url) => {
  let response = await page.goto(url, {waitUntil: 'networkidle2'})
  if (url.indexOf(baseURL) < 0) {
    return response._status === 200
  } else {
    return await page.$eval('span.brand img', el => el ? true : false)
  }
}

afterAll(() => {
  if (isDebugging()) {
    browser.close()
  }
})
