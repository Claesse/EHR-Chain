import React, { Component } from 'react';

class AssignPatient extends Component {


  constructor(props) {
    super(props);
    this.state = {
    	//Patient states
    	pataddress: '',
    	patname: '',
    	patyear: null,
    	patmonth: null,
    	patday: null,
    	patcity: '',
    	//Provider states
    	provaddress: '',
    	provname: '',
    	provyear: null,
    	provmonth: null,
    	provday: null,
    	provspeciality: null,
    	provcity: ''
    };

    this.handleChangeProv = this.handleChangeProv.bind(this);
    this.handleSubmitProv = this.handleSubmitProv.bind(this);
    this.handleChangePat = this.handleChangePat.bind(this);
    this.handleSubmitPat = this.handleSubmitPat.bind(this);
  }

  handleChangePat(event) {
  	const target = event.target;
  	const value = target.value;
  	const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleChangeProv(event) {
  	const target = event.target;
  	const value = target.value;
  	const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmitPat(event) {
    console.log(this.state.pataddress)
    console.log(this.state.patname)
    console.log(this.state.patyear)
    console.log(this.state.patmonth)
    console.log(this.state.patday)
    console.log(this.state.patcity)
    this.props.regPatient(this.state.pataddress,this.state.patname,this.state.patyear,this.state.patmonth,this.state.patday,this.state.patcity)
    event.preventDefault();
    alert('A patient was registered')
  }

  handleSubmitProv(event) {
    console.log(this.state.pataddress)
    console.log(this.state.patname)
    console.log(this.state.patyear)
    console.log(this.state.patmonth)
    console.log(this.state.patday)
    console.log(this.state.patcity)
    this.props.regProvider(this.state.provaddress,this.state.provname,this.state.provyear,this.state.provmonth,this.state.provday,this.state.provcity,this.state.provspeciality)
    event.preventDefault();
    alert('A provider was registered')
  }

  render() {
    return (
      <div class="container pt-5">
      <hr class="border border-secondary"/>
      	<div class="row justify-content-md-center">
      		<div class="col text-center border border-secondary border-top-0 border-bottom-0">
      			<h2>Add Patient</h2>
        		<form onSubmit={this.handleSubmitPat}>
        		<label for="address">Patient Address</label>
        		<br/>
	        	<input type="text" name ="pataddress" value={this.state.value} onChange={this.handleChangePat} placeholder="Enter Patient Address" id="address" required/>
	        	<br/>
	        	<label for="patientName">Patient Name</label>
	        	<br/>
	        	<input type="text" name ="patname" value={this.state.value} onChange={this.handleChangePat} placeholder="Enter Patient Name" id="patientName" required/>
	        	<br/>
	        	<label for="patientYear">Patient Birth Year</label>
	        	<br/>
	        	<input type="number" name ="patyear" value={this.state.value} onChange={this.handleChangePat}  placeholder="Enter Patient Birth Year" id="patientYear" required/>
	        	<br/>
	        	<label for="patientMonth">Patient Birth Month</label>
	        	<br/>
	        	<input type="number" name ="patmonth" value={this.state.value} onChange={this.handleChangePat} placeholder="Enter Patient Birth Month" id="patientMonth" required/>
	        	<br/>
	        	<label for="patientDay">Patient Birth Day</label>
	        	<br/>
	        	<input type="number" name ="patday" value={this.state.value} onChange={this.handleChangePat}  placeholder="Enter Patient Birth Day" id="patientDay" required/>
	        	<br/>
	        	<label for="city">Patient City</label>
	        	<br/>
	        	<input type="text" name ="patcity" value={this.state.value} onChange={this.handleChangePat} placeholder="Enter Patient City" id="city" required/>
	        	<br/>
        		<input class="btn btn-primary mt-2" type="submit" value="Submit" />
        		</form>
        	</div>
        	<div class="col text-center border border-secondary border-top-0 border-bottom-0">
      			<h2>Add Provider</h2>
        		<form onSubmit={this.handleSubmitProv}>
	        	<label for="providerAddress">Provider Address</label>
	        	<br/>
	        	<input type="text" name="provaddress" value={this.state.value} onChange={this.handleChangeProv} placeholder="Enter Provider Address" id="providerAddress" required/>
	        	<br/>
	        	<label for="providerName">Provider Name</label>
	        	<br/>
	        	<input type="text" name="provname" value={this.state.value} onChange={this.handleChangeProv} placeholder="Enter Provider Name" id="providerName" required/>
	        	<br/>
	        	<label for="providerYear">Provider Birth Year</label>
	        	<br/>
	        	<input type="number" name="provyear" value={this.state.value} onChange={this.handleChangeProv} placeholder="Enter Provider Birth Year" id="providerYear" required/>
	        	<br/>
	        	<label for="providerMonth">Provider Birth Month</label>
	        	<br/>
	        	<input type="number" name="provmonth" value={this.state.value} onChange={this.handleChangeProv} placeholder="Enter Provider Birth Month" id="providerMonth" required/>
	        	<br/>
	        	<label for="providerDay">Provider Birth Day</label>
	        	<br/>
	        	<input type="number" name="provday" value={this.state.value} onChange={this.handleChangeProv} placeholder="Enter Provider Birth Day" id="providerDay" required/>
	        	<br/>
	        	<label for="providerCity">Provider City</label>
	        	<br/>
	        	<input type="text" name="provcity" value={this.state.value} onChange={this.handleChangeProv} placeholder="Enter Provider City" id="providerCity" required/>
	        	<br/>
	        	<label for="providerSpeciality">Provider Speciality</label>
	        	<br/>
	        	<input type="text" name="provspeciality" value={this.state.value} onChange={this.handleChangeProv} placeholder="Enter Provider Speciality" id="providerSpeciality" required/>
	        	<br/>
        		<input class="btn btn-primary mt-2" type="submit" value="Submit" />
	        	</form>
        	</div>
        </div>
      </div>
    );
  }
}

export default AssignPatient