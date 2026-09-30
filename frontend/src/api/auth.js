import api from "./client";

export async function getCurrentUser() {

  const response = await api.get(
    "/auth/me"
  );

  return response.data;
}


export async function logout() {

  await api.post(
    "/auth/logout"
  );

}