import { Breadcrumb } from 'antd';
import React, { useEffect, useState } from 'react';
import { menus } from '../utils/menu'
import './index.scss'

interface Props {
  keyPath: string[]
}

const breadcrumb: React.FC = (props: Props) => {
  const [labelPath, setLabelPath] = useState([])
  let { keyPath } = props
  // keyPath.reverse()
  console.log('keyPath',keyPath)

  useEffect(() => {
    let labelPath: string[] = []
    for (let index in menus) {
      if (menus[index].key === keyPath[0]) {
        labelPath.push(menus[index].label)
        for (let index2 in menus[index].children) {
          if (menus[index].children[index2].key === keyPath[1]) {
            labelPath.push(menus[index].children[index2].label)
            break
          }
        }
        break
      }
    }
    setLabelPath(labelPath)
  }, [keyPath])

  return (
    <Breadcrumb className='bread-crumb'>
      {labelPath.map((item, index) => {
        return <Breadcrumb.Item key={index}>{item}</Breadcrumb.Item>
      })
      }
    </Breadcrumb>
  )
};

export default breadcrumb;