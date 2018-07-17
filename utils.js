function handleShell (shell, socket) {
  function fn (cmd) {
    return new Promise((resolve, reject) => {
      shell.exec(cmd, {silent: true}, (code, stdout, stderr) => {
        socket.emit('status', { code, stdout, stderr, cmd })
        if (code !== 0 && stderr) {
          shell.exit(1)
          reject(stderr)
        }
        resolve(stdout)
      })
    })
  }
  return fn
}

module.exports = {
  handleShell
}