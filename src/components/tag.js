import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ChannelList from './channellist';

const Tag = (props) => {
    let {id} = useParams();
    const [channels, setChannels] = useState([]);
    const [tag, setTag] = useState();

    useEffect(() => {
        if(props.apiURL !== '') {
            fetch(props.apiURL+'/tag/'+id+'/channels', {
                method: 'GET',
                mode:'cors'
            })
            .then(res => res.json())
            .then(res => {setChannels(res.channels); setTag(res.tag)});
        }
    }, [props.apiURL, id])

    useEffect(() => {
    }, [channels]);

    useEffect(() => {
        if(typeof tag !== 'undefined' && tag.name !== '') {
            document.title = tag.name + " | ASMRdb";
        }
    }, [tag]);

    

    return (
        <ChannelList channels={channels} title={typeof tag !== 'undefined' ? 'Tag: ' + tag.name : 'Tag: '}/>
    )
}

export default Tag;