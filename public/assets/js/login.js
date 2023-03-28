const sendLogin = async() => {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    try {
        const response = await fetch('http://localhost:3000/re/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json',},
            credentials: 'include',
            body: JSON.stringify({user, pass})
        });
        console.log(response.body)
        return await response.json();
    } catch(err) {
        console.log(err.stack);
    }
}