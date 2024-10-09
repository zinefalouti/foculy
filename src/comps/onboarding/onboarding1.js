import React from 'react'
import { Link } from 'react-router-dom'

function Onboarding1() {
  return (
    <>
         <div className="onboardinghead">
            <h4>Streamline Your Tasks, Focus Your Day.</h4>
            <h1>Welcome to <span>Foculy!</span></h1>
            <h2>1/3</h2>
         </div>
         <div className="onboardbody">
            <p>
            We’re thrilled to have you join Foculy, where your productivity is our priority. This app is designed to help you manage your tasks effortlessly, so you can focus on what truly matters. Whether you're juggling multiple projects or just need a simple way to keep track of your daily to-dos, Foculy has got you covered. Let’s kickstart your journey by setting up your profile and creating your very first task. Here’s to a more organized, efficient, and stress-free day!
            </p>
         </div>
         <Link className="TheButton" to="onboard2">Next</Link>
    </>
  )
}

export default Onboarding1