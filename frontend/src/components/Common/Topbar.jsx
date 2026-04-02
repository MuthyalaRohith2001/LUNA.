import React from "react";
import { TbBrandMeta } from "react-icons/tb";
import { IoLogoInstagram } from "react-icons/io";
import { RiTwitterXLine } from "react-icons/ri";
const Topbar = () => {
  return (
    <div className="bg-rabbit-red text-white">
      <div className="container mx-auto flex justify-between items-center px-4 py-3">
        <div className="hidden md:flex items-center space-x-4">
          <a href="" className="hover:text-gray-300">
            <TbBrandMeta className="h-5 w-5" />
          </a>
          <a href="" className="hover:text-gray-300">
            <IoLogoInstagram className="h-5 w-5" />
          </a>
          <a href="" className="hover:text-gray-300">
            <RiTwitterXLine className="h-4 w-4" />
          </a>
        </div>
        <div className="text-sm text-center grow ">
          <span className="text-amber-50">Where Style Begins!</span>
        </div>
        <div className="hidden  md:block text-sm  ">
          <a href="tel:+12345" className="hover:text-gray-300">
            +1(482) 597-378
          </a>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
/*Inserted inside Header.jsx(1.1) */
