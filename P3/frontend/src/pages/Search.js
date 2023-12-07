import React, { useState, useEffect, useRef, useCallback } from 'react';
import Page from '../components/layout/Page';
import SearchSideBar from '../components/search/SearchSideBar';
import SearchItems from '../components/search/SearchItems';

export const Search = () => {
  const [listings, setListings] = useState([]);
  const [pageRequested, setPageRequested] = useState(1);
  const [loading, setLoading] = useState(false);
  const observer = useRef();

  const lastListingElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        observer.current.disconnect();
        setPageRequested((prev) => prev + 1);
      }
    })
    if (node) observer.current.observe(node);
  })

  useEffect(() => {
    console.log(listings)
  }, [listings])

  return (
    <Page>
      <div className='flex flex-col items-center gap-[1rem] md:items-start md:flex-row md:gap-0'>
        <div className='min-w-[22rem] flex justify-center md:block md:h-screen md:sticky md:top-[5rem]'>
          <SearchSideBar 
            setListings={setListings} 
            pageRequested={pageRequested} 
            setPageRequested={setPageRequested} 
            loading={loading}
            setLoading={setLoading}
          />
        </div>

        <div className=''>
          <SearchItems listings={listings} lastListingElementRef={lastListingElementRef} loading={loading} />
        </div>
      </div>
    </Page>
  );
}
