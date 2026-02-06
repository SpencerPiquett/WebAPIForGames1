const { timeStamp } = require("console");
const express = require("express");
const path = require("path");
require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

//Location of Routes
const authRoutes = require("./routes/auth");
const highScoreRoutes = require("./routes/gameslist");

//Set up a static folder for files
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended:false}));
app.use(express.json());


app.use("/api/auth", authRoutes);
//Connecting with a router module - Week 3
app.use("/api/gameslist", highScoreRoutes);


//Quick Test that env Variables are available
if(!MONGO_URI)
{
    console.error("Missing Database Connection");
    process.exit(1);
}

async function connectToMongo()
{
    try 
    {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to Database");
    } 
    catch (error) {
        console.error("MongoDB connection error: ", error.message);
        process.exit(1);
    }
}

//Define a route
app.get("/", (req, res)=>{
    res.send("Hello Doggie, the server is running!");
});

app.get("/fun", (req, res)=> {
    res.send("This is the fun route");
})

app.get("/main", (req, res)=> {
    res.sendFile(path.join(__dirname, "public", "index.html"));
})

app.get("/secondPage", (req, res)=> {
    res.sendFile(path.join(__dirname, "public", "secondPage.html"));
})

//JSON data route
app.get("/api/data", (req,res)=>{
    res.json({
        name:"RocketCrusher333",
        timeStamp:new Date(),
        games:["Dream Theory", "DJ Rave'n", "Music Theory", "Salem's Tower"]
        
        });
})

//JSON via data file
app.get("/api/games", (req, res)=>{
    fs.readFile("data.json", "utf-8", (err, data)=> {
        if(err)
        {
            res.status(500).json({error:"Failed to read data file"});
            return;
        }

        //Send the actual data
        res.json(JSON.parse(data));

    })
});

let leaderboard = [
    {player: "Spencer", score: 1500},
    {player: "Corey", score: 1200},
    {player: "Nate", score: 1000}
]


//Post request example
app.post("/leaderboard", (req, res) => {
    const {player, score} = req.body;

    //basic validation
    if(typeof player != "string" || typeof score != "number")
    {
        return res.status(400).json({
            ok:false,
            error: "Expected JSON body: {player:string, score:number}"
        });
    }

    //Add leader to scoreboard
    leaderboard.push({player, score});

    //Sort the scores
    leaderboard.sort((a,b) => b.score - a.score);

    console.log(leaderboard);
    res.status(201).json({ok:true, leaderboard});
});

//Requests using MongoDB Database and Mongoose
const gameSchema = new mongoose.Schema({},{strict:false});
const VideoGameData = mongoose.model("gameprofiles", gameSchema);

app.get("/api/gamesprofile", async (req, res) => {
    const games = await VideoGameData.find();
    console.log(games);
    res.json(games);
});

app.get("/api/gamesprofile/:game", async (req, res) => {
    const game = req.params                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             .game;
    const gameentry = await VideoGameData.findOne({game});
    console.log(gameentry);
    res.json(gameentry);
});



//Command that starts the server
//app.listen(PORT, ()=>{
//    console.log(`Server is running ${PORT}`);
//});

//Connection with Database and Server
connectToMongo().then(()=>
{
    app.listen(PORT, ()=>{
    console.log(`Server is running ${PORT}`);
});
});