import React, { Component } from 'react';

class Navbar extends Component {


  render() {
    return (
      <div>
        <nav class="navbar navbar-dark bg-dark shadow mb-5">
        <p class="navbar-brand my-auto">EHR-Chain</p>
        <ul class="navbar-nav">
          <li class="nav-item text-white">Account: {this.props.account}</li>
          </ul>
        </nav>
      </div>
    );
  }
}

export default Navbar;
