declare module '../dist/server/server.js' {
  const server: {
    fetch: (request: Request, context?: unknown) => Response | Promise<Response>
  }
  export default server
}
