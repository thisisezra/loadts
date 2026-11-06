(() => {
  const script = document.currentScript;
  const worker = new URL(script.dataset.worker || "ts-sw.js", script.src);
  const scope = script.dataset.scope || new URL("./", worker).pathname;

  const controlled = async () => {
    if (!("serviceWorker" in navigator)) {
      throw new Error("TypeScript loading needs service workers, which require HTTPS or localhost.");
    }
    const registration = await navigator.serviceWorker.register(worker, { scope });
    if (navigator.serviceWorker.controller) return;
    await new Promise((resolve) => {
      navigator.serviceWorker.addEventListener("controllerchange", resolve, { once: true });
      if (registration.active) registration.active.postMessage("ts-loader:claim");
    });
  };

  const run = async () => {
    await controlled();
    for (const node of document.querySelectorAll('script[type="text/typescript"]')) {
      await import(new URL(node.getAttribute("src"), document.baseURI).href);
    }
    document.dispatchEvent(new CustomEvent("typescript:ready"));
  };

  run().catch((error) => {
    console.error(error);
    document.dispatchEvent(new CustomEvent("typescript:error", { detail: error }));
  });
})();
