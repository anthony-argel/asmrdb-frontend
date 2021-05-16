import {Link} from 'react-router-dom';

const ChannelList = (props) => {
    return (
        <div className='container'>
            <div className='row bg-light p-2 mb-4'>
                <div className='col'>
                    <h1 className='text-center'>{props.title}
                    {typeof props.totalresults !== 'undefined' && props.totalresults !== '' ? <span className='fs-5'> ~{props.totalresults} result(s) found</span> : null}</h1>
                    <hr/> 
                    {props.channels.length > 0 ? 
                        props.channels.map((value, index) => {
                            return (         
                                <Link to={'/channel/'+value._id} key={value._id} style={{textDecoration:'none', color:'black'}}>   
                                    <div className='lh-1'> 
                                        <p className='fs-4 fw-bold'>{value.name}</p>
                                        <p>Videos: {value.videocount}</p>
                                        <p>Tags: {value.tags.map((tagvals, index) => {
                                            return (
                                                <span key={tagvals._id}>{tagvals.tagname}{index + 1 !== value.tags.length ? ', ' : ' '}</span>
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


        <nav aria-label="Page navigation example">
        <ul className="pagination justify-content-center">
            {
                props.startpos === '1' ?
                <li className="page-item disabled" >
                <Link className="page-link" to={`${props.pageurl}${parseInt(props.startpos) - 1}`} tabIndex="-1" aria-disabled="true">&lt;&lt;</Link>
                </li> :
                <li className="page-item">
                <Link className="page-link" to={`${props.pageurl}${parseInt(props.startpos) - 1}`} tabIndex="-1" aria-disabled="true">&lt;&lt;</Link>
                </li>
            }{
                props.startpos === '1' ? 
                <li className="page-item" ><Link className="page-link" style={{background: "#0d6efd", color:"#fff"}} to={`${props.pageurl}1`}>1</Link></li> :
                <li className="page-item"><Link className="page-link" to={`${props.pageurl}1`}>1</Link></li>
            }
            {props.pages >= 2 ? 
            [...Array(props.pages)].map((value, ind) => {
                if(ind === 0) return null;
                return (
                    ind + 1=== parseInt(props.startpos) ? 
                        <li className="page-item" 
                        key={ind}><Link className="page-link" to={`${props.pageurl}${ind + 1}`} style={{background: "#0d6efd", color:"#fff"}}>{ind + 1}</Link></li> : 

                        <li className="page-item" 
                        key={ind}><Link className="page-link" to={`${props.pageurl}${ind + 1}`}  >{ind + 1}</Link></li>
                )
            })
            :
            null
            }
            {
                parseInt(props.startpos) + 1 <= props.pages ?
                <li className="page-item">
                <Link className="page-link" to={`${props.pageurl}${parseInt(props.startpos) + 1}`}>&gt;&gt;</Link>
                </li>
                :
                <li className="page-item disabled">
                <Link className="page-link" to={`${props.pageurl}${parseInt(props.startpos) + 1}`} tabIndex="-1" aria-disabled="true">&gt;&gt;</Link>
                </li>
            }
        </ul>
        </nav>

        </div>
    )
}

export default ChannelList;