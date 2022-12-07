const starts = {};
const LIFE_CYCLE_LIST = ["beforeCreat", "created"];
LIFE_CYCLE_LIST.forEach((hook) => {
  starts[hook] = function (p, c) {
    if (c) {
      if (p) {
        return p.concat(c);
      } else {
        return [c];
      }
    } else {
      return p;
    }
  };
});

export function mergeOptions(parent, child) {
  const options = {};

  for (let key in parent) {
    mergeKey(key);
  }

  for (let key in child) {
    if (!options.hasOwnProperty(key)) {
      mergeKey(key);
    }
  }

  function mergeKey(key) {
    if (starts[key]) {
      options[key] = starts[key](parent[key], child[key]);
    } else {
      options[key] = child[key] || parent[key];
    }
  }

  return options;
}
