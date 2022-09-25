import React, { useContext } from "react";
import { ProductSelectContext } from "../context";
import { setProductQuantity } from "../context/actions";
import { BsPlusLg, BsDashLg } from "react-icons/bs";

const ProductListItem = ({ product, roomId }) => {
  const [state, dispatch] = useContext(ProductSelectContext);
  const onChange = (e) => {
    dispatch(setProductQuantity(roomId, product.id, e.target.value));
  };

  return (
    <div className="row g-0 gy-1">
      <div className="col-5 col-lg-4 offset-lg-2">{product.name}</div>
      <div className="col-4 col-lg-2 text-center text-lg-start">
        ${product.price / 100}
      </div>
      <div className="col-3 col-lg-2">
        <div className="input-group input-group-sm mb-3 d-flex">
          <div className="btn btn-outline-secondary d-flex justify-content-center align-items-center p-1">
            <BsDashLg />
          </div>

          <input
            type="text"
            className="form-control p-0 text-center"
            aria-label={product.name}
            value={product.quantity}
            onChange={onChange}
          />
          <div className="btn btn-outline-secondary d-flex justify-content-center align-items-center p-1">
            <BsPlusLg />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListItem;
