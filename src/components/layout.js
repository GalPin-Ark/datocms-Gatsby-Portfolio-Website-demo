/* eslint-disable jsx-a11y/anchor-has-content, jsx-a11y/anchor-is-valid*/

import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "gatsby";
import { StaticQuery, graphql } from "gatsby";
import { HelmetDatoCms } from "gatsby-source-datocms";
import { IntlProvider, addLocaleData, FormattedMessage } from "react-intl";
import en from "react-intl/locale-data/en";
import es from "react-intl/locale-data/es";
import esMessages from "../locales/es.js";
import enMessages from "../locales/en.js";
import "../styles/index.sass";

addLocaleData([...es, ...en]);

const messages = {
  es: esMessages,
  en: enMessages
};
const locales = ["en", "es"];
class TemplateWrapper extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      is_open: false
    };
  }

  renderNav(prefix) {
    return (
      <ul className="sidebar__menu">
        <li>
          <Link to={`${prefix}/`} onClick={() => this.toggleSidebar()}>
            <FormattedMessage id={"menu.home"} />
          </Link>
        </li>
        <li>
          <Link to={`${prefix}/about`} onClick={() => this.toggleSidebar()}>
            <FormattedMessage id={"menu.about"} />
          </Link>
        </li>
      </ul>
    );
  }

  toggleSidebar() {
    this.setState({ is_open: !this.state.is_open });
  }
  closeSidebar() {
    this.setState({ is_open: false });
  }

  renderLang(locale) {
    let list = locales.filter(l => l != locale);
    return (
      <div className="sidebar__langs">
        <span className="sidebar__langs__item" key="current">
          <FormattedMessage id={`lang_${locale}`} />
        </span>
        {list.map(l => (
          <span className="sidebar__langs__item" key={l}>
            <Link
              to={`${l == "en" ? "" : l}/`}
              onClick={() => this.toggleSidebar()}
            >
              <FormattedMessage id={`lang_${l}`} />
            </Link>
          </span>
        ))}
      </div>
    );
  }
  render() {
    //const locale = this.props.location.pathname.startsWith("/it") ? "it" : "en";
    let path_splits = this.props.location.pathname.split("/");
    let locale = "en";
    let incipit = path_splits[1];
    if (locales.indexOf(incipit) > -1) {
      locale = incipit;
    }
    let prefix = locale === "en" ? "" : locale;
    let { children, data } = this.props;
    let socials = data.allDatoCmsSocialProfile.edges.reduce((uniq, s) => {
      let k = `${s.node.profileType}|${s.node.url}`;
      if (uniq.indexOf(k) < 0) uniq.push(k);
      return uniq;
    }, []);
    let cn = this.state.is_open ? "container is-open" : "container";
    return (
      <IntlProvider locale={locale} messages={messages[locale]}>
        <div className={cn}>
          <div className="container__sidebar">
            <div className="sidebar">
              <h6 className="sidebar__title">
                <Link to="/">{data.datoCmsSite.globalSeo.siteName}</Link>
              </h6>

              <div className="sidebar__logo">
                <img
                  className="sidebar__logo__img"
                  src={data.datoCmsGlobalInfo.logo.sizes.src}
                />
              </div>

              <h6 className="sidebar__section">
                <FormattedMessage id={"menu"} />
              </h6>
              {this.renderNav(prefix)}

              <p className="sidebar__social">
                {socials.map(s => {
                  let profile = s.split("|");
                  return (
                    <a
                      key={profile[0]}
                      href={profile[1]}
                      target="blank"
                      className={`social social--${profile[0].toLowerCase()}`}
                    />
                  );
                })}
              </p>

              <h6 className="sidebar__section">
                <p className="sidebar__copyright">
                  {data.datoCmsGlobalInfo.copyright}
                </p>
              </h6>

              <div className="sidebar__section">{this.renderLang(locale)}</div>
            </div>
          </div>
          <div className="container__body">
            <div className="container__mobile-header">
              <div className="mobile-header">
                <div className="mobile-header__menu">
                  <a onClick={() => this.toggleSidebar()} />
                </div>
                <div className="mobile-header__logo">
                  <Link to="/" onClick={() => this.toggleSidebar()}>
                    {data.datoCmsSite.globalSeo.siteName}
                  </Link>
                </div>
              </div>
            </div>
            {children()}
          </div>
        </div>
      </IntlProvider>
    );
  }
}

