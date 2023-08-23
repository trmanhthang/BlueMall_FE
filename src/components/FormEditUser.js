import '../css/FormEditUser.css'
import HeaderInfo from "./HeaderInfo";
import {useEffect, useState} from "react";
import axios from "axios";
import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";
import {useNavigate} from "react-router-dom";
import Swal from "sweetalert2";
import {getDownloadURL, ref, uploadBytesResumable} from "firebase/storage";
import storage from "./FireBaseConfig";

export default function FormEditUser() {
    const [progressPercent, setProgressPercent] = useState(0)
    const [open, setOpen] = useState(false)
    const [check, setCheck] = useState(false)
    const [status, setStatus] = useState("password")
    const[img, setImg] = useState("/img/logo/avatar-facebook-mac-dinh-8.jpg")
    const [name, setName] = useState("")
    const [account, setAccount] = useState({})
    const idAccount = localStorage.getItem("idAccount")
    const role = localStorage.getItem("role")
    const [flag,setFlag]=useState(false)
    const navigate = useNavigate()
    const Validation = Yup.object().shape({
        name: Yup.string().required("Bạn cần nhập họ tên!")
    })

    useEffect(() => {
        axios.get(`http://localhost:8081/accounts/${idAccount}`).then((response) => {
            setAccount(response.data)
            setName(response.data.name)
            if (response.data.pathImage===null){
                setImg(img)
            }else {
                setImg(response.data.pathImage)
            }
        })
    }, [flag])

    //Thay đổi tên mềm FE
    function displayName(event){
        let nameDisplay = event.target.value
        setName(nameDisplay)
    }

    return(
        <>
            <Formik
                initialValues={{
                    id: idAccount,
                    name: name,
                    phone: account.phone,
                    email: account.email,
                    address: account.address,
                    password: account.password,
                    pathImage: img
                }}

                onSubmit={(values) => {
                    editAccount(values)
                }}

                // validationSchema={Validation}

                enableReinitialize={true}>

                <div id="main-info">
                    <HeaderInfo name={name} img={img}/>
                    <div className="container__form-edit-user">
                        <div className="form-edit-user__header">
                            <i className="fa-solid fa-user"></i>
                            <h1>Tài Khoản</h1>
                        </div>

                        <div className="form-edit-user__container-form">
                            <div className="form-edit-user__form">
                                <div className="form-edit-user__form-title">
                                    <h2>Hồ sơ của tôi</h2>
                                    <span>Quản lý thông tin hồ sơ để bảo mật tài khoản</span>
                                </div>

                                <Form className="form-info">
                                    <div className="form-info__container-input">
                                        <div className="grid wide">
                                            <div className="row">
                                                <div className="col l-7">
                                                    <div className="row form-info__row">
                                                        <div className="col l-3">
                                                            <div className="form-info__title">
                                                                Tên người dùng
                                                            </div>
                                                        </div>

                                                        <div className="col l-9">
                                                            <div className="form-info__input">
                                                                <Field type="text" name={"name"} onChange={(event)=>displayName(event)} id="name" value={name} />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="row form-info__row">
                                                        <div className="col l-3">
                                                            <div className="form-info__title">
                                                                Mật khẩu
                                                            </div>
                                                        </div>

                                                        <div className="col l-9">
                                                            <div className="form-info__input">
                                                                <Field type={status} name={"password"} id="password"/>
                                                                <div className="form-info__input-container-icon" onClick={showPassword}>
                                                                    {status === "text" && <i className="fa-solid fa-eye"></i>}
                                                                    {status === "password" && <i className="fa-solid fa-eye-slash"></i>}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="row form-info__row">
                                                        <div className="col l-3">
                                                            <div className="form-info__title">
                                                                Địa chỉ
                                                            </div>
                                                        </div>

                                                        <div className="col l-9">
                                                            <div className="form-info__input">
                                                                <Field type="text" name={"address"} id="address"/>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="row form-info__row">
                                                        <div className="col l-3">
                                                            <div className="form-info__title">
                                                                Email
                                                            </div>
                                                        </div>

                                                        <div className="col l-9">
                                                            <div className="form-info__input">
                                                                <Field type="email" name={"email"} id="email"/>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="row form-info__row">
                                                        <div className="col l-3">
                                                            <div className="form-info__title">
                                                                Số điện thoại
                                                            </div>
                                                        </div>

                                                        <div className="col l-9">
                                                            <div className="form-info__input">
                                                                <Field type="text" name={"phone"} id="phone"/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col l-5">
                                                    <div className="form-info__input-file--show">
                                                        <div className="form-info__container-img">
                                                            <img src={img} alt=""/>
                                                        </div>
                                                    </div>
                                                    <div className="form-info__input-file">
                                                        <Field onChange={(e) => uploadFile(e)} type={"file"} name={"img"}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-info__container-btn">
                                        <button type={"submit"} className="btn btn-info">Lưu hồ sơ</button>
                                    </div>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </Formik>
        </>
    )

    //Lưu chỉnh sửa
    function editAccount(value) {
        console.log(value)
        axios.post(`http://localhost:8081/accounts/update-user`, value).then(() => {
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Thay đổi thành công!',
                showConfirmButton: false,
                timer: 2000
            })
            setFlag(!flag)
            navigate("/")
        }).catch(() => {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Đã xảy ra lỗi!',
                showConfirmButton: false,
                timer: 2000
            })
            setFlag(!flag)
        })
    }

    //Ẩn - hiện mật khẩu
    function showPassword() {
        if(status === "password") {
            setStatus("text")
        } else {
            setStatus("password")
        }
    }

    //Upload ảnh
    function uploadFile(e) {
        setCheck(true)
        if (e.target.files[0]) {
            const time = new Date().getTime()
            const storageRef = ref(storage, `image/${time}_${e.target.files[0].name}`);
            const uploadTask = uploadBytesResumable(storageRef, e.target.files[0]);

            uploadTask.on("state_change",
                () => {

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
                                }, 110)
                            },
                            willClose: () => {
                            }
                        }).then((result) => {
                            setImg(downloadURL)
                        }).then(() => {
                            Swal.fire({
                                position: 'center',
                                icon: 'success',
                                title: 'Cập nhật thành công',
                                showConfirmButton: false,
                                timer: 1200
                            })
                        })
                        setCheck(false)
                    });
                },
                // () => {
                //     getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                //         let timerInterval
                //         Swal.fire({
                //             title: 'Đang tải ảnh lên!',
                //             html: 'Thời gian tải lên <b></b> giây.',
                //             timer: 2000,
                //             timerProgressBar: true,
                //             didOpen: () => {
                //                 Swal.showLoading()
                //                 const b = Swal.getHtmlContainer().querySelector('b')
                //                 timerInterval = setInterval(() => {
                //                     b.textContent = Swal.getTimerLeft()
                //                 }, 110)
                //             },
                //             willClose: () => {
                //                 clearInterval(timerInterval)
                //                 setImg(downloadURL)
                //             }
                //         }).then((result) => {
                //             // setImg(downloadURL)
                //             /* Read more about handling dismissals below */
                //             if (result.dismiss === Swal.DismissReason.timer) {
                //                 console.log('I was closed by the timer')
                //             }
                //         })
                //         setCheck(false)
                //     });
                // }
            );
        }
    }
}