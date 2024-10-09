import React from 'react';
import OnBoardingArtwork from '../../img/onboarding.png';
import LoginHeader from '../login/loginHeader';
import { Route, Routes } from 'react-router-dom';
import Onboarding1 from './onboarding1';
import Onboarding2 from './onboarding2';
import Onboarding3 from './onboarding3';

function Onboarding({isDark = false, Switcher}) {
  return (
    <div className="grid grid-cols-12 LoginPanel container mx-auto">
      <div className="hidden xl:block lg:col-span-4">
        <div className="onboardingside">
          <img src={OnBoardingArtwork} alt="Foculy Onboarding" />
        </div>
      </div>
      <div className="col-span-12 xl:col-span-8 onboarding">
        <LoginHeader isDark={isDark} handleChange={Switcher} />
        <Routes>
          <Route path="/" element={<Onboarding1 />} />
          <Route path="onboard2" element={<Onboarding2 />} />
          <Route path="onboard3" element={<Onboarding3 />} />
        </Routes>
      </div>
    </div>
  );
}

export default Onboarding;
