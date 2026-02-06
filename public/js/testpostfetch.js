fetch("/api/highscores", {
    method:"post",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({playername:"Spencer", score:1000, level:2})
})