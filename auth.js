export const getUser = () => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("usuario");
    return user ? JSON.parse(user) : {};
  }
  return {};
};

export const logout = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("usuario");
  }
};