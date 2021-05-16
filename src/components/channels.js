import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ChannelList from './channellist';

const Channels = (props) => {
    const [channels, setChannels] = useState([]);
    const [totalChannels, setTotalChannels] = useState(0);
    const [pages, setPages] = useState();
    let {startpos} = useParams();

    useEffect(() => {
        document.title = 'Channels | ASMRdb';
        if(props.apiURL !== '' && typeof startpos !== 'undefined') {
            fetch(props.apiURL+'/channel/limit/'+startpos,{
                method: 'GET',
                mode: 'cors'
            })
            .then(res => {
                if(res.status !== 400) {
                    return res.json();
                }
            })
            .then(res => {
                if(typeof res === 'undefined') {return;}
                setChannels(res.channels)
                setTotalChannels(res.totalchannels);
                let estimatedPages = Math.ceil(res.totalchannels / 40.0);
                if(estimatedPages <= 0) {
                    setPages(1);
                }
                else {
                    setPages(estimatedPages);
                }
            }   
            );
        }
    }, [props.apiURL, startpos])

    return (
        <div>
        <ChannelList channels={channels} title={'Channels'} totalresults={totalChannels} startpos={startpos} pages={pages} pageurl={'/channels/'}/>
            
        </div>
    )
}

export default Channels;