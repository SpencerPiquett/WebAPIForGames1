const { timeStamp } = require("console");
const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const PORT = 3000;

//Set up a static folder for files
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());


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



app.listen(PORT, ()=>{
    console.log(`Server is running ${PORT}`);
});