import { useEffect, useState } from "react";
import { Redirect } from "react-router";

const ChannelForm = (props) => {
    const [status, setStatus] = useState('Active');
    const [niconico, setNiconico] = useState('');
    const [youtube, setYoutube] = useState();
    const [twitter, setTwitter] = useState();
    const [redirecting, setRedirecting] = useState(false);
    const [redirectURL, setRedirectURL] = useState('');
    const [token, setToken] = useState('');
    const [errors, setErrors] = useState(false);

    useEffect(() => {
        document.title = 'Channel Form | ASMRdb';
        if(localStorage.getItem('token') !== null) {
            setToken(localStorage.getItem('token'));
        }

    }, [])

    function addChannel(e) {
        e.preventDefault();
        if(props.apiURL !== '' && token !== '') {
            fetch(props.apiURL+'/channel', {
                method: 'POST',
                mode:'cors',
                body: JSON.stringify({status, niconico, youtube, twitter}),
                headers: { 'Content-Type': 'application/json',
                'Authorization' : 'Bearer ' + token },
            })
            .then(res => {
                if(res.status !== 400) {
                    return res.json()
                }
                else {
                    setErrors(true);
                }
            })
            .then(res => {
                if(typeof res !== 'undefined') {
                    setRedirectURL('/channel/'+res.channelid[0]._id);
                }
            });
        }
    }

    useEffect(() => {
        if(redirectURL !== '') {
            setRedirecting(true);
        }
    }, [redirectURL]);



    return (
        <div className='container'>
            {redirecting === true ? <Redirect to={redirectURL}/>: null}
            <div className='row d-flex justify-content-center'>
                <div className='col-6 bg-light p-2'>
                    <h1 className='text-center'>Channel Form</h1>
                    <form onSubmit={e => addChannel(e)}>
                        <label htmlFor="youtube-url" className="form-label">YouTube URL</label>
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="basic-addon3">https://www.youtube.com/channel/</span>
                            <input type="text" required className="form-control" id="youtube-url" aria-describedby="basic-addon3" onChange={e=>setYoutube(e.target.value)}/>
                        </div>




                        <label htmlFor='status'>YouTube Status:</label>
                        <select className="form-select" aria-label="Activity Select" required id='status' onChange={e => setStatus(e.target.value)}>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="Unknown">Unknown</option>
                        </select>


                        <hr/>
                        <p>Optional Socials:</p>




                        <label htmlFor="twitter" className="form-label">Twitter:</label>
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="basic-addon3">@</span>
                            <input type="text" className="form-control" id="twitter" aria-describedby="basic-addon3" onChange={e => setTwitter(e.target.value)}/>
                        </div>


                        <label htmlFor="nnd" className="form-label">Niconico:</label>
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="basic-addon3">https://ch.nicovideo.jp/</span>
                            <input type="text" className="form-control" id="nnd" aria-describedby="basic-addon3" onChange={e => setNiconico(e.target.value)}/>
                        </div>
                        <button type="submit" className="btn btn-success mt-3">Add Channel</button>
                    </form>
                    {errors === true ? 'Something went wrong. Please check your input' : null}
                </div>
            </div>
        </div>
    )
}

export default ChannelForm;