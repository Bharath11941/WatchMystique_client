import { useContext } from "react";
import { addToCart } from "../../api/userApi";
import CartContext from "../../context/cartCountContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Card = ({ product }) => {
  const { title, price, image, offer, _id } = product;

  const { setCartCount } = useContext(CartContext);

  const handleCart = async () => {
    try {
      const res = await addToCart(_id, 1);
      setCartCount(res?.data?.count);
      localStorage.setItem("cartCount", res?.data?.count.toString());
      toast.success(res?.data?.message);
    } catch (error) {
      toast.error(error.response?.data?.message);
      console.log(error.message);
    }
  };

  const renderOffer = () => {
    if (offer) {
      const { type, discount } = offer;
      if (type === "flat") {
        return (
          <>
            <div className="flex justify-between items-center mt-2">
              <div>
                <h3 className="text-lg font-semibold">{title}</h3>
              </div>
              <div className="flex items-center">
                <span className="text-green-600 font-bold text-xl mr-2">
                  ₹{price - discount}
                </span>
                <span className="text-gray-600 line-through">${price}</span>
              </div>
            </div>
            <div className="flex items-center mt-1">
              <span className="text-blue-600 text-sm">
                Flat ₹ {discount} discount
              </span>
            </div>
          </>
        );
      } else if (type === "percentage") {
        return (
          <>
            <div className="flex justify-between items-center mt-2">
              <div>
                <h3 className="text-lg font-semibold">{title}</h3>
              </div>
              <div className="flex items-center">
                <span className="text-green-600 font-bold text-xl mr-2">
                  ₹ {price - price * (discount / 100)}
                </span>
                <span className="text-gray-600 line-through">${price}</span>
              </div>
            </div>
            <div className="flex items-center mt-1">
              <span className="text-blue-600 text-sm">
                Save ₹ {price * (discount / 100)} ({discount}% off)
              </span>
            </div>
          </>
        );
      } else if (type === "buy-one-get-one") {
        return (
          <>
            <div className="flex justify-between items-center mt-2">
              <div>
                <h3 className="text-lg font-semibold">{title}</h3>
              </div>
              <div className="flex items-center">
                <span className="text-green-600 font-bold text-xl mr-2">
                  ₹ {price}
                </span>
              </div>
            </div>
            <div className="flex items-center mt-1">
              <span className="text-blue-600 text-sm">
                Buy One Get One Free
              </span>
            </div>
          </>
        );
      }
    } else {
      return (
        <div className="flex justify-between items-center mt-2">
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
          <div className="flex items-center">
            <span className="text-green-600 font-bold text-xl mr-2">
              ₹ {price}
            </span>
          </div>
        </div>
      );
    }
  };
  return (
    <>
      <div className="flex-shrink-0 pb-3 bg-white border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700 rounded-md hover:bg-blue-100">
        <img
          src={image}
          alt=""
          className="mx-auto object-cover h-40 w-80 rounded-t-md"
        />
        <div className="p-4">
          {renderOffer()}
          <div className="flex items-center justify-center">
            <button
              onClick={handleCart}
              className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-md mt-4 hover:bg-blue-600 transition duration-300 ease-in-out"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Card;
