import '../css/Cart.css'
import HeaderPage from "./HeaderPage";
import FooterForm from "./FooterForm";
import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
export default function Cart() {
    let idAccount = localStorage.getItem("idAccount")
    const [carts, setCart] = useState([])
    const [productUpdate, setProductUpdate] = useState([])
    const [bill, setBill] = useState([])
    const [billDetail, setBillDetail] = useState([])
    const param = useParams()
    const [check,setCheck]=useState(false)
    const [prevCarts, setPrevCarts] = useState([]);
    const [renderCart, setRenderCart] = useState(false);
    let index = 0;

    // function checkRender(){
    //     setRenderCart(!renderCart)
    // }
    const navigate = useNavigate()
    useEffect(() => {
        axios.get(`http://localhost:8081/home/carts/${idAccount}`).then((response) => {
            setPrevCarts(carts);
            setCart(response.data)
        })
    }, [check]);
    return (
        <>
            <div id="main-cart">
                <HeaderPage/>
                <div className="body__cart">
                    <div className="body__cart-head">
                        <div className="grid wide">
                            <div className="body__cart-title">
                                <i className="fa-solid fa-cart-shopping"></i>
                                Giỏ hàng
                            </div>
                        </div>
                    </div>

                    <div className="grid wide">
                        <div className="body__cart-content">
                            {/*hiển thị sản phẩm trong giỏ hàng*/}
                            <div className="body__cart-content-container">
                                <div className="body__cart-name-shop">
                                    <i className="fa-solid fa-store"></i>
                                    ZteeBoss
                                </div>
                                <div className="body__cart-product">
                                    <div className="row table__head">
                                        <h3 className="col l-1">STT</h3>
                                        <h3 className="col l-1">Ảnh</h3>
                                        <h3 className="col l-3">Tên sản phẩm</h3>
                                        <h3 className="col l-2">Số lượng</h3>
                                        <h3 className="col l-1">Đơn giá (vnd)</h3>
                                        <h3 className="col l-1">Tổng tiền (vnd)</h3>
                                        <h3 className="col l-3">Hành động</h3>
                                    </div>
                                    {carts.length !== 0 && carts.map((element)=>{
                                        return(
                                            <>
                                                <div className="row table__content">
                                                    <div className="col l-1">{++index}</div>
                                                    <div className="col l-1">
                                                        <img src={element.product.imagePath[0]}/>
                                                    </div>
                                                    <div className="col l-3">{element.product.name}</div>
                                                    <div className="col l-2">
                                                        <div className="detail__quantity product-cart__quantity">
                                                            <div className="detail__quantity-btn detail__quantity-reduce" onClick={() => reduceQuantity(element.product.id, element.quantity)}>
                                                                -
                                                            </div>
                                                            <div className="detail__quantity-number">
                                                                {element.quantity}
                                                            </div>
                                                            <div className="detail__quantity-btn detail__quantity-increase" onClick={()=>increaseQuantity(element.product.id)}>
                                                                +
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col l-1">{element.product.price.toLocaleString()}</div>
                                                    <div className="col l-1">{(element.quantity * element.product.price).toLocaleString()}</div>
                                                    <div className="col l-3">
                                                        <div className="col l-5">
                                                            <div className="btn btn-delete" onClick={() =>deleteProductInCart(element.product.id)}>Hủy</div>
                                                        </div>
                                                        <div className="col l-7">
                                                            <div className="btn btn-primary" onClick={() =>payProduct(element.quantity,element.product.id,element.product.price,element.product)}>Thanh toán</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )
                                    })}
                                </div>
                            </div>
                            {/*    */}
                        </div>
                    </div>
                </div>

                <FooterForm/>
            </div>
        </>
    )

    //Tăng số lượng sản phẩm
    function increaseQuantity(id) {
        axios.get(`http://localhost:8081/home/products/${id}`).then((res)=>{
            axios.post(`http://localhost:8081/home/carts/${idAccount}/add/product`, res.data).then((res)=>{
                setCheck(!check)
            })
        })

    }

    //Giảm số luợng sản phẩm
    function reduceQuantity(id, quantity) {
        if (quantity > 1){
            axios.get(`http://localhost:8081/home/products/${id}`).then((res)=>{
                axios.post(`http://localhost:8081/home/carts/${idAccount}/sub/product`,res.data).then((res)=>{
                    setCheck(!check)
                })
            })
        }

    }

    function deleteProductInCart(id) {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'confirmButtonColor',
                cancelButton: 'cancelButtonColor'
            },
            buttonsStyling: false
        })

        swalWithBootstrapButtons.fire({
            title: 'Bạn có muốn xóa không',
            text: "Bạn sẽ không thể hoàn tác khi xóa",
            icon: 'warning',
            showCancelButton: true,
            width: 400 ,
            confirmButtonText: 'Có, tôi chắc chắn!',
            cancelButtonText: 'Không, quay lại!',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                axios.get(`http://localhost:8081/home/products/${id}`).then((res)=>{
                    console.log(res.data)
                    axios.post(`http://localhost:8081/home/carts/delete/product-cart/${idAccount}`, res.data).then((res)=>{
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'Xóa thành công!',
                            showConfirmButton: false,
                            timer: 1500
                        })
                        setCheck(!check)
                    })
                })
            } else if (
                /* Read more about handling dismissals below */
                result.dismiss === Swal.DismissReason.cancel
            ) {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Hủy thành công!',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        })
    }

    function payProduct(quantity ,idProduct, price, product){
        const productUpdate={
            id:product.id,
            quantity: product.quantity - quantity,
            description : product.description,
            name : product.name,
            price: product.price,
            category: {
                id: product.category.id,
            },
            shop: {
                id: product.shop.id,
            },
            imagePath : product.imagePath
        }
        const total = quantity * price
        axios.get(`http://localhost:8081/home/shops/product/${idProduct}`).then((res)=> {
            const bill = {
                account: {
                    id: idAccount,
                },
                date: Date.now(),
                shop: {
                    id: res.data.id
                },
                statusBill:{
                    id : 1
                }

            }
            console.log(bill)
            axios.post(`http://localhost:8081/home/bills/create`, bill).then((res) => {
                setBill(res.data)
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Đặt hàng thành công!',
                    showConfirmButton: false,
                    timer: 1500
                })
                const billDetail = {
                    billDetailId: {},
                    bill: {
                        id: res.data.id
                    },
                    product: {
                        id: idProduct
                    },
                    quantity: quantity,
                    total: total
                }
                axios.post(`http://localhost:8081/home/bills/bill-detail/create`, billDetail ).then((res) => {
                    setBillDetail(res.data)
                })
                axios.post(`http://localhost:8081/home/carts/delete/product-cart/${idAccount}`,product).then((res) =>{
                    setCheck(!check)
                    navigate("/bills")
                })
            })
        })
    }

}