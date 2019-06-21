import React from "react";

// https://gist.github.com/dronzer92/83a32f98ae222e7f465e

const RatingStar = () => {
  return (
    <>
      <fieldset class="rate">
        <input type="radio" id="rating10" name="rating" value="10" />
        <label for="rating10" title="5 stars" />
        <input type="radio" id="rating9" name="rating" value="9" />
        <label class="half" for="rating9" title="4.5 stars" />
        <input type="radio" id="rating8" name="rating" value="8" />
        <label for="rating8" title="4 stars" />
        <input type="radio" id="rating7" name="rating" value="7" />
        <label class="half" for="rating7" title="3.5 stars" />
        <input type="radio" id="rating6" name="rating" value="6" />
        <label for="rating6" title="3 stars" />
        <input type="radio" id="rating5" name="rating" value="5" />
        <label class="half" for="rating5" title="2.5 stars" />
        <input type="radio" id="rating4" name="rating" value="4" />
        <label for="rating4" title="2 stars" />
        <input type="radio" id="rating3" name="rating" value="3" />
        <label class="half" for="rating3" title="1.5 stars" />
        <input type="radio" id="rating2" name="rating" value="2" />
        <label for="rating2" title="1 star" />
        <input type="radio" id="rating1" name="rating" value="1" />
        <label class="half" for="rating1" title="0.5 stars" />
        <input type="radio" id="rating0" name="rating" value="0" />
      </fieldset>

      <div className="rating">
        <span className="rating-star" data-value="5" />
        <span className="rating-star" data-value="4" />
        <span className="rating-star" data-value="3" />
        <span className="rating-star" data-value="2" />
        <span className="rating-star" data-value="1" />
      </div>
    </>
  );
};

export default RatingStar;
