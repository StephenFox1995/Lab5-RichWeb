import {Observable} from 'rxjs/RX';

window.onload = function() {
  initiliaze();
}

/// Subscribe mouse clicks and keydowns for the calculator. 
const initiliaze = () => {
  var buttons = document.getElementsByTagName('button');
  buttons = [].slice.call(buttons); // Convert buttons to array so we can map
  const input = document.getElementById('input');
  calculator.inputScreen = input;
  
  // All calculator events
  const buttonPresses = buttons.map(button => { return Observable.fromEvent(button, 'click')}) 
  const keyboardPresses = Observable.fromEvent(document, 'keydown');
   
  //  All rxjs events from keyboard and buttons.
  var events = Observable.from(buttonPresses.concat(keyboardPresses)).mergeAll();
  events.subscribe(evt => { calculator.handleInput(evt) });
}


// Calculator object.
const calculator = {
  inputScreen: {},
  valueFromEvent: function(event) {
    if (event instanceof KeyboardEvent) {
      return event.key;
    } else if (event instanceof MouseEvent){
      return event.target.innerHTML;
    } else {
      return null;
    }
  },
  handleInput: function(event) {
    var value = this.valueFromEvent(event) || '';
    switch(value) {
      case 'C':
      case 'c':
        this.clear();
        break;
      case '=':
        this.showResult();
        break;
      case '±':
        this.flip();
        break;
      case 'Backspace':
        this.backspace();
        break;
      case 'Enter':
        this.showResult();
        break;
      case 'x': // All extra keyboard inputs allowed. 
      case "*":
      case '+':
      case '-':
      case '/':
      case '(':
      case ')':
      case '.':
        this.updateInput(value);
        break;
      default: // Check numbers for the rest.
        if (value.match(/[a-zA-Z]+/)) { 
          break;
        }
        var number = Number(value);
        this.updateInput(number);
    }
  },
  updateInput: function(value) {
    this.inputScreen.value += value;
  },
  backspace: function() {
    this.inputScreen.value = this.inputScreen.value.slice(0, -1);
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





