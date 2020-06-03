import { useState, useCallback, useEffect } from 'react';
import { Button, Select, Spin } from 'antd';

import withRepoHeader from '../../components/withRepoHeader';
import { SearchUser, Item as IssueItem } from '../../components/issues';
import { api_request } from '../../utils/apiHelper';

const { Option } = Select;
const LABEL_CACHE = {}; //用来缓存在请求issues时同时返回的labels，避免二次请求
const isServer = typeof window === 'undefined';

function makeQuery(creator, issueState, labels) {
  let creatorStr = creator ? `creator=${creator}` : '';
  let issueStateStr = issueState ? `state=${issueState}` : '';
  let labelStr = '';
  if (labels && labels.length) {
    labelStr = `labels=${labels.join(',')}`;
  }

  const strArr = [];

  creatorStr && strArr.push(creatorStr);
  issueStateStr && strArr.push(issueStateStr);
  labelStr && strArr.push(labelStr);

  return `?${strArr.join('&')}`;
}

function Issues({ initialIssues, initialLabels, owner, name }) {
  const [creator, setCreator] = useState('');
  const [issueState, setIssueState] = useState('');
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [issues, setIssues] = useState(initialIssues);
  const [fetching, setFetching] = useState(false);

  //缓存从请求中来的label请求结果
  useEffect(() => {
    !isServer && (LABEL_CACHE[`${owner}${name}`] = initialLabels);
  }, [owner, name, initialLabels]);

  const handleCreatorChange = useCallback((value) => {
    setCreator(value);
  }, []);

  const handleIssueStateChange = useCallback((value) => {
    setIssueState(value);
  }, []);

  const handleSelectedLabelsChange = useCallback((value) => {
    setSelectedLabels(value);
  }, []);

  const handleSearch = useCallback(() => {
    setFetching(true);
    api_request({
      url: `/repos/${owner}/${name}/issues${makeQuery(
        creator,
        issueState,
        selectedLabels
      )}`,
    })
      .then((resp) => setIssues(resp.data))
      .catch((err) => console.log(err))
      .finally(() => {
        setFetching(false);
      });
  }, [owner, name, creator, issueState, selectedLabels]);

  return (
    <div className='root'>
      <div className='search'>
        <SearchUser onChange={handleCreatorChange} value={creator} />
        <Select
          placeholder='Issue State'
          onChange={handleIssueStateChange}
          value={issueState}
          style={{ width: 200, marginLeft: 20 }}>
          <Option value='all'>All</Option>
          <Option value='open'>Open</Option>
          <Option value='closed'>Closed</Option>
        </Select>
        <Select
          mode='multiple'
          placeholder='Labels'
          onChange={handleSelectedLabelsChange}
          value={selectedLabels}
          style={{ flexGrow: 1, marginLeft: 20, marginRight: 20 }}>
          {initialLabels.map((label) => (
            <Option value={label.name} key={label.id}>
              {label.name}
            </Option>
          ))}
        </Select>
        <Button type='primary' onClick={handleSearch} disabled={fetching}>
          Search
        </Button>
      </div>
      {fetching ? (
        <div className='loading'>
          <Spin />
        </div>
      ) : (
        <div className='issues'>
          {issues.map((issue) => {
            return <IssueItem issue={issue} key={issue.id} />;
          })}
        </div>
      )}
      <style jsx>{`
        .search {
          display: flex;
        }
        .loading {
          height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .issues {
          border: 1px solid #eee;
          border-radius: 5px;
          margin: 20px 0;
        }
      `}</style>
    </div>
  );
}

Issues.getInitialProps = async ({ ctx }) => {
  const { owner, name } = ctx.query;
  const full_name = `${owner}${name}`;

  const fetches = await Promise.all([
    await api_request(
      {
        url: `/repos/${owner}/${name}/issues`,
      },
      ctx.req,
      ctx.res
    ),
    LABEL_CACHE[full_name]
      ? Promise.resolve({ data: LABEL_CACHE[full_name] })
      : await api_request(
          {
            url: `/repos/${owner}/${name}/labels`,
          },
          ctx.req,
          ctx.res
        ),
  ]);

  const [IssuesResp, LabelsResp] = fetches;

  return {
    owner,
    name,
    initialIssues: IssuesResp.data,
    initialLabels: LabelsResp.data,
  };
};

export default withRepoHeader(Issues, 'issues');
