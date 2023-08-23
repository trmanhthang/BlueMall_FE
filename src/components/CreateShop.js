import {ErrorMessage, Field, Form, Formik} from "formik";
import HeaderForm from "./HeaderForm";
import ContentForm from "./ContentForm";
import FooterForm from "./FooterForm";
import * as Yup from 'yup'
import '../css/Login.css'
import React, {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import axios from "axios";

export default function CreateShop() {

    const [city, setCity] = useState([])

    const navigate = useNavigate()
    const param = useParams()

    const [status, setStatus] = useState("password")
    const Validation = Yup.object().shape({
        name: Yup.string().required("Bạn cần nhập thông tin!"),
        description: Yup.string().required("Bạn cần nhập thông tin!")
            .min(6, "Tối thiểu từ 6 ký tự!")
            .max(255, "Tối đa  255 ký tự!"),
    })
    useEffect(() => {
        axios.get(`http://localhost:8081/home/city`).then((repose) => {
            setCity(repose.data)
        })
    }, [])


    return (
        <>
            <Formik
                initialValues={{
                    name: "",
                    description: "",
                    account:{
                        id:param.id
                    },
                    city: {
                        id:1
                    }
                }
                }
                onSubmit={(values) => {
                    sendData(values)
                }}
                validationSchema={Validation}>

                <Form>
                    <div id="main">
                        <HeaderForm/>

                        {/*Start Body & Form*/}
                        <div id="body">
                            <div className="grid wide">
                                <div className="row body__container">
                                    <ContentForm/>

                                    <div className="col l-6">
                                        <div className="body__right">
                                            <div className="body__right-container-login">
                                                <h1 className="body__right-title">
                                                    Tạo Mới Cửa Hàng
                                                </h1>
                                                <div className="form">
                                                    <div className="form__field">
                                                        <div className="form__field-container">
                                                            <Field name={'name'} type="name"
                                                                   placeholder="Tên Cửa Hàng (*)"/>
                                                            <div className={'error__message'}><ErrorMessage
                                                                name={'name'}/></div>
                                                        </div>
                                                    </div>
                                                    <div className="form__field">
                                                        <div className="form__field-container">
                                                            <Field name={'description'} type="name"
                                                                   placeholder="Mô Tả Cửa Hàng (*)"/>
                                                            <div className={'error__message'}><ErrorMessage
                                                                name={'description'}/></div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <Field id="category" name="city.id" as="select"
                                                               style={{width: 400, height: 35}}>
                                                            <option value={''}>Vui lòng chọn Thành Phố</option>
                                                            {city != null && city.map((item, id) => (
                                                                <option key={id} value={item.id}>{item.name}</option>
                                                            ))}
                                                        </Field>
                                                    </div>

                                                    <div className="container__btn" style={{marginLeft:150,marginBottom:30,marginTop:30}}>
                                                        <div className="row">
                                                            <div className="col l-8">
                                                                <div className="container__btn">
                                                                    <button type={"submit"} className="btn">Xác Nhận
                                                                    </button>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <FooterForm/>
                    </div>
                </Form>
            </Formik>
        </>
    )

    function sendData(values) {
        console.log(values)
        axios.post(`http://localhost:8081/home/shops`,values).then((response) => {
            navigate(`/shop-admin/${param.id}`)
        })

    }
}