fetch("/api/games")
.then(response => response.json())
.then(data => {
    console.log("Received Data: ", data)
    
    document.getElementById("studio").textContent = data.studio;
    document.getElementById("company").textContent = data.company;


    document.getElementById("games").innerHTML = 
    data.games.map(games => `<li>${games}</li>`).join("")
})
.catch(error => {
    console.log("Error fetching data: ", error);
});
