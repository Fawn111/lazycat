require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const chatRoutes = require('./routes/chats')

const app = express()

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:4173',
    /\.vercel\.app$/,   // any *.vercel.app domain
  ],
  credentials: true,
}))
app.use(express.json())

// Routes
app.use('/api/chats', chatRoutes)

app.get('/health', (req, res) => res.json({ status: 'ok' }))

// Connect to MongoDB then start server
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected')
    const PORT = process.env.PORT || 5000
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`))
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message)
    process.exit(1)
  })
