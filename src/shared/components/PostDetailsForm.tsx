import { Button, Space, Form, Input } from 'antd';
import { useState, useLayoutEffect } from 'react';
import { Post } from 'app/api';
import { CustomInputField } from './CustomInputField';

interface PostDetailsFormProps {
  post: Post;
  onEdit: (values: Post) => void;
  onCancel?: () => void;
}

export function PostDetailsForm(props: PostDetailsFormProps) {
  const [form] = Form.useForm<Post>();
  const [disableSubmit, setDisableSubmit] = useState(true);
  const [disableReset, setDisableReset] = useState(true);

  useLayoutEffect(() => {
    form.setFieldsValue(props.post);
  }, [form, props.post]);

  function onFormValuesChange(): void {
    const postStr = JSON.stringify(props.post);

    form.validateFields()
      .then((formValues) => {
        setDisableSubmit(
          JSON.stringify(formValues) === postStr
        );
      })
      .catch((reason) => {
        setDisableSubmit(
          reason.errorFields?.length > 0 ||
          JSON.stringify(reason.values) === postStr
        );
      });

    setDisableReset(
      JSON.stringify(form.getFieldsValue()) === postStr
    );
  }

  function onFormReset(): void {
    props.post
      ? form.setFieldsValue(props.post)
      : form.resetFields();

    setDisableSubmit(true);
    setDisableReset(true);
  }

  function onFormSubmit(values: Post) {
    props.onEdit(values);
    setDisableSubmit(true);
    setDisableReset(true);
  }

  return (
    <Form
      form={form}
      labelCol={{ span: 4 }}
      labelAlign="left"
      wrapperCol={{ span: 20 }}
      onFinish={onFormSubmit}
      onValuesChange={onFormValuesChange}
      autoComplete="off"
    >
      <Form.Item name="id" hidden>
        <Input />
      </Form.Item>
      <Form.Item name="userId" hidden>
        <Input />
      </Form.Item>

      {['title', 'body'].map((data) => (
        <CustomInputField key={data} data={data} label required />
      ))}

      <Form.Item wrapperCol={props.onCancel ? { offset: 12, span: 24 } : { offset: 4, span: 20 }}>
        <Space align='end'>
          {props.onCancel && (
            <Button
              onClick={() => props.onCancel?.()}
            >
              Cancel
            </Button>
          )}
          <Button
            onClick={onFormReset}
            disabled={disableReset}
          >
            Reset
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            disabled={disableSubmit}
          >
            Submit
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}
