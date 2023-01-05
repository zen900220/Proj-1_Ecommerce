import React, { Fragment } from "react";
import "./Sidebar.css";
import Logo from "../../images/logo.png";
import { Link } from "react-router-dom";
import { TreeView, TreeItem } from "@material-ui/lab";
import {
  ExpandMore,
  PostAdd,
  Add,
  ImportExport,
  ListAlt,
  Dashboard,
  People,
  RateReview,
} from "@material-ui/icons";

const Sidebar = () => {
  return (
    <Fragment>
      <div className="sidebar">
        <Link to="/">
          <img src={Logo} alt="Ecommerce" />
        </Link>
        <Link to="/admin/dashboard">
          <p>
            <Dashboard /> Dashboard
          </p>
        </Link>
        {/* TreeView doesnt need Link but for css we need to maintain uniformity.
        Since the "to" prop of Link is required so we using a tag instead as Links are basically a tags. */}
        <div className="treeWrapper">
          <TreeView
            defaultCollapseIcon={<ExpandMore />}
            defaultExpandIcon={<ImportExport />}
          >
            <TreeItem nodeId="1" label="Products">
              <Link to="/admin/products">
                <TreeItem nodeId="2" label="All" icon={<PostAdd />} />
              </Link>
              <Link to="/admin/product">
                <TreeItem nodeId="3" label="Create" icon={<Add />} />
              </Link>
            </TreeItem>
          </TreeView>
        </div>
        <Link to="/admin/orders">
          <p>
            <ListAlt /> Orders
          </p>
        </Link>
        <Link to="/admin/users">
          <p>
            <People /> Users
          </p>
        </Link>
        <Link to="/admin/reviews">
          <p>
            <RateReview /> Reviews
          </p>
        </Link>
      </div>
    </Fragment>
  );
};

export default Sidebar;
