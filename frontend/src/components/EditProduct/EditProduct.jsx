import React, { Fragment, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  adminProductsState,
  clearError as clearAdminError,
  editProduct,
  resetSuccess,
  resetProduct as resetAdminProduct,
} from "../../slices/admin/adminProductsSlice";
import {
  fetchSingleProduct,
  productState,
  clearError,
  resetProduct,
} from "../../slices/product/productSlice";
import { setError } from "../../slices/utils/errorAlertSlice";
import {
  AccountTree,
  AttachMoney,
  Description,
  Spellcheck,
  Storage,
} from "@material-ui/icons";
import { Button } from "@material-ui/core";
import MetaData from "../miscellaneous/MetaData";
import Sidebar from "../Sidebar/Sidebar";
import Loader from "../Loader/Loader";
import { constants } from "../miscellaneous/constants";
/* Using same classes and css as CreateProduct.jsx so its css file will do the trick */

const EditProduct = ({ history, match }) => {
  const dispatch = useDispatch();

  const {
    product: adminProduct,
    error: adminError,
    success,
  } = useSelector(adminProductsState);

  const { status, product, error } = useSelector(productState);

  const prodDetails = useRef({
    id: "",
    name: "",
    description: "",
    category: "",
    stock: null,
    price: null,
    images: [],
  });

  const [imagesPreview, setImagesPreview] = useState([]);

  function editProductDataChange(e) {
    if (e.target.name === "images") {
      const files = Array.from(e.target.files);
      prodDetails.current.images = [];
      setImagesPreview([]);
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

  function editProductSubmitHandler(e) {
    e.preventDefault();

    dispatch(editProduct(prodDetails.current));
  }

  useEffect(() => {
    if (error) {
      dispatch(setError(error));
      dispatch(clearError());
    }
    if (adminError) {
      dispatch(setError(adminError));
      dispatch(clearAdminError());
    }
  }, [dispatch, error, adminError]);

  useEffect(() => {
    dispatch(fetchSingleProduct(match.params.id));

    return () => {
      dispatch(resetProduct());
    }; //This will be executed when we leave the page
  }, [dispatch, match.params.id]);

  useEffect(() => {
    if (success) {
      dispatch(setError("Product Updated"));
      dispatch(resetSuccess());
      history.push(`/product/${adminProduct._id}`);
    }
    return () => {
      dispatch(resetAdminProduct());
    };
  }, [success]);

  useEffect(() => {
    if (product._id) {
      setImagesPreview(product.images.map((img) => img.url));
      prodDetails.current.id = product._id;
      prodDetails.current.name = product.name;
      prodDetails.current.stock = product.stock;
      prodDetails.current.price = product.price;
      prodDetails.current.description = product.description;
      prodDetails.current.category = product.category;
    }
  }, [product]);

  return (
    <Fragment>
      {status === "idle" || status === "loading" ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="Admin | Edit Product" />
          <div className="dashboard">
            <Sidebar />
            <div className="newProductContainer">
              <form
                className="createProductForm"
                onSubmit={editProductSubmitHandler}
              >
                <h1>Edit Product</h1>
                <div>
                  <Spellcheck />
                  <input
                    type="text"
                    name="name"
                    placeholder="Product Name"
                    defaultValue={prodDetails.current.name}
                    onChange={editProductDataChange}
                  />
                </div>
                <div>
                  <AttachMoney />
                  <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    defaultValue={prodDetails.current.price}
                    onChange={editProductDataChange}
                  />
                </div>
                <div>
                  <Description />
                  <textarea
                    name="description"
                    placeholder="Product Description"
                    defaultValue={prodDetails.current.description}
                    onChange={editProductDataChange}
                  />
                </div>
                {prodDetails.current.category && (
                  <div>
                    <AccountTree />
                    <select
                      name="category"
                      defaultValue={prodDetails.current.category}
                      onChange={editProductDataChange}
                    >
                      <option value="">Choose Category</option>
                      {constants.categories.map((category, index) => (
                        <option value={category} key={index}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div>
                  <Storage />
                  <input
                    type="number"
                    name="stock"
                    placeholder="Stock"
                    defaultValue={prodDetails.current.stock}
                    onChange={editProductDataChange}
                  />
                </div>
                <div id="createProductFormFile">
                  <input
                    type="file"
                    name="images"
                    accept="image/*"
                    multiple
                    onChange={editProductDataChange}
                  />
                </div>
                <div id="createProductFormImage">
                  {imagesPreview.map((image, index) => (
                    <img key={index} src={image} alt={`#${index + 1}`} />
                  ))}
                </div>
                <Button id="createProductBtn" type="submit">
                  Update
                </Button>
              </form>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default EditProduct;
