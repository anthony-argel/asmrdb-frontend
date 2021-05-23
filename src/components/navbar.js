import {Link, useHistory} from "react-router-dom";
import React, { useState } from "react";
import {FaSearch} from 'react-icons/fa';

const NavBar = (props) => {
    const [search, setSearch] = useState('');
    const history = useHistory();

    const sendSearch = (e) => {
        e.preventDefault();
        if(props.apiURL !== '') {
            history.push('/search/'+search.split(' ').join('_')+'/1')
        }
    }
    return (
        <nav className='navbar navbar-light navbar-expand-md shadow mb-5' style={{backgroundColor:"black"}}>
            <div className='container'>
                <Link to='/' className='navbar-brand text-white'>Home</Link>

                
               

                <div className='collapse navbar-collapse d-flex ' id='navContent-l'>
                    <ul className='navbar-nav'>
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
                    </ul>
                </div>

                <button className='navbar-toggler' type='button' data-bs-toggle='collapse' data-bs-target='#navContent-r' aria-controls='navContent-r' aria-expanded='false' aria-label='Toggle navigation'>
                    <span className='navbar-toggler-icon'></span>
                </button>
                <div className='collapse navbar-collapse d-flex justify-content-end' id='navContent-r'>
                    <ul className='navbar-nav'>
                        <form className="form-inline my-2 my-lg-0 d-flex" onSubmit={e => sendSearch(e)}>
                            <input className="form-control mr-sm-2 rounded-start" type="text" onChange={(e) => setSearch(e.target.value)} name='query' placeholder="Search..." aria-label="Search"/>
                            <button className="btn btn-outline-success my-2 my-sm-0" style={{backgroundColor:'darkGreen'}} ><FaSearch onClick={e => sendSearch(e)} color='black'/></button>
                        </form>
                        {!props.loggedIn ? <li className='nav-item'><Link to='/login' className='nav-link text-white'>Login</Link></li> : <li onClick={() => props.setLogin(false)} className='nav-item nav-link text-white' style={{cursor:'pointer'}}>Log Out</li>}
                    </ul>
                </div>

            </div>
        </nav>
    )
}

export default NavBar;