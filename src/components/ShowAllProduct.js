import {Link} from "react-router-dom";
import React from "react";

export default function ShowAllProduct(props) {
    return (
        <>
            <div className="col l-2">
                <Link to={"#"} className="body__container-product">
                    <div className="product__img">
                        <img onClick={() => {
                            // showDetailProduct(props.product.id)
                        }} src={props.product.imagePath[0]}/>
                    </div>

                    <div className="product__content">
                        <div className="product__title">
                            <span onClick={() => {

                            }}>
                                <i className="info__icon fa-solid fa-store"></i>
                                <span
                                    style={{fontSize: 15}}><b>{props.product.shop.name}</b></span>
                            </span>
                        </div>
                        <h2 className="product__rating">
                            {props.product.name}
                        </h2>
                        <span className="product__tag-shop"> # {props.product.category.name}</span>
                        <div className="product__price">
                            <p>đ</p>
                            <span>{props.product.price}</span>
                        </div>
                        -------------------------------------------------
                        <div className="product__address">
                            <i className="fa-solid fa-location-dot"></i>
                            {/*<span>{props.product.shop.account.users.address}</span>*/}
                        </div>
                    </div>
                </Link>
            </div>
        </>
    )
}