import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const Tag = (props) => {
    let {id} = useParams();
    const [channels, setChannels] = useState([]);
    const [tag, setTag] = useState();

    useEffect(() => {
        if(props.apiURL !== '') {
            fetch(props.apiURL+'/tag/'+id+'/channels', {
                method: 'GET',
                mode:'cors'
            })
            .then(res => res.json())
            .then(res => {setChannels(res.channels); setTag(res.tag)});
        }
    }, [props.apiURL, id])

    useEffect(() => {
    }, [channels]);

    useEffect(() => {
        if(typeof tag !== 'undefined' && tag.name !== '') {
            document.title = tag.name + " | ASMRdb";
        }
    }, [tag]);

    

    return (
        <div className='container'>
            <div className='row bg-light p-2'>
                <h1 className='text-center'>Tag: {typeof tag !== 'undefined' && tag.name !== '' ? tag.name : null}</h1>
                <hr/>
            </div>
            <div className='row row-cols-1 row-cols-md-4 bg-light p-2 g-4'>
                {channels.length > 0 ? 
                    channels.map((value) => {
                        return (         
                            <Link to={'/channel/'+value._id} key={value._id} className='col' style={{textDecoration:'none', color:'black'}}>   
                                <div className='card h-100'> 
                                    <img src={value.imageurl} className="card-img-top" alt="YouTube profile" style={{width: "100%"}}/>
                                    <div className="card-body">
                                        <h5 className="card-title">{value.name}</h5>
                                        <p className="card-text">Videos: {value.videocount}</p>
                                        
                                    </div>
                                </div>
                            </Link>
                        )
                    })
                    :
                    <div className="spinner-border text-success" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    }
            </div> 
                
        </div>
    )
}

export default Tag;