import React, { Component } from "react";
import { Col } from "react-bootstrap";

export default function Seperator(props) {
    const {Label , Width} = props;

    return (
        <div className="Seperator">
            <Col md={12} style={{ color:"#2d3985" }}>
                {Label}
            </Col>
            <Col md={12} className="d-flex justify-content-center">
                <div style={{ width: Width+"px" , height:"3px" , backgroundColor:"#2d3985" , borderRadius:5 , marginTop:'2px'}}>
                </div>
            </Col>
        </div>
    );

  };
