import App from 'next/app';
import Router from 'next/router';
import 'antd/dist/antd.css';
import { Provider } from 'react-redux';
import withRedux from '../utils/with-redux';
import PageLayout from '../components/Layout';
import PageLoading from '../components/PageLoading';
import Link from 'next/link';

class MyApp extends App {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    }; //loading覆盖所有app下的页面
  }

  startLoading = () => {
    this.setState({
      loading: true,
    });
  };

  stopLoading = () => {
    this.setState({
      loading: false,
    });
  };

  componentDidMount() {
    Router.events.on('routeChangeStart', this.startLoading);
    Router.events.on('routeChangeComplete', this.stopLoading);
    Router.events.on('routeChangeError', this.stopLoading);
  }

  componentWillUnmount() {
    Router.events.off('routeChangeStart', this.startLoading);
    Router.events.off('routeChangeComplete', this.stopLoading);
    Router.events.off('routeChangeError', this.stopLoading);
  }

  //方法每次页面切换都会被执行,这个方法是重写了给pages页面组件使用的, 但会强制每个页面都服务器端渲染
  static async getInitialProps(ctx) {
    const { Component } = ctx;
    let pageProps = {};
    // 自义定app后,如果页面有用到getInitialProps,则需要手动从这里传过去
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
    return { pageProps };
  }
  //重写App的render方法
  render() {
    const { Component, pageProps, reduxStore } = this.props;
    console.log(this.state.loading);
    //Component指代的就是pages文件夹下被渲染的页面组件
    return (
      <Provider store={reduxStore}>
        {this.state.loading ? <PageLoading /> : null}
        <PageLayout>
          <Link href='/detail'>
            <a> detail </a>
          </Link>
          <Component {...pageProps} />
        </PageLayout>
      </Provider>
    );
  }
}

export default withRedux(MyApp);
