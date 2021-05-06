import { useEffect } from "react";
import { Link } from "react-router-dom"

const Homepage = () => {
    useEffect(() => {
        document.title = 'ASMRdb';
    }, [])

    return (
        <div className='container'>
            <div className='row'>
                <div className='col-12 bg-light'>
                    <p>Hi from homepage</p>
                    <Link to='/channel/608a04fc8d739f4ce2080ecd'>Demo Channel Link</Link>
                </div>

            </div>
        </div>
    )
}

export default Homepage;