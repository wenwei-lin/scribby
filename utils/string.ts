import JsSha from "jssha";

export const hashPassword = (raw: string) => {
  const shaObj = new JsSha("SHA3-224", "TEXT");
  shaObj.update(raw);
  return shaObj.getHash("HEX");
};
