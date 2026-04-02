import React, { useState } from "react";
import { HiMagnifyingGlass, HiMiniXMark } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import {
  fetchProductsByFilters,
  setFilters,
} from "../../redux/slices/productsSlice";
import { useDispatch } from "react-redux";

const Searchbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSearchToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setFilters({ search: searchTerm }));
    dispatch(fetchProductsByFilters({ search: searchTerm }));
    //Filters the products and collection component is rendered
    navigate(`/collections/all?search=${searchTerm}`);
    setIsOpen(false); /*After click search close the search bar */
  };
  /*isOpen ? default absolute to the body */
  /*transition: all 50ms; */
  return (
    <div
      className={`flex items-center justify-center w-full transition-all duration-50 ${
        isOpen ? "absolute top-0 left-0  bg-black h-26.5 z-50" : "w-auto"
      }`}
    >
      {isOpen ? (
        <form
          onSubmit={handleSearch}
          className="relative flex items-center justify-center w-full "
        >
          <div className="relative w-1/2">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-100 px-4 py-2 pl-2 pr-12 rounded-lg focus:outline-none w-full placeholder:text-gray-700"
            ></input>
            {/*search icon */}
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 cursor-pointer "
            >
              <HiMagnifyingGlass className="h-6 w-6" />
            </button>
          </div>
          {/*close button */}
          <button
            type="button"
            onClick={handleSearchToggle}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-red-800"
          >
            <HiMiniXMark />
          </button>
        </form>
      ) : (
        <button onClick={handleSearchToggle}>
          <HiMagnifyingGlass className="h-6 w-6 hover:cursor-pointer" />{" "}
        </button>
      )}
    </div>
  );
};

export default Searchbar;
/* transform: translateY(-50%); /* -translate-y-1/2 */

/**Inserting this in Navbar */
