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
    this.updateCategories = this.updateCategories.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
  }

  componentWillUpdate() {

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

  updateCategories(updCategories) {
    // console.log(this.state.categories);
    // this.setState({
    //   categories: updCategories
    // });
    //
    // this.forceUpdate();
  }

  removeCategory(id) {

  }

  addSubCategory(id) {

  }

  render() {
    const { categories } = this.state;

    return(
      <div className="todo-sidebar">
        <Category
          updateItems = { this.addNewCategory }/>
        <Categories
          items = { categories }
          updateCategories = { this.updateCategories }
          />
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

    this.updateCategories = this.updateCategories.bind(this);
  }

  updateCategories(updCategories) {
    this.props.updateCategories(updCategories);
  }

  showProps() {
    console.log(this.state.categories);
  }

  render() {
    const { categories } = this.state;

    return(
      <div>
        <CategoriesList categoriesList = { categories } updateCategories = { this.updateCategories } />

        <button onClick={ this.showProps.bind(this) }>show</button>
      </div>

    );
  }
}

class CategoriesList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      categoriesList: this.props.categoriesList
    };

    this.categoriesListObj = this.props.categoriesList;

    this.toggleTitleState = this.toggleTitleState.bind(this);
    this.removeCategory = this.removeCategory.bind(this);
    this.addSubCategory = this.addSubCategory.bind(this);
    this.changeCategoryTitle = this.changeCategoryTitle.bind(this);
  }

  componentWillReceiveProps() {

  }

  toggleTitleState(item) {

    let editedCategoriesList = this.categoriesListObj.map(function(obj) {
      if (obj.id === item.id) {
        obj.editable = item.editable;
      }

      return obj;
    });

    this.setState({
      categoriesList: editedCategoriesList
    });

    this.props.updateCategories(editedCategoriesList);

  }

  removeCategory() {

  }

  addSubCategory() {

  }

  changeCategoryTitle(item, title) {

    let editedCategoriesList = this.props.categoriesList.map(function(obj) {

      if (obj.id === item.id) {
        if (item.editable) {
          obj.title = title;
        }
      }

      return obj;
    });

    this.categoriesListObj = editedCategoriesList;

    this.setState({
      categoriesList: editedCategoriesList
    });

  }

  changingTitlesBeforeFullUpd(title) {

    let titleLists = this.titleLists;

  }

  render() {
    const { categoriesList } = this.props;

    const categoryMethods = {
      toggleTitleState: this.toggleTitleState,
      removeCategory: this.removeCategory,
      addSubCategory: this.addSubCategory,
      changeCategoryTitle: this.changeCategoryTitle
    };

    this.titleLists = this.props.categoriesList.map(function(obj) {
      return {
        id: obj.id,
        title: obj.title
      }
    });

    console.log(this.titleLists);

    return (
      <ol>
        {
          categoriesList.map((item, key) => (
            <li key={ key }>
              <div>
                <CategoryTitle item = { item } changeCategoryTitle = { this.changeCategoryTitle } toggleTitleState = { this.toggleTitleState } />
                <CategoryBtns categoryMethods = { categoryMethods } item = { item } />
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

  }

  inputKeyPress(ev) {

    let { defaultTitle, title } = this.state;
    let { item } = this.props;

    if (ev.keyCode === 13) {

      this.props.changeCategoryTitle(item, title);
      item.editable = !item.editable;
      this.props.toggleTitleState(item);

    } else if (ev.keyCode === 27) {

      this.props.changeCategoryTitle(item, defaultTitle);
      item.editable = !item.editable;
      this.props.toggleTitleState(item);

    }

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

    this.edit = this.edit.bind(this);
    this.remove = this.remove.bind(this);
    this.add = this.add.bind(this);
  }

  edit() {
    let item = this.props.item;

    if (item.editable) {
      this.props.categoryMethods.changeCategoryTitle(item);
    }

    item.editable = !item.editable;
    this.props.categoryMethods.toggleTitleState(item);
  }

  remove() {

  }

  add() {

  }

  render() {

    return(
      <div>
        <button onClick = { this.edit }>edit</button>
        <button onClick = { this.remove }>remove</button>
        <button onClick = { this.add }>add</button>
      </div>
    )
  }
}



export default App;
