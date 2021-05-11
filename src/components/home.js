import { useEffect } from "react";
import { Link } from "react-router-dom"

const Homepage = (props) => {
    useEffect(() => {
        document.title = 'ASMRdb';
    }, [])

    useEffect(() => {
        if(props.apiURL !== '') {
            console.log('ran');
        }
    }, [props.apiURL])

    return (
        <div className='container'>
            <div className='row'>
                <div className='col-12 bg-light'>
                    <p className='fs-2 text-center'>Recently Added</p>
                    <hr/>
                </div>

            </div>
        </div>
    )
}

export default Homepage;