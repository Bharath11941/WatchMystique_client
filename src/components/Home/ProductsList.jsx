import { useEffect, useState } from "react";
import Card from "./Card";
import { productList } from "../../api/userApi";
import ShimmerUi from "../Shimmer/ShimmerUi";
const ProductsList = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  useEffect(() => {
    setLoading(true)
    productList()
      .then((res) => {
        setLoading(false);
        setProducts(res?.data);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err.message);
      });
  }, []);
  
  return (
    <div className="pt-10 pb-32">
      <div>
        <h1 className="head_text mb-9 text-center">Watches</h1>

        {!loading ? (
          <div className="flex flex-col justify-center flex-wrap md:ml-14 lg:ml-24 lg:mr-10 md:flex-row gap-3 md:gap-5 lg:gap-8 xl:gap-16">

            {products && products.length > 0 &&
              products.map((product) => {
                return (
                  <div key={product._id}>
                    <Card product={product} />
                  </div>
                );
              })}
           
          </div>
        ) : (
          <ShimmerUi />
        )}
      </div>
    </div>
  );
};

export default ProductsList;
