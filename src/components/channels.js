import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ChannelList from './channellist';

const Channels = (props) => {
    const [channels, setChannels] = useState([]);

    useEffect(() => {
        document.title = 'Channels | ASMRdb';
        if(props.apiURL !== '') {
            fetch(props.apiURL+'/channel',{
                method: 'GET',
                mode: 'cors'
            })
            .then(res => {
                if(res.status !== 400) {
                    return res.json();
                }
            })
            .then(res => setChannels(res.channels));
        }
    }, [props.apiURL])

    return (
        <ChannelList channels={channels} title={'Channels'}/>
    )
}

export default Channels;