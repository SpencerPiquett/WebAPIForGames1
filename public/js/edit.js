const form = document.getElementById("editForm");
const cancelBtn = document.getElementById("cancelBtn");

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const token = localStorage.getItem("token");

async function loadScore(){
    const res = await fetch(`/api/gameslist/${encodeURIComponent(id)}`, {headers:{ "Authorization":`Bearer ${token}`}});

    const score = await res.json();

    document.getElementById("playername").value = score.playername ?? "";
    document.getElementById("score").value = score.score ?? 0;
    document.getElementById("level").value = score.level ?? "";

}

form.addEventListener("submit", async (e)=>
{
    e.preventDefault();
    
    const playername = document.getElementById("playername").value.trim();
    const score = Number(document.getElementById("score").value);
    const level = Number(document.getElementById("level").value);

    const res = await fetch(`/api/gameslist/${encodeURIComponent(id)}`,
        {
            method:"PUT",
            headers:{"Content-Type":"application/json", "Authorization":`Bearer ${token}`},
            body:JSON.stringify({playername, score, level}),
            
        }
    );

    window.location.href = "/highscores.html";
});

cancelBtn.addEventListener("click", ()=> {
    window.location.href = "/highscores.html"
})

loadScore();