import React, { useState, useEffect } from 'react';
import Page from '../components/layout/Page';
import SearchSideBar from '../components/search/SearchSideBar';

export const Search = () => {
  const [listings, setListings] = useState([]);
  const [pageRequested, setPageRequested] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(listings)
  }, [listings])

  return (
    <Page>
      <div className='flex justify-center sm:flex-col'>
        <aside className='md:sticky md:top-0'>
          <SearchSideBar 
            setListings={setListings} 
            pageRequested={pageRequested} 
            setPageRequested={setPageRequested} 
            loading={loading}
            setLoading={setLoading}
          />
        </aside>

        <div>

        </div>
      </div>
    </Page>
  );
}
