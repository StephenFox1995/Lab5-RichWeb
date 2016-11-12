import {Observable} from 'rxjs/RX';

var currentCalculation = {value: ''};

/**
 * Subscribe mouse clicks and keydowns for the calculator.
 */
const initiliaze = () => {
  var buttons = document.getElementsByTagName('button');
  buttons = [].slice.call(buttons); // Convert buttons to array so we can map
  const input = document.getElementById('input');
  calculator.inputScreen = input;
  
  // All calculator events
  const buttonPresses = buttons.map(button => { return Observable.fromEvent(button, 'click')}) 
  const keyboardPresses = Observable.fromEvent(input, 'keydown').map(e => { e.target.value });
   
  //  All rxjs events from keyboard and buttons.
  var events = Observable.from(buttonPresses.concat(keyboardPresses)).mergeAll();
  events.subscribe(evt => { calculator.handleInput(evt) });
}


// Calculator object.
const calculator = {
  inputScreen: {},
  handleInput: function(event) {
    var value = event.target.innerHTML;
    switch(value) {
      case 'C':
        this.clear();
        break;
      case '=':
        this.showResult();
        break;
      case '±':
        this.flip();
        break;
      default:
        this.updateInput(value);
    }
  },
  updateInput: function(value) {
    this.inputScreen.value += value;
  },
  flip: function() {
    this.inputScreen.value = this.inputScreen.value * -1;
  },
  showResult: function() {
    var result = null;
    this.inputScreen.value = this.inputScreen.value
                                                  .replace('x', '*')
                                                  .replace('÷', '/');
    result = eval(this.inputScreen.value);
    this.inputScreen.value = result;                    
  },
  clear: function() {
    this.inputScreen.value = '';
  }
}


// function flip() {
//   var input = document.getElementsByTagName('input')[0];
//   var value = input.value * -1
//   input.value = value
// }


// function showResult() {
//   var input = document.getElementsByTagName('input')[0];
//   var inputValue = input.value;

  
//   inputValue = inputValue.replace('x', '*');
//   inputValue = inputValue.replace();
//   var result = eval(inputValue);
//   input.value = result;
// }

// function clear() {
//   var input = document.getElementsByTagName('input')[0];
//   input.value = '';
// }

window.onload = function() {
  initiliaze();

  // document.addEventListener('keydown', function(event) {
  //   console.log(event.keyCode);
  //   switch(event.keyCode) {
  //     case 67: // c key
  //       clear();
  //       break;
  //     case 13: // enter key
  //     case 187:
  //       showResult();
  //       break;
  //   }
  // }, false);
}


