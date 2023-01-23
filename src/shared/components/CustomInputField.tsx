import { Form, Input } from 'antd';

interface CompositeFieldProps {
  data: string | string[];
  label?: boolean;
  required?: boolean;
}

export function CustomInputField({ data, label, required }: CompositeFieldProps) {
  const keys = toArray(data);
  const lastKey = keys.at(-1);
  return (
    <Form.Item
      name={keys}
      {...Object.assign({}, label
        ? { label: capitalise(lastKey) }
        : { noStyle: true }
      )}
      rules={
        required
          ? [{ required: true, message: `Please input ${lastKey}` }]
          : []
      }
    >
      <Input placeholder={`${lastKey}`} />
    </Form.Item>
  );
}

function toArray<T>(data: T | T[]): T[] {
  return Array.isArray(data) ? data : [data];
}

function capitalise(data: string = ''): string {
  return data.length ? data.at(0)?.toUpperCase() + data.slice(1) : '';
}
