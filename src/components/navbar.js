import {Link } from "react-router-dom";
import React, { useState } from "react";
import {FaSearch} from 'react-icons/fa';

const NavBar = (props) => {
    const [search, setSearch] = useState('');
    const searchBehavior = (e) => {
        e.preventDefault();
        alert(`not implemented yet:\nyou searched for ${search}`)
    }

    return (
        <nav className='navbar navbar-light navbar-expand-md shadow mb-5' style={{backgroundColor:"black"}}>
            <div className='container'>
                <Link to='/' className='navbar-brand text-white'>Home</Link>

                
               

                <div className='collapse navbar-collapse d-flex ' id='navContent-l'>
                    <ul className='navbar-nav'>
                        <li className='nav-item'>
                            <Link to='/discussion' className='nav-link text-white'>Discussion</Link>
                        </li>
                        <li className='nav-item'>
                            <Link to='/rules' className='nav-link text-white'>Rules</Link>
                        </li>
                    </ul>
                </div>

                <button className='navbar-toggler' type='button' data-bs-toggle='collapse' data-bs-target='#navContent-r' aria-controls='navContent-r' aria-expanded='false' aria-label='Toggle navigation'>
                    <span className='navbar-toggler-icon'></span>
                </button>
                <div className='collapse navbar-collapse d-flex justify-content-end' id='navContent-r'>
                    <ul className='navbar-nav'>
                        <form className="form-inline my-2 my-lg-0 d-flex">
                            <input className="form-control mr-sm-2 rounded-start" type="search" onChange={(e) => setSearch(e.target.value)} placeholder="Search" aria-label="Search"/>
                            <button className="btn btn-outline-success my-2 my-sm-0" style={{backgroundColor:'darkGreen'}}type="submit"><FaSearch onClick={(e) => searchBehavior(e)} color='black'/></button>
                        </form>
                        {!props.loggedIn ? <li className='nav-item'><Link to='/login' className='nav-link text-white'>Login</Link></li> : <li onClick={() => props.setLogin(false)} className='nav-item nav-link text-white' style={{cursor:'pointer'}}>Log Out</li>}
                    </ul>
                </div>

            </div>
        </nav>
    )
}

export default NavBar;