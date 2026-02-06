const scoreList = document.getElementById("scoreList");
const statusDisplay = document.getElementById("status");
const form = document.getElementById("scoreForm");
const token = localStorage.getItem("token");

if(!token)
{
    window.location.href = "/login.html";
}

console.log(token);

function authHeaders()
{
    return{
        "Content-Type":"application/json",
        "Authorization":"Bearer " + token
    }
}

async function loadScores(){
    scoreList.innerHTML = "";
    statusDisplay.textContent = "Loading Scores...";

    try
    {
        const res = await fetch("/api/gameslist", {headers:{ "Authorization":`Bearer ${token}`}});
        //const res = await fetch("/api/highscores")//, {headers:{ "Authorization":`Bearer ${token}`}});

        if(res.status === 401)
        {
            localStorage.removeItem("token");
            window.location.href = "/login.html";
            return;
        }

        const scores = await res.json(); //Takes the response and converts it to JSON

        if(scores.length === 0) // === is exactly equal to
        {
            statusDisplay.textContent = "No scores available";
            return;
        }

        scores.forEach(score => {
            const li = document.createElement("li");
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.type = "button";


            const editBtn = document.createElement("button");
            editBtn.textContent = "Edit";
            editBtn.type = "button";


            //Add function call
            deleteBtn.addEventListener("click", async ()=>{
                if(!confirm(`Delete ${score.playername}'s score`))
                {
                    return;
                }
                console.log(score._id);
                await deleteScore(score._id);
                loadScores();
            });
            
            editBtn.addEventListener("click", async ()=>{
                window.location.href = `/edit.html?id=${encodeURIComponent(score._id)}`;
            });

            li.textContent = `${score.playername} - ${score.score} - ${score.level} | `;
            li.appendChild(editBtn);
            li.appendChild(deleteBtn);
            scoreList.appendChild(li);
        });

        statusDisplay.textContent = `Loaded ${scores.length} scores`;
    }
    catch(err)
    {
        statusDisplay.textContent = "Failed to load scores";
    }
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const playername = document.getElementById("playername").value;
    const score = document.getElementById("score").value;
    const level = document.getElementById("level").value;

    statusDisplay.textContent = "Submitting new score....";

    try
    {
        await fetch("/api/gameslist", {
            method:"POST",
            //headers:{"Content-Type":"application/json"},
            headers:authHeaders(),
            body:JSON.stringify({playername,score,level})
        });

        form.reset();
        loadScores();
    }
    catch
    {
        statusDisplay.textContent = "Failed to submit score";
    }
});

async function deleteScore(id)
{
    statusDisplay.textContent = "Deleting...";

    const res = await fetch(`/api/gameslist/${id}`, {method:"DELETE"});

    if(!res.ok)
    {
        statusDisplay.textContent = "Delete failed";
    }

    statusDisplay.textContent = "Score Deleted"
}

document.getElementById("logoutBTN").addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "/login.html";
});

loadScores();