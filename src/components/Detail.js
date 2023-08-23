import '../css/Detail.css'
import HeaderPage from "./HeaderPage";
import FooterForm from "./FooterForm";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {Link, useNavigate, useParams} from "react-router-dom";
import {Formik} from "formik";
import Swal from "sweetalert2";
import {animateScroll as scroll} from 'react-scroll';
import RatingComponent from "./RatingComponent";

export default function Detail() {
    let idAccount = localStorage.getItem("idAccount")
    let role = localStorage.getItem("role")
    const [quantity, setQuantity] = useState(0)
    const [quantityRemaining, setQuantityRemaining] = useState(0)
    const [product, setProduct] = useState([])
    const [shop, setShop] = useState([])
    const [nameShop, setNameShop] = useState("")
    const [image, setImage] = useState([])
    const [imageShow, setImageShow] = useState("")
    const [check, setCheck] = useState(true)
    const [carts, setCarts] = useState([])
    const navigate = useNavigate()
    const param = useParams()
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/home/products/${param.id}`);
                setProduct(response.data);
                console.log(234)
                console.log(response.data)
                const updateProduct = {
                    id: response.data.id,
                    name: response.data.name,
                    category: {
                        id: response.data.category.id
                    },
                    date: response.data.date,
                    price: response.data.price,
                    quantity: response.data.quantity,
                    shop: {
                        id: response.data.shop.id
                    },
                    imagePath: response.data.imagePath,
                    description: response.data.description,
                    views: response.data.views + 1,
                    rating: response.data.rating,
                    totalQuantity : response.data.totalQuantity
                }
                axios.post(`http://localhost:8081/home/products/views`, updateProduct).then((response) => {
                    setProduct(response.data)
                })
                setImage(response.data.imagePath);
                const shopResponse = await axios.get(`http://localhost:8081/home/shops/product/${response.data.id}`);
                setShop(shopResponse.data);
                const quantityResponse = await axios.post(`http://localhost:8081/home/carts/check-product/${idAccount}`, response.data);
                setQuantity(quantityResponse.data);
                const a = await axios.get(`http://localhost:8081/home/carts/${idAccount}`, response.data)
                setCarts(a.data)
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
        scrollToSection()
    }, []);
    // setQuantityRemaining(product.quantity);
    console.log(shop)


    // rating
    function Rating() {

        console.log(product)
        const [rating, setRating] = useState(product.rating);
        const handleClick = (value) => {
            let evaluate = {
                evaluateId: {},
                product:{
                    id: product.id
                },
                account:{
                    id: idAccount
                },
                rating : value
            }
            console.log(evaluate)
            axios.post(`http://localhost:8081/home/products/rating`,evaluate).then((res)=>{
            })
            setRating(value);
            console.log(value)
        }
        return (
            <div>
                <div>
                    {[...Array(5)].map((star, index) => {
                        const ratingValue = index + 1;
                        return (
                            <label key={ratingValue} htmlFor={`rating-${ratingValue}`} className={"lien"}>
                                <input
                                    type="radio"
                                    id={`rating-${ratingValue}`}
                                    name="rating"
                                    value={ratingValue}
                                    onClick={() => handleClick(ratingValue)}
                                />
                                <span className={ratingValue <= rating ? "active" : ""}>&#9733;</span>
                            </label>
                        );
                    })}
                </div>

            </div>
        );
    };
    return (
        <>
            <HeaderPage shop={shop} component={"detail"} listCart={carts}/>
            <div id={"detail"} className="body__detail">
                <div className="grid wide">
                    <div className="body__detail-container">
                        <div className="row">
                            <div className="col l-5">
                                <div className="body__detail-container-left">
                                    <div className="container__img-primary">
                                        {imageShow === "" && <img src={image[0]}/>}
                                        {imageShow !== "" && <img src={imageShow}/>}
                                        {/*<img src="/img/logo/vn-11134207-7qukw-lf5kh01qrr7u09_tn.jfif"/>*/}
                                    </div>
                                    <ul className="container__img-second">
                                        {image.map((element) => {
                                            return (
                                                <>
                                                    <li className="container__img-second-items" onClick={() => {
                                                        setImageShow(element)
                                                    }}>
                                                        <img src={element} style={{width: 85, height: 75}}/>
                                                    </li>

                                                </>
                                            )
                                        })}
                                    </ul>
                                    {role !== "" &&
                                        <div style={{marginTop: 20}}>
                                            <h1 style={{marginBottom:15}}>Đánh Giá :</h1>
                                            <Rating/>
                                        </div>
                                    }

                                </div>
                            </div>

                            <div className="col l-7">
                                <div className="body__detail-container-right">
                                    <h2 className="detail__title">
                                        {product.name}
                                    </h2>
                                    <div className="detail__container-price">
                                        đ
                                        <div className="detail__price">
                                            {product.price}
                                        </div>
                                    </div>

                                    <div className="detail__info">
                                        <div className="row detail__info-shared detail__info-address">
                                            <span className="col l-3 detail__info-shared-title">
                                               <i className="info__icon fa-solid fa-store"></i>
                                            </span>
                                            <div className="col l-9 detail__info-shared-content">
                                                <span onClick={() => showShop(shop.id)}
                                                      style={{color: "yellowgreen"}}>{shop.name}
                                                </span>

                                            </div>
                                        </div>

                                        <div className="row detail__info-shared detail__info-desc">
                                            <span className="col l-3 detail__info-shared-title">Mô tả</span>
                                            <div className="col l-9 detail__info-shared-content">
                                                <div className="detail__desc">
                                                    {product.description}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row detail__info-shared detail__info-quantity">
                                            <span
                                                className="col l-3 detail__info-shared-title">Số lượng còn lại : </span>
                                            <div className="col l-9 detail__info-shared-content">
                                                <div className="detail__quantity">
                                                    {product.quantity}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row detail__info-shared detail__info-quantity">
                                            <span
                                                className="col l-3 detail__info-shared-title">Số lượng đã bán : </span>
                                            <div className="col l-9 detail__info-shared-content">
                                                <div className="detail__quantity">
                                                    {product.totalQuantity}
                                                </div>
                                            </div>
                                        </div>
                                        {/*<div className="row detail__info-shared detail__info-quantity">*/}
                                        {/*    <span*/}
                                        {/*        className="col l-3 detail__info-shared-title">Số lượng xem : </span>*/}
                                        {/*    <div className="col l-9 detail__info-shared-content">*/}
                                        {/*        <div className="detail__quantity">*/}
                                        {/*            {product.views}*/}
                                        {/*        </div>*/}
                                        {/*    </div>*/}
                                        {/*</div>*/}
                                        <div className="row detail__info-shared detail__info-quantity">
                                            <span className="col l-3 detail__info-shared-title">Số lượng mua</span>
                                            <div className="col l-9 detail__info-shared-content">
                                                <div className="detail__quantity">
                                                    <div className="detail__quantity-btn detail__quantity-reduce"
                                                         onClick={reduceQuantity}>
                                                        -
                                                    </div>
                                                    <div className="detail__quantity-number">
                                                        {quantity}
                                                    </div>
                                                    <div className="detail__quantity-btn detail__quantity-increase"
                                                         onClick={increaseQuantity}>
                                                        +
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row detail__info-support">
                                        <div className="col l-6">
                                            <div className="detail__info-support-items">
                                                <i className="fa-solid fa-tag"></i>
                                                <span>Hàng chính hãng</span>
                                            </div>

                                            <div className="detail__info-support-items">
                                                <i className="fa-sharp fa-solid fa-truck-fast"></i>
                                                <span>Giao hàng miễn phí trong 90 phút</span>
                                            </div>

                                            <div className="detail__info-support-items">
                                                <i className="fa-solid fa-retweet"></i>
                                                <span>Chính sách đổi trả</span>
                                            </div>
                                        </div>

                                        <div className="col l-6">
                                            <div className="detail__info-support-items">
                                                <i className="fas fa-shield"></i>
                                                <span>Bảo hành 24 tháng</span>
                                            </div>

                                            <div className="detail__info-support-items">
                                                <i className="fa-solid fa-gears"></i>
                                                <span>Chính sách trả góp</span>
                                            </div>

                                            <div className="detail__info-support-items">
                                                <i className="fa-solid fa-piggy-bank"></i>
                                                <span>Hàng chính hãng</span>
                                            </div>
                                        </div>
                                    </div>
                                    {idAccount !== ''&&
                                        <div className="btn btn-add-cart" onClick={order}>Thêm giỏ hàng</div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <FooterForm/>
        </>
    )

    // vào trang cửa hàng theo id
    function showShop(id) {
        navigate(`/shop/${id}`)
    }

    // Tăng số lượng
    function increaseQuantity() {
        console.log(product.quantity)
        if (quantity === product.quantity) {
            setQuantity(product.quantity)
            setCheck(!check)
        } else {
            axios.post(`http://localhost:8081/home/carts/${idAccount}/add/product`, product).then((res) => {
                setQuantity(quantity + 1)
                setCheck(!check)
            })
        }
    }

    // Giảm số lượng
    function reduceQuantity() {
        if (quantity === 0) {
            axios.delete(`http://localhost:8081/home/carts/delete/product-cart/0/${idAccount}`, product).then((res) => {
                setQuantity(0)
                setCheck(!check)
            })
        } else {
            axios.post(`http://localhost:8081/home/carts/${idAccount}/sub/product`, product).then((res) => {
                setQuantity(quantity - 1)
                setCheck(!check)
            })
        }
    }

    // Gửi giá trị Formik
    function sendData() {
        let productCart = {
            product: product,
            quantity: quantity
        }
        console.log(shop)
        console.log(productCart)
        axios.post(`http://localhost:8081/home/carts`, productCart).then(() => {

        })
    }

    function order() {
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Đặt hàng thành công!',
            showConfirmButton: false,
            timer: 1500
        }).then(() => {
            axios.get(`http://localhost:8081/home/carts/${idAccount}`).then((response) => {
                setCarts(response.data)
            })
            //     .then(() => {
            //     navigate(`/detail/${param.id}`)
            // })
        })
    }

    //Trượt về phần cần hiển thị
    function scrollToSection() {
        scroll.scrollTo('#detail', {
            duration: 0,
            delay: 0,
            smooth: true,
            offset: 0
        });
    }
}