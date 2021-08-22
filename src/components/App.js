import React, { Component } from 'react';
import Web3 from 'web3';
import HealthChain from '../abis/HealthChain.json'
import Navbar from './Navbar.js'
import Identifier from './Identifier.js'
import AssignPatient from './AssignPatient.js'
import Provider from './Provider.js'
import Patient from './Patient.js'
import AdminView from './AdminView.js'
import Chemist from './Chemist.js'
import Phlebotomist from './Phlebotomist.js'
import Researcher from './Researcher.js'

class App extends Component {

  
  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadBlockchainData() {


    //Adds web3
    const web3 = window.web3

    //Adds Accounts
    const accounts = await web3.eth.getAccounts()
    this.setState({account: accounts[0]})

    //Adds networkId from ABI, adds contract
    const networkId = await web3.eth.net.getId()
    const contractData = HealthChain.networks[networkId]

    //Check if contract is found
    if (contractData) {

    const ehrSystem = new web3.eth.Contract(HealthChain.abi, contractData.address)
    this.setState({ehrSystem})

    //Check identifier i.e. Doctor, Provider or hospital etc.
    if (await ehrSystem.methods.checkIfAdmin(this.state.account).call()) {
      this.setState({identifier: 'an Admin'})

    } else if(await ehrSystem.methods.checkIfHospital(this.state.account).call()) {
      this.setState({identifier: 'a Hospital'})

    } else if (await ehrSystem.methods.checkIfPatient(this.state.account).call()) {
      this.setState({identifier: 'a Patient'})

    } else if (await ehrSystem.methods.checkIfChemist(this.state.account).call()) {
      this.setState({identifier: 'a Chemist'})

    } else if (await ehrSystem.methods.checkIfDoctor(this.state.account).call()) {
      this.setState({identifier: 'a Doctor'})

    } else if (await ehrSystem.methods.checkIfResearcher(this.state.account).call()) {
      this.setState({identifier: 'a Researcher'})

    } else if (await ehrSystem.methods.checkIfPhlebotomist(this.state.account).call()) {
      this.setState({identifier: 'a Phlebotomist'})

    } else {
      this.setState({identifier: 'not assigned.'})
    }

    } else {
      window.alert("Contract not deployed to correct network!")

    }

  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  };

  //Admin create Hospital
  createHospital = (hospitalAddress, hospitalName, hospitalCity) => {
    this.state.ehrSystem.methods.createHospital(hospitalAddress, hospitalName, hospitalCity).send({from:this.state.account})
  }

  //Hospital Assign Patient
  regPatient = (patientAddress, patientName, patientYear, patientMonth, patientDay, patientCity) => {
    this.state.ehrSystem.methods.registerPatient(patientAddress, patientName, patientYear, patientMonth, patientDay, patientCity).send({from:this.state.account})
  }
  //Hospital Assign Provider
  regProvider= (providerAddress, providerName, providerYear, providerMonth, providerDay, providerCity, providerSpeciality) => {
    this.state.ehrSystem.methods.registerProvider(providerAddress, providerName, providerYear, providerMonth, providerDay, providerCity, providerSpeciality).send({from:this.state.account})
  }

  setHash = (patientAddress, hash) => {
    this.state.ehrSystem.methods.setHash(patientAddress, hash).send({from: this.state.account})
  }

  getHash = async (patientAddress) => {
    let arr = await this.state.ehrSystem.methods.getHash(patientAddress).call({from: this.state.account})
    return arr;
  }
  getHashPat = async (patientAddress) => {
    let arr = await this.state.ehrSystem.methods.getHashPat(patientAddress).call({from: this.state.account})
    return arr;
  }

  addPrescriptions = (patientAddress, entry) => {
    this.state.ehrSystem.methods.addPrescriptions(patientAddress, entry).send({from: this.state.account})
  }

  removePrescriptions = (patientAddress, index) => {
    this.state.ehrSystem.methods.addPrescriptions(patientAddress, index).send({from: this.state.account})
  }

  viewPrescriptions = async (patientAddress) => {
    let arr = await this.state.ehrSystem.methods.viewPrescriptions(patientAddress).call({from: this.state.account})
    return arr;
  }

  addLabResults = (patientAddress, labEntry) => {
    this.state.ehrSystem.methods.addLabResults(patientAddress, labEntry).send({from: this.state.account});
  }

  viewLabResults = async (patientAddress) => {
    let arr = await this.state.ehrSystem.methods.viewLabResults(patientAddress).call({from: this.state.account})
    return arr;
  }

  //Patient Give Prov Access
  giveAccess = (providerAddress) => {
    this.state.ehrSystem.methods.giveAccess(providerAddress).send({from: this.state.account})
  }
  //Patient RevokeProv Access
  revokeAccess = (providerAddress) => {
    this.state.ehrSystem.methods.revokeAccess(providerAddress).send({from: this.state.account})
  }

  constructor(props) {
    super(props);
    this.state = {
      account: '',
      ehrSystem: {},
      identifier: ''
    }

  }

  render() {

    if (this.state.identifier == 'an Admin') {
        return (
        <div>
        <Navbar account={this.state.account}/>
        <Identifier identifier={this.state.identifier}/>
        <AdminView createHospital={this.createHospital}/>
        </div>
      );

    } else if(this.state.identifier == 'a Hospital') {
        return (
        <div>
        <Navbar account={this.state.account}/>
        <Identifier identifier={this.state.identifier}/>
        <AssignPatient regPatient = {this.regPatient} regProvider = {this.regProvider}/>
        </div>
      );

    } else if (this.state.identifier == 'a Doctor'){

      return (
        <div>
          <Navbar account={this.state.account}/>
          <Identifier identifier={this.state.identifier}/>
          <Provider getHash = {this.getHash} setHash = {this.setHash} viewPrescriptions = {this.viewPrescriptions} viewLabResults = {this.viewLabResults} />
        </div>
      );

    } else if (this.state.identifier == 'a Chemist') {

      return (
        <div>
          <Navbar account={this.state.account}/>
          <Identifier identifier={this.state.identifier}/>
          <Chemist getHash = {this.getHash} addPrescriptions = {this.addPrescriptions} removePrescriptions = {this.removePrescriptions} viewPrescriptions = {this.viewPrescriptions}/>
        </div>
      );      

    } else if (this.state.identifier == 'a Researcher') {

      return (
        <div>
          <Navbar account={this.state.account}/>
          <Identifier identifier={this.state.identifier}/>
          <Researcher getHash = {this.getHash}/>
        </div>
      );  

    } else if (this.state.identifier == 'a Phlebotomist') {

      return (
        <div>
          <Navbar account={this.state.account}/>
          <Identifier identifier={this.state.identifier}/>
          <Phlebotomist getHash = {this.getHash} addLabResults = {this.addLabResults} viewLabResults = {this.viewLabResults}/>
        </div>
      );  

    } else if (this.state.identifier == 'a Patient'){

        return (
        <div>
          <Navbar account={this.state.account}/>
          <Identifier identifier={this.state.identifier}/>
          <Patient getHashPat = {this.getHashPat} revokeAccess={this.revokeAccess} giveAccess={this.giveAccess}/>
        </div>
      );

    } else {

      return (
        <div>
        <Navbar account={this.state.account}/>
        <Identifier identifier={this.state.identifier}/>
        </div>
      );
      }

  }
}

export default App;
