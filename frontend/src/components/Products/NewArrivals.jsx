import React, { useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import axios from "axios";

const NewArrivals = () => {
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0); // ✅ number
  const [canScrollLeft, setCanScrollLeft] = useState(false); //woking on button left
  const [canScrollRight, setCanScrollRight] = useState(true); //working on button right

  const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`,
        );
        setNewArrivals(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchNewArrivals();
  }, []);

  /*e.pageX means the mouse’s X-axis position in pixels from the left edge of the page. */
  const handleMouseDown = (e) => {
    /*mousedown → button pressed */
    setIsDragging(true);
    console.log("mouse", e.pageX);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    /*Yes — exactly. It gives the mouse position inside the container at the point where you clicked. */
    /*e.pageX - offsetLeft gives how far the mouse is from the left edge inside the container.*/
    setScrollLeft(scrollRef.current.scrollLeft);
  }; /**scrollLeft is inbuilt, stores how many pixels the content has been scrolled from the left edge.*/

  const handleMouseMove = (e) => {
    /*mousemove → mouse moving */
    if (!isDragging) return;
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX;
    /*where dragging started (startX)
     rom where the cursor is now (x)*/
    scrollRef.current.scrollLeft = scrollLeft - walk;
    /*scrollLeft → how far the content was scrolled when dragging started
    walk → how far the mouse has moved*/
  };

  /*onMouseLeave fires when the mouse cursor leaves the element’s area.*/
  /*onMouseUp means the moment the mouse button is released. */
  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  /*(3) It works if there is space available */
  const scroll = (direction) => {
    const scrollAmount = direction === "left" ? -300 : 300;
    scrollRef.current.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    }); /*Refering to the container <div> </div>  DOM Element*/
  }; /**This works only if scrollable container away from the initial positions 0 x-asix, y-axis */

  {
    /*It runs only when the scroll event fires 
    scrollLeft: Number of px the content from the container has been scrolled.
    clientWidth: Total client width visible to the user. 
    containerScrollWidth:Total width of scrollable content inside container.
    */
  }

  /*(2)container.scrollLeft is an inbuilt (built-in) property. */
  const updateScrollButtons = () => {
    const container = scrollRef.current; /*<div> </div>  DOM Element*/
    if (container) {
      const leftScroll =
        container.scrollLeft; /* gives the position of element */
      const rightScrollable =
        container.scrollWidth > leftScroll + container.clientWidth + 1; //(Handing the right width of container) This condition works on false(check canScrollRight) till it becmomes equal total container width.
      setCanScrollLeft(leftScroll > 0); //If it is true move the element of 300px,moving away from left means to right and again back to initial point 0.
      setCanScrollRight(rightScrollable);
    }
    /*We use setCanScrollLeft and setCanScrollRight to track whether scrolling is POSSIBLE on the left or right, 
    so we can enable/disable the arrow buttons correctly. */
    /** console.log({
      scrollLeft: container.scrollLeft,
      clientWidth: container.clientWidth,
      containerScrollWidth: container.scrollWidth,
      offsetLeft: scrollRef.current.offsetLeft,
    }); */
  };

  /*(1) */
  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.addEventListener("scroll", updateScrollButtons);
      updateScrollButtons();
      return () => container.removeEventListener("scroll", updateScrollButtons);
    }
  }, [newArrivals]);
  //When the container is scrolled horizontally, the updateScrollButtons function runs.
  return (
    <section className="px-4 lg:px-2">
      <div className="container mx-auto text-center mb-10 relative">
        <h2 className="text-3xl font-bold mb-4">Explore New Arrivals</h2>
        <p className="text-lg text-gray-600 mb-8">
          “Discover the latest styles straight off the runway, where bold
          designs and timeless elegance come together for every season.”
        </p>
        {/*Scroll Bottons */}
        <div className="absolute right-0 -bottom-7.5 flex space-x-2">
          <button
            onClick={() => scroll("left")}
            /*when canScrollLeft becomes false, !false => true*/
            disabled={!canScrollLeft}
            className={`p-2 rounded border ${
              canScrollLeft
                ? "bg-white text-black"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <FiChevronLeft className="text-2xl" />
          </button>
          <button
            onClick={() => scroll("right")}
            className={`p-2 rounded border ${
              canScrollRight
                ? "bg-white text-black"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <FiChevronRight className="text-2xl" />
          </button>
        </div>
      </div>
      {/*Scrollable Content */}
      <div
        ref={scrollRef}
        className={`container mx-auto overflow-x-scroll flex space-x-6 relative custom-scroll ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
      >
        {/*Using ?. can return undefined — and that’s the point. */
        /*Without ?. (danger) If images[0] is missing → 💥 runtime error*/}
        {newArrivals.map((product) => {
          return (
            <div
              key={product._id}
              className="min-w-full sm:min-w-[50%] lg:min-w-[30%] relative"
            >
              <img
                src={product.images[0]?.url}
                alt={product.images[0]?.altText || product.name}
                className="w-full h-125 object-cover rounded-lg"
                draggable="false"
              />
              {/*left-0 and right-0 mean:the element is stretched from the left edge to the right edge of its parent.*/}
              <div className="absolute bottom-0 left-0 right-0 bg-opacity-50 backdrop-blur-md text-white p-4 rounded-b-lg">
                <Link to={`/product/${product._id}`} className="block">
                  <h4 className="font-medium">{product.name}</h4>
                  <p className="mt-1">${product.price}</p>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default NewArrivals;

/*Imported in Home.jsx (2.3)*/
