import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Channels = (props) => {
    const [channels, setChannels] = useState([]);

    useEffect(() => {
        if(props.apiURL !== '') {
            fetch(props.apiURL+'/channel',{
                method: 'GET',
                mode: 'cors'
            })
            .then(res => {
                if(res.status !== 400) {
                    return res.json();
                }
            })
            .then(res => setChannels(res.channels));
        }
    }, [props.apiURL])

    return (
        <div className='container'>
            <div className='row bg-light p-3'>
                <div className='col-12 p-0'>
                    {channels.length > 0 ? 
                    <div className='card-group'>
                    {channels.map((value) => {
                        return (         
                            <Link to={'/channel/'+value._id} className='card w-25' style={{textDecoration:'none', color:'black'}}>   
                                <div > 
                                    <img src={value.imageurl} className="card-img-top" alt="YouTube profile" style={{width: "100%"}}/>
                                    <div className="card-body">
                                        <h5 className="card-title">{value.name}</h5>
                                        <p className="card-text">Videos: {value.videocount}</p>
                                        
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                    </div>
                    :
                    <div className="spinner-border text-success" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    }
                </div>

            </div>
        </div>
    )
}

export default Channels;