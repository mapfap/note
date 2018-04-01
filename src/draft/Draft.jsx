import React, { Component } from 'react';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import firebase from 'firebase';
import Swal from 'sweetalert2';
import 'firebase/firestore';
import './Draft.css';

class Draft extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      draftValue: '',
    };
  }

  componentWillMount() {
    this.db = firebase.firestore();
  }

  handleClick() {
    const submission = this.state.draftValue;
    this.inputDraft.value = '';

    this.db.collection('notes').add({
      value: submission,
      createdAt: new Date(),
    })
      // .then((docRef) => {})
      .catch((error) => {
        Swal('Error adding document!', error.stack.toString(), 'error');
      });
  }

  handleChange(event) {
    this.setState({
      draftValue: event.target.value,
    });
  }

  render() {
    return (
      <div key='panel'>
        <TextField
          floatingLabelText="Add new note"
          id='draft'
          name='draft'
          value={this.draftValue}
          onChange={this.handleChange}
          ref={el => this.inputDraft = el}
        />
        <RaisedButton label="Save" primary={true} onClick={this.handleClick} />
      </div>
    );
  }
}

export default Draft;
