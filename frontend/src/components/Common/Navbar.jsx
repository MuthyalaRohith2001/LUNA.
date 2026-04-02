import { useState } from "react";
import { Link } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import { useSelector } from "react-redux";

import {
  HiOutlineUser,
  HiOutlineShoppingBag,
  HiBars3BottomRight,
} from "react-icons/hi2";
import Searchbar from "./Searchbar";
import CartDrawer from "./CartDrawer";

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const cartItemCount =
    cart?.products?.reduce((total, product) => total + product.quantity, 0) ||
    0;

  const toogleCartDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const toggleNavDrawer = () => {
    setNavDrawerOpen(!navDrawerOpen);
  };
  return (
    <>
      <nav className="container mx-auto flex items-center justify-between px-6 py-4">
        {/**Left-Logo */}
        <div className="">
          <Link to="/" className="text-2xl font-medium">
            LUNA
          </Link>
        </div>
        {/**Center-Navigation Links */}
        <div className=" hidden md:flex space-x-6">
          <Link
            to="/collections/all?gender=Men"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            MEN
          </Link>
          <Link
            to="/collections/all?gender=Women"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            WOMEN
          </Link>
          <Link
            to="/collections/all?category=Top Wear"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            TOPWEAR
          </Link>
          <Link
            to="/collections/all?category=Bottom Wear"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            BOTTOMWEAR
          </Link>
        </div>
        {/**Right -Icons */}
        <div className="flex items-center space-x-4">
          {user && user.role == "admin" && (
            <Link
              to="/admin"
              className="block bg-black px-2 rounded-full text-sm text-white p-0.5"
            >
              Admin
            </Link>
          )}
          {/*User-Icon */}
          <Link to="/profile" className="hover:text-black">
            <HiOutlineUser className="h-6 w-6 text-gray-700" />
          </Link>
          {/**Cart-Icon */}
          <button
            onClick={toogleCartDrawer}
            className="relative hover:text-black cursor-pointer"
          >
            <HiOutlineShoppingBag className="h-6 w-6 text-gray-700" />
            {cartItemCount > 0 && (
              <span className="absolute bottom-2 left-3 bg-rabbit-red text-white text-xs rounded-full px-2 py-0.5">
                {cartItemCount}
              </span>
            )}
          </button>
          {/**Search-Icon */}
          <div>
            <Searchbar />
          </div>

          {/*Bar hidden on large screen Only on Mobile Navigation  */}
          <button
            onClick={toggleNavDrawer}
            className="md:hidden hover:cursor-pointer"
          >
            <HiBars3BottomRight className="h-6 w-6 text-gray-700" />
          </button>
        </div>
      </nav>
      {/*Onclick on Cart-Icon drawerOpen(state) toogleCartDrawer(function)*/}
      {/*Display it from the left based on css dont confuse your self why component is written here*/}
      {/**=================> */}{" "}
      <CartDrawer drawerOpen={drawerOpen} toogleCartDrawer={toogleCartDrawer} />
      {/*Mobile Navigation */}
      <div
        className={`fixed top-0 left-0 w-3/4 sm:w-1/2 md:w-1/3 h-full bg-white shadow-lg transform transition-transform duration-300 z-50 ${
          navDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-end p-4">
          <button onClick={toggleNavDrawer}>
            <IoMdClose className="h-6 w-6 text-gray-600" />
          </button>
        </div>
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">
            
           <nav className="space-y-4">
              <Link
                to="/collections/all?gender=Men"
                onClick={toggleNavDrawer}
                className="block text-gray-600 hover:text-black"
              >
                Men
              </Link>
              <Link
                to="/collections/all?gender=Women"
                onClick={toggleNavDrawer}
                className="block text-gray-600 hover:text-black"
              >
                Women
              </Link>
              <Link
                to="/collections/all?category=Top Wear"
                onClick={toggleNavDrawer}
                className="block text-gray-600 hover:text-black"
              >
                Top Wear
              </Link>
              <Link
                to="/collections/all?category=Bottom Wear"
                onClick={toggleNavDrawer}
                className="block text-gray-600 hover:text-black"
              >
                Bottom Wear
              </Link>
            </nav> 
          </h2>
        </div>
      </div>
    </>
  );
};

export default Navbar;

/*Inserting in Header.jsx (1.2)*/
