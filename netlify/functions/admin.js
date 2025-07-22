// Admin-only functions
let businesses = [];
let users = [];
let enquiries = [];
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
    // Verify admin token
    const token = event.headers.authorization?.replace('Bearer ', '');
    if (!token || !token.includes('admin')) {
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({ error: 'Admin access required' })
      };
    }

    const { action, ...data } = JSON.parse(event.body || '{}');

    switch (action) {
      case 'get_dashboard':
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            stats: {
              total_users: users.length,
              total_businesses: businesses.length,
              pending_businesses: businesses.filter(b => b.status === 'pending').length,
              total_enquiries: enquiries.length,
              unread_enquiries: enquiries.filter(e => e.status === 'unread').length
            },
            recent_businesses: businesses.slice(-5),
            recent_enquiries: enquiries.slice(-10)
          })
        };

      case 'approve_business':
        const businessIndex = businesses.findIndex(b => b.id === data.business_id);
        if (businessIndex !== -1) {
          businesses[businessIndex].status = 'active';
          businesses[businessIndex].updated_at = new Date().toISOString();
        }
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ message: 'Business approved' })
        };

      case 'reject_business':
        const rejectIndex = businesses.findIndex(b => b.id === data.business_id);
        if (rejectIndex !== -1) {
          businesses[rejectIndex].status = 'rejected';
          businesses[rejectIndex].updated_at = new Date().toISOString();
        }
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ message: 'Business rejected' })
        };

      case 'get_enquiries':
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(enquiries)
        };

      case 'mark_enquiry_read':
        const enquiryIndex = enquiries.findIndex(e => e.id === data.enquiry_id);
        if (enquiryIndex !== -1) {
          enquiries[enquiryIndex].status = 'read';
        }
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ message: 'Enquiry marked as read' })
        };

      case 'activate_advertisement':
        const adIndex = advertisements.findIndex(a => a.id === data.ad_id);
        if (adIndex !== -1) {
          advertisements[adIndex].status = 'active';
          advertisements[adIndex].activated_at = new Date().toISOString();
        }
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ message: 'Advertisement activated' })
        };

      default:
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid action' })
        };
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};