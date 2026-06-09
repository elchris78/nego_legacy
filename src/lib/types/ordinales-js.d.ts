declare module 'ordinales-js' {
  type Genero = 'm' | 'f';
  function toOrdinal(n: number, genero?: Genero): string;
  function enhance(): void;
  export default { toOrdinal, enhance };
}