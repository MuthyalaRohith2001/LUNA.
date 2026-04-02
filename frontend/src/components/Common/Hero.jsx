import React from "react";
import homeImg from "../../assets/home.jpg";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative">
      <img
        src={homeImg}
        alt="Home"
        className="w-full h-400px md:h-600px  object-cover"
      />
      <div className="absolute inset-0   flex items-center justify-center">
        <div className="text-center text-white p-6">
          <h1 className="text-4xl md:text-9xl font-bold tracking-tighter uppercase mb-4 hover:text-yellow-500">
            Shop Now!
          </h1>
          <p className="text-sm text-center tracking-tighter md:text-lg mb-6">
            Explore our vaction-ready outfits with fast worldwide shipping.
          </p>

          <Link
            to="/collections"
            className="bg-white text-black px-2 py-2 md:px-4 lg:px-6  rounded-sm text-lg hover:bg-gray-200"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;

{
  /*2.1 */
}
/*Inserting in Home.jsx */
