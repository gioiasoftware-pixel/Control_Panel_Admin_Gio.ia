import { spawn } from 'child_process'
import { existsSync } from 'fs'
import { join } from 'path'

const port = process.env.PORT || 4173
const distPath = join(process.cwd(), 'dist')

// Verifica che la cartella dist esista
if (!existsSync(distPath)) {
  console.error(`ERROR: Directory 'dist' not found at ${distPath}`)
  console.error('Please run "npm run build" first.')
  process.exit(1)
}

console.log(`Starting server on port ${port}...`)
console.log(`Serving directory: ${distPath}`)

const serveProcess = spawn('npx', ['serve', '-s', 'dist', '-l', port.toString()], {
  stdio: 'inherit',
  shell: true,
  cwd: process.cwd()
})

serveProcess.on('error', (error) => {
  console.error('Error starting server:', error)
  console.error('Make sure "serve" is installed: npm install serve')
  process.exit(1)
})

serveProcess.on('exit', (code) => {
  if (code !== 0) {
    console.error(`Server exited with code ${code}`)
  }
  process.exit(code || 0)
})

// Gestione segnali per shutdown pulito
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully...')
  serveProcess.kill('SIGTERM')
})

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully...')
  serveProcess.kill('SIGINT')
})


