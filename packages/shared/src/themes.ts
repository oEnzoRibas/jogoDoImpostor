export const THEMES: Record<string, string[]> = {
  ANIMAIS: [
    "Elefante",
    "Girafa",
    "Cachorro",
    "Gato",
    "Ornitorrinco",
    "Tubarão",
    "Águia",
  ],
  PAISES: [
    "Brasil",
    "Japão",
    "Alemanha",
    "Egito",
    "Canadá",
    "Austrália",
    "Argentina",
  ],

  COMIDA: ["Pizza", "Sushi", "Hambúrguer", "Lasanha", "Churrasco", "Feijoada"],

  OBJETOS: [
    "Cadeira",
    "Computador",
    "Caneta",
    "Garrafa",
    "Relógio",
    "Guarda-chuva",
  ],
  PROFISSOES: [
    "Médico",
    "Professor",
    "Bombeiro",
    "Programador",
    "Astronauta",
    "Padeiro",
  ],
  ESPORTES: ["Futebol", "Basquete", "Xadrez", "Vôlei", "Tênis", "Natação"],
};

export const getAvailableThemes = (): string[] => {
  return Object.keys(THEMES);
};

export const getRandomWord = (theme: string): string => {
  const words = THEMES[theme];
  if (!words) return "Palavra Genérica";
  const randomIndex = Math.floor(Math.random() * words.length);
  return words[randomIndex];
};
