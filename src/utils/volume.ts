const minDb = -70;
const maxDb = 0;

export function linearToDb(linearValue: number) {
  return linearValue * (maxDb - minDb) + minDb;
}
export function DbToLinear(DbValue: number) {
  return (DbValue - minDb) / (maxDb - minDb);
}
