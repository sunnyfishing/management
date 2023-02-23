import { observable, action } from 'mobx';

class StaticStore{
  /* 一些观察的状态 */
  // @observable menuTypes = [
  //   { label: '目录', key: 0 },
  //   { label: '菜单', key: 1 },
  //   { label: '操作', key: 2 },
  // ]
  @observable menuTypes = {
    'CATALOGUE':{label:'目录',key:0},
    'MENU':{label:'菜单',key:1},
    'OPERATION':{label:'操作',key:2}
  }
  @observable tabData = [
    {
      label: '官网',
      key: 'OFFICIAL_WEBSITE'
    },
    // {
    //   label: '移动端',
    //   key: 'MOBILE_TERMINAL'
    // },
    // {
    //   label: '大屏',
    //   key: 'SCREEN'
    // }
  ]
  @observable sourceList = [
    {
      label: '后台添加',
      value: 'ADMIN_WEBSITE'
    },
    {
      label: '官网注册',
      value: 'OFFICIAL_WEBSITE'
    },
    // {
    //   label: '移动端注册',
    //   key: 'MOBILE_TERMINAL'
    // },
    // {
    //   label: '大屏',
    //   key: 'SCREEN'
    // }
  ]

  // 根据value获取sourceList的label
  @action getSourceItem = (value) => {
    let label = ''
    this.sourceList.forEach((item)=>{
      if(value === item.value){
        label = item.label
      }
    })
    return label
  }


}

export default StaticStore