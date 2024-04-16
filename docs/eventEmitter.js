export class EventEmitter {
    #subscribers = {
        //eventName: [callback1, callback2, callback3, ...]
    }
    // три варианта принятых названий для подписки на событие (реализуем 3й, остальные повторяем)
    addEventListener(eventName, callback) {
        this.subscribe(eventName, callback)
    }
    on(eventName, callback) {
        this.subscribe(eventName, callback)
    }
    subscribe(eventName, callback) {
        if(!this.#subscribers[eventName]){
            this.#subscribers[eventName] = []
        }
        this.#subscribers[eventName].push(callback)
        // для удаления выполненных колбэков из подписки на событие
        return () => {
            this.#subscribers[eventName] = this.#subscribers[eventName].filter(cb => callback !== cb)
        }
    }
    // сработка события - выполняем накопленные колбэки
    emit (eventName, data = null) {
        this.#subscribers[eventName]?.forEach(cb => cb(data))
    }
    // для отписки от ненужного колбэка
    off (eventName, callback) {
        this.#subscribers[eventName] = this.#subscribers[eventName].filter(cb => callback !== cb)
    }
}