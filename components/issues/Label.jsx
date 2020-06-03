function Label({ label }) {
  return (
    <>
      <div className='label' style={{ backgroundColor: `#${label.color}` }}>
        {label.name}
      </div>
      <style jsx>{`
        .label {
          display: inline-block;
          line-height: 20px;
          margin-left: 15px;
          padding: 3px;
          border-radius: 3px;
          font-size: 14px;
        }
      `}</style>
    </>
  );
}
//用来在单个issue内部展示其label
export default Label;
