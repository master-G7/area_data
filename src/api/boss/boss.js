import { post} from '../axios.config'
export default{
    getHistoryData(parmas){
        return post('boss/getHistoryData',parmas)
    },
    getTodayData(parmas){
        return post('boss/getTodayData',parmas)
    },
    getMatchAreaInfo (parmas){
        return post('boss/getMatchAreaInfo',parmas)
    },
    // 登录接口
    login(parmas){
        return post('boss/login_action',parmas)
    },
    changePassWord(parmas){
        return post('boss/change_password',parmas)
    },
    setMatchAreaInfo(parmas){
        return post('boss/setMatchAreaInfo',parmas)
    },
    //防抖
    debounce(fun, delay = 500,immediate = true) {
        let timer = null //保存定时器
        return function (args) {
            let that = this
            let _args = args
            if (timer) clearTimeout(timer);  //不管是否立即执行都需要首先清空定时器
            if (immediate) {
                if ( !timer) fun.apply(that, _args)  //如果定时器不存在,则说明延时已过,可以立即执行函数
                //不管上一个延时是否完成,都需要重置定时器
                timer = setTimeout(function(){
                    timer = null; //到时间后,定时器自动设为null,不仅方便判断定时器状态还能避免内存泄露
                }, delay)
            }
            else {
            //如果是非立即执行版,则重新设定定时器,并将回调函数放入其中
                timer = setTimeout(function(){
                    fun.call(that, _args)
                }, delay);
            }
        }
    }
}