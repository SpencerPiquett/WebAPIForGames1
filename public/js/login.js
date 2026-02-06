document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    const res = await fetch("/api/auth/login", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({username, password})
    });

    const data = await res.json();
    if(!res.ok)
    {
        document.getElementById("status").textContent = data.error || "Login Failed";
        return;
    }

    localStorage.setItem("token", data.token);

    window.location.href = "/highscores.html";
    
});