import { Request, Response, NextFunction } from 'express'
import './color'

// Get Duration In Milliseconds
function getDuration(start: [number, number]): number {
  const NS_PER_SEC = 1e9
  const NS_TO_MS = 1e6
  const diff: [number, number] = process.hrtime(start)
  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS
}

// Set StatusCode Color
function setStatusColor(code: number): string {
  if(code >= 200 && code < 300) return code.toString().color('green')
  if(code >= 300 && code < 400) return code.toString().color('cyan')
  if(code >= 400 && code < 500) return code.toString().color('yellow')
  return code.toString().color('red')
}

// Logger Middleware
function logger(req: Request, res: Response, next: NextFunction): void {
  const start: [number, number] = process.hrtime()
  res.on('close', () => {
    const duration: number = getDuration(start)
    const time: string = duration.toLocaleString().color('magenta')
    const method: string = req.method.color('blue').bold()
    const url: string = req.originalUrl.color('gray')
    const statusCode: string = setStatusColor(res.statusCode)
    const text = `${method} ${url} ${statusCode} ${time} ms`
    console.log(text)
  })

  next()
}

export default logger
