'use client';

import CurrentlyListening from '../../Banners/CurrentlyListening';
import LocationAndTime from '../../Banners/LocationAndTime';
import PagesAndLinks from '../../Banners/PagesAndLinks';

const Banners = () => {
  return (
    <div className='space-y-6'>
      <PagesAndLinks />
      <div className='flex flex-col sm:grid sm:grid-cols-2 gap-6'>
        <CurrentlyListening />
        <LocationAndTime />
      </div>
    </div>
  );
};

export default Banners;
