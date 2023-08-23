import HeaderInfo from "./HeaderInfo";
import React, {useEffect, useState} from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {Link, useNavigate, useParams} from "react-router-dom";
import '../css/ProductShop.css'
import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";
import {getDownloadURL, ref, uploadBytesResumable} from "firebase/storage";
import storage from "./FireBaseConfig";


export default function ProductShop() {
    const idAccount = localStorage.getItem("idAccount")
    const navigate = useNavigate()
    const [user, setUser] = useState([])
    const [flag,setFlag] = useState(false)
    const[img, setImg] = useState("/img/logo/avatar-facebook-mac-dinh-8.jpg")
    const [account, setAccount] = useState({})
    const [name, setName] = useState("")
    const [shop, setShop] = useState({})
    const [products, setProducts] = useState([])
    const [product, setProduct] = useState({})
    const [totalPages, setTotalPages] = useState(0)
    const [totalElements, setTotalElements] = useState(0)
    const [categories, setCategories] = useState([])
    const [categoryShop, setCategoryShop] = useState([])
    const [check, setCheck] = useState(false)

    const [image, setImage] = useState("")
    const [imagePath, setImagePath] = useState([])
    const [id, setId] = useState(0)
    const [pageNumber, setPage] = useState(0)
    const [nameProduct, setNameProduct] = useState("")
    const [checkRender, setCheckRender] = useState(false)
    const [progressPercent, setProgressPercent] = useState(0)

    const [quantity, setQuantity] = useState("")
    const [price, setPrice] = useState("")
    const [desc, setDesc] = useState("")
    const [category, setCategory] = useState("")
    console.log(shop)

    // const validationSchema = Yup.object().shape({
    //     name: Yup.string()
    //         .required('Vui lòng nhập tên sản phẩm'),
    //
    //     description: Yup.string()
    //         .required('Vui lòng nhập mô tả'),
    //
    //     quantity: Yup.number()
    //         .required('Vui lòng nhập số lượng sản phẩm')
    //         .positive('Số lượng sản phẩm phải lớn hơn 0'),
    //
    //     price: Yup.number()
    //         .required('Vui lòng nhập giá sản phẩm')
    //         .positive('Giá sản phẩm phải lớn hơn 0'),
    //
    //     category: Yup.object()
    //         .required('Vui lòng chọn danh mục sản phẩm'),
    // });
    useEffect(() => {
        axios.get(`http://localhost:8081/accounts/${idAccount}`).then((response) => {
            setAccount(response.data)
            setName(response.data.name)
            if (response.data.pathImage === null) {
                setImg(img)
            } else {
                setImg(response.data.pathImage)
            }
            console.log(account)
        })

        if (idAccount) {
            axios.get(`http://localhost:8081/home/shops/${idAccount}`).then((response) => {
                setShop(response.data)
                if (idAccount == response.data.account.id) {
                    axios.get(`http://localhost:8081/home/products/shop-crud/${idAccount}?page=${pageNumber}`).then((response) => {
                        setProducts(response.data.content)
                        setTotalPages(response.data.totalPages)
                        setTotalElements(response.data.totalElements)
                    })
                    axios.get(`http://localhost:8081/home/categories`).then((response) => {
                        setCategories(response.data)
                    })
                    axios.get(`http://localhost:8081/home/shops/${idAccount}/categories`).then((response) => {
                        setCategoryShop(response.data)
                    })
                    // axios.get(`http://localhost:8081/accounts/${param.id}`).then((response) => {
                    //     setUser(response.data)
                    // })
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


    //Sự kiện thay đổi tên
    function editName(event) {
        setNameProduct(event.target.value)
    }

    //Sự kiện thay đổi giá
    function editPrice(event) {
        setPrice(event.target.value)
    }

    //Sự kiện thay đổi số lượng
    function editQuantity(event) {
        setQuantity(event.target.value)
    }

    let index = 0
    return (
        <>
            <div id="main-cart">
                <HeaderInfo name={name} img={img}/>
                <div className="container__form-edit-user">
                    <div className="form-edit-user__header">
                        <i className="fa-solid fa-store"></i>
                        <h1>Cửa hàng</h1>
                    </div>

                    <div className="form-edit-user__container-form">
                        <div className="form-edit-user__form">
                            <div className="form-edit-user__form-title">
                                <h2>Cửa hàng của tôi</h2>
                                <span>Quản lí cửa hàng dễ dàng hơn</span>
                            </div>

                            <div className="form-edit-user__form--container">
                                <div className="btn btn-create" onClick={() => formCreate()}>
                                    Thêm sản phẩm
                                </div>
                            </div>

                            <div className="form-cart">
                                <ul className="list-product__shop">
                                    {products.length !== 0 && products.map((product) => {
                                        return (
                                            <>
                                                <li className="product-items">
                                                    <div className="row">
                                                        <div className="col l-1 product-items--center">
                                                            <span>{++index}</span>
                                                        </div>

                                                        <div className="col l-3">
                                                            <div className="product-items__container">
                                                                <div className="product-items__container--center">
                                                                    <div className="product-items__container-img">
                                                                        {/*<img src="/img/logo/avatar-facebook-mac-dinh-8.jpg"/>*/}
                                                                        <img src={product.imagePath[0]} alt=""/>
                                                                    </div>
                                                                </div>

                                                                <div className="product-items__name">
                                                                    <span>{product.name}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col l-2 product-items--center">
                                                            <div className="product-items__container-price product-items__container-price--remove-margin">
                                                                Giá
                                                                <div className="product-items__price ">
                                                                    <span>{product.price.toLocaleString()}</span>
                                                                    đ</div>
                                                            </div>
                                                        </div>

                                                        <div className="col l-2 product-items--center">
                                                            <div className="product-items__container">
                                                                <div className="product-items__text">
                                                                    Số lượng
                                                                </div>

                                                                <div className="product-items__total">
                                                                    <span>{product.quantity}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col l-4 product-items--center">
                                                            <div className="product-items__container">
                                                                <div className="product-items__container-btn" onClick={() => formSave(product.id)}>
                                                                    <div className="btn btn-edit">Sửa</div>
                                                                </div>

                                                                <div className="product-items__container-btn product-items__container-btn--remove-margin" onClick={() => deleteProduct(product.id)}>
                                                                    <div className="btn btn-delete">Xoá</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            </>
                                        )
                                    })}
                                </ul>
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
                        </div>
                    </div>
                </div>
            </div>

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
                            name: nameProduct,
                            quantity: quantity,
                            price: price,
                            description: product.description ? product.description : '',
                            imagePath: '',
                            category: {
                                id: ''
                            },
                            date: Date.now()
                        }}
                        // validationSchema={validationSchema}
                        onSubmit={(values) => {
                            console.log(values);
                            save(values)
                        }}
                        enableReinitialize={true}
                    >
                        {(formik) => (
                            <Form id={"demo"} className="grid wide modal__create">
                                <div className="row">
                                    <div className="col l-5">
                                        <div className="row">
                                            <div className="col l-6">
                                                <div className="body__container-product">
                                                    <div className="product__img product__img--product-shop">
                                                        {/*<img src="/img/logo/vn-11134207-7qukw-lf5kh01qrr7u09_tn.jfif"/>*/}
                                                        <img src={image} />
                                                    </div>

                                                    <div className="product__content">
                                                        <h2 className="product__title">{nameProduct}</h2>

                                                        <div className="product__name-shop">
                                                            <i className="fa-solid fa-store"></i>
                                                            <span>{shop.name}</span>
                                                        </div>

                                                        <span
                                                            className="product__tag-shop"> # {category}</span>
                                                        <div className="product__price">
                                                            <span>{price}</span>
                                                            <p style={{marginLeft:5}}>đ</p>
                                                        </div>
                                                        <div className="product__address">
                                                    <span>
                                                        <i className="fa-solid fa-location-dot" style={{marginRight:4}}></i>
                                                        {/*{shop.city.name}*/}
                                                    </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col l-6">
                                                <ul>
                                                    {image.map}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col l-7">
                                        <div className="row">
                                            <div className="col l-12">
                                                <div className="form__field form__field-product">
                                                    <div className="form__field-container">
                                                        <Field name={'name'} type="text" placeholder="Tên sản phẩm" onChange={(event)=>editName(event)}/>
                                                        <div className="error__message">
                                                            <ErrorMessage name="name"/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col l-12">
                                                <div className="form__field form__field-product">
                                                    <div className="form__field-container">
                                                        <Field name={'price'} type="text" placeholder="Đơn giá sản phẩm(*)" onChange={(event)=>editPrice(event)}/>
                                                        <div className="error__message"><ErrorMessage name="price"/></div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col l-12">
                                                <div className="form__field form__field-product">
                                                    <div className="form__field-container">
                                                        <Field name={'quantity'} type="text"
                                                               placeholder="Số lượng sản phẩm(*)"/>
                                                        <div className="error__message">
                                                            <ErrorMessage name="quantity"/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col l-12">
                                                <div className="form__field form__field-product">
                                                    <div className="form__field-container">
                                                        <Field name={'description'} type="text"
                                                               placeholder="Mô tả sản Phẩm(*)"/>
                                                        <div className="error__message">
                                                            <ErrorMessage name="description"/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col l-12">
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

                                            <div className="col l-12" style={{height: 168}}>
                                                <div className="form__field form__field-product">
                                                    <Field className="input__file"
                                                           name="image"
                                                           type="file"
                                                           multiple
                                                           onChange={(e) => uploadFile(e)}/>
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
                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>
                    {/*formik close*/}
                </div>
            </div>

            {/*modal create product*/}
            <div id="modalCreateProduct">
                <div className="modal__background" onClick={closeModalCreate}></div>
                <div className="modal__container">
                        <span className="modal__close" onClick={closeModalCreate}>
                            <i className="modal__close-icon fa-solid fa-xmark"></i>
                        </span>
                    <h1 className="modal__container-title modal__container-title-crud">
                        <span>Thêm Sản Phẩm</span>
                    </h1>

                    {/*formik open*/}
                    <Formik
                        initialValues={{
                            name: nameProduct,
                            quantity: quantity,
                            price: price,
                            description: '',
                            imagePath: '',
                            category: {
                                id: ''
                            },
                            date: Date.now()
                        }}
                        // validationSchema={validationSchema}
                        onSubmit={(values) => {
                            console.log(values);
                            save(values)
                        }}
                        enableReinitialize={true}
                    >
                        {(formik) => (
                            <Form id={"demo"} className="grid wide modal__create">
                                <div className="row">
                                    <div className="col l-5">
                                        <div className="row">
                                            <div className="col l-6">
                                                <div className="body__container-product">
                                                    <div className="product__img product__img--product-shop">
                                                        {/*<img src="/img/logo/vn-11134207-7qukw-lf5kh01qrr7u09_tn.jfif"/>*/}
                                                        <img src={image} />
                                                    </div>

                                                    <div className="product__content">
                                                        <h2 className="product__title">{nameProduct}</h2>

                                                        <div className="product__name-shop">
                                                            <i className="fa-solid fa-store"></i>
                                                            <span>{shop.name}</span>
                                                        </div>

                                                        <span
                                                            className="product__tag-shop"> # {category}</span>
                                                        <div className="product__price">
                                                            <span>{price}</span>
                                                            <p style={{marginLeft:5}}>đ</p>
                                                        </div>
                                                        <div className="product__address">
                                                    <span>
                                                        <i className="fa-solid fa-location-dot" style={{marginRight:4}}></i>
                                                        {/*{shop.city.name}*/}
                                                    </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col l-6">
                                                <ul>
                                                    {image.map}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col l-7">
                                        <div className="row">
                                            <div className="col l-12">
                                                <div className="form__field form__field-product">
                                                    <div className="form__field-container">
                                                        <Field name={'name'} type="text" placeholder="Tên sản phẩm" onChange={(event)=>editName(event)}/>
                                                        <div className="error__message">
                                                            <ErrorMessage name="name"/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col l-12">
                                                <div className="form__field form__field-product">
                                                    <div className="form__field-container">
                                                        <Field name={'price'} type="text" placeholder="Đơn giá sản phẩm(*)" onChange={(event)=>editPrice(event)}/>
                                                        <div className="error__message"><ErrorMessage name="price"/></div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col l-12">
                                                <div className="form__field form__field-product">
                                                    <div className="form__field-container">
                                                        <Field name={'quantity'} type="text"
                                                               placeholder="Số lượng sản phẩm(*)"/>
                                                        <div className="error__message">
                                                            <ErrorMessage name="quantity"/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col l-12">
                                                <div className="form__field form__field-product">
                                                    <div className="form__field-container">
                                                        <Field name={'description'} type="text"
                                                               placeholder="Mô tả sản Phẩm(*)"/>
                                                        <div className="error__message">
                                                            <ErrorMessage name="description"/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col l-12">
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

                                            <div className="col l-12" style={{height: 168}}>
                                                <div className="form__field form__field-product">
                                                    <Field className="input__file"
                                                           name="image"
                                                           type="file"
                                                           multiple
                                                           onChange={(e) => uploadFile(e)}/>
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

    //Xoá sản phẩm của cửa hàng
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
                        'Xoá sản phẩm thành công',
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
                    'Hoàn tác thành công',
                    'error'
                )
            }
        })
    }

    //Mở form sửa sản phẩm
    function formSave(id) {
        setId(id)
        if (id !== -1) {
            axios.get(`http://localhost:8081/home/products/${id}`).then((response) => {
                setNameProduct(response.data.name)
                setPrice(response.data.price)
                setQuantity(response.data.quantity)
                setProduct(response.data)
                setImage(response.data.imagePath)
            })
        }
        document.getElementById("modalAddProduct").style.display = "flex"
    }

    //Mở form tạo sản phẩm
    function formCreate() {
        setNameProduct("")
        setPrice("")
        setQuantity("")
        document.getElementById("modalCreateProduct").style.display = "flex"
    }

    //Đóng modal craete
    function closeModalCreate() {
        document.getElementById("modalCreateProduct").style.display = "none"
    }

    //Đóng modal
    function closeModal() {
        document.getElementById("demo").reset()
        setImage('')
        setProgressPercent(0)
        document.getElementById("modalAddProduct").style.display = "none"
    }

    //Lưu sản phẩm
    function save(values) {
        values.imagePath = imagePath

        axios.post(` http://localhost:8081/home/products/shop/${idAccount}`, values).then((response) => {
            axios.get(`http://localhost:8081/home/categories`).then((response) => {
                setCategories(response.data)
            })
            axios.get(`http://localhost:8081/home/shops/${idAccount}/categories`).then((response) => {
                setCategoryShop(response.data)
            })
            axios.get(`http://localhost:8081/home/products/shop/${idAccount}`).then((response) => {
                setProducts(response.data.content)
                setTotalElements(response.data.totalElements)
            })
            closeModalCreate()
            closeModal()
            setImage('')
            setProgressPercent(0)
        }).then(() => {
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Cập nhật thành công',
                showConfirmButton: false,
                timer: 1500
            })
        })
    }

    //Upload file
    function uploadFile(e) {
        let a = []
        setCheck(true)
        const files = e.currentTarget.files;
        console.log(files)
        for (let i = 0; i < files.length; i++) {
            if (e.target.files) {
                const time = new Date().getTime()
                const storageRef = ref(storage, `image/${time}_${e.target.files[i].name}`);
                const uploadTask = uploadBytesResumable(storageRef, e.target.files[i]);

                uploadTask.on("state_changed",
                    (snapshot) => {
                        const progress =
                            Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                        setProgressPercent(progress);
                    },
                    (error) => {
                        console.log(error);
                    },
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            let timerInterval
                            Swal.fire({
                                title: 'Đang tải ảnh lên!',
                                html: 'Thời gian tải lên <b></b> giây.',
                                timer: 2000,
                                timerProgressBar: true,
                                didOpen: () => {
                                    Swal.showLoading()
                                    const b = Swal.getHtmlContainer().querySelector('b')
                                    timerInterval = setInterval(() => {
                                        b.textContent = Swal.getTimerLeft()
                                    }, 100)
                                },
                                willClose: () => {
                                }
                            }).then((result) => {
                                a = [downloadURL, ...a]
                                setImage(downloadURL)
                                setImagePath([...a])
                            }).then(() => {
                                Swal.fire({
                                    position: 'center',
                                    icon: 'success',
                                    title: 'Cập nhật thành công',
                                    showConfirmButton: false,
                                    timer: 1200
                                })
                            })
                            // a = [downloadURL, ...a]
                            // setImage(downloadURL)
                            // setImagePath([...a])
                            // setCheck(false)
                        });
                    }
                );
            }
        }
        e.currentTarget.value = null;

    }
}