import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";
import SliderCategory from "../Component/SliderCategory";
import {
  getSubCategory,
  getProducts,
  getDistrict,
  getVerticalCategory,
} from "../AppApi";
import { Helmet } from "react-helmet";
import { Paper, Fab } from "@material-ui/core";
import "../AppAsset/CSS/SubCategory.css";
import {
  ROUTE_VERTICLE_CATEGORIES,
  ENDPOINT_GET_CATEGORIES_BANNER,
  ROUTE_SUBCATEGORIES,
} from "../Constant";
import Product from "../Component/Product";
import Banners from "../Component/Banners";
import {
  loginPopUp,
  checkSkip,
  checkLogin,
  checkBadatExpiration,
} from "../Util";
import Footer from "../Component/Footer";

class SubCategory extends Component {
  constructor() {
    super();
    this.state = {
      load: true,
      data: [],
      sort: null,
      sortOrder: null,
      categoryId: window.location.href.slice(
        window.location.href.lastIndexOf("/") + 1
      ),
      verticleCategories: null,
      subCategories: null,
      state: null,
      district: null,
      price: null,
      productData: [],
      subCategoryList: [],
      verticalCategoryList: [],
      districtList: [],
      drawer: false,
    };
  }

  componentDidMount = async () => {
    const id = window.location.href.slice(
      window.location.href.lastIndexOf("/") + 1
    );
    const params = {
      category_id: id,
    };
    const res = await getSubCategory(id);
    const prod = await getProducts(params);
    console.log(prod)
    this.setState({
      load: false,
      data: res.data.data,
      subCategoryList: res.data.data,
      productData:
        prod.data && prod.data.data && prod.data.data.data
          ? prod.data.data.data
          : [],
    });
  };

  onClickHandle = (id) => {
    this.props.history.push(`/${ROUTE_VERTICLE_CATEGORIES}/${id}`);
  };

  onClickCategoryHandle = async (id) => {
    this.props.history.push(`/${ROUTE_SUBCATEGORIES}/${id}`);
    this.setState({ load: true, data: [] });
    const res = await getSubCategory(id);
    this.setState({
      load: false,
      data: res.data.data,
      subCategoryList: res.data.data,
      categoryId: id,
    });
    await this.onFilterSubmit();
  };

  onFilterChangeHandle = async (e) => {
    const name = e.target.name;
    this.setState({
      ...this.state,
      [name]: e.target.value,
    });

    if (e.target.name === "category") {
      const tempSubCategoryList = await getSubCategory(e.target.value);
      this.setState({ subCategoryList: tempSubCategoryList.data.data });
    }

    if (e.target.name === "subCategories") {
      const tempVerticalData = await getVerticalCategory(e.target.value);
      this.setState({ verticalCategoryList: tempVerticalData.data.data });
    }

    if (e.target.name === "state") {
      const tempDistrictData = await getDistrict(e.target.value);
      this.setState({ districtList: tempDistrictData });
    }
  };

  onFilterReset = async () => {
    this.setState({
      drawer: false,
      load: true,
      sort: null,
      price: null,
      sortOrder: null,
      verticleCategories: null,
      subCategories: null,
      state: null,
      district: null,
      verticalCategoryList: [],
      districtList: [],
    });
    const id = window.location.href.slice(
      window.location.href.lastIndexOf("/") + 1
    );
    const params = {
      category_id: id,
    };
    const res = await getProducts(params);
    this.setState({
      load: false,
      productData:
        res.data && res.data.data && res.data.data.data
          ? res.data.data.data
          : [],
    });
  };

  onFilterSubmit = async () => {
    this.setState({ drawer: false, load: true, productData: [] });
    const params = {
      category_id: this.state.categoryId,
      subcategory_id: this.state.subCategories,
      vertical_id: this.state.verticleCategories,
      sortBy: this.state.sort,
      sortOrder: this.state.sortOrder,
      state: this.state.state,
      district: this.state.district,
    };
    const res = await getProducts(params);
    this.setState({
      load: false,
      productData:
        res.data && res.data.data && res.data.data.data
          ? res.data.data.data
          : [],
    });
  };

  onDrawerClick = (p) => {
    this.setState({ drawer: p });
  };

