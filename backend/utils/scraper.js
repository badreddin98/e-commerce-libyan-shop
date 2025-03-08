const puppeteer = require('puppeteer');
const axios = require('axios');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const SHEIN_API_BASE = 'https://us.shein.com/api';

const fetchSheinProducts = async (options = {}) => {
  const {
    page = 1,
    pageSize = 120,
    cat_id,
    sort = 'hot',
    region = 'US',
    currency = 'USD',
    lang = 'en'
  } = options;

  try {
    const response = await axios.get(`${SHEIN_API_BASE}/products/list`, {
      params: {
        cat_id,
        page,
        page_size: pageSize,
        sort,
        region,
        currency,
        lang,
        _ver: Date.now()
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
        'Origin': 'https://us.shein.com',
        'Referer': 'https://us.shein.com/'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching products from Shein API:', error);
    throw error;
  }
};

const bulkScrapeSheinCategory = async (categoryId, options = {}) => {
  const {
    maxPages = 100,  // Fetch up to 100 pages by default (12,000 products)
    startPage = 1,
    pageSize = 120,  // Maximum page size allowed by Shein
    delayBetweenRequests = 1000  // 1 second delay between requests
  } = options;

  console.log(`Starting bulk scrape for category ${categoryId}`);
  const allProducts = [];
  let currentPage = startPage;
  let hasMore = true;

  while (hasMore && currentPage <= maxPages) {
    try {
      console.log(`Fetching page ${currentPage}...`);
      const data = await fetchSheinProducts({
        cat_id: categoryId,
        page: currentPage,
        pageSize
      });

      if (!data.info.products || data.info.products.length === 0) {
        hasMore = false;
        continue;
      }

      const products = data.info.products.map(p => ({
        name: p.goods_name,
        description: p.goods_desc || 'No description available',
        price: p.salePrice.amount,
        originalPrice: p.retailPrice.amount,
        images: p.goods_imgs.map(img => `https://img.ltwebstatic.com/${img}_720x.webp`),
        size: p.size_list.map(s => s.size_name) || ['S', 'M', 'L', 'XL'],
        color: p.color_list.map(c => c.color_name) || ['Default'],
        brand: 'SHEIN',
        category: p.cat_name || 'Fashion',
        countInStock: 100,
        rating: p.comment_info?.overall_rate || 0,
        numReviews: p.comment_info?.comment_num || 0,
        sheinProductId: p.goods_id.toString(),
        sheinUrl: `https://us.shein.com/${p.goods_url_name}-p-${p.goods_id}.html`
      }));

      allProducts.push(...products);
      console.log(`Added ${products.length} products from page ${currentPage}. Total: ${allProducts.length}`);

      currentPage++;
      await delay(delayBetweenRequests);

    } catch (error) {
      console.error(`Error on page ${currentPage}:`, error);
      if (error.response?.status === 429) {
        console.log('Rate limited. Waiting 60 seconds...');
        await delay(60000);
        continue;
      }
      break;
    }
  }

  return allProducts;
};

const scrapeSheinCategory = async (categoryUrl) => {
  console.log('Starting to scrape Shein category:', categoryUrl);
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Set viewport and user agent
    await page.setViewport({ width: 1280, height: 800 });
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36');
    
    // Navigate to the category page
    console.log('Navigating to category page...');
    await page.goto(categoryUrl, { waitUntil: 'networkidle0', timeout: 30000 });
    console.log('Navigation complete');
    
    // Wait for product grid to load
    console.log('Waiting for product grid to load...');
    await page.waitForSelector('.S-product-item__wrapper', { timeout: 30000 });
    console.log('Product grid loaded');
    
    // Extract all product URLs from the page
    const productUrls = await page.evaluate(() => {
      const products = document.querySelectorAll('.S-product-item__wrapper a');
      return Array.from(products)
        .map(a => a.href)
        .filter(url => url.includes('/p-'));
    });
    
    console.log(`Found ${productUrls.length} products`);
    
    // Scrape each product
    const products = [];
    for (const url of productUrls) {
      try {
        const product = await scrapeSheinProduct(url);
        products.push(product);
        // Add delay between requests to avoid being blocked
        await delay(2000);
      } catch (error) {
        console.error(`Failed to scrape product ${url}:`, error);
      }
    }
    
    return products;
  } catch (error) {
    console.error('Category scraping error:', error);
    throw new Error('Failed to scrape category');
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};


const scrapeSheinProduct = async (url) => {
  console.log('Starting to scrape Shein product:', url);
  // Extract product ID from URL
  const productId = url.match(/p-([0-9]+)/)?.[1];
  if (!productId) {
    console.error('Failed to extract product ID from URL:', url);
    throw new Error('Could not extract product ID from URL');
  }
  console.log('Extracted product ID:', productId);
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Set viewport and user agent
    await page.setViewport({ width: 1280, height: 800 });
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36');
    
    // Navigate to the product page
    console.log('Navigating to product page...');
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
    console.log('Navigation complete');
    
    // Wait for key elements to load
    console.log('Waiting for product elements to load...');
    await page.waitForSelector('.product-intro__head-name', { timeout: 30000 });
    console.log('Product elements loaded');
    
    // Extract product data
    console.log('Extracting product data...');
    const productData = await page.evaluate(() => {
      console.log('Inside page.evaluate()');
      const name = document.querySelector('.product-intro__head-name')?.textContent?.trim();
      const description = document.querySelector('.product-intro__description')?.textContent?.trim();
      const price = parseFloat(document.querySelector('[class*="price"]')?.textContent?.replace(/[^0-9.]/g, ''));
      const images = Array.from(document.querySelectorAll('.product-intro__thumbs-item img')).map(img => img.src);
      const sizes = Array.from(document.querySelectorAll('.product-intro__size-radio')).map(size => size.textContent.trim());
      const colors = Array.from(document.querySelectorAll('.product-intro__color-radio')).map(color => color.getAttribute('aria-label'));
      
      return { name, description, price, images, sizes, colors };
    });
  
    console.log('Product data extracted:', productData);
    return {
      name: productData.name || 'SHEIN Product',
      description: productData.description || 'No description available',
      price: productData.price || 0,
      originalPrice: productData.price ? productData.price * 1.2 : 0,
      images: productData.images || ['https://via.placeholder.com/300'],
      size: productData.sizes || ['S', 'M', 'L', 'XL'],
      color: productData.colors || ['Default'],
      brand: 'SHEIN',
      category: 'Fashion',
      countInStock: 100,
      rating: 0,
      numReviews: 0,
      sheinProductId: productId,
      sheinUrl: url
    };
  } catch (error) {
    console.error('Shein scraping error:', error);
    throw new Error('Failed to scrape Shein product');
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

const scrapeProduct = async (url) => {
  try {
    if (url.includes('shein.com')) {
      return await scrapeSheinProduct(url);
    }
    throw new Error('Only Shein products are supported at the moment');
  } catch (error) {
    console.error('Scraping error:', error);
    throw new Error('Failed to scrape product');
  }
};

module.exports = { scrapeProduct, scrapeSheinCategory, bulkScrapeSheinCategory };
