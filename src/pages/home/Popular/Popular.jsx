import React, {useState} from 'react'
import ContentWrapper from '../../../components/contentWrapper/ContentWrapper'
import SwitchTabs from '../../../components/switchTabs/SwitchTabs'
import useFetch from '../../../hooks/useFetch'
import Carousel from '../../../components/carousel/Carousel'

const Popular = () => {

    const [endpoint, setEndpoint] = useState("movie");

    const apiKey = '44b395310cfaa40bb9e37398daa7ace7';
    const url = `/${endpoint}/popular?api_key=${apiKey}`;
    const { data, loading } = useFetch(url);
    // const {data, loading} = useFetch(`${endpoint}/popular?api_key=${'44b395310cfaa40bb9e37398daa7ace7'}`);

    const onTabChange = (tab) => {
        setEndpoint(tab === "Movies" ? "movie" : "tv");
    };
  return (
    <div className='carouselSection'>
      <ContentWrapper>
        <span className="carouselTitle">What's Popular</span>
        <SwitchTabs data={["Movies", "TV Shows"]} onTabChange=
        {onTabChange} />
      </ContentWrapper>
      <Carousel 
        data={data?.results} 
        loading={loading} 
        endpoint={endpoint}/>
    </div>
  );
};

export default Popular
