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
                    <h1>ASMRdb</h1>
                    <h3>A database for ASMR channels on YouTube</h3>
                    
                    
                    <Link to='/channel/608a04fc8d739f4ce2080ecd'>Demo Channel Link</Link>
                </div>

            </div>
        </div>
    )
}

export default Homepage;