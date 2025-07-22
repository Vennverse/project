const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { action, ...data } = JSON.parse(event.body || '{}');

    switch (action) {
      case 'create_subscription':
        const { plan_id, customer_email } = data;
        
        // Create customer
        const customer = await stripe.customers.create({
          email: customer_email,
        });

        // Create subscription
        const subscription = await stripe.subscriptions.create({
          customer: customer.id,
          items: [{
            price: plan_id === 'premium' ? process.env.STRIPE_PREMIUM_PRICE_ID : process.env.STRIPE_ENTERPRISE_PRICE_ID,
          }],
          payment_behavior: 'default_incomplete',
          expand: ['latest_invoice.payment_intent'],
        });

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            subscription_id: subscription.id,
            client_secret: subscription.latest_invoice.payment_intent.client_secret,
          })
        };

      case 'create_payment_intent':
        const { amount, currency = 'usd', metadata = {} } = data;
        
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amount * 100, // Convert to cents
          currency,
          metadata,
          automatic_payment_methods: {
            enabled: true,
          },
        });

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            client_secret: paymentIntent.client_secret,
            payment_intent_id: paymentIntent.id
          })
        };

      case 'webhook':
        const sig = event.headers['stripe-signature'];
        let stripeEvent;

        try {
          stripeEvent = stripe.webhooks.constructEvent(event.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
        } catch (err) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Webhook signature verification failed' })
          };
        }

        // Handle the event
        switch (stripeEvent.type) {
          case 'payment_intent.succeeded':
            // Handle successful payment
            console.log('Payment succeeded:', stripeEvent.data.object);
            break;
          case 'invoice.payment_succeeded':
            // Handle successful subscription payment
            console.log('Subscription payment succeeded:', stripeEvent.data.object);
            break;
          default:
            console.log(`Unhandled event type ${stripeEvent.type}`);
        }

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ received: true })
        };

      default:
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid action' })
        };
    }
  } catch (error) {
    console.error('Stripe error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};