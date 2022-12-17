import { observable, action } from 'mobx';

class StaticStore{
  /* 一些观察的状态 */
  @observable menuTypes = [
    { label: '目录', key: 0 },
    { label: '菜单', key: 1 },
    { label: '操作', key: 2 },
  ]
  @observable tabData = [
    {
      label: '官网',
      key: 'OFFICIAL_WEBSITE'
    },
    {
      label: '移动端',
      key: 'MOBILE_TERMINAL'
    },
    {
      label: '大屏',
      key: 'SCREEN'
    }
  ]

}

export default StaticStore