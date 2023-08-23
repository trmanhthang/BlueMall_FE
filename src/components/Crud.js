import '../css/Crud.css'
import HeaderPage from "./HeaderPage";
import FooterForm from "./FooterForm";
import React, {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import * as Yup from "yup";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {getDownloadURL, ref, uploadBytesResumable} from "firebase/storage";
import storage from "./FirebaseConfig";
import Swal from "sweetalert2";
import {Bar} from "react-chartjs-2";
import Chart from "chart.js/auto";
import {BarController, BarElement, CategoryScale, Legend, LinearScale} from "chart.js";

Chart.register(BarElement,BarController,LinearScale,Legend,CategoryScale)
export default function Crud() {
    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .required('Vui lòng nhập tên sản phẩm'),

        description: Yup.string()
            .required('Vui lòng nhập mô tả'),

        quantity: Yup.number()
            .required('Vui lòng nhập số lượng sản phẩm')
            .positive('Số lượng sản phẩm phải lớn hơn 0'),

        price: Yup.number()
            .required('Vui lòng nhập giá sản phẩm')
            .positive('Giá sản phẩm phải lớn hơn 0'),

        category: Yup.object()
            .required('Vui lòng chọn danh mục sản phẩm'),
    });
    const validationSchemaVoucher = Yup.object().shape({
        name: Yup.string()
            .required('Vui lòng nhập mã khuyến mãi')
            .min(6, "Tối thiểu 6 ký tự")
            .max(12, "Tối đa 12 ký tự"),
        percent: Yup.number()
            .required('Vui lòng nhập phần trăm khuyến mãi')
            .min(1, "số nhập phải lớn hơn 0")
            .max(100, "số nhập phải nhỏ hơn 100"),

        quantity: Yup.number()
            .required('Vui lòng nhập số mã khuyến mãi')
            .positive('Số lượng sản phẩm phải lớn hơn 0'),

    });
    const idAccount = localStorage.getItem("idAccount")

    const [progressPercent, setProgressPercent] = useState(0)
    const [image, setImage] = useState("")
    const [imagePath, setImagePath] = useState([])


    const [shop, setShop] = useState([]);
    const [voucher, setVoucher] = useState([]);
    const [checkVoucher, setCheckVoucher] = useState(false);


    const [products, setProducts] = useState([]);
    const [productsAll, setProductsAll] = useState([]);
    const [statistical, setStatistical] = useState([]);
    const [categoryShop, setCategoryShop] = useState([])
    const [categories, setCategories] = useState([])
    const [user, setUser] = useState([])
    const [totalElements, setTotalElements] = useState(0)
    const param = useParams()
    const [check, setCheck] = useState(false)
    const [id, setId] = useState(0)
    const [product, setProduct] = useState([])
    const [billDetails, setBillDetails] = useState([])
    const [checkBillDetail, setCheckBillDetail] = useState(false)
    const [checkAction, setCheckAction] = useState("show product")
    const navigate = useNavigate()

    const [checkUser, setCheckUser] = useState(false)


    const [checkRender, setCheckRender] = useState(false)


    // phan trang
    const [pageNumber, setPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [nameProduct, setNameProduct] = useState("")

    // phân trang đơn hàng
    const [pageNumberBill, setPageBill] = useState(0)
    const [totalPagesBill, setTotalPagesBill] = useState(0)
    useEffect(showBillDetail, [pageNumberBill, pageNumber])
    // useEffect(showBillDetail, [pageNumberBill])
    const [listUser, setListUser] = useState([]);

    useEffect(() => {
        setCheckAction("show product")
        if (localStorage.getItem("idAccount")) {

            axios.get(`http://localhost:8081/home/shops/${param.id}`).then((response) => {
                setShop(response.data)
                if (localStorage.getItem("idAccount") == response.data.account.id) {
                    axios.get(`http://localhost:8081/home/products/shop-crud/${param.id}?page=${pageNumber}`).then((response) => {
                        setProducts(response.data.content)
                        setTotalPages(response.data.totalPages)
                        setTotalElements(response.data.totalElements)
                    })
                    axios.get(`http://localhost:8081/home/products/shop-crud-all/${param.id}`).then((response) => {
                        setProductsAll(response.data.content)
                        console.log(123)
                        console.log(response.data.content)

                    })
                    axios.get(`http://localhost:8081/home/categories`).then((response) => {
                        setCategories(response.data)
                        console.log(237)
                        console.log(response.data)
                    })
                    axios.get(`http://localhost:8081/home/shops/${param.id}/categories`).then((response) => {
                        setCategoryShop(response.data)
                    })
                    axios.get(`http://localhost:8081/accounts/${param.id}`).then((response) => {
                        setUser(response.data)
                    })
                } else {
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: 'Bạn Không Có Quyền Truy Cập',
                        showConfirmButton: false,
                        timer: 1500
                    }).then(r => {
                        navigate("/")
                    })
                }
            })
        } else {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Bạn Cần Đăng Nhập',
                showConfirmButton: false,
                timer: 1500
            }).then(r => {
                navigate("/login")
            })
        }

    }, [checkRender, pageNumber])

    function searchByName(input) {
        console.log(input)
        if (input !== undefined) {
            setNameProduct(input)
        }
    }

    function renderPageShopCrud() {
        const search = {
            name: nameProduct,
        }
        console.log(search)
        axios.post(`http://localhost:8081/home/products/shop-crud/${param.id}?page=${pageNumber}`, search).then((response) => {
            setProducts(response.data.content)
            setTotalPages(response.data.totalPages)
            setTotalElements(response.data.totalElements)
        })
    }

    useEffect(renderPageShopCrud, [pageNumber, nameProduct])

    function backToHome() {
        navigate("/")
    }

    let index = 0
    return (
        <>
            <HeaderPage onClick={searchByName} home={backToHome}/>
            <div id="main" className="main-home">
                <div id="main__crud">
                    <div className="grid wide container__form-edit">
                        <div className="row container-btn">
                            <div className="col l-2 container-btn-create">
                                <div className="btn" onClick={showProduct}>Sản phẩm</div>
                            </div>
                            <div className="col l-2 container-btn-create">
                                {/*<div className="btn" onClick={() => formSave(-1)}>Thêm sản phẩm</div>*/}
                            </div>

                            <div className="col l-2 container-btn-create">
                                <div className="btn btn-create" onClick={openModalVoucher}>Thêm mã giảm giá</div>
                            </div>
                            <div className="col l-2 container-btn-create">
                                <div className="btn btn-create" onClick={showVoucher}>Khuyến mãi</div>
                            </div>
                            <div className="col l-2 container-btn-create">
                                <div className="btn btn-create" onClick={showBillDetail}>Đơn hàng</div>
                            </div>
                            <div className="col l-2 container-btn-create">
                                <div className="btn btn-create" onClick={showUsersBuyProductOfShop}>Thống kê</div>
                            </div>
                        </div>
                        {checkAction === "show product" &&
                            <div style={{height: 600}}>
                                <div className="row table__head">
                                    <h3 className="col l-1">STT</h3>
                                    <h3 className="col l-1">Ảnh</h3>
                                    <h3 className="col l-3">Tên sản phẩm</h3>
                                    <h3 className="col l-3">Số lượng bán</h3>
                                    <h3 className="col l-1">Số lượng</h3>
                                    <h3 className="col l-1">Giá</h3>
                                    <h3 className="col l-2">Chỉnh sửa</h3>
                                </div>
                                {products != null && products.map((product) => {
                                    return (
                                        <>
                                            <div className="row table__content">
                                                <div className="col l-1">{++index}</div>
                                                <div className="col l-1">
                                                    <img src={product.imagePath[0]}/>
                                                </div>
                                                <div className="col l-3">{product.name}</div>
                                                <div className="col l-3">{product.totalQuantity}</div>
                                                <div className="col l-1">{product.quantity}</div>
                                                <div className="col l-1">{product.price.toLocaleString()}</div>
                                                <div className="col l-2">
                                                    <div className="row">
                                                        <div className="col l-6">
                                                            <div className="btn btn-edit"
                                                                 onClick={() => formSave(product.id)}>Sửa
                                                            </div>
                                                        </div>
                                                        <div className="col l-6">
                                                            <div className="btn btn-delete"
                                                                 onClick={() => deleteProduct(product.id)}>Xoá
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </>
                                    )
                                })}
                                <div className="body__home-nav-page">
                                    <div className="nav-page__container">
                                        <div className="nav-page__container-btn" onClick={() => {
                                            setPage(pageNumber - 1)
                                        }}>
                                            {pageNumber > 0 &&
                                                <div className="btn btn-prev">
                                                    <i className="fa-solid fa-chevron-left"></i>
                                                </div>}

                                        </div>

                                        <ul className="nav-page__container-number-page">
                                            <li className="btn btn-page">{pageNumber + 1} | {totalPages}</li>
                                        </ul>

                                        <div className="nav-page__container-btn" onClick={() => {
                                            setPage(pageNumber + 1)
                                        }}>
                                            {pageNumber + 1 < totalPages &&
                                                <div className="btn btn-next">
                                                    <i className="fa-solid fa-chevron-right"></i>
                                                </div>}

                                        </div>
                                    </div>
                                </div>
                            </div>
                        }

                        {checkAction === "show voucher" &&
                            <div style={{height: 320}}>
                                <div className="row table__head">
                                    <h3 className="col l-1">STT</h3>
                                    <h3 className="col l-3">Tên mã</h3>
                                    <h3 className="col l-4">Số lượng</h3>
                                    <h3 className="col l-4">Chiết khấu</h3>
                                    {/*<h3 className="col l-4">Chỉnh sửa</h3>*/}
                                </div>
                                {voucher != null && voucher.map((voucher) => {
                                    return (
                                        <>
                                            <div className="row table__content" style={{marginTop: 10}}>
                                                <div className="col l-1">{++index}</div>
                                                <div className="col l-3">{voucher.name}</div>
                                                <div className="col l-4">{voucher.quantity}</div>
                                                <div className="col l-4">{voucher.percent}</div>
                                                {/*<div className="col l-4">*/}
                                                {/*    <div className="row">*/}
                                                {/*        <div className="col l-6">*/}
                                                {/*            <div className="btn btn-edit"*/}
                                                {/*                 onClick={() => updateVoucher(product.id)}>Sửa*/}
                                                {/*            </div>*/}
                                                {/*        </div>*/}
                                                {/*        <div className="col l-6">*/}
                                                {/*            <div className="btn btn-delete"*/}
                                                {/*                 onClick={() => deleteVoucher(product.id)}>Xoá*/}
                                                {/*            </div>*/}
                                                {/*        </div>*/}
                                                {/*    </div>*/}
                                                {/*</div>*/}
                                            </div>

                                        </>
                                    )
                                })}

                            </div>
                        }
                        {checkAction === "show bill detail" &&
                            <div style={{height: 600}}>
                                <div className="row table__head">
                                    <h3 className="col l-1">STT</h3>
                                    <h3 className="col l-1">Ảnh</h3>
                                    <h3 className="col l-2">Tên sản phẩm</h3>
                                    <h3 className="col l-2">Tên khách hàng</h3>
                                    <h3 className="col l-1">Số lượng</h3>
                                    <h3 className="col l-1">Đơn giá (vnd)</h3>
                                    <h3 className="col l-1">Tổng tiền (vnd)</h3>
                                    <h3 className="col l-1">Trạng thái</h3>
                                    <h3 className="col l-2">Hành động</h3>
                                </div>
                                {billDetails != null && billDetails.map((element) => {
                                    return (
                                        <>
                                            <div className="row table__content">
                                                <div className="col l-1">{++index}</div>
                                                <div className="col l-1">
                                                    <img src={element.product.imagePath[0]}/>
                                                </div>
                                                <div className="col l-2">{element.product.name}</div>
                                                <div className="col l-2">{element.bill.account.users.name}</div>
                                                <div className="col l-1">{element.quantity}</div>
                                                <div className="col l-1">{element.product.price.toLocaleString()}</div>
                                                <div className="col l-1">{element.total.toLocaleString()}</div>
                                                <div className="col l-1">{element.bill.statusBill.name}</div>
                                                <div className="col l-2">
                                                    {element.bill.statusBill.id === 1 &&
                                                        <div className="btn btn-primary"
                                                             onClick={() => updateStatusBill2(element.bill.id, element)}>Xác
                                                            nhận đơn</div>
                                                    }
                                                </div>

                                            </div>

                                        </>
                                    )
                                })}
                                <div className="body__home-nav-page">
                                    <div className="nav-page__container">
                                        <div className="nav-page__container-btn" onClick={() => {
                                            setPageBill(pageNumberBill - 1)
                                        }}>
                                            {pageNumberBill > 0 &&
                                                <div className="btn btn-prev">
                                                    <i className="fa-solid fa-chevron-left"></i>
                                                </div>}

                                        </div>

                                        <ul className="nav-page__container-number-page">
                                            <li className="btn btn-page">{pageNumberBill + 1} | {totalPagesBill}</li>
                                        </ul>

                                        <div className="nav-page__container-btn" onClick={() => {
                                            setPageBill(pageNumberBill + 1)
                                        }}>
                                            {pageNumberBill + 1 < totalPagesBill &&
                                                <div className="btn btn-next">
                                                    <i className="fa-solid fa-chevron-right"></i>
                                                </div>}

                                        </div>
                                    </div>
                                </div>

                            </div>
                        }
                        {/*{checkAction === "show statistical" &&*/}
                        {/*    <div style={{height: 600}}>*/}
                        {/*        <div className="row table__head">*/}
                        {/*            <h3 className="col l-1">STT</h3>*/}
                        {/*            <h3 className="col l-3">Tên khách hàng</h3>*/}
                        {/*            <h3 className="col l-3">Tổng số tiền đã mua</h3>*/}
                        {/*        </div>*/}
                        {/*        {listUser != null && listUser.map((element) => {*/}
                        {/*            return (*/}
                        {/*                <>*/}
                        {/*                    <div className="row table__content">*/}
                        {/*                        <div className="col l-1">{++index}</div>*/}
                        {/*                        <div className="col l-3">{element.account.users.name}</div>*/}
                        {/*                        <div className="col l-3">{element.total.toLocaleString()}đ</div>*/}
                        {/*                    </div>*/}

                        {/*                </>*/}
                        {/*            )*/}
                        {/*        })}*/}
                        {/*        <div className="body__home-nav-page">*/}
                        {/*            <div className="nav-page__container">*/}
                        {/*                <div className="nav-page__container-btn" onClick={() => {*/}
                        {/*                    setPage(pageNumber - 1)*/}
                        {/*                }}>*/}
                        {/*                    {pageNumber > 0 &&*/}
                        {/*                        <div className="btn btn-prev">*/}
                        {/*                            <i className="fa-solid fa-chevron-left"></i>*/}
                        {/*                        </div>}*/}

                        {/*                </div>*/}

                        {/*                <ul className="nav-page__container-number-page">*/}
                        {/*                    <li className="btn btn-page">{pageNumber + 1} | {totalPages}</li>*/}
                        {/*                </ul>*/}

                        {/*                <div className="nav-page__container-btn" onClick={() => {*/}
                        {/*                    setPage(pageNumber + 1)*/}
                        {/*                }}>*/}
                        {/*                    {pageNumber + 1 < totalPages &&*/}
                        {/*                        <div className="btn btn-next">*/}
                        {/*                            <i className="fa-solid fa-chevron-right"></i>*/}
                        {/*                        </div>}*/}

                        {/*                </div>*/}
                        {/*            </div>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*}*/}

                        {checkAction === "show statistical" && <div>
                            {/*<button style={{marginLeft: 600, marginTop: 50}}>Biểu Đồ doanh số</button>*/}
                            <ShowChart/>
                        </div>}
                    </div>
                </div>
            </div>
            <FooterForm/>
            {/*modal add product*/}
            <div id="modalAddProduct">
                <div className="modal__background" onClick={closeModal}></div>
                <div className="modal__container">
                        <span className="modal__close" onClick={closeModal}>
                            <i className="modal__close-icon fa-solid fa-xmark"></i>
                        </span>
                    <h1 className="modal__container-title modal__container-title-crud">
                        {id === -1 && <span>Thêm Sản Phẩm</span>}
                        {id !== -1 && <span>Chỉnh Sửa Sản Phẩm</span>}
                    </h1>

                    {/*formik open*/}
                    <Formik
                        initialValues={{
                            id: id,
                            name: product.name ? product.name : '',
                            quantity: product.quantity ? product.quantity : '',
                            price: product.price ? product.price : '',
                            description: product.description ? product.description : '',
                            imagePath: '',
                            category: {
                                id: ''
                            },
                            date: Date.now()
                        }}
                        validationSchema={validationSchema}
                        onSubmit={(values) => {
                            console.log(values);
                            save(values)
                        }}
                        enableReinitialize={true}
                    >
                        {(formik) => (
                            <Form id={"demo"} className="grid wide modal__create">
                                <div className="row">
                                    <div className="col l-6">
                                        <div className="form__field">
                                            <div className="form__field-container">
                                                <Field name={'name'} type="text" placeholder="Tên Sản Phẩm(*)"/>
                                                <div className="error__message">
                                                    <ErrorMessage name="name"/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col l-6">
                                        <div className="form__field">
                                            <div className="form__field-container">
                                                <Field name={'price'} type="text" placeholder="Đơn giá sản phẩm(*)"/>
                                                <div className="error__message"><ErrorMessage name="price"/></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col l-6">
                                        <div className="form__field">
                                            <div className="form__field-container">
                                                <Field name={'quantity'} type="text"
                                                       placeholder="Số lượng sản phẩm(*)"/>
                                                <div className="error__message">
                                                    <ErrorMessage name="quantity"/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col l-6">
                                        <div className="form__field">
                                            <div className="form__field-container">
                                                <Field name={'description'} type="text"
                                                       placeholder="Mô tả sản Phẩm(*)"/>
                                                <div className="error__message">
                                                    <ErrorMessage name="description"/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col l-6">
                                        <div className="form__field-container">
                                            <Field id="category" name="category.id" as="select">
                                                <option value={''}>Vui lòng chọn category</option>
                                                {categories != null && categories.map((item, id) => (
                                                    <option key={id} value={item.id}>{item.name}</option>
                                                ))}
                                            </Field>
                                            <div className="error__message">
                                                <ErrorMessage name="category"/>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col l-6" style={{height: 168}}>
                                        <div className="form__field">
                                            <Field className="input__file"
                                                   name="image"
                                                   type="file"
                                                   multiple
                                                   onChange={(e) => uploadFile(e)}/>
                                        </div>

                                        <div>
                                            {
                                                !image &&
                                                <h3 className='inner-bar'
                                                    style={{width: `${progressPercent} % `}}>{progressPercent}%</h3>
                                            }
                                            {
                                                image &&
                                                <img src={image} alt='uploaded file' style={{width: 100, height: 100}}/>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="container__btn-crud">
                                    <div className="row">
                                        <div className="">
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
            {/*modal add voucher*/}
            <div id="modalAddVoucher">
                <div className="modal__background" onClick={closeModalVoucher}></div>
                <div className="modal__container modal__container-voucher">
                        <span className="modal__close" onClick={closeModalVoucher}>
                            <i className="modal__close-icon fa-solid fa-xmark"></i>
                        </span>
                    <h1 className="modal__container-title" style={{textAlign: "center"}}>
                        <span>Thêm Mã Giảm Giá</span>
                    </h1>

                    {/*formik open*/}
                    <Formik
                        initialValues={{
                            name: "",
                            percent: "",
                            quantity: "",
                        }}
                        validationSchema={validationSchemaVoucher}
                        onSubmit={(values) => {
                            saveVoucher(values)
                        }}
                        enableReinitialize={true}
                    >
                        {(formik) => (
                            <Form id={"voucher"}>
                                <div>
                                    <div>
                                        <ErrorMessage name="name"/>
                                    </div>
                                    <div className="form__field">
                                        <div className="form__field-container">
                                            <Field name={'name'} type="text"
                                                   placeholder="Nhập mã giảm giá (*)"/>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div><ErrorMessage name="percent"/></div>
                                    <div className="form__field">
                                        <div className="form__field-container">
                                            <Field name={'percent'} type="number"
                                                   placeholder="Phần trăm khuyến mãi (*)"/>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div>
                                        <ErrorMessage name="quantity"/>
                                    </div>
                                    <div className="form__field">
                                        <div className="form__field-container">
                                            <Field name={'quantity'} type="number"
                                                   placeholder="Số lượng mã giảm giá"/>

                                        </div>
                                    </div>
                                </div>
                                <div className="container__btn-crud">
                                    <div className="row">
                                        <div className="">
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

    //show sản phẩm
    function showProduct() {
        setCheckAction("show product")
    }

    //show voucher

    function showVoucher() {
        setCheckAction("show voucher")
        axios.get(`http://localhost:8081/home/shops/voucher/${shop.id}`).then((response) => {
            setVoucher(response.data.content)
        })
    }

    function updateVoucher(id) {

    }

    function deleteVoucher(id) {

    }

    // bắt đầuxử lý voucher
    function saveVoucher(values) {
        axios.post(`http://localhost:8081/home/shops/${param.id}/voucher`, values).then((response) => {
            closeModalVoucher()
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Thêm Mã Thành Công',
                showConfirmButton: false,
                timer: 1500
            })
        })
    }

    function openModalVoucher() {
        document.getElementById("modalAddVoucher").style.display = "flex"
    }

    function closeModalVoucher() {
        document.getElementById("voucher").reset()
        document.getElementById("modalAddVoucher").style.display = "none"
    }

    // kết thúc sử lý voucher


    function showDetailProduct(id) {
        alert("detail product " + id)
    }

    function deleteProduct(id) {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false
        })

        swalWithBootstrapButtons.fire({
            title: 'Bạn có chắc không?',
            text: "Bạn sẽ không thể hoàn tác điều này!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Có',
            cancelButtonText: 'không',
            reverseButtons: true,
            width: 500,
            height: 400,
            customClass: {
                confirmButton: 'confirmButtonColor',
                cancelButton: 'cancelButtonColor',
            },

        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`http://localhost:8081/home/shops/delete/${id}`).then((response) => {
                    swalWithBootstrapButtons.fire(
                        'Xóa Sản Phẩm',
                        'Tập tin của bạn xóa thành công',
                        'success'
                    )
                    setCheckRender(!checkRender)
                })

            } else if (
                /* Read more about handling dismissals below */
                result.dismiss === Swal.DismissReason.cancel
            ) {
                swalWithBootstrapButtons.fire(
                    'Đã hủy',
                    'Tập tin của bạn an toàn)',
                    'error'
                )
            }
        })
    }

    // function formSave(id) {
    //     setId(id)
    //     if (id !== -1) {
    //         axios.get(`http://localhost:8081/home/products/${id}`).then((response) => {
    //             setProduct(response.data)
    //         })
    //     }
    //     document.getElementById("modalAddProduct").style.display = "flex"
    // }

    // function save(values) {
    //     if (id !== -1) {
    //         values.id = id
    //     }
    //     values.imagePath = imagePath
    //
    //     axios.post(` http://localhost:8081/home/products/shop/${param.id}`, values).then((response) => {
    //         axios.get(`http://localhost:8081/home/categories`).then((response) => {
    //             setCategories(response.data)
    //         })
    //         axios.get(`http://localhost:8081/home/shops/${param.id}/categories`).then((response) => {
    //             setCategoryShop(response.data)
    //         })
    //         axios.get(`http://localhost:8081/home/products/shop/${param.id}`).then((response) => {
    //             setProducts(response.data.content)
    //             setTotalElements(response.data.totalElements)
    //         })
    //         closeModal()
    //         document.getElementById("demo").reset()
    //         setImage('')
    //         setProgressPercent(0)
    //     })
    // }

    function closeModal() {
        document.getElementById("demo").reset()
        setImage('')
        setProgressPercent(0)
        document.getElementById("modalAddProduct").style.display = "none"
    }

    // function uploadFile(e) {
    //     let a = []
    //     setCheck(true)
    //     const files = e.currentTarget.files;
    //     console.log(files)
    //     for (let i = 0; i < files.length; i++) {
    //         if (e.target.files) {
    //             const time = new Date().getTime()
    //             const storageRef = ref(storage, `image/${time}_${e.target.files[i].name}`);
    //             const uploadTask = uploadBytesResumable(storageRef, e.target.files[i]);
    //
    //             uploadTask.on("state_changed",
    //                 (snapshot) => {
    //                     const progress =
    //                         Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
    //                     setProgressPercent(progress);
    //                 },
    //                 (error) => {
    //                     console.log(error);
    //                 },
    //                 () => {
    //                     getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
    //                         a = [downloadURL, ...a]
    //                         setImage(downloadURL)
    //                         setImagePath([...a])
    //                         setCheck(false)
    //                     });
    //                 }
    //             );
    //         }
    //     }
    //     e.currentTarget.value = null;
    //
    // }


    // Hiển thị các đơn hàng đang chờ xử lý
    function showBillDetail() {
        setCheckAction("show bill detail")
        axios.get(`http://localhost:8081/home/bills/shops/${shop.id}?page=${pageNumberBill}`).then((response) => {
            setBillDetails(response.data.content)
            setTotalPagesBill(response.data.totalPages)
        })
    }


    // Shop xác nhận đơn hàng, trạng thái chuyển sang đang giao hàng
    function updateStatusBill2(idBill, billDetail) {
        setCheckBillDetail(!checkBillDetail)
        axios.post(`http://localhost:8081/home/bills/update/status-bill/2/${idBill}`, billDetail).then((response) => {
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Xác nhận đơn hàng thành công!',
                showConfirmButton: false,
                timer: 1500
            })
            showBillDetail()
        })
    }

    function showUsersBuyProductOfShop() {
        setCheckAction("show statistical")
        axios.get(`http://localhost:8081/home/shops/users/${shop.id}`).then((res) => {
            setListUser(res.data)
            console.log(res.data)
        })
    }

    function ShowChart() {
        let arrLabel = [];
        let arrData = [];
        if (productsAll !== null) {
            for (let i = 0; i < productsAll.length; i++) {
                if (productsAll[i].totalQuantity > 0) {
                    arrLabel.push(productsAll[i].name)
                    arrData.push(productsAll[i].totalQuantity)
                }
            }
            console.log(arrLabel)
            console.log(arrData)
        }

        const data = {
            labels: arrLabel,
            datasets: [
                {
                    label: 'Doanh số bán hàng',
                    data: arrData,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }
            ]
        };

        const options = {
            scales: {
                x: {
                    type: 'category',
                    ticks: {
                        display: false,
                    },
                },
                y: {
                    beginAtZero: true,
                },
            },
            plugins: {
                legend: {
                    display: false,
                },
            },
            layout: {
                padding: {
                    left: 10,
                    right: 10,
                    top: 0,
                    bottom: 10,
                },
            },
            responsive: true,
            maintainAspectRatio: false,
        };

        return (
            <>
                <h1 style={{marginLeft: 400, marginTop: 50, marginBottom: 20}}> Thống Kê Doanh Số Bán Hàng </h1>
                <div style={{width: 1200, height: 400}}>
                    <Bar data={data} options={options}/>
                </div>
            </>
        )
    }
}