{\rtf1\ansi\ansicpg1252\cocoartf2580
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 const express = require('express');\
const cors = require('cors');\
const \{ ethers \} = require('ethers');\
const crypto = require('crypto');\
const app = express();\
const PORT = process.env.PORT || 3001;\
\
app.use(cors(\{ origin: '*' \})); // Critical for Google Sites\
app.use(express.json());\
\
const usersDB = \{\}; \
const generateNonce = () => `Sign this one-time nonce: $\{crypto.randomBytes(16).toString('hex')\}`;\
\
app.get('/', (req, res) => res.send('FlashSnipe Backend Online'));\
\
app.get('/auth/nonce/:address', (req, res) => \{\
  const nonce = generateNonce();\
  usersDB[req.params.address.toLowerCase()] = \{ nonce \};\
  res.json(\{ nonce \});\
\});\
\
app.post('/auth/verify', async (req, res) => \{\
  const \{ address, signature \} = req.body;\
  const user = usersDB[address.toLowerCase()];\
  if (!user) return res.status(400).json(\{ error: 'No nonce found' \});\
  \
  try \{\
    const recovered = ethers.verifyMessage(user.nonce, signature);\
    if (recovered.toLowerCase() === address.toLowerCase()) \{\
      res.json(\{ success: true, token: 'fs-token-' + Date.now() \});\
    \} else \{\
      res.status(401).json(\{ error: 'Invalid signature' \});\
    \}\
  \} catch (e) \{ res.status(500).json(\{ error: e.message \}); \}\
\});\
\
app.post('/api/bot/toggle', (req, res) => \{\
  res.json(\{ success: true, status: req.body.active ? 'running' : 'stopped' \});\
\});\
\
app.listen(PORT, () => console.log(`Server running on $\{PORT\}`));}
