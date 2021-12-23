import express, { Request, Response } from 'express'
import http    from 'http'
import logger  from './logger'
import config  from './config'
import client  from './rpc_client'

const { baseUrl, queue, host, port } = config

const app = express()

app.use(logger)

app.get('/factorial/:number', async function(req: Request, res: Response): Promise<void> {
  try {
    const number: string = req.params.number
    const channel = await client.createClient(baseUrl)
    const message = await client.sendRPCMessage(channel, number, queue)
    const result = JSON.parse(message.toString())
    res.json(result)
  } catch (error: any) {
    console.log('ERROR: ', error)
    res.json(error).status(500)
  }
})

const server: http.Server = http.createServer(app)
server.listen(port, function() {
  console.log(`App started on http://${host}:${port}`)
})
