import { Button } from "@material-ui/core";
import {
  AccountTree,
  AttachMoney,
  Description,
  Spellcheck,
  Storage,
} from "@material-ui/icons";
import React, { Fragment, useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  adminProductsState,
  createProduct,
  clearError,
  resetSuccess,
  resetProduct,
} from "../../slices/admin/adminProductsSlice";
import { setError } from "../../slices/utils/errorAlertSlice";
import { constants } from "../miscellaneous/constants";
import MetaData from "../miscellaneous/MetaData";
import Sidebar from "../Sidebar/Sidebar";
import "./CreateProduct.css";

const CreateProduct = ({ history }) => {
  const dispatch = useDispatch();

  const { error, success, product } = useSelector(adminProductsState);

  const prodDetails = useRef({
    name: "",
    description: "",
    category: "",
    stock: null,
    price: null,
    images: [],
  });

  const [imagesPreview, setImagesPreview] = useState([]);

  function createProductDataChange(e) {
    if (e.target.name === "images") {
      //Converting e.target.files which is an obj with array like structure into an actual array.
      const files = Array.from(e.target.files);
      //Emptying image variables to put in new array of images.
      //This is necessary as e.target.files contains all the images choosen by user
      //And not jst new additions.
      prodDetails.current.images = [];
      setImagesPreview([]);
      //Reading each image of files one by one and adding them to image variables.
      //Creating a new reader for each file too as a single reader cant read multiple files together.
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.readyState === 2) {
            prodDetails.current.images.push(reader.result);
            setImagesPreview((prev) => [...prev, reader.result]);
          }
        };
        reader.readAsDataURL(file);
      });
    } else {
      prodDetails.current[e.target.name] = e.target.value;
    }
  }

  function createProductSubmitHandler(e) {
    e.preventDefault();
    dispatch(createProduct(prodDetails.current));
  }

  useEffect(() => {
    if (error) {
      dispatch(setError(error));
      dispatch(clearError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (success) {
      dispatch(setError("Product Created!"));
      dispatch(resetSuccess());
      history.push(`/product/${product._id}`);
      // dispatch(resetProduct());
    }
  }, [dispatch, success]);

  return (
    <Fragment>
      <MetaData title="Admin | Create Product" />
      <div className="dashboard">
        <Sidebar />
        <div className="newProductContainer">
          <form
            className="createProductForm"
            onSubmit={createProductSubmitHandler}
          >
            <h1>Create Product</h1>
            <div>
              <Spellcheck />
              <input
                type="text"
                name="name"
                placeholder="Product Name"
                required
                onChange={createProductDataChange}
              />
            </div>
            <div>
              <AttachMoney />
              <input
                type="number"
                name="price"
                placeholder="Price"
                required
                onChange={createProductDataChange}
              />
            </div>
            <div>
              <Description />
              <textarea
                name="description"
                placeholder="Product Description"
                required
                onChange={createProductDataChange}
              />
            </div>
            <div>
              <AccountTree />
              <select
                name="category"
                required
                onChange={createProductDataChange}
              >
                <option value="">Choose Category</option>
                {constants.categories.map((category, index) => (
                  <option value={category} key={index}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Storage />
              <input
                type="number"
                name="stock"
                placeholder="Stock"
                required
                onChange={createProductDataChange}
              />
            </div>
            <div id="createProductFormFile">
              <input
                type="file"
                name="images"
                accept="image/*"
                multiple
                required
                onChange={createProductDataChange}
              />
            </div>
            <div id="createProductFormImage">
              {imagesPreview.map((image, index) => (
                <img key={index} src={image} alt={`Image ${index + 1}`} />
              ))}
            </div>
            <Button id="createProductBtn" type="submit">
              Create
            </Button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default CreateProduct;
