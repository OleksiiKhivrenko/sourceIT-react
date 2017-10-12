import React, { Component } from 'react';

class TodoInputField extends Component {
  constructor(props) {
    super(props);

    this.handleChangeInputValue = this.handleChangeInputValue.bind(this);
  }

  handleChangeInputValue(e) {
    this.props.onChangeInputValue(e.target.value); //parent property (handleChangeInputValueParent(e.target.value))
  }

  render() {
    return(
      <input
        type="text"
        placeholder="write something"
        value={this.props.inputValue} // get prop inputValue from parent, default value = ''
        onChange={this.handleChangeInputValue}
      />
    );
  }

}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      items: []
    };

    this.handleChangeInputValueParent = this.handleChangeInputValueParent.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

  }

  handleChangeInputValueParent(inputValue) {
    this.setState({
      inputValue: inputValue
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    if (!this.state.inputValue.length) {
      alert('field should not be empty');
      return false;
    }

    const newItem = {
      id: this.state.items.length,
      text: this.state.inputValue
    };

    this.setState((prevState) => {
      return {
        items: prevState.items.concat(newItem),
        inputValue: ''
      }
    });
  }

  render() {
    return(
      <div>
        <form onSubmit={this.handleSubmit}>
          <TodoInputField
            inputValue={this.state.inputValue} // init default state
            onChangeInputValue={this.handleChangeInputValueParent} //set in prop {onChangeInputValue: handleChangeInputValueParent}
          />
          <button>Add</button>
        </form>
        <TodoElems items={this.state.items}/>
      </div>
    )
  }
}


class TodoElems extends Component {
  render() {
    return(
      <ul>
        {this.props.items.map(item => (
          <li key={item.id}>{item.text}</li>
        ))}
      </ul>
    )
  }
}


export default App;
