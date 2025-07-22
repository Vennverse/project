let advertisements = [];

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    switch (event.httpMethod) {
      case 'GET':
        // Only return active and paid advertisements
        const activeAds = advertisements.filter(ad => 
          ad.status === 'active' && ad.payment_status === 'paid'
        );
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(activeAds)
        };

      case 'POST':
        const { action, ...adData } = JSON.parse(event.body || '{}');
        
        if (action === 'create') {
          const newAd = {
            id: 'ad-' + Date.now(),
            ...adData,
            status: 'pending', // Requires admin approval
            payment_status: 'pending', // Requires payment
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          
          advertisements.push(newAd);
          
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(newAd)
          };
        }
        
        if (action === 'payment_success') {
          const adIndex = advertisements.findIndex(a => a.id === adData.ad_id);
          if (adIndex !== -1) {
            advertisements[adIndex].payment_status = 'paid';
            advertisements[adIndex].payment_date = new Date().toISOString();
            advertisements[adIndex].stripe_payment_id = adData.payment_intent_id;
          }
          
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'Payment confirmed' })
          };
        }
        break;

      case 'PUT':
        const adId = event.path.split('/').pop();
        const adIndex = advertisements.findIndex(a => a.id === adId);
        
        if (adIndex === -1) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'Advertisement not found' })
          };
        }
        
        const updates = JSON.parse(event.body || '{}');
        advertisements[adIndex] = {
          ...advertisements[adIndex],
          ...updates,
          updated_at: new Date().toISOString()
        };
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(advertisements[adIndex])
        };
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Not found' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};