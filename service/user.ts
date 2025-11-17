export async function getUserInfo(id: number) {
  const res: EmptyObjectType = await useApiFetch("/api/user", {
    method: "POST",
    body: { id },
  });
  if (res.data.value) return decrypt(res.data.value.data);
  return res;
}

export async function getNoteFeeds(param: object) {
  const res: EmptyObjectType = await useApiFetch("/api/user/user-feed", {
    method: "POST",
    body: param,
  });
  if (res.data.value) return decrypt(res.data.value.data);
  return res;
}

export async function getStarFeeds(param: object) {
  const res: EmptyObjectType = await $fetch("/api/user/star-feed", {
    method: "POST",
    body: param,
  });
}

export async function getLikeFeeds(param: object) {
  const res: EmptyObjectType = await $fetch("/api/user/like-feed", {
    method: "POST",
    body: param,
  });
}
export async function getFollowFeed(param: object) {
  const res: EmptyObjectType = await useApiFetch("/api/user/follow-feed", {
    method: "POST",
    body: param,
  });
  if (res.data.value) return decrypt(res.data.value.data);
  return res;
}

export async function setUserInfo(params: object) {
  const res: EmptyObjectType = await useApiFetch(`/api/user/set-user-info`, {
    method: "POST",
    body: dataEncrypt(params),
  });
  if (res.data) return decrypt(res.data);
  return res;
}
export async function retrySendEmailCode(params: EmptyObjectType) {
  const res: EmptyObjectType = await useApiFetch("/api/user/send-email-code", {
    method: "POST",
    body: dataEncrypt(params),
  });
  return res;
}

export async function veryCode(params: EmptyObjectType) {
  const res: EmptyObjectType = await useApiFetch("/api/article/comment", {
    method: "POST",
    body: dataEncrypt(params),
  });
  return res;
}
export async function changePassword(params: EmptyObjectType) {
  const res: EmptyObjectType = await useApiFetch("/api/user/change-password", {
    method: "POST",
    body: dataEncrypt(params),
  });
  if (res.data) {
    return decrypt(res.data);
  }
  return res;
}

export async function getMemberActive(params: EmptyObjectType) {
  const res: EmptyObjectType = await useApiFetch("/api/user/user-active", {
    method: "POST",
    body: dataEncrypt(params),
  });
  if (res.data) {
    return decrypt(res.data);
  }
  return res;
}

export async function getInvitedLogs(params: EmptyObjectType) {
  const res: EmptyObjectType = await useApiFetch("/api/user/invited-logs", {
    method: "POST",
    body: dataEncrypt(params),
  });
  if (res.data) {
    return decrypt(res.data);
  }
  return res;
}
export async function getHistories(params: EmptyObjectType) {
  const res: EmptyObjectType = await useApiFetch("/api/user/history", {
    method: "POST",
    body: dataEncrypt(params),
  });
  if (res.data) {
    return decrypt(res.data);
  }
  return res;
}

export async function getConfigs(param: string) {
  const res: EmptyObjectType = await useApiFetch("/api/user/user-config", {
    method: "GET",
    params: { names: param },
  });
}
