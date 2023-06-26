import React from "react";
import Layout from "../../layouts/Layout";
import { Container } from "react-bootstrap";
import CountdownContainer from "../../component/countdownContainer/CountdownContainer";

const CountDown = () => {
  return (
    <Layout title="Start from one of your existing styles">
      <Container>
        <CountdownContainer />
      </Container>
    </Layout>
  );
};

export default CountDown;
