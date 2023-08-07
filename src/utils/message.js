/**重置message，防止重复点击重复弹出message弹框 */
import {Message} from 'element-ui'; //单独引入Messsage

let messageInstance = null; //定义实例
const resetMessage = (options) => { //定义一个创建实例message 的方法 resetMessage
    if (messageInstance) { //如果实例存在， 就删除实例
        messageInstance.close() 
    }
    messageInstance = Message(options) //重新创建实例
};

//通过type 方法调用实例方法 （四种消息方法）
['error', 'success', 'info', 'warning'].forEach(type => {
    resetMessage[type] = options => {
        if (typeof options === 'string') { //传入 string 字符串
            options = { message: options} //设置消息
        }
        options.type = type //设置类型
        return resetMessage(options)//调用 message
    }
})
export const message = resetMessage //导出resetMessage