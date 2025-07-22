// In-memory storage for demo (replace with database in production)
let businesses = [
  {
    id: 'biz-1',
    title: 'Premium Coffee Franchise',
    description: 'Established coffee franchise with prime location and loyal customer base.',
    industry: 'Restaurant & Food Service',
    business_type: 'franchise',
    location: 'New York, NY',
    asking_price: 250000,
    revenue: 500000,
    established_year: 2018,
    employees: 12,
    status: 'pending',
    featured: false,
    views: 245,
    owner_id: 'user-1',
    created_at: '2024-01-15',
    updated_at: '2024-01-15'
  }
];

let enquiries = [];

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
    const path = event.path.split('/').pop();
    
    switch (event.httpMethod) {
      case 'GET':
        if (path === 'businesses') {
          // Only return active businesses for public view
          const activeBusinesses = businesses.filter(b => b.status === 'active');
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(activeBusinesses)
          };
        }
        
        if (path.startsWith('biz-')) {
          const business = businesses.find(b => b.id === path);
          if (!business) {
            return {
              statusCode: 404,
              headers,
              body: JSON.stringify({ error: 'Business not found' })
            };
          }
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(business)
          };
        }
        break;

      case 'POST':
        const { action, ...data } = JSON.parse(event.body || '{}');
        
        if (action === 'create') {
          const newBusiness = {
            id: 'biz-' + Date.now(),
            ...data,
            status: 'pending', // Requires admin approval
            featured: false,
            views: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          
          businesses.push(newBusiness);
          
          // Create enquiry notification
          const enquiry = {
            id: 'enq-' + Date.now(),
            business_id: newBusiness.id,
            type: 'new_listing',
            message: `New business listing: ${newBusiness.title}`,
            user_id: newBusiness.owner_id,
            status: 'unread',
            created_at: new Date().toISOString()
          };
          
          enquiries.push(enquiry);
          
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(newBusiness)
          };
        }
        
        if (action === 'enquiry') {
          const enquiry = {
            id: 'enq-' + Date.now(),
            business_id: data.business_id,
            type: 'business_enquiry',
            message: data.message,
            user_id: data.user_id,
            contact_info: data.contact_info,
            status: 'unread',
            created_at: new Date().toISOString()
          };
          
          enquiries.push(enquiry);
          
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'Enquiry sent successfully' })
          };
        }
        break;

      case 'PUT':
        if (path.startsWith('biz-')) {
          const businessIndex = businesses.findIndex(b => b.id === path);
          if (businessIndex === -1) {
            return {
              statusCode: 404,
              headers,
              body: JSON.stringify({ error: 'Business not found' })
            };
          }
          
          const updates = JSON.parse(event.body || '{}');
          businesses[businessIndex] = {
            ...businesses[businessIndex],
            ...updates,
            updated_at: new Date().toISOString()
          };
          
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(businesses[businessIndex])
          };
        }
        break;
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