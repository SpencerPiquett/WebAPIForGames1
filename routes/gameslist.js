const express = require("express");
const HighScore = require("../models/GamesList");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

//All routes below require login
router.use(requireAuth);

//Post route for adding player scores
router.post("/", async(req, res) => {
    try
    {
        const userId = req.user.sub;

        const {playername, score, level} = req.body;

        const createdScore = await HighScore.create({userId, playername, score, level})
        //const createdScore = await HighScore.create({playername, score, level})

        res.status(201).json({ok:true, createdScore});
    }
    catch(err)
    {
        res.status(400).json({ok:false, error: "Invalid High Score"});
    }
});

//Get route for requesting data from database
router.get("/", async (req, res)=>{
    
    try
    {
        
        const userId = req.user.sub;
        console.log("fetching scores", req.user.sub);
        //const scores = await HighScore.find(userId).sort({score:-1, createdAt:1}).limit(10);
        const scores = await HighScore.find({userId})
        .sort({score:-1, createdAt:1})
        .limit(10);

        console.log("scores:" +scores);
        res.json(scores);
    }
    catch(err)
    {
        res.status(500).json({ok:false, error:"Failed to fetch highscores"});
    }
});

//Delete route (Deletes by id)
router.delete("/:id", async (req,res) => {
    try
    {
        const userId = req.user.sub;
        console.log(userId);
        const {id} = req.params;
        const deleted = await HighScore.findByIdAndDelete({_id:id, userId});

        if(!deleted)
        {
            return res.status(404).json({ok:false, error:"Score not found"});
        }

        res.json({ok:true, deletedID:id});
    }
    catch(err)
    {
        res.status(400).json({ok:false, error:"Delete failed"});
    }
}) //: means to pass a parameter to the url

//Get route for the edit page

router.get("/:id", async (req, res) => {
    console.log("fetch for edit");
    
    try
    {
        console.log(req.params);
        const score = await HighScore.findById(req.params.id);
        console.log(score);

        if(!score)
        {
            return res.status(404).json({ok:false, error:"Not Found"})
        }
        console.log(score);
        res.json(score);

    }
    catch
    {

        return res.status(404).json({ok:false, error:"Invalid Id"})
    }
});

router.put("/:id", async(req,res) => {
    try
    {
        const userId = req.user.sub;

        //Update High Score Entry
        const {id} = req.params;

        //Only allow expected fields
        const payload = {};

        if(typeof req.body.playername === "string")
        {
            payload.playername = req.body.playername;
        }

        if(typeof req.body.score === "number")
        {
            payload.score = Number(req.body.score);
        }

        if(typeof req.body.level === "number")
        {
            payload.level = Number(req.body.level);
        }

        const updatedEntry = await HighScore.findByIdAndUpdate({_id:id, userId}, payload, {
            new: true,
            runValidators: true,
        });

        if(!updatedEntry)
        {
            return res.status(404).json({ok:false, error:"Score Entry Not Found"})
        }
        res.json({ok:true, updatedEntry});
    }
    catch(err)
    {
        return res.status(400).json({ok:false, error:"Update Failed"})
    }
});



module.exports = router;