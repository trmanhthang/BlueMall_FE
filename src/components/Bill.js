import '../css/Cart.css'
import HeaderPage from "./HeaderPage";
import FooterForm from "./FooterForm";
import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import swalWithBootstrapButtons from "sweetalert2";
export default function Bill() {

    let idAccount = localStorage.getItem("idAccount")
    const [carts, setCart] = useState([])
    const [billDetail, setBillDetail] = useState([])
    const param = useParams()
    const [check,setCheck]=useState(false)
    const [prevCarts, setPrevCarts] = useState([]);
    const navigate = useNavigate()
    let index = 0;
    useEffect(() => {
        axios.get(`http://localhost:8081/home/bills/bill-detail/${idAccount}`).then((response) => {
            setBillDetail(response.data.content)
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
                                Đơn hàng
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
                                        <h3 className="col l-2">Tên</h3>
                                        <h3 className="col l-1">Số lượng</h3>
                                        <h3 className="col l-1">Đơn giá (vnd)</h3>
                                        <h3 className="col l-2">Tổng tiền (vnd)</h3>
                                        <h3 className="col l-2">Trạng thái</h3>
                                        <h3 className="col l-2">Hành động</h3>
                                    </div>
                                    {billDetail !== ''&& billDetail.map((element)=>{
                                        return(
                                            <>
                                                <div className="row table__content">
                                                    <div className="col l-1">{++index}</div>
                                                    <div className="col l-1">
                                                        <img src={element.product.imagePath[0]}/>
                                                    </div>
                                                    <div className="col l-2">{element.product.name}</div>
                                                    <div className="col l-1">{element.quantity}</div>
                                                    <div className="col l-1">{element.product.price.toLocaleString()}</div>
                                                    <div className="col l-2">{(element.quantity * element.product.price).toLocaleString()}</div>
                                                    <div className="col l-2">{element.bill.statusBill.name}</div>
                                                    <div className="col l-2">
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