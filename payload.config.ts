// Updated payload.config.ts

import { PayloadConfig } from 'payload';

const config: PayloadConfig = {
  // Improved type safety
  collections: [
    {
      slug: 'users',
      admin: {
        useAsTitle: 'username',
      },
      fields: [
        {
          name: 'username',
          type: 'text',
          required: true,
        },
        {
          name: 'email',
          type: 'email',
          required: true,
          validate: (email: string) => /
            ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$
            /.test(email) || 'Invalid email format',
        },
      ],
    },
  ],

  // Optimized email configuration
  email: {
    from: 'no-reply@yourdomain.com',
    transport: {
      host: 'smtp.yourdomain.com',
      port: 587,
      secure: false,
      auth: {
        user: 'user@yourdomain.com',
        pass: 'password',
      },
    },
  },

  // Better error handling
  onError: (error) => {
    console.error('Error occurred:', error);
    // additional error handling logic
  },
};

export default config;