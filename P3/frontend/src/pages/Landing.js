import React from 'react';
import ListingCard from '../components/presenter/ListingCard';
import Button from '../components/inputs/Button';
import { Link } from 'react-router-dom';

export const Landing = () => {

  const listings = [{
      name: "Buddy",
      listed_date: "2021-09-01",
      breed: "Beagle",
      shelter: {name: "Toronto Humane Society"},
      age: 9,
    },{
      name: "Buddy",
      listed_date: "2021-09-01",
      breed: "Beagle",
      shelter: {name: "Toronto Humane Society"},
      age: 9,
    },
    {
      name: "Buddy",
      listed_date: "2021-09-01",
      breed: "Beagle",
      shelter: {name: "Toronto Humane Society"},
      age: 9,
    }
  ]


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
          <div className='flex flex-wrap justify-start max-w-[310px] gap-[1rem] md:max-w-[650px] lg:max-w-[996px] xl:max-w-[1000px]'>
            {/* Example Pets */}
            <div className='flex flex-row items-center gap-[.5rem]'>
              <div class="text-[1.5rem] pb-[4px] font-semibold">Latest in Ontario</div>
              <Link to='/search'>
                <Button className='w-[8rem] h-[2rem] flex text-center items-center justify-center' onClick={() => {}} buttonType='' children={
                  <div>See All</div>
                }/>
              </Link>
            </div>
            <div className='flex flex-row flex-wrap justify-start gap-[3rem]'>
              {listings.map((listing) => {
                return <ListingCard listing={listing}/>
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
