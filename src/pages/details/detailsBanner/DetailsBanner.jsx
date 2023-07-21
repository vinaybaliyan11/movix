import React, { useState } from "react";
import { useParams } from "react-router-dom";
// store se bhi data cahiye -- islea useSelector
import { useSelector } from "react-redux";
// date format krna islea dayjs
import dayjs from "dayjs";

import "./style.scss";

import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";
import useFetch from "../../../hooks/useFetch";
import Genres from "../../../components/genres/Genres";
import CircleRating from "../../../components/circleRating/CircleRating";
import Img from "../../../components/lazyLoadImage/Img.jsx";
import PosterFallback from "../../../assets/no-poster.png";

import {PlayIcon} from "../Playbtn"

import VideoPopup from "../../../components/videoPopup/VideoPopup";

const DetailsBanner = ({ video, crew }) => {

    // video click pr trailer chle uske liye 2 states chahiye
    const [show, setShow] = useState(false);
    const [videoId, setVideoId] = useState(null);

    // dynamic movie and tv ke liye -- params lo
    // params meh -- media type and id milegi (cz app.jsx meh details compoenent meh ye dono de rkha hai)
    const {mediaType, id} = useParams();

  
    // media type bhejna hai (movie meh -- movie and tv meh -- tv) toh dynamic chahiye
    const {data, loading} = useFetch(`/${mediaType}/${id}?api_key=44b395310cfaa40bb9e37398daa7ace7`);

    // url chahiye (home meh se url mil jayega)3
    const {url} = useSelector((state) => state.home);


    // iski api meh genre ki id, name dono hai
    // hum ne jo genre bnaya -- uss meh bss ID hi bhejni hai
    // map meh se bss id leni -- not name
    const _genres = data?.genres?.map((g) => g.id);


    // 2 variable create krne hai (ek crew ke liye and ek writers ke liye)
    // ye ek array bn jaega -- and iss meh vo filter jo director hai
    const director = crew?.filter((f) => f.job === "Director");
    const writer = crew?.filter((f) => f.job === "Screenplay" || f.job === "Story" || f.job === "Writer");
    // const director = data?.results?.job;


    // server se hum convert kr rhe ki movie kitne ghante ki hai
    const toHoursAndMinutes = (totalMinutes) => {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${hours}h${minutes > 0 ? ` ${minutes}m` : ""}`;
    };

    return (
        <div className="detailsBanner">
            {!loading ? (
                // yha humara main hoga details banner ka (fragment (wait nhi krna ? ka))
                // !! se boolean meh convert kr dega
                <>
                    {!!data && (
                        <React.Fragment>
                            <div className="backdrop-img">
                                <Img src={url.backdrop + data?.backdrop_path}/>
                            </div>

                            {/* opacity layer jo merge krti hai background color se backdrop img ko */}
                            <div className="opacity-layer">
                                
                            </div>

                            <ContentWrapper>
                                <div className="content">

                                    {/* left meh meri poster image rhegi (kbhi img nhi hoti toh uske liye fallback path dikhaenge)*/}
                                    <div className="left">
                                        {data.poster_path ? (
                                            <Img className="posterImg"
                                            src={url.backdrop + data.poster_path}/>
                                        ) : (
                                            <Img className="posterImg"
                                            src={PosterFallback}/>
                                        )}
                                    </div>

                                    {/* release date se -- date kb aayi vo bhi aa jayega (data.name and data.title tv and movie ke hai)*/}
                                    <div className="right">
                                        <div className="title">
                                            {`${data.name || data.title} (${dayjs(data?.release_date).format("YYYY")})`}
                                        </div>

                                        <div className="subtitle">
                                            {data.tagline}
                                        </div>

                                        <Genres data={_genres}/>

                                        <div className="row">
                                            <CircleRating 
                                            rating={data.vote_average.toFixed(1)}/>

                                            <div className="playbtn"
                                            onClick={() => {
                                                setShow(true)
                                                setVideoId(video.key)
                                            }}>
                                                <PlayIcon />
                                                <span className="text">Watch Trailer</span>
                                            </div>
                                        
                                        </div>

                                        <div className="overview">
                                            <div className="heading">
                                                Overview
                                            </div>
                                            <div className="description">
                                                {data.overview}
                                            </div>
                                        </div>

                                        {/* status vla humara inspect element se hai */}
                                        <div className="info">
                                            {data.status && (
                                                <div className="infoItem">
                                                    <span className="text bold">
                                                        Status: {" "}
                                                    </span>
                                                    <span className="text">
                                                        {data.status}
                                                    </span>
                                                </div>
                                            )}

                                            {data.release_date && (
                                                <div className="infoItem">
                                                    <span className="text bold">
                                                        Release Date: {" "}
                                                    </span>
                                                    <span className="text">
                                                        {dayjs(data.release_date).format("MMM D, YYYY")}
                                                    </span>
                                                </div>
                                            )}

                                            {data.runtime && (
                                                <div className="infoItem">
                                                    <span className="text bold">
                                                        Runtime: {" "}
                                                    </span>
                                                    <span className="text">
                                                        {toHoursAndMinutes(data.runtime)}
                                                    </span>
                                                </div>
                                            )}

                                        </div>

                                        {/* add the directors now */}
                                        {director?.length > 0 && (
                                            <div className="info">
                                                <span className="text bold">
                                                    Director:{" "}
                                                </span>
                                                <span className="text">
                                                    {director?.map((d, i) => (
                                                        <span key={i}>
                                                            {d.name}
                                                            {director.length-1 !== i && ", "}
                                                        </span>
                                                    ))}
                                                </span>
                                            </div>
                                        )}

                                        {/* writer ke liye krro ab aap */}
                                        {writer?.length > 0 && (
                                            <div className="info">
                                                <span className="text bold">
                                                    Writer:{" "}
                                                </span>
                                                <span className="text">
                                                    {writer?.map((d, i) => (
                                                        <span key={i}>
                                                            {d.name}
                                                            {writer.length-1 !== i && ", "}
                                                        </span>
                                                    ))}
                                                </span>
                                            </div>
                                        )}

                                        {/* TV series ke liye creator bhi hota hai */}
                                        {data?.created_by?.length > 0 && (
                                            <div className="info">
                                                <span className="text bold">
                                                    Creator:{" "}
                                                </span>
                                                <span className="text">
                                                    {data?.created_by?.map((d, i) => (
                                                        <span key={i}>
                                                            {d.name}
                                                            {data?.created_by.length-1 !== i && ", "}
                                                        </span>
                                                    ))}
                                                </span>
                                            </div>
                                        )}

                                    </div>
                                </div>
                                
                                <VideoPopup 
                                show = {show}
                                setShow = {setShow}
                                videoId = {videoId}
                                setVideoId = {setVideoId}
                                />

                            </ContentWrapper>

                        </React.Fragment>
                    )}
                </>
            ) : (
                // simple loading skeleton hai -- load ho rha hai tb
                <div className="detailsBannerSkeleton">
                    <ContentWrapper>
                        <div className="left skeleton"></div>
                        <div className="right">
                            <div className="row skeleton"></div>
                            <div className="row skeleton"></div>
                            <div className="row skeleton"></div>
                            <div className="row skeleton"></div>
                            <div className="row skeleton"></div>
                            <div className="row skeleton"></div>
                            <div className="row skeleton"></div>
                        </div>
                    </ContentWrapper>
                </div>
            )}
        </div>
    );
};

export default DetailsBanner;
// import this is details.jsx