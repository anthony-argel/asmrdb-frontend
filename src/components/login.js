import {useState, useEffect} from 'react';
import { Link, Redirect } from 'react-router-dom';

function Login(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);


    useEffect(() => {
        document.title = 'ASMRdb';
    }, [])

    function login(e){
        if(props.apiURL !== '') {
            e.preventDefault();
            console.log('logging in...');
            fetch(props.apiURL + '/user/login', {
                method: 'POST',
                body: JSON.stringify({email: email, password: password}),
                headers: { 'Content-Type': 'application/json' },
                mode: 'cors'
            })
            .then(res => {
                if(res.status !== 200){
                    setError(true);
                }
                else {
                    return res.json()
                }
            })
            .then(res => {
                if(res) {
                    localStorage.setItem('token', res.token);
                    localStorage.setItem('id', res.id);
                    props.setLogin(true);
                }
            })

        }
    }

    return(
    <div className='container'>
        {props.loggedIn === true ? <Redirect push to='/'/> : null}
        <div className='row justify-content-center'>
            <div className='col-6 bg-light p-4'>
            <h1 className='text-center'>Login</h1>
                <form onSubmit={login}>
                    <div className='mb-3'>
                        <label htmlFor='email' className='form-label'>Email Address</label>
                        <input type='email' className='form-control' id='email' 
                            onChange={e => setEmail(e.target.value)}/>
                    </div>
                    <div className='mb-3'>
                        <label htmlFor='password' className='form-label'>Password</label>
                        <input type='password' className='form-control' id='password'
                            onChange={e=>setPassword(e.target.value)}/>
                    </div>
                    <button type='submit' className='btn btn-primary'>Submit</button>
                    {error === true ? <p className='text-center text-danger'>Email or password was incorrect. Please try again.</p> : null}
                </form>
                <hr/>
                <div className='text-center'>
                    <Link to='/register'>Create an Account</Link>
                </div>
            </div>
        </div>
    </div>)
}

export default Login;