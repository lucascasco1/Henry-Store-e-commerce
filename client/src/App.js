import React, { useState, useEffect, Fragment } from "react";
import "./App.css";
/* import Catalogo from './Components/Catalogo/catalogo'; */
import AdminPanel from "./Components/AdminPanel/AdminPanel";
import CategoryForm from "./Components/CategoryForm/categoryForm";
import ProductForm from "./Components/Product/productForm";
import { BrowserRouter, Route, Redirect } from "react-router-dom";
import Landing from "./Components/Landing/landing";
import SearchBar from "./Components/Product/SearchBar/SearchBar";
import SearchResults from "./Components/SearchResults/SearchResults";
import OrdersTable from "./Components/Order/OrdersTable";
import Cart from "../src/Components/Cart/cart";
import LoginForm from "../src/Components/User/loginForm";
import ProductCard from "./Components/ProductCard/productCard";
import ProductUpdate from "./Components/Product/productUpdate";
import CategoryUpdate from "./Components/CategoryForm/categoryUpdate";
import SignUp from "../src/Components/User/signUp";
import UserList from "../src/Components/User/UserList";
import { PrivateRoute } from "./Components/PrivateRoute/PrivateRoute";
import { useDispatch, useSelector } from "react-redux";
import ProductList from "./Components/ProductList/productList";
import CategoryList from "./Components/CategoryList/categoryList";
import GuestCart from "./Components/Cart/guestcart";
import UserPanel from "./Components/UserPanel/userPanel";
import LoadingScreen from "./Components/loadingScreen";
import { loadingFalse, loadingTrue } from "./Redux/actions/loadingActions";
import Checkout from "./Components/Checkout/Checkout";
import FooterComp from "./Components/Footer/footer";
import ListCheckouts from "./Components/Checkout/ListCheckouts";s

function App() {
  const [products, setProducts] = useState([]);
  const dispatch = useDispatch();
  const handleSearch = function (value) {
    dispatch(loadingTrue());
    //esta funcion deberia ser pasada como props, en el componente que genere todos los productos resultantes
    fetch(`http://localhost:3100/products/search/${value}`)
      .then((r) => r.json())
      .then((data) => {
        // data = array que devuelve la db con los productos que hacen match
        setProducts(data);
        setTimeout(() => dispatch(loadingFalse()), 300);
      })
      .catch((err) => console.log(err));
  };

  const userLogged = useSelector((state) => state.authUser);
  const { isLoading } = useSelector((state) => state.isLoading);

  return (
    // Loading Screen statement
    !isLoading ? (
      <BrowserRouter>
        <Route
          path="/"
          render={() => <SearchBar handleSearch={handleSearch} />}
        />
        {products.length > 0 && (
          <Redirect
            to={{
              pathname: "/product/search/",
              state: { products: products },
            }}
          />
        )}
        <Route exact path="/" render={() => <Landing />} />
        <Route
          path="/product/search"
          render={() => <SearchResults products={products} />}
        />
        <Route exact path="/user/cart" render={() => <Cart />} />
        <Route exact path="/login" render={() => <LoginForm />} />
        <Route path="/product/detailed/:id" render={() => <ProductCard />} />
        <Route exact path="/sign-up" render={() => <SignUp />} />
        <Route exact path="/guest/cart" render={() => <GuestCart />} />
        <Route
          exact
          path="/checkout/:idUser/:idOrder"
          render={() => <Checkout />}
        />
        <Route exact path="/user/profile">
          <UserPanel />
        </Route>
        <Route exact path="/checkout" render={() => <Checkout />} />
          
      {/* RUTAS PRIVADAS */}
      <PrivateRoute
        exact
        path="/product/admin/crud"
        userData={userLogged}
        component={ProductForm}
      />
      <PrivateRoute
        exact
        path="/product/admin"
        userData={userLogged}
        component={AdminPanel}
      />
      <PrivateRoute
        exact
        path="/product/admin/create-category"
        userData={userLogged}
        component={CategoryForm}
      />
      <PrivateRoute
        exact
        path="/product/admin/show-table"
        userData={userLogged}
        component={OrdersTable}
      />
      <PrivateRoute
        exact
        path="/product/admin/update"
        userData={userLogged}
        component={ProductUpdate}
      />
      <PrivateRoute
        exact
        path="/product/admin/list-users"
        userData={userLogged}
        component={UserList}
      />
      <PrivateRoute
        exact
        path="/product/admin/categories/update"
        userData={userLogged}
        component={CategoryUpdate}
      />
      <PrivateRoute
        exact
        path="/product/admin/product-table"
        userData={userLogged}
        component={ProductList}
      />
      <PrivateRoute
        exact
        path="/product/admin/category-table"
        userData={userLogged}
        component={CategoryList}
      />
            <PrivateRoute
        exact
        path="/product/admin/checkouts-table"
        userData={userLogged}
        component={ListCheckouts}
      />
      <Route exact path="/" render={() => <FooterComp />} />
    </BrowserRouter>: <LoadingScreen/>  
  );
}

export default App;
