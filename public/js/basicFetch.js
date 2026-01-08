fetch("/api/data")
.then(response => response.json())
.then(data => {
    console.log("Received Data: ", data)
    
    document.getElementById("name").textContent = data.name;
    document.getElementById("time").textContent = data.timeStamp;


    document.getElementById("games").innerHTML = 
    data.games.map(games => `<li>${games}</li>`).join("")
})
.catch(error => {
    console.log("Error fetching data: ", error);
});
