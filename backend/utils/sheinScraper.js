const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

class SheinScraper {
  constructor() {
    this.baseUrl = 'https://us.shein.com';
  }

  async initialize() {
    this.browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
        '--disable-dev-shm-usage'
      ]
    });
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async getProductsByCategory(category, pageNum = 1) {
    try {
      const url = `${this.baseUrl}/${category}-cat.html?page=${pageNum}`;
      await this.initialize();
      const page = await this.browser.newPage();
      
      // Set viewport and user agent
      // Set viewport and user agent
      await page.setViewport({ width: 1920, height: 1080 });
      await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
      
      // Set additional headers
      await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Cache-Control': 'max-age=0',
      });

      // Add retry logic for navigation
      let retries = 3;
      while (retries > 0) {
        try {
          await page.goto(url, {
            waitUntil: 'networkidle0',
            timeout: 60000 // Increase timeout to 60 seconds
          });
          // Add a small delay to ensure page is fully loaded
          await new Promise(resolve => setTimeout(resolve, 5000));
          break;
        } catch (error) {
          retries--;
          if (retries === 0) throw error;
          console.log(`Retrying navigation... ${retries} attempts left`);
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
      }

      // Wait for product grid to load with timeout
      try {
        await page.waitForSelector('.product-list .S-product-item', { timeout: 10000 });
      } catch (error) {
        console.log('Product grid not found, checking for alternative selectors...');
        // Try alternative selectors
        await page.waitForSelector('[class*="product-list"] [class*="product-item"]', { timeout: 10000 });
      }

      const content = await page.content();
      const $ = cheerio.load(content);

      const products = [];

      $('.product-list .S-product-item').each((i, el) => {
        const product = {
          id: $(el).attr('data-id'),
          name: $(el).find('.S-product-item__name').text().trim(),
          price: parseFloat($(el).find('.S-product-item__price').text().replace('$', '')),
          originalPrice: parseFloat($(el).find('.S-product-item__original-price').text().replace('$', '')),
          images: [$(el).find('.S-product-item__img-container img').attr('src')],
          url: this.baseUrl + $(el).find('.S-product-item__img-container a').attr('href'),
          category: category,
        };

        // Only add products with valid IDs
        if (product.id) {
          products.push(product);
        }
      });

      await this.close();
      return products;

    } catch (error) {
      console.error('Error scraping SHEIN products:', error);
      await this.close();
      throw error;
    }
  }

  async getProductDetails(productUrl) {
    try {
      await this.initialize();
      const page = await this.browser.newPage();
      
      // Set viewport and user agent
      await page.setViewport({ width: 1920, height: 1080 });
      await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
      
      // Set additional headers
      await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Cache-Control': 'max-age=0',
      });

      // Add retry logic for navigation
      let retries = 3;
      while (retries > 0) {
        try {
          await page.goto(productUrl, {
            waitUntil: 'networkidle0',
            timeout: 60000 // Increase timeout to 60 seconds
          });
          // Add a small delay to ensure page is fully loaded
          await new Promise(resolve => setTimeout(resolve, 5000));
          break;
        } catch (error) {
          retries--;
          if (retries === 0) throw error;
          console.log(`Retrying product details... ${retries} attempts left`);
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
      }

      // Wait for product details to load
      await page.waitForSelector('.product-intro');

      const content = await page.content();
      const $ = cheerio.load(content);

      const product = {
        name: $('.product-intro__head-name').text().trim(),
        price: parseFloat($('.product-intro__head-price').text().replace('$', '')),
        description: $('.product-intro__description').text().trim(),
        images: [],
        sizes: [],
        colors: [],
      };

      // Get all product images
      $('.product-intro__galleryWrap img').each((i, el) => {
        const imgUrl = $(el).attr('src');
        if (imgUrl) {
          product.images.push(imgUrl);
        }
      });

      // Get available sizes
      $('.product-intro__size-radio-inner').each((i, el) => {
        product.sizes.push($(el).text().trim());
      });

      // Get available colors
      $('.product-intro__color-radio').each((i, el) => {
        product.colors.push($(el).attr('title'));
      });

      await this.close();
      return product;

    } catch (error) {
      console.error('Error scraping SHEIN product details:', error);
      await this.close();
      throw error;
    }
  }
}

module.exports = SheinScraper;
