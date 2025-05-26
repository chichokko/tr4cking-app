import { FC, useState } from 'react';
import { generarLayout, LayoutDeBus } from './generarLayout';

interface Props {
  tipo?: '2-2' | '2-1';
  capacidad?: number;
  ocupados?: number[];
  asientosOcupados: number[];
  asientoSeleccionado: number;
  onAsientoClick: (numero: number) => void;
}

const pisosDisponibles = [1, 2];

const Asiento: FC<{
  numero: number;
  estado: 'disponible' | 'ocupado' | 'seleccionado';
  onClick: () => void;
}> = ({ numero, estado, onClick }) => {
  const bgColor = {
    disponible: 'bg-gray-500 hover:bg-gray-400',
    ocupado: 'bg-red-500 cursor-not-allowed',
    seleccionado: 'bg-blue-600'
  }[estado];

  return (
    <button
      className={`w-10 h-10 ${bgColor} text-white rounded-md flex items-center justify-center text-sm font-medium`}
      onClick={onClick}
      disabled={estado === 'ocupado'}
    >
      {numero}
    </button>
  );
};

export const AsientosSelector: FC<Props> = ({ 
  tipo = '2-2',
  capacidad = 48,
  ocupados = [],
  asientosOcupados,
  asientoSeleccionado,
  onAsientoClick
}) => {
  const [pisoActual, setPisoActual] = useState<1 | 2>(1);

  const layout: LayoutDeBus = generarLayout(tipo, capacidad, pisoActual);

  const handleClick = (num: number) => {
    if (asientosOcupados.includes(num)) return;
    onAsientoClick(num);
  };

  // Crear matriz de 4 columnas para los asientos
  const filas = Math.ceil(capacidad / 4);
  const asientosMatrix = Array.from({ length: filas }, (_, filaIndex) => 
    Array.from({ length: 4 }, (_, columnaIndex) => {
      const numero = filaIndex * 4 + columnaIndex + 1;
      return numero <= capacidad ? numero : null;
    })
  );

  return (
    <div className="p-4 bg-gray-700 rounded shadow-lg">
      {/* Selector de Piso */}
      <div className="flex justify-center gap-4 mb-4">
        {pisosDisponibles.map((piso) => (
          <button
            key={piso}
            className={`px-4 py-2 rounded ${
              pisoActual === piso 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-600 text-gray-200'
            }`}
            onClick={() => setPisoActual(piso as 1 | 2)}
          >
            Piso {piso}
          </button>
        ))}
      </div>

      {/* Leyenda */}
      <div className="flex justify-center gap-6 mb-4 text-sm text-gray-300">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-500 border border-gray-400 rounded" />
          <span>Disponible</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-600 border border-blue-500 rounded" />
          <span>Seleccionado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 border border-red-400 rounded" />
          <span>Ocupado</span>
        </div>
      </div>

      {/* Grid de asientos */}
      <div className="grid gap-2">
        {asientosMatrix.map((fila, filaIndex) => (
          <div 
            key={`fila-${filaIndex}`} 
            className="flex justify-center gap-2"
          >
            {fila.map((numero, columnaIndex) => {
              if (numero === null) {
                return (
                  <div 
                    key={`empty-${filaIndex}-${columnaIndex}`} 
                    className="w-10 h-10" 
                  />
                );
              }

              return (
                <Asiento
                  key={`asiento-${filaIndex}-${columnaIndex}`}
                  numero={numero}
                  estado={
                    asientosOcupados.includes(numero)
                      ? 'ocupado'
                      : numero === asientoSeleccionado
                      ? 'seleccionado'
                      : 'disponible'
                  }
                  onClick={() => onAsientoClick(numero)}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
