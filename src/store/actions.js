/**
 * @Author: jzy
 * @Date: 2017/9/19
 * @Last Modified by: jzy
 * @Last Modified time: 2017/9/19
 */
import * as types from './types'

const actions = {
    createPersonalInfo ({commit}, params){
        commit({
            type: types.PERSONAL,
            info: params
        })
    }
}

export default actions