import { newArrayProto } from "./array";

class Observer {
  constructor(data) {
    data.__ob__ = this;

    if (Array.isArray(data)) {
      data.__proto__ = newArrayProto;
      this.observeArray(data);
      return;
    }

    this.walk(data);
  }

  walk(data) {
    Object.keys(data).forEach((key) => {
      defineReactive(data, key, data[key]);
    });
  }

  observeArray(data) {
    data.forEach((item) => observe(item));
  }
}

function defineReactive(data, key, val) {
  observe(val);

  Object.defineProperty(data, key, {
    configurable: true,
    enumerable: true,
    get() {
      console.log("---get---");
      return val;
    },

    set(newVal) {
      console.log("---set---");
      if (newVal === val) {
        return;
      }

      val = newVal;
    },
  });
}

export default function observe(data) {
  if (typeof data !== "object" && data !== null) {
    return;
  }

  if (data.__ob__ instanceof Observer) {
    return data.__ob__
  }

  return new Observer(data);
}
