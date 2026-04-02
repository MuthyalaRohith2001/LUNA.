import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { updateProduct } from "../../redux/slices/adminProductSlice";
import { fetchProductDetails } from "../../redux/slices/productsSlice";

const EditProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams(); // To get value from the route url
  const { selectedProduct, loading, error } = useSelector(
    (state) => state.products,
  );
  /**Holds the product information */
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: 0,
    countInStock: 0,
    sku: "",
    category: "",
    brand: "",
    sizes: [],
    colors: [],
    collections: "",
    material: "",
    gender: "",
    images: [],
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedProduct) {
      setProductData((prev) => ({
        ...prev,
        ...selectedProduct,
        images: selectedProduct.images || [],
      }));
    }
  }, [selectedProduct]);

  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]:
        name === "price" || name === "countInStock"
          ? Number(value) // 🔥 convert to number
          : value,
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return; // ✅ prevent crash
    console.log("Uploading file:", file);
    const formData = new FormData();
    formData.append("image", file); // 🔥 change here if needed
    try {
      setUploading(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      {
        /*Yes — this function returns a NEW updated state object */
      }
      console.log("Upload response:", data);

      const imageUrl = data.imageUrl || data.url;
      setProductData((prevData) => ({
        ...prevData,
        images: [
          ...(prevData.images || []),
          { url: data.imageUrl, altText: "" },
        ],
      }));
      setUploading(false);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setProductData((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProduct({ id, productData }));
    navigate("/admin/products");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 shadow-md rounded-md">
      <h2 className="text-3xl font-bold mb-6">Edit Product</h2>
      <form onSubmit={handleSubmit}>
        {/*Name */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Product Name</label>
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>
        {/*Description */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Description</label>
          <textarea
            name="description"
            value={productData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2"
            rows={4}
            required
          />
        </div>
        {/**price */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Price</label>
          <input
            type="number"
            name="price"
            value={productData.price}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        {/**Count In stock */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Count in Stock</label>
          <input
            type="number"
            name="countInStock"
            value={productData.countInStock}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        {/**SKU */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">SKU</label>
          <input
            type="text"
            name="sku"
            value={productData.sku}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        {/*Sizes */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">
            Sizes (comma-separated)
          </label>
          <input
            type="text"
            name="sizes"
            value={productData.sizes.join(",")} //Array to a string displayed on the browser
            onChange={(e) =>
              setProductData((prev) => ({
                ...prev,
                sizes: e.target.value.split(",").map((s) => s.trim()),
              }))
            }
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        {/**Colors */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">
            Colors(comma-separated)
          </label>
          <input
            type="text"
            name="colors"
            value={productData.colors.join(",")} //Array to a string displayed on the browser
            onChange={(e) =>
              setProductData((prev) => ({
                ...prev,
                colors: e.target.value.split(",").map((c) => c.trim()),
              }))
            }
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        {/*Image Upload */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Upload Image</label>
          <input
            type="file"
            onChange={handleImageUpload}
            className="
    block w-57.5 text-sm text-gray-600 border border-gray-300 rounded-md
    cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0
    file:text-sm file:font-semibold file:bg-blue-600 file:text-white   hover:file:bg-blue-700
  "
          />
          {uploading && <p>Uploading Image...</p>}
          <div className="flex gap-4 mt-4 relative">
            {productData.images.map((image, index) => {
              return (
                <div key={index}>
                  <img
                    src={image.url}
                    alt={image.altText || "Product Image"}
                    className="w-20 h-20 object-cover rounded-md shadow-md"
                  />
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="text-red-500 absolute -top-1  cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors"
        >
          Upload Product
        </button>
      </form>
    </div>
  );
};

export default EditProductPage;
{
  /* //note:6.5 */
}
