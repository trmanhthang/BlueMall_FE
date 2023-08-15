import {Link, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axios from "axios";
import PageHome from "./PageHome";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {getDownloadURL, ref, uploadBytesResumable} from "firebase/storage";
import storage from "./FirebaseConfig";
import * as Yup from "yup";
import Swal from "sweetalert2";

export default function HeaderPage(prop) {

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .required('Vui lòng nhập tên')
            .min(3, "Tối thiểu 3 ký tự")
            .max(16, "Tối thiểu 16 ký tự"),

        phone: Yup.number()
            .required('Vui lòng nhập số điện thoại'),

        address: Yup.string()
            .required('Vui lòng nhập địa chỉ')
            .min(4, "Tối thiểu 4 ký tự"),
    });

    const [checkComponent, setCheckComponent] = useState("")


    const [progressPercent, setProgressPercent] = useState(0)
    const [image, setImage] = useState("")
    const [id, setId] = useState(0)
    const [check, setCheck] = useState(false)

    const [search, setSearch] = useState("")

    let idAccount = localStorage.getItem("idAccount")
    let role = localStorage.getItem("role")
    const [user, setUser] = useState([])
    const [nameLogin, setNameLogin] = useState("")
    const navigate = useNavigate()
    // const [carts, setCart] = useState([])
    const [checkCart, setCheckCart] = useState(true)
    const [render, setRender] = useState(false)
    useEffect(() => {
        setCheckComponent(prop.component)
        axios.get(`http://localhost:8081/accounts/${idAccount}`).then((response) => {
            setUser(response.data)
            setNameLogin(response.data.name)
        })

        // axios.get(`http://localhost:8081/home/carts/${idAccount}`).then((response) => {
        //     setCart(response.data)
        // })

    }, [render, check])
    return (
        <>
            <div className="header__primary">
                <div className="grid wide">
                    <div className="header__navbar">
                        <div className="header__navbar-items">
                            <ul className="header__nav">
                                <li className="header__nav-items"><Link to={"/"}>Trang chủ</Link></li>
                                <li className="header__nav-items">Tải ứng dụng</li>
                                <li className="header__nav-items">
                                    Kết nối
                                    <i className="header__nav-item-icon fa-brands fa-facebook"></i>
                                    <i className="header__nav-item-icon fa-brands fa-instagram"></i>
                                </li>
                            </ul>
                        </div>
                        <div className="header__navbar-items">
                            <ul className="header__nav">
                                <li className="header__nav-items">
                                    <i className="header__nav-item-icon fa-solid fa-circle-question"></i>
                                    Hỗ trợ
                                </li>

                                {nameLogin === '' &&
                                    <li className="header__nav-items"><Link to={"/register"}>Đăng ký</Link></li>}
                                {nameLogin === '' &&
                                    <li className="header__nav-items"><Link to={"/login"}>Đăng nhập</Link></li>}
                                {nameLogin !== '' && <li className="header__nav-items header__nav-items-info">
                                    <div className="header__nav-items-img" onClick={() => formSave()}>
                                        {user.pathImage == null &&
                                            <img src="/img/logo/avatar-facebook-mac-dinh-8.jpg"/>}
                                        {user.pathImage != null && <img src={user.pathImage}/>}

                                    </div>
                                    <div className="nav-items__name-user">{nameLogin}</div>
                                    <ul className="header__nav-items-container">
                                        {role === "2" &&
                                            <li className="header__nav-items-container-info">
                                                <Link to={`/shop-admin/${idAccount}`} className="row">
                                                    <div className="col l-2 nav-items__container-icon">
                                                        <i className="fa-solid fa-store"></i>
                                                    </div>
                                                    <div className="col l-10 nav-items__container-text">
                                                        Cửa hàng của tôi
                                                    </div>
                                                </Link>
                                            </li>}
                                        {role !== "2" &&
                                            <li className="header__nav-items-container-info">
                                                <Link to={"/bills"} className="row">
                                                    <div className="col l-2 nav-items__container-icon">
                                                        <i className="fa-solid fa-eye"></i></div>
                                                    <div className="col l-10 nav-items__container-text" >
                                                        Lịch Sử Mua Hàng
                                                    </div>
                                                </Link>
                                            </li>}
                                        <li className="header__nav-items-container-info">
                                            <Link to={"/edit_user"} className="row">
                                                <div className="col l-2 nav-items__container-icon">
                                                    <i className="fa-solid fa-user"></i>
                                                </div>
                                                <div className="col l-10 nav-items__container-text">
                                                    {/*// onClick={() => formSave()}>*/}
                                                    Tài Khoản
                                                </div>
                                            </Link>
                                        </li>

                                        <li className="header__nav-items-container-info">
                                            <Link to={"/login"} className="row">
                                                <div className="col l-2 nav-items__container-icon">
                                                    <i className="fa-solid fa-right-from-bracket"></i>
                                                </div>
                                                <div className="col l-10 nav-items__container-text"
                                                     onClick={logout}>
                                                    Đăng xuất
                                                </div>
                                            </Link>
                                        </li>
                                    </ul>
                                </li>}
                            </ul>
                        </div>
                    </div>
                    <div className="header__container">
                        <div className="row header__container--align">
                            <div className="col l-3">
                                <Link to={"/"} className="header__logo-shop">
                                    <i className="logo-icon-shop fa-solid fa-cloud">
                                        <span className="logo-icon__text-shop">f</span>
                                    </i>
                                    <span className="header_logo--text-shop"
                                          onClick={prop.home}>FCBlue Mall</span>
                                </Link>
                            </div>

                            <div className="col l-7">
                                {checkComponent !== "detail" &&
                                    <div className="header__container-right">
                                        <div className="header__search">

                                            {/* tìm kiếm sản phẩm theo tên*/}

                                            <input type="text" className="header__search-input"
                                                   placeholder="Tìm kiếm trong shop"
                                                   onChange={(e) => prop.onClick(e.target.value)}/>
                                            <div className="btn header__search-btn"
                                                 onClick={() => prop.onClick(search)}>
                                                <i className="header__search-icon fa-solid fa-magnifying-glass"></i>
                                            </div>
                                        </div>
                                    </div>}
                            </div>
                            <div className="col l-2">
                                {localStorage.getItem("role") !== "2" && <Link to={"/cart"} className="header__cart">
                                    <i className="header__cart-icon fa-solid fa-cart-shopping"></i>
                                    <div className="header__cart-container">
                                        {prop.listCart.length !== 0 &&
                                            <div className="has-cart">
                                                <h3 className="cart__title">Sản phẩm đã chọn</h3>
                                                <ul className="has__cart-container">
                                                    {prop.listCart.map((element) => {
                                                        return (
                                                            <>
                                                                <li className="has__cart-items">
                                                                    <div className="row">
                                                                        <div className="col l-2 has__cart-img">
                                                                            <div className="has__cart-img-container">
                                                                                <img src={element.product?.imagePath[0]}/>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col l-6">
                                                                            <div className="has__cart-head">
                                                                                <div
                                                                                    className="has__cart-head-title">{element.product.name}</div>
                                                                                <div
                                                                                    className="has__cart-head-desc">{element.product.category.name}</div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col l-4">
                                                                            <div className="has__cart-action">
                                                                                <div className="has__cart-calculate">
                                                                                    <div className="has__cart-price">{element.product.price}</div>
                                                                                    <div className="has__cart-quantity">x {element.quantity}</div>
                                                                                </div>
                                                                                {/*<div className="has__cart-delete"*/}
                                                                                {/*     onClick={() => deleteProduct(element.product.id)}>*/}
                                                                                {/*    Xoá*/}
                                                                                {/*</div>*/}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            </>
                                                        )
                                                    })}
                                                </ul>
                                                <div className="has__cart-container-btn">
                                                    <Link to={"/cart"} className="btn btn-cart">Xem giỏ hàng</Link>
                                                </div>
                                            </div>
                                        }
                                        {prop.listCart.length === 0 &&
                                            <div className="no-cart">
                                                <img src="/img/logo/empty-cart.webp"/>
                                            </div>
                                        }
                                    </div>
                                    {prop.listCart.length > 0 && <div className="header__cart-count">{prop.listCart.length}</div>}
                                </Link>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="modal">
                <div className="modal__background" onClick={closeModal}></div>
                <div className="modal__container">
                        <span className="modal__close" onClick={closeModal}>
                            <i className="modal__close-icon fa-solid fa-xmark"></i>
                        </span>
                    <h1 className="modal__container-title" style={{marginLeft: 100}}>
                        <span>Chỉnh Sửa Thông Tin</span>
                    </h1>

                    {/*formik open*/}
                    <Formik
                        initialValues={{
                            id: user.id,
                            name: user.name,
                            phone: user.phone,
                            address: user.address,
                            pathImage: user.pathImage,
                            email: user.email,
                            password: user.password,
                        }}
                        validationSchema={validationSchema}
                        onSubmit={(values) => {
                            if (image !== "") {
                                values.pathImage = image
                            } else {
                                values.pathImage = user.pathImage
                            }
                            saveUser(values)
                        }}
                        enableReinitialize={true}
                    >
                        {(formik) => (
                            <Form id={"demo"}>
                                <div>
                                    <div>
                                        <ErrorMessage name="name"/>
                                    </div>
                                    <div className="form__field">
                                        <div className="form__field-container">
                                            <Field name={'name'} type="text"
                                                   placeholder="Nhập Tên(*)"/>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div><ErrorMessage name="phone"/></div>
                                    <div className="form__field">
                                        <div className="form__field-container">
                                            <Field name={'phone'} type="text"
                                                   placeholder="Số Điện Thoại(*)"/>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div>
                                        <ErrorMessage name="address"/>
                                    </div>
                                    <div className="form__field">
                                        <div className="form__field-container">
                                            <Field name={'address'} type="text"
                                                   placeholder="Địa chỉ(*)"/>

                                        </div>
                                    </div>
                                </div>
                                <div style={{marginTop: 10, marginBottom: 10}}>
                                    <h3>IMAGE</h3>
                                </div>
                                <div className="form__field">
                                    {/*<Field*/}
                                    {/*    name="image"*/}
                                    {/*    type="file"*/}
                                    {/*    multiple*/}
                                    {/*    onChange={(e) => uploadFile(e)}/>*/}
                                </div>
                                <div>
                                    {/*{*/}
                                    {/*    !image &&*/}
                                    {/*    <div>*/}
                                    {/*        <img src={user.pathImage} alt="" style={{width: 100, height: 100}}/>*/}
                                    {/*        <h3 className='inner-bar'*/}
                                    {/*            style={{width: `${progressPercent} % `}}>{progressPercent}%</h3>*/}
                                    {/*    </div>*/}
                                    {/*}*/}
                                    {/*{*/}
                                    {/*    image &&*/}
                                    {/*    <img src={image} alt='uploaded file' style={{width: 100, height: 100}}/>*/}
                                    {/*}*/}
                                </div>
                                <div className="container__btn"
                                     style={{marginLeft: 100, marginBottom: 20, marginTop: 10}}>
                                    <div className="row">
                                        <div className="col l-8">
                                            <div className="container__btn">
                                            </div>
                                            <button type={"submit"} className={'btn btn-primary'}
                                                    aria-disabled={check}>Xác Nhận
                                            </button>

                                        </div>

                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>
                    {/*formik close*/}

                </div>
            </div>

        </>
    )

    function formSave() {
        // document.getElementById("modal").style.display = "flex"
    }

    function closeModal() {
        document.getElementById("demo").reset()
        setImage('')
        setProgressPercent(0)
        document.getElementById("modal").style.display = "none"
    }

    // function uploadFile(e) {
    //     setCheck(true)
    //     if (e.target.files[0]) {
    //         const time = new Date().getTime()
    //         const storageRef = ref(storage, `image/${time}_${e.target.files[0].name}`);
    //         const uploadTask = uploadBytesResumable(storageRef, e.target.files[0]);
    //
    //         uploadTask.on("state_changed",
    //             (snapshot) => {
    //                 const progress =
    //                     Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
    //                 setProgressPercent(progress);
    //             },
    //             (error) => {
    //                 console.log(error);
    //             },
    //             () => {
    //                 getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
    //                     setImage(downloadURL)
    //                     setCheck(false)
    //                 });
    //             }
    //         );
    //     }
    // }

    function saveUser(values) {

        console.log(values)
        axios.post(`http://localhost:8081/accounts/update-user`, values).then((response) => {

            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Cập Nhật Thành Công',
                showConfirmButton: false,
                timer: 1500
            }).then(r => {
                setRender(!render)
                navigate('/')
                closeModal()
            })
        })
    }

    function logout() {
        localStorage.setItem("idAccount", "")
        localStorage.setItem("role", "")
        navigate("/login")
    }


    function deleteProduct(id) {
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
            width: 400,
            confirmButtonText: 'Có, tôi chắc chắn!',
            cancelButtonText: 'Không, quay lại!',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                axios.get(`http://localhost:8081/home/products/${id}`).then((res) => {
                    console.log(res.data)
                    axios.post(`http://localhost:8081/home/carts/delete/product-cart/${idAccount}`, res.data).then((res) => {
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
                    timer: 2000
                })
            }
        })

    }


}