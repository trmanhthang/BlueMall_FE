import '../css/Cart2.css'
import {Field, Form, Formik} from "formik";
import HeaderInfo from "./HeaderInfo";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import Swal from "sweetalert2";
import swalWithBootstrapButtons from "sweetalert2";

export default function Bill2() {
    const [check,setCheck]=useState(false)
    const idAccount = localStorage.getItem("idAccount")
    const navigate = useNavigate()
    const [bill, setBill] = useState([])
    const [billDetail, setBillDetail] = useState([])
    const[img, setImg] = useState("/img/logo/avatar-facebook-mac-dinh-8.jpg")
    const [name, setName] = useState("")
    const [account, setAccount] = useState([])
    const [prevCarts, setPrevCarts] = useState([])
    const [carts, setCart] = useState([])
    const [user, setUser] = useState([])

    //page
    const [pageNumber, setPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)

    useEffect(() => {
        axios.get(`http://localhost:8081/home/bills/bill-detail/${idAccount}?page=${pageNumber}`).then((response) => {
            setBillDetail(response.data.content)
            setTotalPages(response.data.totalPages)
        })
        axios.get(`http://localhost:8081/accounts/${idAccount}`).then((response) => {
            setUser(response.data)
        })
    }, [check,pageNumber])

    return (
        <>
            <Formik
                initialValues={{

                }}

                onSubmit={(values) => {

                }}

                // validationSchema={Validation}
            >
                <div id="main-cart">
                    <HeaderInfo name={name} img={user.pathImage}/>
                    <div className="container__form-edit-user">
                        <div className="form-edit-user__header">
                            <i className="fa-solid fa-cart-shopping"></i>
                            <h1>Lịch sử mua hàng</h1>
                        </div>

                        <div className="form-edit-user__container-form">
                            <div className="form-edit-user__form">
                                <div className="form-edit-user__form-title">
                                    <h2>Sản phẩm đã đặt hàng</h2>
                                    {/*<span>Danh sách sản phẩm đang chờ đặt hàng</span>*/}
                                </div>

                                <div className="form-cart">
                                    <ul className="list-product__cart">
                                        {billDetail.length !== 0 && billDetail.map((element) => {
                                            return (
                                                <>
                                                    <li className="product-items">
                                                        <div className="row">
                                                            <div className="col l-3">
                                                                <div className="product-items__container">
                                                                    <div className="product-items__container-img">
                                                                        <img src={element.product.imagePath[0]} alt="" style={{width:80,height:80}}/>
                                                                    </div>
                                                                    <div className="product-items__container-price">
                                                                        <div className="product-items__price">{element.product.name}</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col l-2">
                                                                <div className="product-items__container-price">
                                                                    Đơn giá
                                                                    <div className="product-items__price">{element.product.price.toLocaleString()}đ</div>
                                                                </div>
                                                            </div>
                                                            <div className="col l-3">
                                                                <div className="product-items__container">
                                                                    <div className="product-items__text">
                                                                        Số lượng mua
                                                                    </div>
                                                                    <div className="detail__quantity-number">
                                                                        {element.quantity}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col l-2">
                                                                <div className="product-items__container">
                                                                    <div className="product-items__text">
                                                                        Tổng
                                                                    </div>
                                                                    <div className="product-items__total">
                                                                        {(element.total).toLocaleString()} đ
                                                                    </div>
                                                                </div>
                                                                <div className="product-items__container">
                                                                    <div className="product-items__text">
                                                                        Trạng thái
                                                                    </div>
                                                                    <div className="product-items__total">
                                                                        {element.bill.statusBill.name}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col l-2">
                                                                <div className="product-items__container">
                                                                    {element.bill.statusBill.id === 1 &&
                                                                        <div className="row">
                                                                            <div className="btn btn-delete" onClick={() =>removeBill(element.bill.id)}>Hủy</div>
                                                                        </div>
                                                                    }
                                                                    {element.bill.statusBill.id === 2 &&
                                                                        <div className="row">
                                                                            <div className="btn btn-primary" onClick={() =>confirmationBill(element.bill.id)}>Đã nhận</div>
                                                                        </div>
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                </>
                                            )
                                        })}

                                        {/*{carts.length === 0 && <img src="/img/logo/empty-cart.webp" alt=""/>}*/}
                                    </ul>

                                </div>
                            </div>
                        </div>
                        <div className="body__home-nav-page">
                            <div className="nav-page__container">
                                <div className="nav-page__container-btn" onClick={()=>{
                                    setPage(pageNumber - 1)
                                }}>
                                    {pageNumber > 0 &&
                                        <div className="btn btn-prev">
                                            <i className="fa-solid fa-chevron-left" ></i>
                                        </div>}

                                </div>

                                <ul className="nav-page__container-number-page">
                                    <li className="btn btn-page">{pageNumber + 1} | {totalPages}</li>
                                </ul>

                                <div className="nav-page__container-btn" onClick={()=>{
                                    setPage(pageNumber + 1)
                                }}>
                                    {pageNumber + 1 < totalPages &&
                                        <div className="btn btn-next">
                                            <i className="fa-solid fa-chevron-right" ></i>
                                        </div>}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Formik>
        </>
    )

    function removeBill(idBill){
        swalWithBootstrapButtons.fire({
            title: 'Bạn có muốn hủy đơn hàng?',
            // text: "Bạn sẽ không thể hoàn tác khi xóa",
            icon: 'warning',
            showCancelButton: true,
            width: 400 ,
            confirmButtonText: 'Có, tôi chắc chắn!',
            cancelButtonText: 'Không, quay lại!',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post(`http://localhost:8081/home/bills/delete/${idBill}`).then((res)=>{
                    setCheck(!check)
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Hủy đơn hàng thành công!',
                        showConfirmButton: false,
                        timer: 1500
                    })
                })
            } else if (
                /* Read more about handling dismissals below */
                result.dismiss === Swal.DismissReason.cancel
            ) {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Thao tác được hủy bỏ!',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        })
    }

    function confirmationBill(idBill){
        axios.post(`http://localhost:8081/home/bills/update/status-bill/4/${idBill}`,billDetail).then((response) => {
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Thành công!',
                showConfirmButton: false,
                timer: 1500
            })
            setCheck(!check)
        })
    }

}