import {useState, useEffect} from 'react';
import { useParams, Link } from "react-router-dom";
import ChannelList from './channellist';

const Search = (props) => {
    const [channels, setChannels] = useState([]);
    let {searchstring} = useParams();

    useEffect(() => {
        if(props.apiURL !== '' && searchstring !== '') {
            let query = searchstring.split('_').join(' ');
            document.title = query + ' | ASMRdb' 
            fetch(props.apiURL+'/channel/search?query='+query, {
                method:'GET',
                mode:'cors'
            })
            .then(res => res.json())
            .then(res => {
                setChannels(res.results);
                console.log('done');
            });
        }
    }, [props.apiURL, searchstring]);



    return (
        <ChannelList channels={channels} title={'Search: ' + searchstring.split('-').join(' ')}/>
    )

}

export default Search;