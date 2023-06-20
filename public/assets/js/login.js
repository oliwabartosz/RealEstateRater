const refreshKey = async () => {

}

const sendLogin = async() => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    try {
        const response = await fetch( 'http://localhost:3000/rer/auth/', {
            method: 'POST',
            headers: {'Content-Type': 'application/json',},
            credentials: 'include',
            body: JSON.stringify({username:username, password:password})
        });

        if (!response.ok) {
            if (response.status === 401) {

            }
        }

        return await response.json();
    } catch(err) {
        console.log(err.stack);
    }
}