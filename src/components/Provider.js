import React, { Component } from 'react';

var fs = require('fs');
var CryptoJS = require('crypto-js');
const crypto = require('crypto');
const algorithm = 'aes-256-ctr';
const iv = '1111111111111111';

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

class Provider extends Component {

  constructor(props) {
    super(props);
    this.state = {
      //Patient states
      pataddress: '',
      buffer: null,

      //Encryption/decryption states
      key: '',
      //Files 
      hash: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.getHR = this.getHR.bind(this);
    this.convertWordArrayToUint8Array = this.convertWordArrayToUint8Array.bind(this)
    this.handleViewPrescriptions = this.handleViewPrescriptions.bind(this)
    this.handleViewLab = this.handleViewLab.bind(this);
    this.encrypt = this.encrypt.bind(this)
    this.decrypt = this.decrypt.bind(this)
    };

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleViewLab = async (event) => {
    event.preventDefault();
    let arr = await this.props.viewLabResults(this.state.pataddress)
    console.log(arr)
    alert(arr)
  }

encrypt = (buffer) => {
  var cipher = crypto.createCipher(algorithm,this.state.key,iv)
  var crypted = Buffer.concat([cipher.update(buffer),cipher.final()]);
  return crypted;
}
 
decrypt = (buffer) =>{
  var decipher = crypto.createDecipher(algorithm,this.state.key,iv)
  var dec = Buffer.concat([decipher.update(buffer) , decipher.final()]);
  return dec;
}

  captureFileDecrypt = (event) => {
    event.preventDefault();
    const file = event.target.files[0]
    const reader = new FileReader()
    reader.onload = () =>{
      var buff = Buffer(reader.result);
      buff = this.decrypt(buff)
      var fileDec = new Blob([buff.toString('utf8')]);                                   // Create blob from typed array

      var a = document.createElement("a");
      var url = window.URL.createObjectURL(fileDec);
      var filename = file.name.substr(0) + ".txt";
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    }
    reader.readAsArrayBuffer(file);
  }

  captureFile = (event) => {
    event.preventDefault();
    console.log("fileCaptured")
    //Proccess file for ipfs
    const file = event.target.files[0]
    const reader = new FileReader()
    //reader.readAsArrayBuffer(file);
    reader.onload = () =>{
      var buff = Buffer(reader.result);
      buff = this.encrypt(buff)
      this.setState({buffer: buff})
    }
    reader.readAsArrayBuffer(file);
    
  }


  handleSubmitFile = (event) => {
    event.preventDefault()
    ipfs.add(this.state.buffer, (error, result) => {
      console.log("Ipfs result", result)
      const hash = result[0].hash
      if (error) {
        console.error(error)
        return
      }
        console.log(hash)
        this.props.setHash(this.state.pataddress, hash)
    })
  }

  handleViewPrescriptions = async (event) => {
    event.preventDefault();
    let arr = await this.props.viewPrescriptions(this.state.pataddress)
    console.log(arr)
    alert(arr)
  }


  getHR = async (event) => {
    event.preventDefault()
    let hashHR = await this.props.getHash(this.state.pataddress)
    window.location.href="https://ipfs.infura.io/ipfs/"+hashHR
  }

  render() {
    return (
      <div class="container">
      <hr class="border border-secondary"/>
        <div class="row justify-content-md-center">
          <div class="col text-center border border-secondary border-top-0 border-bottom-0 border-left 0">
            <h2>Update HR</h2>
            <form name ="hrSubmit" onSubmit={this.handleSubmitFile}>
              <label for="address">Patient Address</label>
              <br/>
              <input type="text" name ="pataddress" onChange={this.handleChange} placeholder="Enter Patient Address" id="address" required/>
              <br/>
              <br/>
              <input type="text" name ="key" onChange={this.handleChange} placeholder="Enter Key" id="key" required/>
              <br/>
              <br/>
              <input type ='file' onChange={this.captureFile}/>
              <br/>
              <input class="btn btn-primary mt-2" type="submit" value="Submit"/>
            </form>
          </div>
        </div>
        <hr class="border border-secondary"/>
     <div class="row justify-content-md-center"> 
          <div class="col text-center border border-secondary border-top-0 border-bottom-0">
            <form name ="viewP" onSubmit={this.handleViewPrescriptions}>
              <h2>View Prescriptions</h2>
              <label for="patientAddress">Patient Address</label>
              <br/>
              <input type="text" name ="pataddress" onChange={this.handleChange} placeholder="Enter Patient Address" id="patientAddress" required/>
               <br/>
              <input class="btn btn-primary mt-2" type="submit" value="Submit"/>
              </form>
          </div>
          <div class="col text-center border border-secondary border-top-0 border-bottom-0">
            <form name ="viewP" onSubmit={this.handleViewLab}>
              <h2>View Lab Results</h2>
              <label for="patientAddress">Patient Address</label>
              <br/>
              <input type="text" name ="pataddress" onChange={this.handleChange} placeholder="Enter Patient Address" id="patientAddress" required/>
               <br/>
              <input class="btn btn-primary mt-2" type="submit" value="Submit"/>
              </form>
          </div>
        <div class ="text-center mt-5 pr-5 pl-2">
          <h2>Download HR</h2>
          <form>
              <label for="patientAddress">Patient Address</label>
              <br/>
              <input type="text" name ="pataddress" onChange={this.handleChange} placeholder="Enter Patient Address" id="patientAddress" required/>
              <br/>
              <br/>
              <a id = "viewHR" onClick={this.getHR} download class="btn btn-primary">Download</a> 
          </form>
        </div>
        <div class ="text-center mt-5 border border-secondary border-top-0 border-bottom-0 pl-5">
          <h2>Decrypt HR</h2>
          <form>
              <input type="text" name ="key" onChange={this.handleChange} placeholder="Enter Key" id="key" required/>
              <br/>
              <br/>
              <input type ='file' onChange={this.captureFileDecrypt}/>
              <br/>
          </form>
        </div>
       </div> 
      </div>
    );
  }
}

export default Provider;