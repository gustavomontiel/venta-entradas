export interface Entrada {
    titulo: string;
    precio: number;
    recibido: number;
    vendido: number;
    quedan?: number;
}

export interface Jornada {
    efectivo: number;
    entradas: Entrada[];
}