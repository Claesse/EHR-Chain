import React, { Component } from 'react';

class Identifier extends Component {


  render() {
    return (
      <div>
        <h1 class="text-center font-weight-bold">This address is {this.props.identifier}</h1>
      </div>
    );
  }
}

export default Identifier;