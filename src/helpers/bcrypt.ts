import bcrypt from "bcrypt";

export const hashPass = (password: string) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

export const comparePass = (password: string, hash: string) => {
  return bcrypt.compareSync(password, hash);
};
