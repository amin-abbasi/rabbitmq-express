import express from 'express'
import http    from 'http'
import amqpClient from './amqp_client'

const app = express()

const url = 'amqp:localhost'

app.get('/fibonacci/:number', async function(req, res) {
  try {
    const number: string = req.params.number
    const channel = await amqpClient.createClient(url)
    const message = await amqpClient.sendRPCMessage(channel, number, 'rpc_queue')
    const result = JSON.parse(message.toString())
    res.json(result)
  } catch (error: any) {
    res.json(error).status(500)
  }
})

const server: http.Server = http.createServer(app)
server.listen(5000, function() {
  console.log('App started on http://localhost:5000')
})
