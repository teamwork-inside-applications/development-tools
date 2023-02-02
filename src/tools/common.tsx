
export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise(resolve => {
    let r = new FileReader();
    r.onload = function (e: any) {
      resolve(e.target.result);
    }
    r.readAsDataURL(blob);
  })
}