import { useEffect, useState } from "react";
import {Link} from 'react-router-dom';

const Boards = (props) => {
    const [boards, setBoards] = useState([]);

    useEffect(() => {
        if(props.apiURL === '') return;
        fetch(props.apiURL+'/board', {
            method:'GET',
            mode:'cors'
        })
        .then(res => res.json())
        .then(res => {
            if(typeof res !== 'undefined') {
                setBoards(res.boards);
            }
        })
    }, [props.apiURL]);

    return (
        <div className='container'>
            <div className='row'>
                <div className='col-12 bg-light text-center p-3'>
                    <h1>Boards</h1>
                    <hr/>
                    {boards.length > 0 ? 
                    
                    boards.map((value, index) => {
                        return (<Link key={value._id} to={'/board/'+value._id} className='fs-3' style={{textDecoration:'none'}}><p>{value.name}</p></Link>)
                    })
                    
                    : 

                    <div className="spinner-border text-success" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>}
                </div>
            </div>
        </div>
    )
}

export default Boards;