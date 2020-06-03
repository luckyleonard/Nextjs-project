import { useState, useCallback, useRef } from 'react';
import { Select, Spin } from 'antd';
import debounce from 'lodash/debounce';
import { api_request } from '../../utils/apiHelper';

const { Option } = Select;

function SearchUser({ onChange, value }) {
  //lastFetchIdRef.current 用来避免请求过程返回结果前，发送二次请求.导致展示结果闪烁.相当于固定计数器
  const lastFetchIdRef = useRef(0);

  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState([]);

  const fetchUser = useCallback(
    debounce((value) => {
      lastFetchIdRef.current += 1; //每次请求+1
      const fetchId = lastFetchIdRef.current; //fetchId只记录这次的current值

      setFetching(true);
      setOptions([]);

      if (!value) {
        setFetching(false);
        return;
      }
      //只在客户端发请求，不用ctx,使用search-user接口
      api_request({
        url: `/search/users?q=${value}`,
      }).then((resp) => {
        if (fetchId !== lastFetchIdRef.current) {
          //如果又发送了一次请求的时候current的值已经不等于第一次请求时记录的fetchId，这时第一次请求就直接抛弃了
          return;
        }
        const data = resp.data.items.map((user) => ({
          text: user.login,
          value: user.login,
        }));

        setFetching(false);
        setOptions(data);
      });
    }, 500),
    []
  );

  const handleChange = (value) => {
    setOptions([]);
    setFetching(false);
    onChange(value);
  }; //处理Select选择事件

  return (
    <Select
      style={{ width: 200 }}
      showSearch={true}
      notFoundContent={
        fetching ? <Spin size='small' /> : <span>No content</span>
      }
      filterOption={false}
      placeholder='Creator'
      allowClear={true}
      value={value}
      onSearch={fetchUser}
      onChange={handleChange}>
      {options.map((option) => (
        <Option value={option.value} key={option.value}>
          {option.text}
        </Option>
      ))}
    </Select>
  );
}

export default SearchUser;
