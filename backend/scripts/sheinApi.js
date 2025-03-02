require('dotenv').config();
const axios = require('axios');
const { MongoClient } = require('mongodb');

async function fetchSheinProducts() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const headers = {
      'authority': 'us.shein.com',
      'accept': '*/*',
      'accept-language': 'en-US,en;q=0.9',
      'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'referer': 'https://us.shein.com/dresses.html'
    };

    // SHEIN API endpoint for dresses
    const url = 'https://us.shein.com/pdsearch/dresses/';
    const params = {
      attr_values: '',
      cat_id: '1727',
      currency: 'USD',
      exc_attr_vips: '',
      filter_attr_info: '',
      is_cloud: '0',
      limit: 20,
      page: 1,
      price_min: '',
      price_max: '',
      sort: 'hot',
      store_code: 'all'
    };

    console.log('Fetching products from SHEIN API...');
    const response = await axios.get(url, { params, headers });
    
    if (response.data && response.data.info && response.data.info.products) {
      const products = response.data.info.products.map(p => ({
        name: p.goods_name,
        price: p.salePrice.amount,
        originalPrice: p.retailPrice.amount,
        images: [p.goods_img],
        category: 'dresses',
        url: `https://us.shein.com/${p.goods_url_name}-p-${p.goods_id}.html`,
        sheinId: p.goods_id,
        description: p.goods_desc || '',
        createdAt: new Date(),
        updatedAt: new Date()
      }));

      console.log(`Found ${products.length} products`);

      // Save to database
      if (products.length > 0) {
        const db = client.db('fashion_store');
        const collection = db.collection('products');
        
        for (const product of products) {
          try {
            await collection.updateOne(
              { sheinId: product.sheinId },
              { $set: product },
              { upsert: true }
            );
            console.log(`Saved/Updated: ${product.name}`);
          } catch (err) {
            console.error(`Error saving product: ${product.name}`, err);
          }
        }
      }
    }

  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  } finally {
    await client.close();
  }
}

fetchSheinProducts().catch(console.error);
