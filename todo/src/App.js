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
    this.setState({
      categories: updCategories
    });
  }

  removeCategory(id) {

  }

  addSubCategory(id) {

  }

  render() {
    const { categories } = this.state;
    console.log(3, this.state.categories);

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
      categoriesList: this.props.items
    };

    this.updateCategories = this.updateCategories.bind(this);
  }

  updateCategories(updCategories) {

    this.setState({
      categoriesList: updCategories
    });

    this.props.updateCategories(updCategories);
  }

  showProps() {
    console.log(this.state.categoriesList);
  }

  render() {

    return(
      <div>
        <CategoriesList categoriesList = { this.state.categoriesList } updateCategories = { this.updateCategories } />

        <button onClick={ this.showProps.bind(this) }>show</button>
      </div>

    );
  }
}

class CategoriesList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      categoriesList: this.props.categoriesList,
      categoriesListTemp: this.props.categoriesList
    };

    this.toggleTitleState = this.toggleTitleState.bind(this);
    this.removeCategoryItem = this.removeCategoryItem.bind(this);
    this.addSubCategory = this.addSubCategory.bind(this);
    this.changeCategoryTitle = this.changeCategoryTitle.bind(this);
  }

  toggleTitleState(item) {

    let categoriesListTemp = this.state.categoriesListTemp;
    let objTitle;

    for (let obj of categoriesListTemp) {
      if (obj.id === item.id) {
        objTitle = obj.title;
      }
    }

    console.log(objTitle);
    console.log(categoriesListTemp);


    let editedCategoriesList = this.state.categoriesList.map(function(obj) {
      if (obj.id === item.id) {
        obj.editable = item.editable;
        obj.title = obj.title || objTitle;
      }

      return obj;
    });

    this.setState({
      categoriesList: editedCategoriesList
    });

    this.props.updateCategories(editedCategoriesList);

  }

  removeCategoryItem(item) {
    let editedCategoriesList = this.state.categoriesList;
    let editedCategoriesListTemp = this.state.categoriesListTemp;

    editedCategoriesList = editedCategoriesList.filter(function(obj) {
      return obj.id !== item.id
    });

    editedCategoriesListTemp = editedCategoriesListTemp.filter(function(obj) {
      return obj.id !== item.id
    });

    this.setState({
      categoriesList: editedCategoriesList,
      categoriesListTemp: editedCategoriesList
    });

    this.props.updateCategories(editedCategoriesList);

  }

  addSubCategory() {

  }

  changeCategoryTitle(item) {

    let editedCategoriesList = this.props.categoriesList.map(function(obj) {

      if (obj.id === item.id) {
        if (item.editable) {
          obj.title = item.title;
        }
      }

      return obj;
    });

    this.setState({
      categoriesListTemp: editedCategoriesList
    });

  }

  render() {
    const categoryMethods = {
      toggleTitleState: this.toggleTitleState,
      removeCategoryItem: this.removeCategoryItem,
      addSubCategory: this.addSubCategory,
      changeCategoryTitle: this.changeCategoryTitle
    };

    let categoriesList = this.state.categoriesList;

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
  }

  titleChange(ev) {

    let title = ev.target.value;

    this.setState({
      title: title
    });

    const item = this.props.item;
    item.title = title;

    this.props.changeCategoryTitle(item);

  }

  render() {
    const { item } = this.props;
    let { title } = this.state;

    let categoryTitle;

    if (!item.editable) {
      categoryTitle = (
        <span> { item.title } </span>
      )
    } else {
      categoryTitle = (
        <input type="text" value={ title } onChange={ this.titleChange }/>
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
    this.add = this.add.bind(this);
    this.remove = this.remove.bind(this);
  }

  edit() {
    let item = this.props.item;
    item.editable = !item.editable;
    this.props.categoryMethods.toggleTitleState(item);
  }

  remove() {
    const item = this.props.item;

    this.props.categoryMethods.removeCategoryItem(item);
  }

  add() {

  }

  render() {
    const item = this.props.item;

    return(
      <div>
        <button onClick = { this.edit }>edit</button>
        <button onClick = { this.remove } >remove</button>
        <button onClick = { this.add }>add</button>
      </div>
    )
  }
}

export default App;
