const refreshKey = async () => {

}

const sendLogin = async() => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    try {
        const response = await fetch('http://localhost:3000/re/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json',},
            credentials: 'include',
            body: JSON.stringify({username, password})
        });
        console.log(response.body)
        return await response.json();
    } catch(err) {
        console.log(err.stack);
    }
}