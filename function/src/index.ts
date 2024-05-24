import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as dotenv from 'dotenv'
import express from 'express'

// Initialize Firebase Admin
admin.initializeApp()

// Load environment variables
dotenv.config()

const app = express()

// Middleware to check IP address
app.use((req, res, next) => {
  const config = functions.config()
  if (config.access && config.access.allowed_ips) {
    const allowedIps = config.access.allowed_ips.split(',')
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress

    // If x-forwarded-for header contains multiple IPs, take the first one
    const ips = (clientIp as string).split(',')
    const ipToCheck = ips[0].trim()

    if (allowedIps.includes(ipToCheck)) {
      next()
    } else {
      res.status(403).send('Access denied')
    }
  } else {
    res.status(500).send('Server configuration error')
  }
})

// Example endpoint
app.get('/', (req, res) => {
  res.send('Access granted')
})

// Export the Express app as a Firebase Function
exports.app = functions.https.onRequest(app)
