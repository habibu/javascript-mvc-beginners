"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * @class Model
 *
 * Manages the data of the application.
 */
var Model =
/*#__PURE__*/
function () {
  function Model() {
    _classCallCheck(this, Model);

    this.todos = JSON.parse(localStorage.getItem('todos')) || [];
  }

  _createClass(Model, [{
    key: "bindEvents",
    value: function bindEvents(controller) {
      this.onTodoListChanged = controller.onTodoListChanged;
    }
  }, {
    key: "addTodo",
    value: function addTodo(todo) {
      this.todos = [].concat(_toConsumableArray(this.todos), [todo]);
      this.update();
      this.onTodoListChanged(this.todos);
    }
  }, {
    key: "editTodo",
    value: function editTodo(id, updatedText) {
      this.todos = this.todos.map(function (todo) {
        return todo.id === id ? {
          id: todo.id,
          text: updatedText,
          complete: todo.complete
        } : todo;
      });
      this.update();
      this.onTodoListChanged(this.todos);
    }
  }, {
    key: "deleteTodo",
    value: function deleteTodo(id) {
      this.todos = this.todos.filter(function (todo) {
        return todo.id !== id;
      });
      this.update();
      this.onTodoListChanged(this.todos);
    }
  }, {
    key: "toggleTodo",
    value: function toggleTodo(id) {
      this.todos = this.todos.map(function (todo) {
        return todo.id === id ? {
          id: todo.id,
          text: todo.text,
          complete: !todo.complete
        } : todo;
      });
      this.update();
      this.onTodoListChanged(this.todos);
    }
  }, {
    key: "update",
    value: function update() {
      localStorage.setItem('todos', JSON.stringify(this.todos));
    }
  }]);

  return Model;
}();
/**
 * @class View
 *
 * Visual representation of the model.
 */


var View =
/*#__PURE__*/
function () {
  function View() {
    _classCallCheck(this, View);

    this.app = this.getElement('#root');
    this.form = this.createElement('form');
    this.input = this.createElement('input');
    this.input.type = 'text';
    this.input.placeholder = 'Add todo';
    this.input.name = 'todo';
    this.submitButton = this.createElement('button');
    this.submitButton.textContent = 'Submit';
    this.form.append(this.input, this.submitButton);
    this.title = this.createElement('h3');
    this.title.textContent = 'Todos List';
    this.todoList = this.createElement('ul', 'todo-list');
    this.app.append(this.title, this.form, this.todoList);
  }

  _createClass(View, [{
    key: "resetInput",
    value: function resetInput() {
      this.input.value = '';
    }
  }, {
    key: "createElement",
    value: function createElement(tag, className) {
      var element = document.createElement(tag);
      if (className) element.classList.add(className);
      return element;
    }
  }, {
    key: "getElement",
    value: function getElement(selector) {
      var element = document.querySelector(selector);
      return element;
    }
  }, {
    key: "displayTodos",
    value: function displayTodos(todos) {
      var _this = this;

      // Delete all nodes
      while (this.todoList.firstChild) {
        this.todoList.removeChild(this.todoList.firstChild);
      } // Show default message


      if (todos.length === 0) {
        var p = this.createElement('p');
        p.textContent = 'Nothing to do! Add a task?';
        this.todoList.append(p);
      } else {
        // Create nodes
        todos.forEach(function (todo) {
          var li = _this.createElement('li');

          li.id = todo.id;

          var checkbox = _this.createElement('input');

          checkbox.type = 'checkbox';
          checkbox.checked = todo.complete;

          var span = _this.createElement('span');

          span.contentEditable = true;
          span.classList.add('editable');

          if (todo.complete) {
            var strike = _this.createElement('s');

            strike.textContent = todo.text;
            span.append(strike);
          } else {
            span.textContent = todo.text;
          }

          var deleteButton = _this.createElement('button', 'delete');

          deleteButton.textContent = 'Delete';
          li.append(checkbox, span, deleteButton); // Append nodes

          _this.todoList.append(li);
        });
      }

      console.log(todos);
    }
  }, {
    key: "bindEvents",
    value: function bindEvents(controller) {
      this.form.addEventListener('submit', controller.handleAddTodo);
      this.todoList.addEventListener('click', controller.handleDeleteTodo);
      this.todoList.addEventListener('input', controller.handleEditTodo);
      this.todoList.addEventListener('focusout', controller.handleEditTodoComplete);
      this.todoList.addEventListener('change', controller.handleToggle);
    }
  }, {
    key: "todoText",
    get: function get() {
      return this.input.value;
    }
  }]);

  return View;
}();
/**
 * @class Controller
 *
 * Links the user and the system.
 */


var Controller = function Controller(model, view) {
  var _this2 = this;

  _classCallCheck(this, Controller);

  _defineProperty(this, "onTodoListChanged", function (todos) {
    _this2.view.displayTodos(todos);
  });

  _defineProperty(this, "handleAddTodo", function (event) {
    event.preventDefault();

    if (_this2.view.todoText) {
      var todo = {
        id: _this2.model.todos.length > 0 ? _this2.model.todos[_this2.model.todos.length - 1].id + 1 : 1,
        text: _this2.view.todoText,
        complete: false
      };

      _this2.model.addTodo(todo);

      _this2.view.resetInput();
    }
  });

  _defineProperty(this, "handleEditTodo", function (event) {
    if (event.target.className === 'editable') {
      _this2.temporaryEditValue = event.target.innerText;
    }
  });

  _defineProperty(this, "handleEditTodoComplete", function (event) {
    if (_this2.temporaryEditValue) {
      var id = parseInt(event.target.parentElement.id);

      _this2.model.editTodo(id, _this2.temporaryEditValue);

      _this2.temporaryEditValue = '';
    }
  });

  _defineProperty(this, "handleDeleteTodo", function (event) {
    if (event.target.className === 'delete') {
      var id = parseInt(event.target.parentElement.id);

      _this2.model.deleteTodo(id);
    }
  });

  _defineProperty(this, "handleToggle", function (event) {
    if (event.target.type === 'checkbox') {
      var id = parseInt(event.target.parentElement.id);

      _this2.model.toggleTodo(id);
    }
  });

  this.model = model;
  this.view = view;
  this.model.bindEvents(this);
  this.view.bindEvents(this);
  this.temporaryEditValue; // Display initial todos

  this.onTodoListChanged(this.model.todos);
};

var app = new Controller(new Model(), new View());
