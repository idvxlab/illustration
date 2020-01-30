import React, { useRef } from 'react';
import { parseSvg } from '../utils';

const UploadSvg: React.FC = () => {
  let canvas = useRef<HTMLDivElement>(null);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    var fileList = e.target.files;
    if (fileList && fileList[0]) {
      parseSvg(fileList[0], canvas.current!)
    }
  }

  return (
    <div>
      <p>点击上传，解析 svg 文件并显示在下面</p>
      <input type='file' accept='.svg' onChange={handleChange} />
      <div ref={canvas}></div>
    </div>
  )
}

export default UploadSvg;