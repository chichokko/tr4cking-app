import { FC } from 'react';

interface Props {
  viaje: any;
  asientosOcupados: number[];
  asientoSeleccionado: number;
  onAsientoClick: (numero: number) => void;
}

export const AsientosSelector: FC<Props> = ({
  viaje,
  asientosOcupados,
  asientoSeleccionado,
  onAsientoClick,
}) => {
  const capacidad = viaje?.bus?.capacidad || 40;
  
  // Create a matrix of seats (4 columns)
  const filas = Math.ceil(capacidad / 4);
  const asientosMatrix = Array.from({ length: filas }, (_, filaIndex) => 
    Array.from({ length: 4 }, (_, columnaIndex) => {
      const numero = filaIndex * 4 + columnaIndex + 1;
      return numero <= capacidad ? numero : null;
    })
  );

  return (
    <div className="p-4 bg-gray-700 rounded shadow-lg">
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

      <div className="grid gap-2">
        {asientosMatrix.map((fila, filaIndex) => (
          <div key={`fila-${filaIndex}`} className="flex justify-center gap-2">
            {fila.map((numero, columnaIndex) => {
              if (numero === null) {
                return <div key={`empty-${filaIndex}-${columnaIndex}`} className="w-10 h-10" />;
              }

              const estado = asientosOcupados.includes(numero)
                ? 'ocupado'
                : numero === asientoSeleccionado
                ? 'seleccionado'
                : 'disponible';

              const bgColor = {
                disponible: 'bg-gray-500 hover:bg-gray-400',
                ocupado: 'bg-red-500 cursor-not-allowed',
                seleccionado: 'bg-blue-600',
              }[estado];

              return (
                <button
                  key={`asiento-${filaIndex}-${columnaIndex}`}
                  className={`w-10 h-10 ${bgColor} text-white rounded-md flex items-center justify-center text-sm font-medium`}
                  onClick={() => onAsientoClick(numero)}
                  disabled={estado === 'ocupado'}
                >
                  {numero}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};