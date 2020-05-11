import React, { Component } from 'react';
import './App.css';
import SprintForm from './Component/SprintForm'
import BoostForm from './Component/BoostForm'
import axios from 'axios'



class App extends Component {
  state = {
    confirmCases: null,
    recovered: null,
    deaths: null,
    imei: null,
    blocked: null,
    model: null,
    token: null,
    financed: null,
    serialNo: null,
    response: null,
    sprintImei: null,
    data: null

  }


  componentDidMount() {
    this.getSprint()
      .then((res) => {
        this.setState({ data: res.responseSprint })

      })
      .catch(err => console.log(err));
  }

  getSprint = async (e) => {
    e.preventDefault();
    const imei = e.target.elements.sprintImei.value;
    console.log(imei)
    const response = await axios.get(`/sprint_checker?imei=${imei}`)

    const { data } = response.data.sprintInfo.model
    console.log(data)
  }


  getStatus = async (e) => {
    e.preventDefault();
    const imei = e.target.elements.imei.value;
    // if (imei) {

    const token = await axios.get(`https://join.t-mobile.com/api/access_token`,
      {
        "method": "GET"
      })




    axios.get(`https://join.t-mobile.com/api/get_byod_check?imeiNumber=${imei}`,
      {
        headers: {
          Authorization: token.data.access_token
        }
      }
    )
      .then((response) => {
        console.log(response)
        const imei = response.data[0].IMEI
        const blocked = response.data[0].blocked = true ? 'Clean IMEI' : "Bad IMEI"
        const model = response.data[0].MarketingName
        const financed = response.data[0].FullyPaidOff = false ? "Paid Off" : 'Financed'
        console.log(imei)
        console.log(blocked)
        this.setState({
          imei,
          blocked,
          model,
          financed
        })
      })
      .catch(error => {
        console.log(error)
      })
  }





  render() {
    return (
      <div className="App">
        <header >
          <h1>IMEI CHECKER</h1>
        </header>


        <BoostForm getStatus={this.getStatus} />
        <p>Model: {this.state.model}</p>
        <p>IMEI:{this.state.imei}</p>
        <p>Status: {this.state.blocked}</p>
        <p>Financial Status: {this.state.financed}</p>

        <SprintForm getSprint={this.getSprint} />
        <p>{this.state.data}</p>
      </div>
    );
  }
}
export default App;
