require('dotenv').config();
const puppeteer = require('puppeteer');
const { MongoClient } = require('mongodb');

async function scrapeShein() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-web-security',
      '--disable-features=IsolateOrigins',
      '--window-size=1920,1080',
    ],
  });

  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const page = await browser.newPage();
    
    // Configure the navigation
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
    
    // Set headers
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
    });

    // Navigate to SHEIN dresses page
    console.log('Navigating to SHEIN...');
    await page.goto('https://us.shein.com/dresses.html', {
      waitUntil: 'networkidle0',
      timeout: 60000
    });

    // Wait for some time to ensure page loads
    await page.waitForTimeout(5000);

    // Get all products
    const products = await page.evaluate(() => {
      const items = document.querySelectorAll('[class*="product-item"]');
      return Array.from(items, item => {
        const nameEl = item.querySelector('[class*="product-item__name"]');
        const priceEl = item.querySelector('[class*="product-item__price"]');
        const imgEl = item.querySelector('img');
        const linkEl = item.querySelector('a');
        
        return {
          name: nameEl ? nameEl.textContent.trim() : '',
          price: priceEl ? parseFloat(priceEl.textContent.replace(/[^0-9.]/g, '')) : 0,
          image: imgEl ? imgEl.src : '',
          url: linkEl ? linkEl.href : '',
          category: 'dresses',
          createdAt: new Date(),
          updatedAt: new Date()
        };
      });
    });

    console.log(`Found ${products.length} products`);

    // Filter out invalid products
    const validProducts = products.filter(p => p.name && p.price && p.image && p.url);
    console.log(`${validProducts.length} valid products`);

    // Save to database
    if (validProducts.length > 0) {
      const db = client.db('fashion_store');
      const collection = db.collection('products');
      
      for (const product of validProducts) {
        try {
          await collection.updateOne(
            { url: product.url },
            { $set: product },
            { upsert: true }
          );
          console.log(`Saved/Updated: ${product.name}`);
        } catch (err) {
          console.error(`Error saving product: ${product.name}`, err);
        }
      }
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
    await client.close();
  }
}

scrapeShein().catch(console.error);
