import { useMemo, useState } from "react";
import "./AdivinadorCumple.css";

type Paridad = "par" | "impar" | null;

const TABLAS = [
  {
    key: "TABLA 1",
    valor: 2,
    color: "#0d5c63",
    datos: [
      [2, 3, 6, 7],
      [10, 11, 14, 15],
      [18, 19, 22, 23],
      [26, 27, 30, 31],
    ],
  },
  {
    key: "TABLA 2",
    valor: 4,
    color: "#3a7d44",
    datos: [
      [4, 5, 6, 7],
      [12, 13, 14, 15],
      [20, 21, 22, 23],
      [28, 29, 30, 31],
    ],
  },
  {
    key: "TABLA 3",
    valor: 8,
    color: "#7b2cbf",
    datos: [
      [8, 9, 10, 11],
      [12, 13, 14, 15],
      [24, 25, 26, 27],
      [28, 29, 30, 31],
    ],
  },
  {
    key: "TABLA 4",
    valor: 16,
    color: "#1d4ed8",
    datos: [
      [16, 17, 18, 19],
      [20, 21, 22, 23],
      [24, 25, 26, 27],
      [28, 29, 30, 31],
    ],
  },
];

export default function AdivinadorCumple() {
  const [seleccionadas, setSeleccionadas] = useState<string[]>([]);
  const [paridad, setParidad] = useState<Paridad>(null);
  const [mostrarResultado, setMostrarResultado] = useState(false);

  const toggleTabla = (nombre: string) => {
    setMostrarResultado(false);
    setSeleccionadas((prev) =>
      prev.includes(nombre)
        ? prev.filter((x) => x !== nombre)
        : [...prev, nombre]
    );
  };

  const limpiar = () => {
    setSeleccionadas([]);
    setParidad(null);
    setMostrarResultado(false);
  };
  const revelarResultado = () => {
    if (paridad === null) return;
    setMostrarResultado(true);
  };
  const resultado = useMemo(() => {
    let total = TABLAS.filter((t) => seleccionadas.includes(t.key)).reduce(
      (acc, t) => acc + t.valor,
      0
    );

    if (paridad === "impar") total += 1;

    if (total < 1 || total > 31) return null;
    return total;
  }, [seleccionadas, paridad]);

  const seleccionTexto =
    seleccionadas.length > 0 ? seleccionadas.join(", ") : "ninguna";
  const estadoTexto =
    paridad === null
      ? "Falta elegir la paridad"
      : !mostrarResultado
      ? "Listo para revelar"
      : "Resultado mostrado";
  return (
    <div className="adiv-root">
      <div className="adiv-container">
      	<div className="adiv-topbar">
  	  <div className="adiv-brand">
    	    <div className="adiv-brand-badge">31</div>
    	    <div>
      	     <div className="adiv-brand-title">Adivinador Cumple</div>
     	     <div className="adiv-brand-subtitle">Experiencia interactiva</div>
    	    </div>
  	</div>

  	<div className="adiv-topbar-status">
    	  Día pensado · 1 a 31
 	</div>
     </div>
        <header className="adiv-header">
          <h1 className="adiv-title">Adivinador del día de cumpleaños</h1>
          <p className="adiv-subtitle">
            Haz clic en las tablas donde aparezca el número pensado.
          </p>
          <p className="adiv-help">Después indica si es par o impar.</p>

          <div className="adiv-pill">
            Selección actual: {seleccionTexto}
          </div>
        </header>

        <div className="adiv-grid">
          {TABLAS.map((tabla) => {
            const activa = seleccionadas.includes(tabla.key);

            return (
              <button
		type="button"
                key={tabla.key}
                onClick={() => toggleTabla(tabla.key)}
                className={`adiv-card ${activa ? "active" : ""}`}
              >
                <div className="adiv-card-top">
                  <div className="adiv-card-title">{tabla.key}</div>
                  <div className={`adiv-status ${activa ? "active" : ""}`}>
                    {activa ? "Seleccionada" : "Disponible"}
                  </div>
                </div>

                <div className="adiv-numbers">
                  {tabla.datos.flat().map((n) => (
                    <div
                      key={`${tabla.key}-${n}`}
                      className="adiv-number"
                      style={{ background: tabla.color }}
                    >
                      {n}
                    </div>
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        <section className="adiv-panel">
          <div className="adiv-panel-top">
           <div>
             <div className="adiv-panel-title">Panel de control</div>
             <div className="adiv-panel-subtitle">
               Selecciona las tablas, define la paridad y revela el resultado para comenzar una nueva jugada cuando quieras.
      	     </div>
    	   </div>

    	   <div
      	     className={`adiv-panel-status ${
               paridad === null ? "" : !mostrarResultado ? "ready" : "done"
      	     }`}
    	   >
      	     {estadoTexto}
    	   </div>
  	 </div>

  	 <div className="adiv-actions">
            <button
  	      type="button"
  	      onClick={() => {
    		setParidad("impar");
    		setMostrarResultado(false);
  	      }}
  	      className={`adiv-btn green ${paridad === "impar" ? "selected" : ""}`}
	    >
  	      Es impar
	    </button>

	    <button
              type="button"
  	      onClick={() => {
    		setParidad("par");
    		setMostrarResultado(false);
  	      }}
 	      className={`adiv-btn red ${paridad === "par" ? "selected" : ""}`}
	    >
  	      Es par
	    </button>

            <button type="button" onClick={limpiar} className="adiv-btn yellow">
  	      Nueva jugada
	    </button>

	    <button
 	      type="button"
  	      onClick={revelarResultado}
  	      disabled={paridad === null}
  	      className="adiv-btn blue"
	    >
  	      Mostrar resultado
	    </button>
          </div>

          <div className="adiv-result-box">
  	   {paridad === null ? (
  	     <div className="adiv-result-text">
    	       Selecciona las tablas que correspondan y luego elige si el número es par o impar.
  	     </div>
	   ) : !mostrarResultado ? (
  	     <div className="adiv-result-text">
    	       Todo listo. Ahora presiona <strong>“Mostrar resultado”</strong>.
  	     </div>
	   ) : resultado !== null ? (
  	     <div className="adiv-result-success">
    	       <div className="adiv-result-label">Resultado</div>
    	       <div className="adiv-result-value">
      	         {resultado}
    	       </div>
    	       <div className="adiv-result-message">
      		 Tu día de cumpleaños es el <strong>{resultado}</strong>
    	       </div>
  	     </div>
	   ) : (
  	     <div className="adiv-result-error">
   	       La combinación no entregó un valor válido.
  	     </div>
	   )}
	  </div>
                </section>

        <footer className="adiv-footer">
  	  <strong>Adivinador Cumple</strong> · interfaz interactiva lista para web ·{" "}
          <a href="/como-funciona.html">Cómo funciona</a>{"    "}
	  <a href="/preguntas-frecuentes.html">Preguntas frecuentes</a>{"    "}
	  <a href="/truco-matematico-del-cumpleanos.html">Cual es el truco?</a>
 	</footer>
      </div>
    </div>
   );
}