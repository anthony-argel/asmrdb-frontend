import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ChannelList from './channellist';

const Tag = (props) => {
    let {id, startpos} = useParams();
    const [channels, setChannels] = useState([]);
    const [tag, setTag] = useState();
    const [totalChannels, setTotalChannels] = useState(0);
    const [pages, setPages] = useState();

    useEffect(() => {
        if(props.apiURL !== '') {
            fetch(props.apiURL+'/tag/'+id+'/channels/'+startpos, {
                method: 'GET',
                mode:'cors'
            })
            .then(res => res.json())
            .then(res => {
                setChannels(res.channels); 
                setTotalChannels(res.totalchannels);
                setTag(res.tag);
                let estimatedPages = Math.ceil(res.totalchannels / 40.0);
                if(estimatedPages <= 0) {
                    setPages(1);
                }
                else {
                    setPages(estimatedPages);
                }
            });
        }
    }, [props.apiURL, id, startpos])

    useEffect(() => {
    }, [channels]);

    useEffect(() => {
        if(typeof tag !== 'undefined' && tag.name !== '') {
            document.title = tag.name + " | ASMRdb";
        }
    }, [tag]);

    

    return (
        <ChannelList pageurl={`/${id}/`} pages={pages} startpos={startpos} totalresults={totalChannels} channels={channels} title={typeof tag !== 'undefined' ? 'Tag: ' + tag.name : 'Tag: '}/>
    )
}

export default Tag;