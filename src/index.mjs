import { createInterface } from 'readline';
import process from 'process';
import console from 'console';
import {
  AddOperation,
  MultiplyOperation,
  SubtractOperation,
  DivideOperation,
} from './operations.mjs';

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const operations = {
  '+': new AddOperation(),
  '-': new SubtractOperation(),
  '*': new MultiplyOperation(),
  '/': new DivideOperation(),
};

function evaluate(expression) {
  const tokens = expression.match(/(\d+|\+|\-|\*|\/|\(|\))/g);
  const outputQueue = [];
  const operatorStack = [];

  const precedence = {
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2,
  };

  const associativity = {
    '+': 'Left',
    '-': 'Left',
    '*': 'Left',
    '/': 'Left',
  };

  tokens.forEach((token) => {
    if (!isNaN(parseFloat(token))) {
      outputQueue.push(token);
    } else if ('+-*/'.includes(token)) {
      while (
        operatorStack.length &&
        '()+-*/'.includes(operatorStack[operatorStack.length - 1])
      ) {
        if (
          (associativity[token] === 'Left' &&
            precedence[token] <=
              precedence[operatorStack[operatorStack.length - 1]]) ||
          (associativity[token] === 'Right' &&
            precedence[token] <
              precedence[operatorStack[operatorStack.length - 1]])
        ) {
          outputQueue.push(operatorStack.pop());
        } else {
          break;
        }
      }
      operatorStack.push(token);
    } else if (token === '(') {
      operatorStack.push(token);
    } else if (token === ')') {
      while (
        operatorStack.length &&
        operatorStack[operatorStack.length - 1] !== '('
      ) {
        outputQueue.push(operatorStack.pop());
      }
      operatorStack.pop();
    } else {
      throw new Error(`Unsupported operator: ${token}`);
    }
  });

  while (operatorStack.length) {
    outputQueue.push(operatorStack.pop());
  }

  const resultStack = [];
  outputQueue.forEach((token) => {
    if (!isNaN(parseFloat(token))) {
      resultStack.push(token);
    } else {
      const right = resultStack.pop();
      const left = resultStack.pop();
      const operation = operations[token];
      const result = operation.operate(parseFloat(left), parseFloat(right));
      resultStack.push(result);
    }
  });

  return resultStack[0];
}

rl.question('Введите выражение: ', (input) => {
  console.log(`Вы ввели: ${input}`);
  try {
    const result = evaluate(input);
    console.log(`Результат: ${result}`);
  } catch (e) {
    console.error('Ошибка при вычислении выражения:', e.message);
  }
  rl.close();
});
