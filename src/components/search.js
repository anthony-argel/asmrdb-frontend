import {useState, useEffect} from 'react';
import { useParams, Link } from "react-router-dom";

const Search = (props) => {
    const [channels, setChannels] = useState([]);
    let {searchstring} = useParams();

    useEffect(() => {
        if(props.apiURL !== '' && searchstring !== '') {
            let query = searchstring.split('_').join(' ');
            fetch(props.apiURL+'/channel/search?query='+query, {
                method:'GET',
                mode:'cors'
            })
            .then(res => res.json())
            .then(res => {
                setChannels(res.results);
                console.log('done');
            });
        }
    }, [props.apiURL, searchstring]);



    return (
        <div className='container'>
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

export default Search;