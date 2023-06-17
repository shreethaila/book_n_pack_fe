import baseurl from "./config";

function Logout() {
    // if (window.confirm("Are you sure want to Logout?")){
        const response = fetch(`${baseurl}/user/logout`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        }).then(response => {
            if (response.status==200){
                console.log("Logged out successfully!!")
                window.location.replace('/')
            }
        });
    // }else{
    //     window.location.replace('/')
    // }
}

export default Logout;