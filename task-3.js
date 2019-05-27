/**
 * @param {Function} callback
 */
function first(callback) {
  setTimeout(() => {
    console.log('First function finished');
    callback();
  }, 1000);
}

/**
 * @param {Function} callback
 */
function second(callback) {
  setTimeout(() => {
    console.log('Second function finished');
    callback();
  }, 2000);
}

/**
 * @param {Function} callback
 */
function third(callback) {
  setTimeout(() => {
    console.log('Third function finished');
    callback();
  }, 500);
}

function mainFunction() {
  console.log('Main function finished');
}

/**
 * @param {Function[]} functions
 * @param {Function} mainFunction
 */
function computeParallel(functions, mainFunction) {
  let finishedFunctionsCount = 0;

  function trackProgress() {
    finishedFunctionsCount++;

    if (finishedFunctionsCount === functions.length) {
      mainFunction();
    }
  }

  for (const func of functions) {
    func(trackProgress);
  }
}

computeParallel([first, second, third], mainFunction);
