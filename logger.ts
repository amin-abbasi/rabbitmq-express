import { Request, Response, NextFunction } from 'express'

// Get Duration In Milliseconds
function getDuration(start: [number, number]) {
  const NS_PER_SEC = 1e9
  const NS_TO_MS = 1e6
  const diff = process.hrtime(start)
  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS
}

function logger(req: Request, res: Response, next: NextFunction) {
  console.log(`${req.method} ${req.originalUrl} [STARTED]`)
  const start = process.hrtime()

  res.on('finish', () => {
    const duration = getDuration(start)
    console.log(`${req.method} ${req.originalUrl} [FINISHED] ${duration.toLocaleString()} ms`)
  })

  res.on('close', () => {
    const duration = getDuration(start)
    console.log(`${req.method} ${req.originalUrl} [CLOSED] ${duration.toLocaleString()} ms`)
  })

  next()
}

export default logger
