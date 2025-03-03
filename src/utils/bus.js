class EventBus {
    constructor() {
        this.events = new Map();
    }

    // 订阅事件
    on(eventName, callback) {
        if (!this.events.has(eventName)) {
            this.events.set(eventName, []);
        }
        this.events.get(eventName).push(callback);
    }

    // 取消订阅
    off(eventName, callback) {
        if (!this.events.has(eventName)) return;
        if (!callback) {
            this.events.delete(eventName);
            return;
        }
        const callbacks = this.events.get(eventName);
        const index = callbacks.indexOf(callback);
        if (index !== -1) {
            callbacks.splice(index, 1);
        }
        if (callbacks.length === 0) {
            this.events.delete(eventName);
        }
    }

    // 触发事件
    emit(eventName, data) {
        if (!this.events.has(eventName)) return;
        this.events.get(eventName).forEach(callback => {
            callback(data);
        });
    }

    // 只订阅一次
    once(eventName, callback) {
        const wrapper = (data) => {
            callback(data);
            this.off(eventName, wrapper);
        };
        this.on(eventName, wrapper);
    }
}

// 创建单例
const bus = new EventBus();
export default bus;