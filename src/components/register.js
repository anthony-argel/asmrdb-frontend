import {useState} from 'react';
import { Redirect } from 'react-router-dom';

function Login(props) {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordRepeat, setPasswordRepeat] = useState("");
    const [errorList, setErrorList] = useState([]);
    const [accountCreated, setAccountCreated] = useState(false);



    function register(e){
        if(props.apiURL !== '') {
            e.preventDefault();
            if(passwordRepeat === password) {
                fetch(props.apiURL + '/user', {
                    method: 'POST',
                    body: JSON.stringify({username:username, email: email, password: password, passwordRepeat: passwordRepeat}),
                    headers: { 'Content-Type': 'application/json' },
                    mode: 'cors'
                })
                .then(res => {
                    return res.json();
                })
                .then(res => {
                    if(res.message !== 'account created') {
                        setErrorList([res.message]);
                    }
                    else {
                        setAccountCreated(true);
                    }
                });
            }
            else { 
                setErrorList(['Passwords do not match.']);
            }
        }

        
    }


    return(
    <div className='container'>
        {accountCreated === true ? <Redirect push to='/login'/> : null}
        {props.loggedIn === true ? <Redirect push to='/'/> : null}
        <div className='row justify-content-center'>
            <div className='col-6 bg-light p-4'>
            <h1 className='text-center'>Register</h1>
                <form onSubmit={register}>
                    <div className='mb-3'>
                        <label htmlFor='username' className='form-label'>Username</label>
                        <input type='string' className='form-control' id='username' required
                            onChange={e => setUsername(e.target.value)}/>
                    </div>

                    <div className='mb-3'>
                        <label htmlFor='email' className='form-label'>Email Address</label>
                        <input type='email' className='form-control' id='email'  required
                            onChange={e => setEmail(e.target.value)}/>
                    </div>
                    <div className='mb-3'>
                        <label htmlFor='password' className='form-label'>Password</label>
                        <input type='password' className='form-control' id='password' required
                            onChange={e=>setPassword(e.target.value)}/>
                    </div>
                    <div className='mb-3'>
                        <label htmlFor='passwordrepeat' className='form-label'>Password Repeated</label>
                        <input type='password' className='form-control' id='passwordrepeat' required
                            onChange={e=>setPasswordRepeat(e.target.value)}/>
                    </div>
                    <button type='submit' className='btn btn-primary'>Submit</button>
                    {errorList.length > 0 ? 
                        <div className='text-center'>
                            {errorList.map((value, index) => {
                                return <p key={index} className='text-danger'>{value}</p>
                            })}
                        </div>
                    : null}
                </form>
            </div>
        </div>
    </div>)
}

export default Login;