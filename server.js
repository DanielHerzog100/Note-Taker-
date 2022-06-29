const express = require("express")
const {v4: uuid} = require("uuid");
const path = require("path")
const fs = require("fs")

const {
    PORT=3000
} = process.env

const app = express()

app.use(express.static(path.join(__dirname, "public")))
app.use(express.json())
app.use(express.urlencoded({
    extended:true
}))

app.get("/api/notes",(req,res) => {
    const db = fs.readFileSync(path.join(__dirname, "db/db.json"))
    const dbInfo = JSON.parse(db)
    res.json(dbInfo)
})
app.post("/api/notes",(req,res) => {
    const {title,text} = req.body
    const db = fs.readFileSync(path.join(__dirname, "db/db.json"))
    const dbInfo = JSON.parse(db)
    const newTask = {
        title,
        text,
        id: uuid()
    } 
    dbInfo.push(newTask)
    fs.writeFileSync(path.join(__dirname, "db/db.json"), JSON.stringify(dbInfo, null, 2))
    res.json(newTask)
})
app.delete("/api/notes/:id", (req,res) => {
    const {id} = req.params
    const db = fs.readFileSync(path.join(__dirname, "db/db.json"))
    let dbInfo = JSON.parse(db)
    dbInfo = dbInfo.filter((task)=> {
        return task.id != id
    })
    fs.writeFileSync(path.join(__dirname, "db/db.json"), JSON.stringify(dbInfo, null, 2))
    res.sendStatus(200)
})

app.get("/notes",(req,res) => {
    res.sendFile(path.join(__dirname, "public/notes.html"))
})
app.get("*",(req,res) => {
    res.sendFile(path.join(__dirname, "public/index.html"))
})

app.listen(PORT, () => {
    console.log("server listening on port " + PORT)
})