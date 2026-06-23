const express = require('express')
const router = express.Router()
const Chat = require('../models/Chat')

// GET all chats for a user
router.get('/:email', async (req, res) => {
  try {
    const chats = await Chat.find({ userEmail: req.params.email })
      .select('-messages') // don't send messages in list view
      .sort({ updatedAt: -1 })
    res.json(chats)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET single chat with messages
router.get('/:email/:chatId', async (req, res) => {
  try {
    const chat = await Chat.findOne({
      _id: req.params.chatId,
      userEmail: req.params.email,
    })
    if (!chat) return res.status(404).json({ error: 'Chat not found' })
    res.json(chat)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST create new chat
router.post('/:email', async (req, res) => {
  try {
    const chat = await Chat.create({
      userEmail: req.params.email,
      title: req.body.title || 'New chat',
    })
    res.status(201).json(chat)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PATCH update chat title / starred
router.patch('/:email/:chatId', async (req, res) => {
  try {
    const update = {}
    if (req.body.title !== undefined) update.title = req.body.title
    if (req.body.starred !== undefined) update.starred = req.body.starred
    update.updatedAt = new Date()

    const chat = await Chat.findOneAndUpdate(
      { _id: req.params.chatId, userEmail: req.params.email },
      { $set: update },
      { new: true }
    ).select('-messages')

    if (!chat) return res.status(404).json({ error: 'Chat not found' })
    res.json(chat)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE chat
router.delete('/:email/:chatId', async (req, res) => {
  try {
    await Chat.findOneAndDelete({
      _id: req.params.chatId,
      userEmail: req.params.email,
    })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST append messages to a chat
router.post('/:email/:chatId/messages', async (req, res) => {
  try {
    const { messages } = req.body // array of { role, content }
    const chat = await Chat.findOneAndUpdate(
      { _id: req.params.chatId, userEmail: req.params.email },
      {
        $push: { messages: { $each: messages } },
        $set: { updatedAt: new Date() },
      },
      { new: true }
    ).select('-messages')

    if (!chat) return res.status(404).json({ error: 'Chat not found' })
    res.json(chat)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
