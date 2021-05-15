import React, { Component } from "react";
import { Container, Table } from "reactstrap";


import TwitterUserCard from "./TwitterUserCard.js";

export default class TwitterUsers extends Component {
  render() {

    const { users } = this.props;


    return (
      <Container>
        <Table hover>
          <thead>
            <tr>
              <th style={{ fontSize: "1em", fontWeight: "bold" }}>USER</th>
              <th
                style={{
                  fontSize: "1em",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                TWEETS
              </th>
              <th
                style={{
                  fontSize: "1em",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                FOLLOWERS
              </th>
            </tr>
          </thead>
          <tbody>
            { users.map(user => (<TwitterUserCard user={user} key={Math.random()*9999999} />))}
          </tbody>
        </Table>
      </Container>
    );
  }
}
