import express, { Application } from "express";


const app:Application = express();

app.get('/', (req,res)=>{
    res.send("Hi I am Prisma Server, And , Welcome all of you, I hope We are well , and, i am fine , Today I will talk fron of you about political promblem in bangladesh")
})

export default app;