export interface ServiceTypeMeta {
  type: string;
  monthlyGoal: number;
  active: boolean;
}

export interface ProcessingStats {
  totalActivities: number;
  totalPatients: number;
  topCupsCode: string;
  topCupsName: string;
  topCupsCount: number;
  topPatientId: string;
  topPatientName: string;
  topPatientCount: number;
}

export interface RipsRecord {
  cups: string;
  paciente: string;
  tipo: string;
  nombre: string;
  fecha: string;
}

export interface UserRecord {
  id: string;
  sexo: string;
  fnac: string;
  nombre: string;
}

export interface MaestroCupItem {
  cups: string;
  tipo: string;
  nombre: string;
}

export interface ChartDataPoint {
  name: string;
  meta: number;
  ejecutado: number;
  cumplimiento: number;
  color: string;
}

export interface RankingCupsItem {
  CUPS: string;
  Nombre: string;
  TipoSer: string;
  Cantidad: number;
  PacienteTop: string;
  PacienteTop_Cant: number;
  PacienteTop_Nombre: string;
  PacienteTop_Sexo: string;
  PacienteTop_Edad: string;
  PacienteTop_GrupoEtario: string;
  PacienteTop_Fechas: string; // Nuevo campo
}

export interface RankingPatientItem {
  PacienteId: string;
  Nombre: string;
  Sexo: string;
  Edad: string;
  GrupoEtario: string;
  TotalAtenciones: number;
  ListaCUPS: string[]; // Cambio a Array para exactitud
  ListaFechas: string[]; // Cambio a Array para exactitud
}

export interface DuplicateItem {
  id: string;
  paciente: string;
  nombre_paciente: string;
  cups: string;
  nombre_cups: string;
  fecha: string;
  repeticiones: number;
}