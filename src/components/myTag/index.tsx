/**
 * sendTags()：返回选择的tag
 * validateInput()：校验输入的内容是否符合业务要求
 * isCheck:<boolean>: 是否只查看
 * defaultTags:string[]: 默认的标签
 */

import { PlusOutlined } from '@ant-design/icons';
import type { InputRef } from 'antd';
import { Input, Tag } from 'antd';
import { TweenOneGroup } from 'rc-tween-one';
import React, { useEffect, useRef, useState } from 'react';
import './index.scss'

const MyTag = (props:any) => {
  const {sendTags,validateInput,isCheck,defaultTags=[]} = props
  const [tags, setTags] = useState<string[]>(defaultTags);
  const [inputVisible, setInputVisible] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<InputRef>(null);

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, []);

  const handleClose = (removedTag: string) => {
    const newTags = tags.filter(tag => tag !== removedTag);
    console.log(newTags);
    setTags(newTags);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('e.target.value',e.target.value)
    const validateRes = validateInput(e.target.value)
    console.log('validateRes',validateRes)
    validateRes && setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
      if (inputValue && tags.indexOf(inputValue) === -1) {
      setTags([...tags, inputValue]);
    }
    setInputVisible(false);
    setInputValue('');
  };

  const forMap = (tag: string) => {
    const tagElem = (
      <Tag
        closable
        onClose={e => {
          e.preventDefault();
          handleClose(tag);
        }}
      >
        {tag}
      </Tag>
    );
    
    return (
      <span key={tag} style={{ display: 'inline-block' }}>
        {isCheck? <Tag>{tag}</Tag>:tagElem}
      </span>
    );
  };

  // const checkTagsTotal= ()=>{
  //   if(tags.length>5) return Promise.reject('sssssss')
  // }
  const tagChild = tags.map(forMap);

  useEffect(()=>{
    console.log('tags',tags)
    sendTags(tags)
    // checkTagsTotal()
  },[tags])

  return (
    <div className='my-tag' >
      {/* <div className={`my-tag ${disabled?'div-disabled':''}`} ></div> */}
      <div>
        <TweenOneGroup
          enter={{
            scale: 0.8,
            opacity: 0,
            type: 'from',
            duration: 100,
          }}
          onEnd={(e:any) => {
            if (e.type === 'appear' || e.type === 'enter') {
              (e.target as any).style = 'display: inline-block';
            }
          }}
          leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
          appear={false}
        >
          {tagChild}
        </TweenOneGroup>
      </div>
      {!isCheck && inputVisible && (
        <Input
          ref={inputRef}
          type="text"
          size="small"
          style={{ width: 100 }}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
      )}
      {!isCheck && !inputVisible && (
        <Tag onClick={showInput} className="site-tag-plus"  >
          <PlusOutlined/> 新标签
        </Tag>
      )}
    </div>
  );
};

export default MyTag;