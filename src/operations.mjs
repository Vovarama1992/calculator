// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
import { Operation } from './operation.mjs';

export class AddOperation extends Operation {
  operate(left, right) {
    return left + right;
  }
}

export class MultiplyOperation extends Operation {
  operate(left, right) {
    return left * right;
  }
}

export class SubtractOperation extends Operation {
  operate(left, right) {
    return left - right;
  }
}

export class DivideOperation extends Operation {
  operate(left, right) {
    if (right === 0) {
      throw new Error('Division by zero');
    }
    return left / right;
  }
}

