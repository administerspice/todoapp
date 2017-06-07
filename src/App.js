import React, { Component } from 'react';
import './App.css';
import firebase from 'firebase';

const config = {
  apiKey: 'AIzaSyCBtzZ480y_tGlaaD5gbYdaM2XB03HA1DY',
  authDomain: 'projectawesome-12ee6.firebaseio.com',
  databaseURL: 'https://projectawesome-12ee6.firebaseio.com/'
};

export default class App extends Component {
  state = {
    list: null
  }

  componentWillMount() {
    this.setupDatabase();
  }

  componentWillUnmount() {
    this.firebaseRef.off();
  }

  setupDatabase = () => {
    firebase.initializeApp(config);
    this.firebaseRef = firebase.database().ref();

    this.firebaseRef.on('value', (snapshot) => {
      let response = snapshot.val();
      let newList = [];

      response.forEach((item) => { newList.push(item) });
      this.setState({ list: newList });
    });
  }

  addTodo = () => {
    let newList = this.state.list;
    newList.push({
      text: '',
      done: false
    })
    this.firebaseRef.set(newList)
  }

  _removeTodo = (id) => {
    let newList = this.state.list;
    newList.splice(id, 1);
    this.firebaseRef.set(newList)
  }

  _updateItem = (id, done, text) => {
    let newList = this.state.list;
    newList[id] = {
      text: text,
      done: done
    };
    this.firebaseRef.set(newList)
  }

  renderItems = () => {
    let data = this.state.list;
    return data.map((item, i) => {
      return <ListItem key={i} id={i} text={item.text} done={item.done} updateItem={this._updateItem} removeTodo={this._removeTodo}/>
    })
  }

  render() {
    return (
      <div className="App">
        <h2>Todo List</h2>
        <p>Add, toggle, and remove from this todo list stored in Firebase.
            <br/>Click on a note to edit!</p>

        {this.state.list
          ? <div className="Panel">
                {this.renderItems()}
              </div> : null}

        <div className="Button" onClick={this.addTodo}>
            <div><p style={{color: 'white'}}>Add Todo</p></div>
        </div>
      </div>
    );
  }
}



class ListItem extends Component {
  state = {
    id: this.props.id,
    text: this.props.text,
    done: this.props.done
  }

  handleValueChange = (e) => {
    this.setState({ text: e.target.value})
  }

  toggle = () => {
    this.setState({ done: !this.state.done }, () => {
      this.props.updateItem(this.state.id, this.state.done, this.state.text)
    })
  }

  renderText = () => {
    return <textArea className="TextArea" type="text" name="TodoValue"
                wrap='soft' maxLength={30} cols={25}
                placeholder='Enter a note'
                value={this.state.text}
                style={{textDecoration: this.state.done ? 'line-through' : 'none'}}
                onChange={this.handleValueChange}
                onBlur={() => this.props.updateItem(this.state.id, this.state.done, this.state.text)}/>;
  }

  render() {
    return (
      <div className="ListItem">
        <div style={{flex: 1, display: 'flex', justifyContent: 'center'}}>
          <div className={this.state.done ? "CheckboxChecked" : "Checkbox"} onClick={() => {this.toggle()}}>
            {this.state.done ? <div className="Checkmark"></div> : null}
          </div>
        </div>

         <div style={{flex: 8, display: 'flex', alignItems: 'flex-start', paddingLeft: '5px'}}>
           {this.renderText()}
         </div>

         <div style={{flex: 1, display: 'flex', justifyContent: 'center'}}>
           <div className="DeleteButton" onClick={() => this.props.removeTodo(this.state.id)}>
             <p style={{fontSize: '12px', color: 'white'}}>X</p>
           </div>
         </div>
       </div>
    );
  }
}
