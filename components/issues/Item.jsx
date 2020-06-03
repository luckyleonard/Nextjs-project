import { useCallback, useState } from 'react';
import { Button, Avatar } from 'antd';
import { getLastUpdated } from '../../utils/timePrettier';
import { Detail as IssueDetail, Label } from '../issues';

function Item({ issue }) {
  const [showDetail, setShowDetail] = useState(false);

  //这个写法可以不依赖showDetail属性，保证优化
  const toggleShowDetail = useCallback(() => {
    setShowDetail((detail) => !detail);
  }, []);

  return (
    <>
      <div className='issue'>
        <Button
          type='primary'
          size='small'
          style={{ position: 'absolute', top: 10, right: 10 }}
          onClick={toggleShowDetail}>
          {showDetail ? 'Hide' : 'Show'}
        </Button>
        <div className='avatar'>
          <Avatar src={issue.user.avatar_url} shape='square' size={50} />
        </div>
        <div className='main-info'>
          <h6>
            <span>{issue.title}</span>
            {issue.labels.map((label) => (
              <Label label={label} key={label.id} />
            ))}
          </h6>
          <p className='sub-info'>
            <span>Updated at {getLastUpdated(issue.updated_at)}</span>
          </p>
        </div>
        <style jsx>{`
          .issue {
            display: flex;
            position: relative;
            padding: 10px;
          }
          .issue:hover {
            background: #eef;
          }
          .issue + .issue {
            border-top: 1px solid #eee;
          }
          .main-info > h6 {
            max-width: 600px;
            font-size: 16px;
            padding-right: 40px;
          }
          .avatar {
            margin-right: 20px;
          }
          .sub-info {
            margin-bottom: 0;
          }
        `}</style>
      </div>
      {showDetail ? <IssueDetail issue={issue} /> : null}
    </>
  );
}

export default Item;
