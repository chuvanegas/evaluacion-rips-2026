import React from 'react';

interface Props { nombre?: string; children: React.ReactNode }
interface State { error: Error | null }

// Si una sección falla al dibujarse, muestra el error en su lugar en vez de dejar toda la app en blanco.
export default class ErrorBoundary extends React.Component<Props, State> {
  // El proyecto no tiene @types/react: se declaran los miembros que usa la clase
  declare props: Props;
  declare setState: (s: State) => void;
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error(`[${this.props.nombre || 'sección'}]`, error);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="glass-panel rounded-2xl p-6 border border-red-200 dark:border-red-500/30 space-y-2">
        <p className="font-semibold text-red-700 dark:text-red-300">No se pudo mostrar {this.props.nombre || 'esta sección'}.</p>
        <p className="text-xs font-mono text-slate-500 break-all">{this.state.error.message}</p>
        <button
          onClick={() => this.setState({ error: null })}
          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          Reintentar
        </button>
      </div>
    );
  }
}
