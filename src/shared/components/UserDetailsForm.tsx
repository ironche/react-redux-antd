import { Button, Space, Form, Input } from 'antd';
import { useState, useLayoutEffect } from 'react';
import { User } from 'app/api';
import { CustomInputField } from './CustomInputField';

interface UserDetailsFormProps {
  user: User;
  onEdit: (values: User) => void;
}

export function UserDetailsForm(props: UserDetailsFormProps) {
  const [form] = Form.useForm<User>();
  const [disableSubmit, setDisableSubmit] = useState(true);
  const [disableReset, setDisableReset] = useState(true);

  useLayoutEffect(() => {
    form.setFieldsValue(props.user);
  }, [form, props.user]);

  function onFormValuesChange(): void {
    const userStr = JSON.stringify(props.user);

    form.validateFields()
      .then((formValues) => {
        setDisableSubmit(
          JSON.stringify(formValues) === userStr
        );
      })
      .catch((reason) => {
        setDisableSubmit(
          reason.errorFields?.length > 0 ||
          JSON.stringify(reason.values) === userStr
        );
      });

    setDisableReset(
      JSON.stringify(form.getFieldsValue()) === userStr
    );
  }

  function onFormReset(): void {
    props.user
      ? form.setFieldsValue(props.user)
      : form.resetFields();

    setDisableSubmit(true);
    setDisableReset(true);
  }

  function onFormSubmit(values: User) {
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
      <CustomInputField data="name" label />

      {['username', 'email'].map((data) => (
        <CustomInputField key={data} data={data} label required />
      ))}

      <Form.Item label="Address">
        <Input.Group compact>
          {['address.street', 'address.suite', 'address.city'].map((data) => (
            <CustomInputField key={data} data={data.split('.')} required />
          ))}
          {['address.zipcode', 'address.geo.lat', 'address.geo.lng'].map((data) => (
            <CustomInputField key={data} data={data.split('.')} />
          ))}
        </Input.Group>
      </Form.Item>

      {['phone', 'website'].map((data) => (
        <CustomInputField key={data} data={data} label />
      ))}

      <Form.Item label="Company">
        <Input.Group compact>
          {['company.name', 'company.catchPhrase', 'company.bs'].map((data) => (
            <CustomInputField key={data} data={data.split('.')} />
          ))}
        </Input.Group>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 4, span: 20 }}>
        <Space>
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
