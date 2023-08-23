import '../css/Register.css'
import * as Yup from 'yup'
import {ErrorMessage, Field, Form, Formik} from "formik";
import HeaderForm from "./HeaderForm";
import FooterForm from "./FooterForm";
import ContentForm from "./ContentForm";
import {useEffect, useRef, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import Loading from "./Loading";
import Swal from "sweetalert2";

export default function FormRegister() {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [seconds, setSeconds] = useState(180);
    const initialSecondsRef = useRef(180);
    const countdownIntervalRef = useRef(null);
    const [account,setAccount]=useState([])
    const [flag, setFlag] = useState(false)

    useEffect(() => {
        if (isModalOpen) {
            countdownIntervalRef.current = setInterval(() => {
                setSeconds((prevSeconds) => prevSeconds - 1);
            }, 1000);
        } else {
            clearInterval(countdownIntervalRef.current);
        }

        return () => clearInterval(countdownIntervalRef.current);
    }, [isModalOpen]);

    useEffect(() => {
        if (!isModalOpen) {
            setSeconds(initialSecondsRef.current);
        }
    }, [isModalOpen]);

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    useEffect(() => {
        if (seconds === 0) {
            setSeconds(0);
            clearInterval(countdownIntervalRef.current);
        }
    }, [seconds]);

    const navigate = useNavigate();
    const [status, setStatus] = useState("password")
    const [code, setCode] = useState("123456")
    const [role, setRole] = useState(3)
    const [codeInput, setCodeInput] = useState("")
    const Validation = Yup.object().shape({
        phone: Yup.string().min(0, "Số điện thoại không hợp lệ!").max(11, "Số điện thoại không hợp lệ!").required("Bạn chưa nhập thông tin!"),
        password: Yup.string().required("Bạn chưa nhập mật khẩu!").min(6, "Mật khẩu từ 6 đến 8 ký tự!").max(15, "Mật khẩu từ 6 đến 8 ký tự!"),
        name: Yup.string().required("Bạn cần nhập thông tin!"),
        email: Yup.string().required("Bạn cần nhập thông tin!"),
        address: Yup.string().required("Bạn cần nhập thông tin!")
    })


    return (
        <>
            <Formik
                initialValues={
                    {
                        role: {
                            id: {role}
                        },
                        users: {
                            phone: "",
                            password: "",
                            name: "",
                            email: "",
                            address: ""
                        }
                    }
                }
                onSubmit={(values) => {
                    console.log(values)
                    save(values)
                }}
                validationSchema={Validation}>

                <Form>
                    <div id="main-form">
                        <HeaderForm/>

                        {/*Start Body & Form*/}
                        <div id="body">
                            <div className="grid wide">
                                <div className="row body__container">
                                    <ContentForm/>

                                    <div className="col l-6">
                                        <div className="body__right">
                                            <div className="body__right-container">
                                                <h1 className="body__right-title">Đăng Ký Tài Khoản</h1>
                                                <div className="form">
                                                    <div className="form__field">
                                                        <div className="form__field-container">
                                                            <Field name={'phone'} type="text" placeholder="Số điện thoại(*)"/>
                                                            <div className={'error__message'}><ErrorMessage name={'phone'}/></div>
                                                        </div>
                                                    </div>
                                                    <div className="form__field">
                                                        <div className="form__field-container">
                                                            <div className="form__field-items">
                                                                <Field name={'password'} id="password"
                                                                       type={status} placeholder="Mật khẩu(*)"/>
                                                                <div id="event" className="form__field-items-icon" onClick={setStatusPassword}>
                                                                    {status === "text" && <i id="eye-open" className="fa-solid fa-eye"></i>}
                                                                    {status === "password" && <i id="eye-close" className="fa-solid fa-eye-slash"></i>}
                                                                </div>
                                                            </div>
                                                            <div className={'error__message'}><ErrorMessage
                                                                name={'password'}/></div>
                                                        </div>
                                                    </div>

                                                    <div className="form__field">
                                                        <div className="form__field-container">
                                                            <Field name={'name'} type="text" placeholder="Tên(*)"/>
                                                            <div className={'error__message'}><ErrorMessage
                                                                name={'name'}/></div>
                                                        </div>
                                                    </div>

                                                    <div className="form__field">
                                                        <div className="form__field-container">
                                                            <Field id={'email'} name={'email'} type="email"
                                                                   placeholder="Email(*)"/>
                                                            <div className={'error__message'}><ErrorMessage
                                                                name={'email'}/></div>
                                                        </div>
                                                    </div>

                                                    <div className="form__field">
                                                        <div className="form__field-container">
                                                            <Field name={'address'} type="text"
                                                                   placeholder="Địa chỉ(*)"/>
                                                            <div className={'error__message'}><ErrorMessage
                                                                name={'address'}/></div>
                                                        </div>
                                                    </div>

                                                    <div className="container__btn">
                                                        <div className="container__btn-desc">
                                                            <span> Bạn đăng kí là: </span>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col l-6">
                                                                <div className="container__btn">
                                                                    <div className="btn" onClick={() => {
                                                                        OpenModal1(document.getElementById("email").value)
                                                                    }}>Người cung
                                                                        cấp
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="col l-6">
                                                                <div className="container__btn">
                                                                    <div className="btn" onClick={() => {
                                                                        OpenModal2(document.getElementById("email").value)
                                                                    }}>Người
                                                                        dùng
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="footer__form">
                                                        <span
                                                            className="footer__form-text">Bạn đã có tài khoản FCBlue?</span>
                                                        <Link to={"/login"}>Đăng nhập</Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/*End Body & Form*/}
                        <FooterForm/>
                    </div>
                    {/*Start Modal*/}
                    <div id="modal">
                        <div className="modal__background" onClick={closeModal}></div>
                        <div className="modal__container">
                        <span className="modal__close" onClick={closeModal}>
                            <i className="modal__close-icon fa-solid fa-xmark"></i>
                        </span>
                            <h1 className="modal__container-title">Nhập mã xác nhận </h1>

                            <div className="modal__container-input">
                                <input id={'inputCode'} type="text" placeholder="Mời nhập mã xác nhận..."
                                       onChange={(event) => {
                                           setCodeInput(event.target.value)
                                       }}/>

                            </div>
                            <div style={{marginTop:20,marginLeft:170}}>
                                <h2 style={{color: "red"}}>
                                    {minutes}:{remainingSeconds < 10 ? "0" : ""}{remainingSeconds}
                                </h2>
                            </div>
                            <div className="modal__container-desc" style={{marginTop:10}}>
                                <span>Mã xác nhận đã được gửi vào mail của bạn. Vui lòng kiểm tra mail để lấy mã!</span>
                            </div>
                            <button type={"submit"} className="btn">Xác nhận</button>
                        </div>
                    </div>
                    {/*End Modal*/}
                    {flag && <Loading/>}
                </Form>
            </Formik>
        </>
    )

    // Ẩn - hiện mật khẩu
    function setStatusPassword() {
        if (status === "password") {
            setStatus("text");

        } else {
            setStatus("password");
        }
    }

    // Mở modal nhập mã xác nhận
    function OpenModal1(value) {
        axios.post(`http://localhost:8081/accounts/randomCode/${value}`).then((response) => {
            setCode(response.data)
            console.log(response.data)
            if (response.data === "emailError") {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Email đã tồn tại',
                    showConfirmButton: false,
                    timer: 2000
                })
            } else {
                setIsModalOpen(true)
                setRole(2)
                document.getElementById("modal").style.display = "flex"
            }
        })


    }

    function OpenModal2(value) {
        axios.post(`http://localhost:8081/accounts/randomCode/${value}`).then((response) => {
            setCode(response.data)
            if (response.data === "emailError") {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Email đã tồn tại',
                    showConfirmButton: false,
                    timer: 2000
                })
            } else {
                setIsModalOpen(true)
                setRole(3)
                document.getElementById("modal").style.display = "flex"
            }
        })


    }

    function save(value) {
        setAccount({
            role: {
                id: role
            },
            users: {
                phone: value.phone,
                password: value.password,
                name: value.name,
                email: value.email,
                address: value.address
            }
        })

        if (code == codeInput) {
            console.log(account)
            if (seconds !== 0) {
                axios.post(`http://localhost:8081/accounts/save`, account).then((response) => {
                    document.getElementById("inputCode").value = ""
                    navigate('/login')
                })
            } else {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Mã hết hiệu lực!',
                    showConfirmButton: false,
                    timer: 2000
                })
                document.getElementById("inputCode").value = ""
                closeModal()
            }
        } else {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Mã xác nhận không chnh xác!',
                showConfirmButton: false,
                timer: 2000
            })
            document.getElementById("inputCode").value = ""
        }
    }

    // Đóng modal nhập mã xác nhận
    function closeModal() {
        setIsModalOpen(false)
        document.getElementById("modal").style.display = "none"
    }

}