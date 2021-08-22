import React, { Component } from 'react';
var CryptoJS = require('crypto-js');

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

class Patient extends Component {

  constructor(props) {
    super(props);
    this.state = {
      //Patient states
      pataddress: '',
      provaddress: '',
      // EHR decryption state
      key: '',
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubmitView = this.handleSubmitView.bind(this);
    this.getHR = this.getHR.bind(this);
    };

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }
  convertWordArrayToUint8Array(wordArray) {
    var arrayOfWords = wordArray.hasOwnProperty("words") ? wordArray.words : [];
    var length = wordArray.hasOwnProperty("sigBytes") ? wordArray.sigBytes : arrayOfWords.length * 4;
    var uInt8Array = new Uint8Array(length), index=0, word, i;
    for (i=0; i<length; i++) {
        word = arrayOfWords[i];
        uInt8Array[index++] = word >> 24;
        uInt8Array[index++] = (word >> 16) & 0xff;
        uInt8Array[index++] = (word >> 8) & 0xff;
        uInt8Array[index++] = word & 0xff;
    }
    return uInt8Array;
}

  captureFileDecrypt = (event) => {
    event.preventDefault();
    const file = event.target.files[0]
    const reader = new FileReader()
    reader.onload = () =>{
      const decrypted = CryptoJS.AES.decrypt(reader.result, this.state.key);
      var typedArray = this.convertWordArrayToUint8Array(decrypted); 
      var fileDec = new Blob([typedArray]);                                   // Create blob from typed array

      var a = document.createElement("a");
      var url = window.URL.createObjectURL(fileDec);
      var filename = file.name.substr(0) + ".txt";
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    }
    reader.readAsText(file)
  }

  handleSubmitView = async (event) => {
    event.preventDefault();
    this.props.patViewRecord(this.state.pataddress)
  }

  getHR = async (event) => {
    event.preventDefault()
    let hashHR = await this.props.getHashPat(this.state.pataddress)
    window.location.href="https://ipfs.infura.io/ipfs/"+hashHR
  }

  handleSubmit(event) {
  	if (event.target.name == 'give') {
  		this.props.giveAccess(this.state.provaddress)
  		event.preventDefault();
  		alert("Gave provider access")
  	} else if (event.target.name =='revoke'){
  		this.props.revokeAccess(this.state.provaddress)
  		event.preventDefault();
  		alert("Revoked provider access")
  	}
  }

  render() {
    return (
      <div class="container mt-5">
        <hr class="border border-secondary"/>
      	<div class="row justify-content-md-center">
      		<div class="col text-center">
      			<h2>Give HR Access</h2>
      			<form name ="give" onSubmit={this.handleSubmit}>
	              <label for="address">Provider Address</label>
	              <br/>
	              <input type="text" name ="provaddress" onChange={this.handleChange} placeholder="Enter Provider Address" id="address" required/>
	              <br/>
	              <input class="btn btn-primary mt-2" type="submit" value="Submit"/>
      			</form>
      		</div>
      		<div class="col text-center">
      			<h2>Revoke HR Access</h2>
      			<form name ="revoke" onSubmit={this.handleSubmit}>
	              <label for="address">Provider Address</label>
	              <br/>
	              <input type="text" name ="provaddress" onChange={this.handleChange} placeholder="Enter Provider Address" id="address" required/>
	              <br/>
	              <input class="btn btn-primary mt-2" type="submit" value="Submit"/>
      			</form>
      		</div>
      	</div>
     <div class="row justify-content-md-center"> 
        <div class ="text-center mt-5 pr-5">
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

export default Patient;