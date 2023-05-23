import { useResponsive } from 'antd-style';
import isEqual from 'fast-deep-equal';
import { memo, type FC } from 'react';
import { Center, Flexbox } from 'react-layout-kit';

import Content from '@/slots/Content';
import Footer from '@/slots/Footer';
import Header from '@/slots/Header';
import Sidebar from '@/slots/Sidebar';
import Toc from '@/slots/Toc';
import { Helmet, useOutlet } from 'dumi';
// @ts-ignore
import ApiHeader from '@/slots/ApiHeader';

import { isApiPageSel, siteTitleSel, tocAnchorItemSel, useSiteStore } from '@/store';
import { useStyles } from './styles';

const Docs: FC = memo(() => {
  const outlet = useOutlet();
  const { mobile, laptop } = useResponsive();
  const fm = useSiteStore((s) => s.routeMeta.frontmatter, isEqual);
  const isApiPage = useSiteStore(isApiPageSel);
  const siteTitle = useSiteStore(siteTitleSel);

  const noToc = useSiteStore((s) => tocAnchorItemSel(s).length === 0);
  const hideSidebar = fm.sidebar === false;
  const hideToc = fm.toc === false || noToc;

  const { styles, theme } = useStyles({ hideToc, hideSidebar });
  const helmetBlock = (
    <Helmet>
      {fm.title && (
        <title>
          {fm.title} - {siteTitle}
        </title>
      )}
    </Helmet>
  );

  const docBlock = (
    <div style={laptop ? { marginRight: 280 } : {}}>
      {isApiPage ? (
        <Flexbox style={{ gridArea: 'title', paddingBlock: mobile ? 24 : undefined }}>
          <Center>
            <Flexbox style={{ maxWidth: theme.contentMaxWidth, width: '100%' }}>
              <Flexbox style={{ paddingBlock: 0, paddingInline: mobile ? 16 : 48 }}>
                <ApiHeader />
              </Flexbox>
            </Flexbox>
          </Center>
        </Flexbox>
      ) : null}
      <Flexbox
        style={{
          zIndex: 10,
          margin: mobile ? 0 : 24,
          marginBottom: mobile ? 0 : 48,
        }}
      >
        <Center width={'100%'}>
          <Flexbox className={styles.content}>
            <Flexbox horizontal>
              <Content>{outlet}</Content>
            </Flexbox>
          </Flexbox>
        </Center>
      </Flexbox>
    </div>
  );

  return (
    <>
      {helmetBlock}
      <div className={styles.layout}>
        <Header />
        <div className={styles.view}>
          {mobile || hideSidebar ? null : <Sidebar />}
          {hideToc ? null : laptop ? <Toc /> : null}
          <div className={styles.right}>
            <div className={styles.spacing} />
            {docBlock}
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
});

export default Docs;
