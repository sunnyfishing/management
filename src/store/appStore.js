import { observable, action } from 'mobx';

class AppStore{
  /* 一些观察的状态 */
  @observable isLogin = false
  @observable loginObj = {}

   /* 推导值 */
  @action setLoginObj = (item)=>{
    this.loginObj = item
  }
}

export default AppStore