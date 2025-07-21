import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Calculator as CalcIcon, RotateCcw, History, Settings } from 'lucide-react';
import { playClick, playSuccess } from '../../../utils/soundManager';
import { useNotificationStore } from '../../../stores/useStore';

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [mode, setMode] = useState('basic'); // 'basic' or 'scientific'
  const [memory, setMemory] = useState(0);

  const addNotification = useNotificationStore((state) => state.addNotification);

  // Button press handler
  const handleButton = useCallback((value) => {
    playClick();
    
    if (typeof value === 'number') {
      inputNumber(value);
    } else {
      switch (value) {
        case '+':
        case '-':
        case '*':
        case '/':
          inputOperation(value);
          break;
        case '=':
          calculate();
          break;
        case '.':
          inputDecimal();
          break;
        case 'C':
          clear();
          break;
        case 'CE':
          clearEntry();
          break;
        case '±':
          toggleSign();
          break;
        case '%':
          percentage();
          break;
        case '√':
          squareRoot();
          break;
        case 'x²':
          square();
          break;
        case '1/x':
          reciprocal();
          break;
        case 'MC':
          memoryClear();
          break;
        case 'MR':
          memoryRecall();
          break;
        case 'MS':
          memoryStore();
          break;
        case 'M+':
          memoryAdd();
          break;
        case 'M-':
          memorySubtract();
          break;
        default:
          break;
      }
    }
  }, [display, previousValue, operation, waitingForOperand, memory]);

  // Keyboard support
  useEffect(() => {
    const handleKeyPress = (event) => {
      const { key } = event;
      
      if (key >= '0' && key <= '9') {
        handleButton(parseInt(key));
      } else if (['+', '-', '*', '/'].includes(key)) {
        handleButton(key);
      } else if (key === 'Enter' || key === '=') {
        handleButton('=');
      } else if (key === '.') {
        handleButton('.');
      } else if (key === 'Escape' || key === 'c' || key === 'C') {
        handleButton('C');
      } else if (key === 'Backspace') {
        handleButton('CE');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleButton]);

  const inputNumber = (num) => {
    if (waitingForOperand) {
      setDisplay(String(num));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? String(num) : display + num);
    }
  };

  const inputOperation = (nextOperation) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue, secondValue, operation) => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '*':
        return firstValue * secondValue;
      case '/':
        return secondValue !== 0 ? firstValue / secondValue : 0;
      default:
        return secondValue;
    }
  };

  const performCalculation = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      const calculation = `${previousValue} ${operation} ${inputValue} = ${newValue}`;
      
      // Add to history
      setHistory(prev => [calculation, ...prev].slice(0, 20));
      
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
      
      playSuccess();
      return newValue;
    }
    return inputValue;
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const clearEntry = () => {
    setDisplay('0');
  };

  const toggleSign = () => {
    const value = parseFloat(display);
    setDisplay(String(value * -1));
  };

  const percentage = () => {
    const value = parseFloat(display);
    setDisplay(String(value / 100));
  };

  const squareRoot = () => {
    const value = parseFloat(display);
    if (value >= 0) {
      const result = Math.sqrt(value);
      setDisplay(String(result));
      setHistory(prev => [`√${value} = ${result}`, ...prev].slice(0, 20));
    } else {
      addNotification({ message: 'Cannot calculate square root of negative number', type: 'error' });
    }
  };

  const square = () => {
    const value = parseFloat(display);
    const result = value * value;
    setDisplay(String(result));
    setHistory(prev => [`${value}² = ${result}`, ...prev].slice(0, 20));
  };

  const reciprocal = () => {
    const value = parseFloat(display);
    if (value !== 0) {
      const result = 1 / value;
      setDisplay(String(result));
      setHistory(prev => [`1/${value} = ${result}`, ...prev].slice(0, 20));
    } else {
      addNotification({ message: 'Cannot divide by zero', type: 'error' });
    }
  };

  // Memory functions
  const memoryClear = () => {
    setMemory(0);
    addNotification({ message: 'Memory cleared', type: 'success' });
  };

  const memoryRecall = () => {
    setDisplay(String(memory));
  };

  const memoryStore = () => {
    setMemory(parseFloat(display));
    addNotification({ message: 'Value stored in memory', type: 'success' });
  };

  const memoryAdd = () => {
    setMemory(memory + parseFloat(display));
    addNotification({ message: 'Value added to memory', type: 'success' });
  };

  const memorySubtract = () => {
    setMemory(memory - parseFloat(display));
    addNotification({ message: 'Value subtracted from memory', type: 'success' });
  };

  const Button = ({ value, onClick, className = '', span = 1, variant = 'default' }) => {
    const baseClass = "h-12 rounded-lg font-semibold transition-all duration-150 flex items-center justify-center text-lg select-none";
    
    const variants = {
      default: "bg-glass-dark hover:bg-white/20 text-white/90 border border-white/10",
      operation: "bg-accent/20 hover:bg-accent/30 text-accent border border-accent/30",
      equals: "bg-accent hover:bg-accent/80 text-black border border-accent",
      function: "bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30",
      memory: "bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/30"
    };

    return (
      <motion.button
        className={`${baseClass} ${variants[variant]} ${className}`}
        style={{ gridColumn: `span ${span}` }}
        onClick={() => onClick(value)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        tabIndex={0}
      >
        {value}
      </motion.button>
    );
  };

  return (
    <div className="h-full flex flex-col bg-black/5 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <CalcIcon className="w-6 h-6 text-accent" />
          <h2 className="text-xl font-semibold text-white">Calculator</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="p-2 rounded-lg hover:bg-white/10 text-white/70 transition"
            title="History"
          >
            <History className="w-5 h-5" />
          </button>
          <button
            onClick={() => setMode(mode === 'basic' ? 'scientific' : 'basic')}
            className="px-3 py-1 rounded-lg hover:bg-white/10 text-white/70 text-sm transition"
            title="Toggle mode"
          >
            {mode === 'basic' ? 'Scientific' : 'Basic'}
          </button>
        </div>
      </div>

      <div className="flex gap-4 flex-1">
        {/* Main Calculator */}
        <div className="flex-1">
          {/* Display */}
          <div className="glass-dark rounded-xl p-6 mb-4 border border-white/10">
            <div className="text-right">
              {previousValue !== null && operation && (
                <div className="text-white/50 text-sm mb-1">
                  {previousValue} {operation}
                </div>
              )}
              <div className="text-3xl font-mono text-white break-all">
                {display}
              </div>
              {memory !== 0 && (
                <div className="text-white/50 text-xs mt-1">
                  M: {memory}
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="grid gap-2">
            {mode === 'basic' ? (
              // Basic Mode
              <div className="grid grid-cols-4 gap-2">
                <Button value="MC" onClick={handleButton} variant="memory" />
                <Button value="MR" onClick={handleButton} variant="memory" />
                <Button value="MS" onClick={handleButton} variant="memory" />
                <Button value="M+" onClick={handleButton} variant="memory" />
                
                <Button value="CE" onClick={handleButton} variant="function" />
                <Button value="C" onClick={handleButton} variant="function" />
                <Button value="±" onClick={handleButton} variant="function" />
                <Button value="/" onClick={handleButton} variant="operation" />
                
                <Button value={7} onClick={handleButton} />
                <Button value={8} onClick={handleButton} />
                <Button value={9} onClick={handleButton} />
                <Button value="*" onClick={handleButton} variant="operation" />
                
                <Button value={4} onClick={handleButton} />
                <Button value={5} onClick={handleButton} />
                <Button value={6} onClick={handleButton} />
                <Button value="-" onClick={handleButton} variant="operation" />
                
                <Button value={1} onClick={handleButton} />
                <Button value={2} onClick={handleButton} />
                <Button value={3} onClick={handleButton} />
                <Button value="+" onClick={handleButton} variant="operation" />
                
                <Button value={0} onClick={handleButton} span={2} />
                <Button value="." onClick={handleButton} />
                <Button value="=" onClick={performCalculation} variant="equals" />
              </div>
            ) : (
              // Scientific Mode
              <div className="grid grid-cols-5 gap-2">
                <Button value="MC" onClick={handleButton} variant="memory" />
                <Button value="MR" onClick={handleButton} variant="memory" />
                <Button value="MS" onClick={handleButton} variant="memory" />
                <Button value="M+" onClick={handleButton} variant="memory" />
                <Button value="M-" onClick={handleButton} variant="memory" />
                
                <Button value="√" onClick={handleButton} variant="function" />
                <Button value="x²" onClick={handleButton} variant="function" />
                <Button value="1/x" onClick={handleButton} variant="function" />
                <Button value="%" onClick={handleButton} variant="function" />
                <Button value="/" onClick={handleButton} variant="operation" />
                
                <Button value="CE" onClick={handleButton} variant="function" />
                <Button value="C" onClick={handleButton} variant="function" />
                <Button value="±" onClick={handleButton} variant="function" />
                <Button value={9} onClick={handleButton} />
                <Button value="*" onClick={handleButton} variant="operation" />
                
                <Button value={7} onClick={handleButton} />
                <Button value={8} onClick={handleButton} />
                <Button value={9} onClick={handleButton} />
                <Button value={6} onClick={handleButton} />
                <Button value="-" onClick={handleButton} variant="operation" />
                
                <Button value={4} onClick={handleButton} />
                <Button value={5} onClick={handleButton} />
                <Button value={6} onClick={handleButton} />
                <Button value={3} onClick={handleButton} />
                <Button value="+" onClick={handleButton} variant="operation" />
                
                <Button value={1} onClick={handleButton} />
                <Button value={2} onClick={handleButton} />
                <Button value={3} onClick={handleButton} />
                <Button value={0} onClick={handleButton} />
                <Button value="=" onClick={performCalculation} variant="equals" />
                
                <Button value={0} onClick={handleButton} span={2} />
                <Button value="." onClick={handleButton} />
                <Button value="=" onClick={performCalculation} variant="equals" span={2} />
              </div>
            )}
          </div>
        </div>

        {/* History Sidebar */}
        {showHistory && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 250, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="glass-dark rounded-xl p-4 border border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">History</h3>
              <button
                onClick={() => setHistory([])}
                className="p-1 rounded hover:bg-white/10 text-white/60"
                title="Clear history"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-glass">
              {history.length === 0 ? (
                <div className="text-white/50 text-sm text-center py-8">
                  No calculations yet
                </div>
              ) : (
                history.map((calculation, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-2 rounded bg-black/20 text-sm text-white/80 font-mono cursor-pointer hover:bg-white/10 transition"
                    onClick={() => {
                      const result = calculation.split(' = ')[1];
                      if (result) {
                        setDisplay(result);
                        playClick();
                      }
                    }}
                  >
                    {calculation}
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Footer */}
      <div className="text-xs text-white/50 mt-4 text-center">
        Use keyboard for input • Press Esc to clear • Enter for equals
      </div>
    </div>
  );
};

export default Calculator;