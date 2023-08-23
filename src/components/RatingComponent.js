import React, { useState } from "react";
import Rating from "react-rating-stars-component";

function RatingComponent() {
    const [rating, setRating] = useState(0);

    const handleRatingChange = (value) => {
        setRating(value);
    };

    return (
        <div>
            <Rating
                count={5}
                onChange={handleRatingChange}
                size={24}
                activeColor="#ffd700"
            />
            {rating > 0 && <p>Bạn đã đánh giá {rating} sao</p>}
        </div>
    );
}

export default RatingComponent;