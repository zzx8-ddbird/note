(function() {
    function reactive(obj) {
        if(typeof obj === 'string') {
            return stringToProxy(new String(obj));
        }
    }
    function stringToProxy(targetObj) {
        return new Proxy(targetObj, {
            set(target, prop, value, receiver) {
                console.log(`设置了新值 ${prop}:${value}`);
                return Reflect.set(target, prop, value, receiver)
            },
            get(target, prop, receiver) {
                console.log(`获取值 ${prop};${target[prop]}`)
                return Reflect.get(target, prop, receiver);
            }
        })
    }
    const newStr = reactive('str')
    console.log(newStr)
    Reflect.set(newStr, 0, 't');
    console.log(newStr[0]);
}()) 