const config = {
  host: 'localhost',
  port: 5000,

  rabbitUrl : 'amqp://localhost',
  queue     : 'rpc_queue',

  // this queue name will be attached to "replyTo" property on producer's message,
  // and the consumer will use it to know which queue to the response back to the producer
  replyTo : 'amq.rabbitmq.reply-to',
}

export default config
