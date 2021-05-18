import React, {Component} from "react";
import "./tweets.css";
import {
  convertUnicode,
  keywordHighlighter,
  UrlHighlighter,
} from "../../../../../Services/utils/unicodeCharacterEngine.js";
import {MdErrorOutline} from "react-icons/md";
import {
  UncontrolledDropdown,
  DropdownToggle,
  Row,
  Col,
  Button,
} from "reactstrap";
import OptionDropDown from "../../../../components/OptionDropDown";
import styled from "styled-components";
import TweetInfoOption from "Views/components/OptionDropDown/TweetInfoOption";
import ReactSpinnerTimer from "react-spinner-timer";

const HideContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0px;
  z-index: 1;
  background: white;
  padding: 20px;
  display: ${(props) => (props.hide ? "block" : "none")};
`;


class TweetContent extends Component {
  render() {
    return (
      <>
        <h4>{this.props.name}</h4>
        <span dangerouslySetInnerHTML={{__html: this.props.modified_text}}/>
      </>
    );
  }
}

export default class SavedTweetCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timer: null,
      hide: false,
      countDown: 10,
    };
  }

  countDownFun = () => {
    this.myInterval = setInterval(() => {
      this.setState((prevState) => ({
        countDown: prevState.countDown - 1,
      }));
    }, 1000);
  };

  HideHandler = () => {
    this.setState({
      hide: true,
      timer: setTimeout(() => {
        console.log("This will run after 5 second!");
        this.props.deleteSavedTweet(this.props.tweet);
        this.setState({hide: false});
      }, 10000),
    });
    this.countDownFun();
  };

  render() {
    console.log(this.props);
    const {countDown} = this.state;
    const {tweet} = this.props;
    // const user = tweet["user"];
    // Tweet
    const id_str = tweet["id_str"];
    const text = tweet["full_text"];
    const screen_name = tweet["screen_name"];

    // console.log("TEXT: ", text);
    // const screenName = convertUnicode(user["screen_name"]);
    // const tweet_url = `https://twitter.com/${screenName}/status/${id_str}`;

    // Tags
    // Modift Tweet Text
    // let modifiedScreenName = convertUnicode(screen_name);
    let modified_text = convertUnicode(text);

    return (
      <>
        <div
          className="card mt-4"
          style={{width: "100%", position: "relative"}}
        >
          <HideContainer hide={this.state.hide}>
            {/* <div style={{ textAlign: 'right' }}> */}
            {/* <h2>Tweet Hidden</h2> */}
            <Button
              className="rounded-0"
              style={{fontSize: "20px"}}
              color="primary"
              size="sm"
              onClick={() => {
                clearTimeout(this.state.timer);
                this.setState({
                  hide: false,
                });
              }}
            >
              Undo
            </Button>
            {/* </div> */}
            <div className="d-flex justify-content-between">
              <div>
                <h3>you won't see this tweet in your saved tweets list</h3>

                <h4>this tweet will delete after {countDown} seconds</h4>
              </div>
              {/* position: absolute;
    right: 21px;
    bottom: 0; */}
              <ReactSpinnerTimer
                className="snipper-saved-tweets"
                timeInSeconds={10}
                totalLaps={10}
                isRefresh={false}
                onLapInteraction={(lap) => {
                  if (lap.isFinish) console.log("Finished!!");
                  else console.log("Running!! Lap:", lap.actualLap);
                }}
              />
            </div>

          </HideContainer>
          {/* <div className="vline"></div>*/}
          <div className="options-icon">
            <UncontrolledDropdown>
              <DropdownToggle
                // tag="a"
                className="text-primary"
                style={{
                  fontSize: "20px",
                  background: "none",
                  border: "none",
                  boxShadow: "none",
                }}
              >
                <svg
                  width="20"
                  height="4"
                  viewBox="0 0 20 4"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="2" cy="2" r="2" fill="#1D1D1D"/>
                  <circle cx="10" cy="2" r="2" fill="#1D1D1D"/>
                  <circle cx="18" cy="2" r="2" fill="#1D1D1D"/>
                </svg>
              </DropdownToggle>

              <OptionDropDown HideHandler={this.HideHandler} saved/>
            </UncontrolledDropdown>
          </div>
          <div className="card-body">
            <h5 className="card-title">
            </h5>
            <p className="card-text saved-tweet-container">
              <a
                href={`https://twitter.com/${tweet['screen_name']}/status/${tweet['id_str']}`}
                target="_blank"
                style={{textDecoration: "none", color: "inherit"}}
                rel="noopener noreferrer"
              >
                <TweetContent modified_text={modified_text} name={screen_name}/>
              </a>
              {/* <span className="highlight-keyword">highlight</span> the
              recommended keyword and color the link
              <span className="color-link">https://google.com</span> . */}
              {tweet["media"]
                ? tweet["media"].map((media) => (
                  <a
                    href={media["media_url_https"]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="image-attachment"
                  >
                    <svg
                      width="88"
                      height="25"
                      viewBox="0 0 88 25"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      xlinkHref="http://www.w3.org/1999/xlink"
                    >
                      <path
                        d="M0 13C0 6.37258 5.37258 1 12 1H76C82.6274 1 88 6.37258 88 13V13C88 19.6274 82.6274 25 76 25H12C5.37258 25 0 19.6274 0 13V13Z"
                        fill="white"
                      />
                      <path
                        d="M12 1.25H76C82.4893 1.25 87.75 6.51065 87.75 13C87.75 19.4893 82.4893 24.75 76 24.75H12C5.51065 24.75 0.25 19.4893 0.25 13C0.25 6.51065 5.51065 1.25 12 1.25Z"
                        stroke="black"
                        strokeOpacity="0.5"
                        strokeWidth="0.5"
                      />
                      <path
                        d="M29.4443 5.91406H36.749V7.25049H33.8521V16.6719H36.749V18H29.4443V16.6719H32.2749V7.25049H29.4443V5.91406ZM40.3599 9.01855L40.4014 9.86523C40.584 9.5498 40.8219 9.30355 41.1152 9.12646C41.4141 8.94938 41.7738 8.85807 42.1943 8.85254C43.0189 8.85254 43.5695 9.1735 43.8462 9.81543C44.0233 9.52767 44.2557 9.29801 44.5435 9.12646C44.8368 8.94938 45.1909 8.85807 45.606 8.85254C46.2645 8.85254 46.7708 9.05452 47.125 9.4585C47.4792 9.86247 47.6562 10.474 47.6562 11.293V18H46.1953V11.2764C46.1953 10.5238 45.8494 10.1502 45.1577 10.1558C44.9751 10.1558 44.8174 10.1807 44.6846 10.2305C44.5518 10.2803 44.4411 10.3494 44.3525 10.438C44.264 10.521 44.1948 10.6206 44.145 10.7368C44.0952 10.8475 44.062 10.9637 44.0454 11.0854V18H42.5845V11.2681C42.5845 10.9084 42.5042 10.6317 42.3438 10.438C42.1833 10.2443 41.9287 10.1502 41.5801 10.1558C41.2591 10.1558 41.0101 10.2194 40.833 10.3467C40.6559 10.474 40.5259 10.6427 40.4429 10.853V18H38.9819V9.01855H40.3599ZM55.7661 18C55.7052 17.8838 55.6554 17.7399 55.6167 17.5684C55.5835 17.3913 55.5586 17.2087 55.542 17.0205C55.387 17.1755 55.2127 17.3221 55.019 17.4604C54.8309 17.5988 54.6206 17.7205 54.3882 17.8257C54.1613 17.9308 53.9178 18.0138 53.6577 18.0747C53.3976 18.1356 53.1209 18.166 52.8276 18.166C52.3517 18.166 51.9201 18.0968 51.5327 17.9585C51.1509 17.8201 50.8244 17.6348 50.5532 17.4023C50.2876 17.1644 50.0801 16.8849 49.9307 16.564C49.7868 16.2375 49.7148 15.8861 49.7148 15.5098C49.7148 15.0173 49.8117 14.5856 50.0054 14.2148C50.2046 13.8441 50.484 13.5369 50.8438 13.2935C51.2035 13.0444 51.6351 12.859 52.1387 12.7373C52.6478 12.6156 53.215 12.5547 53.8403 12.5547H55.5171V11.8491C55.5171 11.578 55.4673 11.3345 55.3677 11.1187C55.2681 10.9028 55.127 10.7202 54.9443 10.5708C54.7617 10.4159 54.5376 10.2969 54.272 10.2139C54.0119 10.1309 53.7186 10.0894 53.3921 10.0894C53.0877 10.0894 52.8138 10.1281 52.5703 10.2056C52.3324 10.283 52.1304 10.3854 51.9644 10.5127C51.7983 10.64 51.6683 10.7922 51.5742 10.9692C51.4857 11.1408 51.4414 11.3206 51.4414 11.5088H49.8975C49.903 11.1823 49.986 10.8613 50.1465 10.5459C50.3125 10.2305 50.5477 9.94824 50.8521 9.69922C51.1619 9.44466 51.5355 9.23991 51.9727 9.08496C52.4154 8.93001 52.9162 8.85254 53.4751 8.85254C53.9842 8.85254 54.4574 8.91618 54.8945 9.04346C55.3317 9.1652 55.708 9.35335 56.0234 9.60791C56.3444 9.85693 56.5962 10.1696 56.7788 10.5459C56.9614 10.9222 57.0527 11.3621 57.0527 11.8657V16.041C57.0527 16.3398 57.0804 16.658 57.1357 16.9956C57.1911 17.3276 57.2686 17.6182 57.3682 17.8672V18H55.7661ZM53.0518 16.8296C53.3506 16.8296 53.63 16.7909 53.8901 16.7134C54.1502 16.6359 54.3854 16.5335 54.5957 16.4062C54.8115 16.279 54.9969 16.1351 55.1519 15.9746C55.3068 15.8086 55.4285 15.637 55.5171 15.46V13.6421H54.0894C53.1929 13.6421 52.4956 13.7749 51.9976 14.0405C51.4995 14.3062 51.2505 14.724 51.2505 15.2939C51.2505 15.5153 51.2865 15.7201 51.3584 15.9082C51.4359 16.0964 51.5493 16.2596 51.6987 16.3979C51.8481 16.5308 52.0363 16.6359 52.2632 16.7134C52.4901 16.7909 52.7529 16.8296 53.0518 16.8296ZM59.792 13.4346C59.792 12.765 59.8722 12.1507 60.0327 11.5918C60.1987 11.0273 60.4367 10.5431 60.7466 10.1392C61.0565 9.73519 61.4328 9.41976 61.8755 9.19287C62.3182 8.96598 62.819 8.85254 63.3779 8.85254C63.9313 8.85254 64.4155 8.95215 64.8306 9.15137C65.2511 9.34505 65.6081 9.62728 65.9014 9.99805L65.9761 9.01855H67.3706V17.8091C67.3706 18.4012 67.2765 18.9269 67.0884 19.3862C66.9058 19.8455 66.6457 20.2357 66.3081 20.5566C65.9761 20.8776 65.5776 21.1211 65.1128 21.2871C64.6479 21.4531 64.1333 21.5361 63.5688 21.5361C63.3364 21.5361 63.0708 21.5085 62.772 21.4531C62.4731 21.4033 62.1688 21.3175 61.8589 21.1958C61.5545 21.0796 61.2585 20.9219 60.9707 20.7227C60.6885 20.5234 60.445 20.2772 60.2402 19.9839L61.0371 19.0625C61.2253 19.2894 61.4189 19.4803 61.6182 19.6353C61.8174 19.7957 62.0194 19.923 62.2241 20.0171C62.4289 20.1112 62.6336 20.1776 62.8384 20.2163C63.0431 20.2606 63.2479 20.2827 63.4526 20.2827C63.8179 20.2827 64.1471 20.2301 64.4404 20.125C64.7337 20.0199 64.9827 19.8649 65.1875 19.6602C65.3978 19.4609 65.5583 19.2119 65.6689 18.9131C65.7796 18.6143 65.835 18.2712 65.835 17.8838V17.1118C65.5361 17.4549 65.182 17.7178 64.7725 17.9004C64.3685 18.0775 63.8981 18.166 63.3613 18.166C62.8135 18.166 62.3182 18.0498 61.8755 17.8174C61.4328 17.585 61.0565 17.264 60.7466 16.8545C60.4422 16.445 60.207 15.9635 60.041 15.4102C59.875 14.8512 59.792 14.2508 59.792 13.6089V13.4346ZM61.3276 13.6089C61.3276 14.0461 61.3719 14.4611 61.4604 14.854C61.5545 15.2469 61.6984 15.5928 61.8921 15.8916C62.0913 16.1904 62.3431 16.4284 62.6475 16.6055C62.9518 16.777 63.3171 16.8628 63.7432 16.8628C64.0088 16.8628 64.2467 16.8324 64.457 16.7715C64.6729 16.7051 64.8638 16.6138 65.0298 16.4976C65.2013 16.3813 65.3535 16.243 65.4863 16.0825C65.6191 15.922 65.7354 15.745 65.835 15.5513V11.4341C65.7354 11.2459 65.6191 11.0744 65.4863 10.9194C65.3535 10.7645 65.2013 10.6317 65.0298 10.521C64.8582 10.4048 64.6673 10.3162 64.457 10.2554C64.2467 10.189 64.0143 10.1558 63.7598 10.1558C63.3281 10.1558 62.9574 10.2443 62.6475 10.4214C62.3431 10.5985 62.0913 10.8392 61.8921 11.1436C61.6984 11.4424 61.5545 11.791 61.4604 12.1895C61.3719 12.5824 61.3276 12.9974 61.3276 13.4346V13.6089ZM74.252 18.166C73.6211 18.166 73.04 18.0581 72.5088 17.8423C71.9831 17.6265 71.5321 17.3249 71.1558 16.9375C70.7795 16.5501 70.4862 16.0908 70.2759 15.5596C70.0656 15.0283 69.9604 14.45 69.9604 13.8247V13.4761C69.9604 12.7511 70.0767 12.1037 70.3091 11.5337C70.5415 10.9582 70.8486 10.474 71.2305 10.0811C71.6178 9.68262 72.055 9.37826 72.542 9.16797C73.0345 8.95768 73.5381 8.85254 74.0527 8.85254C74.7002 8.85254 75.2646 8.96598 75.7461 9.19287C76.2331 9.41423 76.637 9.72412 76.958 10.1226C77.279 10.5155 77.5169 10.9803 77.6719 11.5171C77.8324 12.0539 77.9126 12.6349 77.9126 13.2603V13.9492H71.4961C71.5127 14.3587 71.5902 14.7433 71.7285 15.103C71.8724 15.4627 72.0661 15.7782 72.3096 16.0493C72.5586 16.3149 72.8547 16.5252 73.1978 16.6802C73.5409 16.8351 73.9199 16.9126 74.335 16.9126C74.8828 16.9126 75.3698 16.8019 75.7959 16.5806C76.222 16.3592 76.5762 16.0659 76.8584 15.7007L77.7964 16.4312C77.647 16.658 77.4588 16.8766 77.2319 17.0869C77.0106 17.2917 76.7533 17.4743 76.46 17.6348C76.1667 17.7952 75.8346 17.9225 75.4639 18.0166C75.0931 18.1162 74.6891 18.166 74.252 18.166ZM74.0527 10.1143C73.7428 10.1143 73.4495 10.1724 73.1729 10.2886C72.8962 10.3993 72.6471 10.5653 72.4258 10.7866C72.2044 11.0024 72.0163 11.2708 71.8613 11.5918C71.7119 11.9072 71.6068 12.2725 71.5459 12.6875H76.377V12.5713C76.3604 12.2725 76.3022 11.9764 76.2026 11.6831C76.1086 11.3898 75.9674 11.127 75.7793 10.8945C75.5911 10.6621 75.3532 10.474 75.0654 10.3301C74.7832 10.1862 74.4456 10.1143 74.0527 10.1143Z"
                        fill="black"
                        fillOpacity="0.5"
                      />
                      <rect
                        x="3"
                        width="25"
                        height="25"
                        fill="url(#pattern0)"
                      />
                      <defs>
                        <pattern
                          id="pattern0"
                          patternContentUnits="objectBoundingBox"
                          width="1"
                          height="1"
                        >
                          <use xlinkHref="#image0" transform="scale(0.005)"/>
                        </pattern>
                        <image
                          id="image0"
                          width="200"
                          height="200"
                          xlinkHref="data:image/png;base64,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"
                        />
                      </defs>
                    </svg>
                  </a>
                ))
                : null}
            </p>
          </div>
        </div>
      </>
    );
  }
}
