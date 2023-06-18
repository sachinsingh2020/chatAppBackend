const http = require("http")
const express = require("express")
const cors = require("cors")
const socketIO = require("socket.io")

const app = express()
const port = 4500 || process.env.PORT

let users = [{}]

app.use(cors())
app.get("/", (req, res) => {
    res.send("hell it's working")
})

const server = http.createServer(app)
const io = socketIO(server)

io.on("connection", (socket) => {
    console.log("New Connection")

    socket.on('joined', ({ user }) => {
        users[socket.id] = user
        console.log(`${user} has Joined`)
        socket.broadcast.emit('userJoined', { user: 'Admin', message: `${users[socket.id]} has Joined` })
        socket.emit('welcome', { user: 'Admin', message: `Welcome to the Chat ${users[socket.id]}` })
    })

    socket.on('message', (data) => {
        io.emit('sendMessage', { user: users[data.id], message: data.message,id:data.id })
    })

    socket.on('disconnect', () => {
        socket.broadcast.emit('leave', { Admin: `${users[socket.id]} has left` })
        console.log(`user has left`)
    })

})

server.listen(port, () => {
    console.log(`server is working on http://localhost:${port}`)
})

