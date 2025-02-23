import React, { Component } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Drawer,
  Button,
} from "@material-ui/core";
// import { getCategory, getSubCategory, getVerticalCategory } from "../AppApi";
import FilterListIcon from "@material-ui/icons/FilterList";
import NoDataFound from "../Component/NoDataFound";
import "../AppAsset/CSS/Product.css";
import { getCategory, getState } from "../AppApi";
import ProductCard from "./ProductCard";
import ReactPaginate from 'react-paginate';
import axios from 'axios'

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage: 15,
      load: true,
      categorydata: [],
      subCategoryData: [],
      verticalData: [],
      data: [],
      drawer: false,
      stateData: [],
      offset: 0,
      data: [],
      perPage: 20,
      currentPage: 0
    };
    this.handlePageClick = this
            .handlePageClick
            .bind(this);
  }

  componentDidMount = async () => {
    const categoryTempData = await getCategory();
    const tempState = await getState();

    this.receivedData()

    this.setState({
      categorydata:
        categoryTempData &&
        categoryTempData.data &&
        categoryTempData.data.data &&
        categoryTempData.data.data &&
        categoryTempData.data.data.length > 0
          ? categoryTempData.data.data
          : [],
      stateData: (tempState && tempState) || [],
    });
  };

    receivedData() {
                const data = this.props.productData;
                const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                const postData = slice.map(pd => <ProductCard data={pd}/>)
                this.setState({
                    pageCount: Math.ceil(data.length / this.state.perPage),                   
                    postData
          })
    }

    handlePageClick = (e) => {
        const selectedPage = e.selected;
        const offset = selectedPage * this.state.perPage;

        this.setState({
            currentPage: selectedPage,
            offset: offset
        }, () => {
            this.receivedData()
        });

    };

  handlePageChange(pageNumber) {
    console.log(`active page is ${pageNumber}`);
    this.setState({activePage: pageNumber});
  }

  onDrawerClick = (p) => {
    this.setState({ drawer: p });
  };

  render() {
    return (
      <div className="productContainer">
        <div className="productContainerHeading">Products</div>
        {this.props && !this.props.showFilter ? (
          <div style={{ marginBottom: "5px", marginTop: "5px" }}>
            <Button
              onClick={() => this.props.onDrawerClick(true)}
              style={{ float: "right", color: "orange", fontWeight: "700" }}
            >
              <FilterListIcon />
              Sort & Filters
            </Button>
          </div>
        ) : null}
        <div>
          <Drawer
            anchor="bottom"
            open={this.props.drawer}
            onClose={() => this.props.onDrawerClick(false)}
          >
            <div className="productFliters">
              {this.props.showCategoryFilter ? (
                <div className="filters">
                  <FormControl fullWidth>
                    <InputLabel>Categories</InputLabel>
                    <Select
                      name="category"
                      value={this.props.categoryValue}
                      onChange={(e) => this.props.onFilterChangeHandle(e)}
                    >
                      {this.state.categorydata &&
                      this.state.categorydata.length > 0
                        ? this.state.categorydata.map((res) => {
                            return (
                              <MenuItem key={res.id} value={res.id}>
                                {res.name}
                              </MenuItem>
                            );
                          })
                        : null}
                    </Select>
                  </FormControl>
                </div>
              ) : null}
              {this.props.showSubCategoryFilter && this.props.categoryValue ? (
                <div className="filters">
                  <FormControl fullWidth>
                    <InputLabel>Sub Categories</InputLabel>
                    <Select
                      name="subCategories"
                      value={this.props.subCategoriesValue}
                      onChange={(e) => this.props.onFilterChangeHandle(e)}
                    >
                      {this.props.subCategoryList &&
                      this.props.subCategoryList.length > 0
                        ? this.props.subCategoryList.map((res) => {
                            return (
                              <MenuItem key={res.id} value={res.id}>
                                {res.name}
                              </MenuItem>
                            );
                          })
                        : null}
                    </Select>
                  </FormControl>
                </div>
              ) : null}
              {this.props.showVerticleCategoriesFilter &&
              this.props.subCategoriesValue ? (
                <div className="filters">
                  <FormControl fullWidth>
                    <InputLabel>Vertical Categories</InputLabel>
                    <Select
                      name="verticleCategories"
                      value={this.props.verticleCategoriesValue}
                      onChange={(e) => this.props.onFilterChangeHandle(e)}
                    >
                      {this.props.verticalCategoryList &&
                      this.props.verticalCategoryList.length > 0
                        ? this.props.verticalCategoryList.map((res) => {
                            return (
                              <MenuItem key={res.id} value={res.id}>
                                {res.name}
                              </MenuItem>
                            );
                          })
                        : null}
                    </Select>
                  </FormControl>
                </div>
              ) : null}
              <div className="filters">
                <FormControl fullWidth>
                  <InputLabel>Sort</InputLabel>
                  <Select
                    name="sort"
                    value={this.props.sortValue}
                    onChange={(e) => this.props.onFilterChangeHandle(e)}
                  >
                    <MenuItem value="created_at">Latest Item</MenuItem>
                    <MenuItem value="price">By Price</MenuItem>
                    <MenuItem value="popularity">By Popularity</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="filters">
                <FormControl fullWidth>
                  <InputLabel>Sort Order</InputLabel>
                  <Select
                    name="sortOrder"
                    value={this.props.sortOrderValue}
                    onChange={(e) => this.props.onFilterChangeHandle(e)}
                  >
                    <MenuItem value="ASC">Ascending</MenuItem>
                    <MenuItem value="DESC">Descending</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="filters">
                <FormControl fullWidth>
                  <InputLabel>State</InputLabel>
                  <Select
                    name="state"
                    value={this.props.stateValue}
                    onChange={(e) => this.props.onFilterChangeHandle(e)}
                  >
                    {this.state.stateData && this.state.stateData.length > 0
                      ? this.state.stateData.map((res) => {
                          return (
                            <MenuItem key={res} value={res}>
                              {res}
                            </MenuItem>
                          );
                        })
                      : null}
                  </Select>
                </FormControl>
              </div>
              {this.props.stateValue ? (
                <div className="filters">
                  <FormControl fullWidth>
                    <InputLabel>District</InputLabel>
                    <Select
                      name="district"
                      value={this.props.districtValue}
                      onChange={(e) => this.props.onFilterChangeHandle(e)}
                    >
                      {this.props.districtList &&
                      this.props.districtList.length > 0
                        ? this.props.districtList.map((res) => {
                            return (
                              <MenuItem key={res} value={res}>
                                {res}
                              </MenuItem>
                            );
                          })
                        : null}
                    </Select>
                  </FormControl>
                </div>
              ) : null}
              <div className="filterButtonContainer">
                <div className="filterButton">
                  <Button
                    fullWidth
                    variant="outlined"
                    color="primary"
                    onClick={this.props.onFilterReset}
                  >
                    Reset Filters
                  </Button>
                </div>
                <div className="filterButton">
                  <Button
                    fullWidth
                    variant="outlined"
                    color="primary"
                    onClick={this.props.onFilterSubmit}
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </div>
          </Drawer>
        </div>
        

        {this.props.productData && this.props.productData.length > 0 ? (
          <div className="productListing">            

            {this.props &&
            this.props.productData &&
            this.props.productData.length > 0
              ?this.state.postData 

              : "no data found"}

            <ReactPaginate
              previousLabel={"prev"}
              nextLabel={"next"}
              breakLabel={"..."}
              breakClassName={"break-me"}
              pageCount={this.state.pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={this.handlePageClick}
              containerClassName={"pagination"}
              subContainerClassName={"pages pagination"}
              activeClassName={"active"}
            />

          </div>
        ) : (
          <NoDataFound content="No Product Found" />
        )}
      </div>
    );
  }
}

export default Product;
