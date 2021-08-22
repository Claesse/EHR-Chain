import React, { Component } from 'react';

class AdminView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      hospitaladdress: '',
      hospitalname: '',
      hospitalcity: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    };

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    this.props.createHospital(this.state.hospitaladdress, this.state.hospitalname, this.state.hospitalcity);
    event.preventDefault();
    alert('A hospital was created')
  }


  render() {
    return (
      <div>
          <div class="col text-center">
            <h2>Add Hospital</h2>
            <form onSubmit={this.handleSubmit}>
            <label for="address">Hospital Address</label>
            <br/>
            <input type="text" name ="hospitaladdress" value={this.state.value} onChange={this.handleChange} placeholder="Enter Hospital Address" id="address" required/>
            <br/>
            <label for="hospitalName">Hospital Name</label>
            <br/>
            <input type="text" name ="hospitalname" value={this.state.value} onChange={this.handleChange} placeholder="Enter Hospital Name" id="hospitalName" required/>
            <br/>
            <label for="city">Hospital City</label>
            <br/>
            <input type="text" name ="hospitalcity" value={this.state.value} onChange={this.handleChange} placeholder="Enter Hospital City" id="city" required/>
            <br/>
            <input class="btn btn-primary mt-2" type="submit" value="Submit" />
            </form>
          </div>
      </div>
    );
  }
}

export default AdminView;