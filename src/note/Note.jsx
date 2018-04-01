import React, { Component } from 'react';
import { Card, CardHeader } from 'material-ui/Card';
import PropTypes from 'prop-types';
import moment from 'moment';
import './Note.css';

class Note extends Component {
  constructor(props) {
    super(props);
    this.noteId = props.noteId;
    this.noteValue = props.noteValue;
    this.noteCreatedAt = props.noteCreatedAt;
  }

  markUrl(text) {
    if (!text) {
      return '';
    }
    const regex = new RegExp(/[-a-zA-Z0-9@:%_+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&//=]*)?/gi);
    return text.split(' ').map((word, i) => {
      if (word.match(regex)) {
        const urlized = (word.toLowerCase().indexOf('http') === -1) ? `https://${word}` : word;
        return (<a key={i} href={urlized}> {`${word} `} </a>);
      }
      return `${word} `;
    });
  }

  render() {
    if (!this.noteValue || !this.noteCreatedAt) {
      return ('');
    }
    return (
      <Card key={this.noteId}>
        <CardHeader
          title={this.markUrl(this.noteValue)}
          subtitle={moment(this.noteCreatedAt).fromNow()}
        />
      </Card>
    );
  }
}

Note.propTypes = {
  noteId: PropTypes.string,
  noteValue: PropTypes.string,
  noteCreatedAt: PropTypes.instanceOf(Date),
};

export default Note;
