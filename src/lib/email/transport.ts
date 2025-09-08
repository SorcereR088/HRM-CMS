export const getTransportOptions = () => ({
  host: process.env.MAIL_HOST || '172.16.61.53',
  port: parseInt(process.env.MAIL_PORT || '25', 10),
  secure: false,
  auth: undefined,
  tls: {
    rejectUnauthorized: false,
  },

  // Connection pooling to reuse connections
  pool: true,
  maxConnections: 5, // Maximum number of simultaneous connections
  maxMessages: 100, // Maximum number of messages per connection

  // Keep connections alive to avoid reconnecting
  keepAlive: true,

  // Rate limiting to prevent overwhelming the server
  rateLimit: 10, // Max 10 messages per second
  rateDelta: 1000, // Per 1000ms

  // Connection timeouts
  connectionTimeout: 60000,
  greetingTimeout: 30000,
  socketTimeout: 60000,

  // Disable debug logging in production and reduce development logs
  debug: process.env.MAIL_DEBUG === 'true',
  logger: process.env.MAIL_DEBUG === 'true',
})
