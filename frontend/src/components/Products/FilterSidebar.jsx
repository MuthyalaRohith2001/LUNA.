import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const FilterSidebar = () => {
  /**To read and modify query parameters */
  const [searchParams, setSearchParams] = useSearchParams();
  /**Navigate to new url using parameters */
  /*Sorting all values of the filters the user selects*/
  const [filters, setFilters] = useState({
    category: "",
    gender: "",
    color: "",
    size: [],
    material: [],
    brand: [],
    minPrice: 0,
    maxPrice: 100,
  });

  /**Pice range to work with */
  const [priceRange, setPriceRange] = useState([0, 100]);

  const categories = ["Top Wear", "Bottom Wear"];

  const genders = ["Men", "Women"];

  const colors = [
    "Red",
    "Blue",
    "Black",
    "Green",
    "Yellow",
    "Gray",
    "White",
    "Pink",
    "Beige",
    "Navy",
  ];

  /*Can choose multiple */
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  /*Can choose multiple */
  const materials = [
    "Cotton",
    "Wool",
    "Denim",
    "Polyester",
    "Silk",
    "Linen",
    "Viscose",
    "Fleece",
  ];
  /*Can choose multiple */
  const brands = [
    "Urban Threads",
    "Modern Fit",
    "Street Style",
    "Beach Breeze",
    "Fashionista",
    "ChicStyle",
  ];

  /*At first rendering it get regestered 
  When mounted useffect runs but nothing to display
  Changes when searchParams change (3)*/
  useEffect(() => {
    /*Converting array of arrays into an object */
    /**useSearchParams() stores in the form of arrays */
    const params = Object.fromEntries([...searchParams]);

    const min = Number(params.minPrice) || 0;
    const max = Number(params.maxPrice) || 100;
    setFilters({
      category: params.category || "",
      gender: params.gender || "",
      color: params.color || "",
      size: params.size ? params.size.split(",") : [],
      material: params.material ? params.material.split(",") : [],
      brand: params.brand ? params.brand.split(",") : [],
      minPrice: min,
      maxPrice: max,
    });
    setPriceRange([min, max]);
  }, [searchParams]);

  /*====>value is getting from the browser(1)*/
  const handleFilterChange = (e) => {
    const { name, value, checked, type } = e.target;
    console.log({ name, value, checked, type });
    /*Multiple values should be stored when we click checkbox */
    let newFilters = { ...filters };
    if (type === "checkbox") {
      if (checked) {
        /*newFilters[name] is same as newFilters.category */
        newFilters[name] = [...(newFilters[name] || []), value];
      } else {
        /*newFilters[name] already contains selected values from previous clicks (array) */
        /**Works on checked and unchecked */
        /*From the selected values, remove the one the user just unchecked. (sizes materal brand) M!=M (uncheck)*/
        newFilters[name] = newFilters[name].filter((item) => item !== value);
      }
    } else {
      /*Other than check box */
      /**name=category */
      newFilters[name] = value;
    }
    //setFilters(newFilters); /*State update is scheduled, not applied yet. */
    updateURLParams(newFilters); /*URL changes */
  };

  /*Changes (2) */
  const updateURLParams = (newFilters) => {
    const params = new URLSearchParams();
    // Example newFilters:
    // { category: "Top Wear", size: ["XS", "S"] }
    Object.keys(newFilters).forEach((key) => {
      if (Array.isArray(newFilters[key]) && newFilters[key].length > 0) {
        params.append(key, newFilters[key].join(",")); // "XS" "S"
      } else if (newFilters[key]) {
        params.append(key, newFilters[key]);
      }
    });
    setSearchParams(params);
  };

  const handlePriceChange = (e) => {
    const newPrice = e.target.value;
    const newFilters = { ...filters, minPrice: 0, maxPrice: newPrice };
    setPriceRange([0, newPrice]);
    // setFilters(newFilters);
    updateURLParams(newFilters);
  };

  return (
    <div className="p-4">
      <h3 className="text-xl font-medium text-gray-800 mb-4">Filter</h3>
      {/*Category Filter */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">Category</label>
        {categories.map((category) => {
          return (
            <div key={category} className="flex items-center mb-1">
              <input
                type="radio"
                name="category"
                value={category}
                onChange={handleFilterChange}
                checked={filters.category === category}
                className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300"
              />
              <span className="text-gray-700">{category}</span>
            </div>
          );
        })}
      </div>
      {/*Gender Filter */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">Gender</label>
        {genders.map((gender) => {
          return (
            <div key={gender} className="flex items-center mb-1">
              <input
                type="radio"
                name="gender"
                value={gender}
                onChange={handleFilterChange}
                checked={filters.gender === gender}
                className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300"
              />
              <span className="text-gray-700">{gender}</span>
            </div>
          );
        })}
      </div>
      {/*Color Filter */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">Color</label>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => {
            return (
              <button
                key={color}
                name="color"
                value={color}
                onClick={handleFilterChange}
                className={`w-8 h-8 rounded-full border border-gray-300 cursor-pointer transition hover:scale-105 ${filters.color === color ? "ring-2 ring-blue-500" : ""}`}
                style={{ backgroundColor: color.toLowerCase() }}
              ></button>
            );
          })}
        </div>
      </div>
      {/**Size Filter */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">Size</label>
        {sizes.map((size) => {
          return (
            <div key={size} className="flex items-center mb-1">
              <input
                type="checkbox"
                name="size"
                value={size}
                onChange={handleFilterChange}
                checked={filters.size.includes(size)}
                className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300"
              />
              <span className="text-gray-700">{size}</span>
            </div>
          );
        })}
      </div>
      {/**Material Filter */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">
          Materials
        </label>
        {materials.map((material) => {
          return (
            <div key={material} className="flex items-center mb-1">
              <input
                type="checkbox"
                name="material"
                value={material}
                onChange={handleFilterChange}
                checked={filters.material.includes(material)}
                className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300"
              />
              <span className="text-gray-700">{material}</span>
            </div>
          );
        })}
      </div>
      {/**Brand Filter */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">Brand</label>
        {brands.map((brand) => {
          return (
            <div key={brand} className="flex items-center mb-1">
              <input
                type="checkbox"
                name="brand"
                value={brand}
                onChange={handleFilterChange}
                checked={filters.brand.includes(brand)}
                className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300"
              />
              <span className="text-gray-700">{brand}</span>
            </div>
          );
        })}
      </div>
      {/*Price Range Filter */}
      <div className="mb-8">
        <label className="block text-gray-600 font-medium mb-2">
          Price Range
        </label>
        <input
          type="range"
          name="priceRange"
          min={0}
          max={100}
          value={priceRange[1]}
          onChange={handlePriceChange}
          className="w-full h-2 bg-gray-300 appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-gray-500 mt-2">
          <span>$0</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>
    </div>
  );
};
export default FilterSidebar;

/**Imported in CollectionPage.jsx */

/**This is (4.1) */
