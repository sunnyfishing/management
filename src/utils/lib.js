
export const validatorTel = (val) => {
  return /^(13[0-9]|14[01456879]|15[0-9]|16[2567]|17[0-8]|18[0-9]|19[0-9])\d{8}$/.test(
    val
  );
}
export const validatorEmail=(email) => {
  return /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(
    email
  );
}

// 页面跳转,不带历史记录
export const replaceUrl = (pathname) => {
  const localPath = `${window.location.origin}/#${pathname}`
  window.location.replace(localPath)
};