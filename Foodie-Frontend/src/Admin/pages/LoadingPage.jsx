import React from "react";
import Spinner from "react-spinkit";

const LoadingPage = () => {
  return (
    <div style={styles.wrapper}>
      {/* Inline Style for Rainbow Spinner */}
      <style>
        {`
          .rainbow-spinner > div:nth-child(1) {
            background-color: #ff4d4f;
          }
          .rainbow-spinner > div:nth-child(2) {
            background-color: #ff7a45;
          }
          .rainbow-spinner > div:nth-child(3) {
            background-color: #ffa940;
          }
          .rainbow-spinner > div:nth-child(4) {
            background-color: #73d13d;
          }
          .rainbow-spinner > div:nth-child(5) {
            background-color: #40a9ff;
          }
        `}
      </style>

      <Spinner
        name="line-scale-pulse-out-rapid"
        fadeIn="none"
        className="rainbow-spinner"
      />
      <h2 style={styles.text}>Loading, please wait...</h2>
    </div>
  );
};

const styles = {
  wrapper: {
    height: "100vh",
    background: "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#fff",
    marginTop: "20px",
    fontSize: "1.5rem",
    fontFamily: "Arial, sans-serif",
  },
};

export default LoadingPage;
