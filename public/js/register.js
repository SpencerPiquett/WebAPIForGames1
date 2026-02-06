document.getElementById("regForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    const res = await fetch("/api/auth/register", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({username, password})
    });

    const data = await res.json();
    if(!res.ok)
    {
        document.getElementById("status").textContent = data.error || "Registration Failed";
        return;
    }

    window.location.href = "/login.html";
    
});