import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';

type CalculatorState = {
  display: string;
  previousValue: number | null;
  operator: string | null;
  waitingForOperand: boolean;
};

const Calculator = () => {
  const [state, setState] = useState<CalculatorState>({
    display: '0',
    previousValue: null,
    operator: null,
    waitingForOperand: false,
  });

  const inputNumber = useCallback((num: string) => {
    setState(prevState => {
      if (prevState.waitingForOperand) {
        return {
          ...prevState,
          display: num,
          waitingForOperand: false,
        };
      }
      
      return {
        ...prevState,
        display: prevState.display === '0' ? num : prevState.display + num,
      };
    });
  }, []);

  const inputDot = useCallback(() => {
    setState(prevState => {
      if (prevState.waitingForOperand) {
        return {
          ...prevState,
          display: '0.',
          waitingForOperand: false,
        };
      }
      
      if (prevState.display.indexOf('.') === -1) {
        return {
          ...prevState,
          display: prevState.display + '.',
        };
      }
      
      return prevState;
    });
  }, []);

  const clear = useCallback(() => {
    setState({
      display: '0',
      previousValue: null,
      operator: null,
      waitingForOperand: false,
    });
  }, []);

  const performOperation = useCallback((nextOperator: string) => {
    setState(prevState => {
      const inputValue = parseFloat(prevState.display);

      if (prevState.previousValue === null) {
        return {
          ...prevState,
          previousValue: inputValue,
          operator: nextOperator,
          waitingForOperand: true,
        };
      }

      if (prevState.operator) {
        const currentValue = prevState.previousValue || 0;
        let result = 0;

        switch (prevState.operator) {
          case '+':
            result = currentValue + inputValue;
            break;
          case '-':
            result = currentValue - inputValue;
            break;
          case '×':
            result = currentValue * inputValue;
            break;
          case '÷':
            result = inputValue !== 0 ? currentValue / inputValue : 0;
            break;
          default:
            return prevState;
        }

        return {
          display: String(result),
          previousValue: result,
          operator: nextOperator,
          waitingForOperand: true,
        };
      }

      return prevState;
    });
  }, []);

  const calculate = useCallback(() => {
    setState(prevState => {
      const inputValue = parseFloat(prevState.display);

      if (prevState.previousValue !== null && prevState.operator) {
        const currentValue = prevState.previousValue;
        let result = 0;

        switch (prevState.operator) {
          case '+':
            result = currentValue + inputValue;
            break;
          case '-':
            result = currentValue - inputValue;
            break;
          case '×':
            result = currentValue * inputValue;
            break;
          case '÷':
            result = inputValue !== 0 ? currentValue / inputValue : 0;
            break;
          default:
            return prevState;
        }

        return {
          display: String(result),
          previousValue: null,
          operator: null,
          waitingForOperand: true,
        };
      }

      return prevState;
    });
  }, []);

  // Keyboard support
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      event.preventDefault();
      
      if (event.key >= '0' && event.key <= '9') {
        inputNumber(event.key);
      } else if (event.key === '.') {
        inputDot();
      } else if (event.key === '+') {
        performOperation('+');
      } else if (event.key === '-') {
        performOperation('-');
      } else if (event.key === '*') {
        performOperation('×');
      } else if (event.key === '/') {
        performOperation('÷');
      } else if (event.key === 'Enter' || event.key === '=') {
        calculate();
      } else if (event.key === 'Escape' || event.key === 'c' || event.key === 'C') {
        clear();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [inputNumber, inputDot, performOperation, calculate, clear]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="bg-calculator-bg rounded-3xl p-6 shadow-[var(--shadow-calculator)] border border-calculator-button">
        {/* Display */}
        <div className="bg-calculator-display rounded-2xl p-6 mb-6 shadow-[var(--shadow-inner)]">
          <div className="text-right text-4xl font-mono text-foreground min-h-[60px] flex items-end justify-end">
            {state.display}
          </div>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-4 gap-3">
          {/* Row 1 */}
          <Button
            onClick={clear}
            className="h-16 text-lg font-semibold bg-calculator-clear hover:bg-calculator-clear-hover text-white border-0 rounded-xl transition-all duration-200 active:scale-95"
          >
            C
          </Button>
          <Button
            className="h-16 text-lg font-semibold bg-calculator-button hover:bg-calculator-button-hover text-foreground border-0 rounded-xl transition-all duration-200 active:scale-95"
            disabled
          >
            ±
          </Button>
          <Button
            className="h-16 text-lg font-semibold bg-calculator-button hover:bg-calculator-button-hover text-foreground border-0 rounded-xl transition-all duration-200 active:scale-95"
            disabled
          >
            %
          </Button>
          <Button
            onClick={() => performOperation('÷')}
            className="h-16 text-lg font-semibold bg-calculator-operator hover:bg-calculator-operator-hover text-calculator-bg border-0 rounded-xl transition-all duration-200 active:scale-95"
          >
            ÷
          </Button>

          {/* Row 2 */}
          <Button
            onClick={() => inputNumber('7')}
            className="h-16 text-lg font-semibold bg-calculator-button hover:bg-calculator-button-hover text-foreground border-0 rounded-xl transition-all duration-200 active:scale-95"
          >
            7
          </Button>
          <Button
            onClick={() => inputNumber('8')}
            className="h-16 text-lg font-semibold bg-calculator-button hover:bg-calculator-button-hover text-foreground border-0 rounded-xl transition-all duration-200 active:scale-95"
          >
            8
          </Button>
          <Button
            onClick={() => inputNumber('9')}
            className="h-16 text-lg font-semibold bg-calculator-button hover:bg-calculator-button-hover text-foreground border-0 rounded-xl transition-all duration-200 active:scale-95"
          >
            9
          </Button>
          <Button
            onClick={() => performOperation('×')}
            className="h-16 text-lg font-semibold bg-calculator-operator hover:bg-calculator-operator-hover text-calculator-bg border-0 rounded-xl transition-all duration-200 active:scale-95"
          >
            ×
          </Button>

          {/* Row 3 */}
          <Button
            onClick={() => inputNumber('4')}
            className="h-16 text-lg font-semibold bg-calculator-button hover:bg-calculator-button-hover text-foreground border-0 rounded-xl transition-all duration-200 active:scale-95"
          >
            4
          </Button>
          <Button
            onClick={() => inputNumber('5')}
            className="h-16 text-lg font-semibold bg-calculator-button hover:bg-calculator-button-hover text-foreground border-0 rounded-xl transition-all duration-200 active:scale-95"
          >
            5
          </Button>
          <Button
            onClick={() => inputNumber('6')}
            className="h-16 text-lg font-semibold bg-calculator-button hover:bg-calculator-button-hover text-foreground border-0 rounded-xl transition-all duration-200 active:scale-95"
          >
            6
          </Button>
          <Button
            onClick={() => performOperation('-')}
            className="h-16 text-lg font-semibold bg-calculator-operator hover:bg-calculator-operator-hover text-calculator-bg border-0 rounded-xl transition-all duration-200 active:scale-95"
          >
            -
          </Button>

          {/* Row 4 */}
          <Button
            onClick={() => inputNumber('1')}
            className="h-16 text-lg font-semibold bg-calculator-button hover:bg-calculator-button-hover text-foreground border-0 rounded-xl transition-all duration-200 active:scale-95"
          >
            1
          </Button>
          <Button
            onClick={() => inputNumber('2')}
            className="h-16 text-lg font-semibold bg-calculator-button hover:bg-calculator-button-hover text-foreground border-0 rounded-xl transition-all duration-200 active:scale-95"
          >
            2
          </Button>
          <Button
            onClick={() => inputNumber('3')}
            className="h-16 text-lg font-semibold bg-calculator-button hover:bg-calculator-button-hover text-foreground border-0 rounded-xl transition-all duration-200 active:scale-95"
          >
            3
          </Button>
          <Button
            onClick={() => performOperation('+')}
            className="h-16 text-lg font-semibold bg-calculator-operator hover:bg-calculator-operator-hover text-calculator-bg border-0 rounded-xl transition-all duration-200 active:scale-95"
          >
            +
          </Button>

          {/* Row 5 */}
          <Button
            onClick={() => inputNumber('0')}
            className="h-16 text-lg font-semibold bg-calculator-button hover:bg-calculator-button-hover text-foreground border-0 rounded-xl transition-all duration-200 active:scale-95 col-span-2"
          >
            0
          </Button>
          <Button
            onClick={inputDot}
            className="h-16 text-lg font-semibold bg-calculator-button hover:bg-calculator-button-hover text-foreground border-0 rounded-xl transition-all duration-200 active:scale-95"
          >
            .
          </Button>
          <Button
            onClick={calculate}
            className="h-16 text-lg font-semibold bg-calculator-equals hover:bg-calculator-equals-hover text-white border-0 rounded-xl transition-all duration-200 active:scale-95"
          >
            =
          </Button>
        </div>

        {/* Keyboard hint */}
        <div className="mt-6 text-center text-sm text-foreground/60">
          Use keyboard for input • ESC to clear
        </div>
      </div>
    </div>
  );
};

export default Calculator;