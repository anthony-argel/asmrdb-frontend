import {Link} from 'react-router-dom';

const ChannelList = (props) => {
    return (
        <div className='container'>
            <div className='row bg-light p-2 mb-4'>
                <div className='col'>
                    <h1 className='text-center'>{props.title}</h1>
                    <hr/> 
                    {props.channels.length > 0 ? 
                        props.channels.map((value, index) => {
                            return (         
                                <Link to={'/channel/'+value._id} key={value._id} style={{textDecoration:'none', color:'black'}}>   
                                    <div> 
                                        <p className='fs-1'>{value.name}</p>
                                        <p>Videos: {value.videocount}</p>
                                        <p>Tags: {value.tags.map((tagvals, index) => {
                                            return (
                                                <span key={tagvals._id}>{tagvals.tagname}{index + 1 !== value.tags.length ? ', ' : null}</span>
                                            )
                                        })}</p>
                                    </div>
                                    {index + 1 !== props.channels.length ? <hr/> : null}
                                </Link>
                            )
                        })
                    :
                    <div>
                        <p>No matches found</p>
                    </div>
                    }
                </div>
            </div>


        </div>
    )
}

export default ChannelList;