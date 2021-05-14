import React, {useState} from 'react'
import VideoEmbed from "./../../atoms/VideoEmbed/VideoEmbed"
import {useParams} from "react-router-dom"
import {fetchVideoDetails} from "./../../../utils/video/video"
import {data} from "./../../../data/data"
import {useVideo} from "./../../../context/video-context"
import {useAuth} from "./../../../context/auth-context"
import {searchLikes, searchFollowings} from "./../../../utils/context-utils/context-utils"
import {searchCreator} from "./../../../utils/category/category"
import Typography from '../../atoms/Typography/Typography'
import {AiFillLike, AiOutlineLike} from "react-icons/ai"
import {RiPlayListAddFill} from "react-icons/ri"
import PlaylistModal from "./../PlaylistModal/PlaylistModal"
import Button from "./../../atoms/Button/Button"
import "./VideoStream.css"

function VideoStream() {
    const {id} = useParams()
    const {authState} = useAuth();
    const {currentUserId} = authState;
    const { videoState, dispatch } = useVideo();
    const currUserVideoState = videoState.filter((item) => item.id === currentUserId)[0];
    const video = fetchVideoDetails(data, id);
    const creatorDetails = searchCreator(data, video.creator_id)[0];
    const [showModal, setShowModal] = useState(false);

    function handleLike(){
        if (currentUserId !== null){
        if(searchLikes(currUserVideoState,video) === false){
            dispatch({type : "ADD_TO_LIKES", payload:{video:video, currentUserId:currentUserId}})
        } else {
            dispatch({type : "REMOVE_FROM_LIKES", payload:{video:video, currentUserId:currentUserId}})
        }
    }
    else{
        alert("Please Login")
    }
    }

    function handleFollow(){
        if (currentUserId !== null){
            console.log(currUserVideoState);
            if(searchFollowings(currUserVideoState,creatorDetails.creator_id) === false){
                dispatch({type : "FOLLOW", payload:{creator:creatorDetails, currentUserId:currentUserId}})
            } else {
                dispatch({type : "UNFOLLOW", payload:{creator:creatorDetails, currentUserId:currentUserId}})
            }
        }
        
        else{
            alert("Please Login")
        } 
    }
    function handlePlaylist(){
        if(currentUserId !== null){
            setShowModal(true)
        }else{
            alert("Please Login")
        }
    }


    return (
        
        <div className="video-stream">
            <div className="video-embed">
                <VideoEmbed width="100%" height="560" id={id} />
            </div>
            <div className="video-stream__info">
                <div className="info__title">
                    <Typography fontSize="ml" fontWeight="medium">{video.name}</Typography>
                </div>
                <div className="info__buttons">
                    <button
                        onClick = {handleLike}
                        className={(currentUserId !== null)?(searchLikes(currUserVideoState, video) ? "video-stream__like like__clicked" : "video-stream__like"):"video-stream__like"}
                    >
                        {(currentUserId !== null)?(searchLikes(currUserVideoState,video) ? <AiFillLike /> : <AiOutlineLike />):<AiOutlineLike />}
                    </button>
                    <button onClick={handlePlaylist}className="video-stream__playlist">
                    <RiPlayListAddFill />
                    </button>
                    <PlaylistModal video={video} showModal={showModal} setShowModal={setShowModal} />
                    
                </div>
                
            </div>
            <div className="creator-section">
                <div className="creator-info">
                <div className="creator-info__thumbnail">
                    <img alt={`${creatorDetails.name}`} src={creatorDetails.thumbnail} />
                </div>
                <div className="creator-info__name">
                    {creatorDetails.name}  
                </div>
                </div>
                <div> 
                <Button onClick={handleFollow}>
                {(currentUserId !== null)?(searchFollowings(currUserVideoState,creatorDetails.creator_id) === false ? "Follow": "Following"):"Follow"}
                </Button>
                </div>
                
            </div>
            <div className="video-description">
                <div>
                {video.description}
                </div>
                
            </div>  
        </div>
    )
}

export default VideoStream
