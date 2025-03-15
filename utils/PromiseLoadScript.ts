interface ScriptLoadOptions {
  url: string;
  name: string;
  version: string;
  noCache?: boolean;
}

const PromiseLoadScript = (obj: ScriptLoadOptions): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    if (window[obj.name as keyof Window]) {
      resolve(true);
      return;
    }

    if (obj.noCache) {
      obj.url += `?t=${new Date().valueOf()}`;
    }

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = obj.url;
    script.setAttribute("data-name", obj.name); // ✅ Correct way to add custom attributes
    script.setAttribute("data-version", obj.version); // ✅ Fix for version
    script.async = true;

    script.onload = () => resolve(true);
    script.onerror = () => reject(false);

    document.body.appendChild(script);
  });
};

export default PromiseLoadScript;
