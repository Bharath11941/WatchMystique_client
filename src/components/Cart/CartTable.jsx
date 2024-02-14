import { faIndianRupeeSign, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { cartProducts, deleteCartProdut, updateCart } from "../../api/userApi";
import Loading from "../../Loading/Loading";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CartContext from "../../context/cartCountContext";

const debounce = (func, delay) => {
  let timerId;

  return function (...args) {
    clearTimeout(timerId);

    timerId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};
const CartTable = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setCartCount } = useContext(CartContext);
  useEffect(() => {
    console.log("hi");
    setLoading(true);
    cartProducts()
      .then((res) => {
        setCartItems(res?.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
        setLoading(false);
      });
  }, []);

  const findOverAllTotal = () => {
    const subtotal = cartItems.reduce((total, cart) => {
      if (cart?.productId?.offer) {
        if (cart?.productId?.offer?.type === "buy-one-get-one") {
          return total + cart?.quantity * cart?.productId?.price;
        } else if (cart?.productId?.offer?.type === "flat") {
          return (
            total +
            cart?.quantity *
              (cart?.productId?.price - cart?.productId?.offer?.discount)
          );
        } else if (cart?.productId?.offer?.type === "percentage") {
          return (
            total +
            cart?.quantity *
              (cart?.productId?.price -
                (cart?.productId?.price * cart?.productId?.offer?.discount) /
                  100)
          );
        }
      } else {
        return total + cart?.quantity * cart?.productId?.price;
      }
    }, 0);

    return subtotal;
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    try {
      const res = await updateCart(productId, newQuantity);
      setCartItems(res?.data);
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const debounedUpdate = debounce(handleQuantityChange, 500);

  const handleDebouncedUpdateCart = async (productId, newQuantity) => {
    debounedUpdate(productId, newQuantity);
  };

  const deleteProduct = async (cartId) => {
    try {
      const res = await deleteCartProdut(cartId);
      setCartItems(res?.data?.cart);
      setCartCount(res?.data?.count);
      localStorage.setItem("cartCount", res?.data?.count.toString());
      toast.success(res?.data?.message);
    } catch (error) {
      toast.error(error.response?.data?.message);
      console.log(error.message);
    }
  };

  return (
    <>
      <div className="overflow-x-auto p-16">
        <h1 className="text-3xl font-extrabold font-serif my-9 text-start">
          My cart
        </h1>

        {loading ? (
          <div className="fixed inset-0 flex items-center justify-center">
            <div className="spinnerouter">
              <Loading />
            </div>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="table">
              {/* head */}
              <thead className="text-lg text-white bg-gray-800">
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Offer Details</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {cartItems && cartItems.length > 0 ? (
                  cartItems.map((cart) => (
                    <tr key={cart._id}>
                      <td>
                        <label>
                          <div
                            onClick={() => {
                              deleteProduct(cart._id);
                            }}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </div>
                        </label>
                      </td>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="mask mask-squircle w-28 h-28">
                              <img
                                src={cart?.productId?.image}
                                alt="Avatar Tailwind CSS Component"
                              />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">
                              {cart?.productId?.title}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          {cart?.productId?.offer && (
                            <>
                              {cart?.productId?.offer?.type === "flat" && (
                                <>
                                  <span className="text-gray-500 line-through mr-2">
                                    <FontAwesomeIcon icon={faIndianRupeeSign} />{" "}
                                    {cart?.productId?.price}
                                  </span>

                                  <span className="text-lg font-bold text-blue-500 dark:text-gray-400">
                                    <FontAwesomeIcon icon={faIndianRupeeSign} />{" "}
                                    {cart?.productId?.price -
                                      cart?.productId?.offer?.discount}
                                  </span>
                                </>
                              )}
                              {cart?.productId?.offer?.type ===
                                "percentage" && (
                                <>
                                  <span className="text-gray-500 line-through mr-2">
                                    <FontAwesomeIcon icon={faIndianRupeeSign} />{" "}
                                    {cart?.productId?.price}
                                  </span>

                                  <span className="text-lg font-bold text-blue-500 dark:text-gray-400">
                                    <FontAwesomeIcon icon={faIndianRupeeSign} />{" "}
                                    {cart?.productId?.price -
                                      (cart?.productId?.price *
                                        cart?.productId?.offer?.discount) /
                                        100}
                                  </span>
                                </>
                              )}
                            </>
                          )}

                          {!cart?.productId?.offer ||
                            (cart?.productId?.offer?.type ===
                              "buy-one-get-one" && (
                              <>
                                {/* Actual Price */}
                                <span className="text-lg font-bold text-blue-500 dark:text-gray-400">
                                  <FontAwesomeIcon icon={faIndianRupeeSign} />{" "}
                                  {cart?.productId?.price}
                                </span>
                              </>
                            ))}
                        </div>
                      </td>

                      <td className="offer-details">
                        {cart?.productId?.offer?.type === "flat" && (
                          <span className="text-blue-500 font-bold">
                            Flat <FontAwesomeIcon icon={faIndianRupeeSign} />{" "}
                            {cart?.productId?.offer?.discount} off
                          </span>
                        )}
                        {cart?.productId?.offer?.type === "percentage" && (
                          <span className="text-blue-500 font-bold">
                            {cart?.productId?.offer?.discount}% off
                          </span>
                        )}
                        {cart?.productId?.offer?.type === "buy-one-get-one" && (
                          <div className="flex items-center">
                            <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                              <img
                                src={
                                  cart?.productId?.offer?.buyOneGetOneProduct
                                    ?.image
                                }
                                alt="Product"
                                className="object-cover w-full h-full"
                              />
                            </div>
                            <div>
                              <p className="text-blue-500">
                                Buy one, get one free!
                              </p>
                              <p className="text-sm font-semibold text-gray-600">
                                {
                                  cart?.productId?.offer?.buyOneGetOneProduct
                                    ?.title
                                }
                              </p>
                            </div>
                          </div>
                        )}

                        {!cart?.productId?.offer && <span>No offer</span>}
                      </td>

                      <td>
                        <div className="flex items-center">
                          <button
                            onClick={() =>
                              cart.quantity > 1 &&
                              handleDebouncedUpdateCart(
                                cart?.productId?._id,
                                cart?.quantity - 1
                              )
                            }
                            disabled={cart.quantity === 1} // Disable the button if cart quantity is 1
                            className="btn btn-ghost btn-xs px-2 py-1 border border-gray-300 rounded-l-md hover:bg-gray-100"
                          >
                            -
                          </button>
                          <span className="px-2 text-gray-800">
                            {cart?.quantity}
                          </span>{" "}
                          <button
                            onClick={() =>
                              cart.quantity < cart?.productId?.quantity && // Disable the button if cart quantity equals product quantity
                              handleDebouncedUpdateCart(
                                cart?.productId?._id,
                                cart?.quantity + 1
                              )
                            }
                            disabled={
                              cart.quantity === cart?.productId?.quantity
                            } // Disable the button if cart quantity equals product quantity
                            className="btn btn-ghost btn-xs px-2 py-1 border border-gray-300 rounded-r-md hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                      </td>

                      <td>
                        {cart?.productId?.offer ? (
                          <>
                            {cart?.productId?.offer?.type ===
                            "buy-one-get-one" ? (
                              <>
                                <FontAwesomeIcon icon={faIndianRupeeSign} />{" "}
                                {cart?.quantity * cart?.productId?.price}
                              </>
                            ) : (
                              <>
                                {cart?.productId?.offer?.type === "flat" ? (
                                  <>
                                    <FontAwesomeIcon icon={faIndianRupeeSign} />{" "}
                                    {cart?.quantity *
                                      (cart?.productId?.price -
                                        cart?.productId?.offer?.discount)}
                                  </>
                                ) : (
                                  <>
                                    <FontAwesomeIcon icon={faIndianRupeeSign} />{" "}
                                    {cart?.quantity *
                                      (cart?.productId?.price -
                                        (cart?.productId?.price *
                                          cart?.productId?.offer?.discount) /
                                          100)}
                                  </>
                                )}
                              </>
                            )}
                          </>
                        ) : (
                          <>
                            <FontAwesomeIcon icon={faIndianRupeeSign} />{" "}
                            {cart?.quantity * cart?.productId?.price}
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="text-center font-semibold text-xl">
                    <td colSpan="6" className="py-4">
                      Empty cart
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {cartItems && cartItems.length > 0 && (
              <div className="flex justify-end">
                {" "}
                {/* Changed alignment to justify-end */}
                <div className="w-full px-4 mb-4 lg:w-1/4">
                  <div className="p-6 border border-blue-100 dark:bg-gray-900 dark:border-gray-900 bg-gray-50 md:p-8">
                    <h2 className="mb-8 text-3xl font-bold text-gray-700 dark:text-gray-400">
                      Order Summary
                    </h2>

                    <div className="flex items-center justify-between pb-4 mb-4 ">
                      <span className="text-gray-700 dark:text-gray-400">
                        Order Total
                      </span>
                      <span className="text-xl font-bold text-gray-700 dark:text-gray-400">
                        <FontAwesomeIcon icon={faIndianRupeeSign} />{" "}
                        {findOverAllTotal()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between ">
                      <button className="block w-full py-4 font-bold text-center text-gray-100 uppercase bg-blue-500 rounded-md hover:bg-blue-600">
                        Checkout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default CartTable;
