import { getAllChannelsThunk, getChannelsArray } from "../../redux/channels";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";


function AllChannels({ server }) {
    const dispatch = useDispatch()
    const channels = useSelector(getChannelsArray)
    useEffect(()=>{
        dispatch(getAllChannelsThunk(server))
    }, [])

    if(!channels) return "Loading..."

    return (
        <>
        {channels?.map(channel => {
            return  <li key={channel.id}><button>{channel.name}</button></li>

        })}
        </>
    )
}

export default AllChannels;
