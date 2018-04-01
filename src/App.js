import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import CircularProgress from 'material-ui/CircularProgress';
import Swal from 'sweetalert2';
import moment from 'moment';
import 'firebase/firestore';
import firebase from 'firebase';
import Note from './note/Note';
import Draft from './draft/Draft';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notes: [],
      // lastUpdatedFromServer: null,
      isLoading: true,
    };

    firebase.initializeApp({
      apiKey: 'AIzaSyDVB3DUx36v5KnaNe0DpQT89WgisH2t8R4',
      authDomain: 'note-th.firebaseapp.com',
      projectId: 'note-th',
    });
  }

  componentWillMount() {
    this.db = firebase.firestore();
    this.unsubscribe = this.db.collection('notes').onSnapshot((snapshot) => {
      const newNotes = this.state.notes;

      snapshot.docChanges.forEach((change) => {
        if (change.type === 'added' || change.type === 'modified') {
          newNotes[change.doc.id] = change.doc;
        }
        if (change.type === 'removed') {
          delete newNotes[change.doc.id];
        }
      });
      this.setState({
        notes: newNotes,
        isLoading: false,
        // lastUpdatedFromServer: moment().calendar(),
      });
    }, (error) => {
      this.setState({ isLoading: false });
      Swal('Error!', error.stack.toString(), 'error');
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    // const status = (false && this.state.lastUpdatedFromServer) ?
    // (<div className="status">Last updated: {this.state.lastUpdatedFromServer}</div>) : ('');
    const loader = (this.state.isLoading) ? (<CircularProgress />) : ('');
    return (
      <MuiThemeProvider>
        <div className="App">
          <Draft />
          {loader}
          <div className="notes">
            {
              Object.keys(this.state.notes)
              .sort((a, b) => {
                const dataA = this.state.notes[a].data();
                const dataB = this.state.notes[b].data();
                return moment(dataB.createdAt) - moment(dataA.createdAt);
              })
              .map((k) => {
                const data = this.state.notes[k].data();
                return (
                  <Note
                    key={k}
                    noteId={k}
                    noteValue={data.value}
                    noteCreatedAt={data.createdAt}
                  />
                );
              })
            }
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
