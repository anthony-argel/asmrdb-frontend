import {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {DateTime} from 'luxon'
import {FaRegTrashAlt} from 'react-icons/fa';

const Thread = (props) => {
    const {id} = useParams();
    const [userId, setUserId] = useState();
    const [token, setToken] = useState();
    const [threadData, setThreadData] = useState();
    const [commentsList, setCommentsList] = useState([]);
    const [comment, setComment] = useState('');
    const [refresh, setRefresh] = useState(false);
    const [threadText, setThreadText] = useState('');

    useEffect(() => {
        if(localStorage.getItem('token') !== null) {
            setToken(localStorage.getItem('token'));
        }
        if(localStorage.getItem('id') !== null) {
            setUserId(localStorage.getItem('id'));
        }
    }, []);

    useEffect(() => {
        if(props.apiURL === '') return;

        fetch(props.apiURL +'/thread/'+id, {
            method: 'GET',
            mode:'cors'
        }).then(res => res.json())
        .then(res => {
            if(typeof res !== 'undefined') {
                setThreadData(res.threaddata);
                setCommentsList(res.comments);
                setThreadText(res.threaddata.comment);
            }
        })

    }, [props.apiURL, id, refresh]);

    const addReplyToComment = (text) => {
        setComment(comment + '@' + text +'\n');
    }

    const deletePost = (e) => {
        if(props.apiURL === '') return;
        fetch(props.apiURL +'/thread/'+id, {
            method: 'DELETE',
            mode:'cors',
            headers: { 'Authorization' : 'Bearer ' + token },
        }).then(res => setRefresh(!refresh))
    }

    const updatePostText = (e, text) => {
        if(props.apiURL === '') return;

        fetch(props.apiURL +'/thread/'+id, {
            method: 'PUT',
            mode:'cors',
            body: JSON.stringify({comment:threadText}),
            headers: { 'Content-Type': 'application/json',
            'Authorization' : 'Bearer ' + token },
        }).then(res => setRefresh(!refresh))
    }

    const submitComment = (e) => {
        e.preventDefault();
        if(props.apiURL === '') return;
        fetch(props.apiURL +'/thread/'+id+'/comment', {
            method:'POST', 
            mode:'cors',
            body: JSON.stringify({comment:comment}),
            headers: { 'Content-Type': 'application/json',
            'Authorization' : 'Bearer ' + token }
        }).then(res => setRefresh(!refresh))
    }

    const deleteComment = (commentid) => {
        if(props.apiURL === '') return;
        fetch(props.apiURL + '/thread/'+id+'/comment/'+commentid, {
            method:'DELETE',
            mode:'cors',
            headers: { 'Content-Type': 'application/json',
            'Authorization' : 'Bearer ' + token }
        }).then(res => setRefresh(!refresh))
    }

    return (
        <div className='container'>
            <div className='row'>
                <div className='col-12 bg-light p-3'>


                    {typeof threadData !== 'undefined' ? 
                        <div className='lh-1'>
                            <h1>{threadData.title}</h1>
                            <p className='mb-2'>Posted by {typeof threadData.author !== 'undefined' ? threadData.author.username: 'DELETED'} on {DateTime.fromISO(threadData.date).toFormat('yyyy LLL dd')}</p>
                            {typeof threadData.comment !== 'undefined' ? <p className='fs-3' style={{whiteSpace: "pre-wrap"}}>{threadData.comment}</p> : null}
                            {typeof threadData.author !== 'undefined' && threadData.author._id === userId ? 
                            <p><span style={{color:'blue', cursor:'pointer'}} data-bs-toggle="modal" data-bs-target="#editCommentModal">Edit</span> <span style={{color:'blue', cursor:'pointer'}} className='mx-5' onClick={(e) => deletePost(e)}>Delete</span></p>
                            :
                            null
                            } 
                        </div>
                    
                    
                    : <p>Loading...</p>}

                    <hr/>
                    
                    
                    {props.loggedIn === true ? 
                        <form>
                            <div className="mb-3">
                                <label htmlFor="commentFormTextArea" className="form-label">Comment</label>
                                
                                {comment.length > 0 ?
                                <textarea className="form-control" id="commentFormTextArea" rows="3" value={comment} onChange={(e) => setComment(e.target.value)}></textarea>
                                :
                                <textarea className="form-control" id="commentFormTextArea" rows="3" onChange={e => setComment(e.target.value)}></textarea>
                                }
                            </div>
                            <button type="button" className="btn btn-primary" onClick={e => submitComment(e)}>Submit</button>
                        <hr/>
                        </form>
                    :
                    null
                    }
                    {commentsList.length > 0 ? 
                        commentsList.map((value, index) => {
                            return (
                                <div key={value._id} style={{backgroundColor:'lightgray', paddingRight:'0'}} className={index + 1 !== commentsList.length ? 'p-3 mb-2 lh-lg' : 'p-3 lh-lg'}>
                                    <p className='mb-0'>Posted by {typeof value.author !== 'undefined' ? value.author.username : 'DELETED'} on {DateTime.fromISO(value.date).toFormat('yyyy LLL dd')} ID: <span style={{cursor:'pointer', color:'blue'}} onClick={e => addReplyToComment(e.target.textContent)}>{value._id}</span> 
                                    {
                                        value.author._id === userId ? 
                                        <FaRegTrashAlt color='blue' size='1.5em' cursor='pointer' onClick={e => deleteComment(value._id)}/>
                                        :
                                        null
                                    }
                                    </p>
                                    <hr className='mt-0'/>
                                    <p className='mb-0' style={{whiteSpace: "pre-wrap"}}>{value.comment}</p>
                                </div>
                            )
                        })
                    : 
                    <div style={{backgroundColor:'lightgray', paddingRight:'0'}} className='p-3'>
                        <p className='mb-0'>No comments in this thread</p>
                    </div>}
                </div>
            </div>


                <div className="modal fade" id="editCommentModal" tabIndex="-1" aria-labelledby="editCommentModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="editCommentModalLabel">Edit Comment</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="mb-3">
                                        <label htmlFor="threadtextinput" className="form-label">Text:</label>
                                        {typeof threadText !== 'undefined' && threadText.length > 0 ? 
                                        <textarea className="form-control" id="threadtextinput" max='10000' value={threadText} onChange={e => setThreadText(e.target.value)} rows="4" ></textarea>
                                        :
                                        <textarea className="form-control" id="threadtextinput" max='10000' onChange={e => setThreadText(e.target.value)} rows="4" ></textarea>
                                        } 
                                    </div>
                                    <button type="button" className="btn btn-primary" onClick={e => updatePostText(e, e.target.value)} data-bs-dismiss="modal">Submit</button>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Thread;