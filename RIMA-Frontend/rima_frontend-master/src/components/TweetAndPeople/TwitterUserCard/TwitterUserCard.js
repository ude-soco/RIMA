import React, { Component } from 'react'

export default class TwitterUserCard extends Component {
    render() {
        const { user } = this.props;
        const url = user["url"];
        const name = user["name"];
        const screenName = user["screen_name"];
        const description = user["description"];
        const follorwersCount = user["followers_count"];
        const friendsCount = user["friends_count"];
        const statusCount = user["statuses_count"];
        const profilePictureUrl = user["profile_image_url_https"];
        const profileBackground= user["profile_background_color"];


        return (
            <tr>
              <th scope="row" style={{ width: "60%" }}>
                <a href={ "https://twitter.com/"+screenName } target="_blank" rel="noopener noreferrer">
                  <div
                    className="d-flex align-content-center"
                    style={{ flexDirection: "row" }}
                  >
                    <img
                      src={ profilePictureUrl }
                      style={{
                        borderRadius: "50%",
                      }}
                    />
                    <div
                      className="d-flex justify-content-center align-content-center"
                      style={{
                        flexDirection: "column",
                        marginTop: "15px",
                        marginLeft: "10px",
                      }}
                    >
                      <h3
                        style={{
                          display: "inline-block",
                          lineHeight: "0",
                          fontSize: "1em",
                        }}
                      >
                        { name }
                      </h3>
                    <span style={{ fontSize: "1em" }}>@{ screenName }</span>
                    </div>
                  </div>
                </a>
              </th>
              <td
                style={{
                  textAlign: "center",
                  paddingTop: "32px",
                  fontSize: "1em",
                }}
              >
                { statusCount }
              </td>
              <td
                style={{
                  textAlign: "center",
                  paddingTop: "32px",
                  fontSize: "1em",
                }}
              >
                { follorwersCount }
              </td>
            </tr>
        )
    }
}
