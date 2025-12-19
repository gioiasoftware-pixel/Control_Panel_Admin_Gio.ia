import { spawn } from 'child_process'

const port = process.env.PORT || 4173
const serveProcess = spawn('npx', ['serve', '-s', 'dist', '-l', port.toString()], {
  stdio: 'inherit',
  shell: true
})

serveProcess.on('error', (error) => {
  console.error('Error starting server:', error)
  process.exit(1)
})

serveProcess.on('exit', (code) => {
  process.exit(code || 0)
})
