const bcrypt = require('bcryptjs');

// In-memory storage for demo (replace with database in production)
let users = [
  {
    id: 'admin-1',
    email: 'admin@bizmarket.com',
    password: '$2a$10$rOzJqQZQZQZQZQZQZQZQZOzJqQZQZQZQZQZQZQZQZOzJqQZQZQZQZQ', // 'admin123'
    full_name: 'Admin User',
    user_type: 'admin',
    verified: true,
    created_at: new Date().toISOString()
  }
];

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
    const { action, email, password, userData } = JSON.parse(event.body || '{}');

    switch (action) {
      case 'signin':
        const user = users.find(u => u.email === email);
        if (!user) {
          return {
            statusCode: 401,
            headers,
            body: JSON.stringify({ error: 'Invalid credentials' })
          };
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          return {
            statusCode: 401,
            headers,
            body: JSON.stringify({ error: 'Invalid credentials' })
          };
        }

        const { password: _, ...userWithoutPassword } = user;
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ user: userWithoutPassword, token: 'demo-token-' + user.id })
        };

      case 'signup':
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'User already exists' })
          };
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
          id: 'user-' + Date.now(),
          email,
          password: hashedPassword,
          ...userData,
          verified: true,
          created_at: new Date().toISOString()
        };

        users.push(newUser);
        const { password: __, ...newUserWithoutPassword } = newUser;
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ user: newUserWithoutPassword, token: 'demo-token-' + newUser.id })
        };

      case 'verify':
        const token = event.headers.authorization?.replace('Bearer ', '');
        if (!token || !token.startsWith('demo-token-')) {
          return {
            statusCode: 401,
            headers,
            body: JSON.stringify({ error: 'Invalid token' })
          };
        }

        const userId = token.replace('demo-token-', '');
        const verifiedUser = users.find(u => u.id === userId);
        
        if (!verifiedUser) {
          return {
            statusCode: 401,
            headers,
            body: JSON.stringify({ error: 'User not found' })
          };
        }

        const { password: ___, ...verifiedUserWithoutPassword } = verifiedUser;
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ user: verifiedUserWithoutPassword })
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