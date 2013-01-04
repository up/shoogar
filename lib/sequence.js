/*global module: true, define: true, exports: true */

/**
 * Asynchronous processing of functions
 * https://github.com/up/sequence
 * copyright (c) 2012 - 2013 Uli Preuss
 * MIT License
*/

(function () {

  function sequence (tasks, callback) {

    var 
      num = 0, 
      fns = [],
      alen = arguments.length,
      hasTasks
    ;

    hasTasks = (function () {
      if (tasks.constructor.toString().indexOf('Array') === -1) {
        return false;
      }
      else {
        return true; 
      }
    }());
    
    function next() {
      function task(fn) {
        fns[num] = fn;
        if (num === tasks.length && callback) {
          callback.apply(fns, fns);
        } else {
          next();
        }
      }
      if(num < tasks.length) {
        tasks[num++](task);
      }
    }
        
    if(alen === 0) {
      return; //no tasks, no callback
    } else if (alen === 1 && !hasTasks) {
      tasks(); // no tasks, only callback
    } else if (alen === 2 && hasTasks && tasks.length === 0) {
      callback(); // empty task array, only callback
    } else {
      next();  
    }
    
  }

  if (typeof exports !== 'undefined') { 
    exports['sequence'] = sequence;
  } else if (typeof window !== 'undefined') { 
    window['sequence'] = sequence;
  }

}());
