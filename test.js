const tty = require('tty')

process.stdin.setRawMode(true)

process.stdin.on('data', data=>{
    console.log(data[0])
})