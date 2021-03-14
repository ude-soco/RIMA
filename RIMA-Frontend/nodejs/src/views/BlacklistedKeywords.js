
import React from "react";
// react plugin used to create google maps
import { toast } from 'react-toastify';
import Loader from 'react-loader-spinner'
import { handleServerErrors } from "utils/errorHandler";
import RestAPI from '../services/api';

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col
} from "reactstrap";

// core components
import Header from "components/Headers/Header.js";


class BlacklistedKeywords extends React.Component {

  state = {
    keywordData: [],
    keyword: '',
    isLoding: false
  }


  componentDidMount() {
    this.setState({ isLoding: true }, () => {
      this.getBlackKeyword();

    })
  }

  getBlackKeyword = () => {
    RestAPI.getBlackKeyword().then(response => {
      this.setState({
        isLoding: false,
        keywordData: response.data
      })
    }).catch(error => {
      this.setState({ isLoding: false })
      handleServerErrors(error, toast.error)
    })
  }


  handleChange = e => {
    let getValue = e.target.value;
    let getName = e.target.name;
    this.setState(() => ({ [getName]: getValue }))
  };

  _handleSubmit = e => {
    e.preventDefault();

    this.setState({
      keywordData: [...this.state.keywordData, this.state.keyword]
    });

    this.setState({ isLoding: true }, () => {
      RestAPI.addBlackKeyword(this.state.keyword).then(response => {
        toast.success("Add Keyword !", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000
        });
        this.setState({ isLoding: false, keyword: '' })
        this.getBlackKeyword();


      }).catch(error => {
        this.setState({ isLoding: false })
        handleServerErrors(error, toast.error)

      })
    })

  };

  //** DELETE A Keyword **//
  deleteKeyword = (id) => {

    this.setState({ isLoding: true }, () => {

      RestAPI.deleteBlackKeyword(id).then(response => {
        const newvalue = this.state.keywordData.filter((v, i) => v.id !== id);
        this.setState({
          isLoding: false,
          keywordData: [...newvalue]
        })

        toast.success("Delete Papaer !", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000
        });

      }).catch(error => {
        this.setState({ isLoding: false })
        handleServerErrors(error, toast.error)

      })
    })

  }


  render() {
    return (
      <>
        <Header />
        {/* Page content */}
        <Container className="mt--7" fluid>
          <Row>
            <Col className="order-xl-1" xl="12">
              <Card className="bg-secondary shadow">
                <CardHeader className="bg-white border-0">
                  <Row className="align-items-center">
                    <Col xs="8">
                      <h3 className="mb-0">Blacklisted Keywords</h3>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Form onSubmit={this._handleSubmit} method="post">
                    <div className="pl-lg-4">
                      <Row>
                        <Col lg="12">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-username"
                            >
                              Add Black Keywords
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-username"
                              name="keyword" value={this.state.keyword} onChange={this.handleChange}
                              placeholder="Add Keyword"
                              type="text"
                            />
                          </FormGroup>
                        </Col>

                      </Row>
                    </div>
                    <div align="right">
                      <Button color="primary" type="submit"> Save </Button>
                    </div>
                  </Form>

                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* Start Table */}

          <Row style={{ marginTop: '50px' }}>
            <Col className="order-xl-1" xl="12">
              <Card className="bg-secondary shadow">
                <CardHeader className="bg-white border-0">
                  <Row className="align-items-center">
                    <Col xs="8">
                      <h3 className="mb-0">Black Keywords List</h3>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>


                  {
                    this.state.isLoding &&
                    <div className="text-center" style={{ padding: '20px' }}>
                      <Loader type="Puff" color="#00BFFF" height={100} width={100} />
                    </div>
                  }


                  {this.state.keywordData.length ? this.state.keywordData.map((v, i) =>

                    <Row key={v.id}>
                      <Col md="12">
                        <FormGroup>
                          {v.keyword}
                          <div align="right">
                            <Button size="sm" color="danger" type="button" onClick={() => this.deleteKeyword(v.id)}> X </Button>
                          </div>
                          <hr className="my-4" />

                        </FormGroup>
                      </Col>
                    </Row>

                  ) :

                    <div className="text-center1" style={{ padding: '20px' }}>
                      <div style={{ textAlign: 'center' }}> <strong > No Keywords Data</strong></div>
                    </div>
                  }
                </CardBody>
              </Card>
            </Col>
          </Row>




          {/* end Table */}
        </Container>
      </>
    );
  }
}

export default BlacklistedKeywords;
