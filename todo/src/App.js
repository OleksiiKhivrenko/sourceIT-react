import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div>
        <TodoSidebar />
      </div>
    );
  }
}

class TodoSidebar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      categories: [],
      counter: 0
    };

    this.addNewCategory = this.addNewCategory.bind(this);
    this.changeCategory = this.changeCategory.bind(this);
  }

  addNewCategory(categoryTitle) {

    let categories = this.state.categories;
    let counter = this.state.counter;

    let newCategory = {
      key: this.state.counter,
      id: this.state.counter,
      title: categoryTitle,
      parentId: null,
      childrenId: [],
      todoItems: [],
      tasks: [],
      editable: false
    };

    categories.push(newCategory);
    counter++;

    this.setState({
      categories: categories,
      counter: counter
    });

  }

  changeCategory(id) {

  }

  removeCategory(id) {

  }

  addSubCategory(id) {

  }

  render() {
    const { categories } = this.state;

    let titlesCategories = categories.map(function(obj) {
      return {
        id: obj.id,
        title: obj.title
      }
    });

    return(
      <div className="todo-sidebar">
        <Category
          updateItems = { this.addNewCategory }/>
        <Categories
          items = { categories }
          changeCategory = { this.changeCategory }
          titlesCategories = { titlesCategories } />
      </div>
    );
  }
}

class Category extends Component {
  constructor(props) {
    super(props);

    this.state = {
      placeholder: 'Enter category title',
      inputValue: ''
    };

    this.inputChange = this.inputChange.bind(this);
    this.addItem = this.addItem.bind(this);
  }

  addItem(e) {
    e.preventDefault();

    this.props.updateItems(this.state.inputValue);

    this.setState({
      inputValue: ''
    })
  }

  inputChange(e) {
    this.setState({
      inputValue: e.target.value
    });
  }

  render() {
    return (
      <form type="submit" onSubmit={ this.addItem }>
        <input type="text"
               placeholder={ this.state.placeholder }
               onChange={ this.inputChange }
               value={ this.state.inputValue } />
        <button>+</button>
      </form>
    )
  }
}

class Categories extends Component {
  constructor(props) {
    super(props);

    this.state = {
      categories: this.props.items
    };

  }

  showProps() {
    console.log(this.state.categories);
  }

  render() {
    const { categories } = this.state;
    const { titlesCategories } = this.props;

    return(
      <div>
        <CategoriesList categoriesList = { categories } titlesCategories = { titlesCategories } />

        <button onClick={ this.showProps.bind(this) }>show</button>
      </div>

    );
  }
}

class CategoriesList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isTitleEditable: false,
      titlesCategories: this.props.titlesCategories,
      categoriesList: this.props.categoriesList
    };

    // this.categoriesTitles = [];

    this.toggleTitleState = this.toggleTitleState.bind(this);
    this.removeCategory = this.removeCategory.bind(this);
    this.addSubCategory = this.addSubCategory.bind(this);
    this.changeCategoryTitle = this.changeCategoryTitle.bind(this);
  }

  toggleTitleState(id) {

    let editedCategoriesList = this.state.categoriesList.map(function(obj) {

      if (obj.id === id) {
        obj.editable = !obj.editable
      }

      return obj;
    });

    this.setState({
      categoriesList: editedCategoriesList
    });
  }

  removeCategory() {

  }

  addSubCategory() {

  }

  changeCategoryTitle(title, id) {
    // const titlesCategories = this.state.titlesCategories;
    // titlesCategories[id] = title;
    //
    // this.setState({
    //   titlesCategories
    // });
    //
    // console.log(titlesCategories);

    // let editedCategoriesList = this.state.categoriesList.map(function(obj) {
    //
    //   if (obj.id === id) {
    //     obj.title = title;
    //     obj.editable = !obj.editable
    //   }
    //
    //   return obj;
    // });
    //
    // this.setState({
    //   categoriesList: editedCategoriesList
    // });

  }

  render() {
    const { categoriesList } = this.props;

    const categoryMethods = {
      toggleTitleState: this.toggleTitleState,
      removeCategory: this.removeCategory,
      addSubCategory: this.addSubCategory
    };

    return (
      <ol>
        {
          categoriesList.map((item, key) => (
            <li key={ key }>
              <div>
                <CategoryTitle item = { item } isTitleEditable = { this.state.isTitleEditable } changeCategoryTitle = { this.changeCategoryTitle } toggleTitleState = { this.toggleTitleState } />
                <CategoryBtns categoryMethods = { categoryMethods } item = { item } />
                {/*<button onClick = { this.toggleTitleState }>edit</button>*/}
                {/*<button onClick = { this.remove }>remove</button>*/}
                {/*<button onClick = { this.add }>add</button>*/}
              </div>
            </li>
          ))
        }
      </ol>
    );
  }
}

class CategoryTitle extends Component {
  constructor(props) {
    super(props);

    this.state = {
      defaultTitle: this.props.item.title,
      title: this.props.item.title
    };

    this.titleChange = this.titleChange.bind(this);
    this.inputKeyPress = this.inputKeyPress.bind(this);
  }

  titleChange(ev) {

    let title = ev.target.value;

    this.setState({
      title: title
    });

    console.log(ev.target.value);

    this.props.changeCategoryTitle(title, this.props.item.id);

  }

  inputKeyPress(ev) {

    let defaultTitle = this.state.defaultTitle;

    if (ev.keyCode === 13) {
      this.titleChange(ev);
    } else if (ev.keyCode === 27) {
        this.setState({
          title: defaultTitle
        });
        this.props.toggleTitleState(this.props.item.id);
    }

    this.props.changeCategoryTitle(defaultTitle, this.props.item.id);

  }

  render() {
    const { item } = this.props;
    const { title } = this.state;

    let categoryTitle;

    if (!item.editable) {
      categoryTitle = (
        <span> { item.title } </span>
      )
    } else {
      categoryTitle = (
        <input type="text" value={ title } onChange={ this.titleChange } onKeyDown={ this.inputKeyPress }/>
      )
    }

    return(
      <div>
        { categoryTitle }
      </div>
    )

  }

}

class CategoryBtns extends Component {
  constructor(props) {
    super(props);

    this.remove = this.remove.bind(this);
    this.add = this.add.bind(this);
  }

  remove() {

  }

  add() {

  }

  render() {
    const { categoryMethods } = this.props;
    const { item } = this.props;

    return(
      <div>
        <button onClick = { () => categoryMethods.toggleTitleState(item.id) }>edit</button>
        <button onClick = { this.remove }>remove</button>
        <button onClick = { this.add }>add</button>
      </div>
    )
  }
}



export default App;
