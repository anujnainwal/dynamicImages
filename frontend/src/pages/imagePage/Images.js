import React from "react";
import Layout from "../../layouts/Layout";
import ImageComponent from "../../component/imagesComponent/ImageComponent";

const Images = () => {
  return (
    <React.Fragment>
      <Layout title="Create New Image">
        <ImageComponent />
      </Layout>
    </React.Fragment>
  );
};

export default Images;
