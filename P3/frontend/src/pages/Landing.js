import React, { useEffect, useState } from 'react';
import ListingCard from '../components/presenter/ListingCard';
import SearchListingCard from '../components/search/SearchListingCard';
import Button from '../components/inputs/Button';
import { Link } from 'react-router-dom';
import PetDetailService from '../services/PetDetailService';
import Skeleton from 'react-loading-skeleton';

const SkeletonArray = Array.from({ length: 10 }, (_, i) => <Skeleton className='mr-[20rem] h-[28rem] rounded-lg' key={i} inline />)

export const Landing = () => {
  const [landingListings, setLandingListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    PetDetailService.getPetListings('-listed_date', '', '', '', '', null, null)
      .then((res) => {
        setLoading(false);
        setLandingListings(res.data.results);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [setLandingListings])

  return (
    <div>
      {/* Landing Title */}
      <div class="bg-cover bg-bottom h-[379px] text-center text-[#FFF8F4] flex flex-col justify-center" style={{backgroundImage: "url(landing_bg.png)"}}>
        <h1 class="text-[4rem]">Find a pet you love</h1>
        <h2 class="text-[1.25rem] font-semibold tracking-wider">Let’s find the friend that’s purr-fect for you</h2>
      </div>

      {/* Main Content */}
      <div class="px-[1rem] text-[#290005] pb-[1rem]">
        <div class="flex flex-col items-center justify-center gap-[.25rem] pb-[3rem]">

          {/* Spacing container */}
          <div className='flex flex-wrap justify-start max-w-[310px] gap-[1rem] md:max-w-[740px] lg:max-w-[740px] xl:max-w-[1100px]'>
            {/* Example Pets */}
            <div className='flex flex-row items-center gap-[.5rem]'>
              <div class="text-[1.5rem] pb-[4px] font-semibold">Latest Pets Listed</div>
              <Link to='/search'>
                <Button className='w-[8rem] h-[2rem] mb-[.25rem] flex text-center items-center justify-center' onClick={() => {}} buttonType='' children={
                  <div>See All</div>
                }/>
              </Link>
            </div>
            <div className='relative flex flex-row flex-wrap justify-center gap-[3rem] max-h-[45rem] overflow-hidden border-b-[1px]'>
              {landingListings?.map((listing) => {
                return (
                  <div className='max-w-[20rem]'>
                    <SearchListingCard listing={listing}/>
                  </div>
                )
              })}
              {(loading || !landingListings?.length) && SkeletonArray}
              {!loading ? <div className="pointer-events-none to-bg-black-10 absolute inset-0 h-full w-full bg-gradient-to-b from-transparent via-white/10 to-white hover:via-white/10 hover:to-white/20 transition " /> : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
