const HELPERS = {
  TrailingDot: function (value: string, maxLen: number) {
    if (value.length > maxLen) {
      return value.substring(0, maxLen) + "...";
    }
    return value;
  },
  ConvertToRadians: function (val: number) {
    return (Math.PI * val) / 180;
  },
  ConvertBase64ToBlob: function (
    base64Uri: string,
    contentType = "",
    sliceSize = 512
  ) {
    const byteCharacters = atob(
      base64Uri.replace(/^data:image\/(png|jpg);base64,/, "")
    );
    console.log(base64Uri);
    console.log(byteCharacters);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    console.log(byteArrays);

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  },
};

export default HELPERS;
