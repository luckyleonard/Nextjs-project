import Link from 'next/link';
import { StarFilled } from '@ant-design/icons';
import moment from 'moment';

function getLicense(license) {
  return license ? `${license.spdx_id} license` : '';
}

function getLastUpdated(time) {
  return moment(time).fromNow();
}

function Repo({ repo }) {
  return (
    <div className='root'>
      <div className='basic-info'>
        <h3 className='repo-title'>
          <a>{repo.full_name}</a>
        </h3>
        <p className='repo-desc'>{repo.description}</p>
        <p className='other-info'>
          {repo.license ? (
            <span className='license'>{getLicense(repo.license)}</span>
          ) : null}
          <span className='last-updated'>
            {getLastUpdated(repo.updated_at)}
          </span>
          <span className='open-issues'>
            {repo.open_issues_count} open issues
          </span>
        </p>
      </div>
      <div className='lang-star'>
        <span className='lang'>{repo.language}</span>
        <span className='stars'>
          {repo.stargazers_count} <StarFilled spin={true} />
        </span>
      </div>
      <style jsx>{`
        .root {
          display: flex;
          justify-content: space-between;
        }
        .root + .root {
          border-top: 1px solid #eee;
          padding-top: 20px;
        } //root的所有叫root的兄弟节点
        .other-info > span + span {
          margin-left: 10px;
        }
        .repo-title {
          font-size: 20px;
        }
        .repo-desc {
          witdh: 400px;
        }
        .lang-star {
          display: flex;
        }
        .lang-star > span {
          width: 120px;
          text-align: center;
        }
      `}</style>
    </div>
  );
}

export default Repo;