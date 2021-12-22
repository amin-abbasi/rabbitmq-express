import amqp from 'amqplib'

const q = 'rpc_queue'
amqp.connect('amqp://localhost')
  .then((connection: amqp.Connection) => {
    return connection.createChannel()
  })
  .then((channel: amqp.Channel) => {
    channel.assertQueue(q, { durable: false })
    channel.prefetch(1)
    console.log(" [x] Awaiting RPC Requests")
    channel.consume(q, (message: amqp.ConsumeMessage) => {

      const n = parseInt(message.content.toString())
      console.log(" [.] fib(%d)", n)

      // start
      const tStart = Date.now()
      const result: number = fibonacci(n)

      // finish
      const tEnd = Date.now()

      // to send object as a message,
      // you have to call JSON.stringify
      const sendMessage: string = JSON.stringify({ result, time: (tEnd - tStart) })

      channel.sendToQueue(
        message.properties.replyTo,
        new Buffer(sendMessage),
        { correlationId: message.properties.correlationId }
      )
      channel.ack(message)
    })
  })

// Fibonacci Function
function fibonacci(n: number): number {
  if(!n) n = 1
  return (n === 0 || n === 1) ? n : fibonacci(n - 1) + fibonacci(n - 2)
}