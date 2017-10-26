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

  addNewCategory(categoryTitle, parentId) {

    let categories = this.state.categories.slice();
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

    if (parentId !== undefined) {

      newCategory.parentId = parentId;
      categories = categories.map(function(obj) {
        if (obj.id === parentId) {
          obj.childrenId.push(newCategory.id);
        }

        return obj;
      });

    }

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

  render() {
    return(
      <div className="todo-sidebar">
        <Category
          updateItems = { this.addNewCategory }/>
        <Categories
          items = { this.state.categories }
          updateCategories = { this.updateCategories }
          addNewCategory = { this.addNewCategory }
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

    let value = this.state.inputValue;

    if (value === "") {
      value = "New Task";
    }

    this.props.updateItems(value);

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
    this.addSubCategory = this.addSubCategory.bind(this);
  }

  updateCategories(updCategories) {

    this.setState({
      categoriesList: updCategories
    });

    this.props.updateCategories(updCategories);
  }

  addSubCategory(parentId) {
    this.props.addNewCategory('SubTask', parentId);
  }

  showProps() {
    console.log(this.props.items);
  }

  render() {

    return(
      <div>
        <CategoriesList categoriesList = { this.props.items } updateCategories = { this.updateCategories } addSubCategory = { this.addSubCategory } />

        <button onClick={ this.showProps.bind(this) }>show</button>
      </div>

    );
  }
}

class CategoriesList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      categoriesListTemp: []
    };

    this.toggleTitleState = this.toggleTitleState.bind(this);
    this.removeCategoryItem = this.removeCategoryItem.bind(this);
    this.addSubCategory = this.addSubCategory.bind(this);
    this.changeCategoryTitle = this.changeCategoryTitle.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      categoriesListTemp: nextProps.categoriesList
    });
  }

  toggleTitleState(item) {

    let categoriesListTemp = this.state.categoriesListTemp;
    let objTitle;

    for (let obj of categoriesListTemp) {
      if (obj.id === item.id) {
        if (item.title !== "") {
          objTitle = obj.title;
        } else {
          objTitle = "Task #" + item.id;
        }
      }
    }

    let editedCategoriesList = this.props.categoriesList.map(function(obj) {
      if (obj.id === item.id) {
        obj.editable = item.editable;
        obj.title = objTitle;
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

    editedCategoriesList = editedCategoriesList.filter(function(obj) {
      return obj.id !== item.id
    });

    this.setState({
      categoriesList: editedCategoriesList,
      categoriesListTemp: editedCategoriesList
    });

    this.props.updateCategories(editedCategoriesList);

  }

  addSubCategory(parentId) {
    this.props.addSubCategory(parentId);
  }

  changeCategoryTitle(item) {

    let editedCategoriesList = this.props.categoriesList.map(function(obj) {

      if (obj.id === item.id && item.editable) {
        obj.title = item.title;
      }

      return obj;
    });

    this.setState({
      categoriesListTemp: editedCategoriesList
    });

  }

  render() {
    console.log(this.state.categoriesListTemp);
    const categoryMethods = {
      toggleTitleState: this.toggleTitleState,
      removeCategoryItem: this.removeCategoryItem,
      addSubCategory: this.addSubCategory,
      changeCategoryTitle: this.changeCategoryTitle
    };

    let categoriesList = this.props.categoriesList;

    let abc = (item, key) => {
      let childrenId = item.childrenId;
      let childrenIdLength = item.childrenId.length;


      if (item.parentId === null) {
        categoriesList.map((item, key) => {
          return (
            <li key={ key }>
              <div>
                <CategoryTitle item={ item } changeCategoryTitle={ this.changeCategoryTitle }
                               toggleTitleState={ this.toggleTitleState }/>
                <CategoryBtns categoryMethods={ categoryMethods } item={ item }/>
                {
                  { childrenIdLength } ? (
                    <ol>
                      {
                        categoriesList.map(function (item, key) {
                          if ((item.id)) {
                            console.log(item.id);
                            return (
                              <li key={ key }>
                                <div>
                                  <CategoryTitle item={ item } changeCategoryTitle={ this.changeCategoryTitle }
                                                 toggleTitleState={ this.toggleTitleState }/>
                                  <CategoryBtns categoryMethods={ categoryMethods } item={ item }/>
                                  <ol>
                                    { abc(item, key) }
                                  </ol>
                                </div>
                              </li>
                            )
                          }
                        })
                      }
                    </ol>
                  ) : (
                    ''
                  )
                }
              </div>
            </li>
          )
        })
      } else {
        return (
          <li key={ key }>
            <div>
              <CategoryTitle item={ item } changeCategoryTitle={ this.changeCategoryTitle }
                             toggleTitleState={ this.toggleTitleState }/>
              <CategoryBtns categoryMethods={ categoryMethods } item={ item }/>
              <ol>
                {abc(item, key)}
              </ol>
            </div>
          </li>
        )
      }
    };

    return (
      <ol>
        {
          categoriesList.map((item, key) => {
            abc(item, key);
          })
        }
      </ol>
    );
  }
}

class CategoryTitle extends Component {
  constructor(props) {
    super(props);

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
    let { item } = this.props;

    let categoryTitle;

    if (!item.editable) {
      categoryTitle = (
        <span> { item.title } </span>
      )
    } else {
      categoryTitle = (
        <input type="text" value={ this.props.item.title } onChange={ this.titleChange }/>
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
    const { item } = this.props;
    const { addSubCategory } = this.props.categoryMethods;
    return(
      <div>
        <button onClick = { this.edit }>edit</button>
        <button onClick = { this.remove } >remove</button>
        <button onClick = { () => addSubCategory(item.id) }>add</button>
      </div>
    )
  }
}

export default App;
