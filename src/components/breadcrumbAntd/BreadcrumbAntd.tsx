import { Breadcrumb } from 'antd';
import React, { useEffect, useState } from 'react';
import { menus } from '../../utils/menu'
import './index.scss'

interface Props {
  keyPath: string[]
}

const breadcrumb: React.FC = (props: Props) => {
  const [labelPath, setLabelPath] = useState([])
  const [path, setPath] = useState([])
  
  let keyPathHash:string = location.hash || ''
  useEffect(() => {
    let labelPath1: string[] = []
    let path1: string[] = []
    let keyPath:string[] = keyPathHash?.split('/')?.slice(1)
    for (let index in menus) {
      if (menus[index].key === keyPath[0]) {
        labelPath1.push(menus[index].label)
        path1.push(menus[index].key)
        for (let index2 in menus[index].children) {
          if (menus[index].children[index2].key === keyPath[1]) {
            labelPath1.push(menus[index].children[index2].label)
            path1.push(menus[index].children[index2].key)
            for (let index3 in menus[index].children[index2].children) {
              if (menus[index].children[index2].children[index3].key === keyPath[2]) {
                labelPath1.push(menus[index].children[index2].children[index3].label)
                path1.push(menus[index].children[index2].children[index3].key)
                break
              }
            }
            break
          }
        }
        break
      }
    }
    setLabelPath(labelPath1)
    setPath(path1)
  }, [keyPathHash])

  return (
    <Breadcrumb className='bread-crumb'>
      {labelPath.map((item, index) => {
        return <Breadcrumb.Item key={index}>
          {index === 0?item:<a href={`/#/${path.slice(0,index+1).join('/')}`}>{item}</a>}  
        </Breadcrumb.Item>
      })
      }
    </Breadcrumb>
  )
};

export default breadcrumb;