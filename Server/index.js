import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import AuthRoutes from './routes/AuthRoutes.js'
import contectRoutes from './routes/ContectRoutes.js'
import SetupSocket from './socket.js'
import messagesRoutes from './routes/MessagesRoutes.js'
import channelRoutes from './routes/ChannelRoutes.js'

dotenv.config();
const app = express()
const port = process.env.PORT || 3000;
const databaseURL=process.env.DATABASE_URL;

if (!databaseURL) {
    console.error("DATABASE_URL is not defined in the .env file.");
    process.exit(1);
}
mongoose.connect(databaseURL)
    .then(() => console.log("DB is Connected"))
    .catch(err => console.error("DB Connection Error:", err));
    
app.use(cors({
    origin:[process.env.origin],
    methods:["GET",'POST','PATCH','DELETE',"PUT"],
    credentials:true
}))

app.use('/uploads/profiles',express.static("uploads/profiles"))
app.use('/uploads/files',express.static("uploads/files"))

app.use(cookieParser());
app.use(express.json());

app.use('/api/auth',AuthRoutes);
app.use('/api/contects',contectRoutes);
app.use('/api/messages',messagesRoutes);
app.use('/api/channel',channelRoutes);

app.get('/', (req, res) => res.send('Hello World!'))
const server=app.listen(port, () => console.log(`Chat app listening on port ${port}!`))
SetupSocket(server)

