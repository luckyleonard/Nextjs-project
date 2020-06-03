import dynamic from 'next/dynamic';
import { Button } from 'antd';

const MDRenderer = dynamic(() => import('../../components/MarkdownRender'), {
  loading: () => <p>Loading</p>,
}); //用来处理issuedetail

function Detail({ issue }) {
  return (
    <div className='root'>
      <MDRenderer content={issue.body} />
      <div className='actions'>
        <Button href={issue.html_url} target='_blank'>
          Discussion Form
        </Button>
      </div>
      <style jsx>{`
        .root {
          background: #fafafa;
          padding: 20px;
        }
        .actions {
          text-align: right;
        }
      `}</style>
    </div>
  );
}

export default Detail;
