import { useMemo, useState } from "react";
import "./AdivinadorCumple.css";

type Paridad = "par" | "impar" | null;
type Modo = "cumple" | "edad" | "numero" | "mes";

type Tabla = {
  key: string;
  valor: number;
  color: string;
  datos: number[][];
};

const MESES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

const TABLAS_CUMPLE: Tabla[] = [
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

const PARTES_MES = [
  { valor: 1, color: "#ef4444" },
  { valor: 2, color: "#0d5c63" },
  { valor: 4, color: "#3a7d44" },
  { valor: 8, color: "#7b2cbf" },
];

const PARTES_EDAD = [
  { valor: 1, color: "#ef4444" },
  { valor: 2, color: "#0d5c63" },
  { valor: 4, color: "#3a7d44" },
  { valor: 8, color: "#7b2cbf" },
  { valor: 16, color: "#1d4ed8" },
  { valor: 32, color: "#f97316" },
];

const PARTES_NUMERO = [
  { valor: 1, color: "#ef4444" },
  { valor: 2, color: "#0d5c63" },
  { valor: 4, color: "#3a7d44" },
  { valor: 8, color: "#7b2cbf" },
  { valor: 16, color: "#1d4ed8" },
  { valor: 32, color: "#f97316" },
  { valor: 64, color: "#ec4899" },
];

function dividirEnFilas(lista: number[], tam: number) {
  const filas: number[][] = [];
  for (let i = 0; i < lista.length; i += tam) {
    filas.push(lista.slice(i, i + tam));
  }
  return filas;
}

function generarTablas(
  max: number,
  partes: { valor: number; color: string }[],
  porFila = 6
): Tabla[] {
  return partes.map((parte, index) => {
    const numeros = Array.from({ length: max }, (_, i) => i + 1).filter(
      (n) => (n & parte.valor) !== 0
    );

    return {
      key: `TABLA ${index + 1}`,
      valor: parte.valor,
      color: parte.color,
      datos: dividirEnFilas(numeros, porFila),
    };
  });
}

const TABLAS_MES = generarTablas(12, PARTES_MES, 4);
const TABLAS_EDAD = generarTablas(63, PARTES_EDAD, 6);
const TABLAS_NUMERO = generarTablas(99, PARTES_NUMERO, 6);

const CONFIG = {
  cumple: {
    badge: "31",
    brandTitle: "Adivinador Cumple",
    brandSubtitle: "Experiencia interactiva",
    topbarStatus: "Día pensado · 1 a 31",
    title: "Adivinador del día de cumpleaños",
    subtitle: "Haz clic en las tablas donde aparezca el número pensado.",
    help: "Después indica si es par o impar.",
    pillBase: "Selección actual:",
    panelTitle: "Panel de control",
    panelSubtitle:
      "Selecciona las tablas, define la paridad y revela el resultado para comenzar una nueva jugada cuando quieras.",
    resultPrompt:
      "Selecciona las tablas que correspondan y luego elige si el número es par o impar.",
    revealPrompt: "Todo listo. Ahora presiona “Mostrar resultado”.",
    resultMessage: (n: number) => `Tu día de cumpleaños es el ${n}`,
    showParity: true,
    min: 1,
    max: 31,
    tablas: TABLAS_CUMPLE,
  },
  mes: {
    badge: "12",
    brandTitle: "Adivinador del Mes",
    brandSubtitle: "Juego matemático interactivo",
    topbarStatus: "Mes pensado · 1 a 12",
    title: "Adivinador del mes de cumpleaños",
    subtitle: "Haz clic en las tablas donde aparezca el mes pensado.",
    help: "Cuando termines, presiona mostrar resultado.",
    pillBase: "Selección actual:",
    panelTitle: "Panel de control",
    panelSubtitle:
      "Selecciona las tablas donde aparezca el mes pensado y luego revela el resultado para comenzar una nueva jugada cuando quieras.",
    resultPrompt:
      "Selecciona las tablas donde aparezca el mes pensado y luego presiona mostrar resultado.",
    revealPrompt: "Todo listo. Ahora presiona “Mostrar resultado”.",
    resultMessage: (n: number) => `El mes pensado es ${MESES[n - 1]}`,
    showParity: false,
    min: 1,
    max: 12,
    tablas: TABLAS_MES,
  },
  edad: {
    badge: "63",
    brandTitle: "Adivinador de Edad",
    brandSubtitle: "Juego matemático interactivo",
    topbarStatus: "Edad pensada · 1 a 63",
    title: "Adivinador de edad",
    subtitle: "Haz clic en las tablas donde aparezca la edad pensada.",
    help: "Cuando termines, presiona mostrar resultado.",
    pillBase: "Selección actual:",
    panelTitle: "Panel de control",
    panelSubtitle:
      "Selecciona las tablas donde aparezca la edad pensada y luego revela el resultado para comenzar una nueva jugada cuando quieras.",
    resultPrompt:
      "Selecciona las tablas donde aparezca la edad pensada y luego presiona mostrar resultado.",
    revealPrompt: "Todo listo. Ahora presiona “Mostrar resultado”.",
    resultMessage: (n: number) => `La edad pensada es ${n}`,
    showParity: false,
    min: 1,
    max: 63,
    tablas: TABLAS_EDAD,
  },
  numero: {
    badge: "99",
    brandTitle: "Adivinador de Número",
    brandSubtitle: "Juego matemático interactivo",
    topbarStatus: "Número pensado · 1 a 99",
    title: "Adivinador de número pensado",
    subtitle: "Haz clic en las tablas donde aparezca el número pensado.",
    help: "Cuando termines, presiona mostrar resultado.",
    pillBase: "Selección actual:",
    panelTitle: "Panel de control",
    panelSubtitle:
      "Selecciona las tablas donde aparezca el número pensado y luego revela el resultado para comenzar una nueva jugada cuando quieras.",
    resultPrompt:
      "Selecciona las tablas donde aparezca el número pensado y luego presiona mostrar resultado.",
    revealPrompt: "Todo listo. Ahora presiona “Mostrar resultado”.",
    resultMessage: (n: number) => `El número pensado es ${n}`,
    showParity: false,
    min: 1,
    max: 99,
    tablas: TABLAS_NUMERO,
  },
};

export default function AdivinadorCumple() {
  const search = new URLSearchParams(window.location.search);
  const juego = search.get("juego");
  const modo: Modo =
    juego === "edad"
      ? "edad"
      : juego === "numero"
      ? "numero"
      : juego === "mes"
      ? "mes"
      : "cumple";

  const config = CONFIG[modo];

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
    if (config.showParity && paridad === null) return;
    setMostrarResultado(true);
  };

  const resultado = useMemo(() => {
    let total = config.tablas
      .filter((t) => seleccionadas.includes(t.key))
      .reduce((acc, t) => acc + t.valor, 0);

    if (config.showParity && paridad === "impar") total += 1;

    if (total < config.min || total > config.max) return null;
    return total;
  }, [seleccionadas, paridad, config]);

  const seleccionTexto =
    seleccionadas.length > 0 ? seleccionadas.join(", ") : "ninguna";

  const estadoTexto = config.showParity
    ? paridad === null
      ? "Falta elegir la paridad"
      : !mostrarResultado
      ? "Listo para revelar"
      : "Resultado mostrado"
    : seleccionadas.length === 0
    ? "Selecciona las tablas"
    : !mostrarResultado
    ? "Listo para revelar"
    : "Resultado mostrado";

  return (
    <div className="adiv-root">
      <div className="adiv-container">
        <div className="adiv-topbar">
          <div className="adiv-brand">
            <div className="adiv-brand-badge">{config.badge}</div>
            <div>
              <div className="adiv-brand-title">{config.brandTitle}</div>
              <div className="adiv-brand-subtitle">{config.brandSubtitle}</div>
            </div>
          </div>

          <div className="adiv-topbar-status">{config.topbarStatus}</div>
        </div>

        <header className="adiv-header">
          <h1 className="adiv-title">{config.title}</h1>
          <p className="adiv-subtitle">{config.subtitle}</p>
          <p className="adiv-help">{config.help}</p>

          <div className="adiv-pill">
            {config.pillBase} {seleccionTexto}
          </div>

          {modo !== "cumple" && (
            <div className="adiv-secondary-links">
              <a className="adiv-link-btn" href="/">
                Volver al adivinador principal
              </a>
            </div>
          )}
        </header>

        <div className="adiv-grid">
          {config.tablas.map((tabla) => {
            const activa = seleccionadas.includes(tabla.key);
            const esDenso = modo === "edad" || modo === "numero";

            return (
              <button
                type="button"
                key={tabla.key}
                onClick={() => toggleTabla(tabla.key)}
                className={`adiv-card ${activa ? "active" : ""} ${
                  esDenso ? "dense-card" : ""
                }`}
              >
                <div className="adiv-card-top">
                  <div className="adiv-card-title">{tabla.key}</div>
                  <div className={`adiv-status ${activa ? "active" : ""}`}>
                    {activa ? "Seleccionada" : "Disponible"}
                  </div>
                </div>

                <div className={`adiv-numbers ${esDenso ? "dense" : ""}`}>
                  {tabla.datos.flat().map((n) => (
                    <div
                      key={`${tabla.key}-${n}`}
                      className={`adiv-number ${esDenso ? "small" : ""}`}
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
              <div className="adiv-panel-title">{config.panelTitle}</div>
              <div className="adiv-panel-subtitle">{config.panelSubtitle}</div>
            </div>

            <div
              className={`adiv-panel-status ${
                (config.showParity && paridad !== null && !mostrarResultado) ||
                (!config.showParity &&
                  seleccionadas.length > 0 &&
                  !mostrarResultado)
                  ? "ready"
                  : mostrarResultado
                  ? "done"
                  : ""
              }`}
            >
              {estadoTexto}
            </div>
          </div>

          <div className="adiv-actions">
            {config.showParity && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setParidad("impar");
                    setMostrarResultado(false);
                  }}
                  className={`adiv-btn green ${
                    paridad === "impar" ? "selected" : ""
                  }`}
                >
                  Es impar
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setParidad("par");
                    setMostrarResultado(false);
                  }}
                  className={`adiv-btn red ${
                    paridad === "par" ? "selected" : ""
                  }`}
                >
                  Es par
                </button>
              </>
            )}

            <button type="button" onClick={limpiar} className="adiv-btn yellow">
              Nueva jugada
            </button>

            <button
              type="button"
              onClick={revelarResultado}
              disabled={config.showParity ? paridad === null : false}
              className="adiv-btn blue"
            >
              Mostrar resultado
            </button>
          </div>

          <div className="adiv-result-box">
            <div className="adiv-result-stack">
              {config.showParity && paridad === null ? (
                <div className="adiv-result-text">{config.resultPrompt}</div>
              ) : !config.showParity && seleccionadas.length === 0 ? (
                <div className="adiv-result-text">{config.resultPrompt}</div>
              ) : !mostrarResultado ? (
                <div className="adiv-result-text">{config.revealPrompt}</div>
              ) : resultado !== null ? (
                <div className="adiv-result-success">
                  <div className="adiv-result-label">Resultado</div>
                  <div className="adiv-result-value">{resultado}</div>
                  <div className="adiv-result-message">
                    {config.resultMessage(resultado)}
                  </div>
                </div>
              ) : (
                <div className="adiv-result-error">
                  La combinación no entregó un valor válido.
                </div>
              )}

              {modo === "cumple" && (
                <div className="adiv-secondary-links-bottom">
                  <div className="adiv-link-group">
                    <a className="adiv-link-btn" href="/?juego=edad">
                      Abrir juego interactivo de edad
                    </a>
                    <a className="adiv-link-btn" href="/?juego=numero">
                      Abrir juego interactivo de número
                    </a>
                    <a className="adiv-link-btn" href="/?juego=mes">
                      Abrir juego interactivo del mes
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <footer className="adiv-footer">
          <strong>Adivinador Cumple</strong> · interfaz interactiva lista para
          web ·{" "}
          <span className="adiv-footer-links">
            <a href="/como-funciona.html">Cómo funciona</a>
            <a href="/preguntas-frecuentes.html">Preguntas frecuentes</a>
            <a href="/truco-matematico-del-cumpleanos.html">
              Truco matemático
            </a>
            <a href="/adivinador-de-edad.html">Adivinador de edad</a>
            <a href="/adivinador-de-numero.html">Adivinador de número</a>
            <a href="/adivinador-del-mes.html">Adivinador del mes</a>
	    <a href="/calculadora-magica-del-cumpleanos.html">Calculadora mágica</a>
          </span>
        </footer>
      </div>
    </div>
  );
}