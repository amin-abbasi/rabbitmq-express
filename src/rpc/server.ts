import amqp   from 'amqplib'
import config from '../config'

const { rabbitUrl, queue } = config

// Factorial Function
function factorial(n: number): number {
  if(!n || n <= 1) return 1
  return n * factorial(n - 1)
}

// Initiate AMQP Channel
(async () => {
  const connection: amqp.Connection = await amqp.connect(rabbitUrl)
  const channel: amqp.Channel = await connection.createChannel()

  channel.assertQueue(queue, { durable: false /**, autoDelete: true */ })
  channel.prefetch(1)
  console.log('<<<< RPC Server is Running >>>>')
  console.log(' [x] Awaiting RPC Requests')

  channel.consume(queue, (msg: amqp.ConsumeMessage | null) => {

    const number: number = parseInt(msg?.content.toString('utf8')) || 1
    console.log(' [.] fac(%d)', number)

    // start
    const tStart: number = Date.now()
    const fac: number = factorial(number)

    // finish
    const tEnd: number = Date.now()

    // to send object as a message, you have to call JSON.stringify
    const sendMessage: string = JSON.stringify({ fac, times: { tStart, tEnd, diff: (tEnd - tStart) } })
    channel.sendToQueue(msg?.properties.replyTo, Buffer.from(sendMessage),
      { correlationId: msg?.properties.correlationId }
    )
    channel.ack(msg as amqp.Message)
  })
})()
