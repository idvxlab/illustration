import React, { forwardRef, useImperativeHandle } from 'react';
import { Form, InputNumber } from 'antd';
import { FormComponentProps } from 'antd/es/form';

interface Props extends FormComponentProps {

}

const ParamForm = forwardRef<FormComponentProps, Props>(({ form }, ref) => {
  useImperativeHandle(ref, () => ({ form }));
  const { getFieldDecorator } = form;
  return (
    <div style={{ width: 200, display: 'inline-block', marginLeft: 24 }}>
      <Form layout='vertical' labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} >
        <Form.Item label="x" >{getFieldDecorator('x')(<InputNumber />)}</Form.Item>
        <Form.Item label="y" >{getFieldDecorator('y')(<InputNumber />)}</Form.Item>
        <Form.Item label="originX" >{getFieldDecorator('originX')(<InputNumber />)}</Form.Item>
        <Form.Item label="originY" >{getFieldDecorator('originY')(<InputNumber />)}</Form.Item>
        <Form.Item label="scaleX" >{getFieldDecorator('scaleX')(<InputNumber />)}</Form.Item>
        <Form.Item label="scaleY" >{getFieldDecorator('scaleY')(<InputNumber />)}</Form.Item>
        <Form.Item label="rotate" >{getFieldDecorator('rotate')(<InputNumber />)}</Form.Item>
        <Form.Item label="opacity" >{getFieldDecorator('opacity')(<InputNumber />)}</Form.Item>
      </Form>
    </div>
  )
})

export default Form.create<Props>()(ParamForm);
