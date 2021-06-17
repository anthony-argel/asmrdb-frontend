import {Link, useHistory} from "react-router-dom";
import React, { useState } from "react";
import {FaSearch} from 'react-icons/fa';

const NavBar = (props) => {
    const [search, setSearch] = useState('');
    const history = useHistory();

    const sendSearch = (e) => {
        e.preventDefault();
        if(props.apiURL !== '') {
            setSearch('');
            history.push('/search/'+encodeURIComponent(search).split(' ').join('_')+'/1')
        }
    }
    return (
        <nav className='navbar navbar-light navbar-expand-lg shadow mb-5' style={{backgroundColor:"black"}}>
            <div className='container'>
                <Link to='/' className='navbar-brand text-white'>Home</Link>

                
                <button className="navbar-toggler navbar-dark" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
                </button>
               

                <div className='collapse navbar-collapse' id='navbarSupportedContent'>
                    <ul className='navbar-nav me-auto mb-lg-0"'>
                        <li className='nav-item'>
                            <Link to='/channels/1' className='nav-link text-white'>Channels</Link>
                        </li>
                        <li className='nav-item'>
                            <Link to='/tags' className='nav-link text-white'>Tags</Link>
                        </li>
                        <li className='nav-item'>
                            {props.loggedIn === true ? 
                            <Link to='/add' className='nav-link text-white'>Add Channel</Link>
                            :
                            null}
                        </li>
                        <li className='nav-item'>
                            <Link to='/boards' className='nav-link text-white'>Discussion</Link>
                        </li>
                        {!props.loggedIn ? <li className='nav-item'><Link to='/login' className='nav-link text-white'>Login</Link></li> : <li onClick={() => props.setLogin(false)} className='nav-item nav-link text-white' style={{cursor:'pointer'}}>Log Out</li>}
                    
                    </ul>
                        <form className="form-inline my-2 my-lg-0 d-flex" onSubmit={e => sendSearch(e)}>
                            <div className='input-group'>
                                <input className="form-control mr-sm-2 rounded-start" type="text" onChange={(e) => setSearch(e.target.value)} name='query' placeholder='Search...' value={search} aria-label="Search"/>
                                <button className="btn btn-outline-success my-2 my-sm-0" style={{backgroundColor:'darkGreen'}} ><FaSearch onClick={e => sendSearch(e)} color='black'/></button>
                            </div> 
                        </form>

                </div>


            </div>
        </nav>
    )
}

export default NavBar;