import dynamic from 'next/dynamic';
import withRepoHeader from '../../components/withRepoHeader';
import { api_request } from '../../utils/apiHelper';

const MarkdownRenderer = dynamic(
  () => import('../../components/MarkdownRender'),
  {
    loading: () => {
      <p>Loading</p>;
    },
  }
);

function Detail({ readme }) {
  if (!readme) {
    return <div>Can't find Readme file</div>;
  }
  return <MarkdownRenderer content={readme.content} isBase64={true} />;
}

Detail.getInitialProps = async ({
  ctx: {
    query: { owner, name },
    req,
    res,
  },
}) => {
  try {
    const readme = await api_request(
      {
        url: `/repos/${owner}/${name}/readme`,
      },
      req,
      res
    );
    return {
      readme: readme.data,
    };
  } catch (err) {
    console.log(err);
  }
};
export default withRepoHeader(Detail, 'index');