  render() {
    if (
      (!checkLogin() && !checkSkip()) ||
      (!checkLogin() && !checkBadatExpiration())
    ) {
      loginPopUp(this.props.history);
    }
    return (
      <LoadingOverlay active={this.state.load} spinner text="Loading...">
        <Helmet>
          <title>
            {this.state.productData && this.state.productData.length > 0
              ? this.state.productData[0].category.name
              : "Badhat"}
          </title>
          <meta name="keywords" content="badhat,badat,Badhat.app" />
          <meta
            name="description"
            content="Badhat is a personal app/website for B2B businesses.Retailers easily connect, browse, & ORDER products from wholesalers/Suppliers.Badhat provides seamless connectivity between Suppliers (Manufacturers, Stockists, Dealers, Distributors,Agent, Brands, suppliers) and Buyers (Retailers,kirnana shops, Re-sellers, online sellers etc.)."
          />
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" integrity="sha384-KyZXEAg3QhqLMpG8r+8fhAXLRk2vvoC2f3B09zVXn8CA5QIVfZOJ3BCsw2P0p/We" crossorigin="anonymous"/>
          <link
            rel="apple-touch-icon"
            href={
              this.state.productData && this.state.productData.length > 0
                ? this.state.productData[0].category.bg_image
                : "https://drive.google.com/file/d/1hZFX14ynp6EuS-Sdtkt0fqbA6FsHl7NU/view"
            }
          />
        </Helmet>
        <Fab
          variant="extended"
          size="small"
          // color="red"
          aria-label="add"
          style={{
            zIndex: "5",
            margin: 0,
            top: 300,
            right: -8,
            left: "auto",
            position: "fixed",
            height: 25,
            fontSize: "small",
            textAlign: "left",
            paddingLeft: 4,
            backgroundColor: "rgb(255, 171, 36)",
            textTransform: "capitalize",
          }}
          onClick={() =>
            window.open(
              "https://play.google.com/store/apps/details?id=com.badhat.app"
            )
          }
        >
          Open App
        </Fab>
        <div className="SubCategoryContainer">
          <div className="categoryCardContainer_subCategory">
            <SliderCategory
              onClickCategoryHandle={this.onClickCategoryHandle}
            />
          </div>
          <div>
            {this.state.productData &&
            this.state.productData.length > 0 &&
            this.state.productData[0].category &&
            this.state.productData[0].category.name ? (
              <span>{`${this.state.productData[0].category.name}`}</span>
            ) : null}
          </div>
          {this.state.data && this.state.data.length > 0 ? (
            <div className="selectedSubCategory">
              <div
                className={
                  this.state.data && this.state.data.length > 5
                    ? "subCategoryGridContainer"
                    : "subCategoryGridContainer_Less_item"
                }
              >
                {this.state.data && this.state.data.length > 0
                  ? this.state.data.map((res) => (
                      <div
                        className="subCategorySliderCard"
                        key={res.id}
                        onClick={() => this.onClickHandle(res.id)}
                      >
                        <Paper className="subCategoryPaper" style={{backgroundColor:"#fee3ce"}} elevation={5}>
                          <div className="sliderCardSubCategoryName">
                            {res.name}
                          </div>
                        </Paper>
                      </div>
                    ))
                  : "no data found"}
              </div>
            </div>
          ) : null}
          <Banners
            endPoint={ENDPOINT_GET_CATEGORIES_BANNER}
            id={this.state.categoryId}
          />
          {this.state.load?"":
          <Product
            showCategoryFilter={false}
            showVerticleCategoriesFilter={true}
            showSubCategoryFilter={true}
            sortValue={this.state.sort}
            categoryValue={this.state.categoryId}
            verticleCategoriesValue={this.state.verticleCategories}
            subCategoriesValue={this.state.subCategories}
            priceValue={this.state.price}
            onFilterChangeHandle={this.onFilterChangeHandle}
            onFilterReset={this.onFilterReset}
            onFilterSubmit={this.onFilterSubmit}
            verticalCategoriesId={ this.state.subCategories ? this.state.subCategories : null}
            productData={this.state.productData}
            subCategoryList={this.state.subCategoryList}
            verticalCategoryList={this.state.verticalCategoryList}
            districtList={this.state.districtList}
            stateValue={this.state.state}
            districtValue={this.state.districtValue}
            sortOrderValue={this.state.sortOrder}
            drawer={this.state.drawer}
            onDrawerClick={this.onDrawerClick}
          />}
        </div>
        <Footer />
      </LoadingOverlay>
    );
  }
}

export default withRouter(SubCategory);
