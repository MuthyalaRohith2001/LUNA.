import React from "react";
import Header from "./../components/Common/Header";
import Footer from "../components/Common/Footer";
import { Outlet } from "react-router-dom";

const UserLayout = () => {
  return (
    <>
      {/*Header */}
      <Header />
      {/*Main content */}
      <main>
        <Outlet />
        {/*<Home/> */}
        {/*<Login/> */}
        {/*<Register/> */}
        {/*<Profile/>*/}
        {/*<CollectionPage />*/}
        {/**<OrderConfirmationPage /> */}
      </main>
      {/*Footer */}
      <Footer />
    </>
  );
};

export default UserLayout;

/*displayed from the route from App.jsx */

{
  /*Home page */
}

//note:UserLayout is the parent element in App.js
//Note:Outlet = "Render the matched child route here"
