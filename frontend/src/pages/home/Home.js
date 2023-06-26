import React from "react";
import HomeComponent from "../../component/homeComponent/HomeComponent";
import Layout from "../../layouts/Layout";

const Home = () => {
  return (
    <React.Fragment>
      <Layout title="Anuj Singh Nainwal" type="home">
        <HomeComponent />
      </Layout>
    </React.Fragment>
  );
};

export default Home;
