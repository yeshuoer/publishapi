function handleShell (shell, socket) {
  function fn (cmd) {
    let exec = shell.exec(cmd)
    if (exec.code !== 0) {
      socket.emit('status', {
        code: exec.code,
        stdout: exec.stdout,
        stderr: exec.stderr
      })
      shell.exit(1)
      // console.log('err......' + cmd + '\n', exec)
      socket.disconnect(true)
    } else {
      // console.log('output.......' + cmd + '\n', exec)
      socket.emit('status', {
        code: exec.code,
        stdout: exec.stdout,
        stderr: exec.stderr
      })
      socket.emit('status', {
        hehe: 'sync'
      })
    }
  }
  return fn
}

module.exports = {
  handleShell
}