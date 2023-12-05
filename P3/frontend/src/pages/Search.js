import React, { useState, useEffect, useRef, useCallback } from 'react';
import Page from '../components/layout/Page';
import SearchSideBar from '../components/search/SearchSideBar';
import SearchItems from '../components/search/SearchItems';

export const Search = () => {
  const [listings, setListings] = useState([]);
  const [pageRequested, setPageRequested] = useState(false);
  const [loading, setLoading] = useState(false);
  const observer = useRef();

  const lastListingElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setPageRequested(true);
      }
    })
    if (node) observer.current.observe(node);
  })

  useEffect(() => {
    console.log(listings)
  }, [listings])

  return (
    <Page>
      <div className='flex'>
        <div className='h-screen sticky top-[5rem] min-w-[25rem]'>
          <SearchSideBar 
            setListings={setListings} 
            pageRequested={pageRequested} 
            setPageRequested={setPageRequested} 
            loading={loading}
            setLoading={setLoading}
          />
        </div>

        <div className=''>
          <SearchItems listings={listings} lastListingElementRef={lastListingElementRef} />
        </div>
      </div>
    </Page>
  );
}
