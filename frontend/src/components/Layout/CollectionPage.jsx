import { useEffect, useRef, useState } from "react";
import { FaFilter } from "react-icons/fa";
import FilterSidebar from "../Products/FilterSidebar";
import SortOptions from "../Products/SortOptions";
import ProductGrid from "./../Products/ProductGrid";
import { useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByFilters } from "./../../redux/slices/productsSlice";

const CollectionPage = () => {
  const { collection } = useParams();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const queryParams = Object.fromEntries([...searchParams]);
  /**To store the products */
  const sidebarRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProductsByFilters({ collection, ...queryParams }));
  }, [dispatch, collection, searchParams.toString()]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  /*sidebarRef.current points to the actual DOM element,sidebarRef.current = <div>...</div>*/

  const handleClickOutside = (e) => {
    //Close sidebar if clicked outside
    /* console.log("current", sidebarRef.current); //Sibbling
    console.log("event", e.target); //Sibbling*/
    if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    //Add Event Listner for clicks
    document.addEventListener("mousedown", handleClickOutside);
    //cleanup function
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  /*Moving from one page to another page (route change)  the component unmounts
  Yes — when you navigate from one page to another, the component unmounts and the cleanup function runs.*/

  return (
    <div className="flex flex-col lg:flex-row">
      {/**Mobile Filter Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden border p-2 flex justify-center items-center"
      >
        <FaFilter className="mr-2" /> Filters
      </button>
      {/*Filter Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0  w-60 lg:w-64  h-full bg-white shadow-lg transition-transform duration-300 flex flex-col z-50 lg:static lg:translate-x-0 overflow-y-auto
       ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} `}
      >
        {/*========>*/} <FilterSidebar />
      </div>
      <div className="grow p-4">
        <h2 className="text-2xl uppercase mb-4">All Collection</h2>
        {/*Sort Options */}
        {/*========> */} <SortOptions />
        {/*Product Grid */}
        {/*========> */}{" "}
        <ProductGrid products={products} loading={loading} error={error} />
      </div>
    </div>
  );
};

export default CollectionPage;

/*This is (4) */
