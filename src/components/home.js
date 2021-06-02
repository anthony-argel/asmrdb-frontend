import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Homepage = (props) => {
    const [channels, setChannels] = useState([]);
    const [tags, setTags] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState([]);

    useEffect(() => {
        document.title = 'ASMRdb';
    }, []);

    useEffect(() => {
        if(props.apiURL !== '') {
            fetch(props.apiURL+'/channel/latest', {
                method:"GET",
                mode:'cors'
            })
            .then( res => res.json())
            .then( res => setChannels(res.channels));



            fetch(props.apiURL+'/tag/latest', {
                method:"GET",
                mode:'cors'
            })
            .then( res => res.json())
            .then( res => setTags(res.tags));



            fetch(props.apiURL+'/channelrating/latest', {
                method:"GET",
                mode:'cors'
            })
            .then( res => res.json())
            .then( res => setReviews(res.reviews));

            fetch(props.apiURL+'/statistics', {
                method:"GET",
                mode:'cors'
            })
            .then( res => res.json())
            .then( res => setStats(res));
        }
    }, [props.apiURL])

    return (
        <div className='container'>
            <div className='row bg-light mb-3 p-2'> 
                <h1>ASMR Database</h1>
                <hr/>
                <p>The goal of ASMRdb.net is document all ASMR YouTubers. <br/>By collecting them all in one place, ASMR enthusiasts will have an easier time looking for new channels to listen to. This website is built as a wiki, so feel free to add channels, tags, and join in on discussions.</p>
            </div>

            <div className='row bg-light mb-3 p-2'>
                <div className='col-12'>
                    <h2 className='text-center'>Recently Added</h2>
                    <hr/>
                    {channels.length > 0 ? 
                    <div className='row'>
                    {channels.map((value) => {
                        return (        
                            <Link to={'/channel/'+value._id} key={value._id} className='col-4' style={{textDecoration:'none', color:'black'}}>   
                                <div className='card h-100'>
                                    <img src={value.imageurl} className="card-img-top" alt={value.name}></img> 
                                    <div className="card-body">
                                        <h5 className="card-title">{value.name}</h5>
                                        <p className="card-text">Videos: {value.videocount}</p>
                                        {
                                            typeof value.tags !== 'undefined' && value.tags.length > 0 ?
                                                <p>
                                                    {value.tags.map((val, ind) => {
                                                        return <span key={val._id}>{val.tagname}{ind + 1 !== value.tags.length ? ', ' : ' '}</span>
                                                    })}
                                                </p>
                                                :
                                                null
                                        }
                                        
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                    </div>
                    : 
                    <div className="spinner-border text-success" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>}
                </div>
            </div>

            <div className='row bg-light p-2 mb-3'>
                <div className='col-12 col-lg-4'>
                    <h2 className='text-center'>Latest Tags</h2>
                    <hr/>
                        {tags.length > 0 ? 
                            tags.map((value) => {
                                return (
                                <Link key={value._id} to={'/tag/' +value._id +'/1'}>
                                    <p>{value.name}</p>
                                </Link>
                                )
                            })
                        :  
                        <div className="spinner-border text-success" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        }
                </div>
                <div className='col-12 col-lg-4 text-center '>
                    <h2>Latest Reviews</h2>
                    <hr/>
                    {reviews.length > 0 ? 
                    reviews.map(value => {
                        return (
                            <div key={value._id}>
                                <p className='text-start'><Link to={'/channel/'+value.channelid._id}>{value.channelid.name}</Link> - {value.rating}/10</p>
                            </div>
                        )
                    })
                    :
                    null}
                </div>
                <div className='col-12 col-lg-4'>
                    <h2 className='text-center'>Statistics</h2>
                    <hr/>
                    {typeof stats !== 'undefined' ?
                        <div>
                            <p>Users: {stats.users}</p>
                            <p>Channels: {stats.channels}</p>
                            <p>Tags: {stats.tags}</p>
                            <p>Reviews: {stats.reviews}</p>
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

export default Homepage;