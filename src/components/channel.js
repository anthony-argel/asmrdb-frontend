import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {FaTwitter, FaYoutube} from 'react-icons/fa';
import {MdClose} from 'react-icons/md'
import {DateTime} from 'luxon';

function Channel(props) {
    let {id} = useParams();
    const [token, setToken] = useState('');
    const [channel, setChannel] = useState();
    const [comment, setComment] = useState('');
    const [commentList, setCommentList] = useState([]);


    const [rating, setRating] = useState(0);
    const [numberOfRaters, setNumberOfRaters] = useState(0);
    const [userid, setUserId] = useState();
    const [personalReviewData, setPersonalReviewData] = useState();

    const [formRating, setFormRating] = useState();
    const [formReview, setFormReview] = useState();

    const [requestingRefresh, setRequestingRefresh]  = useState(false);

    const refreshComments = () => {
        if(props.apiURL !== '') {
            fetch(props.apiURL+'/comment/'+id, {
                method: 'GET',
                mode: 'cors'
            })
            .then(res => {
                if(res.status === 200) {
                    return res.json();
                }
            })
            .then(res=>{
                setCommentList(res.comments)})
        }
    }

    useEffect(() => {
        if(localStorage.getItem('token') !== null) {
            setToken(localStorage.getItem('token'));
        }
        if(localStorage.getItem('id') !== null) {
            setUserId(localStorage.getItem('id'));
        }
    }, []);

    useEffect(() => {
        if(props.apiURL !== '') {
            fetch(props.apiURL+"/channel/"+id+'/all', {
                method: 'GET',
                mode: 'cors'
            })
            .then(res => res.json())
            .then(res => {
                document.title = res.channel.name;
                setChannel(res.channel);
                let reviews = res.ratings;
                let avgRating = 0;
                for(let i = 0; i < reviews.length; i++) {
                    avgRating += reviews[i].rating;
                
                    if(typeof userid !== 'undefined' && userid === reviews[i].raterid) {
                        setPersonalReviewData(reviews[i]);
                    }
                }
                setRating(avgRating / reviews.length);
                setNumberOfRaters(reviews.length);
                setCommentList(res.comments);
            });
        }
    }, [props.apiURL, id, userid, requestingRefresh]);

    useEffect(() => {
    }, [channel])

    const postComment = (e) => {
        e.preventDefault();
        if(props.apiURL !== '') {
            fetch(props.apiURL+"/comment", {
                method: 'POST',
                body: JSON.stringify({channelid: id, comment:comment}),
                headers: { 'Content-Type': 'application/json',
                'Authorization' : 'Bearer ' + token },
                mode: 'cors'
            })
            .then(res => {
                if(res.status === 200) {
                    refreshComments();
                }
            })
        }
    }

    const deleteComment = (id, authorid) => {
        if(props.apiURL !== '') {
            fetch(props.apiURL+'/comment',{
                method: 'DELETE',
                body: JSON.stringify({
                    authorid: authorid,
                    commentid: id,
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : 'Bearer ' + token},
                mode: 'cors'
            })
            .then(res => {
                if(res.status === 200) {
                    refreshComments();
                }
            })
        }
    }

    const submitReview = (e) => {
        e.preventDefault();
        let sendRating = 0;
        let sendReview = ' ';
        if(typeof formRating === 'undefined') {
            if(typeof personalReviewData !== 'undefined') {
                sendRating = personalReviewData.rating;
            }
        } else {
            sendRating = formRating;
        }

        if(typeof formReview === 'undefined') {
            if(typeof personalReviewData !== 'undefined') {
                sendReview = personalReviewData.review;
            }
        } else {
            sendReview = formReview;
        }

        fetch(props.apiURL+"/channelrating/"+id, {
            method: 'POST',
            body: JSON.stringify({
                rating: sendRating,
                review: sendReview
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : 'Bearer ' + token},
            mode: 'cors'
        })
        .then( res => {
            if(res.status === 200) {
                setRequestingRefresh(!requestingRefresh);
            }
        }
        );
    }

    const deleteReview = () => {
        alert('kappa');
    }

    return (
        <div className='container'>
            
            {/* header */}
            <div className='row'>
                <div className='bg-light col-12 col-lg-4 d-flex justify-content-center p-3' style={{backgroundColor:'green'}}>
                    {typeof channel === 'undefined' ?  
                    null : 
                    <img src={channel.imageurl} alt='channel profile' style={{borderRadius:"50%"}}></img>}
                </div>
                <div className='bg-light col-12 col-lg-8 p-3' style={{backgroundColor:'green'}}>
                    {typeof channel === 'undefined' ?  
                    <div className="spinner-border text-success" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                  : 
                        <div>
                            <h1>{channel.name}</h1>
                            {typeof channel.aliases !== 'undefined' && channel.aliases !== channel.name ? <h3>Alias: {channel.aliases}</h3> : null}
                            <p>Status: {channel.status}</p>
                            <p>Tags: TO-DO</p>
                            <div className='socials'>
                            {typeof channel === 'undefined' ?  <p>Loading</p> : 
                               <a href={'https://twitter.com/'+channel.twitter} target="_blank" rel="noopener noreferrer" ><FaTwitter size='2em'/></a>}
                            <a href={'https://www.youtube.com/channel/'+channel.youtube} target="_blank" rel="noopener noreferrer" ><FaYoutube color='red' size='2em'/></a>

                            </div>
                            </div>}  
                </div>
            </div>

            {/* stats */}
            <div className='row mt-3 bg-light' style={{minHeight:'25vh'}}>
                <div className='col-12  col-lg-4  p-3 d-flex flex-column  align-items-center'>
                    <p>Most Popular Video</p>
                    <div className="embed-responsive embed-responsive-1by1">
                      <iframe title='channelvideo' className="embed-responsive-item" src="https://www.youtube.com/embed/KQY9zrjPBjo" allowFullScreen></iframe>
                    </div>
                </div>
                <div className='col-12 col-lg-8 p-3'>
                    <p className='text-center'>Statistics</p>
                    {typeof channel === 'undefined' ? null :
                        <div>
                            <p>Channel View Count: {channel.viewcount}</p>
                            <p># Uploaded Videos: {channel.videocount}</p>
                        </div>
                    }
                    <p>Rating: {rating.toFixed(1)}/10 (votes: {numberOfRaters})</p>
                    <p>Your Rating: {typeof personalReviewData === 'undefined' ? '-' : <span>{personalReviewData.rating}<MdClose cursor='pointer' color='red' size='1.5em' onClick={() => deleteReview()}/></span>}</p> 
                    <button type="button" className="btn btn-success" data-bs-toggle='modal' data-bs-target='#reviewForm'>
                    {typeof personalReviewData === 'undefined' ? 'Add Review' : 'Edit Review'}</button>
                </div>

            </div>




            {/* Modal Review */}
            <div className="modal fade" id="reviewForm" tabIndex="-1" aria-labelledby="reviewFormLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="reviewFormLabel">Review</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={(e) => submitReview(e)}>
                            <div className="mb-3">
                                <label htmlFor="reviewRating" className="form-label">Rating</label>
                                <div className='input-group'>
                                    {typeof personalReviewData === 'undefined' ? <input type="number" className="form-control" id="reviewRating" required onChange={e => setFormRating(e.target.value)} placeholder="0-10" min='0' max='10'/> : 
                                    <input type="number" className="form-control" id="reviewRating" required onChange={e => setFormRating(e.target.value)} placeholder="7" defaultValue={personalReviewData.rating} min='0' max='10'/>}
                                    
                                    <span className="input-group-text" id="basic-addon2">/10</span>
                                </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="reviewText" className="form-label">Review</label>
                                {typeof personalReviewData === 'undefined' ? <textarea className="form-control" id="reviewText" onChange={e => setFormReview(e.target.value)} rows="3" placeholder='optional'></textarea> : 
                                <textarea className="form-control" id="reviewText" onChange={e => setFormReview(e.target.value)} rows="3" placeholder='optional' defaultValue={personalReviewData.review}></textarea>}
                                
                            </div>
                            <button type="button mt-3 float-end" className="btn btn-primary" >Post Review</button>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                    </div>
                </div>
            </div>
















            {/* comment section */}
            <div className='row mt-3 mb-3'>
                <div className='col-12 bg-light' style={{backgroundColor:'green'}}>
                    <form onSubmit={postComment}>
                        <label htmlFor='comment-form' className='form-label mt-3'>Add a comment</label>
                        <textarea className='form-control mb-3' id='comment-form' rows='3' onChange={e => setComment(e.target.value)}/>
                        <button type='submit' className='btn btn-primary'>Submit</button>
                    </form>
                    <hr/>
                    <p className='fs-2 text-center'>Comments</p>
                    <div className='comment-area'>
                        {typeof commentList !== 'undefined' && commentList.length > 0 ? 
                        commentList.map((value, index) => {
                            return  <div key={value.authorid._id + index}>
                                    <p className='fs-2 fw-bold'>{value.authorid.username}<span className='fs-5 fw-normal'>{DateTime.fromISO(value.date).toFormat('yyyy LLL dd')}</span>
                                    
                                    {typeof userid !== 'undefined' && value.authorid._id === userid ? <MdClose color='red' cursor='pointer' size='1.3em' style={{float: 'right'}} onClick={()=> deleteComment(value._id, value.authorid._id)}/>: null}</p>
                                    <p className='fs-5'>{value.comment}</p>
                                    {index !== commentList.length - 1 ? <hr/> : null}
                                </div>  
                        })
                        : <p>No comments</p>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Channel;