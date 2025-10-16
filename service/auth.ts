export async function login(params: object) {
  const res = await $fetch("/api/auth/login", {
    method: "POST",
    body: dataEncrypt(params),
  });
  if (res.data) {
    return decrypt(res.data);
  }
  return res;
}
export async function prepareRegister(params: object) {
  const res = await $fetch("/api/auth/prepare-register", {
    method: "POST",
    body: dataEncrypt(params),
  });
  if (res.data) {
    return decrypt(res.data);
  }
  return res;
}
export async function register(params: object) {
  const res = await $fetch("/api/auth/register", {
    method: "POST",
    body: dataEncrypt(params),
  });
  if (res.data) {
    return decrypt(res.data);
  }
  return res;
}
export async function forgotPassword(params: object) {
  const res: EmptyObjectType = await $fetch("/api/auth/forgot-password", {
    method: "POST",
    body: dataEncrypt(params),
  });
  if (res.data) {
    return decrypt(res.data);
  }
  return res;
}
export async function resetPassword(params: object) {
  const res = await $fetch("/api/auth/set-password", {
    method: "POST",
    body: dataEncrypt(params),
  });
  if (res.data) {
    return decrypt(res.data);
  }
  return res;
}

export async function changePassword(params: object) {
  const res = await $fetch("/api/auth/change-password", {
    method: "POST",
    body: dataEncrypt(params),
  });
  if (res.data) {
    return decrypt(res.data);
  }
  return res;
}