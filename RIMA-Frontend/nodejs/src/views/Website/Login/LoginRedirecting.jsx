import React, {useEffect} from "react";
import {toast} from "react-toastify";
import {handleServerErrors} from "utils/errorHandler";
import RestAPI from "../../../services/api";
import {getItem} from "utils/localStorage";
import {Card, Container, Row} from "react-bootstrap";


export default function LoginRedirecting() {

  useEffect(() => {
    const interval = setInterval(() => {
      dataImport();
    }, 2000)
    return () => clearInterval(interval)
  }, [])


  const dataImport = () => {
    RestAPI.dataImportStatus()
      .then((res) => {
        const {data: {data_being_loaded}} = res;
        if (!data_being_loaded) {
          window.location.href = "/app/cloud-chart/" + getItem("mId");
        }
      })
      .catch((error) => {
        console.log("error", error);
        handleServerErrors(error, toast.error);
      });
  };

  const customStyles = {
    card: {
      margin: "0 auto",
      width: "400px",
      marginTop: "100px"
    },
    loaderText: {
      marginTop: "-50px",
      fontWeight: "500",
      color: "#172b4d",
    }
  }

  return (
    <>
      <Container>
        <Row>
          <Card className="bg-secondary shadow border-0" style={customStyles.card}>
            <Card.Body className="px-lg-5 py-lg-5">
              <div className="text-center text-muted mb-2">
                <img src={require("../../../assets/img/theme/loader.gif")} style={{maxWidth: "100%"}} alt="loader"/>
                <h3 style={customStyles.loaderText}>
                  We are Fetching your data ...This could take a while!
                </h3>
              </div>
            </Card.Body>
          </Card>
        </Row>
      </Container>
    </>
  );
}
