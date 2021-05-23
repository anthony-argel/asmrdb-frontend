import { useParams, Link, useHistory } from "react-router-dom";
import {useEffect, useState} from 'react';
import {DateTime} from 'luxon';

const Board = (props) => {
    const history = useHistory();
    const {id} = useParams();
    const [threads, setThreads] = useState([]);
    const [board, setBoard] = useState();
    const [newThreadTitle, setNewThreadTitle] = useState('');
    const [newThreadText, setNewThreadText] = useState('');
    const [token, setToken] = useState('');

    useEffect(() => {
        if(props.apiURL === '') return;
        fetch(props.apiURL + '/board/'+id, {
            method: 'GET',
            mode: 'cors'
        }).then(res => res.json())
        .then(res => {
            if(typeof res !== 'undefined') {
                setThreads(res.threads);
                setBoard(res.board);
            }
        })
    }, [props.apiURL, id]);

    useEffect(() => {
        if(localStorage.getItem('token') !== null) {
            setToken(localStorage.getItem('token'));
        }
    }, []);

    const submitThread = (e) => {
        e.preventDefault();
        if(props.apiURL === '' || board._id === '') return;

        document.getElementById('createThreadModal')

        let requestData = {
            title: newThreadTitle,
            comment: newThreadText,
            boardid: board._id
        }
        fetch(props.apiURL+'/thread', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(requestData),
            mode:'cors'
        }).then(res => res.json())
        .then(res => {
            if(typeof res !== 'undefined') {
                history.push('/thread/'+res.id);
            }
        })
    }

    return (
        <div className='container'>
            <div className='row mb-3'>
                <div className='col-12 bg-light p-3'>
                    {typeof board === 'undefined' ? <h1>Loading...</h1> : 
                    <div className='text-center'>
                        <h1 >{board.name}</h1>
                        <p>{board.description}</p>
                        {props.loggedIn === true ? <button type="button" className="btn btn-success" data-bs-toggle="modal" data-bs-target="#createThreadModal">Create thread</button> : null}
                    </div>}
                    <hr/>
                    {threads.length > 0 ? 
                    threads.map((value, index) => {
                        return (
                            <div key={value._id} className='lh-sm'>
                                <Link to={'/thread/'+value._id} className='fs-3' style={{textDecoration:'none'}}>{value.title}</Link>
                                
                                {typeof value.author === 'undefined' ? <p className='mb-0'>Author: DELETED</p> : <p className='mb-0'>Author: {value.author.username}</p>}
                                <p className='mb-0'>Posted: {DateTime.fromISO(value.date).toFormat('yyyy LLL dd')}</p>
                                {index + 1 !== threads.length ? <hr/> : null}
                            </div>
                        )
                    })
                    : 
                    <p>No threads found</p>}
                </div>
            </div>


            <div className="modal fade" id="createThreadModal" tabIndex="-1" aria-labelledby="createThreadModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="createThreadModalLabel">Create Thread</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="mb-3">
                                <label htmlFor="threadname" className="form-label">Title:</label>
                                <input type="text" className="form-control" minLength='3' maxLength='50' id="threadname" onChange={e=>setNewThreadTitle(e.target.value)} required/>
                                </div>
                                <div className="mb-3">
                                <label htmlFor="threadtextinput" className="form-label">Text (optional):</label>
                                <textarea className="form-control" id="threadtextinput" max='10000' rows="4" onChange={e => setNewThreadText(e.target.value)}></textarea>
                            </div>
                            <button type="button" className="btn btn-primary" onClick={e => submitThread(e)} data-bs-dismiss="modal">Submit</button>
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

export default Board;