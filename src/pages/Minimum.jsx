import { useState } from "react";
import ConfettiExplosion from 'react-confetti-explosion';
import MinimumFunction from "../functions/MinimumFunction";
import Chart from "../components/Chart";
import toast from "react-hot-toast";
import Checker from "../functions/Checker";

const Minimum = () => {
  const [rows, setRows] = useState(0);
  const [cols, setCols] = useState(0);
  const [matrix, setMatrix] = useState([]);

  const handleRowsChange = (event) => {
    setRows(parseInt(event.target.value));
  };

  const handleColsChange = (event) => {
    setCols(parseInt(event.target.value));
  };
  const [isValidArray, setIsValidArray] = useState(false);

  const generateMatrix = () => {
    if (rows < cols || rows === 0 || cols === 0) {
      toast.error('Nombre de lignes doit être supérieur ou égal au nombre de colonnes et positive supérieur à 0', { position: 'bottom-center' });
    } else {
      const newMatrix = [];
      for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < cols; j++) {
          row.push(0);
        }
        newMatrix.push(row);
      }
      setMatrix(newMatrix);
      setIsValidArray(true);
    }
  };

  const [explode, setExplode] = useState(false);
  const [chartData, setChartData] = useState();
  const [z, setZ] = useState(0);

  const resolve = (array) => {
    if (Checker.containsZero(array)) {
      toast.error('Le tableau contient des valeurs null ou negative', { position: 'bottom-center' });
    } else {
      const data = array.map(row => `(${row.join(', ')})`);
      const result = MinimumFunction(data);
      traceGraph(result);
      setExplode(true);
    }
  }

  const traceGraph = (position) => {
    const valuesForChart = []
    position.forEach(pos => {
      valuesForChart.push({
        row: String.fromCharCode(pos[0] + 64),
        column: String.fromCharCode(pos[1] + 96),
        value: matrix[pos[0] - 1][pos[1] - 1]
      })
    });

    let sumValue = 0
    valuesForChart.forEach(item => {
      sumValue += parseInt(item.value);
    });

    setChartData(valuesForChart);
    setZ(sumValue);
  }

  const resetAll = () => {
    setRows(0);
    setCols(0);
    setMatrix([]);
    setExplode(false);
    setChartData([]);
    setZ(0);
    setIsValidArray(false);
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold">Minimum</h1>
      </div>
      <div className="grid grid-cols-3 z-50">
        <div className={`${z !== 0 && 'translate-y-[10%]'} duration-300 space-y-5`}>
          <div className="space-y-2">
            <h1 className="text-lg">Générer la matrice</h1>
            <div className="flex items-center gap-4">
              <input value={rows} onChange={handleRowsChange} className="input input-bordered w-1/6" type="number" />
              <span>x</span>
              <input value={cols} onChange={handleColsChange} className="input input-bordered w-1/6" type="number" />
              <button onClick={generateMatrix} className="btn btn-info">Générer</button>
            </div>
          </div>
          <table className="border-collapse">
            <thead>
              <tr>
                <th className="p-2"></th>
                {matrix.length > 0 &&
                  matrix[0].map((cell, colIndex) => (
                    <th key={colIndex}>
                      {String.fromCharCode(97 + colIndex)}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody className="text-center">
              {matrix.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <th key={rowIndex} className=" p-2">
                    {String.fromCharCode(65 + rowIndex)}
                  </th>
                  {row.map((cell, colIndex) => (
                    <td className="border border-black p-2 text-top" key={colIndex}>
                      <input
                        type="number"
                        value={cell}
                        onChange={(e) => {
                          const newMatrix = matrix.map((r, i) => {
                            if (i === rowIndex) {
                              return r.map((c, j) => {
                                if (j === colIndex) {
                                  return e.target.value;
                                }
                                return c;
                              });
                            }
                            return r;
                          });
                          setMatrix(newMatrix);
                        }}
                        className="w-16 text-center"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-4 items-center justify-center">
          {
            z === 0 && isValidArray &&
            <button onClick={() => resolve(matrix)} className="btn btn-info">
              <span>Résoudre</span>
              <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
              </svg>
            </button>
          }
          {
            z !== 0 &&
            <button onClick={resetAll} className="btn btn-danger">
              <span>Réinitialiser</span>
              <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          }
        </div>
        <div>
          {
            z !== 0 &&
            <div className="relative">
              <Chart data={chartData} />
              <label className="absolute bottom-8 left-[50%] text-2xl text-red-500 font-semibold">= {z}</label>
            </div>
          }
        </div>
      </div>
      {explode &&
        <div className="absolute top-[50%] right-[50%] -z-50">
          <ConfettiExplosion />
        </div>
      }
    </div>
  )
}

export default Minimum