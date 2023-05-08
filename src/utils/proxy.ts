const createHandler = <G>(onChange: (newState: G) => void) => {
  const handler: ProxyHandler<any> = {
    get(target: any, key: string) {
      if (typeof target[key] === 'object' && target[key] !== null) {
        return new Proxy(target[key], handler);
      }
      return target[key];
    },
    set(target, prop, value) {
      target[prop] = value;

      onChange(target);

      return target;
    },
  };

  return handler;
};

export const createWatchedProxy = <G>(initialState: G, onChange: (newState: G) => void) =>
  new Proxy(initialState, createHandler(onChange));