TemplateWrapper.propTypes = {
  children: PropTypes.func
};

export default TemplateWrapper;

export const query = graphql`
  query LayoutQuery {
    datoCmsGlobalInfo {
      copyright
      logo {
        sizes(maxWidth: 250, imgixParams: { fm: "png" }) {
          ...GatsbyDatoCmsSizes
        }
      }
    }
    datoCmsSite {
      globalSeo {
        siteName
      }
      faviconMetaTags {
        ...GatsbyDatoCmsFaviconMetaTags
      }
    }
    allDatoCmsSocialProfile(sort: { fields: [position], order: ASC }) {
      edges {
        node {
          profileType
          url
        }
      }
    }
  }
`;
// const TemplateWrapper = ({ children }) => {
//   const [showMenu, setShowMenu] = useState(false);
//   return (
//     <StaticQuery
//       query={graphql`
//         query LayoutQuery {
//           datoCmsGlobalInfo {
//             copyright
//             logo {
//               sizes(maxWidth: 250, imgixParams: { fm: "png" }) {
//                 ...GatsbyDatoCmsSizes
//               }
//             }
//           }
//           datoCmsSite {
//             globalSeo {
//               siteName
//             }
//             faviconMetaTags {
//               ...GatsbyDatoCmsFaviconMetaTags
//             }
//           }
//           allDatoCmsSocialProfile(sort: { fields: [position], order: ASC }) {
//             edges {
//               node {
//                 profileType
//                 url
//               }
//             }
//           }
//         }
//       `}
//       render={data => (
//         <div className={`container ${showMenu ? "is-open" : ""}`}>
//           <HelmetDatoCms
//             favicon={data.datoCmsSite.faviconMetaTags}
//             seo={data.datoCmsHome.seoMetaTags}
//           />
//           <div className="container__sidebar">
//             <div className="sidebar">
//               <h6 className="sidebar__title">
//                 <Link to="/">{data.datoCmsSite.globalSeo.siteName}</Link>
//               </h6>
//               <div
//                 className="sidebar__intro"
//                 dangerouslySetInnerHTML={{
//                   __html:
//                     data.datoCmsHome.introTextNode.childMarkdownRemark.html
//                 }}
//               />
//               <ul className="sidebar__menu">
//                 <li>
//                   <Link to="/">Home</Link>
//                 </li>
//                 <li>
//                   <Link to="/about">About</Link>
//                 </li>
//               </ul>
//               <p className="sidebar__social">
//                 {data.allDatoCmsSocialProfile.edges.map(({ node: profile }) => (
//                   <a
//                     key={profile.profileType}
//                     href={profile.url}
//                     target="blank"
//                     className={`social social--${profile.profileType.toLowerCase()}`}
//                   >
//                     {" "}
//                   </a>
//                 ))}
//               </p>
//               <div className="sidebar__copyright">
//                 {data.datoCmsHome.copyright}
//               </div>
//             </div>
//           </div>
//           <div className="container__body">
//             <div className="container__mobile-header">
//               <div className="mobile-header">
//                 <div className="mobile-header__menu">
//                   <button
//                     onClick={e => {
//                       e.preventDefault();
//                       setShowMenu(!showMenu);
//                     }}
//                   />
//                 </div>
//                 <div className="mobile-header__logo">
//                   <Link to="/">{data.datoCmsSite.globalSeo.siteName}</Link>
//                 </div>
//               </div>
//             </div>
//             {children}
//           </div>
//         </div>
//       )}
//     />
//   );
// };

// TemplateWrapper.propTypes = {
//   children: PropTypes.object
// };

// export default TemplateWrapper;
/* eslint-enable jsx-a11y/anchor-has-content, jsx-a11y/anchor-is-valid*/
