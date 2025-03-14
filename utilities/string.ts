export const trimStr = (str: string, n: number) => {
  if (str.replace(/[\u4e00-\u9fa5]/g, '**').length <= n) {
    return str;
  } else {
    let len = 0;
    let tmpStr = '';
    for (let i = 0; i < str.length; i++) {
      if (/[\u4e00-\u9fa5]/.test(str[i])) {
        len += 2;
      } else {
        len += 1;
      }
      if (len > n) {
        break;
      } else {
        tmpStr += str[i];
      }
    }
    return tmpStr.trim() + '...';
  }
};

export const sanitizeStr = (str: string) => {
  const strippedStr = str.replace(
    /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
    '',
  );

  return strippedStr.replace(
    /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007f-\u0084\u0086-\u009f\uD800-\uDFFF\uFDD0-\uFDFF\uFFFF\uC008]/g,
    '',
  );
};
