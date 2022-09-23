import React from "react";
import { getHalfHourIncrementStrings } from "./utils";
const ProductSelect = ({ roomData }) => {
  const ARRIVAL_TIMES = getHalfHourIncrementStrings("9:00", "16:30");

  return (
    <div className="accordion-item">
      <h2 className="accordion-header" id="panelsStayOpen-headingOne">
        <button
          className="accordion-button"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target={`#panelsStayOpen-${roomData.id}`}
          aria-expanded="true"
          aria-controls={`panelsStayOpen-${roomData.id}`}
        >
          {roomData.name}
        </button>
      </h2>
      <div
        id={`room-${roomData.id}`}
        className="accordion-collapse collapse show"
        aria-labelledby="panelsStayOpen-headingOne"
      >
        <div className="accordion-body">
          <strong>This is the first item's accordion body.</strong> It is shown
          by default, until the collapse plugin adds the appropriate classes
          that we use to style each element. These classes control the overall
          appearance, as well as the showing and hiding via CSS transitions. You
          can modify any of this with custom CSS or overriding our default
          variables. It's also worth noting that just about any HTML can go
          within the <code>.accordion-body</code>, though the transition does
          limit overflow.
        </div>
      </div>
    </div>
  );
};

export default ProductSelect;
