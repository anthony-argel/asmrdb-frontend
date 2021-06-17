import {useState, useEffect} from 'react';
import { useParams } from "react-router-dom";
import ChannelList from './channellist';

const Search = (props) => {
    const [channels, setChannels] = useState([]);
    const [totalChannels, setTotalChannels] = useState(0);
    const [pages, setPages] = useState();
    let {searchstring, startpos} = useParams();

    useEffect(() => {
        if(props.apiURL !== '' && searchstring !== '') {
            let query = searchstring.split('_').join(' ');
            query = decodeURIComponent(query);
            document.title = query + ' | ASMRdb' 
            fetch(props.apiURL+'/channel/'+startpos+'/search?query='+query, {
                method:'GET',
                mode:'cors'
            })
            .then(res => res.json())
            .then(res => {
                setChannels(res.channels);
                setTotalChannels(res.totalChannels);
                
                let estimatedPages = Math.ceil(res.totalchannels / 40.0);
                if(estimatedPages <= 0) {
                    setPages(1);
                }
                else {
                    setPages(estimatedPages);
                }
            });
        }
    }, [props.apiURL, searchstring, startpos]);



    return (
        <ChannelList channels={channels} totalresults={totalChannels} title={'Search: ' + decodeURIComponent(searchstring.split('-').join(' '))} pages={pages}/>
    )

}

export default Search;