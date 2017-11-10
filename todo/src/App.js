import React, { Component } from 'react';
import './App.css';
import { BrowserRouter, Route, Link } from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <div className="todo">
        <TodoSidebar />
        <TodoTasksContainer />
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
      defaultName: "New Category",
      inputValue: ''
    };

    this.updateItems = this.updateItems.bind(this);
  }

  updateItems(value) {
    this.props.updateItems(value)
  }


  render() {
    return (
      <TodoForm placeholder={ this.state.placeholder } name={ this.state.defaultName } updateItems = { this.props.updateItems }/>
    )
  }
}

class TodoForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputValue: ''
    };

    this.inputChange = this.inputChange.bind(this);
    this.addItem = this.addItem.bind(this);
  }

  addItem(e) {
    e.preventDefault();

    let value = this.state.inputValue;

    if (value === "") {
      value = this.props.name;
    }

    console.log(this.props);

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
    return(
      <form type="submit" className="todo-form" onSubmit={ this.addItem }>
        <input type="text"
               placeholder={ this.props.placeholder }
               onChange={ this.inputChange }
               value={ this.state.inputValue } />
        <button>Button</button>
      </form>
    );
  }

};

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
    this.props.addNewCategory('SubCategory', parentId);
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
    let editedCategoriesList = this.props.categoriesList.slice();

    let removedItemsInDepth = [];
    removedItemsInDepth.push(item.id);

    let search = (arr) => {
      let arrForSearch = arr;
      let founded = [];

      editedCategoriesList.filter(function(item) {
        if (arrForSearch.includes(item.id)) {
          if (item.childrenId.length) {
            founded = founded.concat(item.childrenId).filter((v, i, a) => a.indexOf(v) === i);
            founded = founded.concat(search(item.childrenId));
          }
        }
      });

      arrForSearch = arrForSearch.concat(founded);
      arrForSearch = arrForSearch.filter((v, i, a) => a.indexOf(v) === i);

      return arrForSearch;
    };

    removedItemsInDepth = search(removedItemsInDepth);



    editedCategoriesList = editedCategoriesList.filter((obj) => {
      return !removedItemsInDepth.includes(obj.id)
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

    let editedCategoriesList = this.props.categoriesList.map((obj) => {

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

    return (
      <ol className="todo-category">
        {
          categoriesList.map((item) => {
            if (item.parentId === null) {
              return (
                <li key={ item.id } className="todo-categoryItem">
                  <CategoryHelpers item={ item } categoryMethods={ categoryMethods }/>

                  {item.childrenId.length ? (
                    <SubCategoryItem item={ item } categoriesList={ categoriesList }
                                     categoryMethods={ categoryMethods }/>
                  ) : (
                    ''
                  )}
                </li>
              )
            }
          })
        }
      </ol>
    )
  }
}

let SubCategoryItem = ({item, categoriesList, categoryMethods}) => {

  let childrenArr = item.childrenId;
  let collectionOfItems = categoriesList.filter(function(obj) {
    return childrenArr.includes(obj.id)
  });

  return (
    <ol className="todo-category">
      {
        collectionOfItems.map((item) => (
          <li key={ item.id } className="todo-categoryItem">
            <CategoryHelpers item = { item } categoryMethods = { categoryMethods } />

            {item.childrenId.length ? (
              <SubCategoryItem item = { item } categoriesList = { categoriesList } categoryMethods = { categoryMethods } />
            ) : (
              ''
            )}
          </li>
        ))
      }
    </ol>
  )
};

let CategoryHelpers = ({item, categoryMethods}) => {
  return (
    <div className="todo-taskWrap">
      <CategoryTitle item = { item } categoryMethods = { categoryMethods }/>
      <CategoryBtns item = { item } categoryMethods = { categoryMethods } />
    </div>
  )
};

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

    this.props.categoryMethods.changeCategoryTitle(item);

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
      <div className="todo-taskText">
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
      <div className="todo-taskBtns">
        <button className="todo-taskBtn -edit" onClick = { this.edit }>Button</button>
        <button className="todo-taskBtn -remove" onClick = { this.remove } >Button</button>
        <button className="todo-taskBtn -add" onClick = { () => addSubCategory(item.id) }>Button</button>
      </div>
    )
  }
}

class TodoTasksContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      placeholder: 'Enter item title',
      defaultName: "New task",
      inputValue: '',
      tasks: []
    };

    this.updateItems = this.updateItems.bind(this);
  }

  updateItems(value) {
    this.setState({
      tasks: [...this.state.tasks, value]
    });
  }

  render() {
    console.log(this.state.tasks);
    return (
      <div className="todoTasksContainer" >
        <TodoForm placeholder={ this.state.placeholder } name={ this.state.defaultName } updateItems = { this.updateItems } />
        <TodoTaskContainer tasks = { this.state.tasks }/>
      </div>
    )
  }
};

const TodoTaskContainer = ({ tasks }) => {
  return (
    <div className="todoTasks__table-wrap">
      <table className="todoTasks__table">
        <thead>
          <tr>
            <th>Is done</th>
            <th>Task Name</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
        {
          tasks.map((item, index) => (
            <TodoTask task = { item } key = { index } />
          ))
        }
        </tbody>
      </table>
    </div>
  );
};

const TodoTask = ({ task }) => {
  return (
    <tr>
      <td><input type="checkbox"/></td>
      <td>{ task }</td>
      <td><button className="todo-taskBtn -edit" onClick = { this.edit }>Button</button></td>
    </tr>
  )
}

export default App;
