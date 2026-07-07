import { createServer } from 'node:http'
import startServer from './dist/server/server.js'

const port = Number(process.env.PORT) || 3000

const server = createServer(async (req, res) => {
  try {
    const chunks = []
    for await (const chunk of req) chunks.push(chunk)
    const body = Buffer.concat(chunks)

    const url = `http://${req.headers.host ?? 'localhost'}${req.url ?? '/'}`
    const request = new Request(url, {
      method: req.method,
      headers: req.headers,
      body:
        req.method !== 'GET' && req.method !== 'HEAD' && body.length
          ? body
          : undefined,
    })

    const response = await startServer.fetch(request)
    res.statusCode = response.status
    response.headers.forEach((value, key) => res.setHeader(key, value))
    const buf = Buffer.from(await response.arrayBuffer())
    res.end(buf)
  } catch (err) {
    res.statusCode = 500
    res.end(String(err))
  }
})

server.listen(port, () => {
  console.log(`✅ Garda Bangsa Papua Barat (local) → http://localhost:${port}`)
})
