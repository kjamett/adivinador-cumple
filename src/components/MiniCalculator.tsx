import { useMemo, useState } from 'react';

type MiniCalculatorProps = {
  onUseResult?: (value: string) => void;
};

export default function MiniCalculator({ onUseResult }: MiniCalculatorProps) {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState<string>('');

  const safeExpression = useMemo(() => {
    return expression.replace(/×/g, '*').replace(/÷/g, '/');
  }, [expression]);

  const append = (value: string) => {
    setExpression((prev) => prev + value);
  };

  const clearAll = () => {
    setExpression('');
    setResult('');
  };

  const backspace = () => {
    setExpression((prev) => prev.slice(0, -1));
  };

  const calculate = () => {
    try {
      if (!safeExpression.trim()) return;

      // Solo permitir números, espacios y operadores básicos
      if (!/^[0-9+\-*/().\s]+$/.test(safeExpression)) {
        setResult('Error');
        return;
      }

      // eslint-disable-next-line no-new-func
      const value = Function(`"use strict"; return (${safeExpression})`)();

      if (
        typeof value !== 'number' ||
        !Number.isFinite(value)
      ) {
        setResult('Error');
        return;
      }

      setResult(String(Math.round(value * 1000000) / 1000000));
    } catch {
      setResult('Error');
    }
  };

  const useResult = () => {
    if (!result || result === 'Error') return;
    onUseResult?.(result);
  };

  const buttons = [
    '7', '8', '9', '×',
    '4', '5', '6', '+',
    '1', '2', '3', '-',
    '0', '(', ')', '=',
  ];

  return (
    <div className="mini-calculator">
      <h3 className="mini-calculator__title">Calculadora auxiliar</h3>

      <div className="mini-calculator__screen">
        <div className="mini-calculator__label">Operación</div>
        <input
          type="text"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          placeholder="Ej: ((3×5)+6)"
          className="mini-calculator__input"
        />

        <div className="mini-calculator__label mini-calculator__label--result">
          Resultado
        </div>
        <div className="mini-calculator__result">
          {result || '—'}
        </div>
      </div>

      <div className="mini-calculator__actions-top">
        <button type="button" onClick={clearAll} className="mini-btn mini-btn--secondary">
          C
        </button>
        <button type="button" onClick={backspace} className="mini-btn mini-btn--secondary">
          ←
        </button>
      </div>

      <div className="mini-calculator__grid">
        {buttons.map((btn) => (
          <button
            key={btn}
            type="button"
            className={`mini-btn ${btn === '=' ? 'mini-btn--primary' : ''}`}
            onClick={() => {
              if (btn === '=') {
                calculate();
                return;
              }
              append(btn);
            }}
          >
            {btn}
          </button>
        ))}
      </div>

      <div className="mini-calculator__footer">
        <button
          type="button"
          className="mini-btn mini-btn--use"
          onClick={useResult}
          disabled={!result || result === 'Error'}
        >
          Usar resultado
        </button>
      </div>
    </div>
  );
}