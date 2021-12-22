import amqp from 'amqplib'
import EventEmitter from 'events'

// this queue name will be attached to "replyTo" property on producer's message,
// and the consumer will use it to know which queue to the response back to the producer
const REPLY_QUEUE = 'amq.rabbitmq.reply-to'

function send(channel: amqp.Channel, message: amqp.ConsumeMessage | null) {
  channel.emit(message?.properties.correlationId, message?.content)
}

/**
 * Create amqp channel and return back as a promise
 * @params  {String} url
 * @returns {Promise} - return amqp channel
 */
async function createClient(url: string): Promise<amqp.Channel> {
  const connection: amqp.Connection = await amqp.connect(url)
  const channel: amqp.Channel = await connection.createChannel()
  channel.setMaxListeners(0)
  channel.consume(REPLY_QUEUE, (msg: amqp.ConsumeMessage | null) => send(channel, msg) , { noAck: true })
  return channel
}

/**
 * Send RPC message to waiting queue and return promise object when
 * event has been emitted from the "consume" function
 * @params {Object} channel - amqp channel
 * @params {String} message - message to send to consumer
 * @params {String} rpcQueue - name of the queue where message will be sent to
 * @returns {Promise} - return message that send back from consumer
 */
async function sendRPCMessage (channel: amqp.Channel, message: string, rpcQueue: string): Promise<any> {
  return new Promise(resolve => {
    // unique random string
    const correlationId = generateUuid()

    channel.once(correlationId, resolve)
    channel.sendToQueue(rpcQueue, new Buffer(message), { correlationId, replyTo: REPLY_QUEUE })
  })
}

// this function will be used to generate random string to use as a correlation ID
function generateUuid(): string {
  return Math.random().toString() + Math.random().toString() + Math.random().toString()
}

export default { createClient, sendRPCMessage }
