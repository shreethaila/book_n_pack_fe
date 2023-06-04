import baseurl from "./config";

function Logout() {
    const response = fetch(`${baseurl}/user/logout`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        }).then(response => {
            if (response.status==200){
                console.log("Logged out successfully!!")
            window.location.replace('/')
            }
        });
}

export default Logout;