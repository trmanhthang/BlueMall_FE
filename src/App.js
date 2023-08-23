
import './App.css';
import {Route, Routes} from "react-router-dom";
import FormRegister from "./components/FormRegister";
import FormLogin from "./components/FormLogin";
import PageShop from "./components/PageShop";
import CreateShop from "./components/CreateShop";
import PageHome from "./components/PageHome";
import Detail from "./components/Detail";
import ProductShop from "./components/ProductShop";
import Cart2 from "./components/Cart2";
import Bill2 from "./components/Bill2";
import FormEditUser from "./components/FormEditUser";

function App() {
  return (
    <>
      <Routes>
        <Route path="/register" element={<FormRegister/>}/>
        <Route path={"/login"} element={<FormLogin/>}/>
        <Route path={"/shop/:id"} element={<PageShop/>}/>
        <Route path={"/createShop/:id"} element={<CreateShop/>}/>
        <Route path={"/"} element={<PageHome/>}/>
        <Route path={"detail/:id"} element={<Detail/>}/>
        <Route path={"/shop-admin/:id"} element={<ProductShop/>}/>
        <Route path={"/cart"} element={<Cart2/>}/>
        <Route path={"/bills"} element={<Bill2/>}/>
        <Route path={"/edit_user"} element={<FormEditUser/>}/>
      </Routes>
    </>
  );
}

export default App;
