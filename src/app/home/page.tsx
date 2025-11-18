import React from 'react'
import MainSection from '@/components/homeComponents/mainSection'
import ServiceSection from '@/components/homeComponents/serviceSection'
import HoworkSection from '@/components/homeComponents/howork'
import GetintouchSection from '@/components/homeComponents/getintouch'
import Comments from '@/components/homeComponents/Comments'
import CurrentFocus from '@/components/homeComponents/CurrentFocus'
import Navbar from '@/components/homeComponents/Navbar'
import Footer from '@/components/homeComponents/footer'
import WhySection from '@/components/homeComponents/why'

const HomePage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <MainSection/>
        <ServiceSection/>
        <HoworkSection/>

        <CurrentFocus/>
        {/* Current Focus */}
        <WhySection/>
        <GetintouchSection/>
        <Comments/>
      </main>
    </div>
  )
}

export default HomePage
