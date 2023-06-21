import { useEffect, useState } from "react";
import baseurl from "../config";
import verifiedgif from '../verifiedgif.gif'
import sorry from '../sorry.gif'
import { Button } from "react-bootstrap";
import '../index.css'
function Verify() {
    const [verified, setverified] = useState(false);
    const checktoken = async () => {
        const queryParams = new URLSearchParams(window.location.search);
        const token = queryParams.get('token');
        const response = await fetch(
            `${baseurl}/user/checktoken/${token}`,
            {
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            }
        ).then((response) => response.json());
        if (response.data.length > 0) {
            setverified(true)
            const response1 = await fetch(
                `${baseurl}/user/updatestatus/${response.data[0].uid}`,
                {
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include'
                }
            ).then((response1) => response1.json());
            console.log(response1);
        }
    }
    useEffect(() => {
        checktoken();
    }, []);
    return (
        <div>
            {
                ((verified) ? (<div className="image-container"><img src={verifiedgif} className="aligned-image" /><br /><Button href="/login" style={{ backgroundColor: '#009999' }}>Login</Button></div>) : (<div className="image-container"><img src={sorry} className="aligned-image" /><br /><h5>Invalid Request</h5></div>))
            }
        </div>
    )
}
export default Verify;