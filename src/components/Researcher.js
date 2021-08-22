import React, { Component } from 'react';

var fs = require('fs');
var CryptoJS = require('crypto-js');

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

class Researcher extends Component {

  constructor(props) {
    super(props);
    this.state = {
      //Patient states
      pataddress: '',
      buffer: null,

      //Encryption/decryption states
      key: '',

      //Pharmacy states
      hash: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.getHR = this.getHR.bind(this);
    this.convertWordArrayToUint8Array = this.convertWordArrayToUint8Array.bind(this)
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

  getHR = async (event) => {
    event.preventDefault()
    let hashHR = await this.props.getHash(this.state.pataddress)
    window.location.href="https://ipfs.infura.io/ipfs/"+hashHR
  }

  render() {
    return (
      <div>
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
        </div>      </div>
    );
  }
}

export default Researcher;
